import { useMemo } from "react";
import useStatistics from "@/ui/hooks/useStatistics";
import { ChartLineMultiple } from "@/ui/components/chart-line-multiple";
const DATA_POINT_COUNT = 10;

export default function ChartTab() {
  const statistics = useStatistics(DATA_POINT_COUNT);
  const resourceUsage = useMemo(() => {
    return statistics.map((stat, index) => {
      const now = new Date();
      const timeOffset = (DATA_POINT_COUNT - index - 1) * 1000;
      const time = new Date(now.getTime() - timeOffset);

      return {
        time: time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        cpuUsage: stat.cpuUsage,
        memoryUsage: stat.memoryUsage,
        storageUsage: stat.storageUsage,
      };
    });
  }, [statistics]);
  return (
    <div className="w-full h-full">
      <ChartLineMultiple
        data={resourceUsage}
        maxPointCount={DATA_POINT_COUNT}
      />
    </div>
  );
}
