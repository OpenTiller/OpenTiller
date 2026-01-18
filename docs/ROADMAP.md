# OpenTiller Implementation Roadmap

> Phased implementation plan for OpenTiller development

## Overview

This roadmap breaks down the OpenTiller development into manageable milestones. Each milestone delivers working functionality that can be tested and validated.

---

## Milestone 0: Foundation

**Goal**: Establish the core infrastructure and development workflow.

### M0.1 Project Setup
- [x] Initialize Tauri 2.0 project
- [x] Configure TypeScript + React 19
- [x] Set up TailwindCSS 4
- [x] Configure ESLint
- [x] Create documentation structure

### M0.2 Development Infrastructure
- [ ] Set up Zustand stores (skeleton)
- [ ] Configure react-i18next with initial translations (en, fr)
- [ ] Create base UI components (Button, Card, Modal, Input)
- [ ] Set up routing structure
- [ ] Create app shell (sidebar + header + main content)

### M0.3 Tauri Backend Foundation
- [ ] Create Rust module structure
- [ ] Implement basic IPC commands (hello world)
- [ ] Set up Stronghold integration
- [ ] Create file system utilities

**Deliverable**: App launches with a basic shell and can store/retrieve a secret.

---

## Milestone 1: Workspace Management

**Goal**: Users can create and manage workspaces with repositories.

### M1.1 Global Configuration
- [ ] Implement `~/opentiller/config.json` management
- [ ] Create first-launch detection
- [ ] Persist last workspace selection

### M1.2 Workspace CRUD
- [ ] Create workspace creation wizard (UI)
- [ ] Implement workspace storage in `~/opentiller/workspaces/{id}/`
- [ ] Implement workspace listing
- [ ] Implement workspace deletion (archive)
- [ ] Implement workspace switching

### M1.3 Repository Management
- [ ] Implement GitHub repository search (via `gh` CLI)
- [ ] Implement repository cloning with progress
- [ ] Handle clone conflicts (folder renaming)
- [ ] Support manual URL entry
- [ ] Support new repository creation

### M1.4 Prerequisites Check
- [ ] Detect git installation
- [ ] Detect GitHub CLI (`gh`) installation
- [ ] Guide user through installation if missing
- [ ] Check `gh auth status`

**Deliverable**: User can create a workspace, clone repositories from GitHub, and switch between workspaces.

---

## Milestone 2: Settings & i18n

**Goal**: Users can configure preferences and use the app in their language.

### M2.1 Settings UI
- [ ] Create settings page layout
- [ ] Implement General tab (language, theme)
- [ ] Implement Appearance tab (later: custom themes)
- [ ] Implement Integrations tab (API keys)
- [ ] Implement Advanced tab (paths, debugging)

### M2.2 Internationalization
- [ ] Complete English translations
- [ ] Complete French translations
- [ ] Add language switcher
- [ ] Persist language preference

### M2.3 Theme Support
- [ ] Implement light/dark/system theme
- [ ] Persist theme preference
- [ ] Apply theme to all components

**Deliverable**: User can switch languages and themes, settings persist across sessions.

---

## Milestone 3: Local Backlog

**Goal**: Users can manage a local task list.

### M3.1 Local Backlog Storage
- [ ] Implement `~/opentiller/local-backlog/` storage
- [ ] Create Idea data model
- [ ] Implement CRUD operations for Ideas

### M3.2 Backlog UI
- [ ] Create backlog panel component
- [ ] Implement idea card component
- [ ] Add quick-add input (chat bar)
- [ ] Implement idea editing
- [ ] Implement idea deletion

### M3.3 Filtering & Search
- [ ] Add tag support to Ideas
- [ ] Implement tag filtering
- [ ] Implement text search

**Deliverable**: User can add, edit, delete, and filter ideas in the local backlog.

---

## Milestone 4: Roadmap View

**Goal**: Users can plan and organize tasks visually.

### M4.1 Roadmap Data Model
- [ ] Create Task data model (extends Idea)
- [ ] Create Lane data model
- [ ] Implement `roadmap.json` storage
- [ ] Implement dependency graph logic

### M4.2 Roadmap UI - List View
- [ ] Create roadmap page layout
- [ ] Implement list view with lanes
- [ ] Implement task card with status indicators
- [ ] Show dependency arrows

### M4.3 Drag & Drop
- [ ] Implement drag from backlog to roadmap
- [ ] Implement drag between lanes
- [ ] Implement task reordering within lane
- [ ] Show drop zones

### M4.4 Task Configuration
- [ ] Create task configuration modal
- [ ] Implement dependency selection
- [ ] Implement repository assignment
- [ ] Implement auto-start toggle

**Deliverable**: User can drag ideas to the roadmap, organize them in lanes, and set dependencies.

---

## Milestone 5: Single Agent Execution

**Goal**: Users can run a single Claude Code agent on a task.

### M5.1 Worktree Management
- [ ] Implement git worktree creation
- [ ] Implement worktree cleanup (with WIP commit)
- [ ] Track worktree ↔ session mapping

### M5.2 Agent Spawning
- [ ] Implement Claude Code process spawning
- [ ] Capture stdout/stderr in real-time
- [ ] Implement session status tracking
- [ ] Handle process termination

### M5.3 Session UI
- [ ] Create sessions sidebar section
- [ ] Show real-time status in task cards
- [ ] Implement session output viewer
- [ ] Add stop session button

### M5.4 Job Management
- [ ] Create Job data model
- [ ] Track job statistics (duration, files modified)
- [ ] Persist job history

**Deliverable**: User can start a single agent on a task, see real-time output, and stop it.

---

## Milestone 6: Basic Review

**Goal**: Users can review and approve agent work.

### M6.1 Diff Viewing
- [ ] Implement git diff retrieval
- [ ] Create diff viewer component
- [ ] Show file-by-file changes
- [ ] Support unified and split view

### M6.2 Review Page
- [ ] Create review page layout
- [ ] Show job summary (intent, duration, stats)
- [ ] List modified files
- [ ] Add approve/reject buttons

### M6.3 Merge Workflow
- [ ] Implement branch management
- [ ] Create merge to main functionality
- [ ] Update task status on merge

**Deliverable**: User can review diffs, approve changes, and merge to main.

---

## Milestone 7: Parallel Execution

**Goal**: Users can run multiple agents simultaneously.

### M7.1 Multi-Session Support
- [ ] Extend agent manager for multiple sessions
- [ ] Handle concurrent worktrees
- [ ] Manage resource limits

### M7.2 Lane Execution
- [ ] Implement "Execute all" for a lane
- [ ] Show multiple active sessions in sidebar
- [ ] Handle batch completion

### M7.3 Auto-Start Dependencies
- [ ] Detect when dependencies complete
- [ ] Auto-start dependent tasks (if enabled)
- [ ] Handle cascading execution

**Deliverable**: User can run multiple agents in parallel and execute entire lanes.

---

## Milestone 8: External Sources

**Goal**: Users can connect external task sources.

### M8.1 Source Framework
- [ ] Create source template system
- [ ] Implement source configuration storage
- [ ] Create source sync mechanism

### M8.2 GitHub Issues Source
- [ ] Create GitHub Issues template
- [ ] Implement issue fetching via `gh`
- [ ] Implement status sync (mark done)

### M8.3 Source UI
- [ ] Create source configuration modal
- [ ] Show source icons in backlog
- [ ] Implement refresh button
- [ ] Show last sync time

**Deliverable**: User can connect GitHub Issues and see them in the backlog.

---

## Milestone 9: Checkpoints & Revert

**Goal**: Users can revert to previous states.

### M9.1 Checkpoint System
- [ ] Create checkpoint on each agent turn
- [ ] Store checkpoint metadata
- [ ] Link checkpoints to git commits

### M9.2 Checkpoint UI
- [ ] Show checkpoint list in review page
- [ ] Add "View at checkpoint" button
- [ ] Add "Revert to checkpoint" button

### M9.3 Revert Implementation
- [ ] Implement git reset to checkpoint
- [ ] Handle partial reverts
- [ ] Preserve later work in new branch

**Deliverable**: User can view and revert to any checkpoint during review.

---

## Milestone 10: PR Workflow

**Goal**: Users can create and manage pull requests.

### M10.1 PR Creation
- [ ] Create PR creation modal
- [ ] Auto-generate PR title and description
- [ ] Support template customization

### M10.2 GitHub Integration
- [ ] Implement PR creation via `gh`
- [ ] Link PR URL to task
- [ ] Show PR status in task card

### M10.3 Merge from PR
- [ ] Detect PR merge
- [ ] Update task status automatically
- [ ] Clean up worktree after merge

**Deliverable**: User can create PRs directly from OpenTiller and track their status.

---

## Future Milestones

### Milestone 11+: Advanced Features

- Speech-to-text (Deepgram integration)
- Automated Suggestions source
- Agent Registry with specialized agents
- Report generation
- Hooks system (`.opentiller/hooks.json`)
- More external sources (Linear, Notion, Jira)
- Team collaboration features
- Analytics dashboard

---

## Progress Tracking

| Milestone | Status | Target |
|-----------|--------|--------|
| M0: Foundation | 🟡 In Progress | - |
| M1: Workspace Management | ⚪ Not Started | - |
| M2: Settings & i18n | ⚪ Not Started | - |
| M3: Local Backlog | ⚪ Not Started | - |
| M4: Roadmap View | ⚪ Not Started | - |
| M5: Single Agent Execution | ⚪ Not Started | - |
| M6: Basic Review | ⚪ Not Started | - |
| M7: Parallel Execution | ⚪ Not Started | - |
| M8: External Sources | ⚪ Not Started | - |
| M9: Checkpoints & Revert | ⚪ Not Started | - |
| M10: PR Workflow | ⚪ Not Started | - |

---

## Branch Strategy

Each milestone should be developed in a dedicated branch:

```
main
├── docs/documentation     ← Current branch (you are here)
├── m0/foundation
├── m1/workspace-management
├── m2/settings-i18n
├── m3/local-backlog
└── ...
```

This allows parallel work and clean merges.
