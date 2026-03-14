#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const TEMPLATE_FILES = [
  '.ai-team/agents/architect.md',
  '.ai-team/agents/developer.md',
  '.ai-team/agents/qa.md',
  '.ai-team/agents/reviewer.md',
  '.ai-team/skills/bugfix-playbook/skill.md',
  '.ai-team/skills/repo-architecture-reader/skill.md',
  '.ai-team/skills/safe-refactor-checklist/skill.md',
  '.ai-team/skills/test-first-feature-dev/skill.md',
  '.ai-team/commands/design.md',
  '.ai-team/commands/implement.md',
  '.ai-team/commands/review.md',
  '.ai-team/commands/test.md',
  '.ai-team/commands/triage.md',
  '.ai-team/workflows/opencode.yml',
  '.ai-team/workflows/ci.yml',
  '.ai-team/workflows/pr-check.yml',
  '.ai-team/workflows/nightly-ai-maintenance.yml',
  '.ai-team/memory/architect/architecture_notes.md',
  '.ai-team/memory/architect/module_map.md',
  '.ai-team/memory/architect/design_rationale.md',
  '.ai-team/memory/developer/implementation_notes.md',
  '.ai-team/memory/developer/bug_investigation.md',
  '.ai-team/memory/developer/build_issues.md',
  '.ai-team/memory/qa/test_strategy.md',
  '.ai-team/memory/qa/regression_cases.md',
  '.ai-team/memory/qa/validation_notes.md',
  '.ai-team/memory/reviewer/review_notes.md',
  '.ai-team/memory/reviewer/quality_rules.md',
  '.ai-team/memory/reviewer/recurring_risks.md',
];

const USER_CONFIGURABLE_FILES = [
  'AGENTS.md',
  'ai-team.config.yaml',
  '.github/ISSUE_TEMPLATE/',
  '.github/pull_request_template.md',
];

function getTemplateVersion() {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return pkg.version || '1.0.0';
  }
  return '1.0.0';
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyTemplateFile(src, dest, templateDir) {
  const srcPath = path.join(templateDir, src);
  const destPath = dest;
  
  if (fs.existsSync(srcPath)) {
    ensureDir(destPath);
    fs.copyFileSync(srcPath, destPath);
    return true;
  }
  return false;
}

function mergeYamlConfig(existingPath, templatePath, newPath) {
  if (!fs.existsSync(existingPath)) {
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, newPath);
    }
    return;
  }
  
  const existing = fs.readFileSync(existingPath, 'utf-8');
  
  const versionMatch = existing.match(/version:\s*["']([^"']+)["']/);
  const currentVersion = versionMatch ? versionMatch[1] : '0.0.0';
  
  const newVersion = getTemplateVersion();
  
  let updated = existing.replace(
    /version:\s*["'][^"']+["']/,
    `version: "${newVersion}"`
  );
  
  updated = updated.replace(
    /last_sync:\s*(null|["'][^"']+["'])/,
    `last_sync: "${new Date().toISOString()}"`
  );
  
  fs.writeFileSync(newPath, updated);
}

function checkForUpdates(templateRepo) {
  try {
    log('Checking for updates...', 'cyan');
    
    const result = execSync(
      `git ls-remote ${templateRepo} HEAD`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    
    const latestCommit = result.split(/\s+/)[0];
    
    const currentCommit = execSync(
      'git rev-parse HEAD 2>/dev/null || echo "unknown"',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    
    return {
      hasUpdate: latestCommit !== currentCommit,
      latestCommit,
      currentCommit,
    };
  } catch (error) {
    return {
      hasUpdate: false,
      error: error.message,
    };
  }
}

function syncFromTemplate(projectDir, templateDir, options = {}) {
  log('\n📦 Syncing AI Team template files...\n', 'cyan');
  
  const backupDir = path.join(projectDir, `.ai-team-backup-${Date.now()}`);
  
  if (fs.existsSync(path.join(projectDir, '.ai-team'))) {
    if (options.backup !== false) {
      log('Creating backup...', 'blue');
      fs.cpSync(
        path.join(projectDir, '.ai-team'),
        backupDir,
        { recursive: true }
      );
      log(`Backup created: ${backupDir}`, 'yellow');
    }
  }
  
  log('\nUpdating core files...', 'blue');
  let updatedCount = 0;
  
  TEMPLATE_FILES.forEach(file => {
    const srcPath = path.join(templateDir, file);
    const destPath = path.join(projectDir, file);
    
    if (fs.existsSync(srcPath)) {
      ensureDir(destPath);
      fs.copyFileSync(srcPath, destPath);
      updatedCount++;
      log(`  ✓ ${file}`, 'green');
    }
  });
  
  if (!fs.existsSync(path.join(projectDir, '.github/workflows'))) {
    fs.mkdirSync(path.join(projectDir, '.github/workflows'), { recursive: true });
  }
  
  const workflowFiles = [
    'opencode.yml',
    'ci.yml',
    'pr-check.yml',
    'nightly-ai-maintenance.yml',
  ];
  
  workflowFiles.forEach(file => {
    const srcPath = path.join(templateDir, '.ai-team/workflows', file);
    const destPath = path.join(projectDir, '.github/workflows', file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      log(`  ✓ .github/workflows/${file}`, 'green');
    }
  });
  
  log(`\n✅ Updated ${updatedCount + workflowFiles.length} files\n`, 'green');
  
  return backupDir;
}

function detectConflicts(projectDir, templateDir) {
  const conflicts = [];
  
  USER_CONFIGURABLE_FILES.forEach(file => {
    const projectFile = path.join(projectDir, file);
    const templateFile = path.join(templateDir, file);
    
    if (fs.existsSync(projectFile) && fs.existsSync(templateFile)) {
      const projectContent = fs.readFileSync(projectFile, 'utf-8');
      const templateContent = fs.readFileSync(templateFile, 'utf-8');
      
      if (projectContent !== templateContent) {
        conflicts.push({
          file,
          type: 'modified',
          action: 'skip',
        });
      }
    }
  });
  
  return conflicts;
}

module.exports = {
  getTemplateVersion,
  syncFromTemplate,
  checkForUpdates,
  detectConflicts,
  TEMPLATE_FILES,
  USER_CONFIGURABLE_FILES,
};