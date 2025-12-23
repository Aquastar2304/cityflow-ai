import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CongestionData } from "@/lib/trafficData";

interface CongestionChartProps {
  data: CongestionData[];
  title?: string;
}

export const CongestionChart = ({ data, title = "24-Hour Congestion Pattern" }: CongestionChartProps) => {
  const currentHour = new Date().getHours();

  const chartData = data.map((item) => ({
    ...item,
    label: `${item.hour}:00`,
    isCurrent: item.hour === currentHour,
  }));

  return (
    <div className="glass rounded-xl border border-border p-5">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="congestionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
              interval={3}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 25%, 14%)",
                border: "1px solid hsl(220, 20%, 22%)",
                borderRadius: "8px",
                boxShadow: "0 8px 32px hsl(220, 40%, 5%, 0.5)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              itemStyle={{ color: "hsl(185, 70%, 50%)" }}
              formatter={(value: number) => [`${value}%`, "Congestion"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(185, 70%, 50%)"
              strokeWidth={2}
              fill="url(#congestionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>Now: {currentHour}:00</span>
        <span>Peak: 18:00 (95%)</span>
      </div>
    </div>
  );
};
