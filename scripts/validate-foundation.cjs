#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  check: '\x1b[32m✓\x1b[0m',
  cross: '\x1b[31m✗\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function check(name, condition, isWarning = false) {
  if (condition) {
    log(`  ${COLORS.check} ${name}`, 'green');
    results.passed++;
  } else if (isWarning) {
    log(`  ⚠ ${name}`, 'yellow');
    results.warnings++;
  } else {
    log(`  ${COLORS.cross} ${name}`, 'red');
    results.failed++;
  }
}

function checkFile(filePath, description, required = true) {
  check(`${description}: ${filePath}`, fileExists(filePath), !required);
}

function checkDir(dirPath, description, required = true) {
  check(`${description}: ${dirPath}`, dirExists(dirPath), !required);
}

function validateStructure() {
  log('\n📁 目录结构验证', 'cyan');
  
  checkDir('.amazing-team', '核心目录');
  checkDir('.amazing-team/agents', 'Agents 目录');
  checkDir('.amazing-team/skills', 'Skills 目录');
  checkDir('.amazing-team/commands', 'Commands 目录');
  checkDir('.amazing-team/memory', 'Memory 目录');
  checkDir('.github/workflows', 'GitHub Workflows 目录');
  checkDir('.github/ISSUE_TEMPLATE', 'Issue 模板目录');
  checkDir('docs', '文档目录');
  checkDir('tasks', '任务目录');
  checkDir('tasks/_template', '任务模板目录');
}

function validateAgents() {
  log('\n🤖 AI 角色验证 (v2)', 'cyan');
  
  const agents = [
    { name: 'Planner', file: '.amazing-team/agents/planner.md', v2: true },
    { name: 'Architect', file: '.amazing-team/agents/architect.md', v2: false },
    { name: 'Developer', file: '.amazing-team/agents/developer.md', v2: false },
    { name: 'QA', file: '.amazing-team/agents/qa.md', v2: false },
    { name: 'Reviewer', file: '.amazing-team/agents/reviewer.md', v2: false },
    { name: 'Triage', file: '.amazing-team/agents/triage.md', v2: true },
    { name: 'CI Analyst', file: '.amazing-team/agents/ci-analyst.md', v2: true },
  ];
  
  agents.forEach(agent => {
    const label = agent.v2 ? `${agent.name} (v2)` : agent.name;
    checkFile(agent.file, label);
  });
}

function validateSkills() {
  log('\n📚 技能验证', 'cyan');
  
  const skills = [
    { name: 'Repo Architecture Reader', dir: 'repo-architecture-reader' },
    { name: 'Bugfix Playbook', dir: 'bugfix-playbook' },
    { name: 'Test-First Feature Dev', dir: 'test-first-feature-dev' },
    { name: 'Safe Refactor Checklist', dir: 'safe-refactor-checklist' },
    { name: 'Task Breakdown (v2)', dir: 'task-breakdown-and-dispatch', v2: true },
    { name: 'Issue Triage (v2)', dir: 'issue-triage', v2: true },
    { name: 'CI Failure Analysis (v2)', dir: 'ci-failure-analysis', v2: true },
    { name: 'Regression Checklist (v2)', dir: 'regression-checklist', v2: true },
    { name: 'Release Readiness (v2)', dir: 'release-readiness-check', v2: true },
  ];
  
  skills.forEach(skill => {
    const label = skill.v2 ? `${skill.name} (v2)` : skill.name;
    checkFile(`.amazing-team/skills/${skill.dir}/skill.md`, label);
  });
}

function validateCommands() {
  log('\n⚡ 命令验证', 'cyan');
  
  const commands = [
    { name: 'Triage', file: '.amazing-team/commands/triage.md' },
    { name: 'Design', file: '.amazing-team/commands/design.md' },
    { name: 'Implement', file: '.amazing-team/commands/implement.md' },
    { name: 'Test', file: '.amazing-team/commands/test.md' },
    { name: 'Review', file: '.amazing-team/commands/review.md' },
    { name: 'CI Analyze (v2)', file: '.amazing-team/commands/ci-analyze.md', v2: true },
    { name: 'Release Check (v2)', file: '.amazing-team/commands/release-check.md', v2: true },
  ];
  
  commands.forEach(cmd => {
    const label = cmd.v2 ? `${cmd.name} (v2)` : cmd.name;
    checkFile(cmd.file, label);
  });
}

function validateMemory() {
  log('\n🧠 记忆系统验证 (v2)', 'cyan');
  
  const memoryAreas = [
    { role: 'Planner', dir: 'planner', files: ['decomposition_notes.md', 'flow_rules.md'], v2: true },
    { role: 'Architect', dir: 'architect', files: ['architecture_notes.md', 'module_map.md', 'design_rationale.md'] },
    { role: 'Developer', dir: 'developer', files: ['implementation_notes.md', 'bug_investigation.md', 'build_issues.md'] },
    { role: 'QA', dir: 'qa', files: ['test_strategy.md', 'regression_cases.md', 'validation_notes.md'] },
    { role: 'Reviewer', dir: 'reviewer', files: ['review_notes.md', 'quality_rules.md', 'recurring_risks.md'] },
    { role: 'Triage', dir: 'triage', files: ['classification_heuristics.md', 'debug_notes.md'], v2: true },
    { role: 'CI Analyst', dir: 'ci-analyst', files: ['failure_patterns.md', 'runbook_references.md'], v2: true },
    { role: 'Failures Library', dir: 'failures', files: ['failure_library.md'], v2: true },
  ];
  
  memoryAreas.forEach(area => {
    const label = area.v2 ? `${area.role} (v2)` : area.role;
    checkDir(`.amazing-team/memory/${area.dir}`, label);
    area.files.forEach(file => {
      checkFile(`.amazing-team/memory/${area.dir}/${file}`, `  └ ${file}`);
    });
  });
}

function validateDocumentation() {
  log('\n📖 文档验证 (v2)', 'cyan');
  
  checkDir('docs/architecture', '架构文档');
  checkDir('docs/decisions', '决策记录');
  checkDir('docs/patterns', '模式库 (v2)', false);
  checkDir('docs/releases', '发布文档 (v2)', false);
  checkDir('docs/runbooks', '运维手册');
  checkDir('docs/runbooks/ci', 'CI 运维手册 (v2)', false);
  
  checkFile('AGENTS.md', '全局规则');
  checkFile('README.md', '项目说明');
}

function validateTaskTemplate() {
  log('\n📋 任务模板验证 (v2)', 'cyan');
  
  checkFile('tasks/_template/task.yaml', '任务清单模板');
  checkFile('tasks/_template/analysis.md', '分析模板');
  checkFile('tasks/_template/design.md', '设计模板');
  checkFile('tasks/_template/implementation.md', '实现模板');
  checkFile('tasks/_template/validation.md', '验证模板');
  checkFile('tasks/_template/review.md', '审查模板');
  checkFile('tasks/_template/release.md', '发布模板');
}

function validateGitHubWorkflows() {
  log('\n⚙️ GitHub Workflows 验证', 'cyan');
  
  checkFile('.github/workflows/opencode.yml', 'OpenCode 触发');
  checkFile('.github/workflows/ci.yml', 'CI 流水线');
  checkFile('.github/workflows/pr-check.yml', 'PR 检查');
  
  const issueTemplates = ['feature_request.md', 'bug_report.md', 'tech_task.md'];
  issueTemplates.forEach(template => {
    checkFile(`.github/ISSUE_TEMPLATE/${template}`, `Issue 模板: ${template}`);
  });
  
  checkFile('.github/pull_request_template.md', 'PR 模板');
}

function validateConfig() {
  log('\n🔧 配置验证', 'cyan');
  
  checkFile('.amazing-team/opencode.template.jsonc', 'OpenCode 模板配置');
  checkFile('amazing-team.config.yaml', '项目配置', false);
  checkFile('package.json', 'Package 配置');
  checkFile('tsconfig.json', 'TypeScript 配置');
  
  const config = fileExists('.amazing-team/opencode.template.jsonc');
  if (config) {
    try {
      const content = fs.readFileSync('.amazing-team/opencode.template.jsonc', 'utf-8');
      const jsonStr = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      const config = JSON.parse(jsonStr);
      
      const agentCount = Object.keys(config.agents || {}).length;
      const skillCount = Object.keys(config.skills || {}).length;
      const commandCount = Object.keys(config.commands || {}).length;
      
      check(`  配置包含 ${agentCount} 个 agents`, agentCount >= 7);
      check(`  配置包含 ${skillCount} 个 skills`, skillCount >= 9);
      check(`  配置包含 ${commandCount} 个 commands`, commandCount >= 7);
    } catch (e) {
      log(`  ⚠ 配置文件解析失败: ${e.message}`, 'yellow');
      results.warnings++;
    }
  }
}

function validateAGENTSmd() {
  log('\n📄 AGENTS.md 内容验证', 'cyan');
  
  if (fileExists('AGENTS.md')) {
    const content = fs.readFileSync('AGENTS.md', 'utf-8');
    
    check('  包含 Planner 角色规则', content.includes('Planner Agent'));
    check('  包含 Triage 角色规则', content.includes('Triage Agent'));
    check('  包含 CI Analyst 角色规则', content.includes('CI Analyst'));
    check('  包含任务系统说明', content.includes('Task System'));
    check('  包含治理模型', content.includes('Governance'));
    check('  包含状态机', content.includes('State') || content.includes('backlog'));
    check('  包含 v2 命令表', content.includes('/ci-analyze') || content.includes('/release-check'));
  }
}

function printSummary() {
  log('\n' + '═'.repeat(50), 'cyan');
  log('验证结果汇总', 'cyan');
  log('═'.repeat(50), 'cyan');
  
  const total = results.passed + results.failed + results.warnings;
  
  log(`\n  通过: ${results.passed}/${total}`, 'green');
  log(`  失败: ${results.failed}/${total}`, results.failed > 0 ? 'red' : 'reset');
  log(`  警告: ${results.warnings}/${total}`, results.warnings > 0 ? 'yellow' : 'reset');
  
  if (results.failed === 0) {
    log('\n✅ AI Team 底座结构验证通过！', 'green');
    log('\n下一步:', 'cyan');
    log('  1. 运行 npm test 验证代码');
    log('  2. 运行 node cli/amazing-team.cjs status 检查状态');
    log('  3. 创建测试 Issue 验证 GitHub Actions');
  } else {
    log('\n❌ 验证失败，请检查上述错误项', 'red');
    process.exit(1);
  }
}

function main() {
  log('\n🔍 AI Team v2 底座验证\n', 'cyan');
  
  validateStructure();
  validateAgents();
  validateSkills();
  validateCommands();
  validateMemory();
  validateDocumentation();
  validateTaskTemplate();
  validateGitHubWorkflows();
  validateConfig();
  validateAGENTSmd();
  
  printSummary();
}

main();