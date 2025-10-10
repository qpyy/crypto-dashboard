import type { Operation } from "../types";

export interface Filters {
  asset: string;
  type: "buy" | "sell" | "";
  dateFrom: string;
  dateTo: string;
}

const toStartOfDay = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);

const toEndOfDay = (dateStr: string) => new Date(dateStr).setHours(23, 59, 59, 999);

export const filterOperations = (operations: Operation[], filters: Filters) => {
  const fromTimestamp = filters.dateFrom ? toStartOfDay(filters.dateFrom) : null;
  const toTimestamp = filters.dateTo ? toEndOfDay(filters.dateTo) : null;
  const assetFilter = filters.asset.toLowerCase();
  const typeFilter = filters.type;

  return operations.filter((op) => {
    const opName = op.name.toLowerCase();
    const opTime = new Date(op.date).getTime();

    const matchAsset = assetFilter ? opName.includes(assetFilter) : true;
    const matchType = typeFilter ? op.type === typeFilter : true;
    const matchDateFrom = fromTimestamp !== null ? opTime >= fromTimestamp : true;
    const matchDateTo = toTimestamp !== null ? opTime <= toTimestamp : true;

    return matchAsset && matchType && matchDateFrom && matchDateTo;
  });
};
