# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenTiller is a cross-platform desktop app for supervising AI coding agents. Built with **Tauri 2.0 (Rust) + React 19 + TypeScript + TailwindCSS 4**.

The app follows the **APPER** workflow: **A**ccumulate → **P**rioritize → **P**lan → **E**xecute → **R**eview.

## Commands

```bash
# Development
pnpm dev              # Start Vite dev server (frontend only)
pnpm tauri dev        # Start full Tauri app in dev mode

# Build
pnpm build            # Build frontend (tsc + vite)
pnpm tauri build      # Build production desktop app

# Lint
pnpm lint             # Run ESLint
```

## Architecture

### Frontend → Backend Communication

React calls Rust via Tauri IPC:
```typescript
import { invoke } from '@tauri-apps/api/core';
const workspace = await invoke<Workspace>('create_workspace', { name: 'My Project' });
```

Real-time updates via Tauri events:
```typescript
import { listen } from '@tauri-apps/api/event';
await listen<SessionOutput>('session:output', (event) => { ... });
```

### Data Flow

```
User Actions → Zustand Store → invoke() → Rust Commands → File System / Git
                    ↑                              ↓
                    └──────── listen() ────────────┘
```

### User Data Location

All user data lives in `~/opentiller/`:
- `config.json` - Global settings, last workspace
- `local-backlog/` - Local task storage
- `workspaces/{id}/` - Workspace data, repos, worktrees, roadmap

### Core Domain Types (`src/types/index.ts`)

- **Workspace** → contains Repositories, Backlogs, Settings
- **Backlog** → source of Ideas (GitHub Issues, Linear, local, etc.)
- **Idea** → raw item from a backlog, not yet planned
- **Task** → an Idea promoted to the roadmap with dependencies
- **Run** → execution of a Task, contains Sessions
- **Session** → Claude Code instance in an isolated git worktree

## Code Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `TaskCard.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-workspace.ts`)
- Stores: `kebab-case-store.ts` (e.g., `workspace-store.ts`)
- Types: files in `src/types/`, interfaces in PascalCase

### i18n
All user-facing strings use `t()` from react-i18next:
```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
return <span>{t('task-card.status')}</span>;
```
Translation keys: kebab-case (e.g., `roadmap.execute-all`).

### Styling
TailwindCSS 4 utility classes. Use `cn()` from `src/lib/utils.ts` to merge classes:
```typescript
import { cn } from '@/lib/utils';
<div className={cn('p-4', isActive && 'bg-blue-500')} />
```

## Key Behaviors

1. **Never delete data** - Always archive. Worktrees create WIP commits before cleanup.
2. **Secrets in Stronghold** - Never plaintext in config files. Use Tauri Stronghold.
3. **Agent prompts in English** - Even for non-English users, prompts stay in English with language instruction appended.

## Documentation

| Document | Purpose |
|----------|---------|
| `docs/PRD.md` | Product requirements, features |
| `docs/GLOSSARY.md` | Complete vocabulary |
| `docs/UX-FLOWS.md` | ASCII wireframes |
| `docs/ARCHITECTURE.md` | Technical design |
| `docs/ROADMAP.md` | Implementation milestones |

## Current Status

**Milestone 0: Foundation** - In Progress. See `docs/ROADMAP.md` for details.
