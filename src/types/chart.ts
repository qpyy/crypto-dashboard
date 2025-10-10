export type PieChartData = {
  name: string;
  value: number;
};

export interface LineChartData {
  [key: string]: string | number;
}

export interface ReusableLineChartProps {
  data?: LineChartData[];
  dataKey: string;
  xKey?: string;
  title?: string;
  height?: number;
  yDomain?: [number | "auto", number | "auto"];
}

export type ChartTheme = keyof typeof import("../constants/colors").chartThemeColors;
