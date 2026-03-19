/**
 * Path Resolver Module Tests
 */

const path = require('path');
const PathResolver = require('../lib/path-resolver');

const WINDOWS = process.platform === 'win32';

function testConstructor() {
  console.log('Testing PathResolver constructor...');
  
  const resolver = new PathResolver('/foundation', '/project');
  
  console.assert(resolver.foundationDir === '/foundation', 'Should store foundation dir');
  console.assert(resolver.projectDir === '/project', 'Should store project dir');
  
  console.log('  ✓ constructor tests passed');
}

function testResolveSkillPath() {
  console.log('Testing resolveSkillPath...');
  
  const resolver = new PathResolver('/foundation', '/project');
  const skillPath = resolver.resolveSkillPath('.opencode/skills/test-first-feature-dev/SKILL.md');
  
  const expected = path.join('/foundation', '.opencode/skills/test-first-feature-dev/SKILL.md');
  console.assert(skillPath === expected, `Should resolve skill path: ${skillPath}`);
  
  console.log('  ✓ resolveSkillPath tests passed');
}

function testResolveCommandPath() {
  console.log('Testing resolveCommandPath...');
  
  const resolver = new PathResolver('/foundation', '/project');
  const cmdPath = resolver.resolveCommandPath('.amazing-team/commands/auto.md');
  
  const expected = path.join('/foundation', '.amazing-team/commands/auto.md');
  console.assert(cmdPath === expected, `Should resolve command path: ${cmdPath}`);
  
  console.log('  ✓ resolveCommandPath tests passed');
}

function testResolveMemoryPath() {
  console.log('Testing resolveMemoryPath...');
  
  const resolver = new PathResolver('/foundation', '/project');
  
  const plannerMemory = resolver.resolveMemoryPath('planner');
  const expectedPlanner = path.join('/project', '.amazing-team', 'memory', 'planner');
  console.assert(plannerMemory === expectedPlanner, `Should resolve planner memory: ${plannerMemory}`);
  
  const devMemory = resolver.resolveMemoryPath('developer');
  const expectedDev = path.join('/project', '.amazing-team', 'memory', 'developer');
  console.assert(devMemory === expectedDev, `Should resolve developer memory: ${devMemory}`);
  
  console.log('  ✓ resolveMemoryPath tests passed');
}

function testResolveTaskPath() {
  console.log('Testing resolveTaskPath...');
  
  const resolver = new PathResolver('/foundation', '/project');
  
  const taskPath = resolver.resolveTaskPath(123);
  const expected = path.join('/project', 'tasks', 'issue-123');
  console.assert(taskPath === expected, `Should resolve task path: ${taskPath}`);
  
  const taskPathStr = resolver.resolveTaskPath('456');
  const expectedStr = path.join('/project', 'tasks', 'issue-456');
  console.assert(taskPathStr === expectedStr, `Should resolve task path with string ID: ${taskPathStr}`);
  
  console.log('  ✓ resolveTaskPath tests passed');
}

function testResolveAgentsPath() {
  console.log('Testing resolveAgentsPath...');
  
  const resolver = new PathResolver('/foundation', '/project');
  
  const defaultPath = resolver.resolveAgentsPath(false);
  const expectedDefault = path.join('/foundation', 'AGENTS.md');
  console.assert(defaultPath === expectedDefault, `Should resolve foundation AGENTS.md: ${defaultPath}`);
  
  const userPath = resolver.resolveAgentsPath(true);
  const expectedUser = path.join('/project', 'AGENTS.md');
  console.assert(userPath === expectedUser, `Should resolve user AGENTS.md: ${userPath}`);
  
  console.log('  ✓ resolveAgentsPath tests passed');
}

function testGetMemoryDirectories() {
  console.log('Testing getMemoryDirectories...');
  
  const resolver = new PathResolver('/foundation', '/project');
  const dirs = resolver.getMemoryDirectories();
  
  const expectedRoles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci-analyst'];
  console.assert(dirs.length === expectedRoles.length, `Should have ${expectedRoles.length} directories`);
  
  expectedRoles.forEach(role => {
    const expected = path.join('/project', '.amazing-team', 'memory', role);
    console.assert(dirs.includes(expected), `Should include ${role} memory directory`);
  });
  
  console.log('  ✓ getMemoryDirectories tests passed');
}

function testGetRuntimeDirectories() {
  console.log('Testing getRuntimeDirectories...');
  
  const resolver = new PathResolver('/foundation', '/project');
  const dirs = resolver.getRuntimeDirectories();
  
  console.assert(dirs.length > 0, 'Should return directories');
  
  const hasMemoryDir = dirs.some(d => d.includes('memory'));
  console.assert(hasMemoryDir, 'Should include memory directories');
  
  const hasTasksDir = dirs.some(d => d.includes('tasks'));
  console.assert(hasTasksDir, 'Should include tasks directory');
  
  console.log('  ✓ getRuntimeDirectories tests passed');
}

function testResolveTemplateVars() {
  console.log('Testing resolveTemplateVars...');
  
  const resolver = new PathResolver('/foundation', '/project');
  
  const template = 'Hello {{name}}, your project is {{project}}';
  const result = resolver.resolveTemplateVars(template, {
    name: 'World',
    project: 'MyProject'
  });
  
  console.assert(result === 'Hello World, your project is MyProject', `Should substitute variables: ${result}`);
  
  const template2 = 'Path: {{path}}, Version: {{version}}';
  const result2 = resolver.resolveTemplateVars(template2, {
    path: '/some/path',
    version: '3.0.0'
  });
  
  console.assert(result2 === 'Path: /some/path, Version: 3.0.0', `Should substitute multiple variables: ${result2}`);
  
  console.log('  ✓ resolveTemplateVars tests passed');
}

function testNormalize() {
  console.log('Testing PathResolver.normalize...');
  
  const normalized = PathResolver.normalize('/some/path/to/file');
  console.assert(normalized.includes('/'), 'Should use forward slashes');
  console.assert(!normalized.includes('\\'), 'Should not have backslashes');
  
  const doubleSlash = PathResolver.normalize('/some//path');
  console.assert(!doubleSlash.includes('//'), 'Should not have double slashes');
  
  console.log('  ✓ normalize tests passed');
}

function testFoundationDirs() {
  console.log('Testing foundation directory methods...');
  
  const resolver = new PathResolver('/foundation', '/project');
  
  const skillsDir = resolver.getFoundationSkillsDir();
  console.assert(skillsDir.includes('.opencode') && skillsDir.includes('skills'), 'Should resolve skills dir');
  
  const commandsDir = resolver.getFoundationCommandsDir();
  console.assert(commandsDir.includes('.amazing-team') && commandsDir.includes('commands'), 'Should resolve commands dir');
  
  const agentsDir = resolver.getFoundationAgentsDir();
  console.assert(agentsDir.includes('.amazing-team') && agentsDir.includes('agents'), 'Should resolve agents dir');
  
  console.log('  ✓ foundation directory tests passed');
}

function runAll() {
  console.log('\n=== Path Resolver Module Tests ===\n');
  
  testConstructor();
  testResolveSkillPath();
  testResolveCommandPath();
  testResolveMemoryPath();
  testResolveTaskPath();
  testResolveAgentsPath();
  testGetMemoryDirectories();
  testGetRuntimeDirectories();
  testResolveTemplateVars();
  testNormalize();
  testFoundationDirs();
  
  console.log('\n✅ All path resolver tests passed!\n');
}

runAll();