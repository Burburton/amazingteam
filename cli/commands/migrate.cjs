/**
 * Migrate Command
 * Migrate v2.x project to v3
 */

const fs = require('fs');
const path = require('path');

const VERSION = require('../../package.json').version;

function detectV2Project(projectPath) {
  const indicators = [
    '.ai-team/agents',
    '.ai-team/skills',
    '.ai-team/commands',
    '.opencode/skills',
    'tasks/_template/task.yaml'
  ];
  
  let score = 0;
  const found = [];
  
  for (const indicator of indicators) {
    if (fs.existsSync(path.join(projectPath, indicator))) {
      score++;
      found.push(indicator);
    }
  }
  
  return {
    isV2: score >= 3,
    score,
    found
  };
}

function extractUserCustomizations(projectPath) {
  const customizations = {
    config: null,
    agentsMd: null,
    localOverrides: null
  };
  
  // Read existing config
  const configPath = path.join(projectPath, 'amazingteam.config.yaml');
  if (fs.existsSync(configPath)) {
    customizations.config = fs.readFileSync(configPath, 'utf-8');
  }
  
  // Read AGENTS.md
  const agentsPath = path.join(projectPath, 'AGENTS.md');
  if (fs.existsSync(agentsPath)) {
    customizations.agentsMd = fs.readFileSync(agentsPath, 'utf-8');
  }
  
  // Read local overrides
  const overridesPath = path.join(projectPath, '.foundation', 'local-overrides.md');
  if (fs.existsSync(overridesPath)) {
    customizations.localOverrides = fs.readFileSync(overridesPath, 'utf-8');
  }
  
  return customizations;
}

function createV3Config(customizations) {
  const lines = [
    '# AmazingTeam Project Configuration (v3)',
    '# Migrated from v2.x',
    '',
    'version: "1.0"',
    ''
  ];
  
  // Extract project info from old config
  if (customizations.config) {
    const configLines = customizations.config.split('\n');
    let inProject = false;
    
    for (const line of configLines) {
      if (line.startsWith('project:')) {
        inProject = true;
        lines.push('project:');
        continue;
      }
      
      if (inProject) {
        if (line.startsWith('  ')) {
          lines.push(line);
        } else {
          inProject = false;
        }
      }
    }
  }
  
  // Add v3 specific fields
  lines.push('');
  lines.push('ai_team:');
  lines.push(`  version: "${VERSION}"`);
  lines.push('');
  lines.push('# Migration note: Foundation files are now loaded remotely');
  lines.push('# Run "amazingteam local" to download for local development');
  lines.push('');
  
  return lines.join('\n');
}

async function run(options, positional) {
  const projectPath = process.cwd();
  
  console.log('\n🔄 AmazingTeam Migration Tool (v2 → v3)\n');
  
  // Detect v2 project
  const detection = detectV2Project(projectPath);
  
  if (!detection.isV2) {
    console.log('This does not appear to be a v2.x project.');
    console.log('Detected indicators:', detection.score);
    console.log('\nIf you want to initialize a new project, run:');
    console.log('  amazingteam init\n');
    return;
  }
  
  console.log('Detected v2.x project:');
  detection.found.forEach(f => console.log(`  - ${f}`));
  console.log('');
  
  if (options.dryRun) {
    console.log('📝 Dry run - showing what would happen:\n');
  }
  
  // Extract customizations
  console.log('Extracting user customizations...');
  const customizations = extractUserCustomizations(projectPath);
  
  // Create backup
  if (!options.dryRun) {
    const backupDir = `.ai-team-v2-backup-${Date.now()}`;
    console.log(`Creating backup: ${backupDir}`);
    
    const dirsToBackup = ['.ai-team', '.opencode', '.foundation', 'tasks'];
    for (const dir of dirsToBackup) {
      const src = path.join(projectPath, dir);
      if (fs.existsSync(src)) {
        fs.cpSync(src, path.join(backupDir, dir), { recursive: true });
      }
    }
  }
  
  // Create v3 config
  console.log('Creating v3 configuration...');
  const v3Config = createV3Config(customizations);
  
  if (options.dryRun) {
    console.log('\n--- amazingteam.config.yaml (new) ---');
    console.log(v3Config);
    console.log('--- end ---\n');
  } else {
    fs.writeFileSync(path.join(projectPath, 'amazingteam.config.yaml'), v3Config);
  }
  
  // Create v3 workflow
  console.log('Creating v3 workflow...');
  const workflowContent = `# AmazingTeam GitHub Action Workflow (v3)
name: AmazingTeam

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  ai-team:
    if: |
      startsWith(github.event.comment.body, '/ai') ||
      startsWith(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Configure git
        run: |
          git config --global user.name "opencode-bot"
          git config --global user.email "opencode-bot@users.noreply.github.com"
      - name: Setup AmazingTeam
        uses: your-org/amazingteam-action@v${VERSION}
        with:
          version: '${VERSION}'
      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ALIBABA_CODING_PLAN_API_KEY: \${{ secrets.ALIBABA_CODING_PLAN_API_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
  
  if (!options.dryRun) {
    const workflowDir = path.join(projectPath, '.github', 'workflows');
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }
    fs.writeFileSync(path.join(workflowDir, 'amazingteam.yml'), workflowContent);
  }
  
  // Create minimal directories
  console.log('Creating minimal runtime directories...');
  const dirs = [
    '.ai-team/memory/planner',
    '.ai-team/memory/architect',
    '.ai-team/memory/developer',
    '.ai-team/memory/qa',
    '.ai-team/memory/reviewer',
    '.ai-team/memory/triage',
    '.ai-team/memory/ci-analyst',
    '.ai-team/memory/failures',
    'tasks/_template'
  ];
  
  if (!options.dryRun) {
    for (const dir of dirs) {
      const fullPath = path.join(projectPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }
  
  // Update .gitignore
  console.log('Updating .gitignore...');
  const gitignorePath = path.join(projectPath, '.gitignore');
  const additions = '\n# AmazingTeam v3\n.ai-team-local/\n.ai-team-cache/\n';
  
  if (!options.dryRun) {
    if (fs.existsSync(gitignorePath)) {
      let content = fs.readFileSync(gitignorePath, 'utf-8');
      if (!content.includes('.ai-team-local/')) {
        content += additions;
        fs.writeFileSync(gitignorePath, content);
      }
    } else {
      fs.writeFileSync(gitignorePath, additions.trim() + '\n');
    }
  }
  
  // Remove v2 directories (optional, with backup)
  if (!options.dryRun && !options.keepV2) {
    console.log('\nRemoving v2 foundation files...');
    console.log('  (Backup created, safe to remove)');
    
    const v2Dirs = ['.ai-team/agents', '.ai-team/skills', '.ai-team/commands', '.opencode'];
    for (const dir of v2Dirs) {
      const fullPath = path.join(projectPath, dir);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true });
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(40));
  
  if (options.dryRun) {
    console.log('Dry run complete. Run without --dry-run to apply changes.\n');
  } else {
    console.log('✅ Migration complete!\n');
    console.log('Changes:');
    console.log('  - Created amazingteam.config.yaml (v3 format)');
    console.log('  - Created .github/workflows/amazingteam.yml (v3)');
    console.log('  - Created runtime directories');
    console.log('  - Updated .gitignore');
    if (!options.keepV2) {
      console.log('  - Removed v2 foundation files');
    }
    console.log('\nNext steps:');
    console.log('  1. Review amazingteam.config.yaml');
    console.log('  2. Run "amazingteam local" for local development');
    console.log('  3. Run "amazingteam validate" to verify setup');
    console.log('  4. Test your project');
    console.log('  5. Commit the changes\n');
  }
}

function help() {
  return `
amazingteam migrate - Migrate v2.x project to v3

Usage:
  amazingteam migrate [options]

Options:
  --dry-run      Preview changes without applying
  --keep-v2      Keep v2 foundation files (don't remove)

What migration does:
  1. Detects v2.x project structure
  2. Extracts user customizations
  3. Creates backup of v2 files
  4. Creates v3 configuration files
  5. Updates workflow to use remote loading
  6. Removes v2 foundation files (unless --keep-v2)

After migration:
  - Run "amazingteam local" to download foundation for local dev
  - Run "amazingteam validate" to verify the setup

Note: A backup is created before any changes.
`;
}

module.exports = { run, help };