export type AssetDistribution = {
  id: string;
  name: string;
  value: number;
  profit: number;
  amount: number;
  avgPrice: number;
  icon?: string;
};

export type Statistics = {
  totalSpent: number;
  totalEarned: number;
  balance: number;
  realizedProfit: number;
  unrealizedProfit: number;
  netProfit: number;
  operationsCount: number;
  assetDistribution: AssetDistribution[];
};
