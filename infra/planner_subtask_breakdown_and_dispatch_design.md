# Planner Subtask Breakdown and Dispatch Design
## Design Specification for Large-Issue Decomposition in an AI Team Foundation

This document defines the Planner subtask breakdown and dispatch model for an AI team built on top of OpenCode + GitHub + layered memory.

The purpose of this design is to let the Planner transform a large issue into smaller executable subtasks so the AI team can:

- reduce context overload
- improve execution stability
- isolate implementation scope
- validate incrementally
- improve task tracking
- reduce cross-role confusion

The key principle is:

**Large issues should be decomposed into explicit subtasks before broad implementation begins.**

This document is intended to be used as part of an `ai-team-foundation` repository and downstream project repositories.

---

# 1. Why Subtask Breakdown Is Needed

If a large issue is executed as one undivided unit, common problems appear:

- the active context becomes too large
- architecture reasoning and implementation details get mixed together
- scope expands during execution
- CI failures become harder to localize
- review becomes harder
- validation becomes unclear
- task memory becomes noisy

A Planner-based subtask model reduces these risks.

Instead of:

- one large issue
- one long execution trace
- one unclear review surface

the system becomes:

- one parent issue
- multiple explicit subtasks
- one active subtask at a time
- incremental validation
- clearer review and rollback boundaries

---

# 2. Main Design Goal

The Planner should be able to:

1. inspect a large issue
2. determine whether decomposition is needed
3. split the issue into explicit subtasks
4. order those subtasks by dependency and risk
5. assign the next role for each subtask
6. control progression through a structured state machine

The Planner should not directly implement code by default.

---

# 3. When a Task Should Be Decomposed

Not every issue must be decomposed.

## 3.1 No Decomposition Needed

A task may remain single-scope if most of the following are true:

- touches only one module
- no architecture decision needed
- one implementation step is enough
- one PR is likely enough
- validation is simple
- rollback is straightforward

These tasks may go directly to Architect, Developer, or Triage depending on type.

---

## 3.2 Decomposition Recommended

A task should be decomposed if any of the following are true:

- touches multiple modules
- requires design before implementation
- impacts public interfaces
- changes data model, API contract, or protocol
- likely needs multiple PRs
- contains several distinct implementation steps
- requires staged validation
- contains infrastructure and code changes together
- has clear dependency order between subproblems

These tasks should first pass through Planner decomposition.

---

# 4. Core Concepts

This design introduces these concepts:

## Parent Task
The original large issue or major work item.

## Subtask
A smaller executable unit derived from the parent task.

## Dispatch
The act of assigning the next active role and expected next action.

## Dependency
A rule that one subtask must finish before another can start.

## Active Subtask
The single subtask currently being implemented or validated.

Recommended rule:

**At most one implementation-active subtask should be worked at a time unless there is a clear reason for parallelism.**

---

# 5. Planner Responsibilities

The Planner should be responsible for:

- identifying decomposition need
- splitting the parent issue into subtasks
- defining subtask boundaries
- defining acceptance criteria for each subtask
- defining dependency order
- determining recommended owner role
- determining current active subtask
- identifying blocked subtasks
- dispatching the next step to the appropriate role

The Planner should not be responsible for:

- direct code implementation
- deep architecture design details
- final review
- CI debugging in place of CI Analyst
- replacing role-specific reasoning

Planner is a workflow coordinator, not a substitute for every role.

---

# 6. Subtask Model

Each subtask should be an explicit task object.

## Recommended Fields

Every subtask should have a machine-readable `task.yaml`.

Recommended structure:

```yaml
id: issue-120-subtask-01
parent_task: issue-120
title: Extract startup configuration validation
type: implementation
status: ready
priority: high
owner_role: architect
depends_on: []
blocked_by: []
acceptance_criteria:
  - configuration validation is isolated into a dedicated path
  - no startup crash occurs for missing optional fields
  - existing startup success path remains unchanged
risk_level: medium
module_scope:
  - config_loader
  - startup
notes: first step before startup flow cleanup
```

This allows the Planner to reason structurally, not only conversationally.

---

# 7. Parent Task Model

The parent task should also remain explicit.

Recommended parent task structure:

```yaml
id: issue-120
title: Improve startup reliability and eliminate crash path
type: bug
status: in_analysis
priority: high
requires_decomposition: true
subtasks:
  - issue-120-subtask-01
  - issue-120-subtask-02
  - issue-120-subtask-03
overall_acceptance_criteria:
  - startup crash no longer occurs
  - root cause documented
  - regression coverage added
```

The parent task remains the top-level tracking unit.

---

# 8. Recommended Directory Structure

Two good patterns are possible.

## Pattern A — Nested Subtask Layout

```text
tasks/
  issue-120/
    task.yaml
    analysis.md
    design.md
    subtasks/
      issue-120-subtask-01/
        task.yaml
        analysis.md
        implementation.md
        validation.md
        review.md
      issue-120-subtask-02/
        task.yaml
        ...
```

Advantage:
Keeps everything grouped under the parent.

---

## Pattern B — Flat Task Layout with Parent References

```text
tasks/
  issue-120/
    task.yaml
    analysis.md
    design.md

  issue-120-subtask-01/
    task.yaml
    implementation.md
    validation.md

  issue-120-subtask-02/
    task.yaml
    implementation.md
    validation.md
```

Advantage:
Simpler tooling and easier path handling.

---

## Recommendation

Use whichever structure is easier for your tooling, but ensure:

- every subtask has explicit parent reference
- every parent task lists its subtasks
- every subtask has its own task.yaml
- validation and review remain subtask-local where possible

---

# 9. Subtask Types

Subtasks may be categorized to improve dispatch.

Recommended subtask types:

- `analysis`
- `design`
- `implementation`
- `validation`
- `review`
- `ci-fix`
- `release`

Examples:

- an Architect-facing design subtask
- a Developer-facing implementation subtask
- a QA-facing validation subtask
- a Reviewer-facing review subtask

This helps Planner choose the next role.

---

# 10. Dispatch Logic

Planner dispatch should follow structured rules.

## 10.1 Dispatch Inputs

Planner should consider:

- task type
- current state
- dependencies
- blocked conditions
- current failures
- previous role outputs
- acceptance criteria

---

## 10.2 Dispatch Output

Planner should produce:

- next active subtask
- next owner role
- reason for dispatch
- dependencies satisfied or not
- blocked reason if any

Example output:

```text
Next active subtask: issue-120-subtask-02
Next role: developer
Reason: design is approved and dependency on subtask-01 is complete
Blocked: no
```

---

## 10.3 Blocked Task Handling

If a subtask cannot proceed, Planner should explicitly mark:

- blocked state
- blocker type
- blocker source
- recommended next action

Example blocker types:

- missing design decision
- failing dependency
- CI instability
- unclear issue reproduction
- missing approval
- unavailable external artifact

Blocked tasks should not remain implicitly stalled.

---

# 11. State Machine

The Planner should enforce explicit subtask states.

Recommended states:

- backlog
- ready
- in_analysis
- in_design
- in_implementation
- in_validation
- in_review
- done
- blocked

Optional state:
- release_candidate

## State Rules

- only `ready` tasks may be dispatched
- tasks with unsatisfied dependencies must not move to implementation
- `blocked` tasks require explicit unblock action
- `done` means acceptance criteria met
- parent task is not `done` until all required subtasks are done

This creates real progression control.

---

# 12. Parent and Subtask Completion Rules

## Parent Task Completion

A parent task may move to `done` only if:

- all required subtasks are done
- overall acceptance criteria are satisfied
- validation coverage is complete
- review has no unresolved blockers
- required release or integration conditions are met

---

## Subtask Completion

A subtask may move to `done` only if:

- its own acceptance criteria are satisfied
- required validation is complete
- review or verification is complete if required
- it no longer blocks dependent subtasks

---

# 13. Memory Integration

This design integrates naturally with layered memory.

## 13.1 Planner Memory

Planner should write to:

```text
.opencode/memory/planner/
```

Suggested contents:

- decomposition_rules.md
- dispatch_notes.md
- blocker_patterns.md
- dependency_heuristics.md

---

## 13.2 Task Memory

Each parent task and subtask should maintain task-local memory:

- analysis
- design
- implementation notes
- validation results
- review outcome

This prevents the parent issue from becoming one giant noisy context.

---

## 13.3 Role Memory

Roles still keep isolated memory:

- Architect memory
- Developer memory
- QA memory
- Reviewer memory

Planner should not overwrite role memory.

---

# 14. Planner and Other Roles

Planner must coordinate with other roles.

## Planner → Architect
Used when a subtask needs:
- architecture design
- boundary decision
- module impact analysis

## Planner → Developer
Used when a subtask is implementation-ready.

## Planner → QA
Used when implementation is complete and validation should begin.

## Planner → Reviewer
Used when a subtask or parent task is ready for quality assessment.

## Planner → Triage
Used when the issue is still unclear and needs classification.

## Planner → CI Analyst
Used when a blocked state is caused by CI failure or build/test instability.

This makes Planner a dispatcher, not a generalist.

---

# 15. Recommended Planner Output Format

When decomposing a large task, Planner should output:

1. decomposition decision
2. decomposition rationale
3. subtask list
4. dependency order
5. next active subtask
6. next role dispatch
7. blocked items if any

Recommended structure:

```text
Decomposition required: yes

Reason:
- issue touches startup, configuration parsing, and validation flow
- implementation likely needs multiple steps
- validation must be staged

Subtasks:
1. issue-120-subtask-01 — isolate configuration validation
2. issue-120-subtask-02 — refactor startup error path
3. issue-120-subtask-03 — add regression test coverage

Dependencies:
- subtask-02 depends on subtask-01
- subtask-03 depends on subtask-02

Next active subtask:
- issue-120-subtask-01

Next role:
- architect
```

This output should then be materialized into task files.

---

# 16. Commands Design

The Planner model works best if exposed through commands.

Recommended commands:

## `/triage`
Classify an incoming issue and determine whether decomposition is needed.

## `/breakdown-issue`
Break a large issue into explicit subtasks and generate task files.

## `/dispatch-next`
Identify the next active subtask and the next owner role.

## `/show-blockers`
Summarize blocked subtasks and what is needed to unblock them.

## `/close-parent-task`
Verify that all subtasks and parent-level acceptance criteria are complete.

These commands reduce prompt inconsistency.

---

# 17. Anti-Patterns to Avoid

## Anti-Pattern 1 — Conversational-Only Breakdown
Planner describes subtasks in chat but no explicit task objects are created.

Why bad:
The decomposition is lost and cannot be tracked reliably.

---

## Anti-Pattern 2 — Everything Parallel
All subtasks are dispatched at once.

Why bad:
Context fragmentation increases and dependencies get violated.

---

## Anti-Pattern 3 — No Acceptance Criteria Per Subtask
Subtasks exist, but there is no clear done condition.

Why bad:
Progress becomes subjective.

---

## Anti-Pattern 4 — Planner Writes Code Directly
Planner starts implementing while also dispatching.

Why bad:
Role boundaries collapse and coordination quality declines.

---

## Anti-Pattern 5 — Parent Task Closes Too Early
Parent task is marked done even though important subtasks are unfinished.

Why bad:
Tracking loses integrity.

---

# 18. Recommended Governance Rules

Add the following governance rules to `AGENTS.md` or Planner guidance:

- large tasks should be decomposed before broad implementation
- Planner must not silently skip dependency modeling for multi-step work
- one active implementation subtask is preferred unless parallelism is justified
- blocked subtasks must be explicitly recorded
- parent task completion requires subtask completion evidence
- Planner may recommend decomposition, but durable task files should be created explicitly

These rules keep the system disciplined.

---

# 19. Minimal Viable Planner Model

If you want a lightweight first version, the minimum useful setup is:

- a Planner agent
- a `task-breakdown-and-dispatch` skill
- `task.yaml` support for parent and subtasks
- dependency fields
- explicit subtask states
- one `/breakdown-issue` command
- one `/dispatch-next` command

This is enough to gain most of the benefit.

---

# 20. Success Criteria

This Planner model is successful if the AI team gains:

- smaller active contexts
- clearer execution boundaries
- better dependency tracking
- fewer mixed-scope code changes
- more reliable validation
- easier review
- easier rollback and debugging

---

# 21. Final Summary

Large issues should not be treated as single undivided execution units by default.

Instead, the Planner should:

- decide whether decomposition is needed
- split the parent task into explicit subtasks
- assign ownership and dependencies
- dispatch one subtask at a time
- keep progression visible and structured

This makes the AI team more operational, more stable, and less likely to lose control of context during large project work.
