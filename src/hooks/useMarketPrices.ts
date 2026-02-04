import { useEffect } from "react";
import { useMarket } from "../store/market/useMarket";
import { usePrices } from "./usePrices";
import type { PricesResponse } from "../types";

export const useMarketPrices = () => {
  const setPrices = useMarket((s) => s.setPrices);
  const { data } = usePrices();

  useEffect(() => {
    if (!data) return;

    const nextPrices = Object.fromEntries(
      Object.entries(data as PricesResponse).map(([id, { usd }]) => [id, usd])
    );

    setPrices({ ...nextPrices, usd: 1 });
  }, [data, setPrices]);

  return data;
};
