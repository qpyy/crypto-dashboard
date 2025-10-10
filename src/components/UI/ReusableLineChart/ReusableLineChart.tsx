import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import { useTheme } from "../../../store/theme/useTheme";
import styles from "./LineChart.module.css";
import { formatYAxisTick } from "../../../helpers/format";
import { chartThemeColors } from "../../../constants/colors";
import type { ReusableLineChartProps } from "../../../types/chart";

export default function ReusableLineChart({
  data,
  dataKey,
  xKey = "time",
  title,
  height = 300,
  yDomain = ["auto", "auto"],
}: ReusableLineChartProps) {
  const { theme } = useTheme();
  const colors = chartThemeColors[theme];
  const isLoading = !data || data.length === 0;

  const [brushRange, setBrushRange] = useState<{ startIndex?: number; endIndex?: number }>({});

  const chartData = useMemo(() => {
    if (isLoading) return Array.from({ length: 10 }, (_, i) => ({ [xKey]: i }));
    return data!;
  }, [data, isLoading, xKey]);

  return (
    <div className={styles.chartContainer}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: colors.axis }} />
          <YAxis domain={yDomain} tick={{ fill: colors.axis }} tickFormatter={formatYAxisTick} />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={colors.stroke}
            strokeWidth={2}
            fill="url(#lineGradient)"
            dot={false}
            isAnimationActive={true}
            animationDuration={2000}
            animationEasing="ease-in-out"
          />

          <Tooltip
            contentStyle={{ backgroundColor: colors.tooltipBg, borderRadius: "6px" }}
            itemStyle={{ color: colors.tooltipText }}
            formatter={(value) => [Number(value).toFixed(2), dataKey]}
          />

          <Brush
            dataKey={xKey}
            height={30}
            stroke={colors.brush}
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            onChange={(range) => setBrushRange(range)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
