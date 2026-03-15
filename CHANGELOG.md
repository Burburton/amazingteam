# Changelog

All notable changes to the AI Team Foundation will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- `cli/ai-team.cjs` - Version bumped to 2.0.0
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