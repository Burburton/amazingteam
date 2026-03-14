---
description: List all blocked subtasks and required actions to unblock them
agent: planner
---
Show all blocked subtasks and what is needed to unblock them.

## Steps

### 1. Scan Task Directory

List all tasks and subtasks:
```
tasks/
├── issue-{N}/
├── issue-{N}-subtask-01/
├── issue-{N}-subtask-02/
...
```

### 2. Check for Blocked Status

For each task/subtask, check `task.yaml`:
- status: blocked
- blocked_by field
- depends_on field

### 3. Analyze Blocker Types

Common blocker types:
- `missing_design_decision` - Design not complete
- `failing_dependency` - Dependency task not done
- `ci_failure` - CI failing on related PR
- `unclear_requirements` - Issue needs clarification
- `missing_approval` - Waiting for human approval
- `external_dependency` - Waiting for external artifact

### 4. Check GitHub Status

```bash
gh issue view {issue-number}
gh pr list --state open --search "fixes #{issue-number}"
```

### 5. Determine Unblock Actions

For each blocked item, identify:
- What is blocking
- What must happen to unblock
- Who should act
- Recommended next command

## Output Format

```
Blocked Subtasks Report
========================

Parent Task: issue-{N}

┌─────────────────────────────────────────────────────────────┐
│ Blocked: issue-{N}-subtask-02                                │
├─────────────────────────────────────────────────────────────┤
│ Title: [Subtask] Implement feature                           │
│ GitHub: #202                                                 │
│ Owner: developer                                             │
│                                                              │
│ Blocker Type: failing_dependency                             │
│ Blocker Source: issue-{N}-subtask-01 (design pending)       │
│                                                              │
│ Required Action: Complete design phase                       │
│ Recommended Next: Dispatch to architect                      │
│ Command: /design --subtask issue-{N}-subtask-01              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Blocked: issue-{M}-subtask-03                                │
├─────────────────────────────────────────────────────────────┤
│ Title: [Subtask] Add tests                                   │
│ GitHub: #305                                                 │
│ Owner: qa                                                    │
│                                                              │
│ Blocker Type: ci_failure                                     │
│ Blocker Source: PR #304 failing                              │
│                                                              │
│ Required Action: Fix CI failure                              │
│ Recommended Next: Dispatch to ci-analyst                     │
│ Command: /ci-analyze --pr 304                                │
└─────────────────────────────────────────────────────────────┘

Summary:
- 2 blocked subtasks
- 1 requires architecture work
- 1 requires CI fix

Next Recommended Action:
Dispatch to ci-analyst for immediate CI fix (blocking implementation)
```