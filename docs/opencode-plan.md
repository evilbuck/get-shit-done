# Convert commands to opencode

# Directive

@include ./docs/TODO.md and find out our progress

Keep track of progress and update TODO.md as we progress.

Convert all the commands found in the @./commands/opencode folder to work with opencode command standard. https://opencode.ai/docs/commands/

Use the same name. The same slash command `/gsd:*` structure that claude uses.
Update any references in the converted files to be compatible with opencode expected paths, 
`.opencode/commands`

## Directory

**project commands**

located @./commands/gsd/

These are the development files. When we make changes, we change these files.

**IGNORE**
Ignore the active files in @.opencode/ and .claude/
These are the installed files and are not to be touched by agents. DO NOT UPDATE THESE DIRECTLY
These will be manually updated by re-installing get-shit-done.

**Installer**
- @./bin/install.js

## Phases

### Phase 1

- Create project structure. Maintain backwards compatibility with current structure.
- Generate todo list to keep track of phase state at @docs/TODO.md



# Absolute directives

DO NOT MUTATE PROJECT STRUCTURE
Only additive changes are allowed. We can add a folder, but we cannot rename it or move it.
The same goes for files. Do NOT rename or move. We can symlink if necessary.
