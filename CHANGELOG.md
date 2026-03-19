# Changelog

All notable changes to the AmazingTeam will be documented in this file.

The format is based on [Keep a Changelog](https://keepchangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.11] - 2026-03-19

### Added

- Added `github_action` configuration option in `amazingteam.config.yaml`
- Added interactive prompt for GitHub Action during `amazingteam init`
- Default: `Burburton/amazingteam-action@v1`
- Users can specify their own fork if needed

### Changed

- Workflow template now uses the configured GitHub Action
- Updated `templates/amazingteam.yml` with clearer documentation
- Removed hardcoded `AMAZINGTEAM_API_KEY` from workflow (users configure via OpenCode)

### Note for Maintainers

When releasing a new version, remember to also update:
1. `Burburton/amazingteam-action` repository
2. Tag new version (e.g., `v3.0.11`)
3. Update default tag reference if needed

---

## [3.0.10] - 2026-03-19

### Changed

- Simplified init command - no longer prompts for LLM configuration
- opencode.jsonc now uses minimal template - users configure via OpenCode's `/connect` and `/models` commands
- Removed `--llm-model`, `--llm-small-model`, `--llm-base-url` options from init
- Removed LLM-related fields from amazingteam.config.yaml template
- Updated next steps to guide users to OpenCode's built-in provider configuration

### Why

- OpenCode has excellent built-in provider configuration via `/connect` and `/models`
- Each user's needs are different - better to let them configure via OpenCode UI
- Reduces complexity and potential for misconfiguration

---

## [3.0.9] - 2026-03-19

### Fixed

- Fixed model configuration to use OpenCode built-in providers correctly
- Updated model suggestions to use supported formats:
  - `openai/gpt-4o`, `anthropic/claude-sonnet-4`, `deepseek/deepseek-chat`, `zai/glm-4.7`
- Added custom provider configuration generation when `--llm-base-url` is provided
- Fixed opencode.jsonc schema URL to `https://opencode.ai/config.json`

### Changed

- Updated init prompts to clarify built-in vs custom provider usage
- For custom providers (e.g., Alibaba Bailian), users now need to:
  1. Enter model name (e.g., `bailian/glm-5`)
  2. Enter base URL (e.g., `https://bailian.aliyuncs.com/v1`)

---

## [3.0.8] - 2026-03-19

### Added

- Added `--llm-base-url` option for custom API endpoints
- Added interactive base_url configuration during init
- Added `--llm-model` and `--llm-small-model` CLI options
- Added `--commit-mode` CLI option

### Changed

- Renamed `.ai-team/` to `.amazing-team/` for consistency with project name
- Updated all documentation and examples

---

## [3.0.7] - 2026-03-19

### Changed

- Simplified LLM configuration:
  - Removed `llm.provider` field from config (no longer needed)
  - Users now input model names directly (e.g., `bailian-coding-plan/glm-5`)
  - Unified API key environment variable: `AMAZINGTEAM_API_KEY`
- Fixed compilation error in init.cjs (removed undefined `llmProvider` variable)

### Fixed

- Unified directory naming to `.amazing-team/` everywhere:
  - User project structure: `.amazing-team/memory/`
  - Cache directories: `.amazing-team-cache/`, `.amazing-team-local/`
  - Updated all presets, CLI commands, action modules, and tests
  - Ensures consistency with foundation package structure

---

## [3.0.6] - 2026-03-19

### Fixed

- 修复 opencode.jsonc 模板格式问题：
  - 移除不支持的 `default_agent` 字段
  - 移除不支持的 `providers` 字段（OpenCode 通过环境变量配置 API key）
  - 修正 schema URL 为 `https://opencode.ai/schema.json`
- 用户需通过环境变量配置 API key：`export BAILIAN_API_KEY=xxx`

---

## [3.0.5] - 2026-03-19

### Added

- README: 添加"安装后用户项目结构"说明
- README: 添加"需要提交的文件"表格
- README: 添加".gitignore 配置"说明
- README: 添加版本历史 3.0.3, 3.0.4

---

## [3.0.4] - 2026-03-19

### Fixed

- Add `node_modules/` to gitignore template (was missing)
- Update init command to prompt user to run `npm install amazingteam --save-dev`

---

## [3.0.3] - 2026-03-19

### Fixed

- Add `dist/` to package.json files array (critical fix - npm package was broken without it)
- Update `templates/gitignore` to use new naming (amazing-team → amazingteam)

---

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
- Package renamed from `amazing-team-foundation` to `amazingteam`
- CLI command: `amazing-team` → `amazingteam`
- Config file: `amazing-team.config.yaml` → `amazingteam.config.yaml`
- Workflow template: `amazing-team.yml` → `amazingteam.yml`
- Repository: `your-org/amazing-team-foundation` → `Burburton/amazingteam`

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
  - `.amazing-team/memory/` - Runtime state (preserved)
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
- Custom skills should be placed in `.amazing-team/skills/` (they will be merged)
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
- `.amazing-team/agents/planner.md` - Added workflow orchestration section
- `.amazing-team/agents/developer.md` - Added git identity, PR rules
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
- `.amazing-team/memory/planner/` - Decomposition notes and flow rules
- `.amazing-team/memory/triage/` - Classification heuristics and debug notes
- `.amazing-team/memory/ci-analyst/` - Failure patterns and runbook references
- `.amazing-team/memory/failures/` - Shared failure library

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
- `.amazing-team/opencode.template.jsonc` - Updated with all v2 agents, skills, commands
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
   - `.amazing-team/memory/planner/`
   - `.amazing-team/memory/triage/`
   - `.amazing-team/memory/ci-analyst/`
   - `.amazing-team/memory/failures/`
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