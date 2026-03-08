import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { INITIAL_USD_BALANCE, USD_ASSET_ID } from "../../constants/portfolio";
import { applyTrade, type TradeAction, type TradingErrorCode, type TradingEvent } from "../../domain/trading";
import type { Operation, PortfolioState, PositionSide } from "../../types";
import type { SnackbarType } from "../../types/snackbar";
import { useSnackbar } from "../snackbar/snackbar";

const MAX_OPERATIONS = 1000;

type TradeInput = {
  action: TradeAction;
  id: string;
  name: string;
  price: number;
  amount: number;
  side: PositionSide;
};

const getErrorMessage = (error: TradingErrorCode | undefined): string | null => {
  switch (error) {
    case "USD_ASSET_MISSING":
      return "Не удалось найти USD баланс";
    case "INSUFFICIENT_FUNDS":
      return "Недостаточно средств для покупки!";
    case "NO_SHORT_POSITION_TO_COVER":
      return "Нет короткой позиции для покрытия";
    case "NO_LONG_POSITION_TO_SELL":
      return "Нет длинной позиции для продажи";
    default:
      return null;
  }
};

const getEventToast = (event: TradingEvent): { message: string; type: SnackbarType } => {
  switch (event.code) {
    case "LONG_OPENED":
      return {
        message: `Вы купили ${event.amount} ${event.assetName} за $${event.total.toFixed(2)}`,
        type: "success",
      };
    case "SHORT_COVERED":
      return {
        message: `Вы покрыли ${event.amount} ${event.assetName} за $${event.total.toFixed(2)}`,
        type: "success",
      };
    case "LONG_CLOSED":
      return {
        message: `Вы продали ${event.amount} ${event.assetName} за $${event.total.toFixed(2)}`,
        type: "info",
      };
    case "SHORT_OPENED":
      return {
        message: `Вы открыли шорт ${event.amount} ${event.assetName} по $${event.price.toFixed(2)}`,
        type: "info",
      };
    default:
      return {
        message: "Операция выполнена",
        type: "info",
      };
  }
};

const buildTradeInput = (
  action: TradeAction,
  id: string,
  name: string,
  price: number,
  amount: number,
  side: PositionSide
): TradeInput => ({
  action,
  id,
  name: name || id,
  price,
  amount,
  side,
});

const applyPortfolioTrade = (
  state: PortfolioState,
  input: TradeInput
): Pick<PortfolioState, "portfolio" | "operations"> | PortfolioState => {
  const result = applyTrade(
    {
      portfolio: state.portfolio,
      operations: state.operations,
    },
    {
      action: input.action,
      assetId: input.id,
      assetName: input.name,
      price: input.price,
      amount: input.amount,
      side: input.side,
    },
    {
      createOperationId: uuidv4,
      createTimestamp: () => new Date().toISOString(),
      maxOperations: MAX_OPERATIONS,
      usdAssetId: USD_ASSET_ID,
    }
  );

  const { showSnackbar } = useSnackbar.getState();

  for (const event of result.events) {
    const toast = getEventToast(event);
    showSnackbar(toast.message, toast.type);
  }

  const errorMessage = getErrorMessage(result.error);
  if (errorMessage) {
    showSnackbar(errorMessage, "error");
  }

  if (!result.changed) {
    return state;
  }

  return {
    portfolio: result.state.portfolio,
    operations: result.state.operations,
  };
};

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set) => ({
      profileId: uuidv4(),
      portfolio: [{ id: USD_ASSET_ID, name: "USD", amount: INITIAL_USD_BALANCE, avgPrice: 1 }],
      operations: [],

      buy: (id, name, price, amount, side) =>
        set((state) => applyPortfolioTrade(state, buildTradeInput("buy", id, name, price, amount, side))),

      sell: (id, name, price, amount, side) =>
        set((state) => applyPortfolioTrade(state, buildTradeInput("sell", id, name, price, amount, side))),

      reset: () =>
        set((state) => ({
          profileId: state.profileId,
          portfolio: [{ id: USD_ASSET_ID, name: "USD", amount: INITIAL_USD_BALANCE, avgPrice: 1 }],
          operations: [],
        })),
    }),
    {
      name: "portfolio-storage",
      version: 3,
      migrate: (state) => {
        if (!state) return state;
        const typedState = state as Partial<PortfolioState>;
        const operations = typedState.operations?.map((op) => ({
          ...op,
          operationId: op.operationId ?? uuidv4(),
          side: (op as Operation).side ?? "long",
        }));
        return {
          ...typedState,
          profileId: typedState.profileId ?? uuidv4(),
          operations,
        };
      },
    }
  )
);
