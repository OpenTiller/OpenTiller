import { cn } from "@/lib/utils";
import type { TaskStatus, RunStatus } from "@/types";
import {
  Clock,
  Play,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
  CircleDot,
  GitMerge,
  Pause,
} from "lucide-react";

type Status = TaskStatus | RunStatus;

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const taskStatusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-status-pending/20 text-status-pending",
  },
  ready: {
    label: "Ready",
    icon: CircleDot,
    className: "bg-status-ready/20 text-status-ready",
  },
  running: {
    label: "Running",
    icon: Loader2,
    className: "bg-status-running/20 text-status-running",
  },
  review: {
    label: "Review",
    icon: Eye,
    className: "bg-status-review/20 text-status-review",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-status-completed/20 text-status-completed",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-status-failed/20 text-status-failed",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    className: "bg-status-cancelled/20 text-status-cancelled",
  },
};

const runStatusConfig: Record<
  RunStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  initializing: {
    label: "Initializing",
    icon: Loader2,
    className: "bg-status-pending/20 text-status-pending",
  },
  running: {
    label: "Running",
    icon: Play,
    className: "bg-status-running/20 text-status-running",
  },
  paused: {
    label: "Paused",
    icon: Pause,
    className: "bg-status-pending/20 text-status-pending",
  },
  "awaiting-review": {
    label: "Awaiting Review",
    icon: Eye,
    className: "bg-status-review/20 text-status-review",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-status-completed/20 text-status-completed",
  },
  merged: {
    label: "Merged",
    icon: GitMerge,
    className: "bg-status-completed/20 text-status-completed",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-status-failed/20 text-status-failed",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    className: "bg-status-cancelled/20 text-status-cancelled",
  },
};

function isRunStatus(status: Status): status is RunStatus {
  return status in runStatusConfig;
}

export function StatusBadge({
  status,
  size = "md",
  showLabel = true,
  className,
}: StatusBadgeProps) {
  const config = isRunStatus(status)
    ? runStatusConfig[status]
    : taskStatusConfig[status as TaskStatus];

  const Icon = config.icon;
  const isAnimated = status === "running" || status === "initializing";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        config.className,
        className,
      )}
    >
      <Icon
        className={cn(
          size === "sm" ? "h-3 w-3" : "h-4 w-4",
          isAnimated && "animate-spin",
        )}
      />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
