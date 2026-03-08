import type { Asset } from "../../types";

export const clonePortfolio = (portfolio: Asset[]): Asset[] =>
  portfolio.map((asset) => ({ ...asset }));

export const findAsset = (portfolio: Asset[], id: string): Asset | undefined =>
  portfolio.find((asset) => asset.id === id);

export const replaceAsset = (portfolio: Asset[], id: string, nextAsset: Asset | null): Asset[] => {
  const nextPortfolio = portfolio.filter((asset) => asset.id !== id);

  if (nextAsset) {
    nextPortfolio.push(nextAsset);
  }

  return nextPortfolio;
};

export const calculateWeightedAverage = (
  currentAmount: number,
  currentAvgPrice: number,
  addedAmount: number,
  price: number
): number => {
  const totalAmount = currentAmount + addedAmount;

  if (totalAmount <= 0) {
    return price;
  }

  return (currentAvgPrice * currentAmount + price * addedAmount) / totalAmount;
};
