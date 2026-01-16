import { cn } from "@/lib/utils";
import { mockTasks, mockWorkspace, getLatestRunForTask } from "@/mocks/data";
import {
  Map,
  Inbox,
  Settings,
  GitBranch,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import type { Task } from "@/types";

interface SidebarProps {
  currentView: "roadmap" | "backlog" | "settings";
  onViewChange: (view: "roadmap" | "backlog" | "settings") => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  // Get tasks that need attention (running or review)
  const activeTasks = mockTasks.filter(
    (t) => t.status === "running" || t.status === "review",
  );

  return (
    <aside className="w-[280px] h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              OT
            </span>
          </div>
          <div>
            <h1 className="font-semibold text-sm">{mockWorkspace.name}</h1>
            <p className="text-xs text-muted-foreground">
              {mockWorkspace.repositories.length} repositories
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <NavItem
          icon={Map}
          label="Roadmap"
          active={currentView === "roadmap"}
          onClick={() => onViewChange("roadmap")}
        />
        <NavItem
          icon={Inbox}
          label="Backlog"
          active={currentView === "backlog"}
          onClick={() => onViewChange("backlog")}
          badge={4}
        />
      </nav>

      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <div className="flex-1 overflow-auto px-2 py-4 border-t border-border">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Active Tasks
          </h2>
          <div className="space-y-1">
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Repositories section */}
      <div className="px-2 py-4 border-t border-border">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Repositories
        </h2>
        <div className="space-y-1">
          {mockWorkspace.repositories.map((repo) => (
            <button
              key={repo.id}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <GitBranch className="h-4 w-4" />
              <span className="truncate">{repo.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-2 border-t border-border">
        <NavItem
          icon={Settings}
          label="Settings"
          active={currentView === "settings"}
          onClick={() => onViewChange("settings")}
        />
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </span>
      {badge !== undefined && (
        <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function TaskItem({ task }: { task: Task }) {
  const latestRun = getLatestRunForTask(task.id);
  const currentActivity =
    latestRun?.status === "running"
      ? latestRun.sessions.find((s) => s.status === "active")?.currentActivity
      : null;

  const isReview = task.status === "review";
  const isRunning = task.status === "running";

  return (
    <button
      className={cn(
        "w-full text-left px-2 py-2 rounded-md transition-colors",
        "hover:bg-muted",
        isReview && "bg-status-review/5 border border-status-review/20",
        isRunning && "bg-status-running/5 border border-status-running/20",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {isRunning && (
          <Loader2 className="h-3 w-3 text-status-running animate-spin" />
        )}
        {isReview && <Eye className="h-3 w-3 text-status-review" />}
        <span className="text-sm font-medium truncate flex-1">
          {task.title}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {currentActivity && (
        <p className="text-xs text-muted-foreground truncate pl-5">
          {currentActivity}
        </p>
      )}

      {isReview && (
        <p className="text-xs text-status-review font-medium pl-5">
          Ready for review
        </p>
      )}
    </button>
  );
}
