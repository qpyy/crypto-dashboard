import { useEffect, useRef } from "react";
import styles from "./ParallaxScene.module.css";

type Variant = "positive" | "negative" | "neutral";

type Props = {
  variant?: Variant;
};

export default function ParallaxScene({ variant = "neutral" }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.current = { x, y };
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      const el = sceneRef.current;
      if (el) {
        el.style.setProperty("--px", current.current.x.toFixed(3));
        el.style.setProperty("--py", current.current.y.toFixed(3));
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    animate();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene} data-variant={variant} aria-hidden="true">
      <div className={styles.grid} />
    </div>
  );
}
