/**
 * Check-Update Command
 * Check for available updates
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const VERSION = require('../../package.json').version;
const PACKAGE_NAME = 'ai-team-foundation';
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
          resolve({
            version: pkg.version,
            description: pkg.description,
            published: pkg.time?.[pkg.version]
          });
        } catch (err) {
          reject(new Error('Failed to parse registry response'));
        }
      });
    }).on('error', reject).on('timeout', () => {
      reject(new Error('Registry request timeout'));
    });
  });
}

function getChangelog(version) {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${PACKAGE_NAME}`;
    
    https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': `${PACKAGE_NAME}-cli/${VERSION}`
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }
      
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        try {
          const pkg = JSON.parse(data);
          const versions = Object.keys(pkg.versions || {})
            .filter(v => v.match(/^\d+\.\d+\.\d+$/))
            .sort((a, b) => {
              const [aM, aN, aP] = a.split('.').map(Number);
              const [bM, bN, bP] = b.split('.').map(Number);
              if (aM !== bM) return bM - aM;
              if (aN !== bN) return bN - aN;
              return bP - aP;
            });
          
          resolve(versions.slice(0, 10));
        } catch (err) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function compareVersions(a, b) {
  const [aM, aN, aP] = a.split('.').map(Number);
  const [bM, bN, bP] = b.split('.').map(Number);
  
  if (aM !== bM) return aM - bM;
  if (aN !== bN) return aN - bN;
  return aP - bP;
}

async function run(options, positional) {
  console.log('\n🔍 Checking for updates...\n');
  
  console.log(`Current version: ${VERSION}`);
  
  try {
    const latest = await getLatestVersion();
    console.log(`Latest version:  ${latest.version}`);
    
    const comparison = compareVersions(VERSION, latest.version);
    
    if (comparison >= 0) {
      console.log('\n✅ You are using the latest version!\n');
      return;
    }
    
    console.log('\n📦 New version available!\n');
    
    // Get recent versions
    const versions = await getChangelog(latest.version);
    if (versions && versions.length > 0) {
      console.log('Recent versions:');
      versions.forEach(v => {
        const marker = v === latest.version ? ' (latest)' : '';
        const current = v === VERSION ? ' (current)' : '';
        console.log(`  - ${v}${marker}${current}`);
      });
    }
    
    console.log('\nTo upgrade:');
    console.log('  ai-team upgrade');
    console.log(`  ai-team upgrade --to ${latest.version}`);
    console.log('\nOr update your workflow file:');
    console.log(`  uses: your-org/ai-team-action@v${latest.version}`);
    console.log('');
    
  } catch (error) {
    console.error('\n❌ Failed to check for updates:', error.message);
    console.log('\nYou can check manually at:');
    console.log(`  https://www.npmjs.com/package/${PACKAGE_NAME}`);
    console.log(`  https://github.com/your-org/${PACKAGE_NAME}/releases\n`);
  }
}

function help() {
  return `
ai-team check-update - Check for available updates

Usage:
  ai-team check-update

Checks NPM registry for the latest version and displays:
  - Current installed version
  - Latest available version
  - Recent version history
  - Upgrade instructions

Related:
  ai-team upgrade - Perform the upgrade
`;
}

module.exports = { run, help };