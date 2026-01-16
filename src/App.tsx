import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { RoadmapView } from "@/components/roadmap/roadmap-view";
import "./index.css";

type View = "roadmap" | "backlog" | "settings";

function App() {
  const [currentView, setCurrentView] = useState<View>("roadmap");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 overflow-hidden">
        {currentView === "roadmap" && <RoadmapView />}
        {currentView === "backlog" && <BacklogPlaceholder />}
        {currentView === "settings" && <SettingsPlaceholder />}
      </main>
    </div>
  );
}

function BacklogPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Backlog</h2>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Settings</h2>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}

export default App;
