---
description: Decompose a large issue into GitHub sub-issues with dependencies
agent: planner
---
Decompose this issue into explicit GitHub sub-issues following the GitHub Issue-based Planner orchestration model.

## Steps

### 1. Analyze the Issue

Read the issue and answer:
- What is the core problem?
- Which modules are affected?
- Is this a single bounded change or multiple related changes?
- Are there dependencies between potential subtasks?

### 2. Determine Decomposition Need

**Decomposition Required if:**
- Touches multiple modules
- Requires design before implementation
- Impacts public interfaces
- Changes data model, API contract, or protocol
- Likely needs multiple PRs
- Contains several distinct implementation steps
- Requires staged validation

**No Decomposition if:**
- Single module change
- Clear, bounded scope
- One PR likely sufficient

### 3. Define Subtasks

For each subtask, specify:
- Title (prefixed with "[Subtask]")
- Type: analysis | design | implementation | validation | review | ci-fix
- Owner role: architect | developer | qa | reviewer | triage | ci-analyst
- Dependencies (other subtask IDs)
- Acceptance criteria
- Module scope
- Risk level

### 4. Create GitHub Issues

Use `gh issue create` for each subtask with:
- Parent issue reference
- Dependency references
- Owner role
- Clear scope and acceptance criteria
- Labels: type:subtask, role:{owner_role}

### 5. Create Local Task Records

Create `tasks/issue-{N}-subtask-{M}/task.yaml` for each subtask with:
- GitHub issue number
- Parent reference
- Dependencies
- Status

### 6. Update Parent Issue

Add to parent issue body:
- Decomposition status
- List of child issues
- Dependency graph
- Completion rule

## Output Format

```
Decomposition required: yes/no

Reason:
- [reasons]

Subtasks:
1. issue-{N}-subtask-01 — [title] (role: X, depends on: [])
2. issue-{N}-subtask-02 — [title] (role: Y, depends on: [subtask-01])
...

Dependencies:
- subtask-02 depends on subtask-01
...

GitHub Issues Created:
- #XXX: [Subtask] Title 1
- #YYY: [Subtask] Title 2

Next active subtask: issue-{N}-subtask-01
Next role: [architect|developer|...]
```

Use the `task-breakdown-and-dispatch` skill for detailed guidance.