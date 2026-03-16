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

## Phase 2: CLI Tool (8 commands)

### 2.1 CLI Entry Point
- [ ] Create `cli/ai-team.cjs` - main CLI entry
- [ ] Add command parsing logic
- [ ] Add help text and version display

### 2.2 Init Command
- [ ] Create `cli/commands/init.cjs`
- [ ] Implement interactive prompts
- [ ] Generate `ai-team.config.yaml`
- [ ] Generate `.github/workflows/ai-team.yml`
- [ ] Generate `opencode.jsonc`
- [ ] Create `.ai-team/memory/` directories
- [ ] Create `tasks/_template/` directory
- [ ] Update `.gitignore`

### 2.3 Version Command
- [ ] Create `cli/commands/version.cjs`
- [ ] Read version from workflow file
- [ ] Display foundation version info

### 2.4 Check-Update Command
- [ ] Create `cli/commands/check-update.cjs`
- [ ] Query NPM registry for latest version
- [ ] Query GitHub releases as fallback
- [ ] Display changelog summary

### 2.5 Upgrade Command
- [ ] Create `cli/commands/upgrade.cjs`
- [ ] Update workflow file version reference
- [ ] Handle breaking changes warning
- [ ] Support `--to x.x.x` flag

### 2.6 Local Command
- [ ] Create `cli/commands/local.cjs`
- [ ] Download foundation to `.ai-team-local/`
- [ ] Generate local `opencode.jsonc`
- [ ] Support `--from /path` for offline use
- [ ] Implement local caching (`~/.ai-team-cache/`)

### 2.7 Validate Command
- [ ] Create `cli/commands/validate.cjs`
- [ ] Validate config against schema
- [ ] Check required files exist
- [ ] Display helpful error messages

### 2.8 Migrate Command
- [ ] Create `cli/commands/migrate.cjs`
- [ ] Detect v2.x project structure
- [ ] Extract user customizations
- [ ] Create v3 config files
- [ ] Update git tracking

---

## Phase 3: GitHub Action (4 tasks)

### 3.1 Action Manifest
- [ ] Create `action/action.yml` with inputs/outputs
- [ ] Define `version`, `config`, `overlay` inputs
- [ ] Define setup status output

### 3.2 Main Action Logic
- [ ] Implement download with retry
- [ ] Implement fallback to GitHub releases
- [ ] Implement config merge
- [ ] Implement directory initialization
- [ ] Implement opencode.jsonc generation

### 3.3 Workflow Template
- [ ] Create final `templates/ai-team.yml`
- [ ] Include all necessary steps
- [ ] Add comments for customization

### 3.4 Action Tests
- [ ] Create `action/__tests__/` directory
- [ ] Test merger module
- [ ] Test path resolver
- [ ] Test validator
- [ ] Test downloader (mocked)

---

## Phase 4: Documentation (5 documents)

### 4.1 Migration Guide
- [ ] Create `docs/migration-to-v3.md`
- [ ] Document v2 vs v3 differences
- [ ] Provide step-by-step migration
- [ ] Include troubleshooting

### 4.2 README Update
- [ ] Update main README.md
- [ ] Add v3 installation section
- [ ] Add v3 usage examples
- [ ] Add comparison table

### 4.3 Quick-Start Guide
- [ ] Review and finalize `docs/quick-start-v3.md`
- [ ] Add screenshots if needed
- [ ] Add FAQ section

### 4.4 Config Reference
- [ ] Create `docs/config-reference.md`
- [ ] Document all config fields
- [ ] Provide examples for each field

### 4.5 AGENTS.md Review
- [ ] Review for path references
- [ ] Update if hardcoded paths found
- [ ] Ensure v3 compatibility

---

## Phase 5: Testing (6 test scenarios)

### 5.1 Unit Tests
- [ ] Test `merger.js` with various configs
- [ ] Test `path-resolver.js` cross-platform
- [ ] Test `validator.js` with valid/invalid configs
- [ ] Test `downloader.js` (mocked network)

### 5.2 CLI Tests
- [ ] Test `init` command
- [ ] Test `upgrade` command
- [ ] Test `local` command
- [ ] Test `validate` command

### 5.3 Integration Test
- [ ] Create test fixture project
- [ ] Test full init → local → validate flow
- [ ] Test upgrade flow

### 5.4 E2E Test
- [ ] Create test GitHub repository
- [ ] Test action execution
- [ ] Test OpenCode integration

### 5.5 Error Scenario Tests
- [ ] Test network failure recovery
- [ ] Test invalid config handling
- [ ] Test missing directories handling

### 5.6 Overlay Tests
- [ ] Test `python-backend` overlay
- [ ] Test `web-fullstack` overlay
- [ ] Test custom overlay path

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
| 2: CLI Tool | 20 | 0 | 0% |
| 3: GitHub Action | 12 | 0 | 0% |
| 4: Documentation | 12 | 0 | 0% |
| 5: Testing | 14 | 0 | 0% |
| 6: Release | 9 | 0 | 0% |
| **Total** | **83** | **16** | **19%** |

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