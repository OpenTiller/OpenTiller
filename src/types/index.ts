/**
 * OpenTiller Core Types
 *
 * Vocabulary:
 * - Workspace: Contains repos, backlogs, env vars, and a roadmap
 * - Backlog: Source of potential tasks (GitHub Issues, Linear, etc.)
 * - Idea: Raw item from a backlog, not yet planned
 * - Task: An Idea promoted to the roadmap, with dependencies
 * - Run: Execution of a Task (contains sessions, worktrees, results)
 * - Session: A Claude Code instance working in a worktree
 */

// ============================================================================
// Base Types
// ============================================================================

export type UUID = string;
export type Timestamp = string; // ISO 8601

// ============================================================================
// Workspace
// ============================================================================

export interface Workspace {
  id: UUID;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  repositories: Repository[];
  backlogs: Backlog[];
  settings: WorkspaceSettings;
}

export interface WorkspaceSettings {
  language: SupportedLanguage;
  theme: "light" | "dark" | "system";
  deepgramApiKey?: string;
}

export type SupportedLanguage =
  | "en"
  | "fr"
  | "de"
  | "es"
  | "es-419"
  | "pt-BR"
  | "it"
  | "ja"
  | "ko"
  | "hi"
  | "id";

// ============================================================================
// Repository
// ============================================================================

export interface Repository {
  id: UUID;
  name: string;
  path: string;
  remoteUrl?: string;
  defaultBranch: string;
  addedAt: Timestamp;
}

// ============================================================================
// Backlog
// ============================================================================

export type BacklogSourceType =
  | "local"
  | "github-issues"
  | "github-projects"
  | "linear"
  | "jira"
  | "notion"
  | "trello"
  | "canny"
  | "featurebase"
  | "custom";

export interface Backlog {
  id: UUID;
  name: string;
  sourceType: BacklogSourceType;
  config: Record<string, unknown>;
  createdAt: Timestamp;
  lastSyncAt?: Timestamp;
}

// ============================================================================
// Idea (Backlog Item)
// ============================================================================

export interface Idea {
  id: UUID;
  backlogId: UUID;
  externalId?: string; // ID in the source system
  title: string;
  description?: string;
  tags: string[];
  priority?: "critical" | "high" | "medium" | "low" | "backlog";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Task (Roadmap Item)
// ============================================================================

export type TaskStatus =
  | "pending" // Not started, waiting for dependencies
  | "ready" // Dependencies met, can be executed
  | "running" // Currently being executed
  | "review" // Execution complete, awaiting review
  | "completed" // Reviewed and merged
  | "failed" // Execution failed
  | "cancelled"; // Manually cancelled

export interface Task {
  id: UUID;
  ideaId?: UUID; // Link to source idea, if any
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number; // 0 = highest priority
  dependencies: UUID[]; // Task IDs that must complete first
  repositoryIds: UUID[]; // Repos this task affects
  assignedAgentPrompt?: string; // Custom prompt for the agent
  permissions: TaskPermission[];
  autoStart: boolean; // Start automatically when dependencies are met
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  // Manual positioning (user can override calculated column if valid)
  manualColumn?: number; // User-specified column (must be >= minColumn from deps)
  manualOrder?: number; // User-specified order within column (0 = top)
}

export type TaskPermission =
  | "repos:read"
  | "repos:read-write"
  | "roadmap:read"
  | "roadmap:read-create"
  | "worktree-agent:create";

// ============================================================================
// Run (Task Execution)
// ============================================================================

export type RunStatus =
  | "initializing" // Setting up worktrees
  | "running" // Agent is working
  | "paused" // User paused the execution
  | "awaiting-review" // Work complete, needs review
  | "approved" // Review approved, ready to merge
  | "merged" // Changes merged to main branch
  | "failed" // Execution failed
  | "cancelled"; // Manually cancelled

export interface Run {
  id: UUID;
  taskId: UUID;
  runNumber: number; // Run #1, #2, etc. for the same task
  status: RunStatus;
  sessions: Session[];
  startedAt: Timestamp;
  completedAt?: Timestamp;
  report?: RunReport;
  checkpoints: Checkpoint[];
}

export interface RunReport {
  summary: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  toolCalls: number;
  duration: number; // in seconds
  content?: string; // Full MDX report content
}

// ============================================================================
// Session (Agent Instance)
// ============================================================================

export interface Session {
  id: UUID;
  runId: UUID;
  repositoryId: UUID;
  worktreePath: string;
  branchName: string;
  status: "active" | "completed" | "failed";
  startedAt: Timestamp;
  completedAt?: Timestamp;
  currentActivity?: string; // One-line description of current action
}

// ============================================================================
// Checkpoint
// ============================================================================

export interface Checkpoint {
  id: UUID;
  runId: UUID;
  commitHash: string;
  description: string;
  createdAt: Timestamp;
  canRevert: boolean;
}

// ============================================================================
// APPER Cycle Phase
// ============================================================================

export type APPERPhase =
  | "analyze" // Collecting ideas in backlogs
  | "prioritize" // Selecting important ideas
  | "plan" // Promoting ideas to tasks in roadmap
  | "execute" // Running tasks
  | "review"; // Validating and merging

// ============================================================================
// UI State Types
// ============================================================================

export type RoadmapViewMode = "graph" | "list";

export interface RoadmapFilters {
  status?: TaskStatus[];
  repositoryIds?: UUID[];
  searchQuery?: string;
}
