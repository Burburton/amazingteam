/**
 * Foundation Downloader Module
 * Downloads AmazingTeam Foundation from NPM or GitHub
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Download options
 * @typedef {Object} DownloadOptions
 * @property {string} version - Foundation version
 * @property {string} [registry] - NPM registry URL
 * @property {string} [githubToken] - GitHub token for private repos
 * @property {string} [cacheDir] - Cache directory
 * @property {number} [retries] - Number of retries (default: 3)
 * @property {number} [timeout] - Timeout in ms (default: 60000)
 */

const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
const GITHUB_REPO = 'your-org/amazingteam';
const DEFAULT_CACHE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.amazing-team-cache');
const MAX_RETRIES = 3;
const TIMEOUT = 60000; // 60 seconds

/**
 * Download a file from URL
 * @param {string} url - URL to download
 * @param {string} dest - Destination path
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<void>}
 */
function downloadFile(url, dest, timeout = TIMEOUT) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      timeout,
      headers: {
        'User-Agent': 'amazingteam-downloader/1.0'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, dest, timeout).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

/**
 * Download from NPM registry
 * @param {string} version - Foundation version
 * @param {string} destDir - Destination directory
 * @param {string} [registry] - NPM registry URL
 * @returns {Promise<string>} Path to downloaded package
 */
async function downloadFromNpm(version, destDir, registry = DEFAULT_REGISTRY) {
  const packageName = 'amazingteam';
  const tarballUrl = `${registry}/${packageName}/-/${packageName}-${version}.tgz`;
  const tarballPath = path.join(destDir, `${packageName}-${version}.tgz`);
  
  console.log(`Downloading from NPM: ${tarballUrl}`);
  
  await downloadFile(tarballUrl, tarballPath);
  
  // Extract tarball
  const extractDir = path.join(destDir, 'package');
  if (fs.existsSync(extractDir)) {
    fs.rmSync(extractDir, { recursive: true });
  }
  
  // Use tar command (available on most systems)
  try {
    execSync(`tar -xzf "${tarballPath}" -C "${destDir}"`, { stdio: 'inherit' });
  } catch (err) {
    throw new Error(`Failed to extract tarball: ${err.message}`);
  }
  
  // Clean up tarball
  fs.unlinkSync(tarballPath);
  
  return extractDir;
}

/**
 * Download from GitHub releases
 * @param {string} version - Foundation version
 * @param {string} destDir - Destination directory
 * @param {string} [githubToken] - GitHub token for private repos
 * @returns {Promise<string>} Path to downloaded package
 */
async function downloadFromGitHub(version, destDir, githubToken) {
  const tarballUrl = `https://github.com/${GITHUB_REPO}/archive/v${version}.tar.gz`;
  const tarballPath = path.join(destDir, `amazingteam-${version}.tar.gz`);
  
  console.log(`Downloading from GitHub: ${tarballUrl}`);
  
  const headers = {
    'User-Agent': 'amazingteam-downloader/1.0'
  };
  
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }
  
  await new Promise((resolve, reject) => {
    const request = https.get(tarballUrl, {
      headers,
      timeout: TIMEOUT
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, tarballPath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`GitHub download failed: HTTP ${response.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(tarballPath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('GitHub download timeout'));
    });
  });
  
  // Extract tarball
  try {
    execSync(`tar -xzf "${tarballPath}" -C "${destDir}"`, { stdio: 'inherit' });
  } catch (err) {
    throw new Error(`Failed to extract GitHub tarball: ${err.message}`);
  }
  
  // Clean up tarball
  fs.unlinkSync(tarballPath);
  
  // GitHub extracts to amazingteam-{version}
  const extractDir = path.join(destDir, `amazingteam-${version}`);
  return extractDir;
}

/**
 * Download with retry
 * @param {Function} downloadFn - Download function
 * @param {number} retries - Number of retries
 * @returns {Promise<string>}
 */
async function withRetry(downloadFn, retries = MAX_RETRIES) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await downloadFn();
    } catch (err) {
      lastError = err;
      console.log(`Download attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Download foundation
 * @param {DownloadOptions} options - Download options
 * @returns {Promise<string>} Path to downloaded foundation
 */
async function downloadFoundation(options) {
  const {
    version,
    registry = DEFAULT_REGISTRY,
    githubToken,
    cacheDir = DEFAULT_CACHE_DIR,
    retries = MAX_RETRIES
  } = options;
  
  // Create cache directory
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  // Check cache
  const cachedPath = path.join(cacheDir, `v${version}`);
  if (fs.existsSync(cachedPath)) {
    console.log(`Using cached foundation v${version}`);
    return cachedPath;
  }
  
  // Create temp directory for download
  const tempDir = path.join(cacheDir, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  let foundationPath;
  
  // Try NPM first, then GitHub
  try {
    foundationPath = await withRetry(() => downloadFromNpm(version, tempDir, registry), retries);
  } catch (npmError) {
    console.log(`NPM download failed: ${npmError.message}`);
    console.log('Falling back to GitHub releases...');
    
    try {
      foundationPath = await withRetry(() => downloadFromGitHub(version, tempDir, githubToken), retries);
    } catch (githubError) {
      throw new Error(`Both NPM and GitHub downloads failed. NPM: ${npmError.message}, GitHub: ${githubError.message}`);
    }
  }
  
  // Move to cache
  fs.renameSync(foundationPath, cachedPath);
  
  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  return cachedPath;
}

/**
 * Check if a version exists
 * @param {string} version - Version to check
 * @param {string} [registry] - NPM registry URL
 * @returns {Promise<boolean>}
 */
async function versionExists(version, registry = DEFAULT_REGISTRY) {
  const packageName = 'amazingteam';
  const url = `${registry}/${packageName}/${version}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'amazingteam-downloader/1.0'
      }
    }, (response) => {
      resolve(response.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Get latest version from NPM
 * @param {string} [registry] - NPM registry URL
 * @returns {Promise<string>} Latest version
 */
async function getLatestVersion(registry = DEFAULT_REGISTRY) {
  const packageName = 'amazingteam';
  const url = `${registry}/${packageName}/latest`;
  
  return new Promise((resolve, reject) => {
    https.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'amazingteam-downloader/1.0'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get latest version: HTTP ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        try {
          const pkg = JSON.parse(data);
          resolve(pkg.version);
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Clear download cache
 * @param {string} [cacheDir] - Cache directory
 */
function clearCache(cacheDir = DEFAULT_CACHE_DIR) {
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('Cache cleared');
  }
}

module.exports = {
  downloadFoundation,
  downloadFromNpm,
  downloadFromGitHub,
  versionExists,
  getLatestVersion,
  clearCache,
  DEFAULT_CACHE_DIR
};