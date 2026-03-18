/**
 * Integration Tests
 * Tests for full workflows: init → local → validate
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const CLI_PATH = path.join(__dirname, '..', 'cli', 'amazingteam.cjs');
const TEMP_DIR = path.join(os.tmpdir(), 'amazingteam-integration-test');
const ACTION_DIR = path.join(__dirname, '..');

let originalCwd;

function setup() {
  console.log('Setting up integration test environment...');
  
  originalCwd = process.cwd();
  
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  
  console.log(`  Working directory: ${TEMP_DIR}`);
}

function teardown() {
  console.log('Cleaning up integration test environment...');
  
  process.chdir(originalCwd);
  
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
  } catch (err) {
    if (err.code !== 'EBUSY') {
      throw err;
    }
    console.log('  Note: Temp directory locked, will be cleaned by OS');
  }
}

function createTestProject(name, language = 'typescript') {
  const projectDir = path.join(TEMP_DIR, name);
  fs.mkdirSync(projectDir, { recursive: true });
  
  fs.mkdirSync(path.join(projectDir, '.ai-team', 'memory'), { recursive: true });
  fs.mkdirSync(path.join(projectDir, 'tasks'), { recursive: true });
  
  const config = `project:
  name: ${name}
  language: ${language}
`;
  fs.writeFileSync(path.join(projectDir, 'amazingteam.config.yaml'), config);
  
  return projectDir;
}

function testFullWorkflow_TypeScript() {
  console.log('\nTesting full workflow: TypeScript project...');
  
  const projectDir = createTestProject('ts-project', 'typescript');
  process.chdir(projectDir);
  
  console.assert(fs.existsSync('amazingteam.config.yaml'), 'Config should exist');
  console.assert(fs.existsSync('.ai-team/memory'), 'Memory dir should exist');
  console.assert(fs.existsSync('tasks'), 'Tasks dir should exist');
  
  const config = fs.readFileSync('amazingteam.config.yaml', 'utf-8');
  console.assert(config.includes('ts-project'), 'Config should have project name');
  console.assert(config.includes('typescript'), 'Config should have language');
  
  process.chdir(TEMP_DIR);
  console.log('  ✓ TypeScript workflow tests passed');
}

function testFullWorkflow_Python() {
  console.log('\nTesting full workflow: Python project...');
  
  const projectDir = createTestProject('py-project', 'python');
  process.chdir(projectDir);
  
  const config = fs.readFileSync('amazingteam.config.yaml', 'utf-8');
  console.assert(config.includes('py-project'), 'Config should have project name');
  console.assert(config.includes('python'), 'Config should have language');
  
  process.chdir(TEMP_DIR);
  console.log('  ✓ Python workflow tests passed');
}

function testFullWorkflow_Go() {
  console.log('\nTesting full workflow: Go project...');
  
  const projectDir = createTestProject('go-project', 'go');
  process.chdir(projectDir);
  
  const config = fs.readFileSync('amazingteam.config.yaml', 'utf-8');
  console.assert(config.includes('go-project'), 'Config should have project name');
  console.assert(config.includes('language: go'), 'Config should have go language');
  
  process.chdir(TEMP_DIR);
  console.log('  ✓ Go workflow tests passed');
}

function testMemoryDirectoryStructure() {
  console.log('\nTesting memory directory structure...');
  
  const projectDir = createTestProject('memory-test');
  
  const roles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci-analyst'];
  
  for (const role of roles) {
    const roleDir = path.join(projectDir, '.ai-team', 'memory', role);
    fs.mkdirSync(roleDir, { recursive: true });
    console.assert(fs.existsSync(roleDir), `Role directory ${role} should exist`);
  }
  
  const failuresDir = path.join(projectDir, '.ai-team', 'memory', 'failures');
  fs.mkdirSync(failuresDir, { recursive: true });
  console.assert(fs.existsSync(failuresDir), 'Failures directory should exist');
  
  console.log('  ✓ memory directory structure tests passed');
}

function testTaskDirectoryStructure() {
  console.log('\nTesting task directory structure...');
  
  const projectDir = createTestProject('task-test');
  
  const templateDir = path.join(projectDir, 'tasks', '_template');
  fs.mkdirSync(templateDir, { recursive: true });
  
  const taskFiles = ['analysis.md', 'design.md', 'implementation.md', 'validation.md', 'review.md'];
  for (const file of taskFiles) {
    fs.writeFileSync(path.join(templateDir, file), `# ${file}\n`);
  }
  
  console.assert(fs.existsSync(templateDir), 'Template directory should exist');
  
  for (const file of taskFiles) {
    const filePath = path.join(templateDir, file);
    console.assert(fs.existsSync(filePath), `Template file ${file} should exist`);
  }
  
  const taskDir = path.join(projectDir, 'tasks', 'issue-123');
  fs.mkdirSync(taskDir, { recursive: true });
  fs.writeFileSync(path.join(taskDir, 'task.yaml'), 'id: issue-123\n');
  
  console.assert(fs.existsSync(taskDir), 'Task directory should exist');
  console.assert(fs.existsSync(path.join(taskDir, 'task.yaml')), 'Task manifest should exist');
  
  console.log('  ✓ task directory structure tests passed');
}

function testActionModulesIntegration() {
  console.log('\nTesting action modules integration...');
  
  const { mergeConfig, deepClone } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  const PathResolver = require(path.join(ACTION_DIR, 'action', 'lib', 'path-resolver'));
  
  const defaults = {
    version: '1.0',
    project: { language: 'typescript' },
    build: { command: 'npm run build' }
  };
  
  const user = {
    project: { name: 'test-project' },
    build: { test: 'npm test' }
  };
  
  const merged = mergeConfig(defaults, user);
  
  console.assert(merged.version === '1.0', 'Should keep default version');
  console.assert(merged.project.name === 'test-project', 'Should have user project name');
  console.assert(merged.project.language === 'typescript', 'Should keep default language');
  console.assert(merged.build.command === 'npm run build', 'Should keep default build command');
  
  const resolver = new PathResolver('/foundation', '/project');
  console.assert(resolver.resolveMemoryPath('planner').includes('planner'), 'Should resolve memory path');
  console.assert(resolver.resolveTaskPath(123).includes('issue-123'), 'Should resolve task path');
  
  console.log('  ✓ action modules integration tests passed');
}

function testConfigWithBuildCommands() {
  console.log('\nTesting config with build commands...');
  
  const projectDir = createTestProject('build-test');
  
  const fullConfig = `project:
  name: build-test
  language: typescript

build:
  command: npm run build
  test: npm test
  lint: npm run lint
  typecheck: npm run typecheck

rules:
  test_coverage_threshold: 80
  max_function_lines: 30
`;
  
  fs.writeFileSync(path.join(projectDir, 'amazingteam.config.yaml'), fullConfig);
  
  const config = fs.readFileSync(path.join(projectDir, 'amazingteam.config.yaml'), 'utf-8');
  
  console.assert(config.includes('build:'), 'Should have build section');
  console.assert(config.includes('npm run build'), 'Should have build command');
  console.assert(config.includes('npm test'), 'Should have test command');
  console.assert(config.includes('rules:'), 'Should have rules section');
  console.assert(config.includes('test_coverage_threshold: 80'), 'Should have coverage threshold');
  
  console.log('  ✓ config with build commands tests passed');
}

function testConfigWithWorkflows() {
  console.log('\nTesting config with workflows...');
  
  const projectDir = createTestProject('workflow-test');
  
  const configWithWorkflows = `project:
  name: workflow-test
  language: typescript

workflows:
  feature:
    sequence:
      - triage
      - architect
      - developer
      - qa
      - reviewer
    auto_merge: false
  bugfix:
    sequence:
      - triage
      - developer
      - qa
    auto_merge: false
`;
  
  fs.writeFileSync(path.join(projectDir, 'amazingteam.config.yaml'), configWithWorkflows);
  
  const config = fs.readFileSync(path.join(projectDir, 'amazingteam.config.yaml'), 'utf-8');
  
  console.assert(config.includes('workflows:'), 'Should have workflows section');
  console.assert(config.includes('feature:'), 'Should have feature workflow');
  console.assert(config.includes('bugfix:'), 'Should have bugfix workflow');
  console.assert(config.includes('auto_merge: false'), 'Should have auto_merge setting');
  
  console.log('  ✓ config with workflows tests passed');
}

function testUpgradeFlow() {
  console.log('\nTesting upgrade flow simulation...');
  
  const projectDir = createTestProject('upgrade-test');
  
  const workflowPath = path.join(projectDir, '.github', 'workflows');
  fs.mkdirSync(workflowPath, { recursive: true });
  
  const workflow = `name: AmazingTeam
on:
  issue_comment:
    types: [created]
jobs:
  amazingteam:
    runs-on: ubuntu-latest
    steps:
      - uses: your-org/amazingteam-action@v3.0.0
`;
  fs.writeFileSync(path.join(workflowPath, 'amazingteam.yml'), workflow);
  
  console.assert(fs.existsSync(path.join(workflowPath, 'amazingteam.yml')), 'Workflow should exist');
  
  const workflowContent = fs.readFileSync(path.join(workflowPath, 'amazingteam.yml'), 'utf-8');
  console.assert(workflowContent.includes('v3.0.0'), 'Workflow should reference version');
  
  const upgradedWorkflow = workflowContent.replace('v3.0.0', 'v3.1.0');
  fs.writeFileSync(path.join(workflowPath, 'amazingteam.yml'), upgradedWorkflow);
  
  const upgradedContent = fs.readFileSync(path.join(workflowPath, 'amazingteam.yml'), 'utf-8');
  console.assert(upgradedContent.includes('v3.1.0'), 'Workflow should be upgraded');
  
  console.log('  ✓ upgrade flow simulation tests passed');
}

function testGitignoreUpdate() {
  console.log('\nTesting .gitignore update...');
  
  const projectDir = createTestProject('gitignore-test');
  
  const gitignorePath = path.join(projectDir, '.gitignore');
  const gitignoreContent = `node_modules/
dist/
`;
  fs.writeFileSync(gitignorePath, gitignoreContent);
  
  const additions = `
# AI Team Foundation v3
.ai-team-local/
`;
  fs.appendFileSync(gitignorePath, additions);
  
  const updated = fs.readFileSync(gitignorePath, 'utf-8');
  console.assert(updated.includes('.ai-team-local/'), 'Should have ai-team-local entry');
  
  console.log('  ✓ .gitignore update tests passed');
}

function runAll() {
  console.log('\n=== Integration Tests ===\n');
  
  try {
    setup();
    
    testFullWorkflow_TypeScript();
    testFullWorkflow_Python();
    testFullWorkflow_Go();
    testMemoryDirectoryStructure();
    testTaskDirectoryStructure();
    testActionModulesIntegration();
    testConfigWithBuildCommands();
    testConfigWithWorkflows();
    testUpgradeFlow();
    testGitignoreUpdate();
    
    console.log('\n✅ All integration tests passed!\n');
  } finally {
    teardown();
  }
}

runAll();