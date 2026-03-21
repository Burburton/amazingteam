/**
 * Validator Module Tests
 * Jest-compatible tests for action/lib/validator.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  validateAgainstSchema,
  validateConfig,
  validateRequiredFiles,
  validateProjectStructure,
  loadSchema
} = require('../lib/validator');

describe('Validator Module', () => {
  const tempDir = path.join(os.tmpdir(), 'amazingteam-validator-test-' + Date.now());

  beforeAll(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('validateAgainstSchema', () => {
    describe('type validation', () => {
      it('should validate string type', () => {
        const schema = { type: 'string' };
        const valid = validateAgainstSchema('hello', schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema(123, schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('expected type string');
      });

      it('should validate number type', () => {
        const schema = { type: 'number' };
        const valid = validateAgainstSchema(42, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('not a number', schema);
        expect(invalid.valid).toBe(false);
      });

      it('should validate integer type', () => {
        const schema = { type: 'integer' };
        const valid = validateAgainstSchema(42, schema);
        expect(valid.valid).toBe(true);

        const floatInvalid = validateAgainstSchema(42.5, schema);
        expect(floatInvalid.valid).toBe(false);

        const stringInvalid = validateAgainstSchema('42', schema);
        expect(stringInvalid.valid).toBe(false);
      });

      it('should validate boolean type', () => {
        const schema = { type: 'boolean' };
        const valid = validateAgainstSchema(true, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('true', schema);
        expect(invalid.valid).toBe(false);
      });

      it('should validate array type', () => {
        const schema = { type: 'array' };
        const valid = validateAgainstSchema([1, 2, 3], schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('not an array', schema);
        expect(invalid.valid).toBe(false);
      });

      it('should handle nullable types', () => {
        const schema = { type: 'string', nullable: true };
        const valid = validateAgainstSchema(null, schema);
        expect(valid.valid).toBe(true);
      });
    });

    describe('enum validation', () => {
      it('should validate enum values', () => {
        const schema = { enum: ['admin', 'user', 'guest'] };
        const valid = validateAgainstSchema('admin', schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('superuser', schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('must be one of');
      });

      it('should reject values not in enum', () => {
        const schema = { enum: ['active', 'inactive'] };
        const invalid = validateAgainstSchema('pending', schema);
        expect(invalid.valid).toBe(false);
      });
    });

    describe('string validation', () => {
      it('should validate minLength', () => {
        const schema = { type: 'string', minLength: 3 };
        const valid = validateAgainstSchema('test', schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('ab', schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('minLength');
      });

      it('should validate maxLength', () => {
        const schema = { type: 'string', maxLength: 5 };
        const valid = validateAgainstSchema('test', schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('toolong', schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('maxLength');
      });

      it('should validate pattern', () => {
        const schema = { type: 'string', pattern: '^[a-z]+$' };
        const valid = validateAgainstSchema('lowercase', schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('MixedCase123', schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('pattern');
      });

      it('should validate email pattern', () => {
        const schema = { type: 'string', pattern: '^[a-z]+@[a-z]+\\.[a-z]+$' };
        const valid = validateAgainstSchema('test@example.com', schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema('invalid-email', schema);
        expect(invalid.valid).toBe(false);
      });
    });

    describe('number validation', () => {
      it('should validate minimum', () => {
        const schema = { type: 'number', minimum: 0 };
        const valid = validateAgainstSchema(5, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema(-1, schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('minimum');
      });

      it('should validate maximum', () => {
        const schema = { type: 'number', maximum: 100 };
        const valid = validateAgainstSchema(50, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema(101, schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('maximum');
      });
    });

    describe('array validation', () => {
      it('should validate array items', () => {
        const schema = {
          type: 'array',
          items: { type: 'string' }
        };
        const valid = validateAgainstSchema(['a', 'b', 'c'], schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema(['a', 1, 'c'], schema);
        expect(invalid.valid).toBe(false);
      });

      it('should validate minItems', () => {
        const schema = { type: 'array', items: { type: 'string' }, minItems: 2 };
        const valid = validateAgainstSchema(['a', 'b', 'c'], schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema(['a'], schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('minItems');
      });

      it('should validate maxItems', () => {
        const schema = { type: 'array', items: { type: 'string' }, maxItems: 3 };
        const valid = validateAgainstSchema(['a', 'b'], schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema(['a', 'b', 'c', 'd'], schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('maxItems');
      });
    });

    describe('object validation', () => {
      it('should validate required properties', () => {
        const schema = {
          type: 'object',
          required: ['name', 'email']
        };
        const valid = validateAgainstSchema({ name: 'test', email: 'test@test.com' }, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema({ name: 'test' }, schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('missing required property');
      });

      it('should validate properties', () => {
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' }
          }
        };
        const valid = validateAgainstSchema({ name: 'test', age: 25 }, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema({ name: 'test', age: 'twenty' }, schema);
        expect(invalid.valid).toBe(false);
      });

      it('should validate nested objects', () => {
        const schema = {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            }
          }
        };
        const valid = validateAgainstSchema({ user: { name: 'test' } }, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema({ user: { name: 123 } }, schema);
        expect(invalid.valid).toBe(false);
      });

      it('should reject additional properties when disabled', () => {
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          additionalProperties: false
        };
        const valid = validateAgainstSchema({ name: 'test' }, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema({ name: 'test', extra: 'value' }, schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors[0]).toContain('unknown property');
      });

      it('should allow properties starting with $ even with additionalProperties: false', () => {
        const schema = {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          additionalProperties: false
        };
        const valid = validateAgainstSchema({ name: 'test', $special: 'value' }, schema);
        expect(valid.valid).toBe(true);
      });
    });

    describe('complex schemas', () => {
      it('should validate complex object with multiple constraints', () => {
        const schema = {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
            age: { type: 'integer', minimum: 0, maximum: 150 },
            roles: {
              type: 'array',
              items: { enum: ['admin', 'user', 'guest'] },
              minItems: 1
            }
          }
        };

        const valid = validateAgainstSchema({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          roles: ['user', 'admin']
        }, schema);
        expect(valid.valid).toBe(true);

        const invalid = validateAgainstSchema({
          name: 'A',
          email: 'invalid-email',
          age: -5,
          roles: []
        }, schema);
        expect(invalid.valid).toBe(false);
        expect(invalid.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateConfig', () => {
    it('should validate config against schema', () => {
      const schema = {
        type: 'object',
        required: ['version'],
        properties: {
          version: { type: 'string' }
        }
      };
      const config = { version: '1.0.0' };
      const result = validateConfig(config, schema);
      expect(result.valid).toBe(true);
    });

    it('should return errors for invalid config', () => {
      const schema = {
        type: 'object',
        required: ['version'],
        properties: {
          version: { type: 'string' }
        }
      };
      const config = {};
      const result = validateConfig(config, schema);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateRequiredFiles', () => {
    it('should pass when all files exist', () => {
      fs.writeFileSync(path.join(tempDir, 'file1.txt'), 'content');
      fs.writeFileSync(path.join(tempDir, 'file2.txt'), 'content');

      const result = validateRequiredFiles(tempDir, ['file1.txt', 'file2.txt']);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should report missing files', () => {
      const result = validateRequiredFiles(tempDir, ['nonexistent1.txt', 'nonexistent2.txt']);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('nonexistent1.txt');
      expect(result.missing).toContain('nonexistent2.txt');
    });

    it('should handle mixed existing and missing files', () => {
      fs.writeFileSync(path.join(tempDir, 'exists.txt'), 'content');

      const result = validateRequiredFiles(tempDir, ['exists.txt', 'missing.txt']);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('missing.txt');
      expect(result.missing).not.toContain('exists.txt');
    });

    it('should handle empty file list', () => {
      const result = validateRequiredFiles(tempDir, []);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateProjectStructure', () => {
    const projectTempDir = path.join(os.tmpdir(), 'amazingteam-project-test-' + Date.now());

    beforeEach(() => {
      if (!fs.existsSync(projectTempDir)) {
        fs.mkdirSync(projectTempDir, { recursive: true });
      }
    });

    afterEach(() => {
      if (fs.existsSync(projectTempDir)) {
        fs.rmSync(projectTempDir, { recursive: true, force: true });
        fs.mkdirSync(projectTempDir, { recursive: true });
      }
    });

    afterAll(() => {
      if (fs.existsSync(projectTempDir)) {
        fs.rmSync(projectTempDir, { recursive: true, force: true });
      }
    });

    it('should validate complete project structure', () => {
      fs.mkdirSync(path.join(projectTempDir, '.amazing-team'), { recursive: true });
      fs.mkdirSync(path.join(projectTempDir, '.amazing-team', 'memory'), { recursive: true });
      fs.mkdirSync(path.join(projectTempDir, 'tasks'), { recursive: true });
      fs.writeFileSync(path.join(projectTempDir, 'amazingteam.config.yaml'), 'version: "1.0"');
      fs.writeFileSync(path.join(projectTempDir, 'opencode.jsonc'), '{}');

      const result = validateProjectStructure(projectTempDir);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should report missing directories', () => {
      const result = validateProjectStructure(projectTempDir);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.includes('.amazing-team'))).toBe(true);
      expect(result.issues.some(i => i.includes('tasks'))).toBe(true);
    });

    it('should report missing config file', () => {
      fs.mkdirSync(path.join(projectTempDir, '.amazing-team'), { recursive: true });
      fs.mkdirSync(path.join(projectTempDir, '.amazing-team', 'memory'), { recursive: true });
      fs.mkdirSync(path.join(projectTempDir, 'tasks'), { recursive: true });

      const result = validateProjectStructure(projectTempDir);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.includes('amazingteam.config.yaml'))).toBe(true);
    });

    it('should report missing opencode.jsonc', () => {
      fs.mkdirSync(path.join(projectTempDir, '.amazing-team'), { recursive: true });
      fs.mkdirSync(path.join(projectTempDir, '.amazing-team', 'memory'), { recursive: true });
      fs.mkdirSync(path.join(projectTempDir, 'tasks'), { recursive: true });
      fs.writeFileSync(path.join(projectTempDir, 'amazingteam.config.yaml'), 'version: "1.0"');

      const result = validateProjectStructure(projectTempDir);
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.includes('opencode.jsonc'))).toBe(true);
    });
  });

  describe('loadSchema', () => {
    it('should load and parse JSON schema file', () => {
      const schemaPath = path.join(tempDir, 'test-schema.json');
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };
      fs.writeFileSync(schemaPath, JSON.stringify(schema));

      const loaded = loadSchema(schemaPath);
      expect(loaded).toEqual(schema);
    });

    it('should throw error for invalid JSON', () => {
      const schemaPath = path.join(tempDir, 'invalid-schema.json');
      fs.writeFileSync(schemaPath, 'not valid json');

      expect(() => loadSchema(schemaPath)).toThrow();
    });

    it('should throw error for missing file', () => {
      const schemaPath = path.join(tempDir, 'missing-schema.json');
      expect(() => loadSchema(schemaPath)).toThrow();
    });
  });
});
