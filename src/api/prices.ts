import axios from "./axios";
import type { PricesResponse, ChartPoint } from "../types";
import { ASSETS } from "../constants/assets";

export const fetchPrices = async (): Promise<PricesResponse> => {
  const { data } = await axios.get("/simple/price", {
    params: { ids: ASSETS.join(","), vs_currencies: "usd" },
  });

  return data;
};

export const fetchChart = async (id: string, days = 1): Promise<ChartPoint[]> => {
  const { data } = await axios.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days },
  });

  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleTimeString(),
    price,
  }));
};
