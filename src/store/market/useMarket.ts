import { create } from "zustand";
import type { MarketState } from "../../types";

export const useMarket = create<MarketState>((set) => ({
  prices: { usd: 1 },
  selectedAsset: "bitcoin",

  setPrice: (id, price) =>
    set((state) => ({
      prices: { ...state.prices, [id]: price },
    })),

  setPrices: (prices) =>
    set((state) => ({
      prices: { ...state.prices, ...prices },
    })),

  setSelectedAsset: (id) => set({ selectedAsset: id }),
}));

export const selectPrice = (id: string) => (state: MarketState) => state.prices[id] ?? 0;
export const selectPrices = (state: MarketState) => state.prices;
export const selectSelectedAsset = (state: MarketState) => state.selectedAsset;
