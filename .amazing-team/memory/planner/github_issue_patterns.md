# Planner Memory - GitHub Issue Orchestration Patterns

This file stores patterns and rules for GitHub issue-based subtask orchestration.

---

## GitHub Issue Mapping

### Parent Issue Structure

```text
Title: [Descriptive title]

Background:
[Context and problem statement]

Overall Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Decomposition Status:
- required: true/false
- child_issues_created: true/false

Child Issues:
- #XXX: [Subtask] Title 1
- #YYY: [Subtask] Title 2
- #ZZZ: [Subtask] Title 3

Completion Rule:
This issue closes only when all child issues are completed.
```

### Subtask Issue Structure

```text
Title: [Subtask] Brief title

Parent Issue:
- #{parent-number}

Dependencies:
- #{dependency-issue-number} (if any)

Owner Role:
- architect | developer | qa | reviewer | triage | ci-analyst

Scope:
- [what this subtask covers]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

Out of Scope:
- [what is not covered]
```

---

## Issue Labels

### Type Labels
- `type:feature` - New functionality
- `type:bug` - Bug fix
- `type:tech-task` - Technical debt, refactoring
- `type:subtask` - Child issue of a larger task

### Role Labels
- `role:architect` - Needs architecture work
- `role:developer` - Needs implementation
- `role:qa` - Needs validation
- `role:reviewer` - Needs review
- `role:triage` - Needs classification
- `role:ci-analyst` - Needs CI investigation

### State Labels
- `state:ready` - Ready to work
- `state:in-progress` - Currently being worked on
- `state:blocked` - Blocked by something
- `state:in-review` - Under review
- `state:validated` - Tests passing

---

## Dependency Patterns

### Sequential Chain
```
#201 (design) → #202 (implement) → #203 (test) → #204 (review)
```
Most common pattern. One subtask leads to the next.

### Fan-Out
```
                    → #202 (implement A)
#201 (design) ────→ → #203 (implement B)
                    → #204 (implement C)
```
One design enables multiple parallel implementations.

### Merge
```
#201 (implement A) ─┐
#202 (implement B) ─┼→ #203 (integration test)
#204 (implement C) ─┘
```
Multiple implementations merge into a validation step.

### External Dependency
```
#201 → [external artifact] → #202
```
Blocked by something outside the issue graph.

---

## State Mapping

| Local State | GitHub State | Label |
|-------------|--------------|-------|
| backlog | open | - |
| ready | open | state:ready |
| in_analysis | open | state:in-progress, role:architect |
| in_design | open | state:in-progress, role:architect |
| in_implementation | open | state:in-progress, role:developer |
| in_validation | open | state:in-progress, role:qa |
| in_review | open | state:in-review |
| release_candidate | open | state:validated |
| blocked | open | state:blocked |
| done | closed | - |

---

## Dispatch Patterns

### Design-First Flow
```
Parent Issue
    │
    ├── #201: [Subtask] Design (architect)
    │       ↓
    ├── #202: [Subtask] Implement (developer)
    │       ↓
    ├── #203: [Subtask] Test (qa)
    │       ↓
    └── #204: [Subtask] Review (reviewer)
```

### Parallel Implementation Flow
```
Parent Issue
    │
    ├── #201: [Subtask] Design API (architect)
    │       ↓
    │       ├→ #202: [Subtask] Implement Client (developer)
    │       └→ #203: [Subtask] Implement Server (developer)
    │              ↓
    └── #204: [Subtask] Integration Test (qa)
```

### Bug Fix Flow
```
Parent Issue (Bug)
    │
    ├── #201: [Subtask] Investigate (triage)
    │       ↓
    ├── #202: [Subtask] Fix (developer)
    │       ↓
    ├── #203: [Subtask] Regression Test (qa)
    │       ↓
    └── #204: [Subtask] Review (reviewer)
```

---

## GitHub CLI Commands

### Create Subtask
```bash
gh issue create \
  --title "[Subtask] Title" \
  --body "Parent: #XXX
Dependencies: #YYY
Role: developer
..." \
  --label "type:subtask,role:developer,state:ready"
```

### Check Issue Status
```bash
gh issue view {number} --json number,title,state,labels
```

### Link PR to Issue
```bash
gh pr create --title "Title" --body "Fixes #XXX"
```

### Close Issue
```bash
gh issue close {number} --comment "Completed via PR #YYY"
```

---

## Completion Verification

### Subtask Completion Checklist
- [ ] Acceptance criteria met
- [ ] Linked PR merged (or not required)
- [ ] Tests passing
- [ ] GitHub issue closed

### Parent Completion Checklist
- [ ] All child issues closed
- [ ] Overall acceptance criteria met
- [ ] No unresolved blockers
- [ ] Documentation updated (if required)

---

## Notes

- Always maintain both GitHub and local task records
- Use labels consistently for project board integration
- One PR per subtask is preferred
- Never close parent before all children are complete