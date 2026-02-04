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
  const baselineOrientation = useRef<{ beta: number; gamma: number } | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const setTarget = (x: number, y: number) => {
      target.current = { x, y };
    };

    let pointerActive = false;
    let orientationActive = false;
    let permissionRequested = false;
    let cancelled = false;

    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setTarget(x, y);
    };

    const getOrientationAngle = () => {
      if (typeof screen !== "undefined" && screen.orientation) {
        return screen.orientation.angle;
      }
      const legacy = (window as Window & { orientation?: number }).orientation;
      return typeof legacy === "number" ? legacy : 0;
    };

    const resetBaseline = () => {
      baselineOrientation.current = null;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const beta = e.beta;
      const gamma = e.gamma;

      if (!baselineOrientation.current) {
        baselineOrientation.current = { beta, gamma };
      }

      let x = (gamma - baselineOrientation.current.gamma) / 30;
      let y = (beta - baselineOrientation.current.beta) / 30;

      const angle = getOrientationAngle();
      if (angle === 90) {
        [x, y] = [y, -x];
      } else if (angle === -90 || angle === 270) {
        [x, y] = [-y, x];
      } else if (angle === 180) {
        x = -x;
        y = -y;
      }

      setTarget(clamp(x, -1, 1), clamp(y, -1, 1));
    };

    const enablePointer = () => {
      if (pointerActive || cancelled) return;
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      pointerActive = true;
    };

    const enableOrientation = () => {
      if (orientationActive || cancelled) return;
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
      window.addEventListener("orientationchange", resetBaseline, { passive: true });
      if (typeof screen !== "undefined" && screen.orientation) {
        screen.orientation.addEventListener("change", resetBaseline);
      }
      orientationActive = true;
    };

    const requestOrientationPermission = async () => {
      if (permissionRequested || cancelled) return;
      permissionRequested = true;

      const requestPermission = (
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<"granted" | "denied">;
        }
      ).requestPermission;

      if (typeof requestPermission !== "function") {
        enableOrientation();
        return;
      }

      try {
        const result = await requestPermission();
        if (cancelled) return;
        if (result === "granted") {
          enableOrientation();
        } else {
          enablePointer();
        }
      } catch {
        if (!cancelled) enablePointer();
      }
    };

    const onFirstInteraction = () => {
      void requestOrientationPermission();
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

    const setupInput = () => {
      if (!coarsePointer) {
        enablePointer();
        return;
      }

      if (typeof DeviceOrientationEvent === "undefined") {
        enablePointer();
        return;
      }

      const hasPermissionFn =
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<"granted" | "denied"> })
          .requestPermission === "function";

      if (hasPermissionFn) {
        window.addEventListener("touchend", onFirstInteraction, { passive: true, once: true });
        window.addEventListener("click", onFirstInteraction, { passive: true, once: true });
      } else {
        enableOrientation();
      }
    };

    setupInput();
    animate();

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("orientationchange", resetBaseline);
      if (typeof screen !== "undefined" && screen.orientation) {
        screen.orientation.removeEventListener("change", resetBaseline);
      }
      window.removeEventListener("touchend", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene} data-variant={variant} aria-hidden="true">
      <div className={styles.grid} />
    </div>
  );
}
