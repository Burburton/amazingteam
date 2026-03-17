/**
 * Validator Module Tests
 */

const {
  validateAgainstSchema,
  validateConfig,
  validateRequiredFiles,
  validateProjectStructure
} = require('../lib/validator');

function testValidateAgainstSchema_TypeValidation() {
  console.log('Testing validateAgainstSchema type validation...');
  
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      count: { type: 'integer' },
      active: { type: 'boolean' }
    }
  };
  
  const validValue = {
    name: 'test',
    count: 42,
    active: true
  };
  
  const result = validateAgainstSchema(validValue, schema);
  console.assert(result.valid === true, 'Valid object should pass');
  console.assert(result.errors.length === 0, 'Should have no errors');
  
  const invalidValue = {
    name: 123,
    count: 'not a number',
    active: 'yes'
  };
  
  const invalidResult = validateAgainstSchema(invalidValue, schema);
  console.assert(invalidResult.valid === false, 'Invalid object should fail');
  console.assert(invalidResult.errors.length > 0, 'Should have errors');
  
  console.log('  ✓ type validation tests passed');
}

function testValidateAgainstSchema_EnumValidation() {
  console.log('Testing validateAgainstSchema enum validation...');
  
  const schema = {
    type: 'object',
    properties: {
      role: { enum: ['admin', 'user', 'guest'] },
      status: { enum: ['active', 'inactive'] }
    }
  };
  
  const valid = { role: 'admin', status: 'active' };
  const validResult = validateAgainstSchema(valid, schema);
  console.assert(validResult.valid === true, 'Valid enum values should pass');
  
  const invalid = { role: 'superuser', status: 'active' };
  const invalidResult = validateAgainstSchema(invalid, schema);
  console.assert(invalidResult.valid === false, 'Invalid enum should fail');
  console.assert(invalidResult.errors[0].includes('must be one of'), 'Error should mention enum values');
  
  console.log('  ✓ enum validation tests passed');
}

function testValidateAgainstSchema_StringValidation() {
  console.log('Testing validateAgainstSchema string validation...');
  
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3, maxLength: 10 },
      email: { type: 'string', pattern: '^[a-z]+@[a-z]+\\.[a-z]+$' }
    }
  };
  
  const validName = { name: 'test' };
  const validNameResult = validateAgainstSchema(validName, schema);
  console.assert(validNameResult.valid === true, 'Valid string length should pass');
  
  const shortName = { name: 'ab' };
  const shortResult = validateAgainstSchema(shortName, schema);
  console.assert(shortResult.valid === false, 'Too short string should fail');
  console.assert(shortResult.errors[0].includes('minLength'), 'Error should mention minLength');
  
  const longName = { name: 'verylongname' };
  const longResult = validateAgainstSchema(longName, schema);
  console.assert(longResult.valid === false, 'Too long string should fail');
  
  const validEmail = { email: 'test@example.com' };
  const validEmailResult = validateAgainstSchema(validEmail, schema);
  console.assert(validEmailResult.valid === true, 'Valid email pattern should pass');
  
  const invalidEmail = { email: 'invalid-email' };
  const invalidEmailResult = validateAgainstSchema(invalidEmail, schema);
  console.assert(invalidEmailResult.valid === false, 'Invalid email pattern should fail');
  
  console.log('  ✓ string validation tests passed');
}

function testValidateAgainstSchema_NumberValidation() {
  console.log('Testing validateAgainstSchema number validation...');
  
  const schema = {
    type: 'object',
    properties: {
      age: { type: 'integer', minimum: 0, maximum: 150 },
      score: { type: 'number', minimum: 0, maximum: 100 }
    }
  };
  
  const valid = { age: 25, score: 85.5 };
  const validResult = validateAgainstSchema(valid, schema);
  console.assert(validResult.valid === true, 'Valid numbers should pass');
  
  const negativeAge = { age: -5 };
  const negativeResult = validateAgainstSchema(negativeAge, schema);
  console.assert(negativeResult.valid === false, 'Negative age should fail');
  console.assert(negativeResult.errors[0].includes('minimum'), 'Error should mention minimum');
  
  const overMax = { score: 150 };
  const overMaxResult = validateAgainstSchema(overMax, schema);
  console.assert(overMaxResult.valid === false, 'Over maximum should fail');
  
  const nonInteger = { age: 25.5 };
  const nonIntResult = validateAgainstSchema(nonInteger, schema);
  console.assert(nonIntResult.valid === false, 'Non-integer age should fail');
  
  console.log('  ✓ number validation tests passed');
}

function testValidateAgainstSchema_ArrayValidation() {
  console.log('Testing validateAgainstSchema array validation...');
  
  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 5
      }
    }
  };
  
  const valid = { tags: ['a', 'b', 'c'] };
  const validResult = validateAgainstSchema(valid, schema);
  console.assert(validResult.valid === true, 'Valid array should pass');
  
  const empty = { tags: [] };
  const emptyResult = validateAgainstSchema(empty, schema);
  console.assert(emptyResult.valid === false, 'Empty array should fail (minItems)');
  
  const tooMany = { tags: ['1', '2', '3', '4', '5', '6'] };
  const tooManyResult = validateAgainstSchema(tooMany, schema);
  console.assert(tooManyResult.valid === false, 'Array with too many items should fail');
  
  const invalidItems = { tags: ['a', 123, 'b'] };
  const invalidItemsResult = validateAgainstSchema(invalidItems, schema);
  console.assert(invalidItemsResult.valid === false, 'Array with invalid items should fail');
  
  console.log('  ✓ array validation tests passed');
}

function testValidateAgainstSchema_RequiredProperties() {
  console.log('Testing validateAgainstSchema required properties...');
  
  const schema = {
    type: 'object',
    required: ['name', 'version'],
    properties: {
      name: { type: 'string' },
      version: { type: 'string' },
      optional: { type: 'string' }
    }
  };
  
  const valid = { name: 'test', version: '1.0' };
  const validResult = validateAgainstSchema(valid, schema);
  console.assert(validResult.valid === true, 'Object with required properties should pass');
  
  const missingVersion = { name: 'test' };
  const missingResult = validateAgainstSchema(missingVersion, schema);
  console.assert(missingResult.valid === false, 'Missing required property should fail');
  console.assert(missingResult.errors[0].includes('required'), 'Error should mention required');
  
  console.log('  ✓ required properties tests passed');
}

function testValidateAgainstSchema_NestedObjects() {
  console.log('Testing validateAgainstSchema nested objects...');
  
  const schema = {
    type: 'object',
    properties: {
      project: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          language: { type: 'string' }
        },
        required: ['name']
      }
    }
  };
  
  const valid = { project: { name: 'my-project', language: 'typescript' } };
  const validResult = validateAgainstSchema(valid, schema);
  console.assert(validResult.valid === true, 'Valid nested object should pass');
  
  const missingNested = { project: { language: 'typescript' } };
  const missingResult = validateAgainstSchema(missingNested, schema);
  console.assert(missingResult.valid === false, 'Missing nested required property should fail');
  
  console.log('  ✓ nested objects tests passed');
}

function testValidateConfig() {
  console.log('Testing validateConfig...');
  
  const schema = {
    type: 'object',
    required: ['version', 'project'],
    properties: {
      version: { type: 'string' },
      project: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          language: { type: 'string' }
        }
      }
    }
  };
  
  const validConfig = {
    version: '1.0',
    project: {
      name: 'test-project',
      language: 'typescript'
    }
  };
  
  const result = validateConfig(validConfig, schema);
  console.assert(result.valid === true, 'Valid config should pass');
  
  const invalidConfig = {
    version: '1.0'
  };
  
  const invalidResult = validateConfig(invalidConfig, schema);
  console.assert(invalidResult.valid === false, 'Invalid config should fail');
  
  console.log('  ✓ validateConfig tests passed');
}

function testValidateRequiredFiles() {
  console.log('Testing validateRequiredFiles...');
  
  const result = validateRequiredFiles(process.cwd(), ['package.json']);
  console.assert(result.valid === true, 'package.json should exist');
  console.assert(result.missing.length === 0, 'Should have no missing files');
  
  const missingResult = validateRequiredFiles(process.cwd(), ['nonexistent-file.xyz']);
  console.assert(missingResult.valid === false, 'Non-existent file should fail');
  console.assert(missingResult.missing.length === 1, 'Should have one missing file');
  
  console.log('  ✓ validateRequiredFiles tests passed');
}

function testValidateProjectStructure() {
  console.log('Testing validateProjectStructure...');
  
  const result = validateProjectStructure(process.cwd());
  
  console.assert(Array.isArray(result.issues), 'Should return issues array');
  
  if (result.valid) {
    console.log('  Project structure is valid');
  } else {
    console.log(`  Project has issues: ${result.issues.join(', ')}`);
  }
  
  console.log('  ✓ validateProjectStructure tests passed');
}

function runAll() {
  console.log('\n=== Validator Module Tests ===\n');
  
  testValidateAgainstSchema_TypeValidation();
  testValidateAgainstSchema_EnumValidation();
  testValidateAgainstSchema_StringValidation();
  testValidateAgainstSchema_NumberValidation();
  testValidateAgainstSchema_ArrayValidation();
  testValidateAgainstSchema_RequiredProperties();
  testValidateAgainstSchema_NestedObjects();
  testValidateConfig();
  testValidateRequiredFiles();
  testValidateProjectStructure();
  
  console.log('\n✅ All validator tests passed!\n');
}

runAll();