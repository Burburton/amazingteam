/**
 * Setup Module Tests
 * Jest-compatible tests for action/lib/setup.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  initializeRuntimeDirectories,
  generateOpenCodeConfig,
  copyTaskTemplates,
  copyAgentsMd,
  copyOpenCodeDir
} = require('../lib/setup');

describe('Setup Module', () => {
  const tempDir = path.join(os.tmpdir(), 'amazingteam-setup-test-' + Date.now());

  beforeEach(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('initializeRuntimeDirectories', () => {
    it('should create all required directories', () => {
      const created = initializeRuntimeDirectories(tempDir);

      expect(created).toContain('.amazing-team');
      expect(created).toContain('.amazing-team/memory');
      expect(created).toContain('tasks');
      expect(created).toContain('tasks/_template');

      expect(fs.existsSync(path.join(tempDir, '.amazing-team'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.amazing-team', 'memory'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, 'tasks'))).toBe(true);
    });

    it('should create all role memory directories', () => {
      initializeRuntimeDirectories(tempDir);

      const roles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci-analyst'];
      roles.forEach(role => {
        expect(fs.existsSync(path.join(tempDir, '.amazing-team', 'memory', role))).toBe(true);
      });
    });

    it('should create failures directory', () => {
      initializeRuntimeDirectories(tempDir);
      expect(fs.existsSync(path.join(tempDir, '.amazing-team', 'memory', 'failures'))).toBe(true);
    });

    it('should create memory placeholder files', () => {
      initializeRuntimeDirectories(tempDir);

      expect(fs.existsSync(path.join(tempDir, '.amazing-team', 'memory', 'planner', 'decomposition_notes.md'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.amazing-team', 'memory', 'developer', 'implementation_notes.md'))).toBe(true);
      expect(fs.existsSync(path.join(tempDir, '.amazing-team', 'memory', 'failures', 'failure_library.md'))).toBe(true);
    });

    it('should not duplicate existing directories', () => {
      fs.mkdirSync(path.join(tempDir, '.amazing-team'), { recursive: true });
      
      const created = initializeRuntimeDirectories(tempDir);
      
      expect(created).not.toContain('.amazing-team');
    });
  });

  describe('generateOpenCodeConfig', () => {
    it('should generate opencode.jsonc with template variables', () => {
      const foundationDir = tempDir;
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(projectDir, { recursive: true });
      
      // Create a template file with variable
      fs.mkdirSync(path.join(foundationDir, 'templates'), { recursive: true });
      fs.writeFileSync(
        path.join(foundationDir, 'templates', 'opencode.jsonc'),
        '{ "project": "{{PROJECT_NAME}}" }'
      );
      
      const config = {
        ai_team: { version: '3.0.0' },
        project: {
          name: 'test-project',
          description: 'Test description',
          language: 'typescript',
          framework: 'node'
        }
      };

      const outputPath = generateOpenCodeConfig(foundationDir, projectDir, config);
      
      expect(fs.existsSync(outputPath)).toBe(true);
      
      const content = fs.readFileSync(outputPath, 'utf-8');
      expect(content).toContain('test-project');
    });

    it('should use default template when template file does not exist', () => {
      const foundationDir = path.join(tempDir, 'empty-foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(foundationDir, { recursive: true });
      fs.mkdirSync(projectDir, { recursive: true });
      
      const config = {
        project: { name: 'test' }
      };

      const outputPath = generateOpenCodeConfig(foundationDir, projectDir, config);
      
      expect(fs.existsSync(outputPath)).toBe(true);
      
      const content = fs.readFileSync(outputPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toHaveProperty('$schema');
    });
  });

  describe('copyTaskTemplates', () => {
    it('should copy task templates from foundation to project', () => {
      const foundationDir = path.join(tempDir, 'foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(path.join(foundationDir, 'tasks', '_template'), { recursive: true });
      fs.mkdirSync(path.join(projectDir, 'tasks', '_template'), { recursive: true });
      
      fs.writeFileSync(path.join(foundationDir, 'tasks', '_template', 'task.yaml'), 'id: template');
      fs.writeFileSync(path.join(foundationDir, 'tasks', '_template', 'analysis.md'), '# Analysis');

      const copied = copyTaskTemplates(foundationDir, projectDir);
      
      expect(copied).toContain('task.yaml');
      expect(copied).toContain('analysis.md');
      
      expect(fs.existsSync(path.join(projectDir, 'tasks', '_template', 'task.yaml'))).toBe(true);
      expect(fs.existsSync(path.join(projectDir, 'tasks', '_template', 'analysis.md'))).toBe(true);
    });

    it('should return empty array when template directory does not exist', () => {
      const foundationDir = path.join(tempDir, 'empty-foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(foundationDir, { recursive: true });
      fs.mkdirSync(projectDir, { recursive: true });

      const copied = copyTaskTemplates(foundationDir, projectDir);
      
      expect(copied).toEqual([]);
    });
  });

  describe('copyAgentsMd', () => {
    it('should copy AGENTS.md from foundation to project', () => {
      const foundationDir = path.join(tempDir, 'foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(foundationDir, { recursive: true });
      fs.mkdirSync(projectDir, { recursive: true });
      
      fs.writeFileSync(path.join(foundationDir, 'AGENTS.md'), '# AGENTS');

      const copied = copyAgentsMd(foundationDir, projectDir);
      
      expect(copied).toBe(true);
      expect(fs.existsSync(path.join(projectDir, 'AGENTS.md'))).toBe(true);
    });

    it('should not overwrite existing AGENTS.md', () => {
      const foundationDir = path.join(tempDir, 'foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(foundationDir, { recursive: true });
      fs.mkdirSync(projectDir, { recursive: true });
      
      fs.writeFileSync(path.join(foundationDir, 'AGENTS.md'), '# Foundation AGENTS');
      fs.writeFileSync(path.join(projectDir, 'AGENTS.md'), '# User AGENTS');

      const copied = copyAgentsMd(foundationDir, projectDir);
      
      expect(copied).toBe(false);
      
      const content = fs.readFileSync(path.join(projectDir, 'AGENTS.md'), 'utf-8');
      expect(content).toBe('# User AGENTS');
    });

    it('should return false when AGENTS.md does not exist in foundation', () => {
      const foundationDir = path.join(tempDir, 'empty-foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(foundationDir, { recursive: true });
      fs.mkdirSync(projectDir, { recursive: true });

      const copied = copyAgentsMd(foundationDir, projectDir);
      
      expect(copied).toBe(false);
    });
  });

  describe('copyOpenCodeDir', () => {
    it('should copy .opencode directory from foundation to project', () => {
      const foundationDir = path.join(tempDir, 'foundation');
      const projectDir = path.join(tempDir, 'project');
      
      // Create foundation .opencode structure with skills subdirectory
      fs.mkdirSync(path.join(foundationDir, '.opencode', 'skills'), { recursive: true });
      fs.mkdirSync(path.join(projectDir, '.opencode'), { recursive: true });
      
      fs.writeFileSync(path.join(foundationDir, '.opencode', 'skills', 'test.md'), '# Skill');

      const copied = copyOpenCodeDir(foundationDir, projectDir);
      
      expect(copied.length).toBeGreaterThan(0);
      expect(fs.existsSync(path.join(projectDir, '.opencode', 'skills', 'test.md'))).toBe(true);
    });

    it('should return empty array when .opencode does not exist in foundation', () => {
      const foundationDir = path.join(tempDir, 'empty-foundation');
      const projectDir = path.join(tempDir, 'project');
      
      fs.mkdirSync(foundationDir, { recursive: true });
      fs.mkdirSync(projectDir, { recursive: true });

      const copied = copyOpenCodeDir(foundationDir, projectDir);
      
      expect(copied).toEqual([]);
    });
  });
});
