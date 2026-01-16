import { cn } from "@/lib/utils";
import type { Task, Run } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { GitBranch, Clock, FileCode, Play, Eye } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { mockRepositories, getLatestRunForTask } from "@/mocks/data";

interface TaskCardProps {
  task: Task;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const latestRun = getLatestRunForTask(task.id);
  const repos = task.repositoryIds
    .map((id) => mockRepositories.find((r) => r.id === id))
    .filter(Boolean);

  const currentActivity =
    latestRun?.status === "running"
      ? latestRun.sessions.find((s) => s.status === "active")?.currentActivity
      : null;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement action logic
    console.log(`Action clicked for task ${task.id}`);
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "w-full text-left rounded-lg border border-border bg-card p-4 transition-all cursor-pointer",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isSelected && "border-primary shadow-lg shadow-primary/10",
        task.status === "running" && "border-status-running/50",
        task.status === "review" && "border-status-review/50",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-sm leading-tight line-clamp-2">
          {task.title}
        </h3>
        <StatusBadge status={task.status} size="sm" showLabel={false} />
      </div>

      {/* Current activity for running tasks */}
      {currentActivity && (
        <div className="mb-3 flex items-center gap-2 text-xs text-status-running bg-status-running/10 rounded px-2 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-running opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-running"></span>
          </span>
          <span className="truncate">{currentActivity}</span>
        </div>
      )}

      {/* Repositories */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {repos.map((repo) => (
          <span
            key={repo!.id}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5"
          >
            <GitBranch className="h-3 w-3" />
            {repo!.name}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(task.updatedAt)}
        </span>

        {latestRun && <RunInfo run={latestRun} />}
      </div>

      {/* Action buttons for ready/review tasks */}
      {(task.status === "ready" || task.status === "review") && (
        <div className="mt-3 pt-3 border-t border-border">
          {task.status === "ready" && (
            <button
              onClick={handleActionClick}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Start Execution
            </button>
          )}
          {task.status === "review" && (
            <button
              onClick={handleActionClick}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-status-review hover:text-status-review/80 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Review Now
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RunInfo({ run }: { run: Run }) {
  return (
    <span className="flex items-center gap-1">
      <FileCode className="h-3 w-3" />
      {run.report ? (
        <span>
          +{run.report.linesAdded} -{run.report.linesRemoved}
        </span>
      ) : (
        <span>Run #{run.runNumber}</span>
      )}
    </span>
  );
}
