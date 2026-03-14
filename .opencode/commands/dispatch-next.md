---
description: Identify and dispatch the next active subtask to the appropriate role
agent: planner
---
Identify the next active subtask and dispatch to the appropriate role.

## Steps

### 1. Review Parent Task State

Read `tasks/issue-{N}/task.yaml` to understand:
- Current status of all subtasks
- Dependency graph
- Blocked items

### 2. Check GitHub Issue Status

For each pending subtask:
```bash
gh issue view {subtask-issue-number}
```

Check:
- Is the issue open or closed?
- Are there linked PRs?
- Any comments indicating blockers?

### 3. Identify Ready Subtasks

A subtask is ready when:
- All dependencies are completed
- No active blockers
- Acceptance criteria are clear
- Owner role is assigned

### 4. Determine Active Subtask

Select the subtask that:
- Has highest priority among ready tasks
- Follows dependency order
- Has clear next action

### 5. Dispatch to Role

Assign to the correct role based on subtask type:

| Type | Role |
|------|------|
| analysis | architect |
| design | architect |
| implementation | developer |
| validation | qa |
| review | reviewer |
| ci-fix | ci-analyst |
| triage | triage |

### 6. Update Task Records

Update `task.yaml` with:
- New status
- Dispatch timestamp
- Dispatch notes

## Output Format

```
Parent Task: issue-{N} - {title}
Overall Status: in_implementation

Subtask Progress:
✓ issue-{N}-subtask-01: done (architect)
✓ issue-{N}-subtask-02: done (developer)
● issue-{N}-subtask-03: ready (next active)
○ issue-{N}-subtask-04: pending (depends on subtask-03)

Next Active Subtask: issue-{N}-subtask-03
GitHub Issue: #{issue-number}
Title: [Subtask] {title}
Owner Role: {role}
Reason: Dependencies satisfied, ready for implementation

Dispatch Command:
/implement --subtask issue-{N}-subtask-03
```

## Blocked Handling

If all subtasks are blocked:

```
All subtasks blocked:

Subtask: issue-{N}-subtask-02
Status: blocked
Blocker: CI failure in subtask-01 PR
Required Action: CI fix needed

Recommendation: Dispatch to ci-analyst
Command: /ci-analyze --issue {subtask-01-issue}
```

Use the `task-breakdown-and-dispatch` skill for detailed guidance.