import { useEffect, useState } from "react";

export default function useStatistics(datapointcount: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([]);
  useEffect(() => {
    const unsub = window.electron.subscribeToResourceStats((stats) =>
      setValue((prev) => {
        const newData = [...prev, stats];
        if (newData.length > datapointcount) {
          newData.shift();
        }
        return newData;
      })
    );
    return () => unsub();
  }, [datapointcount]);
  return value;
}
