# Changelog

All notable changes to the AmazingTeam will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.2] - 2026-03-18

### Added

#### Workflow Commit Mode Configuration
- `workflow.commit_mode` option: `pr` (default) or `direct`
- `workflow.pr.auto_merge`: Auto-merge PR if CI passes
- `workflow.pr.require_review`: Require human review before merge
- `workflow.pr.reviewers`: Default reviewer list
- `workflow.direct.require_ci_pass`: Require CI pass before direct commit
- Interactive workflow configuration during `amazingteam init`
- Documentation in `docs/config-reference.md` and `AGENTS.md`

---

## [3.0.1] - 2026-03-17

### Added

#### Custom LLM Provider Support
- `llm` configuration section in `amazingteam.config.yaml`
- Support for custom providers: OpenAI, Anthropic, Bailian, DeepSeek, Moonshot, Zhipu
- Custom `base_url` for private endpoints
- `api_key_env` for secure API key management via environment variables
- Interactive LLM configuration during `amazingteam init`

### Changed

#### Renaming
- Package renamed from `ai-team-foundation` to `amazingteam`
- CLI command: `ai-team` → `amazingteam`
- Config file: `ai-team.config.yaml` → `amazingteam.config.yaml`
- Workflow template: `ai-team.yml` → `amazingteam.yml`
- Repository: `your-org/ai-team-foundation` → `Burburton/amazingteam`

All references updated across codebase.

---

## [3.0.0] - 2026-03-17

### Added

#### Remote Foundation Loading
- Foundation loaded at runtime from NPM/GitHub releases
- User projects only need 2-3 config files instead of 50+ files
- One-command upgrades: `npx amazingteam upgrade`
- Explicit version control in workflow files
- Automatic caching for faster CI runs

#### GitHub Action
- `action/` - Complete GitHub Action implementation
- `action/lib/merger.js` - Configuration merge with deep merge support
- `action/lib/path-resolver.js` - Cross-platform path resolution
- `action/lib/validator.js` - JSON Schema validation
- `action/lib/downloader.js` - NPM/GitHub download with retry and fallback
- `action/lib/setup.js` - Runtime directory initialization
- `action/action.yml` - Action manifest with inputs/outputs
- `action/index.js` - Main action entry point

#### CLI Tool
- `cli/amazingteam.cjs` - Complete CLI with command parsing
- `cli/commands/init.cjs` - Interactive project initialization
- `cli/commands/version.cjs` - Version display
- `cli/commands/check-update.cjs` - Check for updates from NPM/GitHub
- `cli/commands/upgrade.cjs` - Upgrade to new versions
- `cli/commands/local.cjs` - Download foundation for local development
- `cli/commands/validate.cjs` - Configuration validation
- `cli/commands/migrate.cjs` - Migrate from v2 to v3
- `cli/commands/status.cjs` - Project status display

#### Configuration System
- `presets/` - Language presets (default, typescript, python, go)
- `templates/` - Config templates (opencode.jsonc, amazingteam.yml, gitignore)
- `schemas/config.schema.json` - JSON Schema for configuration validation
- `amazingteam.config.yaml` - User configuration file

#### Documentation
- `docs/migration-to-v3.md` - Step-by-step migration guide
- `docs/config-reference.md` - Complete configuration reference
- `docs/quick-start-v3.md` - Quick start guide for v3

#### Test Suite
- `action/__tests__/` - Unit tests for action modules
- `cli/__tests__/cli.test.js` - CLI command tests
- `tests/integration.test.js` - Full workflow integration tests
- `tests/error-scenarios.test.js` - Error handling tests
- `tests/overlay.test.js` - Overlay configuration tests

### Changed

#### Project Structure
- User projects now only contain:
  - `.github/workflows/amazingteam.yml` - Workflow file
  - `amazingteam.config.yaml` - User configuration
  - `opencode.jsonc` - Generated config (auto-generated)
  - `.ai-team/memory/` - Runtime state (preserved)
  - `tasks/` - Task history (preserved)

#### Upgrade Process
- Before: Manual copy/merge of 50+ files
- After: Single command `npx amazingteam upgrade`

#### Version Management
- Before: Hard to track which version is being used
- After: Explicit version in workflow file: `uses: your-org/amazingteam-action@v3.0.0`

### Migration from v2 to v3

1. **Backup your project**:
   ```bash
   git checkout -b backup-before-v3-migration
   git add -A && git commit -m "backup"
   git checkout main
   ```

2. **Run migration**:
   ```bash
   npx amazingteam migrate
   ```

3. **Review generated files**:
   - `amazingteam.config.yaml` - Your extracted configuration
   - `.github/workflows/amazingteam.yml` - Updated workflow

4. **Commit and test**:
   ```bash
   git add -A
   git commit -m "chore: migrate to v3"
   npx amazingteam local
   npx amazingteam validate
   ```

See [Migration Guide](./docs/migration-to-v3.md) for detailed instructions.

### Breaking Changes

- Skills and commands are now loaded from foundation at runtime
- Custom skills should be placed in `.ai-team/skills/` (they will be merged)
- Custom AGENTS.md will override foundation's AGENTS.md
- Presets are now built-in, specify by name in config

---

## [2.2.0] - 2026-03-15

### Added

#### Blocker Handling
- Automatic blocker detection and diagnosis during workflow execution
- `/resume` command to resume workflow after blocker resolution
- Blocker resolution paths: auto-fix, sub-issue (AI), sub-issue (human)
- Human notification for blockers requiring manual intervention

#### CI Analyst Enhancements
- Blocker diagnosis responsibilities
- Decision matrix for resolution path selection
- Pattern documentation for recurring blockers

### Changed

#### Workflow
- `/auto` command now handles blockers gracefully
- Planner dispatches to CI Analyst for blocker diagnosis
- Workflow state preservation during blocker resolution

#### Documentation
- `AGENTS.md` - Added blocker handling flow diagram
- `docs/blocker_resolution_design.md` - Comprehensive blocker handling design

## [2.1.0] - 2026-03-15

### Added

#### Full Automation
- `/auto` command: Complete workflow from issue to PR in one command
- Automatic GitHub sub-issue creation for complex tasks
- Dependency-aware subtask scheduling
- Git identity configuration: `opencode-bot`

#### GitHub Workflow
- `contents: write` permission for PR creation
- `pull-requests: write` permission
- `issues: write` permission
- Automatic git identity configuration in workflow

### Changed

#### Workflow
- Planner acts as coordinator, dispatches to specialist roles
- No user confirmation needed after triage
- Developer agent: explicit PR creation rules, no direct commits to main

#### Agent Definitions
- `.ai-team/agents/planner.md` - Added workflow orchestration section
- `.ai-team/agents/developer.md` - Added git identity, PR rules
- `.opencode/agents/developer.md` - Added permissions for PR creation

## [2.0.0] - 2026-03-14

### Added

#### New Agents
- `planner.md` - Task decomposition and workflow orchestration
- `triage.md` - Issue classification and first-pass debug analysis
- `ci-analyst.md` - CI failure investigation specialist

#### New Skills
- `task-breakdown-and-dispatch` - Systematic task decomposition
- `issue-triage` - Issue classification and prioritization
- `ci-failure-analysis` - CI pipeline failure investigation
- `regression-checklist` - Comprehensive regression testing
- `release-readiness-check` - Pre-release validation

#### New Commands
- `/ci-analyze` - Trigger CI failure analysis
- `/release-check` - Trigger release readiness check

#### New Memory Areas
- `.ai-team/memory/planner/` - Decomposition notes and flow rules
- `.ai-team/memory/triage/` - Classification heuristics and debug notes
- `.ai-team/memory/ci-analyst/` - Failure patterns and runbook references
- `.ai-team/memory/failures/` - Shared failure library

#### New Documentation Zones
- `docs/patterns/` - Reusable implementation patterns
- `docs/releases/` - Release documentation
- `docs/runbooks/ci/` - CI operational runbooks

#### Task System
- `tasks/_template/task.yaml` - Task manifest template
- `tasks/_template/release.md` - Release checklist template
- Task state machine with 10 states
- Dependency tracking support

#### Bootstrap Capability
- `scripts/validate_foundation.cjs` - Foundation integrity validation
- File classification policy (Class A/B/C)
- Approval gates for safe operations

### Changed

#### Configuration
- `.ai-team/opencode.template.jsonc` - Updated with all v2 agents, skills, commands
- `AGENTS.md` - Added v2 roles, task system, governance model
- Memory permissions matrix expanded to 7 roles

#### CLI
- `cli/amazingteam.cjs` - Version bumped to 2.0.0
- Added new memory directories for v2 roles
- Updated workflow definitions

### Migration Notes

#### From v1 to v2

1. **Run upgrade script**:
   ```bash
   node scripts/upgrade_foundation.cjs
   ```

2. **New directories will be created**:
   - `.ai-team/memory/planner/`
   - `.ai-team/memory/triage/`
   - `.ai-team/memory/ci-analyst/`
   - `.ai-team/memory/failures/`
   - `docs/patterns/`
   - `docs/releases/`
   - `docs/runbooks/ci/`
   - `tasks/_template/`

3. **Configuration updates needed**:
   - Review `opencode.jsonc` for new agents
   - Update `AGENTS.md` with v2 content
   - Check memory permissions matrix

4. **Protected files** (manual review required):
   - `docs/architecture/`
   - `docs/decisions/`
   - Your custom `AGENTS.md` additions

---

## [1.0.0] - 2024-01-01

### Added
- Initial release
- 4 core agents: Architect, Developer, QA, Reviewer
- 4 skills: repo-architecture-reader, bugfix-playbook, test-first-feature-dev, safe-refactor-checklist
- 4 commands: /design, /implement, /test, /review
- 3-layer memory architecture
- GitHub Actions integration
- CLI tool for init/upgrade/status