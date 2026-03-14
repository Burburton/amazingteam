---
name: task-breakdown-and-dispatch
description: Decompose complex tasks into GitHub sub-issues and coordinate workflow
license: MIT
---
# Task Breakdown and Dispatch (GitHub Issue-Based)

## When to Use

- Large feature requests requiring multiple steps
- Complex bugs affecting multiple modules
- Tasks that need design before implementation
- Work items requiring staged validation
- Issues impacting public interfaces or contracts

## Decomposition Decision

### No Decomposition Needed

A task may remain single-scope if:
- Touches only one module
- No architecture decision needed
- One implementation step is enough
- One PR is likely enough
- Validation is simple
- Rollback is straightforward

### Decomposition Required

Decompose if ANY of these are true:
- Touches multiple modules
- Requires design before implementation
- Impacts public interfaces
- Changes data model, API contract, or protocol
- Likely needs multiple PRs
- Contains several distinct implementation steps
- Requires staged validation
- Has clear dependency order between subproblems

## Steps

### 1. Analyze the Parent Issue

1. Read the issue description carefully
2. Identify the problem scope
3. List affected modules and components
4. Note existing constraints
5. Check for related issues or PRs

### 2. Determine Decomposition Need

Answer these questions:
- Does this touch multiple modules?
- Is there a clear design phase needed?
- Will this likely need multiple PRs?
- Are there logical dependency chains?
- Is the scope clear and bounded?

If 2+ answers are "yes", decomposition is recommended.

### 3. Define Subtask Boundaries

1. Identify logical phases (analysis, design, implement, validate, review)
2. Group related work into bounded subtasks
3. Define clear acceptance criteria for each subtask
4. Specify module scope for each subtask
5. Assign recommended owner role

### 4. Define Dependencies

1. Map which subtasks depend on others
2. Identify parallelizable work
3. Document external dependencies
4. Consider risk ordering (high-risk first)

### 5. Create GitHub Sub-Issues

Use `gh issue create` for each subtask:

```bash
gh issue create \
  --title "[Subtask] Subtask title" \
  --body "Parent Issue: #XXX
Dependencies: #YYY, #ZZZ
Owner Role: developer
Scope: ...
Acceptance Criteria: ..." \
  --label "type:subtask,role:developer"
```

### 6. Create Local Task Records

For each subtask, create:
- `tasks/issue-{N}-subtask-{M}/task.yaml`
- Include GitHub issue number
- Include parent reference
- Include dependency references

### 7. Update Parent Issue

Add to parent issue body:
- List of child issues
- Dependency graph
- Overall completion rule

### 8. Dispatch First Subtask

Identify the first ready subtask:
- All dependencies satisfied
- Clear acceptance criteria
- Assigned owner role
- Document dispatch decision

## Parent Task Manifest Template

```yaml
id: issue-120
title: Improve startup reliability
type: bug
status: in_analysis
priority: high
requires_decomposition: true

github_issue: 120
github_url: https://github.com/org/repo/issues/120

subtasks:
  - id: issue-120-subtask-01
    github_issue: 201
    title: "[Subtask] Isolate configuration validation"
    status: ready
    owner_role: architect
  - id: issue-120-subtask-02
    github_issue: 202
    title: "[Subtask] Refactor startup error path"
    status: pending
    depends_on: [201]
    owner_role: developer
  - id: issue-120-subtask-03
    github_issue: 203
    title: "[Subtask] Add regression coverage"
    status: pending
    depends_on: [202]
    owner_role: qa

overall_acceptance_criteria:
  - startup crash no longer occurs
  - root cause documented
  - regression coverage added
```

## Subtask Manifest Template

```yaml
id: issue-120-subtask-01
github_issue: 201
github_url: https://github.com/org/repo/issues/201
parent_task: issue-120
parent_github_issue: 120

title: "[Subtask] Isolate configuration validation"
type: implementation
status: ready
priority: high
owner_role: architect

depends_on: []
blocked_by: []

acceptance_criteria:
  - configuration validation is isolated
  - no startup crash for missing optional fields
  - existing startup path unchanged

module_scope:
  - config_loader
  - startup

risk_level: medium
```

## Dispatch Output Format

```
Active sub-issue: #202
Role: developer
Reason: #201 is completed and architecture is stable
Dependencies: satisfied (depends on #201 which is done)
Next action: Create feature branch and implement
Blocked: no
```

## Blocked Task Recording

```
Blocked subtask: issue-120-subtask-02
Blocker type: missing_design_decision
Blocker source: issue-120-subtask-01 design pending
Required action: Complete design phase
Recommended next: Dispatch to architect
```

## Workflow State Machine

```
backlog → ready → in_analysis → in_design → in_implementation → in_validation → in_review → release_candidate → done
                              ↓                                              ↓
                           blocked ←───────────────────────────────────────── ←
```

## Role Dispatch Guide

| Subtask Type | Target Role |
|--------------|-------------|
| analysis | architect |
| design | architect |
| implementation | developer |
| validation | qa |
| review | reviewer |
| ci-fix | ci-analyst |
| triage | triage |

## Completion Rules

### Subtask Completion
- Acceptance criteria satisfied
- Required validation complete
- Linked PR merged (if applicable)
- No unresolved blockers

### Parent Task Completion
- All required subtasks done
- Overall acceptance criteria satisfied
- Validation coverage complete
- No unresolved critical blockers

## Anti-Patterns to Avoid

1. **Conversational-Only Breakdown**: No explicit task objects created
2. **Everything Parallel**: All subtasks dispatched at once
3. **No Acceptance Criteria**: No clear done condition
4. **Planner Writes Code**: Planner implements instead of dispatching
5. **Parent Closed Early**: Parent closed before subtasks complete
6. **No GitHub Mapping**: Only local files, no GitHub issues

## Checklist

- [ ] Decomposition need determined
- [ ] Subtask boundaries defined
- [ ] Dependencies mapped
- [ ] GitHub sub-issues created
- [ ] Local task records created
- [ ] Parent issue updated
- [ ] First subtask dispatched
- [ ] State machine enforced