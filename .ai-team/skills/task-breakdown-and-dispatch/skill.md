# Task Breakdown and Dispatch

## Purpose

This skill enables systematic decomposition of tasks into actionable subtasks and intelligent dispatching to appropriate roles.

## When to Use

- Starting a new feature or large task
- Planning sprint work
- Breaking down complex issues
- Coordinating multi-role workflows

## Steps

### 1. Analyze Task Scope

```
1. Read the task description and acceptance criteria
2. Identify the task type: feature, bug, refactor, docs, infra
3. Assess complexity: simple, moderate, complex
4. Estimate risk level: low, medium, high
5. Identify affected modules/domains
```

### 2. Identify Required Roles

```
1. Architect: Needed for design decisions
2. Developer: Needed for implementation
3. QA: Needed for validation
4. Reviewer: Needed for code review
5. Triage: Needed for initial investigation
6. CI Analyst: Needed for CI-related tasks
```

### 3. Decompose into Subtasks

```
1. Break task into logical phases
2. Identify dependencies between phases
3. Define clear deliverables for each phase
4. Estimate effort for each subtask
5. Assign appropriate role to each subtask
```

### 4. Define Dependencies

```
1. Map task dependencies
2. Identify blocking relationships
3. Find parallelizable work
4. Define critical path
5. Document external dependencies
```

### 5. Create Task Manifest

```
1. Generate task.yaml with metadata
2. List all subtasks
3. Define state transitions
4. Set acceptance criteria
5. Assign owner_role
```

### 6. Dispatch Tasks

```
1. Start with unblocked tasks
2. Notify appropriate role
3. Track task progress
4. Handle blocking issues
5. Coordinate handoffs between roles
```

## Task Manifest Template

```yaml
id: issue-123
title: Implement user authentication
type: feature
status: ready
priority: high
owner_role: planner
depends_on: []
blocked_by: []
acceptance_criteria:
  - Users can log in with email/password
  - Sessions persist across page reloads
  - Failed login attempts are rate-limited
risk_level: medium
module_scope:
  - auth
  - api
  - database
subtasks:
  - id: design-auth-flow
    title: Design authentication flow
    owner_role: architect
    status: ready
    depends_on: []
  - id: implement-auth-api
    title: Implement authentication API
    owner_role: developer
    status: blocked
    depends_on: [design-auth-flow]
  - id: add-auth-tests
    title: Add authentication tests
    owner_role: qa
    status: pending
    depends_on: [implement-auth-api]
```

## State Machine

```
backlog → ready → in_analysis → in_design → in_implementation → in_validation → in_review → release_candidate → done
                              ↓                                              ↓
                           blocked ←───────────────────────────────────────── ←
```

## Dispatch Matrix

| Task Type | First Role | Handoff Sequence |
|-----------|------------|------------------|
| Feature | Architect | Architect → Developer → QA → Reviewer |
| Bug | Triage | Triage → Developer → QA → Reviewer |
| Refactor | Architect | Architect → Developer → QA |
| Docs | Developer | Developer → Reviewer |
| CI Failure | CI Analyst | CI Analyst → Developer → QA |

## Checklist

- [ ] Task scope analyzed
- [ ] Required roles identified
- [ ] Task decomposed into subtasks
- [ ] Dependencies mapped
- [ ] Task manifest created
- [ ] Initial tasks dispatched
- [ ] Progress tracking in place
- [ ] Blocking issues addressed

## Best Practices

- Start with clear acceptance criteria
- Keep subtasks atomic and focused
- Minimize dependencies where possible
- Document assumptions
- Update task status regularly
- Escalate blocked tasks promptly