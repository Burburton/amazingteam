/**
 * Status Command
 * Show AmazingTeam status
 */

const fs = require('fs');
const path = require('path');

const VERSION = require('../../package.json').version;

function parseConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  const content = fs.readFileSync(configPath, 'utf-8');
  const config = {};
  let currentSection = null;
  let currentSubSection = null;
  
  content.split('\n').forEach(line => {
    if (line.trim().startsWith('#') || !line.trim()) return;
    
    const indent = line.search(/\S/);
    
    // Section (0 indent)
    if (indent === 0) {
      const match = line.match(/^(\w+):$/);
      if (match) {
        currentSection = match[1];
        config[currentSection] = {};
        currentSubSection = null;
      }
    }
    // Sub-section (2 spaces)
    else if (indent === 2 && currentSection) {
      const match = line.match(/^  (\w+):\s*(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        
        if (value === '') {
          currentSubSection = key;
          config[currentSection][key] = {};
        } else {
          value = value.replace(/^["']|["']$/g, '');
          if (value === 'true') value = true;
          else if (value === 'false') value = false;
          else if (!isNaN(Number(value))) value = Number(value);
          
          config[currentSection][key] = value;
        }
      }
    }
    // Sub-sub-section (4 spaces)
    else if (indent === 4 && currentSection && currentSubSection) {
      const match = line.match(/^    (\w+):\s*(.*)$/);
      if (match) {
        let value = match[2].trim().replace(/^["']|["']$/g, '');
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        
        config[currentSection][currentSubSection][match[1]] = value;
      }
    }
  });
  
  return config;
}

function countTasks(tasksPath) {
  if (!fs.existsSync(tasksPath)) return { total: 0, byStatus: {} };
  
  const tasks = fs.readdirSync(tasksPath).filter(f => 
    f.startsWith('issue-') && fs.statSync(path.join(tasksPath, f)).isDirectory()
  );
  
  const byStatus = {};
  
  tasks.forEach(task => {
    const taskFile = path.join(tasksPath, task, 'task.yaml');
    if (fs.existsSync(taskFile)) {
      const content = fs.readFileSync(taskFile, 'utf-8');
      const statusMatch = content.match(/status:\s*(\w+)/);
      if (statusMatch) {
        const status = statusMatch[1];
        byStatus[status] = (byStatus[status] || 0) + 1;
      }
    }
  });
  
  return { total: tasks.length, byStatus };
}

function checkMemoryFiles(memoryPath) {
  if (!fs.existsSync(memoryPath)) return {};
  
  const roles = fs.readdirSync(memoryPath).filter(f => 
    fs.statSync(path.join(memoryPath, f)).isDirectory()
  );
  
  const result = {};
  
  roles.forEach(role => {
    const rolePath = path.join(memoryPath, role);
    const files = fs.readdirSync(rolePath).filter(f => f.endsWith('.md'));
    result[role] = files.length;
  });
  
  return result;
}

async function run(options, positional) {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'amazingteam.config.yaml');
  const workflowPath = path.join(projectPath, '.github', 'workflows', 'amazingteam.yml');
  const localPath = path.join(projectPath, '.ai-team-local');
  
  console.log('\n📊 AmazingTeam Status\n');
  
  const config = parseConfig(configPath);
  
  if (!config) {
    console.log('❌ AmazingTeam not initialized');
    console.log('   Run "amazingteam init" to get started\n');
    return;
  }
  
  // Project info
  console.log('Project:');
  console.log(`  Name:        ${config.project?.name || 'Unknown'}`);
  console.log(`  Language:    ${config.project?.language || 'Unknown'}`);
  console.log(`  Framework:   ${config.project?.framework || 'Unknown'}`);
  if (config.project?.description) {
    console.log(`  Description: ${config.project.description}`);
  }
  
  // Version info
  console.log('\nVersion:');
  console.log(`  CLI:         ${VERSION}`);
  console.log(`  Config:      ${config.ai_team?.version || 'Unknown'}`);
  
  // Check workflow version
  if (fs.existsSync(workflowPath)) {
    const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
    const actionMatch = workflowContent.match(/amazingteam-action@v?(\d+\.\d+\.\d+)/);
    if (actionMatch) {
      console.log(`  Workflow:    ${actionMatch[1]}`);
    }
  }
  
  // Local foundation status
  console.log('\nLocal Foundation:');
  if (fs.existsSync(localPath)) {
    const localVersionPath = path.join(localPath, 'VERSION');
    if (fs.existsSync(localVersionPath)) {
      console.log(`  Status:      Downloaded (v${fs.readFileSync(localVersionPath, 'utf-8').trim()})`);
    } else {
      console.log('  Status:      Downloaded');
    }
    console.log(`  Path:        ${LOCAL_DIR}/`);
  } else {
    console.log('  Status:      Not downloaded');
    console.log('  Run:         amazingteam local');
  }
  
  // Memory status
  console.log('\nMemory:');
  const memoryPath = path.join(projectPath, '.ai-team', 'memory');
  const memoryFiles = checkMemoryFiles(memoryPath);
  
  if (Object.keys(memoryFiles).length > 0) {
    Object.entries(memoryFiles).forEach(([role, count]) => {
      console.log(`  ${role}: ${count} file(s)`);
    });
  } else {
    console.log('  No memory files');
  }
  
  // Tasks status
  console.log('\nTasks:');
  const tasksPath = path.join(projectPath, 'tasks');
  const taskStats = countTasks(tasksPath);
  
  console.log(`  Total: ${taskStats.total}`);
  if (Object.keys(taskStats.byStatus).length > 0) {
    Object.entries(taskStats.byStatus).forEach(([status, count]) => {
      console.log(`    ${status}: ${count}`);
    });
  }
  
  // Validation quick check
  console.log('\nQuick Check:');
  const issues = [];
  
  if (!fs.existsSync(path.join(projectPath, 'opencode.jsonc'))) {
    issues.push('opencode.jsonc not found');
  }
  
  if (!fs.existsSync(workflowPath)) {
    issues.push('Workflow file not found');
  }
  
  if (!fs.existsSync(path.join(projectPath, '.gitignore'))) {
    issues.push('.gitignore not found');
  }
  
  const gitignore = fs.readFileSync(path.join(projectPath, '.gitignore'), 'utf-8');
  if (!gitignore.includes('.ai-team-local/')) {
    issues.push('.ai-team-local/ not in .gitignore');
  }
  
  if (issues.length === 0) {
    console.log('  ✅ All checks passed');
  } else {
    issues.forEach(issue => console.log(`  ⚠️  ${issue}`));
  }
  
  console.log('\n');
}

function help() {
  return `
amazingteam status - Show AmazingTeam status

Usage:
  amazingteam status

Displays:
  - Project configuration
  - Version information (CLI, config, workflow)
  - Local foundation status
  - Memory files by role
  - Task statistics
  - Quick validation check

Run "amazingteam validate" for detailed validation.
`;
}

module.exports = { run, help };