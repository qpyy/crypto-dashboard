import React from "react";
import CustomSelect from "../../../components/UI/CustomSelect/CustomSelect";
import { useMarket, selectPrice, selectSelectedAsset } from "../../../store/market/useMarket";
import { useStatistics } from "../../../store/statistics/useStatistics";
import { assetNames } from "../../../constants/assets";
import styles from "./DashboardHeader.module.css";

type StatItemProps = {
  label: string;
  value?: string | number;
  color?: string;
  custom?: React.ReactNode;
};

const StatItem: React.FC<StatItemProps> = ({ label, value, color, custom }) => (
  <div className={styles.card}>
    <h4>{label}</h4>
    {custom && <div className={styles.cardContent}>{custom}</div>}
    {value !== undefined && (
      <div className={styles.cardContent}>
        <p className={styles.mono} style={{ color: color || "var(--text-color)" }}>
          {value}
        </p>
      </div>
    )}
  </div>
);

export default function DashboardHeader() {
  const { balance, realizedProfit, unrealizedProfit, operationsCount } = useStatistics();
  const selectedAsset = useMarket(selectSelectedAsset);
  const setSelectedAsset = useMarket((s) => s.setSelectedAsset);
  const activePrice = useMarket(selectPrice(selectedAsset));

  const options = Object.keys(assetNames).map((asset) => ({
    value: asset,
    label: assetNames[asset],
  }));

  const stats = [
    { label: "Баланс", value: `$ ${balance.toFixed(2)}` },
    {
      label: "Актив",
      custom: (
        <CustomSelect
          fullWidth
          value={selectedAsset}
          options={options}
          onChange={setSelectedAsset}
          ariaLabel="Выбор актива"
        />
      ),
    },
    { label: "Стоимость актива", value: `$ ${activePrice.toFixed(2)}` },
    {
      label: "Реализовано",
      value: `$ ${realizedProfit.toFixed(2)}`,
      color: realizedProfit >= 0 ? "var(--primary-color)" : "var(--error-color)",
    },
    {
      label: "В позициях",
      value: `$ ${unrealizedProfit.toFixed(2)}`,
      color: unrealizedProfit >= 0 ? "var(--primary-color)" : "var(--error-color)",
    },
    { label: "Операций", value: operationsCount },
  ];

  return (
    <div className={styles.headerDashboard}>
      <div className={styles.dashboardWrapper}>
        {stats.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
