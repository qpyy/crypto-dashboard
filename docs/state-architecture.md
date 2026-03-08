# State and Trading Architecture

This document explains how `usePortfolio`, `useMarket`, `useStatistics`, and `src/domain/trading` work together.

## Layered Design

The project separates responsibilities into four layers:

1. UI layer (`src/pages`, `src/components`)
2. Store layer (`src/store`)
3. Domain layer (`src/domain/trading`)
4. Data layer (`src/api`, `src/hooks` with React Query)

High-level data flow:

1. React Query fetches prices and chart data from API.
2. `useMarketPrices` writes latest prices to `useMarket`.
3. UI reads selected asset + prices from `useMarket`.
4. UI sends trade commands to `usePortfolio`.
5. `usePortfolio` calls domain function `applyTrade`.
6. Domain returns a pure `TradingResult` (next state + events + optional error).
7. Store maps domain events/errors to snackbar notifications and persists new state.
8. `useStatistics` derives portfolio metrics from `usePortfolio` + `useMarket`.

## `useMarket` (Market State)

Location: `src/store/market/useMarket.ts`

Responsibilities:

- Keep current asset prices (`prices` map).
- Keep currently selected asset (`selectedAsset`).
- Expose small mutation methods:
  - `setPrice`
  - `setPrices`
  - `setSelectedAsset`
- Expose selectors for granular subscriptions:
  - `selectPrice(id)`
  - `selectPrices`
  - `selectSelectedAsset`

`useMarket` intentionally has no trading/business rules. It is a thin state container for market context.

## `usePortfolio` (Portfolio State + Command Handler)

Location: `src/store/portfolio/usePortfolio.ts`

Responsibilities:

- Persist player state in local storage (`zustand/persist`):
  - `profileId`
  - `portfolio`
  - `operations`
- Expose command methods:
  - `buy`
  - `sell`
  - `reset`
- Delegate trade computation to domain (`applyTrade`) instead of calculating in store.
- Translate domain events/errors into user-facing snackbar messages.
- Keep storage migration logic (`version`, `migrate`) for backward compatibility.

Important boundary:

- Store owns side effects (snackbar, persistence).
- Domain owns deterministic trade calculation.

## Domain Trading Engine (`src/domain/trading`)

Core file: `src/domain/trading/applyTrade.ts`

Supporting files:

- `types.ts`: command/result/error/event contracts
- `utils.ts`: pure helpers (clone/find/replace/weighted average)
- `builders.ts`: operation/event factories

Public contract:

`applyTrade(state, command, deps) -> TradingResult`

Where:

- `state`: `{ portfolio, operations }`
- `command`: `{ action, assetId, assetName, side, price, amount }`
- `deps`: external dependencies (`id`, `timestamp`, limits, `usdAssetId`)

Why this is good:

- Deterministic and testable business logic.
- No direct UI/store coupling.
- Easy future move to backend (same command/result contract).

### Engine behavior summary

- Validates inputs (`price`, `amount`, finite and > 0).
- Ensures USD asset exists.
- Supports long and short flows:
  - `buy long`: can cover existing short first, then open/increase long.
  - `sell long`: closes long position.
  - `sell short`: can close existing long first, then open/increase short.
  - `buy short`: covers short position.
- Emits:
  - operations (for history)
  - events (for UI notifications)
  - optional domain error code
- Limits operation history using `maxOperations`.

## `useStatistics` (Derived Read Model)

Location: `src/store/statistics/useStatistics.ts`

Responsibilities:

- Read:
  - operations + portfolio from `usePortfolio`
  - prices from `useMarket`
- Compute derived metrics via `useMemo`:
  - `totalSpent`
  - `totalEarned`
  - `balance`
  - `assetDistribution`
  - `realizedProfit`
  - `unrealizedProfit`
  - `netProfit`
  - `operationsCount`

This hook does not mutate state. It acts as a read model projection for UI pages.

## Data Layer Integration

Main hooks:

- `usePrices` -> fetches market prices via React Query.
- `useMarketPrices` -> maps API response and updates `useMarket`.
- `useChart` -> fetches chart points for selected asset.

Entry point:

- `App.tsx` calls `useMarketPrices()` once at app level to keep market store synchronized with remote prices.

## Architectural Invariants

- Trading rules are centralized in domain code.
- Stores orchestrate side effects and persistence, not business math.
- UI calls store commands and renders projections.
- Statistics are computed from source state, not duplicated.

## Backend Migration Readiness

Current structure is backend-friendly:

- `TradeCommand` and `TradingResult` can become API contracts.
- `applyTrade` can be reused server-side with minimal changes.
- Frontend store can switch from local mutation to API-driven mutation while preserving UI contracts.
