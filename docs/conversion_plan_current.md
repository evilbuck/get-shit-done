# OpenCode 5.2 Command Conversion — Current Plan

This file is **state management** for the conversion effort.

Instruction: **After each command conversion, clear context and reload this plan file** to continue consistently.

---

## Fresh Context Restart Checklist

Use this when starting from scratch in a new chat/context window.

1. Clear context (`/clear`).
2. Load this file into context: `@docs/conversion_plan_current.md`.
3. Convert the command listed under **Next command to convert** by following the **Conversion plan** section.
4. Validate the command file:
   - It has exactly one frontmatter block: `rg '^---$' commands/opencode/<cmd>.md` returns exactly 2 matches.
   - XML-like tags are balanced (every opening tag has a closing tag).
5. Update state for the next restart:
   - Add the converted command to **Progress so far** with a 1-line note.
   - Update **Next command to convert** to the next checklist entry.
   - Mark the command as `[x]` in `docs/opencode-5.2-commands-conversion.md`.
   - Update the session todo list (`todowrite`): mark the command todo `completed`, set the next one `in_progress`.
6. Clear context again and repeat.

---

## Progress so far (completed conversions)

- `commands/opencode/add-phase.md` — Rewritten to mirror `commands/gsd/add-phase.md`; fixed tag drift and ensured only one frontmatter block.
- `commands/opencode/add-todo.md` — Rewritten to mirror `commands/gsd/add-todo.md`; restored missing `<context>` and removed duplicated trailing content.
- `commands/opencode/audit-milestone.md` — Rewritten to mirror `commands/gsd/audit-milestone.md`; avoided body `---` collisions by using ` ---` inside code blocks.
- `commands/opencode/check-todos.md` — Rewritten to mirror `commands/gsd/check-todos.md`; removed extra frontmatter and removed injected OpenCode shell syntax (`!\`...\``) so body matches source.
- `commands/opencode/complete-milestone.md` — Rewritten to mirror `commands/gsd/complete-milestone.md`; fixed duplicated/broken frontmatter and normalized `{{version}}` usage to `$ARGUMENTS`.
- `commands/opencode/create-roadmap.md` — Rewritten to mirror `commands/gsd/create-roadmap.md`; changed `agent` to `general` and avoided body `---` collisions by using ` ---` inside the example output.
- `commands/opencode/debug.md` — Rewritten to mirror `commands/gsd/debug.md`; removed broken/duplicated frontmatter and restored a single `agent: general` block.
- `commands/opencode/define-requirements.md` — Rewritten to mirror `commands/gsd/define-requirements.md`; removed duplicated frontmatter and fixed body `---` collisions.
- `commands/opencode/discuss-milestone.md` — Rewritten to mirror `commands/gsd/discuss-milestone.md`; removed duplicated `agent: general` lines after frontmatter.
- `commands/opencode/discuss-phase.md` — Rewritten to mirror `commands/gsd/discuss-phase.md`; removed duplicated `agent: general` lines after frontmatter.
- `commands/opencode/execute-phase.md` — Rewritten to mirror `commands/gsd/execute-phase.md`; fixed description and removed extra text after frontmatter; changed body `---` to ` ---`.
- `commands/opencode/execute-plan.md` — Rewritten to mirror `commands/gsd/execute-plan.md`; removed extra text after frontmatter; changed body `---` to ` ---`.
- `commands/opencode/help.md` — Rewritten to mirror `commands/gsd/help.md`; restored full reference content that was truncated.

Checklist updated in `docs/opencode-5.2-commands-conversion.md` for the above files.

---

## Current conversion rules (definition of “done”)

- OpenCode command file has exactly one YAML frontmatter block (exactly two `---` lines total).
- Frontmatter includes `description` and defaults to `agent: general`.
- Prompt body mirrors the Claude Code source in `commands/gsd/` (minus Claude-only frontmatter keys like `name`, `argument-hint`, `allowed-tools`, `type`).
- XML-like tags (if present) are balanced and not malformed.

**Known pitfall:** Many prompts include example output blocks containing `---`. If a line is exactly `---` at column 1, it will be mistaken as an extra frontmatter delimiter. Fix by changing those body separators to ` ---` (leading space).

---

## Next command to convert

- `commands/opencode/insert-phase.md`

## Audit summary (expected issues to check)

- Likely duplicated/broken frontmatter and/or drift from `commands/gsd/insert-phase.md`.
- May contain OpenCode-specific injections or path rewrites that cause the body to no longer mirror the Claude source.

## Conversion plan (apply now)

1. Read `commands/gsd/insert-phase.md` and `commands/opencode/insert-phase.md`.
2. Rewrite `commands/opencode/insert-phase.md` from scratch.
3. Use exactly one YAML frontmatter block:
   - `description: ...` (match Claude description)
   - `agent: general`
4. Copy the prompt body from `commands/gsd/insert-phase.md` exactly, except remove Claude-only frontmatter keys.
5. Preserve XML-like tags and keep them balanced.
6. Fix any body lines that are exactly `---` by converting them to ` ---`.
7. Validate:
   - `rg '^---$' commands/opencode/insert-phase.md` returns exactly 2 matches.
   - Basic tag-balance sanity check (visually confirm every opened tag is closed).
8. Mark `insert-phase.md` as completed in `docs/opencode-5.2-commands-conversion.md`.

---

## After completing next command

- Update this file’s **Progress so far** list with the newly completed filename and a 1-line note.
- Update **Next command to convert** to the next checklist item.
- Clear context and reload this plan file.
