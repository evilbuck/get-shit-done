# GSD for OpenCode

## Overview

GSD (Get Shit Done) now supports [OpenCode](https://opencode.dev), a modern code editor with advanced agentic AI capabilities. This integration brings GSD's powerful project management and development workflow to OpenCode users, combining GSD's structured approach with OpenCode's intelligent code assistance.

### Key Features

- **Dual Editor Support**: Seamless installation and operation in both Claude Code and OpenCode
- **Agent Integration**: Leverages OpenCode's AI agents for enhanced automation
- **Unified Workflow**: Same GSD commands and processes work across editors
- **Smart Detection**: Automatic editor detection with manual override options

### Architecture

GSD for OpenCode consists of:
- **Editor Detection**: Automatically identifies the running editor environment
- **Command Translation**: Converts GSD commands between Claude's slash format and OpenCode's extension commands
- **Agent Bridge**: Coordinates between GSD's subagent system and OpenCode's agentic features
- **Configuration Management**: Unified settings across both editors

## Installation

### Automatic Installation

GSD detects your editor environment automatically:

```bash
# Install globally (auto-detects editor)
npx get-shit-done-cc --global

# Install locally (auto-detects editor)
npx get-shit-done-cc --local
```

### Manual Editor Selection

Force installation for a specific editor:

```bash
# Force OpenCode installation
npx get-shit-done-cc --global --editor opencode

# Force Claude Code installation
npx get-shit-done-cc --global --editor claude
```

### Custom Configuration Directory

Specify custom config directories:

```bash
# OpenCode with custom directory
npx get-shit-done-cc --global --editor opencode --config-dir ~/.opencode-dev

# Claude Code with custom directory
npx get-shit-done-cc --global --editor claude --config-dir ~/.claude-work
```

### Environment Variables

Use environment variables for configuration:

```bash
# OpenCode configuration
export OPENCODE_CONFIG_DIR=~/.opencode-custom
npx get-shit-done-cc --global

# Claude Code configuration
export CLAUDE_CONFIG_DIR=~/.claude-custom
npx get-shit-done-cc --global
```

## Commands

GSD commands in OpenCode use the `opencode.gsd.*` namespace. All commands from Claude Code are available with the same functionality.

### Core Commands

| Command | Description | Keybinding |
|---------|-------------|------------|
| `opencode.gsd.help` | Show command reference | `Ctrl+Shift+G, Ctrl+Shift+H` |
| `opencode.gsd.newProject` | Initialize new project | `Ctrl+Shift+G, Ctrl+Shift+N` |
| `opencode.gsd.createRoadmap` | Create project roadmap | |
| `opencode.gsd.mapCodebase` | Analyze existing codebase | |
| `opencode.gsd.progress` | Check project status | `Ctrl+Shift+G, Ctrl+Shift+P` |

### Phase Management

| Command | Description |
|---------|-------------|
| `opencode.gsd.planPhase` | Create execution plan for phase |
| `opencode.gsd.executePhase` | Run all plans in phase |
| `opencode.gsd.executePlan` | Execute single plan |
| `opencode.gsd.addPhase` | Add new phase |
| `opencode.gsd.insertPhase` | Insert phase between existing |
| `opencode.gsd.removePhase` | Remove future phase |

### Milestone Management

| Command | Description |
|---------|-------------|
| `opencode.gsd.newMilestone` | Create new milestone |
| `opencode.gsd.completeMilestone` | Archive completed milestone |
| `opencode.gsd.discussMilestone` | Plan next milestone |

### Development Workflow

| Command | Description |
|---------|-------------|
| `opencode.gsd.status` | Check background agent status |
| `opencode.gsd.pauseWork` | Save current session state |
| `opencode.gsd.resumeWork` | Restore previous session |
| `opencode.gsd.debug` | Systematic debugging |
| `opencode.gsd.verifyWork` | User acceptance testing |

### Todo Management

| Command | Description |
|---------|-------------|
| `opencode.gsd.addTodo` | Capture task or idea |
| `opencode.gsd.checkTodos` | Review pending todos |
| `opencode.gsd.considerIssues` | Review deferred issues |

## Agent Integration

OpenCode's agentic capabilities enhance GSD's workflow:

### Task Delegation

GSD automatically delegates appropriate tasks to OpenCode's specialized agents:

- **Code Generation**: `opencode.gsd.codegen` agent for implementation tasks
- **Debugging**: `opencode.gsd.debugger` agent for issue resolution
- **Testing**: `opencode.gsd.tester` agent for test creation
- **Documentation**: `opencode.gsd.documentor` agent for docs

### Agent Bridge Configuration

Configure agent behavior in your settings:

```json
{
  "gsd-opencode": {
    "agentDelegation": {
      "codegen": "high",
      "debugger": "high",
      "tester": "medium",
      "documentor": "low"
    },
    "maxConcurrentAgents": 3,
    "fallbackToGSD": true
  }
}
```

### Manual Agent Control

Override automatic delegation:

```javascript
// In OpenCode extension settings
{
  "gsd-opencode": {
    "manualDelegation": {
      "implementation": "opencode.codegen",
      "testing": "gsd"  // Force GSD subagent
    }
  }
}
```

## Configuration

### Editor-Specific Settings

GSD maintains separate configurations for each editor:

**OpenCode**: `~/.opencode/settings.json`
```json
{
  "gsd": {
    "version": "1.4.15",
    "editor": "opencode",
    "maxConcurrentAgents": 3,
    "skipCheckpoints": true
  },
  "gsd-opencode": {
    "agentBridge": true,
    "commandTranslation": true
  }
}
```

**Claude Code**: `~/.claude/settings.json`
```json
{
  "gsd": {
    "version": "1.4.15",
    "editor": "claude",
    "maxConcurrentAgents": 3,
    "skipCheckpoints": true
  }
}
```

### Migration Between Editors

GSD helps migrate configurations between editors:

```bash
# Migrate GSD settings from Claude to OpenCode
npx get-shit-done-cc --migrate claude opencode

# Migrate from OpenCode to Claude
npx get-shit-done-cc --migrate opencode claude
```

## Migration Guide

### Switching from Claude Code to OpenCode

1. **Install GSD for OpenCode**:
   ```bash
   npx get-shit-done-cc --global --editor opencode
   ```

2. **Migrate existing projects** (optional):
   ```bash
   # Copy project files
   cp -r .claude .opencode
   ```

3. **Update workflows**:
   - Commands remain the same functionally
   - Keybindings may differ (customize in OpenCode)
   - Agent behavior may be enhanced

### Switching from OpenCode to Claude Code

1. **Install GSD for Claude**:
   ```bash
   npx get-shit-done-cc --global --editor claude
   ```

2. **Migrate configurations**:
   ```bash
   npx get-shit-done-cc --migrate opencode claude
   ```

3. **Adjust to Claude's interface**:
   - Use `/gsd:*` slash commands
   - Different permission model
   - No agent bridge (GSD subagents only)

## Troubleshooting

### Installation Issues

**"Editor not detected"**
```bash
# Force specific editor
npx get-shit-done-cc --global --editor opencode

# Check OpenCode installation
which opencode
echo $OPENCODE_CONFIG_DIR
```

**"Permission denied"**
```bash
# Check directory permissions
ls -la ~/.opencode/
ls -la ~/.claude/

# Fix permissions
chmod 755 ~/.opencode/
```

### Command Issues

**"Command not found"**
- Restart OpenCode after installation
- Check extension is loaded: `OpenCode: Show Installed Extensions`
- Verify GSD extension is enabled

**"Agent bridge failed"**
```json
// Check agent bridge configuration
{
  "gsd-opencode": {
    "agentBridge": true,
    "fallbackToGSD": true
  }
}
```

### Performance Issues

**Slow command execution**
- Reduce concurrent agents:
  ```json
  {"gsd": {"maxConcurrentAgents": 2}}
  ```

**High memory usage**
- Enable checkpoint skipping:
  ```json
  {"gsd": {"skipCheckpoints": true}}
  ```

### Compatibility Issues

**Mixed editor environments**
- Use `--editor` flag to force specific behavior
- Separate config directories prevent conflicts
- Test in isolated environments first

**Version conflicts**
```bash
# Check versions
npx get-shit-done-cc --version
opencode --version

# Update if needed
npm update -g get-shit-done-cc
```

## Development

### Building the Extension

```bash
cd commands/opencode
npm install
npm run compile
```

### Testing

Run the integration test suite:

```bash
node bin/test-opencode-integration.js
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes to OpenCode integration
4. Run tests: `npm test`
5. Submit pull request

### Architecture Details

- **Entry Point**: `commands/opencode/extension.js`
- **Command Registration**: `commands/opencode/package.json`
- **Core Logic**: `bin/` directory
- **Tests**: `bin/test-opencode-integration.js`

## Support

### Getting Help

- **Documentation**: This file and main README.md
- **Issues**: GitHub Issues with "opencode" label
- **Discussions**: GitHub Discussions for questions

### Common Questions

**Q: Can I use both editors simultaneously?**
A: Yes, GSD maintains separate configurations. Use `--editor` flag when installing.

**Q: Do agents work the same in OpenCode?**
A: OpenCode agents are enhanced but GSD provides fallback to traditional subagents.

**Q: How do I customize keybindings?**
A: Modify `commands/opencode/package.json` keybindings section.

**Q: Can I migrate existing GSD projects?**
A: Yes, copy `.claude` directories to `.opencode` and reinstall.

## Changelog

### v1.4.15
- Initial OpenCode support
- Agent bridge implementation
- Dual editor configuration
- Command translation system
- Integration test suite

---

*For general GSD usage, see [README.md](../README.md)*