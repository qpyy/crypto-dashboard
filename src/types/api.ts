export type PricesResponse = Record<string, { usd: number }>;

export type ChartPoint = {
  time: string;
  price: number;
};
