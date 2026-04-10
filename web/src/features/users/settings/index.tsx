import { SettingsPane } from "./components/SettingsPane";
import { Tabs, TabsList, TabsTrigger } from "../../../shared/ui/Tabs";

export const Settings = () => {
  return (
    <Tabs defaultValue="general" className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 pb-10">
      {/* Settings Navigation Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-xl font-bold text-black mb-4 px-2">Settings</h2>
        <TabsList className="bg-white border border-[#333333] text-sm font-bold">
          <TabsTrigger value="general">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="border-t border-[#333333]">
            Security and Login
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Settings Content Configuration Pane */}
      <SettingsPane />
    </Tabs>
  );
};
