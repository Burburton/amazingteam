# AI Team v3.0.0 Implementation Checklist

## Overview

This checklist tracks the implementation of remote foundation loading feature (v3.0.0).

**Branch**: `feature/remote-foundation-loading`

---

## Phase 1: Foundation Preparation (10 tasks) ✅ COMPLETE

### 1.1 Presets Directory
- [x] Create `presets/` directory
- [x] Create `presets/default.yaml` - base configuration
- [x] Create `presets/typescript.yaml` - TypeScript/Node defaults
- [x] Create `presets/python.yaml` - Python defaults
- [x] Create `presets/go.yaml` - Go defaults

### 1.2 Templates Directory
- [x] Create `templates/` directory
- [x] Create `templates/opencode.jsonc` - OpenCode config template
- [x] Create `templates/ai-team.yml` - GitHub workflow template
- [x] Create `templates/gitignore` - .gitignore additions template

### 1.3 Schemas
- [x] Create `schemas/` directory
- [x] Create `schemas/config.schema.json` - JSON Schema for ai-team.config.yaml

### 1.4 Action Modules
- [x] Create `action/lib/merger.js` - configuration merge logic
- [x] Create `action/lib/path-resolver.js` - runtime path resolution
- [x] Create `action/lib/validator.js` - config validation
- [x] Create `action/lib/downloader.js` - NPM/GitHub download
- [x] Create `action/lib/setup.js` - runtime directory initialization

### 1.5 Action Entry Point
- [x] Create `action/action.yml` - action manifest
- [x] Create `action/index.js` - main entry point

### 1.6 Package Configuration
- [x] Update `package.json` files array with new directories
- [x] Add new dependencies (@actions/core, @actions/github)

---

## Phase 2: CLI Tool (8 commands) ✅ COMPLETE

### 2.1 CLI Entry Point
- [x] Create `cli/ai-team.cjs` - main CLI entry
- [x] Add command parsing logic
- [x] Add help text and version display

### 2.2 Init Command
- [x] Create `cli/commands/init.cjs`
- [x] Implement interactive prompts
- [x] Generate `ai-team.config.yaml`
- [x] Generate `.github/workflows/ai-team.yml`
- [x] Generate `opencode.jsonc`
- [x] Create `.ai-team/memory/` directories
- [x] Create `tasks/_template/` directory
- [x] Update `.gitignore`

### 2.3 Version Command
- [x] Create `cli/commands/version.cjs`
- [x] Read version from workflow file
- [x] Display foundation version info

### 2.4 Check-Update Command
- [x] Create `cli/commands/check-update.cjs`
- [x] Query NPM registry for latest version
- [x] Query GitHub releases as fallback
- [x] Display changelog summary

### 2.5 Upgrade Command
- [x] Create `cli/commands/upgrade.cjs`
- [x] Update workflow file version reference
- [x] Handle breaking changes warning
- [x] Support `--to x.x.x` flag

### 2.6 Local Command
- [x] Create `cli/commands/local.cjs`
- [x] Download foundation to `.ai-team-local/`
- [x] Generate local `opencode.jsonc`
- [x] Support `--from /path` for offline use
- [x] Implement local caching (`~/.ai-team-cache/`)

### 2.7 Validate Command
- [x] Create `cli/commands/validate.cjs`
- [x] Validate config against schema
- [x] Check required files exist
- [x] Display helpful error messages

### 2.8 Migrate Command
- [x] Create `cli/commands/migrate.cjs`
- [x] Detect v2.x project structure
- [x] Extract user customizations
- [x] Create v3 config files
- [x] Update git tracking

### 2.9 Status Command (bonus)
- [x] Create `cli/commands/status.cjs`
- [x] Display project configuration
- [x] Show version information
- [x] Show memory and task statistics

---

## Phase 3: GitHub Action (4 tasks) ✅ COMPLETE

### 3.1 Action Manifest
- [x] Create `action/action.yml` with inputs/outputs
- [x] Define `version`, `config`, `overlay` inputs
- [x] Define setup status output

### 3.2 Main Action Logic
- [x] Implement download with retry
- [x] Implement fallback to GitHub releases
- [x] Implement config merge
- [x] Implement directory initialization
- [x] Implement opencode.jsonc generation

### 3.3 Workflow Template
- [x] Create final `templates/ai-team.yml`
- [x] Include all necessary steps
- [x] Add comments for customization

### 3.4 Action Tests
- [x] Create `action/__tests__/` directory
- [x] Test merger module
- [x] Test path resolver
- [x] Test validator
- [x] Test downloader (mocked)

---

## Phase 4: Documentation (5 documents) ✅ COMPLETE

### 4.1 Migration Guide
- [x] Create `docs/migration-to-v3.md`
- [x] Document v2 vs v3 differences
- [x] Provide step-by-step migration
- [x] Include troubleshooting

### 4.2 README Update
- [x] Update main README.md
- [x] Add v3 installation section
- [x] Add v3 usage examples
- [x] Add comparison table

### 4.3 Quick-Start Guide
- [x] Review and finalize `docs/quick-start-v3.md`
- [x] Add screenshots if needed
- [x] Add FAQ section

### 4.4 Config Reference
- [x] Create `docs/config-reference.md`
- [x] Document all config fields
- [x] Provide examples for each field

### 4.5 AGENTS.md Review
- [x] Review for path references
- [x] Update if hardcoded paths found
- [x] Ensure v3 compatibility

---

## Phase 5: Testing (6 test scenarios) ✅ COMPLETE

### 5.1 Unit Tests
- [x] Test `merger.js` with various configs
- [x] Test `path-resolver.js` cross-platform
- [x] Test `validator.js` with valid/invalid configs
- [x] Test `downloader.js` (mocked network)

### 5.2 CLI Tests
- [x] Test `init` command
- [x] Test `upgrade` command
- [x] Test `local` command
- [x] Test `validate` command

### 5.3 Integration Test
- [x] Create test fixture project
- [x] Test full init → local → validate flow
- [x] Test upgrade flow

### 5.4 E2E Test
- [x] Create test GitHub repository (manual)
- [x] Test action execution (manual)
- [x] Test OpenCode integration (manual)

### 5.5 Error Scenario Tests
- [x] Test network failure recovery
- [x] Test invalid config handling
- [x] Test missing directories handling

### 5.6 Overlay Tests
- [x] Test `python-backend` overlay
- [x] Test `web-fullstack` overlay
- [x] Test custom overlay path

---

## Phase 6: Release (5 tasks)

### 6.1 Pre-Release
- [ ] Version bump to `3.0.0-beta.1`
- [ ] Test beta release
- [ ] Gather feedback
- [ ] Fix reported issues

### 6.2 Final Release
- [ ] Version bump to `3.0.0`
- [ ] Update `VERSION` file
- [ ] Update `CHANGELOG.md`
- [ ] Create git tag `v3.0.0`
- [ ] Publish to NPM
- [ ] Create GitHub release
- [ ] Announce release

---

## Progress Tracking

| Phase | Total | Done | Progress |
|-------|-------|------|----------|
| 1: Foundation Prep | 16 | 16 | 100% ✅ |
| 2: CLI Tool | 23 | 23 | 100% ✅ |
| 3: GitHub Action | 12 | 12 | 100% ✅ |
| 4: Documentation | 12 | 12 | 100% ✅ |
| 5: Testing | 14 | 14 | 100% ✅ |
| 6: Release | 9 | 0 | 0% |
| **Total** | **86** | **77** | **90%** |

---

## Dependencies

```
Phase 1 (Foundation Prep)
    │
    ├── Phase 2 (CLI) ─────────────┐
    │                              │
    └── Phase 3 (Action)           │
                                 │
    ┌─────────────────────────────┘
    │
    ▼
Phase 4 (Documentation)
    │
    ▼
Phase 5 (Testing)
    │
    ▼
Phase 6 (Release)
```

---

## Notes

- Each task should be checked off with completion date
- Blockers should be documented in comments
- Design decisions should be recorded
- Breaking changes should be highlighted