# OpenTiller Technical Architecture

> Technical design document for OpenTiller developers and contributors

## Overview

OpenTiller is a cross-platform desktop application built with:

- **Frontend**: React 19 + TypeScript + TailwindCSS 4
- **Desktop Runtime**: Tauri 2.0 (Rust backend)
- **State Management**: Zustand (planned)
- **Internationalization**: react-i18next
- **Secure Storage**: Tauri Stronghold

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           OpenTiller Desktop App                        │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        React Frontend                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  │
│  │  │  Roadmap    │  │  Backlog    │  │  Settings   │               │  │
│  │  │  View       │  │  View       │  │  View       │               │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘               │  │
│  │                          │                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │                    Zustand Store                             │ │  │
│  │  │  • workspaces  • tasks  • sessions  • settings               │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                   │                                      │
│                          Tauri IPC Bridge                               │
│                                   │                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        Rust Backend                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │  │
│  │  │ Workspace    │  │ Git          │  │ Agent        │            │  │
│  │  │ Manager      │  │ Operations   │  │ Manager      │            │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │  │
│  │  │ Stronghold   │  │ Process      │  │ File         │            │  │
│  │  │ (Secrets)    │  │ Spawner      │  │ Watcher      │            │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────────────┐               ┌───────────────┐
            │  Claude Code  │               │  Git          │
            │  (Subprocess) │               │  (Worktrees)  │
            └───────────────┘               └───────────────┘
```

## Directory Structure

### Application Code

```
opentiller/
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/               # App shell components
│   │   │   ├── sidebar.tsx
│   │   │   └── header.tsx
│   │   ├── roadmap/              # Roadmap feature
│   │   │   ├── roadmap-view.tsx
│   │   │   ├── task-card.tsx
│   │   │   └── dependency-graph.tsx
│   │   ├── backlog/              # Backlog feature
│   │   │   ├── backlog-view.tsx
│   │   │   ├── source-card.tsx
│   │   │   └── idea-card.tsx
│   │   ├── review/               # Review feature
│   │   │   ├── review-page.tsx
│   │   │   ├── diff-viewer.tsx
│   │   │   └── checkpoint-list.tsx
│   │   └── ui/                   # Reusable components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── modal.tsx
│   │       └── ...
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-workspace.ts
│   │   ├── use-tasks.ts
│   │   └── use-sessions.ts
│   ├── stores/                   # Zustand stores
│   │   ├── workspace-store.ts
│   │   ├── roadmap-store.ts
│   │   └── settings-store.ts
│   ├── lib/                      # Utilities
│   │   ├── tauri.ts              # Tauri IPC wrappers
│   │   ├── git.ts                # Git operations
│   │   └── utils.ts
│   ├── i18n/                     # Internationalization
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       ├── fr.json
│   │       └── ...
│   ├── types/                    # TypeScript definitions
│   │   ├── workspace.ts
│   │   ├── task.ts
│   │   └── ...
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   ├── lib.rs                # Tauri setup
│   │   ├── commands/             # IPC commands
│   │   │   ├── mod.rs
│   │   │   ├── workspace.rs
│   │   │   ├── git.rs
│   │   │   ├── agent.rs
│   │   │   └── secrets.rs
│   │   ├── services/             # Business logic
│   │   │   ├── mod.rs
│   │   │   ├── workspace_manager.rs
│   │   │   ├── git_manager.rs
│   │   │   ├── agent_manager.rs
│   │   │   └── stronghold_service.rs
│   │   └── models/               # Data structures
│   │       ├── mod.rs
│   │       ├── workspace.rs
│   │       ├── task.rs
│   │       └── session.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
│       └── default.json
│
├── docs/                         # Documentation
│   ├── PRD.md
│   ├── GLOSSARY.md
│   ├── UX-FLOWS.md
│   └── ARCHITECTURE.md
│
└── public/                       # Static assets
    └── icons/
```

### User Data Structure

```
~/opentiller/
├── config.json                           # Global configuration
│   {
│     "lastWorkspaceId": "abc123",
│     "language": "en",
│     "theme": "system"
│   }
│
├── local-backlog/                        # Local backlog items
│   └── items/
│       ├── {id}.json
│       └── ...
│
└── workspaces/
    └── {workspace-id}/
        ├── config.json                   # Workspace config
        │   {
        │     "id": "abc123",
        │     "name": "My Project",
        │     "createdAt": "2026-01-15T...",
        │     "repos": [...],
        │     "sources": [...]
        │   }
        │
        ├── repos/                        # Cloned repositories
        │   ├── main-app/
        │   │   ├── .opentiller/
        │   │   │   ├── scope.md
        │   │   │   └── hooks.json
        │   │   └── (repo files)
        │   └── docs/
        │       └── ...
        │
        ├── sources/                      # Source scripts
        │   ├── github-issues/
        │   │   ├── opentiller.config.json
        │   │   ├── getList.sh
        │   │   └── onStatusChange.sh
        │   └── linear/
        │       └── ...
        │
        ├── worktrees/                    # Git worktrees for agents
        │   ├── {session-id}/
        │   │   └── (worktree files)
        │   └── ...
        │
        ├── roadmap.json                  # Roadmap state
        │   {
        │     "tasks": [...],
        │     "lanes": [...]
        │   }
        │
        └── vault.stronghold              # Encrypted secrets
```

## Core Components

### 1. Workspace Manager

Handles workspace lifecycle:

```rust
// src-tauri/src/services/workspace_manager.rs

pub struct WorkspaceManager {
    config_path: PathBuf,
    workspaces: HashMap<String, Workspace>,
}

impl WorkspaceManager {
    pub async fn create_workspace(&mut self, name: &str) -> Result<Workspace>;
    pub async fn load_workspace(&mut self, id: &str) -> Result<Workspace>;
    pub async fn delete_workspace(&mut self, id: &str) -> Result<()>;
    pub async fn add_repository(&mut self, workspace_id: &str, repo: RepoConfig) -> Result<()>;
    pub async fn add_source(&mut self, workspace_id: &str, source: SourceConfig) -> Result<()>;
}
```

### 2. Git Manager

Handles git operations:

```rust
// src-tauri/src/services/git_manager.rs

pub struct GitManager {
    workspace_path: PathBuf,
}

impl GitManager {
    pub async fn clone_repository(&self, url: &str, name: &str) -> Result<()>;
    pub async fn create_worktree(&self, repo: &str, branch: &str, session_id: &str) -> Result<PathBuf>;
    pub async fn remove_worktree(&self, session_id: &str) -> Result<()>;
    pub async fn get_diff(&self, worktree_path: &Path) -> Result<Diff>;
    pub async fn get_commits(&self, worktree_path: &Path) -> Result<Vec<Commit>>;
    pub async fn create_commit(&self, worktree_path: &Path, message: &str) -> Result<String>;
}
```

### 3. Agent Manager

Manages Claude Code sessions:

```rust
// src-tauri/src/services/agent_manager.rs

pub struct AgentManager {
    sessions: HashMap<String, AgentSession>,
}

pub struct AgentSession {
    id: String,
    task_id: String,
    worktree_path: PathBuf,
    process: Child,
    status: SessionStatus,
}

impl AgentManager {
    pub async fn start_session(&mut self, task: &Task) -> Result<String>;
    pub async fn stop_session(&mut self, session_id: &str) -> Result<()>;
    pub async fn get_session_output(&self, session_id: &str) -> Result<String>;
    pub async fn send_message(&mut self, session_id: &str, message: &str) -> Result<()>;
}
```

### 4. Stronghold Service

Secure secrets storage:

```rust
// src-tauri/src/services/stronghold_service.rs

pub struct StrongholdService {
    stronghold: Stronghold,
}

impl StrongholdService {
    pub async fn store_secret(&self, key: &str, value: &str) -> Result<()>;
    pub async fn get_secret(&self, key: &str) -> Result<Option<String>>;
    pub async fn delete_secret(&self, key: &str) -> Result<()>;
    pub async fn list_keys(&self) -> Result<Vec<String>>;
}
```

## State Management

### Zustand Stores

```typescript
// src/stores/workspace-store.ts

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadWorkspaces: () => Promise<void>;
  selectWorkspace: (id: string) => Promise<void>;
  createWorkspace: (name: string) => Promise<Workspace>;
}

// src/stores/roadmap-store.ts

interface RoadmapState {
  tasks: Task[];
  lanes: Lane[];
  selectedTask: Task | null;

  // Actions
  addTask: (task: TaskInput) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  moveTask: (id: string, laneIndex: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

// src/stores/session-store.ts

interface SessionState {
  sessions: Session[];
  activeSessionId: string | null;

  // Actions
  startSession: (taskId: string) => Promise<Session>;
  stopSession: (sessionId: string) => Promise<void>;
  selectSession: (sessionId: string) => void;
}
```

## IPC Commands

Tauri commands exposed to the frontend:

```typescript
// Frontend usage
import { invoke } from '@tauri-apps/api/core';

// Workspace commands
const workspace = await invoke<Workspace>('create_workspace', { name: 'My Project' });
const workspaces = await invoke<Workspace[]>('list_workspaces');
await invoke('delete_workspace', { id: 'abc123' });

// Repository commands
await invoke('clone_repository', { workspaceId: 'abc123', url: 'https://...', name: 'repo' });
const diff = await invoke<Diff>('get_worktree_diff', { sessionId: 'xyz' });

// Session commands
const sessionId = await invoke<string>('start_session', { taskId: 'task-1' });
await invoke('stop_session', { sessionId });
const output = await invoke<string>('get_session_output', { sessionId });

// Secrets commands
await invoke('store_secret', { key: 'GITHUB_TOKEN', value: 'ghp_...' });
const token = await invoke<string | null>('get_secret', { key: 'GITHUB_TOKEN' });
```

## Event System

Tauri events for real-time updates:

```typescript
// Frontend listening
import { listen } from '@tauri-apps/api/event';

// Session output streaming
await listen<SessionOutput>('session:output', (event) => {
  console.log('Session output:', event.payload);
});

// Task status changes
await listen<TaskStatusChange>('task:status', (event) => {
  updateTaskStatus(event.payload.taskId, event.payload.status);
});

// Clone progress
await listen<CloneProgress>('clone:progress', (event) => {
  setProgress(event.payload.percent);
});
```

## Agent Integration

### Claude Code Spawning

```rust
// Spawn Claude Code in a worktree
pub async fn spawn_claude_code(
    worktree_path: &Path,
    prompt: &str,
    system_prompt: &str,
) -> Result<Child> {
    let child = Command::new("claude")
        .current_dir(worktree_path)
        .arg("--prompt")
        .arg(prompt)
        .arg("--system-prompt")
        .arg(system_prompt)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    Ok(child)
}
```

### Agent Registry

Specialized agents with predefined prompts:

```json
// agent-registry.json
{
  "workspace-initializer": {
    "systemPrompt": "You are an agent responsible for initializing OpenTiller workspaces...",
    "permissions": ["repos:read", "worktree-agent:create", "roadmap:read-create"]
  },
  "source-initializer": {
    "systemPrompt": "You are an agent responsible for creating source scripts...",
    "permissions": ["repos:read-write"]
  },
  "task-prioritizer": {
    "systemPrompt": "You are an agent responsible for analyzing backlogs and suggesting priorities...",
    "permissions": ["roadmap:read-create", "repos:read"]
  },
  "security-auditor": {
    "systemPrompt": "You are an agent responsible for security analysis...",
    "permissions": ["roadmap:read-create", "repos:read"]
  }
}
```

## Security Considerations

### Secrets Storage

- All API keys and tokens stored in Tauri Stronghold
- Stronghold encrypted with user-derived key
- Never stored in plaintext in config files

### Process Isolation

- Each agent runs in isolated git worktree
- Limited file system access via permissions
- Process sandboxing via OS capabilities

### Input Validation

- All IPC commands validate inputs
- Path traversal prevention
- URL validation for repository cloning

## Performance Optimizations

### Lazy Loading

- Workspaces loaded on-demand
- Repository contents not preloaded
- Backlog items paginated

### Parallel Operations

- Multiple repositories cloned in parallel
- Multiple agents can run simultaneously
- Async file system operations

### Caching

- Git diff cached per worktree
- Backlog items cached with TTL
- Translation files loaded once

## Testing Strategy

### Unit Tests

```rust
// Rust unit tests
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_create_workspace() {
        let manager = WorkspaceManager::new(temp_dir());
        let workspace = manager.create_workspace("Test").await.unwrap();
        assert_eq!(workspace.name, "Test");
    }
}
```

### Integration Tests

```typescript
// Frontend integration tests
describe('Workspace creation', () => {
  it('creates a workspace with repositories', async () => {
    const workspace = await createWorkspace('Test');
    await addRepository(workspace.id, 'https://github.com/test/repo');

    const repos = await getRepositories(workspace.id);
    expect(repos).toHaveLength(1);
  });
});
```

### E2E Tests

- Tauri provides WebDriver support
- Test full user flows
- Cross-platform testing

## Deployment

### Build Targets

- macOS: `.dmg`, `.app`
- Windows: `.msi`, `.exe`
- Linux: `.deb`, `.AppImage`

### Auto-Update

- Tauri updater plugin
- Signed releases
- Delta updates when possible

### CI/CD

```yaml
# .github/workflows/release.yml
on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: tauri-apps/tauri-action@v0
```
