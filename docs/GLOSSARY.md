# OpenTiller Glossary

> A comprehensive vocabulary guide for OpenTiller users and contributors

## Core Concepts

### Workspace

A **Workspace** is the top-level container in OpenTiller. It holds everything needed for a development project or set of related projects.

**Contains:**
- One or more Repositories
- Multiple Sources
- A single Roadmap
- Secure storage (Stronghold) for API keys and secrets

**Location:** `~/opentiller/workspaces/{id}/`

**Example:** A workspace for "MyStartup" might contain the backend, frontend, and mobile repositories, with sources from GitHub Issues and Linear.

---

### Repository (Repo)

A **Repository** is a git repository cloned into a workspace.

**Location:** `~/opentiller/workspaces/{id}/repos/{repo-name}/`

**Required files:**
- `.opentiller/scope.md` - Project description for agent context
- `.opentiller/hooks.json` - Workflow automation hooks

---

### Source

A **Source** is a connector that retrieves potential work items from external systems.

**Built-in sources:**
- Local Backlog (always present, cannot be removed)
- Automated Suggestions (system-generated maintenance tasks)

**Template-based sources:**
- GitHub Issues
- GitHub Projects
- Linear
- Notion Tasks

**Location:** `~/opentiller/workspaces/{id}/sources/{source-name}/`

**Components:**
- `opentiller.config.json` - Configuration and required variables
- `getList.sh` - Script to fetch items
- `onStatusChange.sh` - Script to sync status changes back

---

### Backlog

The **Backlog** is the combined view of all Ideas from all Sources. It represents the pool of potential work that hasn't been planned yet.

---

### Idea

An **Idea** is a raw work item from a Source. It exists in the backlog but hasn't been promoted to the roadmap yet.

**Properties:**
- Name
- Description
- Tags (for filtering)
- Source (which Source it came from)

**Lifecycle:** Idea → (drag to roadmap) → Task

---

### Task

A **Task** is an Idea that has been promoted to the Roadmap. It has additional planning metadata.

**Properties:**
- All Idea properties, plus:
- Dependencies (other Tasks that must complete first)
- Assigned Repositories
- Assigned Agent permissions
- Auto-start flag

**States:**
- `pending` - Waiting for dependencies or manual start
- `running` - Agent is currently executing
- `review` - Execution complete, awaiting human review
- `done` - Approved and merged
- `canceled` - Abandoned (but archived, not deleted)

---

### Lane

A **Lane** is a vertical column in the roadmap representing a phase of work. Tasks in the same lane can run in parallel because they have no dependencies on each other.

**Properties:**
- Contains zero or more Tasks
- Tasks are ordered vertically
- All tasks in a lane can be started with "Execute all"

**Navigation:**
- Tasks flow from left to right as dependencies are satisfied
- Moving a task to a new lane updates its position in the execution sequence

---

### Job

A **Job** is the execution instance of a Task. When you start a Task, you create a Job.

**Contains:**
- One or more Sessions
- Execution logs
- Result summary
- Statistics (time, tool calls, files modified)

---

### Session

A **Session** is a single Claude Code instance working on a Job. Each Session operates in an isolated Worktree.

**Properties:**
- Associated Worktree
- Agent prompt and permissions
- Real-time status
- Conversation history

---

### Worktree

A **Worktree** is an isolated git working directory. Git's worktree feature allows multiple working directories to share the same repository history while having independent file states.

**Purpose:**
- Prevents agents from interfering with each other
- Allows parallel execution on the same repository
- Enables easy cleanup and rollback

**Cleanup:** Before deletion, creates a "WIP" commit to preserve any uncommitted changes in the branch.

---

## The APPER Cycle

OpenTiller follows the **APPER** methodology - a memorable framework for AI-assisted development:

### **A**ccumulate

**Action:** Gather ideas

Collect potential work from various sources. This includes:
- Importing from external tools (GitHub Issues, Linear, etc.)
- Writing directly to the Local Backlog
- Running Automated Suggestions (security scans, TODO finders)

### **P**rioritize

**Action:** Select ideas

Choose which Ideas deserve attention. Consider:
- Business impact
- Technical dependencies
- Resource availability
- Urgency

### **P**lan

**Action:** Organize roadmap

Convert selected Ideas into Tasks:
- Define dependencies (what must complete first?)
- Assign repositories (which codebases are affected?)
- Set permissions (what can the agent access?)
- Group parallel tasks (what can run simultaneously?)

### **E**xecute

**Action:** Launch agents

Start AI agents to complete planned Tasks:
- Manual execution (click to start)
- Batch execution ("Execute all" for a lane)
- Auto-execution (when dependencies complete)

### **R**eview

**Action:** Validate & merge

Human oversight of agent work:
- Review generated reports
- Inspect diffs and checkpoints
- Approve or request changes
- Merge to main branch

---

## Permissions

Agents operate under a permission system that controls what they can access:

| Permission | Description |
|------------|-------------|
| `repos:read` | Read repository contents |
| `repos:read-write` | Full repository access (read, write, execute, commit) |
| `worktree-agent:create` | Create worktrees and spawn agents |
| `roadmap:read` | View the roadmap |
| `roadmap:read-create` | View and add to the roadmap |

---

## File Artifacts

### Report

When a Task completes, the agent generates `.opentiller/CURRENT_TASK_REPORT.mdx`:

- Summary of changes
- Statistics and metrics
- Visual elements (tables, graphs)
- Localized to user's language

### Scope File

`.opentiller/scope.md` in each repository:

- Project description
- Key technologies
- Important conventions
- Helps agents understand context

### Hooks File

`.opentiller/hooks.json` in each repository:

```json
{
  "onWorkflowInit": { ... },
  "onWorkflowReviewStart": { ... },
  "onWorkflowReviewStop": { ... }
}
```

---

## Status Indicators

### Roadmap Items

| Color | Meaning |
|-------|---------|
| Gray | Pending (not started) |
| Blue | Running (agent working) |
| Yellow | Review needed |
| Green | Done |
| Red | Failed/Canceled |

### Sidebar Items

- Active sessions show real-time status
- "Review now" badge for completed jobs
- Progress indicators for running tasks

---

## Storage Locations

| Path | Contents |
|------|----------|
| `~/opentiller/config.json` | Global settings, last workspace |
| `~/opentiller/local-backlog/` | Local backlog items |
| `~/opentiller/workspaces/` | All workspaces |
| `~/opentiller/workspaces/{id}/config.json` | Workspace settings |
| `~/opentiller/workspaces/{id}/repos/` | Cloned repositories |
| `~/opentiller/workspaces/{id}/sources/` | Source scripts |

---

## Relationships Diagram

```
Workspace
├── Repositories[]
│   ├── .opentiller/scope.md
│   └── .opentiller/hooks.json
├── Sources[]
│   └── Ideas[] → (promote) → Tasks[]
├── Roadmap
│   └── Lanes[]
│       └── Tasks[]
│           └── Jobs[]
│               └── Sessions[]
│                   └── Worktrees[]
└── Stronghold (secrets)
```
