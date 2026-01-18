# Get-Shit-Done Forks Analysis Report

**Analysis Date:** 2026-01-17
**Original Repository:** glittercowboy/get-shit-done
**Total Forks Analyzed:** 428

## Executive Summary

Out of 428 forks analyzed, **3 forks (0.7%)** have added OpenCode support.

## Analysis Status
- Total forks analyzed: 428/428 (100%)
- Forks with OpenCode support: 3
- Forks without OpenCode support: 425
- Analysis completion: ✓ COMPLETE

## Methodology

For each fork, the following checks were performed via GitHub API:
1. **File tree analysis**: Searched for files/directories with "opencode" in the path
2. **Commit message search**: Analyzed last 100 commits for "opencode" mentions
3. **Branch name search**: Checked for branches with "opencode" in the name

All API calls were made using `gh` CLI to avoid rate limits and ensure authenticated access.

---

## Forks with OpenCode Support

### 1. brianjmeier/get-shit-done-jj

**URL:** https://github.com/brianjmeier/get-shit-done-jj

**OpenCode Implementation:**
- Full adapter structure under `adapters/opencode/`
- Contains 22+ command files for GSD functionality
- Includes README and .gitkeep files for structure

**Files Found:**
```
adapters/opencode
adapters/opencode/README.md
adapters/opencode/command
adapters/opencode/command/gsd
adapters/opencode/command/gsd/.gitkeep
adapters/opencode/command/gsd/add-phase.md
adapters/opencode/command/gsd/add-todo.md
adapters/opencode/command/gsd/audit-milestone.md
adapters/opencode/command/gsd/check-todos.md
adapters/opencode/command/gsd/complete-milestone.md
adapters/opencode/command/gsd/create-roadmap.md
adapters/opencode/command/gsd/debug.md
adapters/opencode/command/gsd/define-requirements.md
adapters/opencode/command/gsd/discuss-milestone.md
adapters/opencode/command/gsd/discuss-phase.md
adapters/opencode/command/gsd/execute-phase.md
adapters/opencode/command/gsd/execute-plan.md
adapters/opencode/command/gsd/help.md
adapters/opencode/command/gsd/insert-phase.md
adapters/opencode/command/gsd/list-phase-assumptions.md
... (and more)
```

**Commits:**
```
2ae3901: feat(opencode): port 22 missing commands from Claude Code adapter
353ca45: feat(opencode): add map-codebase command
```

**Analysis:**
This fork has the most comprehensive OpenCode implementation with a complete command structure ported from Claude Code adapter. It includes 22+ GSD commands organized in the OpenCode adapter format.

---

### 2. evilbuck/get-shit-done

**URL:** https://github.com/evilbuck/get-shit-done

**OpenCode Implementation:**
- Work in progress with feature branches
- Two branches dedicated to OpenCode integration

**Branches Found:**
```
feat/opencode-integration
fix/opencode-implementation
```

**Analysis:**
This fork shows active development toward OpenCode support through dedicated feature branches. No files in main branch yet, suggesting work is still in progress or not yet merged.

---

### 3. rafaelreis-r/get-shit-done

**URL:** https://github.com/rafaelreis-r/get-shit-done

**OpenCode Implementation:**
- Configuration files in `.opencode/` directory
- TypeScript plugin and tool implementations
- Installation/uninstallation scripts

**Files Found:**
```
.opencode
.opencode/plugin
.opencode/plugin/gsd.ts
.opencode/tool
.opencode/tool/gsd.ts
bin/install-opencode.js
bin/uninstall-opencode.js
```

**Commits:**
```
726d611: feat: allow external_directory in opencode config
db7c805: fix: tolerate invalid opencode config
15b5a1e: fix: inline gsd command templates for opencode
3f92385: feat: register gsd commands in opencode config
3f96109: fix: return string output for opencode tools
```

**Analysis:**
This fork has a mature OpenCode integration with TypeScript implementations, dedicated configuration directory, and proper install/uninstall scripts. Multiple commits show iterative improvements to the OpenCode integration including config handling, command registration, and tool output formatting.

---

## Summary of OpenCode Implementations

| Fork | Status | Implementation Type | Commands/Files |
|------|--------|-------------------|----------------|
| brianjmeier/get-shit-done-jj | Complete | Adapter-based | 22+ command files |
| evilbuck/get-shit-done | In Progress | Branch-based | Work in feature branches |
| rafaelreis-r/get-shit-done | Complete | Plugin-based | TypeScript plugin/tool + install scripts |

## Key Findings

1. **Low adoption rate**: Only 0.7% of forks have added OpenCode support
2. **Two implementation approaches**:
   - **Adapter-based** (brianjmeier): Commands as markdown files in adapter directory
   - **Plugin-based** (rafaelreis-r): TypeScript implementations with config system
3. **Active development**: At least one fork (evilbuck) shows ongoing work
4. **Most complete**: brianjmeier/get-shit-done-jj has ported all 22+ GSD commands
5. **Most integrated**: rafaelreis-r/get-shit-done has proper install/config infrastructure

---

## Deep Dive: rafaelreis-r/get-shit-done vs. This Repository

### Overview Comparison

| Aspect | rafaelreis-r/get-shit-done | This Repository (evilbuck) |
|--------|---------------------------|---------------------------|
| **Version** | 1.3.31 | 1.5.15 |
| **Last Updated** | 2026-01-10 | 2026-01-17 (ongoing) |
| **OpenCode Commands** | 21 commands | 28 commands |
| **OpenCode Agents** | 2 agents (auto-generated) | 4 dedicated agents |
| **Plugin Architecture** | TypeScript plugin + tool | Markdown commands only |
| **Install Script** | Dedicated `install-opencode.js` | Unified `install.js` with multi-agent support |

---

### What rafaelreis-r Does Better

#### 1. **Native OpenCode Plugin Integration (TypeScript)**

rafaelreis-r implements a sophisticated TypeScript plugin system that deeply integrates with OpenCode's architecture:

**`.opencode/plugin/gsd.ts`** (217 lines):
- **Event Handling**: Intercepts `tui.command.execute` events to parse `gsd` commands from the TUI
- **Message Transform**: Uses `experimental.chat.messages.transform` hook to inject GSD prompts into user messages
- **Session Compacting**: Hooks into `experimental.session.compacting` to preserve planning context during session compaction
- **Reference Loading**: Dynamically loads and injects referenced workflows/templates into prompts
- **Planning Context**: Automatically reads and injects PROJECT.md, ROADMAP.md, STATE.md, PLAN.md, SUMMARY.md, ISSUES.md

```typescript
// Key features in plugin:
- parseTuiCommand() - parses "gsd help" or "gsd:help" TUI syntax
- buildInjectedPrompt() - constructs full prompt with references
- resolvePlanningContext() - loads .planning/ files into context
- loadCommandsIndex() - indexes all commands with alias support
```

**`.opencode/tool/gsd.ts`** (112 lines):
- Exposes `list` tool: Lists all available GSD commands
- Exposes `command` tool: Loads a specific command with its references

#### 2. **Automatic Config Registration**

The `install-opencode.js` script automatically:
- Parses existing `opencode.json`/`opencode.jsonc` configs (with comment stripping)
- Registers all GSD commands in the config's `command` section with proper templates
- Sets `external_directory: "allow"` permission
- Creates backup of corrupted configs
- Generates Explore and general-purpose agent definitions

#### 3. **TUI Integration**

Users can type `gsd help` or `gsd new-project` directly in OpenCode's TUI, and the plugin:
1. Intercepts the command
2. Clears the prompt
3. Appends the proper `/gsd:help` slash command
4. Submits automatically

#### 4. **Clean Uninstall Script**

Dedicated `uninstall-opencode.js` that:
- Removes all GSD files from `~/.config/opencode/`
- Cleans up `gsd:*` commands from `opencode.json`
- Removes generated agent files

---

### What This Repository Does Better

#### 1. **More Commands (28 vs 21)**

This repository has 7 additional commands not in rafaelreis-r:

| Command | Description |
|---------|-------------|
| `add-todo.md` | Quick task capture |
| `audit-milestone.md` | Milestone audit workflow |
| `check-todos.md` | Review pending todos |
| `debug.md` | Systematic debugging |
| `define-requirements.md` | Requirements definition |
| `plan-milestone-gaps.md` | Gap analysis for milestones |
| `whats-new.md` | Version changelog display |

rafaelreis-r has these that this repo lacks:
- `consider-issues.md`
- `plan-fix.md`

#### 2. **Dedicated Agent Definitions (4 vs 2)**

This repository ships 4 purpose-built GSD agents:

| Agent | Purpose |
|-------|---------|
| `gsd-executor.md` | Executes phase plans |
| `gsd-integration-checker.md` | Verifies cross-phase integration |
| `gsd-milestone-auditor.md` | Audits milestone completion |
| `gsd-verifier.md` | Validates built features |

rafaelreis-r only generates 2 generic agents (`Explore.md`, `general-purpose.md`) via its install script.

#### 3. **More Recent Updates (v1.5.15 vs v1.3.31)**

This repository is **~45 versions ahead** with significant improvements:
- Milestone audit and verification workflows
- Debugging support with `debug.md` command
- Requirements definition workflow
- Gap analysis workflows
- Enhanced verification patterns

#### 4. **Unified Multi-Agent Installer**

`bin/install.js` supports:
- Interactive agent selection (Claude Code, OpenCode, or both)
- Per-agent location selection (global vs local)
- Custom `--config-dir` for multiple Claude configurations
- Proper path replacement for both platforms

#### 5. **More Extensive Reference Materials**

The `.opencode/gsd/get-shit-done/references/` directory includes additional debugging docs:
- `debugging/debugging-mindset.md`
- `debugging/hypothesis-testing.md`
- `debugging/investigation-techniques.md`
- `debugging/verification-patterns.md`
- `debugging/when-to-research.md`
- `goal-backward.md`
- `verification-patterns.md`

#### 6. **More Templates**

Additional templates not in rafaelreis-r:
- `DEBUG.md`
- `UAT.md`
- `debug-subagent-prompt.md`
- `requirements.md`
- `user-setup.md`
- `verification-report.md`
- `research-project/` directory with 5 templates

---

### Key Technical Differences

#### Plugin Architecture

**rafaelreis-r** uses OpenCode's native plugin system:
```
.opencode/
├── plugin/gsd.ts    # Event hooks, message transforms
├── tool/gsd.ts      # Exposed tools for Claude
```

**This repository** uses markdown commands only:
```
.opencode/
├── command/gsd/     # 28 markdown command files
├── agent/           # 4 agent definitions
├── gsd/             # References, templates, workflows
```

#### Command Registration

**rafaelreis-r**: Commands registered in `opencode.json` at install time with templates
**This repository**: Commands are markdown files that OpenCode reads directly

#### Reference Resolution

**rafaelreis-r**: Plugin dynamically loads `@~/.config/opencode/...` references at runtime
**This repository**: Install script replaces paths during file copy

---

### Recommendation

**This repository (evilbuck) is in a better state overall because:**

1. **More complete command coverage** (28 vs 21 commands)
2. **More recent updates** (v1.5.15 vs v1.3.31, ~45 versions ahead)
3. **Dedicated agent definitions** for specific GSD workflows
4. **Richer reference materials** including debugging guides
5. **Unified installer** supporting multiple agents

**However, rafaelreis-r has one significant advantage:**

The TypeScript plugin provides **deeper OpenCode integration** via:
- Native event hooks
- Message transformation
- Session compaction context preservation
- TUI command parsing

**Potential Enhancement**: Consider porting rafaelreis-r's plugin architecture to this repository to get the best of both worlds - comprehensive command coverage with native plugin integration.

---

## Analysis Complete

Total time: ~15 minutes
Forks checked: 428
OpenCode support found: 3 forks
Analysis method: GitHub API via gh CLI
