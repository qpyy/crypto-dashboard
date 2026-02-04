import { useEffect, useRef } from "react";
import { useStatistics } from "../../store/statistics/useStatistics";
import PieChart from "../../components/UI/PieChart/PieChart";
import AssetCard from "./AssetCard/AssetCard";
import styles from "./Portfolio.module.css";

export default function Portfolio() {
  const { assetDistribution } = useStatistics();

  const targetY = useRef(50);
  const currentY = useRef(50);

  useEffect(() => {
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const y = (e.clientY / window.innerHeight) * 100;
      targetY.current = Math.min(70, Math.max(30, y));
    };

    const animate = () => {
      currentY.current += (targetY.current - currentY.current) * 0.02;
      document.documentElement.style.setProperty("--divider-gradient-pos", `${currentY.current}%`);
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (assetDistribution.length === 0)
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Портфель пока пуст</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.chartWrapper}>
          <div className={styles.chartColumn}>
            <PieChart data={assetDistribution} />
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.assetsColumn}>
          <div className={styles.list}>
            {assetDistribution.map((asset) => (
              <AssetCard
                key={asset.id}
                id={asset.id}
                name={asset.name}
                amount={asset.amount}
                avgPrice={asset.avgPrice}
                currentValue={asset.value}
                profit={asset.profit}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
