import { useMemo } from "react";
import { usePortfolio } from "../portfolio/usePortfolio";
import { useMarket, selectPrices } from "../market/useMarket";
import type { AssetDistribution, Statistics } from "../../types";

export const useStatistics = (): Statistics => {
  const operations = usePortfolio((s) => s.operations);
  const portfolio = usePortfolio((s) => s.portfolio);
  const prices = useMarket(selectPrices);

  return useMemo(() => {
    let totalSpent = 0;
    let totalEarned = 0;

    for (const op of operations) {
      if (op.type === "buy") totalSpent += op.total;
      if (op.type === "sell") totalEarned += op.total;
    }

    const usdBalance = portfolio.find((a) => a.id === "usd")?.amount || 0;

    const allAssets: AssetDistribution[] = portfolio
      .filter((a) => a.id !== "usd")
      .map((asset) => {
        const currentPrice = prices[asset.id] || 0;
        const value = asset.amount * currentPrice;
        const profit = value - asset.amount * asset.avgPrice;

        return {
          id: asset.id,
          name: asset.name,
          value,
          profit,
          amount: asset.amount,
          avgPrice: asset.avgPrice,
        };
      });

    const unrealizedProfit = allAssets.reduce((sum, a) => sum + a.profit, 0);
    const realizedProfit = totalEarned - totalSpent;
    const netProfit = realizedProfit + unrealizedProfit;

    return {
      totalSpent,
      totalEarned,
      balance: usdBalance,
      realizedProfit,
      unrealizedProfit,
      netProfit,
      operationsCount: operations.length,
      assetDistribution: allAssets,
    };
  }, [operations, portfolio, prices]);
};
