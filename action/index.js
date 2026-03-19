/**
 * AmazingTeam Foundation GitHub Action
 * Main entry point for the action
 */

const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

const downloader = require('./lib/downloader');
const merger = require('./lib/merger');
const setup = require('./lib/setup');
const validator = require('./lib/validator');
const PathResolver = require('./lib/path-resolver');

/**
 * Parse YAML config (minimal implementation)
 * For production, use js-yaml package
 */
function parseYamlConfig(content) {
  const lines = content.split('\n');
  const result = {};
  let currentPath = [];
  let currentIndent = 0;
  
  function setValue(obj, keys, value) {
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
  
  for (const line of lines) {
    if (line.trim().startsWith('#') || line.trim() === '') continue;
    
    const indent = line.search(/\S/);
    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');
    
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();
      
      // Adjust path based on indent
      const level = Math.floor(indent / 2);
      currentPath = currentPath.slice(0, level);
      currentPath.push(key);
      
      if (value !== '') {
        // Parse value
        let parsedValue;
        if (value.startsWith('[') && value.endsWith(']')) {
          parsedValue = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        } else if (value === 'true') {
          parsedValue = true;
        } else if (value === 'false') {
          parsedValue = false;
        } else if (value === 'null') {
          parsedValue = null;
        } else if (!isNaN(Number(value))) {
          parsedValue = Number(value);
        } else {
          parsedValue = value.replace(/^["']|["']$/g, '');
        }
        
        setValue(result, currentPath, parsedValue);
        currentPath.pop();
      }
    }
  }
  
  return result;
}

/**
 * Load user configuration
 */
async function loadUserConfig(configPath, projectDir) {
  const fullPath = path.join(projectDir, configPath);
  
  if (!fs.existsSync(fullPath)) {
    core.warning(`Config file not found: ${configPath}, using defaults`);
    return {};
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  return parseYamlConfig(content);
}

/**
 * Load preset configuration
 */
async function loadPreset(presetName, foundationDir) {
  if (!presetName) {
    return null;
  }
  
  const presetPath = path.join(foundationDir, 'presets', `${presetName}.yaml`);
  
  if (!fs.existsSync(presetPath)) {
    core.warning(`Preset not found: ${presetName}`);
    return null;
  }
  
  const content = fs.readFileSync(presetPath, 'utf-8');
  return parseYamlConfig(content);
}

/**
 * Load default configuration
 */
async function loadDefaultConfig(foundationDir) {
  const defaultPath = path.join(foundationDir, 'presets', 'default.yaml');
  
  if (!fs.existsSync(defaultPath)) {
    core.warning('Default preset not found, using minimal config');
    return {
      version: '1.0',
      project: {
        name: 'unknown',
        language: 'typescript'
      }
    };
  }
  
  const content = fs.readFileSync(defaultPath, 'utf-8');
  return parseYamlConfig(content);
}

/**
 * Main action function
 */
async function run() {
  try {
    // Get inputs
    const version = core.getInput('version') || '3.0.0';
    const configPath = core.getInput('config') || 'amazingteam.config.yaml';
    const overlay = core.getInput('overlay') || '';
    const useCache = core.getInput('cache') !== 'false';
    const cacheDir = core.getInput('cache-dir') || path.join(process.env.HOME || '', '.amazing-team-cache');
    
    const projectDir = process.env.GITHUB_WORKSPACE || process.cwd();
    
    core.info(`Setting up AmazingTeam Foundation v${version}`);
    core.info(`Project directory: ${projectDir}`);
    
    // Step 1: Download foundation
    core.info('Downloading foundation...');
    const foundationDir = await downloader.downloadFoundation({
      version,
      cacheDir: useCache ? cacheDir : null
    });
    core.info(`Foundation downloaded to: ${foundationDir}`);
    
    // Step 2: Load configurations
    core.info('Loading configurations...');
    const defaultConfig = await loadDefaultConfig(foundationDir);
    const presetConfig = overlay ? await loadPreset(overlay, foundationDir) : null;
    const userConfig = await loadUserConfig(configPath, projectDir);
    
    // Step 3: Merge configurations
    core.info('Merging configurations...');
    const mergedConfig = merger.mergeWithPreset(presetConfig, defaultConfig, userConfig);
    
    // Validate merged config
    const validation = merger.validateMergedConfig(mergedConfig);
    if (!validation.valid) {
      core.warning(`Configuration validation warnings: ${validation.errors.join(', ')}`);
    }
    
    // Step 4: Setup runtime
    core.info('Setting up runtime...');
    const setupResult = setup.setup(foundationDir, projectDir, mergedConfig);
    
    // Step 5: Verify setup
    const verification = setup.verifySetup(projectDir);
    if (!verification.valid) {
      core.warning(`Setup verification issues: ${verification.issues.join(', ')}`);
    }
    
    // Set outputs
    core.setOutput('foundation-path', foundationDir);
    core.setOutput('setup-complete', 'true');
    core.setOutput('version', version);
    
    // Export environment variables for subsequent steps
    core.exportVariable('AI_TEAM_FOUNDATION_PATH', foundationDir);
    core.exportVariable('AI_TEAM_VERSION', version);
    
    core.info('AmazingTeam Foundation setup complete!');
    
    // Summary
    core.summary.addRaw(`
## AmazingTeam Foundation Setup Complete

| Property | Value |
|----------|-------|
| Version | ${version} |
| Foundation Path | ${foundationDir} |
| Config | ${configPath} |
| Overlay | ${overlay || 'none'} |

### Created Directories
${setupResult.createdDirectories.map(d => `- ${d}`).join('\n')}

### Generated Files
- ${setupResult.opencodePath}
`).write();
    
  } catch (error) {
    core.setFailed(`AmazingTeam setup failed: ${error.message}`);
    core.error(error.stack);
    process.exit(1);
  }
}

// Run the action
run();