---
description: Summarize current progress of all child issues under a parent issue
agent: planner
---
Summarize the progress of all child issues under a parent issue.

## Steps

### 1. Identify Parent Issue

Parse the issue reference or read from `tasks/issue-{N}/task.yaml`

### 2. List All Child Issues

From parent task.yaml:
```yaml
subtasks:
  - id: issue-{N}-subtask-01
    github_issue: 201
  - id: issue-{N}-subtask-02
    github_issue: 202
  ...
```

### 3. Check GitHub Status

For each child issue:
```bash
gh issue view {issue-number} --json number,title,state,labels
```

### 4. Check Linked PRs

```bash
gh pr list --state all --search "fixes #{issue-number}"
```

### 5. Calculate Progress

- Count: total, done, in_progress, pending, blocked
- Calculate completion percentage
- Identify critical path items

### 6. Identify Risks

- Long-running blocked items
- Dependencies not progressing
- Missing assignments

## Output Format

```
Parent Issue Summary
====================

Parent: issue-{N} - {title}
GitHub: #{issue-number}
Status: in_implementation
Priority: high

Progress Overview
-----------------
Total Subtasks: 5
✓ Done:         2 (40%)
● In Progress:  1 (20%)
○ Pending:      1 (20%)
✗ Blocked:      1 (20%)

Completion: 40%

Subtask Details
---------------

✓ #201 [Subtask] Design API
  Role: architect | Status: done
  PR: #250 (merged)
  Completed: 2024-01-15

✓ #202 [Subtask] Implement core
  Role: developer | Status: done
  PR: #251 (merged)
  Completed: 2024-01-18

● #203 [Subtask] Add tests
  Role: qa | Status: in_validation
  PR: #252 (open)
  Started: 2024-01-19

○ #204 [Subtask] Update docs
  Role: developer | Status: pending
  Depends on: #203
  ETA: after #203

✗ #205 [Subtask] Integration test
  Role: qa | Status: blocked
  Blocker: CI failure in #203
  Blocked since: 2024-01-20

Dependency Graph
----------------
#201 (done) → #202 (done) → #203 (in_progress) → #204 (pending)
                              ↓
                           #205 (blocked)

Critical Path
-------------
Current: #203 (validation)
Next: #204 (docs), #205 (integration)

Risks
-----
- #205 blocked for 2 days (CI failure)
- #204 waiting on #203

Recommendations
---------------
1. Resolve CI failure in #203 to unblock #205
2. Consider parallelizing #204 after #203 validation passes

Next Action: /dispatch-next
```