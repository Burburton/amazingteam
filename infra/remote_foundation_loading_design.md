# Remote Foundation Loading Design

## Overview

This document describes the design for enabling AI Team Foundation to be used as a remote dependency, eliminating the need to copy foundation files into user projects.

## Goals

1. User projects only need minimal configuration files
2. Foundation can be upgraded with a single command or version change
3. User project repository stays clean (no foundation source code committed)
4. Version locking with easy upgrade path

---

## Architecture

### Current State (v2.2.0)

```
User Project Repository (contains everything):
├── .amazing-team/              # Foundation files (copied)
├── .opencode/             # Skills (copied)
├── .github/workflows/     # Workflows (copied)
├── AGENTS.md              # Instructions (copied)
├── tasks/                 # Task templates (copied)
├── docs/                  # Documentation (copied)
└── src/                   # User's actual code
```

**Problem**: Foundation files are mixed with user code, hard to upgrade.

### Target State (v3.0.0)

```
User Project Repository (minimal):
├── .github/
│   └── workflows/
│       └── amazing-team.yml       # Reference to foundation version
├── amazing-team.config.yaml       # User configuration (optional)
└── src/                      # User's actual code

Foundation (loaded at runtime):
├── .amazing-team/                 # Downloaded during CI
├── .opencode/                # Downloaded during CI
├── AGENTS.md                 # Downloaded during CI
└── ...
```

---

## Component Design

### 1. GitHub Action: `amazing-team-action`

A reusable GitHub Action that:
- Downloads specified foundation version
- Merges user configuration with foundation defaults
- Sets up environment for OpenCode

**Location**: Separate repository `amazing-team-action` or included in foundation

**Action Interface**:
```yaml
- uses: your-org/amazing-team-action@v2.2.0
  with:
    version: '2.2.0'           # Optional, defaults to action version
    config: 'amazing-team.config.yaml'  # Optional, default path
    overlay: 'python-backend'  # Optional, technology overlay
```

### 2. User Configuration: `amazing-team.config.yaml`

Minimal configuration file for user projects:

```yaml
# amazing-team.config.yaml
version: "1.0"

project:
  name: "my-awesome-app"
  description: "My awesome application"
  language: "typescript"
  framework: "react"

# Override foundation defaults (optional)
build:
  command: "npm run build"
  test: "npm test"
  lint: "npm run lint"

# Custom rules (optional)
rules:
  test_coverage_threshold: 80
  max_function_lines: 30

# Enable/disable agents (optional)
agents:
  planner: true
  architect: true
  developer: true
  qa: true
  reviewer: true
  triage: true
  ci_analyst: true
```

### 3. CLI Tool: `amazing-team` (NPM Package)

Command-line tool for local development and upgrade management:

```bash
# Commands
amazing-team init                    # Initialize amazing-team.config.yaml
amazing-team version                 # Show current foundation version
amazing-team check-update            # Check for updates
amazing-team upgrade [--to x.x.x]    # Upgrade to new version
amazing-team validate                # Validate configuration
amazing-team local                   # Download foundation for local dev
```

### 4. Configuration Merger

Logic to merge user configuration with foundation defaults:

```
Foundation Defaults (remote)
        +
User Configuration (local)
        =
Final Configuration
```

**Merge Rules**:
- User config overrides foundation defaults
- Missing fields use foundation defaults
- Arrays are replaced (not merged)
- Objects are deep-merged

---

## File Structure

### Foundation Repository (this repo)

```
amazing-team-foundation/
├── .amazing-team/
│   ├── agents/
│   ├── skills/
│   ├── commands/
│   ├── memory/
│   └── opencode.template.jsonc
├── .opencode/
│   └── skills/
├── .github/
│   └── workflows/
│       └── opencode.yml       # Template for users
├── action/                     # NEW: GitHub Action
│   ├── action.yml
│   ├── index.js
│   └── lib/
│       ├── downloader.js
│       ├── merger.js
│       ├── setup.js
│       ├── path-resolver.js   # Resolve paths at runtime
│       └── validator.js       # Validate user config
├── cli/                        # NEW: CLI tool
│   ├── amazing-team.cjs
│   └── commands/
│       ├── init.cjs
│       ├── local.cjs
│       ├── upgrade.cjs
│       ├── validate.cjs
│       └── migrate.cjs
├── presets/                    # NEW: Default configurations
│   ├── default.yaml
│   ├── typescript.yaml
│   ├── python.yaml
│   └── go.yaml
├── templates/                  # NEW: User-facing templates
│   ├── opencode.jsonc         # Template for opencode.jsonc
│   ├── amazing-team.yml            # Template for workflow
│   └── gitignore              # Template for .gitignore additions
├── schemas/                    # NEW: JSON Schemas
│   └── config.schema.json     # Schema for amazing-team.config.yaml
├── overlays/
├── docs/
├── AGENTS.md
├── VERSION
└── package.json
```

### User Project (after setup)

```
my-project/
├── .github/
│   └── workflows/
│       └── amazing-team.yml        # Created by CLI
├── opencode.jsonc             # Generated by CLI (for local dev)
├── amazing-team.config.yaml        # Created by CLI
├── .amazing-team/
│   └── memory/                # Runtime state directories
│       ├── planner/
│       ├── architect/
│       ├── developer/
│       ├── qa/
│       ├── reviewer/
│       ├── triage/
│       ├── ci-analyst/
│       └── failures/
├── tasks/
│   └── _template/             # Task templates
├── .gitignore                 # Should ignore .amazing-team-local/
└── src/
    └── ...                    # User's code
```

**Note**: The following must exist in user project (cannot be remote):
- `opencode.jsonc` - OpenCode requires this at project root
- `.amazing-team/memory/` - Runtime state that changes during execution
- `tasks/` - Task tracking files

---

## User Workflow

### Initial Setup

```bash
# In user's project directory
npx amazing-team-foundation init

# Interactive prompts:
# ? Project name: my-awesome-app
# ? Language: typescript
# ? Framework: react
# ? Foundation version: 2.2.0

# Creates:
# - amazing-team.config.yaml
# - .github/workflows/amazing-team.yml
# - Updates .gitignore
```

### Local Development

```bash
# Download foundation for local OpenCode usage
npx amazing-team-foundation local

# Downloads to .amazing-team-local/ (gitignored)
# OpenCode can now use local foundation files
```

### Checking Updates

```bash
npx amazing-team-foundation check-update

# Output:
# Current version: 2.2.0
# Latest version: 2.3.0
# 
# Changes:
# - feat: New skill for API testing
# - fix: Memory isolation bug fix
# 
# Run `amazing-team upgrade` to update
```

### Upgrading

```bash
npx amazing-team-foundation upgrade

# Output:
# Updating from 2.2.0 to 2.3.0...
# 
# Modified files:
# - .github/workflows/amazing-team.yml (version reference)
# 
# Breaking changes: None
# 
# Upgrade complete!
```

---

## Implementation Plan

### Phase 1: Foundation Preparation

| Step | Task | Files | Status |
|------|------|-------|--------|
| 1.1 | Create presets directory with default configs | `presets/*.yaml` | Pending |
| 1.2 | Create templates directory | `templates/*.jsonc`, `templates/*.yml` | Pending |
| 1.3 | Create config schema | `schemas/config.schema.json` | Pending |
| 1.4 | Create configuration merger module | `action/lib/merger.js` | Pending |
| 1.5 | Create path resolver module | `action/lib/path-resolver.js` | Pending |
| 1.6 | Create config validator module | `action/lib/validator.js` | Pending |
| 1.7 | Create downloader module | `action/lib/downloader.js` | Pending |
| 1.8 | Create runtime directory initializer | `action/lib/setup.js` | Pending |
| 1.9 | Create GitHub Action entry point | `action/action.yml`, `action/index.js` | Pending |
| 1.10 | Update package.json with new files | `package.json` | Pending |

### Phase 2: CLI Tool

| Step | Task | Files | Status |
|------|------|-------|--------|
| 2.1 | Create CLI entry point | `cli/amazing-team.cjs` | Pending |
| 2.2 | Implement `init` command | `cli/commands/init.cjs` | Pending |
| 2.3 | Implement `version` command | `cli/commands/version.cjs` | Pending |
| 2.4 | Implement `check-update` command | `cli/commands/check-update.cjs` | Pending |
| 2.5 | Implement `upgrade` command | `cli/commands/upgrade.cjs` | Pending |
| 2.6 | Implement `local` command | `cli/commands/local.cjs` | Pending |
| 2.7 | Implement `validate` command | `cli/commands/validate.cjs` | Pending |
| 2.8 | Implement `migrate` command | `cli/commands/migrate.cjs` | Pending |

### Phase 3: GitHub Action

| Step | Task | Files | Status |
|------|------|-------|--------|
| 3.1 | Create action.yml manifest | `action/action.yml` | Pending |
| 3.2 | Implement main action logic | `action/index.js` | Pending |
| 3.3 | Create workflow template for users | `templates/amazing-team.yml` | Pending |
| 3.4 | Test action in isolation | `action/__tests__/` | Pending |

### Phase 4: Documentation

| Step | Task | Files | Status |
|------|------|-------|--------|
| 4.1 | Create migration guide | `docs/migration-to-v3.md` | Pending |
| 4.2 | Update README with new usage | `README.md` | Pending |
| 4.3 | Create user quick-start guide | `docs/quick-start.md` | Pending |
| 4.4 | Create config schema reference | `docs/config-reference.md` | Pending |
| 4.5 | Update AGENTS.md if needed | `AGENTS.md` | Pending |

### Phase 5: Testing

| Step | Task | Description | Status |
|------|------|-------------|--------|
| 5.1 | Unit tests for merger | Test configuration merging | Pending |
| 5.2 | Unit tests for CLI | Test all CLI commands | Pending |
| 5.3 | Integration test | Test full workflow in test repo | Pending |
| 5.4 | E2E test | Test in real GitHub repo | Pending |
| 5.5 | Network failure test | Test retry and fallback | Pending |
| 5.6 | Overlay test | Test all overlays remotely | Pending |

### Phase 6: Release

| Step | Task | Description | Status |
|------|------|-------------|--------|
| 6.1 | Version bump | Update VERSION to 3.0.0 | Pending |
| 6.2 | Update CHANGELOG | Document v3.0.0 changes | Pending |
| 6.3 | Create git tag | `git tag v3.0.0` | Pending |
| 6.4 | Publish NPM package | `npm publish` | Pending |
| 6.5 | Create GitHub release | With release notes | Pending |

---

## Technical Details

### Configuration Merge Algorithm

```javascript
function mergeConfig(foundationDefaults, userConfig) {
  const result = deepClone(foundationDefaults);
  
  for (const key of Object.keys(userConfig)) {
    if (isObject(userConfig[key]) && isObject(result[key])) {
      result[key] = mergeConfig(result[key], userConfig[key]);
    } else {
      result[key] = userConfig[key];
    }
  }
  
  return result;
}
```

### OpenCode Configuration Generation

The `opencode.jsonc` file must be generated because OpenCode requires it at the project root.

**Generation Process**:
```javascript
async function generateOpenCodeConfig(foundationDir, userConfig, projectDir) {
  // 1. Load foundation template
  const template = await loadJSON(path.join(foundationDir, '.amazing-team/opencode.template.jsonc'));
  
  // 2. Apply user overrides
  const config = {
    ...template,
    instructions: ['AGENTS.md', ...(userConfig.additionalInstructions || [])],
    model: userConfig.model || template.model,
    permission: userConfig.permission || template.permission,
  };
  
  // 3. Resolve skill paths to foundation directory
  for (const [name, skill] of Object.entries(config.skills)) {
    skill.path = path.join(foundationDir, skill.path);
  }
  
  // 4. Write to project root
  await writeJSON(path.join(projectDir, 'opencode.jsonc'), config);
}
```

### Path Resolution

Skills and commands reference relative paths. These must be resolved at runtime:

```javascript
class PathResolver {
  constructor(foundationDir, projectDir) {
    this.foundationDir = foundationDir;
    this.projectDir = projectDir;
  }
  
  resolveSkillPath(relativePath) {
    // Skills are in foundation
    return path.join(this.foundationDir, relativePath);
  }
  
  resolveMemoryPath(role) {
    // Memory is in user project (runtime state)
    return path.join(this.projectDir, '.amazing-team/memory', role);
  }
  
  resolveTaskPath(taskId) {
    // Tasks are in user project
    return path.join(this.projectDir, 'tasks', `issue-${taskId}`);
  }
}
```

### Runtime Directory Initialization

User project must have certain directories created:

```javascript
async function initializeRuntimeDirectories(projectDir) {
  const dirs = [
    '.amazing-team/memory/planner',
    '.amazing-team/memory/architect',
    '.amazing-team/memory/developer',
    '.amazing-team/memory/qa',
    '.amazing-team/memory/reviewer',
    '.amazing-team/memory/triage',
    '.amazing-team/memory/ci-analyst',
    '.amazing-team/memory/failures',
    'tasks/_template',
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(path.join(projectDir, dir), { recursive: true });
  }
}
```

### Version Resolution

```
User specifies: "2.2.0"
    │
    ▼
Check NPM registry or GitHub releases
    │
    ▼
Download tarball:
  https://registry.npmjs.org/amazing-team-foundation/-/amazing-team-foundation-2.2.0.tgz
  OR
  https://github.com/org/amazing-team-foundation/archive/v2.2.0.tar.gz
    │
    ▼
Extract to temporary directory
    │
    ▼
Merge with user config
```

### Local Development Mode

For users who want to use OpenCode locally:

```bash
# Download foundation to local directory
npx amazing-team-foundation local

# Creates:
.amazing-team-local/
├── .amazing-team/
├── .opencode/
├── AGENTS.md
└── ...

# User's opencode.jsonc references local files:
{
  "instructions": [".amazing-team-local/AGENTS.md"],
  "skills": {
    "test-first-feature-dev": {
      "path": ".amazing-team-local/.opencode/skills/test-first-feature-dev/SKILL.md"
    }
  }
}
```

---

## Backward Compatibility

### v2.x Projects

Existing projects that have foundation files committed can:

1. **Continue as-is**: No changes required
2. **Migrate to v3**: Run migration script

```bash
# Migration script
npx amazing-team-foundation migrate

# This will:
# 1. Extract user-specific configurations
# 2. Create amazing-team.config.yaml
# 3. Update .github/workflows/amazing-team.yml
# 4. Add .amazing-team/ to .gitignore
# 5. Remove foundation files from git tracking
```

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Network failure during download | CI fails | Medium | Cache foundation in action; retry logic; fallback to GitHub releases |
| Breaking changes in new version | User workflow breaks | Low | Semantic versioning; changelog; upgrade guide |
| User config incompatible with new version | Merge conflicts | Low | Validation; error messages; migration guide |
| OpenCode can't find remote files | Local dev broken | Medium | `amazing-team local` command downloads for local use |
| NPM registry downtime | CI fails | Low | Fallback to GitHub releases |
| User deletes `opencode.jsonc` | Local dev breaks | Medium | `amazing-team validate` catches this |
| Git conflicts in workflow file | Upgrade fails | Low | CLI handles conflicts gracefully |
| Foundation security vulnerability | All projects affected | Low | Automated security scanning |
| Missing runtime directories | Action fails | Medium | Automatic directory initialization |

### Error Recovery Flow

```
Action Execution:
    │
    ▼
1. Pre-flight checks
   - Validate config exists
   - Check network connectivity
   - Verify required secrets
    │
    ▼ (on error: fail with clear message)
2. Download foundation
   - Try NPM first
   - Retry 3 times with backoff
   - Fallback to GitHub releases
    │
    ▼ (on error: use cached version if available)
3. Verify download
   - Check file integrity
   - Validate VERSION matches expected
    │
    ▼ (on error: fail with diagnostic info)
4. Initialize directories
   - Create .amazing-team/memory/*
   - Create tasks/_template
    │
    ▼
5. Merge configs
   - Load user config
   - Merge with foundation defaults
   - Validate result
    │
    ▼ (on error: show specific validation errors)
6. Generate opencode.jsonc
   - Resolve all paths
   - Write to project root
    │
    ▼
7. Ready for OpenCode
```

---

## Success Criteria

1. User project has < 5 amazing-team related files committed
2. Upgrade is a single command or version change
3. Local development works without network
4. CI workflow runs successfully with remote foundation
5. Backward compatible with v2.x projects

---

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Foundation Preparation | 2-3 days | None |
| Phase 2: CLI Tool | 3-4 days | Phase 1 |
| Phase 3: GitHub Action | 2-3 days | Phase 1, 2 |
| Phase 4: Documentation | 1-2 days | Phase 1-3 |
| Phase 5: Testing | 2-3 days | Phase 1-4 |
| Phase 6: Release | 1 day | Phase 1-5 |

**Total Estimated**: 11-16 days

---

## Open Questions (Resolved)

### Question 1: Action Hosting

**Options**:
- A: Separate repo (cleaner, independent versioning)
- B: Included in foundation (simpler, single repo)

**Decision**: **Option B** - Included in foundation

**Rationale**: Simpler for users (single source of truth), easier versioning (one version number), simpler release process.

---

### Question 2: Version Source

**Options**:
- A: NPM (familiar, reliable)
- B: GitHub releases (no NPM account needed)

**Decision**: **Support both, prefer NPM**

**Rationale**: NPM is standard for JS packages and has built-in caching. GitHub releases as fallback for edge cases (NPM downtime, private registries).

---

### Question 3: Overlay Handling

**Options**:
- A: Specify in action config
- B: Include in amazing-team.config.yaml

**Decision**: **Option B** - Include in config file

**Rationale**: Consistent with other settings, version controlled with project, easier to understand.

```yaml
# amazing-team.config.yaml
overlay: "web-fullstack"  # Applies overlay on top of base foundation
```

---

## Next Steps

1. ~~Review this design document~~ ✅ Complete
2. ~~Resolve open questions~~ ✅ Complete
3. Begin Phase 1 implementation
4. Create test repository for validation
5. Iterate based on testing results