import { lazy, Suspense } from "react";
import { useMarket, selectSelectedAsset } from "../../../store/market/useMarket";
import { useChart } from "../../../hooks/useChart";
import styles from "./PriceChart.module.css";

const ReusableLineChart = lazy(
  () => import("../../../components/UI/ReusableLineChart/ReusableLineChart")
);

export default function PriceChart() {
  const selectedAsset = useMarket(selectSelectedAsset);
  const { data } = useChart(selectedAsset, 1);

  return (
    <Suspense fallback={<div className={styles.skeleton} />}>
      <ReusableLineChart
        data={data}
        dataKey="price"
        title={`График цены ${selectedAsset.toUpperCase()}`}
        height={300}
      />
    </Suspense>
  );
}
