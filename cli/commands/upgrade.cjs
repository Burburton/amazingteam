/**
 * Upgrade Command
 * Upgrade to a new version
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const VERSION = require('../../package.json').version;
const PACKAGE_NAME = 'amazingteam';
const REGISTRY = 'https://registry.npmjs.org';

function getLatestVersion() {
  return new Promise((resolve, reject) => {
    const url = `${REGISTRY}/${PACKAGE_NAME}/latest`;
    
    https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': `${PACKAGE_NAME}-cli/${VERSION}`
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Registry returned ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        try {
          const pkg = JSON.parse(data);
          resolve(pkg.version);
        } catch (err) {
          reject(new Error('Failed to parse registry response'));
        }
      });
    }).on('error', reject).on('timeout', () => {
      reject(new Error('Registry request timeout'));
    });
  });
}

function compareVersions(a, b) {
  const [aM, aN, aP] = a.split('.').map(Number);
  const [bM, bN, bP] = b.split('.').map(Number);
  
  if (aM !== bM) return aM - bM;
  if (aN !== bN) return aN - bN;
  return aP - bP;
}

function getVersionDiff(from, to) {
  const [fM, fN, fP] = from.split('.').map(Number);
  const [tM, tN, tP] = to.split('.').map(Number);
  
  if (tM > fM) return 'major';
  if (tN > fN) return 'minor';
  return 'patch';
}

async function run(options, positional) {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'amazingteam.config.yaml');
  const workflowPath = path.join(projectPath, '.github', 'workflows', 'amazingteam.yml');
  
  // Check if initialized
  if (!fs.existsSync(configPath)) {
    console.error('\n❌ AmazingTeam not initialized in this directory.');
    console.error('   Run "amazingteam init" first.\n');
    process.exit(1);
  }
  
  const targetVersion = options.to;
  const dryRun = options.dryRun;
  
  console.log('\n🔄 AmazingTeam Upgrade\n');
  
  // Determine target version
  let newVersion;
  try {
    newVersion = targetVersion || await getLatestVersion();
  } catch (error) {
    console.error('❌ Failed to get latest version:', error.message);
    process.exit(1);
  }
  
  // Read current version from config
  let currentVersion = VERSION;
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const versionMatch = configContent.match(/version:\s*["']?(\d+\.\d+\.\d+)/);
  if (versionMatch) {
    currentVersion = versionMatch[1];
  }
  
  console.log(`Current version: ${currentVersion}`);
  console.log(`Target version:   ${newVersion}`);
  
  // Check if already up to date
  if (compareVersions(currentVersion, newVersion) >= 0 && !options.force) {
    console.log('\n✅ Already up to date!\n');
    return;
  }
  
  // Check for breaking changes
  const diff = getVersionDiff(currentVersion, newVersion);
  if (diff === 'major') {
    console.log('\n⚠️  MAJOR version upgrade detected!');
    console.log('   This may contain breaking changes.');
    console.log('   Please review the changelog before proceeding.\n');
  }
  
  if (dryRun) {
    console.log('\n📝 Dry run - showing changes that would be made:\n');
  } else {
    console.log('\n📦 Upgrading...\n');
  }
  
  const changes = [];
  
  // Update amazingteam.config.yaml
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf-8');
    const oldContent = content;
    
    content = content.replace(
      /version:\s*["']?\d+\.\d+\.\d+["']?/g,
      `version: "${newVersion}"`
    );
    
    if (content !== oldContent) {
      if (dryRun) {
        console.log('  Would update: amazingteam.config.yaml');
        console.log(`    version: ${currentVersion} → ${newVersion}`);
      } else {
        fs.writeFileSync(configPath, content);
        console.log('  ✅ Updated: amazingteam.config.yaml');
      }
      changes.push('config');
    }
  }
  
  // Update workflow file
  if (fs.existsSync(workflowPath)) {
    let content = fs.readFileSync(workflowPath, 'utf-8');
    const oldContent = content;
    
    // Update action version references
    content = content.replace(
      /amazingteam-action@v?\d+\.\d+\.\d+/g,
      `amazingteam-action@v${newVersion}`
    );
    content = content.replace(
      /version:\s*['"]?\d+\.\d+\.\d+['"]?/g,
      `version: '${newVersion}'`
    );
    
    if (content !== oldContent) {
      if (dryRun) {
        console.log('  Would update: .github/workflows/amazingteam.yml');
        console.log(`    action: @v${currentVersion} → @v${newVersion}`);
      } else {
        fs.writeFileSync(workflowPath, content);
        console.log('  ✅ Updated: .github/workflows/amazingteam.yml');
      }
      changes.push('workflow');
    }
  }
  
  if (changes.length === 0) {
    console.log('  No changes needed.');
  }
  
  if (!dryRun && changes.length > 0) {
    console.log('\n✅ Upgrade complete!\n');
    console.log('Next steps:');
    console.log('  1. Review the changes');
    console.log('  2. Run `amazingteam local` to download the new version');
    console.log('  3. Test your project');
    console.log('  4. Commit the changes\n');
  } else if (dryRun) {
    console.log('\nRun without --dry-run to apply changes.\n');
  }
}

function help() {
  return `
amazingteam upgrade - Upgrade to a new version

Usage:
  amazingteam upgrade [options]

Options:
  --to <version>    Upgrade to specific version
  --dry-run         Preview changes without applying
  --force           Force upgrade even if already up to date

Examples:
  amazingteam upgrade                Upgrade to latest version
  amazingteam upgrade --to 3.1.0     Upgrade to specific version
  amazingteam upgrade --dry-run      Preview upgrade changes

What gets updated:
  - amazingteam.config.yaml version
  - .github/workflows/amazingteam.yml action reference

Note: After upgrading, run \`amazingteam local\` to download the new version
for local development.
`;
}

module.exports = { run, help };