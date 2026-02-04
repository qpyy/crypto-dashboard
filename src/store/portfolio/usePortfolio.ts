import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Asset, Operation, PortfolioState, PositionSide } from "../../types";
import { useSnackbar } from "../snackbar/snackbar";

const MAX_OPERATIONS = 1000;

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set) => ({
      portfolio: [{ id: "usd", name: "USD", amount: 1_000_000, avgPrice: 1 }],
      operations: [],

      buy: (id, name, price, amount, side) =>
        set((state) => {
          if (price <= 0 || amount <= 0) return state;

          const { showSnackbar } = useSnackbar.getState();
          let nextPortfolio = state.portfolio.map((asset) => ({ ...asset }));
          const usd = nextPortfolio.find((a) => a.id === "usd");

          if (!usd) {
            showSnackbar("Не удалось найти USD баланс", "error");
            return state;
          }

          const operationsToAdd: Operation[] = [];
          const resolvedName = name || id;

          const getAsset = () => nextPortfolio.find((a) => a.id === id);
          const replaceAsset = (asset: Asset | null) => {
            nextPortfolio = nextPortfolio.filter((a) => a.id !== id);
            if (asset) nextPortfolio.push(asset);
          };

          const addOperation = (type: "buy" | "sell", opSide: PositionSide, qty: number) => {
            operationsToAdd.push({
              operationId: uuidv4(),
              id,
              name: resolvedName,
              type,
              side: opSide,
              price,
              amount: qty,
              total: price * qty,
              date: new Date().toISOString(),
            });
          };

          const openLong = (qty: number) => {
            if (qty <= 0) return false;
            const cost = price * qty;
            if (usd.amount < cost) {
              showSnackbar("Недостаточно средств для покупки!", "error");
              return false;
            }
            const existing = getAsset();
            const existingAmount = existing?.amount ?? 0;
            const nextAmount = existingAmount + qty;
            const nextAvgPrice =
              existingAmount > 0
                ? (existing!.avgPrice * existingAmount + price * qty) / nextAmount
                : price;

            usd.amount -= cost;
            replaceAsset({ id, name: resolvedName, amount: nextAmount, avgPrice: nextAvgPrice });
            addOperation("buy", "long", qty);
            showSnackbar(`Вы купили ${qty} ${resolvedName} за $${cost.toFixed(2)}`, "success");
            return true;
          };

          const coverShort = (qty: number) => {
            if (qty <= 0) return 0;
            const existing = getAsset();
            if (!existing || existing.amount >= 0) {
              showSnackbar("Нет короткой позиции для покрытия", "error");
              return 0;
            }

            const shortAmount = Math.abs(existing.amount);
            const coverAmount = Math.min(qty, shortAmount);
            const cost = price * coverAmount;

            usd.amount -= cost;
            const remaining = shortAmount - coverAmount;
            if (remaining > 0) {
              replaceAsset({ ...existing, amount: -remaining });
            } else {
              replaceAsset(null);
            }

            addOperation("buy", "short", coverAmount);
            showSnackbar(
              `Вы покрыли ${coverAmount} ${resolvedName} за $${cost.toFixed(2)}`,
              "success"
            );
            return coverAmount;
          };

          if (side === "long") {
            let remaining = amount;
            const existing = getAsset();
            if (existing && existing.amount < 0) {
              const covered = coverShort(remaining);
              remaining -= covered;
            }
            if (remaining > 0) {
              const opened = openLong(remaining);
              if (!opened && operationsToAdd.length === 0) return state;
            }
          } else {
            const existing = getAsset();
            if (!existing || existing.amount >= 0) {
              showSnackbar("Нет короткой позиции для покрытия", "error");
              return state;
            }
            coverShort(amount);
          }

          if (operationsToAdd.length === 0) return state;

          const nextOperations = [...state.operations, ...operationsToAdd].slice(-MAX_OPERATIONS);

          return {
            portfolio: nextPortfolio,
            operations: nextOperations,
          };
        }),

      sell: (id, name, price, amount, side) =>
        set((state) => {
          if (price <= 0 || amount <= 0) return state;

          const { showSnackbar } = useSnackbar.getState();
          let nextPortfolio = state.portfolio.map((asset) => ({ ...asset }));
          const usd = nextPortfolio.find((a) => a.id === "usd");

          if (!usd) {
            showSnackbar("Не удалось найти USD баланс", "error");
            return state;
          }

          const operationsToAdd: Operation[] = [];
          const resolvedName = name || id;

          const getAsset = () => nextPortfolio.find((a) => a.id === id);
          const replaceAsset = (asset: Asset | null) => {
            nextPortfolio = nextPortfolio.filter((a) => a.id !== id);
            if (asset) nextPortfolio.push(asset);
          };

          const addOperation = (type: "buy" | "sell", opSide: PositionSide, qty: number) => {
            operationsToAdd.push({
              operationId: uuidv4(),
              id,
              name: resolvedName,
              type,
              side: opSide,
              price,
              amount: qty,
              total: price * qty,
              date: new Date().toISOString(),
            });
          };

          const closeLong = (qty: number) => {
            if (qty <= 0) return 0;
            const existing = getAsset();
            if (!existing || existing.amount <= 0) {
              showSnackbar("Нет длинной позиции для продажи", "error");
              return 0;
            }

            const sellAmount = Math.min(qty, existing.amount);
            const income = price * sellAmount;
            const remaining = existing.amount - sellAmount;

            usd.amount += income;
            if (remaining > 0) {
              replaceAsset({ ...existing, amount: remaining });
            } else {
              replaceAsset(null);
            }

            addOperation("sell", "long", sellAmount);
            showSnackbar(
              `Вы продали ${sellAmount} ${resolvedName} за $${income.toFixed(2)}`,
              "info"
            );
            return sellAmount;
          };

          const openShort = (qty: number) => {
            if (qty <= 0) return false;
            const existing = getAsset();
            const currentShort = existing && existing.amount < 0 ? Math.abs(existing.amount) : 0;
            const nextShort = currentShort + qty;
            const nextAvgPrice =
              currentShort > 0
                ? (existing!.avgPrice * currentShort + price * qty) / nextShort
                : price;

            usd.amount += price * qty;
            replaceAsset({ id, name: resolvedName, amount: -nextShort, avgPrice: nextAvgPrice });
            addOperation("sell", "short", qty);
            showSnackbar(
              `Вы открыли шорт ${qty} ${resolvedName} по $${price.toFixed(2)}`,
              "info"
            );
            return true;
          };

          if (side === "long") {
            const existing = getAsset();
            if (!existing || existing.amount <= 0) {
              showSnackbar("Нет длинной позиции для продажи", "error");
              return state;
            }
            closeLong(amount);
          } else {
            let remaining = amount;
            const existing = getAsset();
            if (existing && existing.amount > 0) {
              const closed = closeLong(remaining);
              remaining -= closed;
            }
            if (remaining > 0) {
              openShort(remaining);
            }
          }

          if (operationsToAdd.length === 0) return state;

          const nextOperations = [...state.operations, ...operationsToAdd].slice(-MAX_OPERATIONS);

          return {
            portfolio: nextPortfolio,
            operations: nextOperations,
          };
        }),

      reset: () =>
        set({
          portfolio: [{ id: "usd", name: "USD", amount: 1_000_000, avgPrice: 1 }],
          operations: [],
        }),
    }),
    {
      name: "portfolio-storage",
      version: 2,
      migrate: (state) => {
        if (!state) return state;
        const typedState = state as PortfolioState;
        const operations = typedState.operations?.map((op) => ({
          ...op,
          operationId: op.operationId ?? uuidv4(),
          side: (op as Operation).side ?? "long",
        }));
        return { ...typedState, operations };
      },
    }
  )
);
