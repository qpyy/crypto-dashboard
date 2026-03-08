import { useMemo } from "react";

import { INITIAL_USD_BALANCE, USD_ASSET_ID } from "../../constants/portfolio";
import type { AssetDistribution, Statistics } from "../../types";
import { selectPrices, useMarket } from "../market/useMarket";
import { usePortfolio } from "../portfolio/usePortfolio";

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

    const usdBalance = portfolio.find((a) => a.id === USD_ASSET_ID)?.amount ?? INITIAL_USD_BALANCE;

    const assetDistribution: AssetDistribution[] = portfolio
      .filter((a) => a.id !== USD_ASSET_ID)
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

    const assetsMarketValue = assetDistribution.reduce((sum, asset) => sum + asset.value, 0);
    const equity = usdBalance + assetsMarketValue;
    const netProfit = equity - INITIAL_USD_BALANCE;
    const unrealizedProfit = assetDistribution.reduce((sum, asset) => sum + asset.profit, 0);
    const realizedProfit = netProfit - unrealizedProfit;

    return {
      totalSpent,
      totalEarned,
      balance: usdBalance,
      realizedProfit,
      unrealizedProfit,
      netProfit,
      operationsCount: operations.length,
      assetDistribution,
    };
  }, [operations, portfolio, prices]);
};
