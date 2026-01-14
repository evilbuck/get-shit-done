# Phase 2 Planning Document: OpenCode Integration Design

## Executive Summary
This document outlines the detailed technical design for adding OpenCode support to the GSD (Get Shit Done) system. The design focuses on creating a flexible, extensible architecture that supports both Claude Code and OpenCode while maintaining backward compatibility.

## Architecture Overview

### Core Design Principles
1. **Editor Abstraction**: Abstract editor-specific functionality behind unified interfaces
2. **Backward Compatibility**: Ensure existing Claude Code installations remain unaffected
3. **Progressive Enhancement**: Add OpenCode features without breaking existing workflows
4. **Configuration-Driven**: Use configuration to determine editor type and behavior

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GSD Core      │    │  Editor Adapter  │    │   OpenCode      │
│   Logic         │◄──►│   Layer          │◄──►│   Integration   │
│                 │    │                  │    │                 │
│ - Commands      │    │ - Path Mapping   │    │ - Extension API │
│ - Workflows     │    │ - Command Trans. │    │ - Agent Bridge  │
│ - State Mgmt    │    │ - Config Mgmt    │    │ - UI Integration│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              ▲
                              │
                       ┌──────────────────┐
                       │  Configuration   │
                       │  Detection       │
                       └──────────────────┘
```

## Component Specifications

### 1. Editor Detection Module

#### Purpose
Automatically detect which code editor is being used and configure GSD accordingly.

#### Implementation
```javascript
class EditorDetector {
  static detect() {
    // Check for OpenCode indicators
    if (this.isOpenCodeEnvironment()) {
      return 'opencode';
    }
    // Default to Claude Code
    return 'claude';
  }

  static isOpenCodeEnvironment() {
    // Check for ~/.opencode directory
    // Check for OpenCode-specific environment variables
    // Check for OpenCode process
    return fs.existsSync(path.join(os.homedir(), '.opencode'));
  }
}
```

#### Configuration Schema
```json
{
  "editor": {
    "type": "auto|claude|opencode",
    "paths": {
      "claude": "~/.claude",
      "opencode": "~/.opencode"
    },
    "features": {
      "agent_bridge": true,
      "command_translation": true
    }
  }
}
```

### 2. Path Abstraction Layer

#### Current Issues
- Hard-coded `~/.claude/` paths throughout the codebase
- Path references in markdown templates
- Installation directory assumptions

#### Solution
```javascript
class PathManager {
  constructor(editorType) {
    this.editorType = editorType;
    this.basePaths = {
      claude: '~/.claude',
      opencode: '~/.opencode'
    };
  }

  getBasePath() {
    return this.basePaths[this.editorType];
  }

  resolvePath(relativePath) {
    const base = this.getBasePath();
    return path.join(base, relativePath);
  }

  getCommandsPath() {
    return this.resolvePath('commands/gsd');
  }

  getSkillsPath() {
    return this.resolvePath('get-shit-done');
  }
}
```

### 3. Command Translation System

#### Challenge
Claude Code uses slash commands (`/gsd:command`), while OpenCode uses VS Code-style commands.

#### Design
```javascript
class CommandTranslator {
  static translateToOpenCode(claudeCommand) {
    // /gsd:new-project -> opencode.gsd.newProject
    const parts = claudeCommand.slice(1).split(':');
    return `opencode.gsd.${parts[1].replace(/-/g, '')}`;
  }

  static translateToClaude(opencodeCommand) {
    // opencode.gsd.newProject -> /gsd:new-project
    const parts = opencodeCommand.split('.');
    return `/gsd:${parts[2].replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  }
}
```

#### OpenCode Command Registration
```json
{
  "contributes": {
    "commands": [
      {
        "command": "opencode.gsd.newProject",
        "title": "GSD: New Project",
        "category": "GSD"
      }
    ],
    "keybindings": [
      {
        "command": "opencode.gsd.newProject",
        "key": "ctrl+shift+g ctrl+shift+n"
      }
    ]
  }
}
```

### 4. Agent Bridge Module

#### Purpose
Coordinate between GSD's subagent system and OpenCode's agentic capabilities.

#### Architecture
```javascript
class AgentBridge {
  constructor(opencodeAPI) {
    this.opencodeAPI = opencodeAPI;
    this.activeAgents = new Map();
  }

  async spawnSubagent(task) {
    // Check if OpenCode can handle this task natively
    if (this.canDelegateToOpenCode(task)) {
      return this.delegateToOpenCodeAgent(task);
    }
    // Fall back to GSD's subagent system
    return this.spawnGSDSubagent(task);
  }

  canDelegateToOpenCode(task) {
    // Analyze task type and delegate appropriate tasks
    // e.g., code generation -> OpenCode code agent
    // debugging -> OpenCode debug agent
  }
}
```

### 5. Installation Process Redesign

#### Current Flow
1. Detect global/local preference
2. Install to `~/.claude/` or `./.claude/`
3. Copy commands and skills
4. Update path references

#### Enhanced Flow
```javascript
async function installEnhanced() {
  // Detect editor type
  const editorType = EditorDetector.detect();

  // Get appropriate paths
  const pathManager = new PathManager(editorType);

  // Install based on editor
  if (editorType === 'opencode') {
    await installForOpenCode(pathManager);
  } else {
    await installForClaude(pathManager);
  }

  // Configure editor-specific settings
  await configureEditor(editorType);
}
```

#### OpenCode-Specific Installation
- Create extension manifest
- Register commands in OpenCode
- Set up agent bridge configuration
- Install VS Code-compatible extensions

## Integration Strategy

### Phase 2A: Core Infrastructure
1. Implement editor detection
2. Create path abstraction layer
3. Add configuration management
4. Update installer for dual-editor support

### Phase 2B: Command System
1. Design command translation layer
2. Create OpenCode extension structure
3. Implement command registration
4. Test command execution

### Phase 2C: Agent Integration
1. Design agent bridge architecture
2. Implement task delegation logic
3. Create fallback mechanisms
4. Test agent coordination

### Phase 2D: Advanced Features
1. UI integration enhancements
2. Performance optimizations
3. Error handling improvements
4. Telemetry and monitoring

## Risk Mitigation

### Technical Risks
- **API Compatibility**: Regular testing against OpenCode releases
- **Performance Degradation**: Benchmark abstraction layer overhead
- **Command Conflicts**: Namespace isolation and conflict resolution

### Operational Risks
- **User Confusion**: Clear migration guides and feature flags
- **Support Complexity**: Separate documentation and support channels
- **Maintenance Burden**: Automated testing for both editors

## Testing Strategy

### Unit Tests
- Path abstraction correctness
- Command translation accuracy
- Editor detection reliability
- Configuration parsing

### Integration Tests
- End-to-end installation process
- Command execution in both editors
- Agent bridge functionality
- Error handling scenarios

### Compatibility Tests
- Regression testing on Claude Code
- Cross-platform validation
- Performance benchmarking

## Success Metrics

### Functional Metrics
- All GSD commands work in OpenCode
- Installation succeeds without errors
- Agent bridge delegates tasks appropriately
- No regression in Claude Code functionality

### Performance Metrics
- Installation time < 30 seconds
- Command execution latency < 500ms
- Memory overhead < 10MB
- CPU usage within acceptable limits

### User Experience Metrics
- Clear error messages for unsupported features
- Intuitive configuration options
- Seamless switching between editors
- Comprehensive documentation

## Implementation Timeline

### Week 1-2: Core Infrastructure
- Editor detection module
- Path abstraction layer
- Configuration management
- Installer updates

### Week 3-4: Command System
- Command translation system
- OpenCode extension structure
- Command registration
- Testing and validation

### Week 5-6: Agent Integration
- Agent bridge implementation
- Task delegation logic
- Fallback mechanisms
- Integration testing

### Week 7-8: Polish and Documentation
- Performance optimization
- Error handling improvements
- Documentation updates
- Final testing

## Dependencies

### External Dependencies
- OpenCode API documentation
- VS Code extension APIs
- Node.js compatibility requirements

### Internal Dependencies
- Current GSD codebase stability
- Testing infrastructure
- CI/CD pipeline updates

## Conclusion

This design provides a robust, extensible architecture for OpenCode integration while maintaining full backward compatibility with Claude Code. The modular approach allows for incremental implementation and testing, minimizing risk to the existing user base.

The key innovation is the abstraction layer that allows GSD to work seamlessly across different editor environments, opening the door to future editor support beyond Claude Code and OpenCode.