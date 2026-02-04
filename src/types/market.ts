export type MarketState = {
  prices: Record<string, number>;
  selectedAsset: string;
  setPrice: (id: string, price: number) => void;
  setPrices: (prices: Record<string, number>) => void;
  setSelectedAsset: (id: string) => void;
};
