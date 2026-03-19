/**
 * Validate Command
 * Validate configuration and project structure
 */

const fs = require('fs');
const path = require('path');

const VERSION = require('../../package.json').version;

function validateConfig(configPath) {
  const issues = [];
  
  if (!fs.existsSync(configPath)) {
    return { valid: false, issues: ['amazingteam.config.yaml not found'] };
  }
  
  const content = fs.readFileSync(configPath, 'utf-8');
  
  // Check required fields
  if (!content.includes('version:')) {
    issues.push('Missing required field: version');
  }
  
  if (!content.includes('project:')) {
    issues.push('Missing required field: project');
  } else {
    if (!content.match(/name:\s*["']?\w+/)) {
      issues.push('Missing required field: project.name');
    }
    if (!content.match(/language:\s*["']?\w+/)) {
      issues.push('Missing required field: project.language');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateStructure(projectPath) {
  const issues = [];
  
  const requiredDirs = [
    '.amazing-team',
    '.amazing-team/memory',
    'tasks'
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(path.join(projectPath, dir))) {
      issues.push(`Missing directory: ${dir}`);
    }
  }
  
  const requiredFiles = [
    'amazingteam.config.yaml',
    '.github/workflows/amazingteam.yml'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(projectPath, file))) {
      issues.push(`Missing file: ${file}`);
    }
  }
  
  const recommendedFiles = [
    'opencode.jsonc',
    'AGENTS.md',
    '.gitignore'
  ];
  
  const missingRecommended = recommendedFiles.filter(
    file => !fs.existsSync(path.join(projectPath, file))
  );
  
  return {
    valid: issues.length === 0,
    issues,
    warnings: missingRecommended.map(f => `Recommended file missing: ${f}`)
  };
}

function validateWorkflow(workflowPath) {
  const issues = [];
  
  if (!fs.existsSync(workflowPath)) {
    return { valid: false, issues: ['Workflow file not found'] };
  }
  
  const content = fs.readFileSync(workflowPath, 'utf-8');
  
  // Check for required permissions
  if (!content.includes('contents: write')) {
    issues.push('Missing permission: contents: write');
  }
  if (!content.includes('pull-requests: write')) {
    issues.push('Missing permission: pull-requests: write');
  }
  if (!content.includes('issues: write')) {
    issues.push('Missing permission: issues: write');
  }
  
  // Check for AmazingTeam action
  if (!content.includes('amazingteam-action')) {
    issues.push('AmazingTeam action not referenced in workflow');
  }
  
  // Check for secrets
  if (!content.includes('AMAZINGTEAM_API_KEY')) {
    issues.push('No API key secret referenced (AMAZINGTEAM_API_KEY)');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

function validateGitignore(projectPath) {
  const issues = [];
  const warnings = [];
  
  const gitignorePath = path.join(projectPath, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    issues.push('.gitignore not found');
    return { valid: false, issues, warnings };
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  
  if (!content.includes('.amazing-team-local/')) {
    warnings.push('.amazing-team-local/ not in .gitignore');
  }
  
  if (!content.includes('.amazing-team-cache/')) {
    warnings.push('.amazing-team-cache/ not in .gitignore');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
}

async function run(options, positional) {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'amazingteam.config.yaml');
  const workflowPath = path.join(projectPath, '.github', 'workflows', 'amazingteam.yml');
  
  console.log('\n🔍 Validating AmazingTeam setup\n');
  
  let allValid = true;
  const allIssues = [];
  const allWarnings = [];
  
  // Validate config
  console.log('Checking configuration...');
  const configResult = validateConfig(configPath);
  if (configResult.valid) {
    console.log('  ✅ Configuration valid');
  } else {
    console.log('  ❌ Configuration issues:');
    configResult.issues.forEach(issue => {
      console.log(`     - ${issue}`);
    });
    allIssues.push(...configResult.issues);
    allValid = false;
  }
  
  // Validate structure
  console.log('Checking project structure...');
  const structResult = validateStructure(projectPath);
  if (structResult.valid) {
    console.log('  ✅ Structure valid');
  } else {
    console.log('  ❌ Structure issues:');
    structResult.issues.forEach(issue => {
      console.log(`     - ${issue}`);
    });
    allIssues.push(...structResult.issues);
    allValid = false;
  }
  if (structResult.warnings.length > 0) {
    structResult.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
    allWarnings.push(...structResult.warnings);
  }
  
  // Validate workflow
  console.log('Checking workflow...');
  const workflowResult = validateWorkflow(workflowPath);
  if (workflowResult.valid) {
    console.log('  ✅ Workflow valid');
  } else {
    console.log('  ❌ Workflow issues:');
    workflowResult.issues.forEach(issue => {
      console.log(`     - ${issue}`);
    });
    allIssues.push(...workflowResult.issues);
    allValid = false;
  }
  
  // Validate gitignore
  console.log('Checking .gitignore...');
  const gitignoreResult = validateGitignore(projectPath);
  if (gitignoreResult.valid) {
    console.log('  ✅ .gitignore valid');
  } else {
    gitignoreResult.issues.forEach(issue => {
      console.log(`     - ${issue}`);
    });
    allIssues.push(...gitignoreResult.issues);
    allValid = false;
  }
  if (gitignoreResult.warnings.length > 0) {
    gitignoreResult.warnings.forEach(w => console.log(`  ⚠️  ${w}`));
    allWarnings.push(...gitignoreResult.warnings);
  }
  
  // Summary
  console.log('\n' + '='.repeat(40));
  
  if (allValid && allWarnings.length === 0) {
    console.log('✅ All validations passed!\n');
  } else if (allValid) {
    console.log(`✅ Valid (${allWarnings.length} warnings)\n`);
  } else {
    console.log(`❌ ${allIssues.length} issue(s) found\n`);
    console.log('Fix the issues above and run validate again.\n');
    process.exit(1);
  }
}

function help() {
  return `
amazingteam validate - Validate configuration and project structure

Usage:
  amazingteam validate

Validates:
  - amazingteam.config.yaml configuration
  - Required directories (.amazing-team/, tasks/)
  - GitHub workflow configuration
  - .gitignore entries

Exit codes:
  0 - All validations passed
  1 - Validation failures found

Run this after initialization or upgrades to verify setup.
`;
}

module.exports = { run, help };