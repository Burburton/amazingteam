/**
 * Runtime Setup Module
 * Initializes runtime directories and generates opencode.jsonc
 */

const fs = require('fs');
const path = require('path');
const PathResolver = require('./path-resolver');

/**
 * Initialize runtime directories
 * @param {string} projectDir - Project directory
 * @returns {string[]} Created directories
 */
function initializeRuntimeDirectories(projectDir) {
  const resolver = new PathResolver(null, projectDir);
  const created = [];
  
  const dirs = [
    '.amazing-team',
    '.amazing-team/memory',
    '.amazing-team/memory/planner',
    '.amazing-team/memory/architect',
    '.amazing-team/memory/developer',
    '.amazing-team/memory/qa',
    '.amazing-team/memory/reviewer',
    '.amazing-team/memory/triage',
    '.amazing-team/memory/ci-analyst',
    '.amazing-team/memory/failures',
    'tasks',
    'tasks/_template'
  ];
  
  for (const dir of dirs) {
    const dirPath = path.join(projectDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      created.push(dir);
    }
  }
  
  // Create memory placeholder files if they don't exist
  const memoryFiles = {
    'planner': ['decomposition_notes.md', 'flow_rules.md', 'github_issue_patterns.md'],
    'architect': ['architecture_notes.md', 'module_map.md', 'design_rationale.md'],
    'developer': ['implementation_notes.md', 'bug_investigation.md', 'build_issues.md'],
    'qa': ['test_strategy.md', 'regression_cases.md', 'validation_notes.md'],
    'reviewer': ['review_notes.md', 'quality_rules.md', 'recurring_risks.md'],
    'triage': ['classification_heuristics.md', 'debug_notes.md'],
    'ci-analyst': ['failure_patterns.md', 'runbook_references.md']
  };
  
  for (const [role, files] of Object.entries(memoryFiles)) {
    for (const file of files) {
      const filePath = path.join(projectDir, '.amazing-team', 'memory', role, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `# ${role} ${file.replace('.md', '').replace(/_/g, ' ')}\n\n`);
      }
    }
  }
  
  // Create failure library placeholder
  const failuresPath = path.join(projectDir, '.amazing-team', 'memory', 'failures', 'failure_library.md');
  if (!fs.existsSync(failuresPath)) {
    fs.writeFileSync(failuresPath, `# Failure Library\n\nShared failure patterns documented by CI Analyst.\n\n## Categories\n\n### Build Failures\n\n### Test Failures\n\n### Infrastructure Issues\n\n`);
  }
  
  return created;
}

/**
 * Generate opencode.jsonc from template
 * @param {string} foundationDir - Foundation directory
 * @param {string} projectDir - Project directory
 * @param {Object} config - User configuration
 * @returns {string} Path to generated opencode.jsonc
 */
function generateOpenCodeConfig(foundationDir, projectDir, config) {
  const resolver = new PathResolver(foundationDir, projectDir);
  const templatePath = path.join(foundationDir, 'templates', 'opencode.jsonc');
  
  let template;
  if (fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, 'utf-8');
  } else {
    // Use default template
    template = getDefaultOpenCodeTemplate();
  }
  
  // Replace template variables
  const vars = {
    AI_TEAM_VERSION: config.ai_team?.version || '3.0.0',
    PROJECT_NAME: config.project?.name || 'my-project',
    PROJECT_DESCRIPTION: config.project?.description || '',
    LANGUAGE: config.project?.language || 'typescript',
    FRAMEWORK: config.project?.framework || 'node',
    FOUNDATION_PATH: foundationDir
  };
  
  let content = resolver.resolveTemplateVars(template, vars);
  
  // Write to project
  const outputPath = resolver.resolveOpenCodeConfigPath();
  fs.writeFileSync(outputPath, content);
  
  return outputPath;
}

/**
 * Get default OpenCode template
 * @returns {string} Default template content
 */
function getDefaultOpenCodeTemplate() {
  return `{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["AGENTS.md"],
  "autoupdate": true,
  "permission": {
    "edit": "ask",
    "bash": "ask"
  },
  "tools": {
    "write": true,
    "edit": true,
    "bash": true
  }
}`;
}

/**
 * Copy task templates from foundation
 * @param {string} foundationDir - Foundation directory
 * @param {string} projectDir - Project directory
 * @returns {string[]} Copied files
 */
function copyTaskTemplates(foundationDir, projectDir) {
  const templateDir = path.join(foundationDir, 'tasks', '_template');
  const targetDir = path.join(projectDir, 'tasks', '_template');
  
  const copied = [];
  
  if (fs.existsSync(templateDir)) {
    const files = fs.readdirSync(templateDir);
    
    for (const file of files) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(targetDir, file);
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        copied.push(file);
      }
    }
  }
  
  return copied;
}

/**
 * Copy AGENTS.md from foundation to project
 * @param {string} foundationDir - Foundation directory
 * @param {string} projectDir - Project directory
 * @returns {boolean} Whether file was copied
 */
function copyAgentsMd(foundationDir, projectDir) {
  const srcPath = path.join(foundationDir, 'AGENTS.md');
  const destPath = path.join(projectDir, 'AGENTS.md');
  
  // Don't overwrite if user has their own AGENTS.md
  if (fs.existsSync(destPath)) {
    console.log('AGENTS.md already exists in project, skipping');
    return false;
  }
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('Copied AGENTS.md to project');
    return true;
  }
  
  console.log('AGENTS.md not found in foundation');
  return false;
}

/**
 * Copy .opencode directory from foundation to project
 * @param {string} foundationDir - Foundation directory
 * @param {string} projectDir - Project directory
 * @returns {string[]} Copied items
 */
function copyOpenCodeDir(foundationDir, projectDir) {
  const srcDir = path.join(foundationDir, '.opencode');
  const destDir = path.join(projectDir, '.opencode');
  
  const copied = [];
  
  if (!fs.existsSync(srcDir)) {
    console.log('.opencode not found in foundation');
    return copied;
  }
  
  // Create destination directory
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy subdirectories recursively
  const subdirs = ['skills', 'commands', 'agents'];
  
  for (const subdir of subdirs) {
    const srcSubdir = path.join(srcDir, subdir);
    const destSubdir = path.join(destDir, subdir);
    
    if (fs.existsSync(srcSubdir)) {
      copyDirRecursive(srcSubdir, destSubdir);
      copied.push(`.opencode/${subdir}`);
    }
  }
  
  return copied;
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Update .gitignore
 * @param {string} projectDir - Project directory
 * @returns {boolean} Whether .gitignore was updated
 */
function updateGitignore(projectDir) {
  const gitignorePath = path.join(projectDir, '.gitignore');
  const additions = [
    '# AI Team local foundation',
    '.amazing-team-local/',
    '',
    '# AI Team cache',
    '.amazing-team-cache/'
  ];
  
  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf-8');
    
    // Check if already has AI Team entries
    if (content.includes('.amazing-team-local/')) {
      return false;
    }
  }
  
  // Append additions
  const newContent = content + '\n\n' + additions.join('\n') + '\n';
  fs.writeFileSync(gitignorePath, newContent);
  
  return true;
}

/**
 * Full setup process
 * @param {string} foundationDir - Foundation directory
 * @param {string} projectDir - Project directory
 * @param {Object} config - User configuration
 * @returns {Object} Setup result
 */
function setup(foundationDir, projectDir, config) {
  console.log('Setting up AmazingTeam...');
  
  // 1. Initialize runtime directories
  console.log('Creating runtime directories...');
  const createdDirs = initializeRuntimeDirectories(projectDir);
  console.log(`Created ${createdDirs.length} directories`);
  
  // 2. Copy AGENTS.md from foundation
  console.log('Copying AGENTS.md...');
  const copiedAgentsMd = copyAgentsMd(foundationDir, projectDir);
  
  // 3. Copy .opencode directory from foundation
  console.log('Copying .opencode directory...');
  const copiedOpenCode = copyOpenCodeDir(foundationDir, projectDir);
  console.log(`Copied: ${copiedOpenCode.join(', ') || 'none'}`);
  
  // 4. Copy task templates
  console.log('Copying task templates...');
  const copiedTemplates = copyTaskTemplates(foundationDir, projectDir);
  console.log(`Copied ${copiedTemplates.length} templates`);
  
  // 5. Generate opencode.jsonc
  console.log('Generating opencode.jsonc...');
  const opencodePath = generateOpenCodeConfig(foundationDir, projectDir, config);
  console.log(`Generated: ${opencodePath}`);
  
  // 6. Update .gitignore
  console.log('Updating .gitignore...');
  const gitignoreUpdated = updateGitignore(projectDir);
  if (gitignoreUpdated) {
    console.log('Updated .gitignore');
  } else {
    console.log('.gitignore already up to date');
  }
  
  return {
    createdDirectories: createdDirs,
    copiedAgentsMd,
    copiedOpenCode,
    copiedTemplates,
    opencodePath,
    gitignoreUpdated
  };
}

/**
 * Verify setup
 * @param {string} projectDir - Project directory
 * @returns {{ valid: boolean, issues: string[] }}
 */
function verifySetup(projectDir) {
  const issues = [];
  
  // Check required directories
  const requiredDirs = [
    '.amazing-team',
    '.amazing-team/memory',
    'tasks'
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(path.join(projectDir, dir))) {
      issues.push(`Missing directory: ${dir}`);
    }
  }
  
  // Check required files
  const requiredFiles = [
    'amazingteam.config.yaml',
    'opencode.jsonc'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(projectDir, file))) {
      issues.push(`Missing file: ${file}`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

module.exports = {
  initializeRuntimeDirectories,
  generateOpenCodeConfig,
  copyTaskTemplates,
  copyAgentsMd,
  copyOpenCodeDir,
  copyDirRecursive,
  updateGitignore,
  setup,
  verifySetup
};