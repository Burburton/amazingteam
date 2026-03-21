/**
 * Path Resolver Module Tests
 * Jest-compatible tests for action/lib/path-resolver.js
 */

const path = require('path');
const PathResolver = require('../lib/path-resolver');

describe('PathResolver', () => {
  const foundationDir = '/foundation';
  const projectDir = '/project';
  let resolver;

  beforeEach(() => {
    resolver = new PathResolver(foundationDir, projectDir);
  });

  describe('constructor', () => {
    it('should store foundation directory', () => {
      expect(resolver.foundationDir).toBe(foundationDir);
    });

    it('should store project directory', () => {
      expect(resolver.projectDir).toBe(projectDir);
    });

    it('should handle empty paths', () => {
      const emptyResolver = new PathResolver('', '');
      expect(emptyResolver.foundationDir).toBe('');
      expect(emptyResolver.projectDir).toBe('');
    });
  });

  describe('resolveSkillPath', () => {
    it('should resolve skill path from foundation directory', () => {
      const skillPath = resolver.resolveSkillPath('.opencode/skills/test-first-feature-dev/SKILL.md');
      expect(skillPath).toBe(path.join(foundationDir, '.opencode/skills/test-first-feature-dev/SKILL.md'));
    });

    it('should handle nested skill paths', () => {
      const skillPath = resolver.resolveSkillPath('.opencode/skills/deep/nested/skill.md');
      const normalizedPath = PathResolver.normalize(skillPath);
      expect(normalizedPath).toContain('.opencode/skills/deep/nested/skill.md');
    });

    it('should handle paths with different separators', () => {
      const skillPath = resolver.resolveSkillPath('.opencode\\skills\\test.md');
      expect(skillPath).toBeDefined();
      expect(typeof skillPath).toBe('string');
    });
  });

  describe('resolveCommandPath', () => {
    it('should resolve command path from foundation directory', () => {
      const cmdPath = resolver.resolveCommandPath('.amazing-team/commands/auto.md');
      expect(cmdPath).toBe(path.join(foundationDir, '.amazing-team/commands/auto.md'));
    });

    it('should resolve different command paths', () => {
      const commands = ['auto.md', 'triage.md', 'design.md'];
      commands.forEach(cmd => {
        const cmdPath = resolver.resolveCommandPath(`.amazing-team/commands/${cmd}`);
        expect(cmdPath).toContain(cmd);
      });
    });
  });

  describe('resolveMemoryPath', () => {
    it('should resolve planner memory path', () => {
      const plannerPath = resolver.resolveMemoryPath('planner');
      expect(plannerPath).toBe(path.join(projectDir, '.amazing-team', 'memory', 'planner'));
    });

    it('should resolve all role memory paths', () => {
      const roles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci-analyst'];
      roles.forEach(role => {
        const rolePath = resolver.resolveMemoryPath(role);
        expect(rolePath).toContain('.amazing-team');
        expect(rolePath).toContain('memory');
        expect(rolePath).toContain(role);
      });
    });
  });

  describe('resolveFailuresPath', () => {
    it('should resolve failures library path', () => {
      const failuresPath = resolver.resolveFailuresPath();
      expect(failuresPath).toBe(path.join(projectDir, '.amazing-team', 'memory', 'failures'));
    });
  });

  describe('resolveTaskPath', () => {
    it('should resolve task path with numeric ID', () => {
      const taskPath = resolver.resolveTaskPath(123);
      expect(taskPath).toBe(path.join(projectDir, 'tasks', 'issue-123'));
    });

    it('should resolve task path with string ID', () => {
      const taskPath = resolver.resolveTaskPath('456');
      expect(taskPath).toBe(path.join(projectDir, 'tasks', 'issue-456'));
    });

    it('should handle large issue numbers', () => {
      const taskPath = resolver.resolveTaskPath(999999);
      expect(taskPath).toContain('issue-999999');
    });
  });

  describe('resolveTaskTemplatePath', () => {
    it('should resolve task template path', () => {
      const templatePath = resolver.resolveTaskTemplatePath();
      expect(templatePath).toBe(path.join(projectDir, 'tasks', '_template'));
    });
  });

  describe('resolveAgentsPath', () => {
    it('should resolve foundation AGENTS.md by default', () => {
      const agentsPath = resolver.resolveAgentsPath();
      expect(agentsPath).toBe(path.join(foundationDir, 'AGENTS.md'));
    });

    it('should resolve project AGENTS.md when user override is true', () => {
      const agentsPath = resolver.resolveAgentsPath(true);
      expect(agentsPath).toBe(path.join(projectDir, 'AGENTS.md'));
    });

    it('should resolve foundation AGENTS.md when user override is false', () => {
      const agentsPath = resolver.resolveAgentsPath(false);
      expect(agentsPath).toBe(path.join(foundationDir, 'AGENTS.md'));
    });
  });

  describe('resolveOpenCodeConfigPath', () => {
    it('should resolve OpenCode config path', () => {
      const configPath = resolver.resolveOpenCodeConfigPath();
      expect(configPath).toBe(path.join(projectDir, 'opencode.jsonc'));
    });
  });

  describe('resolveUserConfigPath', () => {
    it('should resolve default user config path', () => {
      const configPath = resolver.resolveUserConfigPath();
      expect(configPath).toBe(path.join(projectDir, 'amazingteam.config.yaml'));
    });

    it('should resolve custom user config path', () => {
      const configPath = resolver.resolveUserConfigPath('custom-config.yaml');
      expect(configPath).toBe(path.join(projectDir, 'custom-config.yaml'));
    });
  });

  describe('getMemoryDirectories', () => {
    it('should return all role memory directories', () => {
      const dirs = resolver.getMemoryDirectories();
      const expectedRoles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci-analyst'];
      
      expect(dirs).toHaveLength(expectedRoles.length);
      expectedRoles.forEach(role => {
        const rolePath = dirs.find(d => d.includes(role));
        expect(rolePath).toBeDefined();
        expect(rolePath).toContain('.amazing-team');
        expect(rolePath).toContain('memory');
      });
    });

    it('should return absolute paths', () => {
      const dirs = resolver.getMemoryDirectories();
      dirs.forEach(dir => {
        expect(path.isAbsolute(dir) || dir.startsWith('/')).toBe(true);
      });
    });
  });

  describe('getRuntimeDirectories', () => {
    it('should return all runtime directories', () => {
      const dirs = resolver.getRuntimeDirectories();
      
      // Should include memory directories
      expect(dirs.some(d => d.includes('memory') && d.includes('planner'))).toBe(true);
      expect(dirs.some(d => d.includes('memory') && d.includes('failures'))).toBe(true);
      
      // Should include tasks directories
      expect(dirs.some(d => d.includes('tasks') && d.includes('_template'))).toBe(true);
      expect(dirs.some(d => d.includes('tasks') && !d.includes('_template'))).toBe(true);
      
      // Should include .amazing-team
      expect(dirs.some(d => d.includes('.amazing-team'))).toBe(true);
    });

    it('should include all memory directories', () => {
      const memoryDirs = resolver.getMemoryDirectories();
      const runtimeDirs = resolver.getRuntimeDirectories();
      
      memoryDirs.forEach(memDir => {
        expect(runtimeDirs).toContain(memDir);
      });
    });
  });

  describe('getFoundationSkillsDir', () => {
    it('should return foundation skills directory', () => {
      const skillsDir = resolver.getFoundationSkillsDir();
      expect(skillsDir).toBe(path.join(foundationDir, '.opencode', 'skills'));
    });
  });

  describe('getFoundationCommandsDir', () => {
    it('should return foundation commands directory', () => {
      const commandsDir = resolver.getFoundationCommandsDir();
      expect(commandsDir).toBe(path.join(foundationDir, '.amazing-team', 'commands'));
    });
  });

  describe('getFoundationAgentsDir', () => {
    it('should return foundation agents directory', () => {
      const agentsDir = resolver.getFoundationAgentsDir();
      expect(agentsDir).toBe(path.join(foundationDir, '.amazing-team', 'agents'));
    });
  });

  describe('resolveTemplateVars', () => {
    it('should replace single template variable', () => {
      const str = 'Hello {{name}}';
      const result = resolver.resolveTemplateVars(str, { name: 'World' });
      expect(result).toBe('Hello World');
    });

    it('should replace multiple template variables', () => {
      const str = '{{greeting}} {{name}}! Version: {{version}}';
      const result = resolver.resolveTemplateVars(str, {
        greeting: 'Hello',
        name: 'User',
        version: '1.0.0'
      });
      expect(result).toBe('Hello User! Version: 1.0.0');
    });

    it('should handle repeated template variables', () => {
      const str = '{{name}} and {{name}}';
      const result = resolver.resolveTemplateVars(str, { name: 'test' });
      expect(result).toBe('test and test');
    });

    it('should leave unknown variables unchanged', () => {
      const str = '{{known}} and {{unknown}}';
      const result = resolver.resolveTemplateVars(str, { known: 'value' });
      expect(result).toBe('value and {{unknown}}');
    });

    it('should handle empty string', () => {
      const result = resolver.resolveTemplateVars('', { name: 'test' });
      expect(result).toBe('');
    });

    it('should handle string without variables', () => {
      const str = 'No variables here';
      const result = resolver.resolveTemplateVars(str, { name: 'test' });
      expect(result).toBe('No variables here');
    });

    it('should handle empty vars object', () => {
      const str = '{{name}}';
      const result = resolver.resolveTemplateVars(str, {});
      expect(result).toBe('{{name}}');
    });
  });

  describe('static normalize', () => {
    it('should normalize paths with backslashes', () => {
      const normalized = PathResolver.normalize('path\\to\\file');
      expect(normalized).toBe('path/to/file');
    });

    it('should handle already normalized paths', () => {
      const normalized = PathResolver.normalize('path/to/file');
      expect(normalized).toBe('path/to/file');
    });

    it('should handle mixed separators', () => {
      const normalized = PathResolver.normalize('path/to\\file');
      expect(normalized).toBe('path/to/file');
    });

    it('should handle absolute Windows paths', () => {
      const normalized = PathResolver.normalize('C:\\Users\\test');
      expect(normalized).toContain('/');
    });
  });

  describe('Integration', () => {
    it('should work with real-world paths', () => {
      const realResolver = new PathResolver(
        '/home/user/.amazing-team-cache/v3.0.0',
        '/home/user/my-project'
      );

      const skillPath = realResolver.resolveSkillPath('.opencode/skills/test.md');
      expect(skillPath).toContain('.amazing-team-cache');
      expect(skillPath).toContain('.opencode');
      expect(skillPath).toContain('skills');

      const memoryPath = realResolver.resolveMemoryPath('planner');
      expect(memoryPath).toContain('my-project');
      expect(memoryPath).toContain('.amazing-team');
      expect(memoryPath).toContain('memory');
      expect(memoryPath).toContain('planner');
    });
  });
});
