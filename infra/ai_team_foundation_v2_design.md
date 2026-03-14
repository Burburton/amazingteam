
# AI Team Foundation v2
## Complete Design Specification

This document defines the full v2 design of a reusable `ai-team-foundation` repository.

The purpose of this repository is to provide a portable AI engineering team base that can be reused across future project repositories.

This foundation is designed to support:

- OpenCode-based AI engineering execution
- GitHub-based task management and review workflow
- reusable project scaffolding
- layered memory isolation
- task orchestration
- CI failure analysis
- knowledge accumulation
- controlled governance

This repository is not a business project repository.
It is the reusable AI team product base.

---

# 1. Repository Purpose

The `ai-team-foundation` repository should act as:

- a reusable AI development operating base
- a template/scaffold source for future projects
- a source of shared AI roles, skills, commands, workflows, and governance rules
- a system that can be copied or initialized into many different project repositories

It should not contain:

- real business source code
- project-specific long-term memory
- project-specific active tasks
- project-specific architecture decisions

Those belong in downstream project repositories.

---

# 2. Design Goals

The v2 foundation is built around these goals:

1. Reusable
2. Project-agnostic
3. Role-stable
4. Execution-oriented
5. Memory-aware
6. Governed
7. Upgradeable

---

# 3. Repository Structure

Recommended top-level layout:

```text
ai-team-foundation/
├─ base/
│  ├─ .github/
│  │  ├─ workflows/
│  │  │  ├─ opencode.yml
│  │  │  ├─ ci.yml
│  │  │  ├─ pr-check.yml
│  │  │  └─ nightly-ai-maintenance.yml
│  │  ├─ ISSUE_TEMPLATE/
│  │  │  ├─ feature_request.md
│  │  │  ├─ bug_report.md
│  │  │  └─ tech_task.md
│  │  └─ pull_request_template.md
│  │
│  ├─ .opencode/
│  │  ├─ agents/
│  │  │  ├─ planner.md
│  │  │  ├─ architect.md
│  │  │  ├─ developer.md
│  │  │  ├─ qa.md
│  │  │  ├─ reviewer.md
│  │  │  ├─ triage.md
│  │  │  └─ ci-analyst.md
│  │  │
│  │  ├─ skills/
│  │  │  ├─ repo-architecture-reader/
│  │  │  ├─ task-breakdown-and-dispatch/
│  │  │  ├─ cpp-bugfix-playbook/
│  │  │  ├─ issue-triage/
│  │  │  ├─ ci-failure-analysis/
│  │  │  ├─ regression-checklist/
│  │  │  ├─ test-first-feature-dev/
│  │  │  ├─ safe-refactor-checklist/
│  │  │  ├─ performance-hotpath-review/
│  │  │  ├─ release-readiness-check/
│  │  │  └─ code-review-checklist/
│  │  │
│  │  ├─ commands/
│  │  │  ├─ triage.md
│  │  │  ├─ design.md
│  │  │  ├─ implement.md
│  │  │  ├─ test.md
│  │  │  ├─ review.md
│  │  │  ├─ ci-analyze.md
│  │  │  └─ release-check.md
│  │  │
│  │  ├─ memory/
│  │  │  ├─ architect/
│  │  │  ├─ developer/
│  │  │  ├─ qa/
│  │  │  ├─ reviewer/
│  │  │  ├─ planner/
│  │  │  ├─ triage/
│  │  │  ├─ ci-analyst/
│  │  │  └─ failures/
│  │  │
│  │  └─ opencode.jsonc
│  │
│  ├─ docs/
│  │  ├─ architecture/
│  │  ├─ decisions/
│  │  ├─ standards/
│  │  ├─ patterns/
│  │  ├─ releases/
│  │  └─ runbooks/
│  │     └─ ci/
│  │
│  ├─ tasks/
│  │  └─ _template/
│  │     ├─ task.yaml
│  │     ├─ analysis.md
│  │     ├─ design.md
│  │     ├─ implementation.md
│  │     ├─ validation.md
│  │     ├─ review.md
│  │     └─ release.md
│  │
│  └─ AGENTS.md
│
├─ overlays/
│  ├─ cpp-qt-desktop/
│  ├─ python-backend/
│  ├─ web-fullstack/
│  └─ ai-agent-product/
│
├─ scripts/
│  ├─ init_project.sh
│  ├─ sync_foundation.sh
│  ├─ upgrade_foundation.sh
│  └─ validate_foundation.sh
│
├─ docs/
│  ├─ how-to-use.md
│  ├─ architecture.md
│  ├─ memory-model.md
│  ├─ role-model.md
│  ├─ task-system.md
│  ├─ upgrade-policy.md
│  └─ versioning.md
│
├─ examples/
│  ├─ minimal-project/
│  └─ cpp-qt-project/
│
└─ VERSION
```

---

# 4. Core Concept

The foundation should be treated as a product.

Its outputs are:

- reusable AI team scaffolding
- reusable AI role definitions
- reusable skills
- reusable commands
- reusable governance model
- reusable workflow templates

The downstream project repositories are the actual working environments.

---

# 5. Separation Between Foundation and Project Repositories

## Foundation Repository Owns

- templates
- base role prompts
- generic skills
- generic commands
- generic memory layout
- generic workflow files
- generic issue and PR templates
- documentation about usage and upgrade policy
- optional technology overlays

## Project Repository Owns

- business code
- project-specific architecture
- project-specific decisions
- real tasks
- real issue-derived task memory
- real CI history
- project-specific validation commands
- project-specific AGENTS.md customizations

This separation is mandatory for long-term reuse.

---

# 6. Role Model

## 6.1 Core Roles

### Planner
Controls decomposition and workflow progression.

### Architect
Designs technical approach and impact boundaries.

### Developer
Implements approved changes.

### QA
Validates functionality and regression safety.

### Reviewer
Assesses correctness, maintainability, and hidden risk.

---

## 6.2 Specialist Roles

### Triage
Classifies work and performs first-pass debug analysis.

### CI Analyst
Investigates CI failure patterns and execution problems.

These specialist roles improve execution quality without polluting core roles.

---

# 7. Memory Model

The v2 memory model is layered.

## 7.1 Global Shared Knowledge

Stored mainly in:

- `AGENTS.md`
- `docs/architecture/`
- `docs/decisions/`
- `docs/standards/`
- `docs/runbooks/`

Purpose:
Store durable project truths.

Rule:
Must not be auto-written casually by AI.

---

## 7.2 Role Memory

Stored in:

- `.opencode/memory/{role}/`

Purpose:
Store role-specific operational context and repeated role-specific lessons.

Rule:
Each role owns its own memory.

---

## 7.3 Task Memory

Stored in downstream project repositories under:

- `tasks/issue-{id}/`

Purpose:
Contain temporary working context for individual tasks.

Rule:
May be created and updated automatically during execution.

---

## 7.4 Failure Library

Stored in:

- `.opencode/memory/failures/`

Purpose:
Store repeated failure patterns:
- flaky tests
- build failures
- infra problems
- recurring bug classes

Rule:
Shared operational memory, but not project truth.

---

# 8. Task System

The task system is one of the defining improvements in v2.

## 8.1 Task Manifest

Every task should have:

```yaml
id: issue-123
title: Improve device reconnect stability
type: feature
status: ready
priority: medium
owner_role: planner
depends_on: []
blocked_by: []
acceptance_criteria:
  - reconnect succeeds after transient disconnect
  - existing startup flow remains unchanged
risk_level: medium
module_scope:
  - network
  - session_manager
  - reconnect_policy
```

This is the machine-readable task contract.

---

## 8.2 Task States

Standard states:

- backlog
- ready
- in_analysis
- in_design
- in_implementation
- in_validation
- in_review
- release_candidate
- blocked
- done

These states make the AI team operational instead of conversational.

---

## 8.3 Task Template Files

Every task template should include:

- `task.yaml`
- `analysis.md`
- `design.md`
- `implementation.md`
- `validation.md`
- `review.md`
- `release.md`

---

# 9. Skills System

The foundation should ship with skills in three categories.

## 9.1 Understanding Skills
Examples:
- repo-architecture-reader

## 9.2 Execution Skills
Examples:
- task-breakdown-and-dispatch
- cpp-bugfix-playbook
- test-first-feature-dev
- safe-refactor-checklist

## 9.3 Validation Skills
Examples:
- regression-checklist
- ci-failure-analysis
- release-readiness-check
- code-review-checklist

Each skill should have:
- scope
- trigger conditions
- procedure
- output format
- guardrails

---

# 10. Commands System

The foundation should define reusable command intents.

Recommended commands:

- `triage`
- `design`
- `implement`
- `test`
- `review`
- `ci-analyze`
- `release-check`

These commands reduce prompt inconsistency across repositories.

---

# 11. Governance Model

The v2 foundation must include governance rules.

## 11.1 Change Scope Guard

Rules:
- bug fixes should not perform unrelated refactoring
- features should not redesign public interfaces without approval
- refactors should preserve behavior
- reviewers should not silently mutate implementation

---

## 11.2 Protected Knowledge Guard

AI should not directly modify durable truth areas without explicit approval:

- `docs/architecture/`
- `docs/decisions/`
- release policy
- standards docs

---

## 11.3 Human Approval Gate

Humans should approve:

- architecture changes
- merge to protected branches
- release operations
- changes to global truth
- major task decomposition if risk is high

---

# 12. Validation Architecture

The v2 foundation should encourage stronger delivery guarantees.

## 12.1 Build / Test / Lint Documentation

Downstream projects must define:

- build command
- test command
- lint command
- environment or platform-specific validation steps

This should be part of project-specific `AGENTS.md`.

---

## 12.2 Regression Discipline

Regression review should include:

- neighboring modules
- startup/shutdown paths if relevant
- error paths
- configuration compatibility
- performance regression risk
- test coverage gaps

---

## 12.3 CI Runbook

Foundation should provide placeholders and guidance for:

- common CI failure types
- flaky test policy
- secrets and permissions debugging
- workflow debugging

---

# 13. Release Model

The foundation should include a release gate concept.

## Release Candidate Requirements

Suggested checks:
- implementation complete
- validation complete
- review complete
- unresolved blocker absent
- risks documented
- release checklist completed if needed

This keeps the AI team focused on delivery quality.

---

# 14. Overlay Model

The foundation should support technology-specific overlays.

## Example Overlays

### `cpp-qt-desktop`
Adds:
- CMake build guidance
- Qt/QML conventions
- desktop-client validation rules
- multi-threading / IPC / networking patterns

### `python-backend`
Adds:
- pytest workflow
- API validation guidance
- backend service patterns

### `web-fullstack`
Adds:
- frontend/backend coordination patterns
- browser testing guidance
- API/UI integration patterns

### `ai-agent-product`
Adds:
- memory policy extensions
- tool orchestration guidance
- prompt architecture patterns

Overlays make the foundation reusable across tech stacks.

---

# 15. Script Model

The foundation should provide scripts for lifecycle management.

## `init_project.sh`
Purpose:
Initialize a new project repository from base + selected overlay.

## `sync_foundation.sh`
Purpose:
Copy or synchronize non-destructive template changes.

## `upgrade_foundation.sh`
Purpose:
Apply controlled upgrades to existing downstream repositories.

## `validate_foundation.sh`
Purpose:
Verify foundation consistency before publishing a new version.

---

# 16. Versioning

The foundation should have a `VERSION` file.

Purpose:
- track foundation version
- communicate upgrade compatibility
- support downstream upgrade planning

Recommended versioning approach:
- semantic versioning style for structure and policy changes

Examples:
- `1.0.0` = initial memory-isolated team template
- `2.0.0` = task-system and specialist-role upgrade
- `2.1.0` = new overlay, new skill, non-breaking governance refinement

---

# 17. Upgrade Policy

Upgrades should be categorized.

## Breaking Upgrades
Examples:
- change role names
- change task manifest format
- change memory directory model

## Non-Breaking Upgrades
Examples:
- add optional skills
- add new commands
- add docs templates
- improve examples

This policy should be documented in `docs/upgrade-policy.md`.

---

# 18. Example Foundation Lifecycle

## Step 1
Maintain `ai-team-foundation` as the product base.

## Step 2
Create a new project repository.

## Step 3
Run init script using selected overlay.

## Step 4
Customize project-specific `AGENTS.md`, docs, and build/test commands.

## Step 5
Use the AI team to develop the actual project.

## Step 6
When foundation improves, run controlled upgrade into the project repository.

This creates long-term reuse.

---

# 19. Recommended Default Policies

The foundation should encode these defaults:

- understand before editing
- prefer minimal safe changes
- explicit task states
- explicit dependency handling
- layered memory isolation
- no casual global memory writes
- strong regression awareness
- no release without validation and review

---

# 20. Minimal Viable v2

If you want to ship v2 incrementally, the minimum useful delta from v1 is:

- add Planner
- add Triage
- add CI Analyst
- add `task.yaml`
- add task state model
- add failure library
- add regression checklist
- add release gate docs

This is the smallest change set that makes v2 meaningfully stronger.

---

# 21. Success Criteria for v2

The foundation v2 is successful if downstream project repositories gain:

- better task execution stability
- better issue classification
- better CI diagnosis
- better validation discipline
- better memory reuse
- better governance
- safer long-term scaling

---

# 22. Final Summary

`ai-team-foundation v2` is a reusable AI engineering base that upgrades the original memory-isolated AI team into a more capable execution system.

Compared with v1, v2 adds:

- structured task orchestration
- specialist execution roles
- stronger validation
- reusable implementation knowledge
- failure memory
- release and governance control

This turns the AI team from a set of prompts into a portable development operating base for future projects.
