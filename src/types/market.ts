export type MarketState = {
  prices: Record<string, number>;
  selectedAsset: string;
  setPrice: (id: string, price: number) => void;
  setSelectedAsset: (id: string) => void;
};
