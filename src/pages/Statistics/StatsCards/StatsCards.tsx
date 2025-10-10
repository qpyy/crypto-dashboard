import styles from "./StatsCards.module.css";

export type StatCard = {
  label: string;
  value: string;
  highlight?: "positive" | "negative";
};

type Props = {
  stats: StatCard[];
};

export default function StatsCards({ stats }: Props) {
  return (
    <div className={styles.grid}>
      {stats.map((s, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.label}>{s.label}</div>
          <div
            className={`${styles.value} ${
              s.highlight === "positive"
                ? styles.positive
                : s.highlight === "negative"
                ? styles.negative
                : ""
            }`}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
