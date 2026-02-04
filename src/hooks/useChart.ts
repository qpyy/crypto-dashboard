import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchChart } from "../api/prices";
import type { ChartPoint } from "../types";
import { useSnackbar } from "../store/snackbar/snackbar";

export const useChart = (id: string, days = 1) => {
  const { showSnackbar } = useSnackbar();
  const lastErrorRef = useRef<string | null>(null);

  const query = useQuery<ChartPoint[]>({
    queryKey: ["chart", id, days],
    queryFn: () => fetchChart(id, days),
    staleTime: 60_000,
    refetchInterval: false,
    retry: 1,
  });

  useEffect(() => {
    if (!query.isError) {
      lastErrorRef.current = null;
      return;
    }
    const message =
      query.error instanceof Error ? query.error.message : "Ошибка при загрузке графика";
    if (lastErrorRef.current === message) return;
    lastErrorRef.current = message;
    showSnackbar(message, "error");
  }, [query.isError, query.error, showSnackbar]);

  return query;
};
