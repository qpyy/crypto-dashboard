import DashboardHeader from "./DashboardHeader/DashboardHeader";
import styles from "./Market.module.css";
import PriceChart from "./PriceChart/PriceChart";
import TradePanel from "./TradePanel/TradePanel";

export default function Market() {
  return (
    <div className={styles.container}>
      <DashboardHeader />

      <div className={styles.tradeChart}>
        <div className={styles["trade-panel-wrapper"]}>
          <TradePanel />
        </div>
        <div className={styles["chart-wrapper"]}>
          <PriceChart />
        </div>
      </div>
    </div>
  );
}
