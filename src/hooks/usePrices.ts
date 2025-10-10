import { useQuery } from "@tanstack/react-query";
import { fetchPrices } from "../api/prices";
import type { PricesResponse } from "../types";
import { useSnackbar } from "../store/snackbar/snackbar";

export const usePrices = () => {
  const { showSnackbar } = useSnackbar();

  const query = useQuery<PricesResponse>({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  if (query.isError) {
    const message =
      query.error instanceof Error ? query.error.message : "Ошибка при загрузке данных";
    showSnackbar(message, "error");
  }

  return query;
};
