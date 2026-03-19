/**
 * Configuration Validator Module
 * Validates user configuration against schema
 */

const fs = require('fs');
const path = require('path');

// Minimal JSON Schema validator (no external dependencies)
// For production, consider using ajv

/**
 * Validate a value against a schema
 * @param {*} value - Value to validate
 * @param {Object} schema - JSON Schema
 * @param {string} path - Current path (for error messages)
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateAgainstSchema(value, schema, path = 'root') {
  const errors = [];
  
  if (!schema) {
    return { valid: true, errors: [] };
  }
  
  // Type validation
  if (schema.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (schema.type === 'integer') {
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        errors.push(`${path}: expected type ${schema.type}, got ${actualType}`);
      }
    } else if (actualType !== schema.type && !(schema.type === 'object' && value === null)) {
      if (schema.nullable !== true || value !== null) {
        errors.push(`${path}: expected type ${schema.type}, got ${actualType}`);
      }
    }
  }
  
  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path}: value must be one of [${schema.enum.join(', ')}], got ${value}`);
  }
  
  // String validations
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path}: string length ${value.length} is less than minLength ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push(`${path}: string length ${value.length} exceeds maxLength ${schema.maxLength}`);
    }
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        errors.push(`${path}: string does not match pattern ${schema.pattern}`);
      }
    }
  }
  
  // Number validations
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${path}: value ${value} is less than minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${path}: value ${value} exceeds maximum ${schema.maximum}`);
    }
  }
  
  // Array validations
  if (Array.isArray(value) && schema.items) {
    value.forEach((item, index) => {
      const itemResult = validateAgainstSchema(item, schema.items, `${path}[${index}]`);
      errors.push(...itemResult.errors);
    });
    
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${path}: array length ${value.length} is less than minItems ${schema.minItems}`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${path}: array length ${value.length} exceeds maxItems ${schema.maxItems}`);
    }
  }
  
  // Object validations
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // Required properties
    if (schema.required) {
      for (const reqProp of schema.required) {
        if (!(reqProp in value)) {
          errors.push(`${path}: missing required property '${reqProp}'`);
        }
      }
    }
    
    // Property validations
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        if (propName in value) {
          const propResult = validateAgainstSchema(value[propName], propSchema, `${path}.${propName}`);
          errors.push(...propResult.errors);
        }
      }
    }
    
    // Additional properties
    if (schema.additionalProperties === false) {
      const allowedProps = new Set([
        ...Object.keys(schema.properties || {}),
        ...(schema.required || [])
      ]);
      for (const propName of Object.keys(value)) {
        if (!allowedProps.has(propName) && !propName.startsWith('$')) {
          errors.push(`${path}: unknown property '${propName}'`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Load and parse JSON Schema
 * @param {string} schemaPath - Path to schema file
 * @returns {Object} Parsed schema
 */
function loadSchema(schemaPath) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  return JSON.parse(schemaContent);
}

/**
 * Validate user configuration
 * @param {Object} config - User configuration object
 * @param {Object} schema - JSON Schema object
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateConfig(config, schema) {
  return validateAgainstSchema(config, schema);
}

/**
 * Validate required files exist in project
 * @param {string} projectDir - Project directory
 * @param {string[]} requiredFiles - List of required files
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateRequiredFiles(projectDir, requiredFiles) {
  const missing = [];
  
  for (const file of requiredFiles) {
    const filePath = path.join(projectDir, file);
    if (!fs.existsSync(filePath)) {
      missing.push(file);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Validate project structure
 * @param {string} projectDir - Project directory
 * @returns {{ valid: boolean, issues: string[] }}
 */
function validateProjectStructure(projectDir) {
  const issues = [];
  
  // Check required directories
  const requiredDirs = [
    '.amazing-team',
    '.amazing-team/memory',
    'tasks'
  ];
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(projectDir, dir);
    if (!fs.existsSync(dirPath)) {
      issues.push(`Missing directory: ${dir}`);
    }
  }
  
  // Check required files
  const requiredFiles = [
    'amazingteam.config.yaml'
  ];
  
  const fileResult = validateRequiredFiles(projectDir, requiredFiles);
  issues.push(...fileResult.missing.map(f => `Missing file: ${f}`));
  
  // Check opencode.jsonc exists
  const opencodePath = path.join(projectDir, 'opencode.jsonc');
  if (!fs.existsSync(opencodePath)) {
    issues.push('Missing opencode.jsonc (run `amazingteam local` to generate)');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate configuration file
 * @param {string} configPath - Path to config file
 * @param {string} schemaPath - Path to schema file
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateConfigFile(configPath, schemaPath) {
  const errors = [];
  const warnings = [];
  
  // Check files exist
  if (!fs.existsSync(configPath)) {
    errors.push(`Config file not found: ${configPath}`);
    return { valid: false, errors, warnings };
  }
  
  if (!fs.existsSync(schemaPath)) {
    warnings.push(`Schema file not found: ${schemaPath}, skipping schema validation`);
    return { valid: true, errors, warnings };
  }
  
  // Load and parse config
  let config;
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    config = parseYaml(configContent);
  } catch (err) {
    errors.push(`Failed to parse config: ${err.message}`);
    return { valid: false, errors, warnings };
  }
  
  // Load schema
  let schema;
  try {
    schema = loadSchema(schemaPath);
  } catch (err) {
    errors.push(`Failed to load schema: ${err.message}`);
    return { valid: false, errors, warnings };
  }
  
  // Validate against schema
  const result = validateConfig(config, schema);
  errors.push(...result.errors);
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Simple YAML parser (handles basic YAML)
 * For production, use a proper YAML library
 * @param {string} content - YAML content
 * @returns {Object} Parsed object
 */
function parseYaml(content) {
  // This is a minimal YAML parser for simple configs
  // For production, use 'js-yaml' or similar
  const lines = content.split('\n');
  const result = {};
  let currentPath = [];
  let currentObj = result;
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') continue;
    
    const indent = line.search(/\S/);
    const level = Math.floor(indent / 2);
    const trimmed = line.trim();
    
    // Handle key-value pairs
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();
      
      // Parse value
      if (value === '') {
        // Nested object
        currentObj[key] = {};
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Array
        currentObj[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''));
      } else if (value.startsWith('"') && value.endsWith('"')) {
        // String
        currentObj[key] = value.slice(1, -1);
      } else if (value === 'true' || value === 'false') {
        // Boolean
        currentObj[key] = value === 'true';
      } else if (!isNaN(Number(value))) {
        // Number
        currentObj[key] = Number(value);
      } else if (value === 'null') {
        currentObj[key] = null;
      } else {
        currentObj[key] = value;
      }
    }
  }
  
  return result;
}

module.exports = {
  validateAgainstSchema,
  validateConfig,
  validateConfigFile,
  validateRequiredFiles,
  validateProjectStructure,
  loadSchema
};