#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

const banner = `
${cyan}   ██████╗ ███████╗██████╗
  ██╔════╝ ██╔════╝██╔══██╗
  ██║  ███╗███████╗██║  ██║
  ██║   ██║╚════██║██║  ██║
  ╚██████╔╝███████║██████╔╝
   ╚═════╝ ╚══════╝╚═════╝${reset}

  Get Shit Done ${dim}v${pkg.version}${reset}
  A meta-prompting, context engineering and spec-driven
  development system for Claude Code by TÂCHES.
`;

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');

// Parse --config-dir argument
function parseConfigDirArg() {
  const configDirIndex = args.findIndex(arg => arg === '--config-dir' || arg === '-c');
  if (configDirIndex !== -1) {
    const nextArg = args[configDirIndex + 1];
    // Error if --config-dir is provided without a value or next arg is another flag
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}--config-dir requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }
  // Also handle --config-dir=value format
  const configDirArg = args.find(arg => arg.startsWith('--config-dir=') || arg.startsWith('-c='));
  if (configDirArg) {
    return configDirArg.split('=')[1];
  }
  return null;
}
const explicitConfigDir = parseConfigDirArg();
const hasHelp = args.includes('--help') || args.includes('-h');

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx get-shit-done-cc [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}              Install Claude Code globally (to ~/.claude)
    ${cyan}-l, --local${reset}               Install Claude Code locally (to ./.claude)
    ${cyan}-c, --config-dir <path>${reset}   Specify custom Claude config directory
    ${cyan}-h, --help${reset}                Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install to default ~/.claude directory${reset}
    npx get-shit-done-cc --global

    ${dim}# Install to custom config directory (for multiple Claude accounts)${reset}
    npx get-shit-done-cc --global --config-dir ~/.claude-bc

    ${dim}# Using environment variable${reset}
    CLAUDE_CONFIG_DIR=~/.claude-bc npx get-shit-done-cc --global

    ${dim}# Install to current project only${reset}
    npx get-shit-done-cc --local

    ${dim}# Interactive installation (choose agents and locations)${reset}
    npx get-shit-done-cc

  ${yellow}Notes:${reset}
    The --config-dir option is useful when you have multiple Claude Code
    configurations (e.g., for different subscriptions). It takes priority
    over the CLAUDE_CONFIG_DIR environment variable.

    When run without arguments, the installer will prompt you to select
    which agents (Claude Code and/or Opencode) to install and where
    (globally or locally) for each selected agent.
`);
  process.exit(0);
}

/**
 * Expand ~ to home directory (shell doesn't expand in env vars passed to node)
 */
function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

/**
 * Recursively copy directory, replacing paths in .md files
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix, isOpencode = false) {
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix, isOpencode);
    } else if (entry.name.endsWith('.md')) {
      // Replace paths in markdown files
      let content = fs.readFileSync(srcPath, 'utf8');
      if (isOpencode) {
        // For opencode, replace claude paths with opencode paths
        content = content.replace(/~\/\.claude\/get-shit-done\//g, '~/.config/opencode/gsd/');
        content = content.replace(/~\/\.claude\/commands\//g, '~/.config/opencode/command/');
        content = content.replace(/\.\/\.claude\/get-shit-done\//g, '.opencode/gsd/');
        content = content.replace(/\.\/\.claude\/commands\//g, '.opencode/command/');
      } else {
        // For claude, replace ~/.claude/ with the appropriate prefix
        content = content.replace(/~\/\.claude\//g, pathPrefix);
      }
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install multiple agents
 */
function installMultiple(agentConfigs) {
  for (const config of agentConfigs) {
    installSingle(config.agent, config.isGlobal);
  }

  const agentNames = agentConfigs.map(c => c.agent === 'claude-code' ? 'Claude Code' : 'Opencode');
  console.log(`
  ${green}Done!${reset} Launch ${agentNames.join(' and ')} and run ${cyan}/gsd:help${reset}.
`);
}

/**
 * Install a single agent to the specified directory
 */
function installSingle(agent, isGlobal) {
  const src = path.join(__dirname, '..');
  const isOpencode = agent === 'opencode';

  // Priority: explicit --config-dir arg > CLAUDE_CONFIG_DIR env var > default
  const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
  const defaultGlobalDir = isOpencode
    ? path.join(os.homedir(), '.config', 'opencode')
    : (configDir || path.join(os.homedir(), '.claude'));
  const agentDir = isGlobal
    ? defaultGlobalDir
    : path.join(process.cwd(), isOpencode ? '.opencode' : '.claude');

  const locationLabel = isGlobal
    ? agentDir.replace(os.homedir(), '~')
    : agentDir.replace(process.cwd(), '.');

  const agentName = isOpencode ? 'Opencode' : 'Claude Code';

  // Path prefix for file references
  const pathPrefix = isGlobal
    ? (isOpencode ? '~/.config/opencode/' : (configDir ? `${agentDir}/` : '~/.claude/'))
    : (isOpencode ? './.opencode/' : './.claude/');

  console.log(`  Installing ${agentName} to ${cyan}${locationLabel}${reset}\n`);

  // Create commands directory
  const commandsDir = path.join(agentDir, isOpencode ? 'command' : 'commands');
  fs.mkdirSync(commandsDir, { recursive: true });

  // Copy appropriate commands with path replacement
  const commandsSrc = path.join(src, 'commands', isOpencode ? 'opencode' : 'gsd');
  const commandsDest = path.join(commandsDir, 'gsd');
  if (fs.existsSync(commandsSrc)) {
    copyWithPathReplacement(commandsSrc, commandsDest, pathPrefix, isOpencode);
    console.log(`  ${green}✓${reset} Installed commands/gsd`);
  }

  // Copy get-shit-done skill with path replacement
  const skillSrc = path.join(src, 'get-shit-done');
  const skillDest = path.join(agentDir, isOpencode ? 'gsd' : 'get-shit-done');
  copyWithPathReplacement(skillSrc, skillDest, pathPrefix, isOpencode);
  console.log(`  ${green}✓${reset} Installed ${isOpencode ? 'gsd' : 'get-shit-done'}`);

  // Copy agents (subagents must be at root level)
  const agentsSrc = path.join(src, 'agents');
  if (fs.existsSync(agentsSrc)) {
    const agentsDest = path.join(agentDir, isOpencode ? 'agent' : 'agents');
    copyWithPathReplacement(agentsSrc, agentsDest, pathPrefix, isOpencode);
    console.log(`  ${green}✓${reset} Installed ${isOpencode ? 'agent' : 'agents'}`);
  }

  // Copy CHANGELOG.md
  const changelogSrc = path.join(src, 'CHANGELOG.md');
  const changelogDest = path.join(agentDir, isOpencode ? 'gsd' : 'get-shit-done', 'CHANGELOG.md');
  if (fs.existsSync(changelogSrc)) {
    fs.copyFileSync(changelogSrc, changelogDest);
    console.log(`  ${green}✓${reset} Installed CHANGELOG.md`);
  }

  // Write VERSION file for whats-new command
  const versionDest = path.join(agentDir, isOpencode ? 'gsd' : 'get-shit-done', 'VERSION');
  fs.writeFileSync(versionDest, pkg.version);
  console.log(`  ${green}✓${reset} Wrote VERSION (${pkg.version})`);
}

/**
 * Prompt for which agents to install
 */
function promptAgents() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`  ${yellow}Which agents would you like to install?${reset}

  ${cyan}1${reset}) Claude Code  ${dim}(~/.claude or ./.claude)${reset}
  ${cyan}2${reset}) Opencode      ${dim}(~/.config/opencode or ./.opencode)${reset}
  ${cyan}3${reset}) Both agents
`);

  rl.question(`  Choice ${dim}[3]${reset}: `, (answer) => {
    rl.close();
    const choice = answer.trim() || '3';
    let selectedAgents = [];

    if (choice === '1') {
      selectedAgents = ['claude-code'];
    } else if (choice === '2') {
      selectedAgents = ['opencode'];
    } else if (choice === '3') {
      selectedAgents = ['claude-code', 'opencode'];
    } else {
      console.error(`  ${yellow}Invalid choice. Please select 1, 2, or 3.${reset}`);
      process.exit(1);
    }

    promptLocationsForAgents(selectedAgents);
  });
}

/**
 * Prompt for install locations for each selected agent
 */
function promptLocationsForAgents(agents) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let agentConfigs = [];
  let currentIndex = 0;

  function promptNext() {
    if (currentIndex >= agents.length) {
      rl.close();
      installMultiple(agentConfigs);
      return;
    }

    const agent = agents[currentIndex];
    const isOpencode = agent === 'opencode';

    const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
    const globalPath = isOpencode
      ? path.join(os.homedir(), '.config', 'opencode')
      : (configDir || path.join(os.homedir(), '.claude'));
    const globalLabel = globalPath.replace(os.homedir(), '~');

    console.log(`\n  ${yellow}Where would you like to install ${agent}?${reset}

  ${cyan}1${reset}) Global ${dim}(${globalLabel})${reset} - available in all projects
  ${cyan}2${reset}) Local  ${dim}(./.${agent === 'opencode' ? 'opencode' : 'claude'})${reset} - this project only
`);

    rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
      const choice = answer.trim() || '1';
      const isGlobal = choice !== '2';
      agentConfigs.push({ agent, isGlobal });
      currentIndex++;
      promptNext();
    });
  }

  promptNext();
}

// Main
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (explicitConfigDir && hasLocal) {
  console.error(`  ${yellow}Cannot use --config-dir with --local${reset}`);
  process.exit(1);
} else if (hasGlobal) {
  // For backwards compatibility, --global installs to claude-code
  installMultiple([{ agent: 'claude-code', isGlobal: true }]);
} else if (hasLocal) {
  // For backwards compatibility, --local installs to claude-code
  installMultiple([{ agent: 'claude-code', isGlobal: false }]);
} else {
  promptAgents();
}
