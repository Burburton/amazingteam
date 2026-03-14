---
name: task-breakdown-and-dispatch
description: Decompose complex tasks into actionable subtasks and coordinate workflow
license: MIT
---
# Task Breakdown and Dispatch

## When to Use

- Starting a new feature
- Planning a sprint
- Breaking down epics
- Coordinating multi-agent work

## Steps

### 1. Analyze the Task
1. Understand the overall goal
2. Identify major components
3. Note dependencies
4. Estimate complexity

### 2. Break Down into Subtasks
1. Create atomic, actionable items
2. Each subtask should be completable in one session
3. Define clear acceptance criteria
4. Identify the agent best suited for each

### 3. Order and Prioritize
1. Identify blocking dependencies
2. Order tasks logically
3. Mark parallelizable tasks
4. Set priorities (critical, high, medium, low)

### 4. Dispatch to Agents
1. Assign tasks to appropriate agents
2. Provide context and requirements
3. Set expectations for output
4. Define handoff criteria

## Task Manifest Template

```yaml
id: issue-123
title: Task title
type: feature | bug | refactor | docs | tech
status: backlog | ready | in_progress | blocked | done
priority: critical | high | medium | low
owner_role: planner | architect | developer | qa | reviewer
depends_on: []
acceptance_criteria:
  - Criterion 1
  - Criterion 2
subtasks:
  - id: subtask-1
    title: Subtask title
    agent: developer
    status: pending
```

## Workflow State Machine

```
backlog → ready → in_progress → done
                     ↓
                  blocked
```

## Checklist

- [ ] Task analyzed
- [ ] Subtasks created
- [ ] Dependencies identified
- [ ] Priorities set
- [ ] Agents assigned
- [ ] Task manifest created