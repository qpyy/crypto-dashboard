export type Asset = {
  id: string;
  name: string;
  amount: number;
  avgPrice: number;
};

export type Operation = {
  operationId: string;
  id: string;
  name: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  total: number;
  date: string;
};

export type PortfolioState = {
  portfolio: Asset[];
  operations: Operation[];
  buy: (id: string, name: string, price: number, amount: number) => void;
  sell: (id: string, price: number, amount: number) => void;
  reset: () => void;
};
