import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Asset, Operation, PortfolioState } from "../../types";
import { useSnackbar } from "../snackbar/snackbar";

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set) => ({
      portfolio: [{ id: "usd", name: "USD", amount: 1_000_000, avgPrice: 1 }],
      operations: [],

      buy: (id, name, price, amount) =>
        set((state) => {
          const cost = price * amount;
          const usd = state.portfolio.find((a) => a.id === "usd");

          if (!usd || usd.amount < cost) {
            const { showSnackbar } = useSnackbar.getState();
            showSnackbar("Недостаточно средств для покупки!", "error");

            return state;
          }

          const newUsdAmount = usd.amount - cost;

          const existing = state.portfolio.find((a) => a.id === id);
          const updatedAsset: Asset = existing
            ? {
                ...existing,
                amount: existing.amount + amount,
                avgPrice:
                  (existing.avgPrice * existing.amount + price * amount) /
                  (existing.amount + amount),
              }
            : { id, name, amount, avgPrice: price };

          const newPortfolio = [
            ...state.portfolio.filter((a) => a.id !== id && a.id !== "usd"),
            updatedAsset,
            { ...usd, amount: newUsdAmount },
          ];

          const operation: Operation = {
            id,
            name,
            type: "buy",
            price,
            amount,
            total: cost,
            date: new Date().toISOString(),
          };

          const { showSnackbar } = useSnackbar.getState();
          showSnackbar(`Вы купили ${amount} ${name} за $${cost.toFixed(2)}`, "success");

          return {
            portfolio: newPortfolio,
            operations: [...state.operations, operation],
          };
        }),

      sell: (id, price, amount) =>
        set((state) => {
          const existing = state.portfolio.find((a) => a.id === id);

          if (!existing) {
            const { showSnackbar } = useSnackbar.getState();
            showSnackbar("Невозможно продать: актив не найден", "error");

            return state;
          }

          const sellAmount = Math.min(amount, existing.amount);
          if (sellAmount <= 0) return state;

          const income = (price || 0) * sellAmount;
          const newAmount = existing.amount - sellAmount;

          const usd = state.portfolio.find((a) => a.id === "usd");
          const newUsdAmount = (usd?.amount || 0) + income;

          const updatedAsset: Asset | null =
            newAmount > 0 ? { ...existing, amount: newAmount } : null;

          const newPortfolio = [
            ...state.portfolio.filter((a) => a.id !== id && a.id !== "usd"),
            ...(updatedAsset ? [updatedAsset] : []),
            { ...usd!, amount: newUsdAmount },
          ];

          const operation: Operation = {
            id,
            name: existing.name,
            type: "sell",
            price,
            amount: sellAmount,
            total: income,
            date: new Date().toISOString(),
          };

          const { showSnackbar } = useSnackbar.getState();

          showSnackbar(
            `Вы продали ${sellAmount} ${existing.name} за $${income.toFixed(2)}`,
            "info"
          );

          return {
            portfolio: newPortfolio,
            operations: [...state.operations, operation],
          };
        }),

      reset: () =>
        set({
          portfolio: [{ id: "usd", name: "USD", amount: 1_000_000, avgPrice: 1 }],
          operations: [],
        }),
    }),
    { name: "portfolio-storage" }
  )
);
