import { useMarket, selectSelectedAsset } from "../../../store/market/useMarket";
import ReusableLineChart from "../../../components/UI/ReusableLineChart/ReusableLineChart";
import { useChart } from "../../../hooks/useChart";

export default function PriceChart() {
  const selectedAsset = useMarket(selectSelectedAsset);
  const { data } = useChart(selectedAsset, 1);

  return (
    <ReusableLineChart
      data={data}
      dataKey="price"
      title={`График цены ${selectedAsset.toUpperCase()}`}
      height={300}
    />
  );
}
