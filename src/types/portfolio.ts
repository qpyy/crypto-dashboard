export type Asset = {
  id: string;
  name: string;
  amount: number;
  avgPrice: number;
};

export type PositionSide = "long" | "short";

export type Operation = {
  operationId: string;
  id: string;
  name: string;
  type: "buy" | "sell";
  side: PositionSide;
  price: number;
  amount: number;
  total: number;
  date: string;
};

export type PortfolioState = {
  portfolio: Asset[];
  operations: Operation[];
  buy: (id: string, name: string, price: number, amount: number, side: PositionSide) => void;
  sell: (id: string, name: string, price: number, amount: number, side: PositionSide) => void;
  reset: () => void;
};
