import type { Asset, Operation } from "../../types";
import { buildEvent, buildOperation } from "./builders";
import type {
  TradeCommand,
  TradingDeps,
  TradingErrorCode,
  TradingEvent,
  TradingResult,
  TradingState,
} from "./types";
import { calculateWeightedAverage, clonePortfolio, findAsset, replaceAsset } from "./utils";

const createUnchangedResult = (
  state: Readonly<TradingState>,
  error?: TradingErrorCode,
): TradingResult => ({
  changed: false,
  state: {
    portfolio: state.portfolio,
    operations: state.operations,
  },
  events: [],
  error,
});

export const applyTrade = (
  state: Readonly<TradingState>,
  command: TradeCommand,
  deps: TradingDeps,
): TradingResult => {
  if (command.price <= 0 || command.amount <= 0) {
    return createUnchangedResult(state, "INVALID_INPUT");
  }

  let nextPortfolio = clonePortfolio(state.portfolio);
  const operationsToAdd: Operation[] = [];
  const events: TradingEvent[] = [];
  let firstError: TradingErrorCode | undefined;

  const usd = findAsset(nextPortfolio, deps.usdAssetId);

  if (!usd) {
    return createUnchangedResult(state, "USD_ASSET_MISSING");
  }

  const getAsset = () => findAsset(nextPortfolio, command.assetId);

  const setAsset = (asset: Asset | null) => {
    nextPortfolio = replaceAsset(nextPortfolio, command.assetId, asset);
  };

  const addOperation = (
    action: TradeCommand["action"],
    side: TradeCommand["side"],
    amount: number,
  ) => {
    operationsToAdd.push(
      buildOperation(
        {
          assetId: command.assetId,
          assetName: command.assetName,
          action,
          side,
          price: command.price,
          amount,
        },
        deps,
      ),
    );
  };

  const addEvent = (code: TradingEvent["code"], side: TradeCommand["side"], amount: number) => {
    events.push(
      buildEvent({
        code,
        assetId: command.assetId,
        assetName: command.assetName,
        side,
        price: command.price,
        amount,
      }),
    );
  };

  const coverShort = (amount: number) => {
    if (amount <= 0) return 0;

    const existing = getAsset();

    if (!existing || existing.amount >= 0) {
      firstError ??= "NO_SHORT_POSITION_TO_COVER";
      return 0;
    }

    const shortAmount = Math.abs(existing.amount);
    const coverAmount = Math.min(amount, shortAmount);
    const cost = command.price * coverAmount;

    usd.amount -= cost;

    const remaining = shortAmount - coverAmount;
    if (remaining > 0) {
      setAsset({ ...existing, amount: -remaining });
    } else {
      setAsset(null);
    }

    addOperation("buy", "short", coverAmount);
    addEvent("SHORT_COVERED", "short", coverAmount);

    return coverAmount;
  };

  const openLong = (amount: number) => {
    if (amount <= 0) return false;

    const cost = command.price * amount;
    if (usd.amount < cost) {
      firstError ??= "INSUFFICIENT_FUNDS";
      return false;
    }

    const existing = getAsset();
    const existingAmount = existing?.amount ?? 0;
    const nextAmount = existingAmount + amount;
    const nextAvgPrice =
      existingAmount > 0
        ? calculateWeightedAverage(existingAmount, existing!.avgPrice, amount, command.price)
        : command.price;

    usd.amount -= cost;

    setAsset({
      id: command.assetId,
      name: command.assetName,
      amount: nextAmount,
      avgPrice: nextAvgPrice,
    });

    addOperation("buy", "long", amount);
    addEvent("LONG_OPENED", "long", amount);

    return true;
  };

  const closeLong = (amount: number) => {
    if (amount <= 0) return 0;

    const existing = getAsset();

    if (!existing || existing.amount <= 0) {
      firstError ??= "NO_LONG_POSITION_TO_SELL";
      return 0;
    }

    const sellAmount = Math.min(amount, existing.amount);
    const income = command.price * sellAmount;
    const remaining = existing.amount - sellAmount;

    usd.amount += income;

    if (remaining > 0) {
      setAsset({ ...existing, amount: remaining });
    } else {
      setAsset(null);
    }

    addOperation("sell", "long", sellAmount);
    addEvent("LONG_CLOSED", "long", sellAmount);

    return sellAmount;
  };

  const openShort = (amount: number) => {
    if (amount <= 0) return false;

    const existing = getAsset();
    const currentShort = existing && existing.amount < 0 ? Math.abs(existing.amount) : 0;
    const nextShort = currentShort + amount;
    const nextAvgPrice =
      currentShort > 0
        ? calculateWeightedAverage(currentShort, existing!.avgPrice, amount, command.price)
        : command.price;

    usd.amount += command.price * amount;

    setAsset({
      id: command.assetId,
      name: command.assetName,
      amount: -nextShort,
      avgPrice: nextAvgPrice,
    });

    addOperation("sell", "short", amount);
    addEvent("SHORT_OPENED", "short", amount);

    return true;
  };

  if (command.action === "buy") {
    if (command.side === "long") {
      let remaining = command.amount;
      const existing = getAsset();

      if (existing && existing.amount < 0) {
        const covered = coverShort(remaining);
        remaining -= covered;
      }

      if (remaining > 0) {
        openLong(remaining);
      }
    } else {
      const existing = getAsset();

      if (!existing || existing.amount >= 0) {
        firstError ??= "NO_SHORT_POSITION_TO_COVER";
      } else {
        coverShort(command.amount);
      }
    }
  } else if (command.side === "long") {
    const existing = getAsset();

    if (!existing || existing.amount <= 0) {
      firstError ??= "NO_LONG_POSITION_TO_SELL";
    } else {
      closeLong(command.amount);
    }
  } else {
    let remaining = command.amount;
    const existing = getAsset();

    if (existing && existing.amount > 0) {
      const closed = closeLong(remaining);
      remaining -= closed;
    }

    if (remaining > 0) {
      openShort(remaining);
    }
  }

  if (operationsToAdd.length === 0) {
    return createUnchangedResult(state, firstError);
  }

  const nextOperations = [...state.operations, ...operationsToAdd].slice(-deps.maxOperations);

  return {
    changed: true,
    state: {
      portfolio: nextPortfolio,
      operations: nextOperations,
    },
    events,
    error: firstError,
  };
};
