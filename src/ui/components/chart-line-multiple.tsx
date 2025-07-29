"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/shadcn/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/ui/components/shadcn/chart";
import { useMemo } from "react";

type ResourceUsage = {
  time: string;
} & Statistics;

type ChartLineMultipleProps = {
  data: ResourceUsage[];
  maxPointCount: number;
};

const chartConfig = {
  cpuUsage: {
    label: "CPU Usage",
    color: "var(--chart-1)",
  },
  memoryUsage: {
    label: "Memory Usage",
    color: "var(--chart-5)",
  },
  storageUsage: {
    label: "Storage Usage",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function CustomTooltipContent({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="border-border/50 bg-background grid min-w-[12rem] items-start gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-xl">
      <div className="font-medium text-foreground">{label}</div>
      <div className="grid gap-1.5">
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex w-full items-center gap-2">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: item.color,
              }}
            />
            <div className="flex flex-1 justify-between leading-none">
              <span className="text-muted-foreground">{item.name}</span>
              <span className="text-foreground font-mono font-medium tabular-nums">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartLineMultiple({
  data: rawData,
  maxPointCount,
}: ChartLineMultipleProps) {
  const data = useMemo(() => {
    return rawData.slice(0, maxPointCount).map((item) => ({
      ...item,
      cpuUsage: (item.cpuUsage * 100).toFixed(1),
      memoryUsage: (item.memoryUsage * 100).toFixed(1),
      storageUsage: (item.storageUsage * 100).toFixed(1),
    }));
  }, [rawData, maxPointCount]);

  return (
    <Card className="w-full h-full rounded-md">
      <CardHeader>
        <CardTitle>Resource Usage</CardTitle>
        <CardDescription>
          Showing resource usage for the last {maxPointCount} datapoints
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) => {
                const timeStr = value.toString();
                return timeStr.length > 8 ? timeStr.slice(0, 8) : timeStr;
              }}
            />
            <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
            <Line
              dataKey="cpuUsage"
              type="monotone"
              stroke="var(--color-cpuUsage)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="memoryUsage"
              type="monotone"
              stroke="var(--color-memoryUsage)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="storageUsage"
              type="monotone"
              stroke="var(--color-storageUsage)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="flex gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex gap-4 leading-none">
              <div>
                <span className="font-bold">CPU Usage:</span>{" "}
                {data[data.length - 1]?.cpuUsage ?? "0.0"}%
              </div>
              <div>
                <span className="font-bold">Memory Usage:</span>{" "}
                {data[data.length - 1]?.memoryUsage ?? "0.0"}%
              </div>
              <div>
                <span className="font-bold">Storage Usage:</span>{" "}
                {data[data.length - 1]?.storageUsage ?? "0.0"}%
              </div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
