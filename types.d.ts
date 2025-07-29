type Statistics = {
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  totalMemory: number;
  cpuModel: string;
  platform: string;
  cpuCores: number;
  arch: string;
  nodeVersion: string;
};

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeToResourceStats: (
      callback: (stats: Statistics) => void
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
  };
}
