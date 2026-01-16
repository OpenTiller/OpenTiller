# OpenTiller

> "The best way to leverage your Claude Code subscription"

OpenTiller is an open-source tool that reimagines the interface between developers and AI coding agents. It transforms the developer experience from *writing code* to *orchestrating* its creation.

## Vision

As AI agents become increasingly capable, developers are evolving from code writers to code supervisors. OpenTiller embraces this shift by providing:

- **Parallel Agent Management**: Run multiple Claude Code instances simultaneously
- **Worktree Isolation**: Each agent works in its own git worktree
- **Visual Roadmap**: Organize tasks with dependencies and parallel execution
- **Unified Review**: Visualize diffs, checkpoints, and create PRs seamlessly

## The APPER Methodology

OpenTiller introduces the **APPER** cycle for AI-assisted development:

| Phase | Action | Description |
|-------|--------|-------------|
| **A**nalyze | Collect Ideas | Gather tasks from various backlogs (GitHub Issues, Linear, Notion, etc.) |
| **P**rioritize | Select Ideas | Choose the most important items to work on |
| **P**lan | Create Tasks | Organize ideas into a roadmap with dependencies |
| **E**xecute | Start Runs | Launch AI agents to complete tasks |
| **R**eview | Validate & Merge | Review changes, approve, and merge |

## Core Vocabulary

| Term | Description |
|------|-------------|
| **Workspace** | Container with repositories, backlogs, and a roadmap |
| **Backlog** | Source of potential tasks (GitHub Issues, Linear, etc.) |
| **Idea** | Raw item from a backlog, not yet planned |
| **Task** | An Idea promoted to the roadmap, with dependencies |
| **Run** | Execution of a Task (contains sessions and results) |
| **Session** | A Claude Code instance working in a worktree |

## Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS 4
- **Desktop**: Tauri 2.0 (Rust)
- **State**: React hooks (Zustand planned)
- **i18n**: react-i18next (11 languages supported)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Rust (for Tauri)

### Installation

```bash
# Clone the repository
git clone https://github.com/OpenTiller/OpenTiller.git
cd OpenTiller

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, header, etc.
│   ├── roadmap/         # Roadmap visualization
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization
│   └── locales/         # Translation files
├── lib/                 # Utilities
├── mocks/               # Mock data for development
└── types/               # TypeScript type definitions
```

## Supported Languages

- English
- Français
- Deutsch
- Español
- Español (Latinoamérica)
- Português (Brasil)
- Italiano (coming soon)
- 日本語 (coming soon)
- 한국어 (coming soon)
- हिन्दी (coming soon)
- Bahasa Indonesia (coming soon)

## Roadmap

### Phase 1: Conductor Clone (Current)
- [x] Project setup (Tauri + React + TypeScript)
- [x] Core types and vocabulary
- [x] Roadmap visualization (graph view)
- [x] Internationalization setup
- [ ] Task detail panel
- [ ] Backlog view
- [ ] Settings panel
- [ ] Worktree management
- [ ] Agent execution

### Phase 2: Planning Tool
- [ ] Backlog source integrations
- [ ] AI-assisted task breakdown
- [ ] Dependency graph editor
- [ ] Automated prioritization

### Phase 3: Beyond
- [ ] Speech-to-text input (Deepgram)
- [ ] Team collaboration
- [ ] Analytics dashboard
- [ ] Plugin system

## License

This project is open source. Fork it, modify it, make it commercial, change its name - do whatever you want. All that matters is that we build the future of developer tools together.

## Inspirations

- [Conductor](https://conductor.build/) - The original vision
- [vibe-kanban](https://github.com/BloopAI/vibe-kanban) - Task management for AI agents
- [Beads](https://github.com/steveyegge/beads) - Git-backed issue tracking
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - AI-driven specifications
