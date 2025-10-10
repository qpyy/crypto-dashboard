export const PIE_COLORS = [
  "#4caf50",
  "#f44336",
  "#2196f3",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
  "#ffc107",
  "#e91e63",
];

export const COLORS = {
  primary: "#1976d2",
  secondary: "#4caf50",
  gridLight: "#e0e0e0",
  gridDark: "#444",
  axisLight: "#213547",
  axisDark: "#bbb",
  tooltipBgLight: "#f5f5f5",
  tooltipBgDark: "#333",
  tooltipTextLight: "#213547",
  tooltipTextDark: "#fff",
} as const;

export const chartThemeColors = {
  light: {
    stroke: COLORS.primary,
    grid: COLORS.gridLight,
    axis: COLORS.axisLight,
    tooltipBg: COLORS.tooltipBgLight,
    tooltipText: COLORS.tooltipTextLight,
    brush: COLORS.primary,
  },
  dark: {
    stroke: COLORS.secondary,
    grid: COLORS.gridDark,
    axis: COLORS.axisDark,
    tooltipBg: COLORS.tooltipBgDark,
    tooltipText: COLORS.tooltipTextDark,
    brush: COLORS.secondary,
  },
} as const;
