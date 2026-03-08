import { lazy, Suspense, useEffect, useRef } from "react";

import { useStatistics } from "../../store/statistics/useStatistics";
import AssetCard from "./AssetCard/AssetCard";
import styles from "./Portfolio.module.css";

const PieChart = lazy(() => import("../../components/UI/PieChart/PieChart"));

export default function Portfolio() {
  const { assetDistribution } = useStatistics();

  const targetY = useRef(50);
  const currentY = useRef(50);

  useEffect(() => {
    let rafId: number | null = null;
    let animationActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const y = (e.clientY / window.innerHeight) * 100;
      targetY.current = Math.min(70, Math.max(30, y));
    };

    const animate = () => {
      if (!animationActive) return;
      currentY.current += (targetY.current - currentY.current) * 0.02;
      document.documentElement.style.setProperty("--divider-gradient-pos", `${currentY.current}%`);
      rafId = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      animationActive = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const startAnimation = () => {
      if (animationActive || document.hidden) return;
      animationActive = true;
      rafId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        return;
      }
      startAnimation();
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    startAnimation();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
    };
  }, []);

  if (assetDistribution.length === 0)
    return (
      <div className={styles.page}>
        <p className={styles.empty}>Портфель пока пуст</p>
      </div>
    );

  const pieData = assetDistribution.map((asset) => ({
    ...asset,
    value: Math.abs(asset.value),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.chartWrapper}>
          <div className={styles.chartColumn}>
            <Suspense fallback={<div className={styles.chartSkeleton} />}>
              <PieChart data={pieData} />
            </Suspense>
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
                amount={Math.abs(asset.amount)}
                avgPrice={asset.avgPrice}
                currentValue={asset.value}
                profit={asset.profit}
                isShort={asset.amount < 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
