# GitHub Issue–Based Planner / Subtask Orchestration Design
## Design Specification for Parent Issue, Sub-Issue, Dependency, Agent Dispatch, and CI Coordination

This document defines a **GitHub issue–based orchestration model** for Planner-driven large-task execution in an AI team built on top of:

- OpenCode
- GitHub Issues
- GitHub Pull Requests
- GitHub Actions / CI
- layered memory
- role-based AI execution

This document is intended to **extend and complement** the existing:

- `planner-subtask-breakdown-and-dispatch-design.md`

The key idea is:

**Large work should be represented as a parent GitHub Issue, decomposed into child GitHub Issues, dispatched one subtask at a time, and coordinated through explicit dependency and state tracking.**

---

# 1. Why Use GitHub Issues as Subtasks

A local task file model is useful, but for real project execution it is often not enough.

Using GitHub Issues as subtasks adds several important capabilities:

- persistent and visible work items
- independent discussion per subtask
- independent assignment
- independent status tracking
- easy auditability
- human + AI collaboration in the same system
- direct linkage to pull requests
- GitHub-native project board integration
- better CI and review traceability

The practical principle is:

**Planner should decompose large work into GitHub-native work objects, not only conversational or local task fragments.**

---

# 2. Main Design Goal

The system should support this workflow:

1. a large parent issue exists
2. Planner analyzes it
3. Planner decides decomposition is needed
4. Planner creates multiple sub-issues
5. Planner establishes parent/child and dependency relationships
6. Planner dispatches one current subtask to the correct role
7. implementation happens through PRs linked to that subtask
8. CI validates the subtask-specific change
9. Planner advances to the next subtask when dependencies allow
10. the parent issue closes only when all required subtasks are complete

This makes GitHub the visible work graph and OpenCode the execution engine.

---

# 3. Core Objects

This orchestration model uses five main object types.

## 3.1 Parent Issue

The original large work item.

Represents:
- the overall problem
- overall acceptance criteria
- overall priority
- overall business or engineering objective

A parent issue should not be treated as a direct implementation unit if decomposition is required.

---

## 3.2 Sub-Issue

A smaller executable work item created from the parent issue.

Represents:
- one bounded step of work
- one focused discussion scope
- one focused implementation target
- one focused validation unit

Each sub-issue should be narrow enough that:
- one role can act clearly
- one PR can usually implement it
- CI results can be interpreted clearly
- review can remain focused

---

## 3.3 Dependency

A dependency indicates that one sub-issue cannot proceed before another is complete.

This should be modeled explicitly.

Examples:
- design subtask must complete before implementation subtask
- core refactor must complete before test expansion
- API contract task must complete before integration task

Dependency is not the same as parent/child relationship.

---

## 3.4 Pull Request

The PR is the code delivery object.

Recommended mapping:
- one sub-issue -> one main PR when practical

This gives:
- clearer CI
- clearer review
- easier rollback
- easier traceability

---

## 3.5 Task Memory

GitHub Issues are the visible planning objects.
Local task memory remains the execution memory.

Recommended principle:

- GitHub = project-visible work graph
- local task memory = project-local execution record

These should complement each other, not replace each other.

---

# 4. Recommended Mapping Model

## 4.1 Parent/Child Mapping

Recommended mapping:

- parent issue = overall work item
- child issues = subtasks

The parent issue should contain:
- high-level background
- high-level acceptance criteria
- list of child issues
- overall completion logic

The child issue should contain:
- narrow scope
- owner role
- dependency references
- child-specific acceptance criteria

---

## 4.2 Dependency Mapping

Dependencies should be explicit.

Recommended model:

- use GitHub-native issue dependency features where available
- otherwise record dependency in the issue body and local task metadata
- local task metadata should remain the machine-readable fallback

Recommended dependency fields in local `task.yaml`:

```yaml
depends_on:
  - gh-201
  - gh-205
blocked_by: []
```

Where `gh-201` refers to a GitHub issue number or mapped issue id.

---

## 4.3 PR Mapping

Recommended model:

- each implementation sub-issue should have one primary PR
- each PR should link back to the sub-issue
- the parent issue should not usually be the direct PR target reference when subtasks exist

This keeps execution granular.

---

# 5. Planner Responsibilities in GitHub-Issue Mode

The Planner role should be upgraded to explicitly manage GitHub issue orchestration.

Planner responsibilities:

- inspect parent issue
- determine whether decomposition is needed
- define subtask boundaries
- create sub-issues
- define order and dependencies
- record parent/subtask structure
- determine next active subtask
- dispatch role-specific work
- detect blocked states
- track completion progression
- determine when parent issue is ready to close

Planner should not:
- directly implement code
- silently bypass dependency order
- collapse multiple subtasks into one large execution step without justification

---

# 6. Recommended Parent Issue Structure

A parent issue should contain the following sections.

## Suggested Sections

- Background
- Problem Statement
- Overall Acceptance Criteria
- Non-Goals
- Decomposition Status
- Child Issues
- Dependency Notes
- Completion Rule

Example structure:

```text
Title: Improve startup reliability and remove crash path

Background:
The application startup flow currently contains a fragile crash path caused by configuration and initialization ordering.

Overall Acceptance Criteria:
- startup crash no longer occurs
- root cause documented
- regression coverage added
- no regression to normal startup path

Decomposition Status:
- decomposition required
- 3 child issues created

Child Issues:
- #201 isolate configuration validation
- #202 refactor startup error path
- #203 add regression coverage

Completion Rule:
This parent issue closes only when all required child issues are completed and validation is confirmed.
```

---

# 7. Recommended Sub-Issue Structure

Each child issue should be intentionally small.

## Suggested Sections

- Scope
- Parent Issue
- Dependencies
- Acceptance Criteria
- Owner Role
- Out of Scope
- Suggested Next Step

Example structure:

```text
Title: [Subtask] Isolate configuration validation

Parent Issue:
- #120

Dependencies:
- none

Owner Role:
- architect

Scope:
- identify and isolate config validation path from startup orchestration

Acceptance Criteria:
- config validation path is separate from startup action path
- invalid optional fields no longer trigger crash
- scope remains limited to config and startup modules

Out of Scope:
- broader startup flow redesign
- unrelated refactor
```

---

# 8. Creating Sub-Issues

The Planner may create sub-issues using GitHub CLI or GitHub API based workflows.

Example concept:

```bash
gh issue create --title "[Subtask] Isolate configuration validation" --body-file subtask_body.md
```

However, the system should treat these as two separate operations:

1. create the issue
2. establish the parent/subtask and dependency relationships

Do not assume plain issue creation automatically creates correct hierarchy or dependency semantics.

---

# 9. Parent / Child Relationship Design

There are three layers of relationship data.

## Layer 1 — GitHub-native relationship
If supported, use GitHub-native sub-issue / hierarchy features for human-facing tracking.

## Layer 2 — Issue body reference
Record:
- parent issue id
- child issue list
- dependency reference

This improves readability.

## Layer 3 — Local machine-readable metadata
Maintain local task metadata such as:

```yaml
github_issue: 201
parent_issue: 120
depends_on:
  - 200
```

This ensures the orchestration model remains toolable even if UI-level relations are incomplete.

Recommended policy:

**Never rely on only one representation layer.**
Use GitHub visibility + local machine-readable metadata together.

---

# 10. Dependency Design

Dependencies should be explicit and conservative.

## Examples of dependency patterns

### Sequential dependency
- child issue 202 depends on 201

### Fan-out dependency
- multiple implementation subtasks depend on one design issue

### Merge dependency
- final validation depends on multiple implementation subtasks

### External dependency
- blocked by missing artifact, approval, or environment fix

Planner should always record:
- what is blocked
- why
- what must be completed before unblocking

---

# 11. Dispatch Model

Planner dispatch in GitHub-issue mode should produce:

- active sub-issue
- active owner role
- dependency status
- recommended next command or action
- blocked summary if needed

Example:

```text
Active sub-issue: #202
Role: developer
Reason: #201 is completed and architecture scope is stable
Next action: implement startup error path refactor in a dedicated branch
Blocked: no
```

This dispatch output may be:
- posted in issue comments
- written to task memory
- used to trigger OpenCode commands

---

# 12. Agent Dispatch Model

The recommended dispatch model is role-targeted.

## Planner -> Architect
For:
- design subtasks
- module boundary questions
- dependency-impact analysis

## Planner -> Developer
For:
- implementation-ready subtasks
- minimal code changes
- testable delivery steps

## Planner -> QA
For:
- validation subtasks
- staged acceptance checks
- regression assessment

## Planner -> Reviewer
For:
- subtask completion review
- risk review
- merge recommendation

## Planner -> Triage
For:
- unclear or under-specified issues
- mixed bug/infra/flaky signals

## Planner -> CI Analyst
For:
- build failures
- flaky test suspicion
- workflow or permission issues

Planner dispatch should remain narrow and explicit.

---

# 13. CI Coordination Model

One major advantage of issue-based subtasks is cleaner CI interpretation.

## Recommended principle

Each implementation-oriented sub-issue should usually correspond to:
- one focused PR
- one focused CI surface

This allows the team to answer:
- which subtask introduced the failure
- which subtask is blocked by CI
- whether the failure is code-related or infrastructure-related

---

## CI states relevant to Planner

Planner should recognize:

- CI passed
- CI failed — code issue
- CI failed — test issue
- CI failed — flaky
- CI failed — infra
- CI failed — permissions/configuration
- CI pending
- CI not applicable

Planner does not need to diagnose deeply itself, but it must dispatch correctly.

---

# 14. Memory Integration

The GitHub issue graph should be mirrored by local task memory.

## Recommended local mapping

```text
tasks/
  issue-120/
    task.yaml
    analysis.md
    design.md

  issue-120-subtask-01/
    task.yaml
    analysis.md
    implementation.md
    validation.md
    review.md
```

Where `task.yaml` includes both:
- local task identity
- GitHub issue identity

Example:

```yaml
id: issue-120-subtask-01
github_issue: 201
parent_task: issue-120
parent_github_issue: 120
status: in_implementation
owner_role: developer
depends_on:
  - 200
```

This lets OpenCode work with both local files and GitHub objects.

---

# 15. Recommended Status Model

GitHub issue state alone is usually not enough.

A sub-issue may be open, but still be:
- ready
- blocked
- in_analysis
- in_implementation
- in_validation

Therefore, recommended policy is:

- use GitHub issue open/closed for broad visibility
- use labels, issue body, project board state, or local `task.yaml` for richer workflow state

Recommended workflow states:

- backlog
- ready
- in_analysis
- in_design
- in_implementation
- in_validation
- in_review
- blocked
- done

---

# 16. Recommended Labels

Suggested GitHub labels for sub-issue orchestration:

## Type labels
- `type:feature`
- `type:bug`
- `type:tech-task`
- `type:subtask`

## Role labels
- `role:planner`
- `role:architect`
- `role:developer`
- `role:qa`
- `role:reviewer`
- `role:triage`
- `role:ci-analyst`

## State labels
- `state:ready`
- `state:blocked`
- `state:in-progress`
- `state:in-review`
- `state:validated`

## Risk labels
- `risk:low`
- `risk:medium`
- `risk:high`

Labels are optional, but they make project board orchestration easier.

---

# 17. GitHub Project Board Integration

This model works especially well with GitHub Projects.

Recommended project columns:

- Backlog
- Ready
- In Analysis
- In Implementation
- In Validation
- In Review
- Blocked
- Done

Parent issue may remain visible as the umbrella item.
Child issues should move independently through the board.

This makes Planner decisions visible to humans.

---

# 18. Commands Design

To support this model, add commands such as:

## `/triage`
Classify issue and determine whether decomposition is needed.

## `/breakdown-issue`
Create sub-issues and local task records for the parent issue.

## `/dispatch-next`
Determine the next active child issue and target role.

## `/summarize-parent`
Summarize current progress of all child issues under the parent issue.

## `/show-blockers`
List blocked subtasks and required unblock actions.

## `/close-parent-task`
Verify whether parent issue completion conditions are satisfied.

These commands should be defined in the foundation repo.

---

# 19. Completion Rules

## Child issue completion

A child issue is ready to close when:
- its acceptance criteria are satisfied
- required validation is complete
- linked PR is merged or accepted
- no unresolved blocker remains

## Parent issue completion

A parent issue is ready to close when:
- all required child issues are closed or done
- overall acceptance criteria are satisfied
- validation coverage is complete
- integration risk is acceptable
- unresolved critical blockers are absent

Parent closure should be explicit, not assumed.

---

# 20. Anti-Patterns to Avoid

## Anti-Pattern 1 — One giant parent issue with no sub-issues
Why bad:
Context becomes too large and execution becomes unstable.

## Anti-Pattern 2 — Sub-issues created but no dependency graph
Why bad:
Parallel work causes conflicts and ordering mistakes.

## Anti-Pattern 3 — One sub-issue mapped to many unrelated PRs
Why bad:
Traceability weakens and CI interpretation becomes harder.

## Anti-Pattern 4 — GitHub issue graph exists, but local task memory does not
Why bad:
The AI team loses structured execution memory.

## Anti-Pattern 5 — Planner dispatches many subtasks into implementation at once
Why bad:
Context fragmentation grows and review surfaces become unclear.

## Anti-Pattern 6 — Parent issue closed before validation of all child work
Why bad:
The visible project state becomes inaccurate.

---

# 21. Recommended Governance Rules

Add these rules to your foundation guidance:

- large GitHub issues should be decomposed before broad execution
- parent/child and dependency relationships must be explicit
- one focused PR per subtask is preferred
- blocked child issues must be recorded explicitly
- parent issue closure requires child issue completion evidence
- local task memory should mirror GitHub issue structure
- Planner coordinates work; it does not replace specialist roles

---

# 22. Minimal Viable GitHub-Issue Planner Model

If you want a lightweight first version, start with:

- one Planner agent
- one `/breakdown-issue` command
- one `/dispatch-next` command
- child issues created for large work
- dependency recorded in issue body + local task.yaml
- one PR per implementation subtask where practical
- task memory mirrored locally

This already gives most of the benefit.

---

# 23. Final Summary

A Planner-driven AI team should not treat a large GitHub issue as one undivided implementation unit.

Instead, it should:

- create a parent issue for the overall goal
- decompose work into child issues
- record dependencies explicitly
- dispatch one active subtask at a time
- link PRs and CI to focused subtasks
- mirror the issue graph into local task memory
- close the parent issue only after all required child work is complete

This design makes the AI team more traceable, more operational, and much more stable for large project execution.
