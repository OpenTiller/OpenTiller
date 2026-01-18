# OpenTiller - Product Requirements Document

> **Version**: 0.1.0
> **Status**: Draft
> **Last Updated**: January 2026

## Executive Summary

OpenTiller is an open-source, cross-platform desktop application that transforms how developers interact with AI coding agents. As AI becomes increasingly capable of autonomous code generation, developers need tools designed for **supervision and orchestration** rather than manual coding.

### Taglines

- "The best way to leverage your Claude Code subscription"
- "A new way to build"
- "Stay a developer"
- "Survive 2026"

## Problem Statement

### The Evolution of Development (2020-2026)

| Year | Tool | Developer Role |
|------|------|----------------|
| ~2020 | Classic editors | Writes everything manually |
| 2021 | GitHub Copilot | Validates line-by-line suggestions |
| 2022 | Copilot + comments | Describes intent at file top |
| 2023 | Copilot Chat, Cursor | Dialogues with AI about the project |
| 2024 | Claude-Dev, Aider | Delegates complete tasks |
| 2025 | Claude Code | Supervises an autonomous agent |
| 2026+ | **OpenTiller** | Defines, validates, orchestrates |

### Current Pain Points

1. **Tool Fragmentation**: Developers juggle between:
   - Planning tools (Linear, Jira, Notion, Trello)
   - IDEs with AI integration (Cursor, VS Code + Claude)
   - Git clients (GitHub Desktop, GitKraken, Tower)

2. **Underutilization of AI**: Most developers use AI at 10% of its potential. They could be 10x more efficient by fully delegating.

3. **IDE Mismatch**: Current IDEs are designed for *writing* code, not *supervising* its creation.

4. **Missing "Before" Phase**: Tools like Conductor handle the "during" (agent working) and "after" (review, merge), but lack the "before" (planning, defining what you want).

## Solution: OpenTiller

OpenTiller combines three essential developer needs in one interface:

1. **Task List**: Unified view of tasks from any source
2. **Planning Tool**: Define execution order and dependencies
3. **Git Visualization**: Review changes and manage PRs

## Target Users

### Primary

- **Professional developers** already using AI coding assistants
- Users who want to maximize their Claude Code subscription value

### Secondary

- **Non-technical builders** who use tools like Cursor but never coded before
- Teams looking for collaborative AI-assisted development

## The APPER Methodology

OpenTiller introduces a memorable workflow philosophy (like MongoDB's "ESR rule"):

| Phase | Action | Description |
|-------|--------|-------------|
| **A**ccumulate | Gather ideas | Collect and capture ideas from various sources into backlogs |
| **P**rioritize | Select ideas | Choose the most important items to work on |
| **P**lan | Organize roadmap | Create tasks with dependencies and parallelization |
| **E**xecute | Launch agents | Start AI agents to complete planned tasks |
| **R**eview | Validate & merge | Review changes, approve checkpoints, and merge |

## Core Vocabulary

| Term | Definition |
|------|------------|
| **Workspace** | Container for repositories, sources, and a roadmap. Uses a Tauri Stronghold for secure storage. |
| **Repository** | A git repository cloned into the workspace |
| **Source** | A connector that retrieves potential tasks (GitHub Issues, Linear, Notion, etc.) |
| **Backlog** | The collection of items (Ideas) from all sources |
| **Idea** | A raw item from a backlog, not yet planned |
| **Task** | An Idea promoted to the roadmap, with assigned dependencies and repositories |
| **Lane** | A column in the roadmap representing a phase of work; tasks in the same lane can run in parallel |
| **Job** | The execution of a Task, containing sessions and results |
| **Session** | A Claude Code instance working in an isolated git worktree |
| **Worktree** | An isolated git working directory for a single agent |

## Functional Requirements

### Phase 1: Conductor Reproduction

Replicate the core features of Conductor as an open-source, cross-platform alternative.

#### F1.1 Workspace Management

- **F1.1.1**: First-launch setup wizard
  - Check for git installation, guide through installation if missing
  - GitHub CLI (`gh`) integration for repository listing
  - Support for existing repositories (URL) and new repositories
  - Conflict resolution for duplicate folder names

- **F1.1.2**: Workspace configuration
  - Store config in `~/opentiller/workspaces/{id}/config.json`
  - Secure secrets storage using Tauri Stronghold
  - Last-used workspace persistence in `~/opentiller/config.json`

#### F1.2 Repository Management

- **F1.2.1**: Clone repositories to `~/opentiller/workspaces/{id}/repos/`
- **F1.2.2**: Track clone progress with retry capability
- **F1.2.3**: Support repository folder renaming for conflicts

#### F1.3 Sources

- **F1.3.1**: Built-in "Local Backlog" (cannot be removed)
- **F1.3.2**: Template-based source creation:
  - GitHub Issues
  - GitHub Projects
  - Linear
  - Notion Tasks
  - Custom (from Git repository)

- **F1.3.3**: Each source has:
  - `opentiller.config.json`: Variable names, commands
  - `getList.sh`: Returns `[{name, description, tags}]`
  - `onStatusChange.sh`: Handles status transitions (planned, inProgress, done, canceled)

- **F1.3.4**: "Automated Suggestions" pseudo-backlog:
  - "Analyze code for security issues"
  - "Find TODOs and add to backlog"
  - "Check documentation consistency"
  - Shows "Last run X days ago" to encourage regular execution

#### F1.4 Roadmap

- **F1.4.1**: Two-part interface:
  - **Timeline**: Graph or list view of past/future tasks
  - **Backlog Panel**: Items from all sources

- **F1.4.2**: Task organization:
  - Dependency management (blocking relationships)
  - Parallel execution detection (independent tasks in same lane)
  - Drag-and-drop from backlog to roadmap

- **F1.4.3**: Timeline reconstruction from git merge history

- **F1.4.4**: Chat bar at bottom for quick task creation to Local Backlog

#### F1.5 Task Execution

- **F1.5.1**: "Execute all" button for lane batch execution
- **F1.5.2**: Session management in sidebar
- **F1.5.3**: Real-time status preview in roadmap items
- **F1.5.4**: Auto-start tasks when dependencies complete

#### F1.6 Task Review

- **F1.6.1**: Summary page with:
  - Initial intent
  - Previous state
  - Current state
  - Statistics (files modified, lines written, tool calls, time spent)
  - Visual presentation (tables, graphs)

- **F1.6.2**: Report generation via `setTaskDone` tool:
  - Generate `.opentiller/CURRENT_TASK_REPORT.mdx`
  - User-customizable report preferences
  - Localized to user's language

#### F1.7 Diff Viewer

- **F1.7.1**: Visualize changes per worktree
- **F1.7.2**: Checkpoint snapshots with turn-by-turn revert
- **F1.7.3**: PR creation workflow (issue → code → PR → merge)

#### F1.8 Hooks System

Each repository can have `.opentiller/hooks.json`:

```json
{
  "onWorkflowInit": {
    "copyFiles": ["..."],
    "commands": ["..."]
  },
  "onWorkflowReviewStart": {
    "default": ["cd frontend/ && yarn dev"],
    "frontend": ["cd frontend/ && yarn dev"]
  },
  "onWorkflowReviewStop": {
    "default": ["..."]
  }
}
```

#### F1.9 Scope Definition

Each repository must have `.opentiller/scope.md` describing the project for Claude Code task association.

### Phase 2: Planning Tool Enhancements

#### F2.1 AI-Assisted Planning

- **F2.1.1**: Intelligent task breakdown
- **F2.1.2**: Automated prioritization suggestions
- **F2.1.3**: Dependency graph optimization

#### F2.2 Advanced Backlog Integrations

- **F2.2.1**: Deep integration with:
  - Linear
  - GitHub Projects
  - Notion Databases
  - Jira (planned)
  - Customer feedback tools (Canny, Featurebase)

### Phase 3: Advanced Features

#### F3.1 Speech-to-Text

- **F3.1.1**: Deepgram integration for voice input
- **F3.1.2**: "Fire and forget" recording:
  - User speaks and presses Enter immediately
  - Transcription happens asynchronously
  - Message sent to agent once ready
- **F3.1.3**: User provides own Deepgram API key
- **F3.1.4**: Future: "OpenTiller Max" subscription for managed transcription

#### F3.2 Team Collaboration

- **F3.2.1**: Shared workspaces
- **F3.2.2**: Real-time sync

#### F3.3 Analytics Dashboard

- **F3.3.1**: Productivity metrics
- **F3.3.2**: Agent performance tracking

## Agent Registry

OpenTiller requires a registry of specialized agents with specific prompts and permissions:

| Agent | Trigger | Permissions |
|-------|---------|-------------|
| Workspace Initializer | Workspace creation | `repos:read`, `worktree-agent:create`, `roadmap:read-create` |
| Repository Initializer | Repository addition | `repos:read-write` |
| Backlog Source Initializer | Source creation | `repos:read-write` |
| Task Prioritizer | Manual/scheduled | `roadmap:read-create`, `repos:read` |
| Security Auditor | Manual/scheduled | `roadmap:read-create`, `repos:read` |
| Task Executor | Task start | Variable per task |

## Non-Functional Requirements

### NF1: Internationalization

Support for 11 languages (matching Claude's supported languages):

- English
- French (Français)
- German (Deutsch)
- Spanish (Spain)
- Spanish (Latin America)
- Portuguese (Brazilian)
- Italian
- Japanese (日本語)
- Korean (한국어)
- Hindi (हिन्दी)
- Indonesian (Bahasa Indonesia)

**Note**: Agent prompts remain in English with an appended instruction about the user's language.

### NF2: Cross-Platform

- macOS (primary)
- Windows
- Linux

### NF3: Security

- Secure credential storage via Tauri Stronghold
- No plaintext API keys or secrets

### NF4: Data Persistence

- Nothing is ever truly deleted - always archived
- Worktrees create "WIP" commit before cleanup
- Full history preservation

### NF5: Onboarding

- Gamification elements
- Step-by-step guided setup
- No moment where user feels lost
- Memorable philosophy (APPER) for self-guidance

## Technical Architecture

### Frontend
- React 19
- TypeScript
- TailwindCSS 4
- react-i18next
- Zustand (planned)

### Desktop Runtime
- Tauri 2.0
- Rust backend
- Stronghold for secrets

### File Structure

```
~/opentiller/
├── config.json                    # Global config (last workspace, etc.)
├── local-backlog/                 # Local backlog storage
└── workspaces/
    └── {id}/
        ├── config.json            # Workspace config
        ├── repos/                 # Cloned repositories
        │   └── {repo-name}/
        └── sources/               # Source scripts
            └── {source-name}/
                ├── opentiller.config.json
                ├── getList.sh
                └── onStatusChange.sh
```

## Success Metrics

1. **Adoption**: Number of active users
2. **Efficiency**: Tasks completed per session
3. **Time Saved**: Estimated hours saved via automation
4. **Agent Utilization**: Parallel agent usage patterns

## Open Questions

1. Freemium model details for "OpenTiller Max"
2. Plugin system architecture for Phase 3
3. Mobile companion app - worth building?

## Inspirations

- [Conductor](https://conductor.build/) - The original vision
- [vibe-kanban](https://github.com/BloopAI/vibe-kanban) - Task management for AI agents
- [Crystal](https://github.com/stravu/crystal) - Agent orchestration
- [ralph-claude-code](https://github.com/frankbria/ralph-claude-code) - Claude Code utilities
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - AI-driven specifications
- [Beads](https://github.com/steveyegge/beads) - Git-backed issue tracking

## License Philosophy

Fork it, modify it, make it commercial, change its name - do whatever you want. All that matters is building the future of developer tools together.
