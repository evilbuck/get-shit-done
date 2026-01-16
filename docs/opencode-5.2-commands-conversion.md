# OpenCode 5.2 Command Conversion Checklist

Purpose: track 1:1 conversion of Claude Code commands in `commands/gsd/` to OpenCode commands in `commands/opencode/`.

Rules for “done”:

- OpenCode file has exactly one YAML frontmatter block (two `---` delimiters total)
- Frontmatter has at least `description`; default `agent: general` unless a later decision changes it
- Prompt body mirrors the Claude Code command content (minus Claude-specific frontmatter keys)
- No malformed/unbalanced XML-like tags (if present, tags must be balanced)

## Commands

- [x] `add-phase.md`
- [x] `add-todo.md`
- [x] `audit-milestone.md`
- [x] `check-todos.md`
- [x] `complete-milestone.md`
- [x] `create-roadmap.md`
- [x] `debug.md`
- [x] `define-requirements.md`
- [x] `discuss-milestone.md`
- [x] `discuss-phase.md`
- [x] `execute-phase.md`
- [x] `execute-plan.md`
- [x] `help.md`
- [x] `insert-phase.md`
- [x] `list-phase-assumptions.md`
- [x] `map-codebase.md`
- [x] `new-milestone.md`
- [x] `new-project.md`
- [x] `pause-work.md`
- [x] `plan-milestone-gaps.md`
- [x] `plan-phase.md`
- [x] `progress.md`
- [x] `remove-phase.md`
- [x] `research-phase.md`
- [x] `research-project.md`
- [x] `resume-work.md`
- [x] `verify-work.md`
- [x] `whats-new.md`
