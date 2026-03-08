# Trading Engine

## Goal

Move all trade calculations from Zustand store into pure domain functions.

## Location

- `src/domain/trading/types.ts`
- `src/domain/trading/utils.ts`
- `src/domain/trading/builders.ts`
- `src/domain/trading/applyTrade.ts`

## Public Contract

`applyTrade(state, command, deps) -> TradingResult`

- `state`:
  - `portfolio`
  - `operations`
- `command`:
  - `action`: `buy | sell`
  - `assetId`
  - `assetName`
  - `side`: `long | short`
  - `price`
  - `amount`
- `deps`:
  - `createOperationId`
  - `createTimestamp`
  - `maxOperations`
  - `usdAssetId`

## Invariants

- `price > 0`
- `amount > 0`
- `usd` asset must exist in portfolio

## Errors

- `INVALID_INPUT`
- `USD_ASSET_MISSING`
- `INSUFFICIENT_FUNDS`
- `NO_SHORT_POSITION_TO_COVER`
- `NO_LONG_POSITION_TO_SELL`

## Events

- `LONG_OPENED`
- `SHORT_COVERED`
- `LONG_CLOSED`
- `SHORT_OPENED`

Store layer is responsible for mapping events/errors to UI notifications.
