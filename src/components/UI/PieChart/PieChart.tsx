import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { ActiveShape } from "./ActiveShape";
import type { PieChartData } from "../../../types";
import { PIE_COLORS } from "../../../constants/colors";

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
}

export default function PieChartComponent({ data, width = 650, height = 650 }: PieChartProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: width,
        aspectRatio: `${width} / ${height}`,
        margin: "0 auto",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeShape={ActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="55%"
            paddingAngle={2}
            dataKey="value"
            focusable={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                focusable={false}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
