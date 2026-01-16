---
description: Capture idea or task as todo from current conversation context
agent: general
---

<objectives>
Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work.

Enables "thought → capture → continue" flow without losing context or derailing current work.
</objectives>

<process>

1. **Ensure directory structure exists:**
   ```bash
   mkdir -p .planning/todos/pending .planning/todos/done
   ```

2. **Check existing areas for consistency:**
   ```bash
   ls .planning/todos/pending/*.md 2>/dev/null | xargs -I {} grep "^area:" {} 2>/dev/null | cut -d' ' -f2 | sort -u
   ```

3. **Extract content from arguments or conversation:**
   - **With arguments:** Use the provided text as the title/focus
     - Example: `/gsd:add-todo Add auth token refresh` → title = "Add auth token refresh"
   - **Without arguments:** Analyze recent conversation to extract:
     - The specific problem, idea, or task discussed
     - Relevant file paths mentioned
     - Technical details (error messages, line numbers, constraints)

   Formulate the todo with:
   - `title`: 3-10 word descriptive title (action verb preferred)
   - `problem`: What's wrong or why this is needed
   - `solution`: Approach hints or "TBD" if just an idea
   - `files`: Relevant paths with line numbers from conversation

4. **Infer area from file paths:**

   | Path pattern | Area |
   |--------------|------|
   | `src/api/*`, `api/*` | `api` |
   | `src/components/*`, `src/ui/*` | `ui` |
   | `src/auth/*`, `auth/*` | `auth` |
   | `src/db/*`, `database/*` | `database` |
   | `tests/*`, `__tests__/*` | `testing` |
   | `docs/*` | `docs` |
   | `.planning/*` | `planning` |
   | `scripts/*`, `bin/*` | `tooling` |
   | No files or unclear | `general` |

   Use existing areas found in step 2 for consistency.

5. **Check for duplicates:**
   ```bash
   grep -l -i "[key words from title]" .planning/todos/pending/*.md 2>/dev/null
   ```

   If potential duplicates found:
   - Read existing todos to compare scope
   - If overlapping, ask user whether to skip, replace, or add anyway

6. **Create todo file:**
   ```bash
   timestamp=$(date "+%Y-%m-%dT%H:%M")
   date_prefix=$(date "+%Y-%m-%d")
   ```

   Generate slug from title (lowercase, hyphens, no special chars).

   Create `.planning/todos/pending/${date_prefix}-${slug}.md`:

   ```markdown
   ---
   created: [timestamp]
   title: [title]
   area: [area]
   files:
     - [file:lines]
   ---

   ## Problem

   [problem description - enough context for future Claude to understand weeks later]

   ## Solution

   [approach hints or "TBD"]
   ```

7. **Update STATE.md if it exists:**
   - Count todos: `ls .planning/todos/pending/*.md 2>/dev/null | wc -l`
   - Update "### Pending Todos" section under "## Accumulated Context"

8. **Commit changes:**
   ```bash
   git add .planning/todos/pending/[filename]
   [ -f .planning/STATE.md ] && git add .planning/STATE.md
   git commit -m "$(cat <<'EOF'
   docs: capture todo - [title]

   Area: [area]
   EOF
   )"
   ```

<step name="confirm">
```
Todo saved: .planning/todos/pending/[filename]

  [title]
  Area: [area]
  Files: [count] referenced

---

Would you like to:

1. Continue with current work
2. Add another todo
3. View all todos (/gsd:check-todos)
```
</step>

</process>

<output>
- `.planning/todos/pending/[date]-[slug].md`
- Updated `.planning/STATE.md` (if exists)
</output>

<anti_patterns>
- Don't create todos for work already in current plan (that's deviation rule territory)
- Don't create elaborate solution sections — capture ideas, not detailed plans
- Don't block on missing information — "TBD" is fine

<success_criteria>
- [ ] Directory structure exists
- [ ] Todo file created with valid frontmatter
- [ ] Problem section has enough context for future Claude
- [ ] No duplicates (checked and resolved)
- [ ] Area consistent with existing todos
- [ ] STATE.md updated if exists
- [ ] Todo and state committed to git
</success_criteria>

<!-- Claude Code format - commented out for conversion

<!-- Claude Code format - commented out for conversion
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
-->
-->
