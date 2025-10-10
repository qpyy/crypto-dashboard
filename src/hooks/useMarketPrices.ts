import { useEffect } from "react";
import { useMarket } from "../store/market/useMarket";
import { usePrices } from "./usePrices";
import type { PricesResponse } from "../types";

export const useMarketPrices = () => {
  const setPrice = useMarket((s) => s.setPrice);
  const { data } = usePrices();

  useEffect(() => {
    if (!data) return;

    for (const [id, { usd }] of Object.entries(data as PricesResponse)) {
      setPrice(id, usd);
    }
    setPrice("usd", 1);
  }, [data, setPrice]);

  return data;
};
