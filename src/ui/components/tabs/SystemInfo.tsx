import { Cpu, HardDrive, MemoryStick } from "lucide-react";
import { useEffect, useState } from "react";

export default function SystemInfo() {
  const [deviceInfo, setDeviceInfo] = useState<StaticData | null>(null);

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await window.electron.getStaticData();
        setDeviceInfo(info);
      } catch (error) {
        console.error("Failed to get device info:", error);
      }
    };

    getDeviceInfo();
  }, []);

  return (
    <div className="w-full h-full p-4">
      {deviceInfo && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              System Information
            </h2>
            <p className="text-muted-foreground">
              Hardware specifications and capabilities
            </p>
          </div>

          <div className="grid gap-4">
            {/* CPU Info */}
            <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Processor</h3>
                  <p className="text-sm text-muted-foreground">CPU Model</p>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground ml-11">
                {deviceInfo.cpuModel}
              </p>
            </div>

            {/* Memory Info */}
            <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MemoryStick className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Memory</h3>
                  <p className="text-sm text-muted-foreground">Total RAM</p>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground ml-11">
                {deviceInfo.totalMemory} GB
              </p>
            </div>

            {/* Storage Info */}
            <div className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HardDrive className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Total Capacity
                  </p>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground ml-11">
                {deviceInfo.totalStorage} GB
              </p>
            </div>
          </div>

          {/* System Summary */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-3">
              System Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">CPU Cores</p>
                <p className="font-medium text-foreground">
                  {deviceInfo.cpuCores}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Platform</p>
                <p className="font-medium text-foreground capitalize">
                  {deviceInfo.platform}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Architecture</p>
                <p className="font-medium text-foreground">{deviceInfo.arch}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Node.js Version</p>
                <p className="font-medium text-foreground">
                  {deviceInfo.nodeVersion}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!deviceInfo && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading system information...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
