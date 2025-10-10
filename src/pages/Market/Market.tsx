import TradePanel from "./TradePanel/TradePanel";
import PriceChart from "./PriceChart/PriceChart";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import styles from "./Market.module.css";

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
