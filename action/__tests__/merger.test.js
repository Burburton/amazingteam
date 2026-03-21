/**
 * Merger Module Tests
 * Tests for action/lib/merger.js
 */

const { mergeConfig, mergeWithPreset, validateMergedConfig, deepClone, isObject } = require('../lib/merger');

describe('Merger Module', () => {
  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(undefined)).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isObject(() => {})).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should clone primitives', () => {
      expect(deepClone(123)).toBe(123);
      expect(deepClone('string')).toBe('string');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, 3];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
    });

    it('should clone nested arrays', () => {
      const arr = [[1, 2], [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[0]).not.toBe(arr[0]);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: 2 };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should clone nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);
    });

    it('should clone mixed structures', () => {
      const obj = { a: [1, 2], b: { c: 3 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('modifying clone should not affect original', () => {
      const obj = { a: { b: 1 } };
      const cloned = deepClone(obj);
      cloned.a.b = 2;
      expect(obj.a.b).toBe(1);
    });
  });

  describe('mergeConfig', () => {
    it('should return foundation defaults when user config is empty', () => {
      const defaults = { version: '1.0' };
      const result = mergeConfig(defaults, {});
      expect(result).toEqual(defaults);
    });

    it('should return foundation defaults when user config is null', () => {
      const defaults = { version: '1.0' };
      const result = mergeConfig(defaults, null);
      expect(result).toEqual(defaults);
    });

    it('should return foundation defaults when user config is undefined', () => {
      const defaults = { version: '1.0' };
      const result = mergeConfig(defaults, undefined);
      expect(result).toEqual(defaults);
    });

    it('should merge simple properties', () => {
      const defaults = { version: '1.0', name: 'default' };
      const user = { name: 'user' };
      const result = mergeConfig(defaults, user);
      expect(result.version).toBe('1.0');
      expect(result.name).toBe('user');
    });

    it('should deep merge nested objects', () => {
      const defaults = { project: { name: 'default', language: 'ts' } };
      const user = { project: { name: 'user' } };
      const result = mergeConfig(defaults, user);
      expect(result.project.name).toBe('user');
      expect(result.project.language).toBe('ts');
    });

    it('should replace arrays, not merge them', () => {
      const defaults = { items: [1, 2] };
      const user = { items: [3, 4] };
      const result = mergeConfig(defaults, user);
      expect(result.items).toEqual([3, 4]);
    });

    it('should skip null values in user config', () => {
      const defaults = { version: '1.0' };
      const user = { version: null };
      const result = mergeConfig(defaults, user);
      expect(result.version).toBe('1.0');
    });

    it('should skip undefined values in user config', () => {
      const defaults = { version: '1.0' };
      const user = { version: undefined };
      const result = mergeConfig(defaults, user);
      expect(result.version).toBe('1.0');
    });

    it('should skip $preset key', () => {
      const defaults = { version: '1.0' };
      const user = { $preset: 'typescript', version: '2.0' };
      const result = mergeConfig(defaults, user);
      expect(result.$preset).toBeUndefined();
      expect(result.version).toBe('2.0');
    });

    it('should handle deeply nested objects', () => {
      const defaults = {
        a: {
          b: {
            c: { value: 1 },
            d: 2
          }
        }
      };
      const user = {
        a: {
          b: {
            c: { value: 3 }
          }
        }
      };
      const result = mergeConfig(defaults, user);
      expect(result.a.b.c.value).toBe(3);
      expect(result.a.b.d).toBe(2);
    });

    it('should handle empty objects', () => {
      const result = mergeConfig({}, {});
      expect(result).toEqual({});
    });

    it('should preserve types', () => {
      const defaults = { count: 0, enabled: false, name: '' };
      const user = { count: 5, enabled: true, name: 'test' };
      const result = mergeConfig(defaults, user);
      expect(typeof result.count).toBe('number');
      expect(typeof result.enabled).toBe('boolean');
      expect(typeof result.name).toBe('string');
    });

    it('should not mutate original defaults', () => {
      const defaults = { project: { name: 'default' } };
      const user = { project: { name: 'user' } };
      mergeConfig(defaults, user);
      expect(defaults.project.name).toBe('default');
    });

    it('should not mutate original user config', () => {
      const defaults = { project: { name: 'default', language: 'ts' } };
      const user = { project: { name: 'user' } };
      mergeConfig(defaults, user);
      expect(user.project).toEqual({ name: 'user' });
    });
  });

  describe('mergeWithPreset', () => {
    it('should merge preset with defaults and user config', () => {
      const defaults = { version: '1.0', language: 'ts' };
      const preset = { framework: 'node' };
      const user = { name: 'project' };
      const result = mergeWithPreset(preset, defaults, user);
      expect(result.version).toBe('1.0');
      expect(result.language).toBe('ts');
      expect(result.framework).toBe('node');
      expect(result.name).toBe('project');
    });

    it('should handle null preset', () => {
      const defaults = { version: '1.0' };
      const user = { name: 'project' };
      const result = mergeWithPreset(null, defaults, user);
      expect(result.version).toBe('1.0');
      expect(result.name).toBe('project');
    });

    it('should handle empty preset', () => {
      const defaults = { version: '1.0' };
      const user = { name: 'project' };
      const result = mergeWithPreset({}, defaults, user);
      expect(result.version).toBe('1.0');
      expect(result.name).toBe('project');
    });

    it('should handle null user config', () => {
      const defaults = { version: '1.0' };
      const preset = { framework: 'node' };
      const result = mergeWithPreset(preset, defaults, null);
      expect(result.version).toBe('1.0');
      expect(result.framework).toBe('node');
    });

    it('should give user config highest priority', () => {
      const defaults = { version: '1.0', framework: 'react' };
      const preset = { version: '2.0' };
      const user = { version: '3.0', framework: 'vue' };
      const result = mergeWithPreset(preset, defaults, user);
      expect(result.version).toBe('3.0');
      expect(result.framework).toBe('vue');
    });

    it('should give preset priority over defaults', () => {
      const defaults = { version: '1.0', framework: 'react' };
      const preset = { version: '2.0' };
      const user = {};
      const result = mergeWithPreset(preset, defaults, user);
      expect(result.version).toBe('2.0');
      expect(result.framework).toBe('react');
    });
  });

  describe('validateMergedConfig', () => {
    it('should validate missing version', () => {
      const config = { project: { name: 'test', language: 'ts' } };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: version');
    });

    it('should validate missing project', () => {
      const config = { version: '1.0' };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: project');
    });

    it('should validate missing project.name', () => {
      const config = { version: '1.0', project: { language: 'ts' } };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: project.name');
    });

    it('should validate missing project.language', () => {
      const config = { version: '1.0', project: { name: 'test' } };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: project.language');
    });

    it('should validate valid config', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate unknown agents', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        agents: { unknown_agent: {} }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Unknown agent: unknown_agent');
    });

    it('should accept valid agents', () => {
      const validAgents = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci_analyst'];
      for (const agent of validAgents) {
        const config = {
          version: '1.0',
          project: { name: 'test', language: 'ts' },
          agents: { [agent]: {} }
        };
        const result = validateMergedConfig(config);
        expect(result.errors).not.toContain(`Unknown agent: ${agent}`);
      }
    });

    it('should validate workflow sequence must be array', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        workflows: {
          feature: { sequence: 'not-an-array' }
        }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Workflow 'feature' must have a sequence array");
    });

    it('should validate workflow roles', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        workflows: {
          feature: { sequence: ['unknown_role'] }
        }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Unknown role 'unknown_role' in workflow 'feature'");
    });

    it('should accept valid workflow roles', () => {
      const validRoles = ['planner', 'architect', 'developer', 'qa', 'reviewer', 'triage', 'ci_analyst'];
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        workflows: {
          feature: { sequence: validRoles }
        }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should validate test_coverage_threshold range', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        rules: { test_coverage_threshold: 150 }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('test_coverage_threshold must be a number between 0 and 100');
    });

    it('should validate test_coverage_threshold is number', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        rules: { test_coverage_threshold: 'not-a-number' }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('test_coverage_threshold must be a number between 0 and 100');
    });

    it('should accept valid test_coverage_threshold', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        rules: { test_coverage_threshold: 80 }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should validate max_function_lines is positive', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        rules: { max_function_lines: -1 }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('max_function_lines must be a positive number');
    });

    it('should validate max_function_lines is number', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        rules: { max_function_lines: 'not-a-number' }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('max_function_lines must be a positive number');
    });

    it('should accept valid max_function_lines', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        rules: { max_function_lines: 30 }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should accumulate multiple errors', () => {
      const config = {};
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Missing required field: version');
      expect(result.errors).toContain('Missing required field: project');
    });

    it('should return empty errors for valid config', () => {
      const config = {
        version: '1.0',
        project: { name: 'test', language: 'ts' },
        agents: { planner: {}, developer: {} },
        workflows: {
          feature: { sequence: ['planner', 'developer'] }
        },
        rules: {
          test_coverage_threshold: 80,
          max_function_lines: 30
        }
      };
      const result = validateMergedConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
