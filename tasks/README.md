# Task Memory Directory

This directory contains task-scoped memory for each issue/feature.

## Purpose

Each task gets its own subdirectory (`issue-{id}/`) containing:
- Analysis notes
- Design documents
- Implementation notes
- Validation records
- Review outcomes

For decomposed tasks, subtask directories (`issue-{id}-subtask-{n}/`) contain:
- Focused implementation notes
- Subtask-specific validation
- Review records

## Structure

```
tasks/
├── issue-101/
│   ├── task.yaml              # Parent task manifest
│   ├── analysis.md            # Architect's analysis
│   ├── design.md              # Design document
│   ├── implementation.md      # Developer's notes
│   ├── validation.md          # QA's validation record
│   └── review.md              # Reviewer's findings
│
├── issue-101-subtask-01/      # Subtask directory
│   ├── task.yaml              # Subtask manifest (with github_issue, parent_task)
│   ├── implementation.md      # Implementation notes
│   ├── validation.md          # Validation record
│   └── review.md              # Review findings
│
├── issue-102/
│   └── ...
│
└── README.md                  # This file
```

## GitHub Issue Mapping

Task manifests include GitHub issue references:

```yaml
github_issue: 101
github_url: https://github.com/org/repo/issues/101
parent_task: null       # null for parent tasks
parent_github_issue: null
```

Subtask manifests:

```yaml
github_issue: 201
github_url: https://github.com/org/repo/issues/201
parent_task: issue-101
parent_github_issue: 101
depends_on: [200]       # GitHub issue numbers
```

## Lifecycle

1. **Creation**: Task directory is created when work begins
2. **Decomposition**: Planner may create subtask directories
3. **Active**: Files are updated during task execution
4. **Completed**: Task memory is preserved for traceability
5. **Archive**: Optionally archived after project milestones

## Permissions

| Role | Can Read | Can Write |
|------|----------|-----------|
| Planner | All tasks | task.yaml, subtask manifests |
| Architect | All tasks | analysis.md, design.md |
| Developer | Current task | implementation.md |
| QA | Current task | validation.md |
| Reviewer | Current task | review.md |

## Naming Convention

- Parent task: `issue-{github-issue-number}`
- Subtask: `issue-{parent-number}-subtask-{sequence}`
- Files: `[role]-notes.md` or by phase name

## Notes

- Task memory helps maintain context across sessions
- Provides traceable history of decisions
- GitHub issues are the visible work graph
- Local task memory is the execution memory
- Both should be kept in sync