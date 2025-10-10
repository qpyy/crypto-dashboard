import { useState } from "react";
import OperationsFilter from "./OperationsFilter/OperationsFilter";
import OperationsList from "./OperationsList/OperationsList";
import StatsCards, { type StatCard } from "./StatsCards/StatsCards";
import { usePortfolio } from "../../store/portfolio/usePortfolio";
import { useStatistics } from "../../store/statistics/useStatistics";
import styles from "./Statistics.module.css";

export default function Statistics() {
  const { totalSpent, totalEarned, netProfit, operationsCount } = useStatistics();
  const operations = usePortfolio((s) => s.operations);

  const [filteredOperations, setFilteredOperations] = useState(operations);

  const stats: StatCard[] = [
    { label: "Потрачено", value: `$${totalSpent.toFixed(2)}` },
    { label: "Заработано", value: `$${totalEarned.toFixed(2)}` },
    {
      label: "Прибыль",
      value: `$${netProfit.toFixed(2)}`,
      highlight: netProfit >= 0 ? "positive" : "negative",
    },
    { label: "Операций", value: operationsCount.toString() },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Статистика операций</h1>
      </div>

      <StatsCards stats={stats} />

      <section className={styles.operations}>
        <h2>История операций</h2>

        <OperationsFilter operations={operations} onFilterChange={setFilteredOperations} />

        <OperationsList operations={filteredOperations} />
      </section>
    </div>
  );
}
