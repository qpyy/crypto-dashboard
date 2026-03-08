import type { Asset, Operation, PositionSide } from "../../types";

export type TradeAction = "buy" | "sell";

export type TradeCommand = {
  action: TradeAction;
  assetId: string;
  assetName: string;
  side: PositionSide;
  price: number;
  amount: number;
};

export type TradingState = {
  portfolio: Asset[];
  operations: Operation[];
};

export type TradingErrorCode =
  | "INVALID_INPUT"
  | "USD_ASSET_MISSING"
  | "INSUFFICIENT_FUNDS"
  | "NO_SHORT_POSITION_TO_COVER"
  | "NO_LONG_POSITION_TO_SELL";

export type TradingEventCode = "LONG_OPENED" | "SHORT_COVERED" | "LONG_CLOSED" | "SHORT_OPENED";

export type TradingEvent = {
  code: TradingEventCode;
  assetId: string;
  assetName: string;
  side: PositionSide;
  price: number;
  amount: number;
  total: number;
};

export type TradingDeps = {
  createOperationId: () => string;
  createTimestamp: () => string;
  maxOperations: number;
  usdAssetId: string;
};

export type TradingResult = {
  changed: boolean;
  state: TradingState;
  events: TradingEvent[];
  error?: TradingErrorCode;
};
