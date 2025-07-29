import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/shadcn/tabs";
import ChartTab from "./components/tabs/ChartTab";
import SystemInfo from "./components/tabs/SystemInfo";

function App() {
  return (
    <Tabs defaultValue="chart" className="w-full h-svh p-4">
      <TabsList>
        <TabsTrigger value="chart">Resource Usage</TabsTrigger>
        <TabsTrigger value="sysInfo">System Information</TabsTrigger>
      </TabsList>
      <TabsContent value="chart">
        <ChartTab />
      </TabsContent>
      <TabsContent value="sysInfo">
        <SystemInfo />
      </TabsContent>
    </Tabs>
  );
}

export default App;
