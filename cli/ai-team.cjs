#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AI_TEAM_VERSION = '1.0.0';
const TEMPLATE_REPO = 'https://github.com/your-org/ai-team-template.git';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf-8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
  } catch (error) {
    if (!options.allowFail) {
      throw error;
    }
    return null;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readJsonFile(filePath) {
  if (!fileExists(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readYamlFile(filePath) {
  if (!fileExists(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseSimpleYaml(content);
}

function parseSimpleYaml(content) {
  const result = {};
  let currentPath = [];
  
  content.split('\n').forEach(line => {
    if (line.trim().startsWith('#') || !line.trim()) return;
    
    const indent = line.search(/\S/);
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    
    if (match) {
      const [, spaces, key, value] = match;
      const level = spaces.length / 2;
      
      if (value) {
        let obj = result;
        for (let i = 0; i < level; i++) {
          if (!obj[currentPath[i]]) obj[currentPath[i]] = {};
          obj = obj[currentPath[i]];
        }
        obj[key.trim()] = value.replace(/^["']|["']$/g, '');
      } else {
        currentPath[level] = key.trim();
        currentPath = currentPath.slice(0, level + 1);
      }
    }
  });
  
  return result;
}

async function init(projectName, options = {}) {
  log('\n🚀 Initializing AI Team for your project...\n', 'cyan');
  
  const projectPath = options.path || process.cwd();
  const isCurrentDir = projectPath === process.cwd();
  
  if (!isCurrentDir && !fileExists(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
  
  const targetDir = isCurrentDir ? projectPath : path.join(process.cwd(), projectName || path.basename(projectPath));
  
  if (!isCurrentDir && projectName) {
    if (!fileExists(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }
  
  process.chdir(targetDir);
  
  const configPath = path.join(targetDir, 'ai-team.config.yaml');
  
  if (fileExists(configPath) && !options.force) {
    log('⚠️  AI Team already initialized. Use --force to reinitialize.', 'yellow');
    return;
  }
  
  const config = {
    projectName: projectName || path.basename(targetDir),
    description: options.description || 'My awesome project',
    language: options.language || 'typescript',
    framework: options.framework || 'node',
  };
  
  log('📦 Creating project structure...', 'blue');
  
  const dirs = [
    '.ai-team/agents',
    '.ai-team/skills',
    '.ai-team/commands',
    '.ai-team/memory/architect',
    '.ai-team/memory/developer',
    '.ai-team/memory/qa',
    '.ai-team/memory/reviewer',
    '.ai-team/workflows',
    '.github/workflows',
    '.github/ISSUE_TEMPLATE',
    'docs/architecture',
    'docs/decisions',
    'docs/runbooks',
    'tasks',
    'src',
    'tests',
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(targetDir, dir);
    if (!fileExists(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  
  log('📝 Creating configuration files...', 'blue');
  
  const templateConfig = `# AI Team Template Configuration
# This file configures the AI team for your project

project:
  name: "${config.projectName}"
  description: "${config.description}"
  language: "${config.language}"
  framework: "${config.framework}"

ai_team:
  version: "${AI_TEAM_VERSION}"
  
  agents:
    architect: true
    developer: true
    qa: true
    reviewer: true

  memory:
    enabled: true
    isolation: true
    auto_archive: true

  workflows:
    auto_trigger: true
    require_human_approval: true

rules:
  coding:
    max_function_lines: 30
    max_nesting_levels: 3
    test_coverage_threshold: 80

  git:
    branch_prefix:
      feature: "feat/"
      bugfix: "fix/"
      refactor: "refactor/"
      tech: "tech/"
    commit_convention: "conventional"

  safety:
    no_force_push: true
    no_direct_main: true
    require_pr_reviews: 1

template:
  source: "${TEMPLATE_REPO}"
  version: "${AI_TEAM_VERSION}"
  last_sync: "${new Date().toISOString()}"
`;
  
  fs.writeFileSync(configPath, templateConfig);
  
  log('📋 Creating GitHub templates...', 'blue');
  copyTemplates(targetDir);
  
  log('⚙️  Creating workflow files...', 'blue');
  copyWorkflows(targetDir);
  
  log('📄 Creating AGENTS.md...', 'blue');
  createAgentsMd(targetDir, config);
  
  log('📝 Creating README.md...', 'blue');
  createReadme(targetDir, config);
  
  log('\n✅ AI Team initialized successfully!\n', 'green');
  log('Next steps:', 'cyan');
  log('  1. Review and customize ai-team.config.yaml');
  log('  2. Add your GitHub secrets (OPENCODE_API_KEY)');
  log('  3. Create your first issue!');
  log('  4. Comment "/opencode use architect to analyze this issue"\n');
}

function copyTemplates(targetDir) {
  const issueTemplates = {
    'feature_request.md': `---
name: Feature Request
about: Request a new feature or enhancement
title: '[FEAT] '
labels: 'enhancement'
---

## Background
<!-- Provide context for this feature -->

## Problem Statement
<!-- What problem does this solve? -->

## Expected Behavior
<!-- What should happen? -->

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

---
/opencode use architect to analyze this issue`,
    
    'bug_report.md': `---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[BUG] '
labels: 'bug'
---

## Description
<!-- What is the bug? -->

## Reproduction Steps
1. 
2. 
3. 

## Expected Behavior
<!-- What should happen? -->

## Actual Behavior
<!-- What actually happens? -->

## Environment
- OS: 
- Version: 

---
/opencode use architect to analyze this issue`,
    
    'tech_task.md': `---
name: Technical Task
about: Internal improvements or refactoring
title: '[TECH] '
labels: 'technical'
---

## Task Type
- [ ] Refactoring
- [ ] Dependency Upgrade
- [ ] Performance
- [ ] Infrastructure

## Motivation
<!-- Why is this needed? -->

## Scope
<!-- What areas are affected? -->

---
/opencode use architect to analyze this issue`,
  };
  
  Object.entries(issueTemplates).forEach(([name, content]) => {
    fs.writeFileSync(path.join(targetDir, '.github/ISSUE_TEMPLATE', name), content);
  });
  
  const prTemplate = `## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Changes Made
- 

## Testing
- [ ] Tests added/updated
- [ ] All tests pass

## Related Issues
Closes #

---
/opencode use reviewer to review this PR`;
  
  fs.writeFileSync(path.join(targetDir, '.github', 'pull_request_template.md'), prTemplate);
}

function copyWorkflows(targetDir) {
  const workflows = {
    'opencode.yml': `name: OpenCode Agent

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, labeled]
  workflow_dispatch:

jobs:
  detect-command:
    runs-on: ubuntu-latest
    outputs:
      should_run: \${{ steps.check.outputs.should_run }}
      command: \${{ steps.check.outputs.command }}
      agent: \${{ steps.check.outputs.agent }}
    steps:
      - name: Check for OpenCode command
        id: check
        run: |
          COMMENT="\${{ github.event.comment.body }}"
          ISSUE_BODY="\${{ github.event.issue.body }}"
          
          if [[ "$COMMENT" == /opencode* ]]; then
            echo "should_run=true" >> $GITHUB_OUTPUT
            echo "command=\${COMMENT#/opencode }" >> $GITHUB_OUTPUT
            AGENT=$(echo "$COMMENT" | grep -oP '(?<=use )\\w+(?= to)' || echo "auto")
            echo "agent=$AGENT" >> $GITHUB_OUTPUT
          elif [[ "\${{ github.event_name }}" == "issues" ]] && [[ "\${{ github.event.action }}" == "opened" ]]; then
            echo "should_run=true" >> $GITHUB_OUTPUT
            echo "command=auto-process" >> $GITHUB_OUTPUT
            echo "agent=auto" >> $GITHUB_OUTPUT
          else
            echo "should_run=false" >> $GITHUB_OUTPUT
          fi

  run-agent:
    needs: detect-command
    if: needs.detect-command.outputs.should_run == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Run OpenCode Agent
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          OPENCODE_API_KEY: \${{ secrets.OPENCODE_API_KEY }}
        run: |
          echo "Running \${{ needs.detect-command.outputs.agent }} agent..."
          # Add your OpenCode execution here
`,
    
    'ci.yml': `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: [lint]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
`,
    
    'pr-check.yml': `name: PR Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check PR Title
        run: |
          TITLE="\${{ github.event.pull_request.title }}"
          if [[ ! "$TITLE" =~ ^(feat|fix|docs|style|refactor|test|chore)(\\(.+\\))?: ]]; then
            echo "PR title must follow conventional commits format"
            exit 1
          fi
`,
  };
  
  Object.entries(workflows).forEach(([name, content]) => {
    fs.writeFileSync(path.join(targetDir, '.github/workflows', name), content);
  });
}

function createAgentsMd(targetDir, config) {
  const content = `# AGENTS.md - Global Rules for AI Agents

This file defines the global rules and guidelines that all AI agents must follow.

## Project Overview

**${config.projectName}**: ${config.description}

- **Language**: ${config.language}
- **Framework**: ${config.framework}

## Coding Standards

### General Principles

1. **Clean Code**
   - Write readable, self-documenting code
   - Use meaningful names
   - Keep functions small (max 30 lines)
   - Avoid deep nesting (max 3 levels)

2. **DRY (Don't Repeat Yourself)**
   - Extract common logic
   - Avoid duplication
   - Use composition over inheritance

3. **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

## Git Workflow

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | \`feat/issue-123-desc\` | \`feat/issue-123-user-auth\` |
| Bug Fix | \`fix/issue-456-desc\` | \`fix/issue-456-login-bug\` |
| Refactor | \`refactor/desc\` | \`refactor/user-service\` |

### Commit Messages

Follow Conventional Commits:
\`\`\`
<type>(<scope>): <description>

Types: feat, fix, refactor, test, docs, chore
\`\`\`

## Memory System

This project uses layered memory architecture:

\`\`\`
┌─────────────────────────────────────┐
│        GLOBAL MEMORY (docs/)         │
│   Read-only, requires approval       │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       ROLE MEMORY (.ai-team/memory/) │
│   Read/Write by owning role          │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       TASK MEMORY (tasks/)           │
│   Task-scoped, auto-created          │
└─────────────────────────────────────┘
\`\`\`

## Agent Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| \`/design\` | Architect | Analyze and design |
| \`/implement\` | Developer | Implement changes |
| \`/test\` | QA | Validate and test |
| \`/review\` | Reviewer | Code review |
| \`/triage\` | Architect | Classify issues |

## Safety Constraints

1. No destructive operations without confirmation
2. Minimal changes only
3. Human approval required for merges
4. All changes must be reversible
`;
  
  fs.writeFileSync(path.join(targetDir, 'AGENTS.md'), content);
}

function createReadme(targetDir, config) {
  const content = `# ${config.projectName}

${config.description}

## AI Team

This project is powered by AI Team - an autonomous development assistant.

### Quick Start

1. Create an issue using one of the templates
2. Comment \`/opencode use architect to analyze this issue\`
3. Watch the AI team analyze, implement, test, and review

### Available Commands

| Command | Purpose |
|---------|---------|
| \`/design\` | Analyze requirements and design solution |
| \`/implement\` | Implement the designed solution |
| \`/test\` | Validate and test implementation |
| \`/review\` | Review code for quality |

### Memory System

- **Global Memory**: \`docs/\`, \`AGENTS.md\`
- **Role Memory**: \`.ai-team/memory/\`
- **Task Memory**: \`tasks/\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build
npm run build
\`\`\`

## License

MIT
`;
  
  fs.writeFileSync(path.join(targetDir, 'README.md'), content);
}

async function upgrade(options = {}) {
  log('\n🔄 Checking for AI Team updates...\n', 'cyan');
  
  const configPath = path.join(process.cwd(), 'ai-team.config.yaml');
  
  if (!fileExists(configPath)) {
    log('❌ AI Team not initialized. Run `ai-team init` first.', 'red');
    return;
  }
  
  const config = readYamlFile(configPath);
  const currentVersion = config?.ai_team?.version || '0.0.0';
  
  log(`Current version: ${currentVersion}`, 'blue');
  log(`Latest version: ${AI_TEAM_VERSION}`, 'blue');
  
  if (currentVersion === AI_TEAM_VERSION && !options.force) {
    log('\n✅ Already up to date!\n', 'green');
    return;
  }
  
  log('\n📦 Upgrading AI Team...\n', 'yellow');
  
  const backupDir = `.ai-team-backup-${Date.now()}`;
  
  if (fileExists('.ai-team')) {
    log('Creating backup...', 'blue');
    fs.cpSync('.ai-team', backupDir, { recursive: true });
  }
  
  log('Updating core files...', 'blue');
  updateCoreFiles();
  
  log('Updating config version...', 'blue');
  updateConfigVersion(configPath, AI_TEAM_VERSION);
  
  log('\n✅ AI Team upgraded successfully!\n', 'green');
  log(`Backup saved to: ${backupDir}`, 'yellow');
  log('Review the changes and commit if everything looks good.\n');
}

function updateCoreFiles() {
  const coreFiles = [
    { src: '.ai-team/agents', dest: '.ai-team/agents' },
    { src: '.ai-team/skills', dest: '.ai-team/skills' },
    { src: '.ai-team/commands', dest: '.ai-team/commands' },
    { src: '.ai-team/workflows', dest: '.github/workflows' },
  ];
  
  coreFiles.forEach(({ src, dest }) => {
    if (fileExists(src)) {
      fs.rmSync(dest, { recursive: true, force: true });
      fs.cpSync(src, dest, { recursive: true });
    }
  });
}

function updateConfigVersion(configPath, version) {
  let content = fs.readFileSync(configPath, 'utf-8');
  content = content.replace(
    /version:\s*["'][^"']+["']/,
    `version: "${version}"`
  );
  content = content.replace(
    /last_sync:\s*null/,
    `last_sync: "${new Date().toISOString()}"`
  );
  fs.writeFileSync(configPath, content);
}

async function status() {
  log('\n📊 AI Team Status\n', 'cyan');
  
  const configPath = path.join(process.cwd(), 'ai-team.config.yaml');
  
  if (!fileExists(configPath)) {
    log('❌ AI Team not initialized', 'red');
    log('Run `ai-team init` to get started\n');
    return;
  }
  
  const config = readYamlFile(configPath);
  
  log('Project:', 'blue');
  log(`  Name: ${config?.project?.name || 'Unknown'}`);
  log(`  Language: ${config?.project?.language || 'Unknown'}`);
  log(`  Framework: ${config?.project?.framework || 'Unknown'}`);
  
  log('\nAI Team:', 'blue');
  log(`  Version: ${config?.ai_team?.version || 'Unknown'}`);
  log(`  Last Sync: ${config?.template?.last_sync || 'Never'}`);
  
  log('\nAgents:', 'blue');
  const agents = config?.ai_team?.agents || {};
  Object.entries(agents).forEach(([name, enabled]) => {
    const status = enabled ? '✅' : '❌';
    log(`  ${status} ${name}`);
  });
  
  log('\nMemory:', 'blue');
  const memoryPath = path.join(process.cwd(), '.ai-team/memory');
  if (fileExists(memoryPath)) {
    const roles = fs.readdirSync(memoryPath).filter(f => 
      fs.statSync(path.join(memoryPath, f)).isDirectory()
    );
    roles.forEach(role => {
      const files = fs.readdirSync(path.join(memoryPath, role));
      log(`  ${role}: ${files.length} files`);
    });
  }
  
  log('\nTasks:', 'blue');
  const tasksPath = path.join(process.cwd(), 'tasks');
  if (fileExists(tasksPath)) {
    const tasks = fs.readdirSync(tasksPath).filter(f => 
      f.startsWith('issue-') && fs.statSync(path.join(tasksPath, f)).isDirectory()
    );
    log(`  Active: ${tasks.length} tasks`);
  }
  
  log('');
}

function showHelp() {
  log(`
${COLORS.cyan}AI Team CLI${COLORS.reset} - Autonomous Development Team Manager

${COLORS.yellow}Usage:${COLORS.reset}
  ai-team <command> [options]

${COLORS.yellow}Commands:${COLORS.reset}
  init [name]        Initialize AI Team in current or new project
  upgrade            Upgrade AI Team to latest version
  status             Show current AI Team status
  help               Show this help message

${COLORS.yellow}Init Options:${COLORS.reset}
  --path <path>      Target directory path
  --description <d>  Project description
  --language <lang>  Programming language (default: typescript)
  --framework <fw>   Framework (default: node)
  --force            Force reinitialization

${COLORS.yellow}Upgrade Options:${COLORS.reset}
  --force            Force upgrade even if already latest

${COLORS.yellow}Examples:${COLORS.reset}
  ai-team init my-project
  ai-team init --language python --framework django
  ai-team upgrade
  ai-team status
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  const options = {};
  let projectName = null;
  
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      options[key] = value;
      if (value !== true) i++;
    } else if (!projectName) {
      projectName = args[i];
    }
  }
  
  try {
    switch (command) {
      case 'init':
        await init(projectName, options);
        break;
      case 'upgrade':
      case 'update':
        await upgrade(options);
        break;
      case 'status':
        await status();
        break;
      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;
      default:
        log(`Unknown command: ${command}`, 'red');
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();