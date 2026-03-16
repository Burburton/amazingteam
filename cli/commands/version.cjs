/**
 * Version Command
 * Show current foundation version
 */

const fs = require('fs');
const path = require('path');

const VERSION = require('../../package.json').version;

function run(options, positional) {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'ai-team.config.yaml');
  const workflowPath = path.join(projectPath, '.github', 'workflows', 'ai-team.yml');
  
  console.log(`\nai-team-foundation v${VERSION}\n`);
  
  // Check project config
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf-8');
    const versionMatch = content.match(/version:\s*["']?(\d+\.\d+\.\d+)/);
    if (versionMatch) {
      console.log(`Project config version: ${versionMatch[1]}`);
    }
  }
  
  // Check workflow version
  if (fs.existsSync(workflowPath)) {
    const content = fs.readFileSync(workflowPath, 'utf-8');
    const actionMatch = content.match(/ai-team-action@v?(\d+\.\d+\.\d+)/);
    if (actionMatch) {
      console.log(`Workflow action version: ${actionMatch[1]}`);
    }
  }
  
  // Check if initialized
  if (!fs.existsSync(configPath)) {
    console.log('\n⚠️  AI Team not initialized in this directory.');
    console.log('   Run "ai-team init" to get started.\n');
  }
}

function help() {
  return `
ai-team version - Show current foundation version

Usage:
  ai-team version
  ai-team --version
  ai-team -v

Displays:
  - CLI version
  - Project config version (if initialized)
  - Workflow action version (if configured)
`;
}

module.exports = { run, help };