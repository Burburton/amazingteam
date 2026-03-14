
# AI Team Foundation Upgrade Guide
## Incremental Upgrade from the Existing Memory-Isolated AI Team Design

This document is an incremental upgrade guide for a repository that already has:

- OpenCode + GitHub integrated workflow
- four core AI roles: Architect / Developer / QA / Reviewer
- layered memory isolation:
  - global memory
  - role memory
  - task memory
- repository-local `.opencode/` structure
- GitHub issue / PR / workflow baseline

This guide focuses on upgrading the current system without rebuilding it from scratch.

The goal of this upgrade is to improve:

- execution power
- project delivery ability
- task progression stability
- verification quality
- knowledge accumulation
- governance and release discipline

---

# 1. What This Upgrade Adds

Compared with the current version, this upgrade adds six major capabilities:

1. Planner / Dispatcher
2. Triage / Debug Specialist
3. CI Failure Analyst
4. Task manifest + state machine + dependency model
5. Patterns library + failure library + stronger decision system
6. Release and change-control gates

These upgrades are designed to be incremental and compatible with the previous architecture.

---

# 2. Upgrade Strategy

Do not replace the whole system at once.

Recommended order:

## Phase 1 — Task System Upgrade
Add:

- `task.yaml`
- standard task states
- dependency fields
- ownership fields

Why first:
Without a structured task model, new roles such as Planner cannot operate effectively.

---

## Phase 2 — Execution Role Upgrade
Add:

- Planner agent
- Triage agent
- CI Analyst agent

Why second:
These roles increase execution quality and reduce wasted effort.

---

## Phase 3 — Validation Upgrade
Add:

- stronger regression checklist
- CI failure classification
- explicit validation rules
- better build/test/lint command references

Why third:
This closes the gap between implementation and real delivery.

---

## Phase 4 — Knowledge Upgrade
Add:

- reusable implementation patterns
- failure library
- stronger design decision logs

Why fourth:
This allows the AI team to improve over time.

---

## Phase 5 — Governance Upgrade
Add:

- change scope guard
- release gate
- stricter global memory write approval
- role boundary reinforcement

Why fifth:
This prevents the AI team from becoming unstable as it grows.

---

# 3. Current Baseline Assumptions

This upgrade assumes the existing repository already contains:

```text
.github/
.opencode/
  agents/
    architect.md
    developer.md
    qa.md
    reviewer.md
  skills/
  commands/
  memory/
    architect/
    developer/
    qa/
    reviewer/
docs/
  architecture/
  decisions/
  standards/
tasks/
AGENTS.md
```

If your repository already matches this baseline, this guide can be applied directly.

---

# 4. Directory Changes Required

## 4.1 New Agent Files

Add:

```text
.opencode/agents/planner.md
.opencode/agents/triage.md
.opencode/agents/ci-analyst.md
```

These are new specialized execution roles.

---

## 4.2 New Skills

Add at least:

```text
.opencode/skills/task-breakdown-and-dispatch/
.opencode/skills/issue-triage/
.opencode/skills/ci-failure-analysis/
.opencode/skills/regression-checklist/
.opencode/skills/release-readiness-check/
```

Optional but recommended:

```text
.opencode/skills/dependency-aware-implementation/
.opencode/skills/failure-pattern-recall/
.opencode/skills/decision-log-maintenance/
```

---

## 4.3 New Memory Areas

Add:

```text
.opencode/memory/planner/
.opencode/memory/triage/
.opencode/memory/ci-analyst/
.opencode/memory/failures/
```

Purpose:

- planner memory = task decomposition and flow rules
- triage memory = issue classification and debug heuristics
- ci-analyst memory = CI failure patterns and recurring causes
- failures = shared library of repeated bugs, flaky tests, build failures, environment failures

Note:
`failures/` is a controlled shared knowledge zone, but it is not global project truth like architecture docs.

---

## 4.4 New Documentation Zones

Add:

```text
docs/patterns/
docs/releases/
docs/runbooks/ci/
```

Purpose:

- `docs/patterns/` = reusable implementation patterns
- `docs/releases/` = release process, release criteria, release checklists
- `docs/runbooks/ci/` = CI investigation procedures and known infrastructure problems

---

## 4.5 Task Template Upgrade

Upgrade your task template structure from:

```text
tasks/issue-123/
  analysis.md
  design.md
  implementation.md
  validation.md
  review.md
```

to:

```text
tasks/issue-123/
  task.yaml
  analysis.md
  design.md
  implementation.md
  validation.md
  review.md
  release.md
```

The new `task.yaml` is the key upgrade.

---

# 5. Task Model Upgrade

## 5.1 Introduce task.yaml

Each task should now contain a `task.yaml` file.

Recommended structure:

```yaml
id: issue-123
title: Fix startup crash in device initialization
type: bug
status: in_analysis
priority: high
owner_role: architect
depends_on: []
blocked_by: []
acceptance_criteria:
  - application starts without crash
  - root cause documented
  - regression coverage added
risk_level: medium
module_scope:
  - startup
  - device_manager
  - config_loader
```

This file should become the primary machine-readable task definition.

---

## 5.2 Standardize Task States

Add the following state machine:

```text
backlog
ready
in_analysis
in_design
in_implementation
in_validation
in_review
release_candidate
blocked
done
```

Rules:

- `backlog` = not yet ready
- `ready` = can be taken by Planner
- `in_analysis` = Architect or Triage is working
- `in_design` = implementation strategy is being defined
- `in_implementation` = Developer active
- `in_validation` = QA active
- `in_review` = Reviewer active
- `release_candidate` = passes review and waiting for release decision
- `blocked` = cannot move forward
- `done` = completed and accepted

---

## 5.3 Add Dependency Handling

Each task should support:

```yaml
depends_on:
  - issue-101
  - issue-118
blocked_by:
  - missing-api-contract
```

Add rules:

- no implementation if required dependencies are unfinished
- no release candidate if validation incomplete
- no done state without review or explicit human override

This makes execution much more stable.

---

# 6. New Agent Roles

## 6.1 Planner / Dispatcher

Purpose:
Convert large work into manageable units and move work through the state machine.

Responsibilities:

- decompose large tasks
- assign next active role
- identify blockers
- enforce dependency order
- update task state recommendations

Expected outputs:

- task breakdown
- dependency notes
- next-role assignment
- blocked/unblocked decision

Memory usage:

- read: task manifests, docs, role outputs
- write: `.opencode/memory/planner/`, task coordination notes

Planner should not directly implement code.

---

## 6.2 Triage / Debug Specialist

Purpose:
Classify incoming work correctly before implementation begins.

Responsibilities:

- classify issue type
- identify likely failure domain
- distinguish bug vs feature vs infra vs flaky test
- gather first-pass root-cause evidence
- recommend next role

Expected outputs:

- issue classification
- suspected subsystem
- first-pass root-cause hypotheses
- escalation recommendation

Memory usage:

- read: task memory, failure library, logs
- write: `.opencode/memory/triage/`

Triage should reduce wasted implementation effort.

---

## 6.3 CI Failure Analyst

Purpose:
Investigate CI failures in a structured way.

Responsibilities:

- inspect failing jobs and logs
- classify failure:
  - code failure
  - test failure
  - flaky test
  - infra failure
  - dependency failure
  - permissions/configuration failure
- recommend next action
- record recurring failure patterns

Expected outputs:

- CI failure classification
- likely root cause
- suggested owner role
- retry vs fix recommendation

Memory usage:

- read: CI logs, build scripts, failure library
- write: `.opencode/memory/ci-analyst/`, failure library where appropriate

---

# 7. Memory Upgrade

## 7.1 Keep Existing Memory Model

Do not remove:

- global memory
- role memory
- task memory

These remain the correct foundation.

---

## 7.2 Add Controlled Shared Failure Memory

Add:

```text
.opencode/memory/failures/
```

Suggested contents:

- build_failures.md
- flaky_tests.md
- infra_failures.md
- recurring_bug_patterns.md

This memory is shared because repeated failures are valuable cross-role knowledge.

However, it should still be treated as:
- operational knowledge
- not architecture truth
- not permanent project policy by default

---

## 7.3 Strengthen Memory Write Policy

Upgrade rules:

### Global Memory
Still requires explicit human approval for persistent truth changes.

### Role Memory
Owned by specific roles only.

### Task Memory
May be updated automatically during task flow.

### Failure Library
May be updated by Triage / CI Analyst / Reviewer, but should remain evidence-based.

---

# 8. Validation Upgrade

## 8.1 Add a Regression Checklist Skill

Create:

```text
.opencode/skills/regression-checklist/
```

Purpose:

- check neighboring modules
- verify failure paths
- verify configuration compatibility
- check startup/shutdown if relevant
- verify no obvious performance regression
- verify test coverage gap

This should become a standard QA and Reviewer input.

---

## 8.2 Strengthen Project Validation Commands

Your `AGENTS.md` should now clearly define:

- build commands
- test commands
- lint commands
- platform-specific verification commands

Example structure:

```text
Build:
- cmake -S . -B build
- cmake --build build -j

Test:
- ctest --test-dir build --output-on-failure

Lint:
- clang-tidy ...
```

This helps the AI team execute reliably.

---

## 8.3 Add CI Runbook

Add:

```text
docs/runbooks/ci/
```

Suggested docs:

- common_failures.md
- flaky_test_policy.md
- permissions_and_secrets.md
- workflow_debugging.md

This gives CI Analyst and Reviewer reusable operating knowledge.

---

# 9. Knowledge Upgrade

## 9.1 Add Reusable Patterns Library

Create:

```text
docs/patterns/
```

Examples:

- error-handling-pattern.md
- thread-safe-cache-pattern.md
- request-response-parser-pattern.md
- retry-backoff-pattern.md
- async-ui-update-pattern.md

Purpose:
Reduce low-quality reinvention during implementation.

---

## 9.2 Strengthen Decision Logs

Continue using:

```text
docs/decisions/
```

But upgrade the format so each decision includes:

- context
- decision
- alternatives considered
- why alternatives were rejected
- expected impact
- rollback or future review note

This helps Architect and Reviewer remain consistent over time.

---

## 9.3 Add Failure Library Maintenance

Repeated failure types should move into:

```text
.opencode/memory/failures/
```

Do not let the same bug class be rediscovered repeatedly.

---

# 10. Governance Upgrade

## 10.1 Add Change Scope Guard

Strengthen your rules so agents follow:

- bug fix should not include unrelated refactor
- feature should not redesign public interfaces without approval
- refactor should preserve behavior
- reviewer should not silently rewrite implementation unless explicitly assigned

This should be added to:

- `AGENTS.md`
- role prompts
- key skills

---

## 10.2 Add Release Gate

Add a lightweight release decision stage.

Create:

```text
docs/releases/
```

Suggested docs:

- release_checklist.md
- release_readiness_policy.md

Add a new file per task if needed:

```text
tasks/issue-123/release.md
```

Release gate checks:

- validation complete
- review complete
- risk accepted
- changelog or release notes ready if needed
- no unresolved blocker

---

## 10.3 Tighten Protected Areas

Strongly recommend that AI should not directly modify without approval:

- `docs/architecture/`
- `docs/decisions/`
- release rules
- core governance docs

This prevents drift.

---

# 11. AGENTS.md Changes Required

Update `AGENTS.md` to include new sections:

## Task Execution Rules
- task manifests are authoritative
- state transitions should be explicit
- dependencies must be respected

## Validation Rules
- build/test/lint commands
- regression expectations
- CI investigation path

## Memory Rules
- failure library policy
- planner/triage/ci-analyst boundaries
- global memory write restrictions

## Governance Rules
- release gate
- change scope guard
- protected docs policy

---

# 12. GitHub Workflow Upgrades

You do not need to replace your current GitHub setup.

Incrementally add or refine:

## 12.1 CI Failure Analysis Workflow
Optional workflow triggered on failed CI or manual dispatch.

Purpose:
Let CI Analyst summarize failure cause and next action.

## 12.2 Nightly Maintenance Workflow
Optional scheduled workflow.

Purpose:
- summarize recurring failures
- identify stale blocked tasks
- detect tasks stuck too long in one state

## 12.3 PR Check Enhancement
Add policy checks such as:
- PR linked to issue
- task state valid
- required sections present in PR template

---

# 13. Suggested Incremental Upgrade Plan

## Step 1
Add:
- `task.yaml`
- new task states
- dependency fields

## Step 2
Add:
- Planner agent
- Triage agent
- CI Analyst agent

## Step 3
Add:
- failure library
- regression checklist skill
- CI runbook docs

## Step 4
Add:
- patterns library
- stronger decision log template
- release docs

## Step 5
Update:
- `AGENTS.md`
- agent prompts
- permissions and governance rules

This order minimizes disruption.

---

# 14. Minimal Upgrade Checklist

Use this as a practical checklist.

## Add directories
- `.opencode/agents/planner.md`
- `.opencode/agents/triage.md`
- `.opencode/agents/ci-analyst.md`
- `.opencode/memory/planner/`
- `.opencode/memory/triage/`
- `.opencode/memory/ci-analyst/`
- `.opencode/memory/failures/`
- `docs/patterns/`
- `docs/releases/`
- `docs/runbooks/ci/`

## Add skills
- task-breakdown-and-dispatch
- issue-triage
- ci-failure-analysis
- regression-checklist
- release-readiness-check

## Upgrade tasks
- add `task.yaml`
- add `release.md`
- add new states

## Update governance
- strengthen AGENTS.md
- add release gate
- add change scope guard
- restrict protected docs writes

---

# 15. Final Upgrade Summary

This upgrade turns the existing AI team system into a stronger execution platform by adding:

- task orchestration
- problem classification
- CI intelligence
- better validation
- project memory growth
- release and governance discipline

The most important change is this:

The AI team no longer acts only as a set of role prompts.
It becomes a structured execution system with explicit task state, stronger memory usage, and better delivery control.
