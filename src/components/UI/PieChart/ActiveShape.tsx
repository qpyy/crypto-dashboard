import { Sector } from "recharts";
import { formatYAxisTick } from "../../../helpers/format";

interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: { name: string };
  percent?: number;
  value?: number;
}

export function ActiveShape(props: ActiveShapeProps) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle = 0,
    endAngle = 0,
    fill = "#000",
    payload,
    percent = 0,
    value = 0,
  } = props;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    return (
      <g>
        <Sector {...{ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }} />
        <text x={cx} y={cy} textAnchor="middle" dy={-10} fill={fill} fontSize={outerRadius * 0.16}>
          {payload?.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" dy={12} fill="#333" fontSize={outerRadius * 0.13}>
          {`${formatYAxisTick(value)}$`}
        </text>
        <text x={cx} y={cy} textAnchor="middle" dy={28} fill="#999" fontSize={outerRadius * 0.1}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  }

  const midAngle = (startAngle + endAngle) / 2 || 0;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload?.name}
      </text>
      <Sector {...{ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }} />
      <Sector
        {...{ cx, cy, startAngle, endAngle }}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`${formatYAxisTick(value)}$`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
}
