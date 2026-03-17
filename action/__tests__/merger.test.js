/**
 * Merger Module Tests
 */

const { mergeConfig, mergeWithPreset, validateMergedConfig, deepClone, isObject } = require('../lib/merger');

// Test deep clone
function testDeepClone() {
  console.log('Testing deepClone...');
  
  const obj = { a: 1, b: { c: 2 }, d: [3, 4] };
  const cloned = deepClone(obj);
  
  console.assert(cloned.a === obj.a, 'Scalar values should be equal');
  console.assert(cloned.b !== obj.b, 'Nested objects should be different references');
  console.assert(cloned.b.c === obj.b.c, 'Nested values should be equal');
  console.assert(cloned.d !== obj.d, 'Arrays should be different references');
  
  console.log('  ✓ deepClone tests passed');
}

// Test isObject
function testIsObject() {
  console.log('Testing isObject...');
  
  console.assert(isObject({}) === true, '{} should be object');
  console.assert(isObject([]) === false, '[] should not be object');
  console.assert(isObject(null) === false, 'null should not be object');
  console.assert(isObject('string') === false, 'string should not be object');
  console.assert(isObject(123) === false, 'number should not be object');
  
  console.log('  ✓ isObject tests passed');
}

// Test mergeConfig
function testMergeConfig() {
  console.log('Testing mergeConfig...');
  
  const defaults = {
    version: '1.0',
    project: {
      name: 'default',
      language: 'typescript'
    },
    rules: {
      maxLines: 30
    },
    array: [1, 2, 3]
  };
  
  const user = {
    project: {
      name: 'my-project'
    },
    rules: {
      testCoverage: 80
    },
    array: [4, 5]
  };
  
  const merged = mergeConfig(defaults, user);
  
  console.assert(merged.version === '1.0', 'Should keep default version');
  console.assert(merged.project.name === 'my-project', 'Should override project name');
  console.assert(merged.project.language === 'typescript', 'Should keep nested default');
  console.assert(merged.rules.maxLines === 30, 'Should keep default rule');
  console.assert(merged.rules.testCoverage === 80, 'Should add new rule');
  console.assert(merged.array.length === 2, 'Should replace array, not merge');
  console.assert(merged.array[0] === 4, 'Array should have user values');
  
  console.log('  ✓ mergeConfig tests passed');
}

// Test mergeWithPreset
function testMergeWithPreset() {
  console.log('Testing mergeWithPreset...');
  
  const defaults = {
    version: '1.0',
    project: { language: 'typescript' },
    build: { command: '' }
  };
  
  const preset = {
    $preset: 'default',
    project: { language: 'python' },
    build: { command: 'python -m build' }
  };
  
  const user = {
    project: { name: 'my-api' }
  };
  
  const merged = mergeWithPreset(preset, defaults, user);
  
  console.assert(merged.project.language === 'python', 'Should use preset language');
  console.assert(merged.project.name === 'my-api', 'Should use user name');
  console.assert(merged.build.command === 'python -m build', 'Should use preset build command');
  
  console.log('  ✓ mergeWithPreset tests passed');
}

// Test validateMergedConfig
function testValidateMergedConfig() {
  console.log('Testing validateMergedConfig...');
  
  // Valid config
  const validConfig = {
    version: '1.0',
    project: {
      name: 'test',
      language: 'typescript'
    }
  };
  
  const validResult = validateMergedConfig(validConfig);
  console.assert(validResult.valid === true, 'Valid config should pass');
  
  // Invalid config - missing required fields
  const invalidConfig = {
    version: '1.0'
  };
  
  const invalidResult = validateMergedConfig(invalidConfig);
  console.assert(invalidResult.valid === false, 'Invalid config should fail');
  console.assert(invalidResult.errors.length > 0, 'Should have errors');
  
  // Invalid workflow
  const invalidWorkflow = {
    version: '1.0',
    project: { name: 'test', language: 'typescript' },
    workflows: {
      feature: { sequence: ['invalid_role'] }
    }
  };
  
  const workflowResult = validateMergedConfig(invalidWorkflow);
  console.assert(workflowResult.valid === false, 'Invalid role should fail');
  
  console.log('  ✓ validateMergedConfig tests passed');
}

// Run all tests
function runAll() {
  console.log('\n=== Merger Module Tests ===\n');
  
  testDeepClone();
  testIsObject();
  testMergeConfig();
  testMergeWithPreset();
  testValidateMergedConfig();
  
  console.log('\n✅ All merger tests passed!\n');
}

runAll();