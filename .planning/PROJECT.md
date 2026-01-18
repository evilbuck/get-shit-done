# GSD (Get Shit Done)

## What This Is

A structured planning and execution framework for Claude Code that transforms vague ideas into shipped software through systematic workflows. GSD provides commands, templates, and agents that guide users from project inception through milestone completion.

## Core Value

Claude can take a user from idea to working software without getting lost, going in circles, or missing requirements.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- Parallel phase execution with intelligent dependency analysis — v1.5
- Parallel-aware planning with vertical slices — v1.5
- YAML frontmatter for automatic context assembly — v1.5
- /gsd:verify-work for user acceptance testing — v1.5
- /gsd:whats-new for version discovery — v1.5
- CHANGELOG.md foundation — v1.5
- Improved roadmap system — v1.5
- TDD guidance integration — v1.5
- Plan-phase context optimizations — v1.5

### Active

<!-- Current scope. Building toward these. -->

(To be defined in new milestone)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Real-time collaboration — GSD is for individual Claude Code sessions
- GUI/web interface — CLI-first, prompt-based interaction

## Context

GSD is distributed via npm (`@anthropics/claude-code-gsd`) and installed into `~/.claude/get-shit-done/`. Users invoke commands via `/gsd:*` slash commands which load prompts that orchestrate workflows.

**Tech stack:**
- Markdown templates and workflows
- Node.js installer (`bin/install.js`)
- Chezmoi integration for dotfiles users

**Deferred from v1.5:**
- 12-02: Publish command update (changelog generation in gsd-publish-version.md)
- Phases 1-3: Brownfield support (/gsd:map-codebase, codebase documents)

## Constraints

- **Distribution**: npm package, installs to ~/.claude/
- **Runtime**: Claude Code CLI environment
- **Context**: Must fit within Claude's context window
- **Patterns**: Follow existing command/workflow/template conventions

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Folder with focused files | Easier to update incrementally than monolithic file | ✓ Good |
| Parallel Explore agents | Thoroughness for initial mapping | ✓ Good |
| Frontmatter dependency graph | Enable automatic context assembly | ✓ Good |
| execute-plan = single, execute-phase = parallel | Clear naming separation | ✓ Good |
| Vertical slices over workflow stages | Maximize parallelization | ✓ Good |

---
*Last updated: 2026-01-17 after v1.5 work pause*
