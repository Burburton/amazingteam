/**
 * Path Resolver Module
 * Resolves paths for skills, commands, memory, and tasks
 * Handles cross-platform path resolution
 */

const path = require('path');

/**
 * Path Resolver Class
 * Handles all path resolution for AmazingTeam Foundation
 */
class PathResolver {
  /**
   * @param {string} foundationDir - Path to downloaded foundation
   * @param {string} projectDir - Path to user project
   */
  constructor(foundationDir, projectDir) {
    this.foundationDir = foundationDir;
    this.projectDir = projectDir;
  }

  /**
   * Resolve a skill path (skills are in foundation)
   * @param {string} relativePath - Relative path from foundation
   * @returns {string} Absolute path to skill
   */
  resolveSkillPath(relativePath) {
    return path.join(this.foundationDir, relativePath);
  }

  /**
   * Resolve a command path (commands are in foundation)
   * @param {string} relativePath - Relative path from foundation
   * @returns {string} Absolute path to command
   */
  resolveCommandPath(relativePath) {
    return path.join(this.foundationDir, relativePath);
  }

  /**
   * Resolve memory path (memory is in user project - runtime state)
   * @param {string} role - Agent role name
   * @returns {string} Absolute path to role memory directory
   */
  resolveMemoryPath(role) {
    return path.join(this.projectDir, '.amazing-team', 'memory', role);
  }

  /**
   * Resolve failures library path
   * @returns {string} Absolute path to failures directory
   */
  resolveFailuresPath() {
    return path.join(this.projectDir, '.amazing-team', 'memory', 'failures');
  }

  /**
   * Resolve task path
   * @param {string|number} taskId - Issue ID
   * @returns {string} Absolute path to task directory
   */
  resolveTaskPath(taskId) {
    return path.join(this.projectDir, 'tasks', `issue-${taskId}`);
  }

  /**
   * Resolve task template path
   * @returns {string} Absolute path to task template directory
   */
  resolveTaskTemplatePath() {
    return path.join(this.projectDir, 'tasks', '_template');
  }

  /**
   * Resolve AGENTS.md path (from foundation, but user can override)
   * @param {boolean} userOverride - Whether user has local AGENTS.md
   * @returns {string} Path to AGENTS.md
   */
  resolveAgentsPath(userOverride = false) {
    if (userOverride) {
      return path.join(this.projectDir, 'AGENTS.md');
    }
    return path.join(this.foundationDir, 'AGENTS.md');
  }

  /**
   * Resolve OpenCode config path (in user project)
   * @returns {string} Absolute path to opencode.jsonc
   */
  resolveOpenCodeConfigPath() {
    return path.join(this.projectDir, 'opencode.jsonc');
  }

  /**
   * Resolve user config path
   * @param {string} configPath - Config file name (default: amazingteam.config.yaml)
   * @returns {string} Absolute path to user config
   */
  resolveUserConfigPath(configPath = 'amazingteam.config.yaml') {
    return path.join(this.projectDir, configPath);
  }

  /**
   * Get all memory directories that need to be created
   * @returns {string[]} Array of memory directory paths
   */
  getMemoryDirectories() {
    const roles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci-analyst'];
    return roles.map(role => this.resolveMemoryPath(role));
  }

  /**
   * Get all runtime directories that need to exist
   * @returns {string[]} Array of directory paths
   */
  getRuntimeDirectories() {
    return [
      ...this.getMemoryDirectories(),
      this.resolveFailuresPath(),
      this.resolveTaskTemplatePath(),
      path.join(this.projectDir, '.amazing-team'),
      path.join(this.projectDir, 'tasks')
    ];
  }

  /**
   * Get foundation skills directory
   * @returns {string} Path to foundation .opencode/skills
   */
  getFoundationSkillsDir() {
    return path.join(this.foundationDir, '.opencode', 'skills');
  }

  /**
   * Get foundation commands directory
   * @returns {string} Path to foundation .amazing-team/commands
   */
  getFoundationCommandsDir() {
    return path.join(this.foundationDir, '.amazing-team', 'commands');
  }

  /**
   * Get foundation agents directory
   * @returns {string} Path to foundation .amazing-team/agents
   */
  getFoundationAgentsDir() {
    return path.join(this.foundationDir, '.amazing-team', 'agents');
  }

  /**
   * Resolve template variables in a string
   * @param {string} str - String with template variables
   * @param {Object} vars - Variables to substitute
   * @returns {string} Resolved string
   */
  resolveTemplateVars(str, vars) {
    let result = str;
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  /**
   * Normalize path for cross-platform compatibility
   * @param {string} p - Path to normalize
   * @returns {string} Normalized path
   */
  static normalize(p) {
    return path.normalize(p).replace(/\\/g, '/');
  }
}

module.exports = PathResolver;