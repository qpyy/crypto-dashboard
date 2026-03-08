import type { PositionSide } from "../../types";
import type { TradeAction } from "./types";
import type { TradingDeps, TradingEvent, TradingEventCode } from "./types";

type OperationInput = {
  assetId: string;
  assetName: string;
  action: TradeAction;
  side: PositionSide;
  price: number;
  amount: number;
};

type EventInput = {
  code: TradingEventCode;
  assetId: string;
  assetName: string;
  side: PositionSide;
  price: number;
  amount: number;
};

export const buildOperation = (input: OperationInput, deps: TradingDeps) => ({
  operationId: deps.createOperationId(),
  id: input.assetId,
  name: input.assetName,
  type: input.action,
  side: input.side,
  price: input.price,
  amount: input.amount,
  total: input.price * input.amount,
  date: deps.createTimestamp(),
});

export const buildEvent = (input: EventInput): TradingEvent => ({
  code: input.code,
  assetId: input.assetId,
  assetName: input.assetName,
  side: input.side,
  price: input.price,
  amount: input.amount,
  total: input.price * input.amount,
});
