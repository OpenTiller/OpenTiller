import type { Workspace, Repository, Backlog, Idea, Task, Run } from "@/types";

// ============================================================================
// Helper to generate UUIDs for mocks
// ============================================================================

const uuid = (id: string) => `mock-${id}`;

// ============================================================================
// Repositories
// ============================================================================

export const mockRepositories: Repository[] = [
  {
    id: uuid("repo-opentiller"),
    name: "OpenTiller",
    path: "~/opentiller/workspaces/0/repos/OpenTiller",
    remoteUrl: "https://github.com/OpenTiller/OpenTiller",
    defaultBranch: "main",
    addedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: uuid("repo-github"),
    name: ".github",
    path: "~/opentiller/workspaces/0/repos/.github",
    remoteUrl: "https://github.com/OpenTiller/.github",
    defaultBranch: "main",
    addedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: uuid("repo-website"),
    name: "website",
    path: "~/opentiller/workspaces/0/repos/website",
    remoteUrl: "https://github.com/OpenTiller/website",
    defaultBranch: "main",
    addedAt: "2024-01-10T10:00:00Z",
  },
];

// ============================================================================
// Backlogs
// ============================================================================

export const mockBacklogs: Backlog[] = [
  {
    id: uuid("backlog-local"),
    name: "Local Backlog",
    sourceType: "local",
    config: {},
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: uuid("backlog-github"),
    name: "GitHub Issues",
    sourceType: "github-issues",
    config: { repo: "OpenTiller/OpenTiller" },
    createdAt: "2024-01-10T10:05:00Z",
    lastSyncAt: "2024-01-13T08:00:00Z",
  },
  {
    id: uuid("backlog-linear"),
    name: "Linear",
    sourceType: "linear",
    config: { teamId: "opentiller" },
    createdAt: "2024-01-10T10:10:00Z",
    lastSyncAt: "2024-01-13T08:00:00Z",
  },
];

// ============================================================================
// Ideas (Backlog Items)
// ============================================================================

export const mockIdeas: Idea[] = [
  {
    id: uuid("idea-1"),
    backlogId: uuid("backlog-github"),
    externalId: "42",
    title: "Add dark mode toggle in settings",
    description:
      "Users should be able to switch between light and dark mode from the settings panel.",
    tags: ["enhancement", "ui"],
    priority: "medium",
    createdAt: "2024-01-11T14:00:00Z",
    updatedAt: "2024-01-11T14:00:00Z",
  },
  {
    id: uuid("idea-2"),
    backlogId: uuid("backlog-github"),
    externalId: "43",
    title: "Implement keyboard shortcuts",
    description:
      "Add keyboard shortcuts for common actions: new task (Cmd+N), search (Cmd+K), etc.",
    tags: ["enhancement", "accessibility"],
    priority: "high",
    createdAt: "2024-01-11T15:00:00Z",
    updatedAt: "2024-01-11T15:00:00Z",
  },
  {
    id: uuid("idea-3"),
    backlogId: uuid("backlog-linear"),
    externalId: "OT-123",
    title: "Add Notion backlog integration",
    description:
      "Allow users to connect their Notion workspace and import tasks from databases.",
    tags: ["feature", "integration"],
    priority: "medium",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
  },
  {
    id: uuid("idea-4"),
    backlogId: uuid("backlog-local"),
    title: "Improve error messages",
    description:
      "Make error messages more user-friendly with suggested actions.",
    tags: ["improvement", "ux"],
    priority: "low",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
];

// ============================================================================
// Tasks (Roadmap Items)
// ============================================================================

export const mockTasks: Task[] = [
  // Column 0 - Initial setup tasks (completed)
  {
    id: uuid("task-0"),
    title: "Initialize OpenTiller workspace",
    description:
      "Set up the workspace structure, create .opentiller directories in each repo.",
    status: "completed",
    priority: 0,
    dependencies: [],
    repositoryIds: [
      uuid("repo-opentiller"),
      uuid("repo-github"),
      uuid("repo-website"),
    ],
    permissions: ["repos:read", "worktree-agent:create", "roadmap:read-create"],
    autoStart: false,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T12:00:00Z",
    completedAt: "2024-01-10T12:00:00Z",
  },
  {
    id: uuid("task-1"),
    title: "Initialize GitHub Issues backlog source",
    description:
      "Create the script to fetch GitHub issues assigned to the user.",
    status: "completed",
    priority: 1,
    dependencies: [],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read-write"],
    autoStart: false,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
    completedAt: "2024-01-10T14:00:00Z",
  },
  {
    id: uuid("task-2"),
    title: "Initialize Linear backlog source",
    description: "Create the script to fetch Linear issues from the team.",
    status: "completed",
    priority: 2,
    dependencies: [],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read-write"],
    autoStart: false,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T15:00:00Z",
    completedAt: "2024-01-10T15:00:00Z",
  },

  // Depends on task-0 -> column 1
  {
    id: uuid("task-3"),
    ideaId: uuid("idea-2"),
    title: "Implement keyboard shortcuts",
    description: "Add keyboard shortcuts for common actions.",
    status: "review",
    priority: 0,
    dependencies: [uuid("task-0")],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read-write"],
    autoStart: true,
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-13T09:00:00Z",
  },
  {
    id: uuid("task-4"),
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for testing and deployment.",
    status: "running",
    priority: 1,
    dependencies: [uuid("task-0")],
    repositoryIds: [uuid("repo-opentiller"), uuid("repo-github")],
    permissions: ["repos:read-write"],
    autoStart: true,
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-13T10:30:00Z",
  },
  {
    id: uuid("task-5"),
    title: "Create landing page",
    description:
      "Design and implement the marketing landing page for OpenTiller.",
    status: "running",
    priority: 2,
    dependencies: [uuid("task-0")],
    repositoryIds: [uuid("repo-website")],
    permissions: ["repos:read-write"],
    autoStart: true,
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
  },

  // Depends on column 1 tasks -> column 2
  {
    id: uuid("task-6"),
    ideaId: uuid("idea-1"),
    title: "Add dark mode toggle",
    description: "Implement theme switching in the settings panel.",
    status: "ready",
    priority: 0,
    dependencies: [uuid("task-3")],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read-write"],
    autoStart: false,
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: uuid("task-7"),
    ideaId: uuid("idea-3"),
    title: "Add Notion integration",
    description: "Implement Notion API connection for backlog sync.",
    status: "pending",
    priority: 1,
    dependencies: [uuid("task-3"), uuid("task-4")],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read-write"],
    autoStart: false,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
  },
  {
    id: uuid("task-8"),
    title: "Optimize build performance",
    description:
      "Analyze and improve the build time. Target: < 30s for production build.",
    status: "pending",
    priority: 2,
    dependencies: [uuid("task-4")],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read"],
    autoStart: true,
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-12T12:00:00Z",
  },

  // Depends on column 2 tasks -> column 3
  {
    id: uuid("task-9"),
    title: "Add speech-to-text with Deepgram",
    description:
      "Implement voice input for creating tasks and sending messages.",
    status: "pending",
    priority: 0,
    dependencies: [uuid("task-6"), uuid("task-7")],
    repositoryIds: [uuid("repo-opentiller")],
    permissions: ["repos:read-write"],
    autoStart: false,
    createdAt: "2024-01-13T08:00:00Z",
    updatedAt: "2024-01-13T08:00:00Z",
  },
];

// ============================================================================
// Runs
// ============================================================================

export const mockRuns: Run[] = [
  // Completed run for task-0
  {
    id: uuid("run-0-1"),
    taskId: uuid("task-0"),
    runNumber: 1,
    status: "merged",
    sessions: [
      {
        id: uuid("session-0-1-1"),
        runId: uuid("run-0-1"),
        repositoryId: uuid("repo-opentiller"),
        worktreePath: "~/opentiller/workspaces/0/.worktrees/task-0-opentiller",
        branchName: "feat/init-workspace",
        status: "completed",
        startedAt: "2024-01-10T10:30:00Z",
        completedAt: "2024-01-10T11:45:00Z",
      },
    ],
    startedAt: "2024-01-10T10:30:00Z",
    completedAt: "2024-01-10T12:00:00Z",
    report: {
      summary:
        "Successfully initialized workspace with .opentiller directories.",
      filesChanged: 12,
      linesAdded: 245,
      linesRemoved: 0,
      toolCalls: 34,
      duration: 4500,
    },
    checkpoints: [
      {
        id: uuid("checkpoint-0-1-1"),
        runId: uuid("run-0-1"),
        commitHash: "a1b2c3d",
        description: "Created base directory structure",
        createdAt: "2024-01-10T11:00:00Z",
        canRevert: true,
      },
      {
        id: uuid("checkpoint-0-1-2"),
        runId: uuid("run-0-1"),
        commitHash: "e4f5g6h",
        description: "Added hooks.json configuration",
        createdAt: "2024-01-10T11:30:00Z",
        canRevert: true,
      },
    ],
  },

  // Running run for task-4
  {
    id: uuid("run-4-1"),
    taskId: uuid("task-4"),
    runNumber: 1,
    status: "running",
    sessions: [
      {
        id: uuid("session-4-1-1"),
        runId: uuid("run-4-1"),
        repositoryId: uuid("repo-opentiller"),
        worktreePath: "~/opentiller/workspaces/0/.worktrees/task-4-opentiller",
        branchName: "feat/ci-cd-pipeline",
        status: "active",
        startedAt: "2024-01-13T10:00:00Z",
        currentActivity: "Writing GitHub Actions workflow for tests...",
      },
      {
        id: uuid("session-4-1-2"),
        runId: uuid("run-4-1"),
        repositoryId: uuid("repo-github"),
        worktreePath: "~/opentiller/workspaces/0/.worktrees/task-4-github",
        branchName: "feat/ci-cd-pipeline",
        status: "active",
        startedAt: "2024-01-13T10:00:00Z",
        currentActivity: "Configuring shared workflow templates...",
      },
    ],
    startedAt: "2024-01-13T10:00:00Z",
    checkpoints: [
      {
        id: uuid("checkpoint-4-1-1"),
        runId: uuid("run-4-1"),
        commitHash: "i7j8k9l",
        description: "Added base workflow structure",
        createdAt: "2024-01-13T10:15:00Z",
        canRevert: true,
      },
    ],
  },

  // Running run for task-5
  {
    id: uuid("run-5-1"),
    taskId: uuid("task-5"),
    runNumber: 1,
    status: "running",
    sessions: [
      {
        id: uuid("session-5-1-1"),
        runId: uuid("run-5-1"),
        repositoryId: uuid("repo-website"),
        worktreePath: "~/opentiller/workspaces/0/.worktrees/task-5-website",
        branchName: "feat/landing-page",
        status: "active",
        startedAt: "2024-01-13T09:30:00Z",
        currentActivity: "Implementing hero section with animations...",
      },
    ],
    startedAt: "2024-01-13T09:30:00Z",
    checkpoints: [],
  },

  // Review run for task-3
  {
    id: uuid("run-3-1"),
    taskId: uuid("task-3"),
    runNumber: 1,
    status: "awaiting-review",
    sessions: [
      {
        id: uuid("session-3-1-1"),
        runId: uuid("run-3-1"),
        repositoryId: uuid("repo-opentiller"),
        worktreePath: "~/opentiller/workspaces/0/.worktrees/task-3-opentiller",
        branchName: "feat/keyboard-shortcuts",
        status: "completed",
        startedAt: "2024-01-12T14:00:00Z",
        completedAt: "2024-01-13T08:30:00Z",
      },
    ],
    startedAt: "2024-01-12T14:00:00Z",
    completedAt: "2024-01-13T08:30:00Z",
    report: {
      summary:
        "Implemented keyboard shortcuts using a custom hook. Added Cmd+N for new task, Cmd+K for search, Cmd+E for execute.",
      filesChanged: 8,
      linesAdded: 312,
      linesRemoved: 45,
      toolCalls: 67,
      duration: 66600,
    },
    checkpoints: [
      {
        id: uuid("checkpoint-3-1-1"),
        runId: uuid("run-3-1"),
        commitHash: "m0n1o2p",
        description: "Added useKeyboardShortcuts hook",
        createdAt: "2024-01-12T15:00:00Z",
        canRevert: true,
      },
      {
        id: uuid("checkpoint-3-1-2"),
        runId: uuid("run-3-1"),
        commitHash: "q3r4s5t",
        description: "Integrated shortcuts in main components",
        createdAt: "2024-01-13T08:00:00Z",
        canRevert: true,
      },
    ],
  },
];

// ============================================================================
// Workspace
// ============================================================================

export const mockWorkspace: Workspace = {
  id: uuid("workspace-0"),
  name: "OpenTiller Development",
  createdAt: "2024-01-10T10:00:00Z",
  updatedAt: "2024-01-13T10:30:00Z",
  repositories: mockRepositories,
  backlogs: mockBacklogs,
  settings: {
    language: "en",
    theme: "dark",
  },
};

// ============================================================================
// Helper functions
// ============================================================================

export function getTaskById(id: string): Task | undefined {
  return mockTasks.find((t) => t.id === id);
}

export function getRunsForTask(taskId: string): Run[] {
  return mockRuns.filter((r) => r.taskId === taskId);
}

export function getLatestRunForTask(taskId: string): Run | undefined {
  const runs = getRunsForTask(taskId);
  return runs.sort((a, b) => b.runNumber - a.runNumber)[0];
}

export function getTaskDependencies(task: Task): Task[] {
  return task.dependencies
    .map((depId) => mockTasks.find((t) => t.id === depId))
    .filter((t): t is Task => t !== undefined);
}

export function getTaskDependents(taskId: string): Task[] {
  return mockTasks.filter((t) => t.dependencies.includes(taskId));
}
