/**
 * Local Command
 * Download foundation for local development
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = require('../../package.json').version;
const PACKAGE_NAME = 'ai-team-foundation';
const REGISTRY = 'https://registry.npmjs.org';
const CACHE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.ai-team-cache');
const LOCAL_DIR = '.ai-team-local';

function downloadFromNpm(version, destDir) {
  const url = `${REGISTRY}/${PACKAGE_NAME}/-/${PACKAGE_NAME}-${version}.tgz`;
  const tarballPath = path.join(destDir, `${PACKAGE_NAME}-${version}.tgz`);
  
  console.log(`Downloading from NPM: ${url}`);
  
  try {
    execSync(`curl -L -o "${tarballPath}" "${url}"`, { stdio: 'inherit' });
  } catch (err) {
    throw new Error(`Failed to download: ${err.message}`);
  }
  
  return tarballPath;
}

function extractTarball(tarballPath, destDir) {
  console.log('Extracting...');
  
  try {
    execSync(`tar -xzf "${tarballPath}" -C "${destDir}"`, { stdio: 'inherit' });
  } catch (err) {
    throw new Error(`Failed to extract: ${err.message}`);
  }
}

function readConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  const content = fs.readFileSync(configPath, 'utf-8');
  const config = {};
  
  content.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*["']?([^"'\n]+)["']?/);
    if (match) {
      config[match[1]] = match[2];
    }
    
    const nestedMatch = line.match(/^  (\w+):\s*["']?([^"'\n]+)["']?/);
    if (nestedMatch) {
      const parent = line.split('  ')[0]?.match(/^(\w+):/)?.[1];
      if (parent && !config[parent]) {
        config[parent] = {};
      }
      if (config[parent]) {
        config[parent][nestedMatch[1]] = nestedMatch[2];
      }
    }
  });
  
  return config;
}

function generateLocalOpenCodeConfig(projectDir, foundationDir, config) {
  return `{
  "$schema": "https://opencode.ai/config.json",
  "model": "default",
  "small_model": "default",
  "default_agent": "build",
  "instructions": [
    "${foundationDir}/AGENTS.md",
    "AGENTS.md"
  ],
  "autoupdate": true,
  "permission": {
    "edit": "ask",
    "bash": "ask"
  },
  "tools": {
    "write": true,
    "edit": true,
    "bash": true
  },
  "skills": {
    "test-first-feature-dev": {
      "path": "${foundationDir}/.opencode/skills/test-first-feature-dev/SKILL.md"
    },
    "bugfix-playbook": {
      "path": "${foundationDir}/.opencode/skills/bugfix-playbook/SKILL.md"
    },
    "repo-architecture-reader": {
      "path": "${foundationDir}/.opencode/skills/repo-architecture-reader/SKILL.md"
    },
    "task-breakdown-and-dispatch": {
      "path": "${foundationDir}/.opencode/skills/task-breakdown-and-dispatch/SKILL.md"
    }
  }
}`;
}

async function run(options, positional) {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'ai-team.config.yaml');
  const localPath = path.join(projectPath, LOCAL_DIR);
  
  console.log('\n📥 Downloading AI Team Foundation for local use\n');
  
  // Check if initialized
  if (!fs.existsSync(configPath)) {
    console.error('❌ AI Team not initialized in this directory.');
    console.error('   Run "ai-team init" first.\n');
    process.exit(1);
  }
  
  // Read config
  const config = readConfig(configPath);
  const targetVersion = config?.ai_team?.version || VERSION;
  
  console.log(`Target version: ${targetVersion}`);
  
  // Check if using local path
  if (options.from) {
    const fromPath = path.resolve(options.from);
    
    if (!fs.existsSync(fromPath)) {
      console.error(`❌ Local path not found: ${fromPath}\n`);
      process.exit(1);
    }
    
    console.log(`Using local foundation: ${fromPath}`);
    
    // Create symlink or copy
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath, { recursive: true });
    }
    
    // Copy instead of symlink for reliability
    console.log('Copying foundation files...');
    fs.cpSync(fromPath, localPath, { recursive: true });
    
    console.log(`\n✅ Foundation copied to ${LOCAL_DIR}/\n`);
  } else {
    // Download from NPM
    console.log('Downloading from NPM...\n');
    
    // Create cache directory
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    
    // Check cache
    const cachedPath = path.join(CACHE_DIR, `v${targetVersion}`);
    
    if (fs.existsSync(cachedPath) && !options.force) {
      console.log(`Using cached version: ${cachedPath}`);
    } else {
      // Download
      const tempDir = path.join(CACHE_DIR, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      try {
        const tarballPath = downloadFromNpm(targetVersion, tempDir);
        extractTarball(tarballPath, tempDir);
        
        // Move to cache
        const extractedPath = path.join(tempDir, 'package');
        if (fs.existsSync(cachedPath)) {
          fs.rmSync(cachedPath, { recursive: true });
        }
        fs.renameSync(extractedPath, cachedPath);
        
        // Cleanup
        fs.unlinkSync(tarballPath);
        fs.rmSync(tempDir, { recursive: true });
        
        console.log('✅ Download complete');
      } catch (error) {
        console.error('❌ Download failed:', error.message);
        console.log('\nAlternatives:');
        console.log('  - Check your network connection');
        console.log('  - Use --from /path/to/local/foundation for offline mode');
        console.log('');
        process.exit(1);
      }
    }
    
    // Copy to local directory
    console.log(`\nCopying to ${LOCAL_DIR}/...`);
    
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath, { recursive: true });
    }
    
    fs.cpSync(cachedPath, localPath, { recursive: true });
    
    console.log('✅ Copy complete');
  }
  
  // Generate local opencode.jsonc
  console.log('\n📝 Generating opencode.jsonc for local development...');
  
  const opencodeContent = generateLocalOpenCodeConfig(projectPath, localPath, config);
  const opencodePath = path.join(projectPath, 'opencode.jsonc');
  
  // Backup existing if different
  if (fs.existsSync(opencodePath)) {
    const existing = fs.readFileSync(opencodePath, 'utf-8');
    if (existing !== opencodeContent) {
      fs.writeFileSync(opencodePath + '.backup', existing);
      console.log('  (Backed up existing opencode.jsonc)');
    }
  }
  
  fs.writeFileSync(opencodePath, opencodeContent);
  console.log('✅ Generated opencode.jsonc');
  
  // Summary
  console.log('\n🎉 Local setup complete!\n');
  console.log('Foundation files:', LOCAL_DIR);
  console.log('OpenCode config: opencode.jsonc');
  console.log('\nYou can now use OpenCode locally with full AI Team capabilities.\n');
  
  // Update .gitignore reminder
  console.log('Reminder: Add .ai-team-local/ to .gitignore if not already done.');
  console.log('');
}

function help() {
  return `
ai-team local - Download foundation for local development

Usage:
  ai-team local [options]

Options:
  --from <path>     Use local foundation path (offline mode)
  --force           Force re-download even if cached

Examples:
  ai-team local                     Download from NPM
  ai-team local --from ../foundation   Use local copy
  ai-team local --force              Force re-download

What it does:
  1. Downloads AI Team Foundation to .ai-team-local/
  2. Generates opencode.jsonc with local paths
  3. Caches downloads in ~/.ai-team-cache/

The local foundation allows you to use OpenCode locally
with all AI Team skills and configurations.

Note: .ai-team-local/ should be in .gitignore.
`;
}

module.exports = { run, help };