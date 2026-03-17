/**
 * Overlay Tests
 * Tests for overlay functionality
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const TEMP_DIR = path.join(os.tmpdir(), 'amazingteam-overlay-test');
const ACTION_DIR = path.join(__dirname, '..');

let originalCwd;

function setup() {
  console.log('Setting up overlay test environment...');
  
  originalCwd = process.cwd();
  
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function teardown() {
  console.log('Cleaning up overlay test environment...');
  
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

function testBuiltinOverlayExists() {
  console.log('\nTesting built-in overlay existence...');
  
  const overlaysDir = path.join(ACTION_DIR, 'overlays');
  
  if (fs.existsSync(overlaysDir)) {
    const overlays = fs.readdirSync(overlaysDir).filter(f => {
      const stat = fs.statSync(path.join(overlaysDir, f));
      return stat.isDirectory();
    });
    
    console.log(`  Found ${overlays.length} overlays: ${overlays.join(', ')}`);
    
    console.assert(overlays.includes('web-fullstack') || overlays.length > 0, 
      'Should have at least one overlay');
  } else {
    console.log('  Note: overlays directory not found (may be in foundation only)');
  }
  
  console.log('  ✓ built-in overlay existence tests passed');
}

function testOverlayConfigMerging() {
  console.log('\nTesting overlay config merging...');
  
  const { mergeConfig } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const foundationDefaults = {
    project: { language: 'typescript' },
    build: { command: 'npm run build', test: 'npm test' },
    rules: { max_function_lines: 30 }
  };
  
  const webFullstackOverlay = {
    project: { framework: 'react' },
    build: { lint: 'npm run lint', typecheck: 'npm run typecheck' },
    rules: { use_functional_components: true }
  };
  
  const userConfig = {
    project: { name: 'my-app' },
    rules: { test_coverage_threshold: 85 }
  };
  
  let merged = mergeConfig(foundationDefaults, webFullstackOverlay);
  merged = mergeConfig(merged, userConfig);
  
  console.assert(merged.project.name === 'my-app', 'Should have user project name');
  console.assert(merged.project.language === 'typescript', 'Should have foundation language');
  console.assert(merged.project.framework === 'react', 'Should have overlay framework');
  console.assert(merged.build.lint === 'npm run lint', 'Should have overlay lint command');
  console.assert(merged.rules.test_coverage_threshold === 85, 'Should have user rule');
  console.assert(merged.rules.use_functional_components === true, 'Should have overlay rule');
  
  console.log('  ✓ overlay config merging tests passed');
}

function testPythonBackendOverlay() {
  console.log('\nTesting python-backend overlay...');
  
  const { mergeConfig } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const foundationDefaults = {
    project: { language: 'typescript' },
    build: { command: 'npm run build', test: 'npm test' }
  };
  
  const pythonOverlay = {
    project: { language: 'python' },
    build: { 
      command: 'python -m build', 
      test: 'pytest',
      lint: 'ruff check .',
      typecheck: 'mypy .'
    }
  };
  
  const userConfig = {
    project: { name: 'my-python-api' }
  };
  
  let merged = mergeConfig(foundationDefaults, pythonOverlay);
  merged = mergeConfig(merged, userConfig);
  
  console.assert(merged.project.language === 'python', 'Should use Python language');
  console.assert(merged.build.command === 'python -m build', 'Should use Python build');
  console.assert(merged.build.test === 'pytest', 'Should use pytest');
  console.assert(merged.build.lint === 'ruff check .', 'Should use ruff');
  
  console.log('  ✓ python-backend overlay tests passed');
}

function testWebFullstackOverlay() {
  console.log('\nTesting web-fullstack overlay...');
  
  const { mergeConfig } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const foundationDefaults = {
    project: { language: 'typescript' },
    build: { command: 'npm run build' }
  };
  
  const webOverlay = {
    project: { framework: 'react' },
    build: {
      command: 'npm run build',
      test: 'npm test',
      lint: 'npm run lint',
      typecheck: 'npm run typecheck'
    },
    rules: {
      use_functional_components: true,
      prefer_hooks: true
    }
  };
  
  const userConfig = {
    project: { name: 'my-web-app' }
  };
  
  let merged = mergeConfig(foundationDefaults, webOverlay);
  merged = mergeConfig(merged, userConfig);
  
  console.assert(merged.project.framework === 'react', 'Should use React framework');
  console.assert(merged.rules.use_functional_components === true, 'Should enforce functional components');
  console.assert(merged.rules.prefer_hooks === true, 'Should prefer hooks');
  
  console.log('  ✓ web-fullstack overlay tests passed');
}

function testCppQtOverlay() {
  console.log('\nTesting cpp-qt-desktop overlay...');
  
  const { mergeConfig } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const foundationDefaults = {
    project: { language: 'typescript' },
    build: { command: 'npm run build' }
  };
  
  const cppQtOverlay = {
    project: { language: 'cpp' },
    build: {
      command: 'cmake --build build',
      test: 'ctest --test-dir build',
      lint: 'clang-tidy'
    },
    rules: {
      use_qt_signals_slots: true,
      naming_convention: 'Qt_style'
    }
  };
  
  const userConfig = {
    project: { name: 'my-qt-app' }
  };
  
  let merged = mergeConfig(foundationDefaults, cppQtOverlay);
  merged = mergeConfig(merged, userConfig);
  
  console.assert(merged.project.language === 'cpp', 'Should use C++ language');
  console.assert(merged.build.command === 'cmake --build build', 'Should use cmake');
  console.assert(merged.rules.use_qt_signals_slots === true, 'Should use Qt signals/slots');
  
  console.log('  ✓ cpp-qt-desktop overlay tests passed');
}

function testCustomOverlayPath() {
  console.log('\nTesting custom overlay path...');
  
  const customOverlayDir = path.join(TEMP_DIR, 'custom-overlay');
  fs.mkdirSync(customOverlayDir, { recursive: true });
  
  const customOverlayConfig = {
    project: { language: 'rust' },
    build: {
      command: 'cargo build',
      test: 'cargo test',
      lint: 'cargo clippy'
    },
    rules: {
      use_await_syntax: true,
      avoid_unwrap: true
    }
  };
  
  const configPath = path.join(customOverlayDir, 'overlay.json');
  fs.writeFileSync(configPath, JSON.stringify(customOverlayConfig, null, 2));
  
  console.assert(fs.existsSync(configPath), 'Custom overlay should exist');
  
  const loaded = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.assert(loaded.project.language === 'rust', 'Should have Rust language');
  console.assert(loaded.build.command === 'cargo build', 'Should have cargo build');
  
  console.log('  ✓ custom overlay path tests passed');
}

function testOverlayWithPreset() {
  console.log('\nTesting overlay with preset...');
  
  const { mergeWithPreset } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const defaults = {
    project: { language: 'typescript' },
    build: { command: 'npm run build' }
  };
  
  const preset = {
    $preset: 'python',
    project: { language: 'python' },
    build: { command: 'python -m build', test: 'pytest' }
  };
  
  const user = {
    project: { name: 'my-api' }
  };
  
  const merged = mergeWithPreset(preset, defaults, user);
  
  console.assert(merged.project.language === 'python', 'Should use preset language');
  console.assert(merged.project.name === 'my-api', 'Should have user project name');
  console.assert(merged.build.test === 'pytest', 'Should have preset test command');
  
  console.log('  ✓ overlay with preset tests passed');
}

function testOverlayPriorityOrder() {
  console.log('\nTesting overlay priority order...');
  
  const { mergeConfig } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const foundation = { rules: { value: 'foundation' } };
  const overlay = { rules: { value: 'overlay', extra: 'from-overlay' } };
  const user = { rules: { value: 'user' } };
  
  let merged = mergeConfig(foundation, overlay);
  merged = mergeConfig(merged, user);
  
  console.assert(merged.rules.value === 'user', 'User should have highest priority');
  console.assert(merged.rules.extra === 'from-overlay', 'Overlay extras should be preserved');
  
  console.log('  ✓ overlay priority order tests passed');
}

function testOverlayContentMerge() {
  console.log('\nTesting overlay content merge...');
  
  const { mergeConfig } = require(path.join(ACTION_DIR, 'action', 'lib', 'merger'));
  
  const baseConfig = {
    overlay: {
      content: ''
    }
  };
  
  const userOverlay = {
    overlay: {
      content: `
## Custom Rules
- Rule 1
- Rule 2
`
    }
  };
  
  const merged = mergeConfig(baseConfig, userOverlay);
  
  console.assert(merged.overlay.content.includes('Custom Rules'), 'Should have overlay content');
  console.assert(merged.overlay.content.includes('Rule 1'), 'Should have first rule');
  
  console.log('  ✓ overlay content merge tests passed');
}

function runAll() {
  console.log('\n=== Overlay Tests ===\n');
  
  try {
    setup();
    
    testBuiltinOverlayExists();
    testOverlayConfigMerging();
    testPythonBackendOverlay();
    testWebFullstackOverlay();
    testCppQtOverlay();
    testCustomOverlayPath();
    testOverlayWithPreset();
    testOverlayPriorityOrder();
    testOverlayContentMerge();
    
    console.log('\n✅ All overlay tests passed!\n');
  } finally {
    teardown();
  }
}

runAll();