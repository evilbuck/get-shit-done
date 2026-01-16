# OpenCode Commands Format (Reference)

This document summarizes the OpenCode custom command format (as used by this repo’s `commands/opencode/` directory) and tracks the implementation plan for converting Claude Code GSD commands to OpenCode commands.

## Source

Primary reference: https://opencode.ai/docs/commands/

## Command file locations (OpenCode)

OpenCode loads custom commands from:

- Global: `~/.config/opencode/command/`
- Per-project: `.opencode/command/`

In this repository, the installer places GSD commands under:

- `.../command/gsd/*.md`

So end users can run them as `/<command>` with the “gsd namespace” determined by directory naming and/or command naming conventions.

## File format

A command is a Markdown file with:

1. A YAML frontmatter block (one block only)
2. A body template (the prompt content)

Example:

```md
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

### Supported frontmatter fields

From the OpenCode docs:

- `description` (string) — shown in the TUI
- `agent` (string) — optional agent to run the command
- `subtask` (boolean) — force subagent execution
- `model` (string) — override model for this command

## Template features

### Arguments

- `$ARGUMENTS` — entire argument string
- `$1`, `$2`, ... — positional arguments

### File references

Use `@path/to/file` to include file contents into the prompt.

### Shell output injection

Use `!\`command\`` to inject command output into the prompt.

## Notes for this repository

### Command naming parity goal

Goal: keep the *user-facing* usage consistent with Claude Code’s command structure (e.g. `/gsd:plan-phase`, `/gsd:execute-plan`).

OpenCode command routing is based on file placement and names, and may not support `:` in command names the same way Claude Code does. We will preserve the Claude “namespace” in:

- The command content/examples (always show `/gsd:<command>`)
- Installer placement under `command/gsd/` so commands are grouped

If OpenCode ultimately requires `/gsd/<command>` rather than `/gsd:<command>`, we will handle that in a later phase by adding explicit aliases or renaming conventions. For now, conversion focuses on correctness and completeness of prompts.

---

# Implementation Plan (Conversion)

This section is a living plan. It will be updated as conversions complete.

## Current state (Jan 16, 2026)

- `commands/gsd/*.md` (Claude Code) are well-structured and complete.
- `commands/opencode/*.md` exist 1:1 by filename (28 total), but many are truncated and/or malformed.
- Many OpenCode command files contain:
  - multiple `---` delimiters (broken frontmatter)
  - duplicated frontmatter blocks
  - unbalanced XML-like tags (`<objective>`, `<process>`, `<offer_next>`, etc.)

## Decision

Rewrite each OpenCode command from scratch, mirroring the Claude Code command’s intent/content, but using valid OpenCode command formatting:

- exactly one YAML frontmatter block
- `agent: general` by default
- body is the prompt template (may include XML-like sections as plain text if helpful, but must be syntactically balanced if present)

## Steps

1. Create `docs/opencode-5.2-commands-conversion.md` checklist for all commands.
2. For each command in `commands/gsd/`:
   - Compare with `commands/opencode/` version.
   - Rewrite `commands/opencode/<cmd>.md` as a clean OpenCode command.
   - Ensure only one frontmatter block and no malformed tag structure.
   - Mark command as completed in the checklist.
3. Spot check install path conventions (later phase): ensure commands are callable in OpenCode as close as possible to `/gsd:<command>`.

## Progress

- Not started.
