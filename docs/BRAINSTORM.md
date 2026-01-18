# OpenTiller Brainstorming Document

> Ideas, alternatives, and refinements for vocabulary, methodology, and UX

## 1. The APPER Methodology

### Current: APPER

| Letter | Phase | Action |
|--------|-------|--------|
| A | Analyze | Write to backlogs |
| P | Prioritize | Select ideas |
| P | Plan | Organize roadmap |
| E | Execute | Run agents |
| R | Review | Validate & merge |

**Strengths:**
- Memorable acronym
- Clear progression
- Covers the full lifecycle

**Potential Issues:**
- Two "P"s might be confusing
- "Analyze" for writing to backlogs feels slightly off (analyzing usually means reading, not writing)

### Alternative Ideas

#### Option A: GATHER (focus on the harvest metaphor - "Tiller")

| Letter | Phase | Action |
|--------|-------|--------|
| G | Gather | Collect ideas from sources |
| A | Assess | Evaluate and prioritize |
| T | Task | Create actionable tasks |
| H | Harvest | Execute with agents |
| E | Examine | Review results |
| R | Release | Merge and ship |

**Pros:** Plays on the "Tiller" (farming) metaphor
**Cons:** 6 letters, "Harvest" for execution is a stretch

#### Option B: SPARK

| Letter | Phase | Action |
|--------|-------|--------|
| S | Source | Collect from backlogs |
| P | Pick | Prioritize what matters |
| A | Arrange | Plan dependencies |
| R | Run | Execute agents |
| K | Keep/Kill | Review and decide |

**Pros:** 5 letters, punchy, action-oriented
**Cons:** "Keep/Kill" might feel aggressive

#### Option C: DRAFT (writing metaphor)

| Letter | Phase | Action |
|--------|-------|--------|
| D | Discover | Find ideas in backlogs |
| R | Rank | Prioritize |
| A | Arrange | Plan the roadmap |
| F | Fire | Launch agents |
| T | Tidy | Review and clean up |

**Pros:** Writing/drafting metaphor fits creation
**Cons:** "Fire" and "Tidy" feel weak

#### Option D: PILOT (aviation metaphor)

| Letter | Phase | Action |
|--------|-------|--------|
| P | Plan | Define the flight path (roadmap) |
| I | Intake | Collect tasks from sources |
| L | Launch | Start agents |
| O | Observe | Monitor execution |
| T | Touchdown | Review and land (merge) |

**Pros:** Strong metaphor, "Pilot" = being in control
**Cons:** Order isn't quite right

### My Recommendation

**Stick with APPER** but refine the descriptions:

| Letter | Phase | Refined Action |
|--------|-------|----------------|
| A | **Accumulate** | Gather ideas from all sources |
| P | **Prioritize** | Choose what matters most |
| P | **Plan** | Organize into actionable roadmap |
| E | **Execute** | Launch agents to build |
| R | **Review** | Validate, approve, merge |

The double-P isn't a problem - it emphasizes that prioritization and planning are distinct, important steps. Like "PPE" (Personal Protective Equipment), people remember it.

**Alternative single-word change**: Replace first "A" with "I" for **IPPER** ("Input" ideas) - but APPER sounds better phonetically.

---

## 2. Vocabulary Refinements

### Current Terms Review

| Term | Verdict | Notes |
|------|---------|-------|
| **Workspace** | ✅ Keep | Universal, clear |
| **Repository** | ✅ Keep | Standard git term |
| **Backlog Source** | ⚠️ Consider | A bit long |
| **Backlog** | ✅ Keep | Standard agile term |
| **Idea** | ⚠️ Consider | Might be too vague |
| **Task** | ✅ Keep | Clear and actionable |
| **Run** | ⚠️ Consider | Could be confused with "running" |
| **Session** | ✅ Keep | Clear |
| **Worktree** | ✅ Keep | Git standard |

### Alternative Suggestions

#### "Backlog Source" → **"Source"** or **"Feed"**

- "Source" is shorter: "GitHub Source", "Linear Source"
- "Feed" emphasizes real-time updates: "GitHub Feed"

**Recommendation**: Use **"Source"** - shorter, cleaner.

#### "Idea" → **"Item"** or **"Entry"** or keep **"Idea"**

Options:
1. **Idea** - Creative, encourages thinking big
2. **Item** - Neutral, standard
3. **Entry** - Generic
4. **Ticket** - Common in dev but feels corporate
5. **Request** - Good for customer feedback

**Recommendation**: Keep **"Idea"** - it's intentionally creative and fits the APPER "Analyze" phase.

#### "Run" → **"Execution"** or **"Job"**

- "Run" as a noun is a bit odd ("I started a run")
- "Execution" is clearer but longer
- "Job" is familiar (CI/CD)

**Recommendation**: Change to **"Job"** - familiar, unambiguous.

Updated flow: Task → Job → Sessions → Worktrees

#### New Term: "Lane" for Roadmap Columns

Instead of "Column 0", "Column 1", use **"Lane"**:
- "Tasks in the same lane can run in parallel"
- "Move this task to the next lane"

More visual and fits the roadmap metaphor.

---

## 3. Onboarding Gamification Ideas

### Achievement System

Introduce achievements to encourage exploration:

| Achievement | Trigger | Reward |
|-------------|---------|--------|
| 🌱 First Seed | Create first workspace | Unlock custom themes |
| 🚜 Parallel Farmer | Run 3 agents simultaneously | Badge |
| 📋 Source Collector | Connect 3 backlog sources | Badge |
| ⚡ Speed Runner | Complete task < 2 minutes | Badge |
| 🔍 Code Detective | Find security issue with auto-scan | Badge |
| 🎯 Perfect Review | Approve on first review 5 times | Badge |
| 🌾 First Harvest | Merge first PR | Confetti animation |

### Progress Indicators

Show APPER progress visually:

```
APPER Progress
[A]━━━[P]━━━[P]━━━[E]━━━[R]
 ✓     ✓     ◉     ○     ○
```

### Daily/Weekly Stats

```
This Week's Harvest
━━━━━━━━━━━━━━━━━━━━━━━━━
  12 Tasks completed
  847 Lines generated
  3.2 Hours saved (estimated)
  5 PRs merged
```

---

## 4. Feature Prioritization for MVP

### Must Have (Phase 1 MVP)

1. **Workspace creation** with GitHub repo cloning
2. **Local backlog** (manual task creation)
3. **Roadmap view** (graph or list)
4. **Single agent execution** (one session at a time)
5. **Basic diff viewer**
6. **Settings** (language, theme)

### Should Have (Phase 1 Complete)

7. Parallel agent execution
8. Worktree management
9. Checkpoint/revert system
10. GitHub Issues backlog source
11. PR creation workflow

### Could Have (Phase 2)

12. Linear/Notion integration
13. Speech-to-text
14. Automated suggestions
15. Agent registry with specialized agents

### Won't Have (Yet)

16. Team collaboration
17. Analytics dashboard
18. Plugin system
19. OpenTiller Max (paid tier)

---

## 5. Visual Identity Ideas

### Color Palette

Playing on the "Tiller" (farming) theme:

| Color | Hex | Use |
|-------|-----|-----|
| Soil Brown | `#5D4037` | Backgrounds |
| Growth Green | `#4CAF50` | Success, done |
| Harvest Gold | `#FFC107` | Needs attention |
| Sky Blue | `#2196F3` | Running, active |
| Sunset Orange | `#FF5722` | Errors, warnings |

### Logo Concepts

1. **Stylized tiller/plow** turning earth
2. **Code brackets `{ }` forming a plant** growing
3. **Abstract "O" and "T"** interlinked with growth lines
4. **Robot farmer** - cute mascot approach

### App Icon

- Simple, recognizable at small sizes
- Works in dark and light modes
- Farming + tech fusion

---

## 6. Keyboard Shortcuts Philosophy

Power users should be able to do everything with keyboard:

| Action | Shortcut |
|--------|----------|
| Open command palette | `Cmd/Ctrl + K` |
| New task (chat) | `Cmd/Ctrl + N` |
| Switch to Roadmap | `Cmd/Ctrl + 1` |
| Switch to Backlog | `Cmd/Ctrl + 2` |
| Switch to Settings | `Cmd/Ctrl + ,` |
| Execute selected task | `Cmd/Ctrl + Enter` |
| Execute all in lane | `Cmd/Ctrl + Shift + Enter` |
| Open selected task | `Enter` |
| Navigate tasks | `Arrow keys` |
| Quick search | `/` |

---

## 7. Competitor Differentiation

### vs Conductor

| Feature | Conductor | OpenTiller |
|---------|-----------|------------|
| Platform | macOS only | Cross-platform |
| Source | Closed | Open |
| "Before" phase | ❌ | ✅ (Planning) |
| Backlog integrations | ❌ | ✅ |
| Price | Paid | Free |

### vs Cursor/IDE

| Feature | Cursor | OpenTiller |
|---------|--------|------------|
| Focus | Writing code | Supervising agents |
| Parallel agents | ❌ | ✅ |
| Roadmap/planning | ❌ | ✅ |
| Git worktrees | ❌ | ✅ |
| Backlog integration | ❌ | ✅ |

### vs Linear/Jira

| Feature | Linear/Jira | OpenTiller |
|---------|-------------|------------|
| Focus | Project management | AI execution |
| Code execution | ❌ | ✅ |
| Git integration | Basic | Deep (worktrees) |
| Target | Teams | Developers + AI |

---

## 8. Open Questions to Resolve

1. **Pricing model for "OpenTiller Max"**
   - What features are premium?
   - Subscription or one-time?
   - Team vs individual plans?

2. **Agent permission model**
   - How granular should permissions be?
   - Should users be able to define custom permissions?

3. **Multi-workspace workflow**
   - Can tasks span multiple workspaces?
   - How to handle cross-workspace dependencies?

4. **Offline support**
   - Can OpenTiller work offline?
   - How to sync when back online?

5. **Mobile companion app**
   - Worth building?
   - What features would it have?

---

## 9. Community Building Ideas

### Open Source Strategy

1. **Transparent roadmap** on GitHub
2. **RFC process** for major decisions
3. **Weekly development streams** on YouTube/Twitch
4. **Discord server** for community
5. **Contributor recognition** in README

### Content Strategy

1. **Blog posts** on AI-assisted development
2. **Video tutorials** for each feature
3. **Case studies** from early adopters
4. **Conference talks** about the vision

---

## Decisions Made ✅

The following vocabulary changes have been **approved and applied** to all documentation:

| Change | Status |
|--------|--------|
| Keep **APPER** with "Analyze" → **"Accumulate"** | ✅ Applied |
| "Backlog Source" → **"Source"** | ✅ Applied |
| "Run" → **"Job"** | ✅ Applied |
| "Column" → **"Lane"** for roadmap | ✅ Applied |

## Future Considerations

The following ideas are noted for future implementation:

1. 🎮 Add **achievement system** for onboarding
2. 📊 Add **weekly stats** for engagement
3. ⌨️ Comprehensive **keyboard shortcuts**
4. 🎨 Visual identity (farming theme colors, logo concepts)

## Alternative Methodologies (Archived)

The following alternatives to APPER were considered but not selected. They are preserved here for reference:

- **PILOT** (Plan, Intake, Launch, Observe, Touchdown) - aviation metaphor
- **SPARK** (Source, Pick, Arrange, Run, Keep/Kill) - action-oriented
