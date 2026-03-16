#!/usr/bin/env node
/**
 * AI Team Foundation CLI v3
 * Main entry point for command-line interface
 */

const path = require('path');
const fs = require('fs');

const PACKAGE_JSON = require('../package.json');
const VERSION = PACKAGE_JSON.version;

const COMMANDS_DIR = path.join(__dirname, 'commands');

const COMMANDS = {
  init: 'Initialize AI Team in a project',
  version: 'Show current foundation version',
  'check-update': 'Check for available updates',
  upgrade: 'Upgrade to a new version',
  local: 'Download foundation for local development',
  validate: 'Validate configuration',
  migrate: 'Migrate v2.x project to v3',
  status: 'Show AI Team status',
  help: 'Show help information'
};

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function colorize(text, color) {
  return `${COLORS[color] || ''}${text}${COLORS.reset}`;
}

function log(message, color = 'reset') {
  console.log(colorize(message, color));
}

function showHelp() {
  console.log(`
${colorize('AI Team Foundation CLI', 'cyan')} v${VERSION}

${colorize('Usage:', 'yellow')}
  ai-team <command> [options]

${colorize('Commands:', 'yellow')}
${Object.entries(COMMANDS).map(([cmd, desc]) => `  ${cmd.padEnd(15)} ${desc}`).join('\n')}

${colorize('Options:', 'yellow')}
  --help, -h      Show help for a command
  --version, -v   Show CLI version
  --force, -f     Force operation
  --dry-run       Preview changes without executing

${colorize('Init Options:', 'yellow')}
  --language, -l <lang>    Programming language (default: typescript)
  --framework <fw>         Framework (default: node)
  --overlay, -o <name>     Apply overlay (python-backend, web-fullstack, etc.)
  --description, -d <desc> Project description

${colorize('Upgrade Options:', 'yellow')}
  --to <version>    Upgrade to specific version

${colorize('Local Options:', 'yellow')}
  --from <path>     Download from local path (offline mode)

${colorize('Examples:', 'dim')}
  ai-team init                    Initialize in current directory
  ai-team init my-project         Create new project
  ai-team init -l python -o python-backend my-api
  ai-team upgrade --to 3.1.0      Upgrade to specific version
  ai-team local --from ./path     Download from local path

${colorize('Documentation:', 'dim')}
  https://github.com/your-org/ai-team-foundation
`);
}

function showVersion() {
  console.log(`ai-team-foundation v${VERSION}`);
}

function parseArgs(args) {
  const result = {
    command: null,
    options: {},
    positional: []
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      
      if (key === 'help' || key === 'h') {
        result.options.help = true;
      } else if (key === 'version' || key === 'v') {
        result.options.version = true;
      } else if (nextArg && !nextArg.startsWith('-')) {
        result.options[key] = nextArg;
        i++;
      } else {
        result.options[key] = true;
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      const key = arg.slice(1);
      const nextArg = args[i + 1];
      
      const shortToLong = {
        'h': 'help',
        'v': 'version',
        'f': 'force',
        'l': 'language',
        'o': 'overlay',
        'd': 'description'
      };
      
      const longKey = shortToLong[key] || key;
      
      if (['language', 'overlay', 'description'].includes(longKey) && nextArg && !nextArg.startsWith('-')) {
        result.options[longKey] = nextArg;
        i++;
      } else {
        result.options[longKey] = true;
      }
    } else {
      if (!result.command) {
        result.command = arg;
      } else {
        result.positional.push(arg);
      }
    }
  }

  return result;
}

async function runCommand(command, options, positional) {
  const commandPath = path.join(COMMANDS_DIR, `${command}.cjs`);
  
  if (!fs.existsSync(commandPath)) {
    log(`Unknown command: ${command}`, 'red');
    log('Run "ai-team help" for available commands', 'yellow');
    process.exit(1);
  }

  try {
    const cmd = require(commandPath);
    
    if (options.help && cmd.help) {
      console.log(cmd.help());
      return;
    }
    
    await cmd.run(options, positional);
  } catch (error) {
    log(`\nError: ${error.message}`, 'red');
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const { command, options, positional } = parseArgs(args);

  if (options.version) {
    showVersion();
    process.exit(0);
  }

  if (command === 'help' || options.help) {
    if (command && command !== 'help') {
      const cmdPath = path.join(COMMANDS_DIR, `${command}.cjs`);
      if (fs.existsSync(cmdPath)) {
        const cmd = require(cmdPath);
        if (cmd.help) {
          console.log(cmd.help());
          process.exit(0);
        }
      }
    }
    showHelp();
    process.exit(0);
  }

  if (!command) {
    showHelp();
    process.exit(0);
  }

  // Handle legacy commands for backward compatibility
  const legacyCommands = {
    'update': 'upgrade',
    'check': 'validate'
  };
  
  const actualCommand = legacyCommands[command] || command;
  
  await runCommand(actualCommand, options, positional);
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});