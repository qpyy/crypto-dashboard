import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { fetchPrices } from "../api/prices";
import { useSnackbar } from "../store/snackbar/snackbar";
import type { PricesResponse } from "../types";

export const usePrices = () => {
  const { showSnackbar } = useSnackbar();
  const lastErrorRef = useRef<string | null>(null);

  const query = useQuery<PricesResponse>({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!query.isError) {
      lastErrorRef.current = null;
      return;
    }
    const message =
      query.error instanceof Error ? query.error.message : "Ошибка при загрузке данных";
    if (lastErrorRef.current === message) return;
    lastErrorRef.current = message;
    showSnackbar(message, "error");
  }, [query.isError, query.error, showSnackbar]);

  return query;
};
