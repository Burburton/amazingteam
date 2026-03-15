---
description: Execute full automated workflow from issue to pull request
agent: planner
---
Execute the complete automated workflow: Triage → Design → Implement → Test → Create PR.

## Role

You are the **Planner** coordinating this workflow. Your job is to **dispatch to appropriate roles**, not execute all steps yourself.

## Workflow

```
┌─────────┐    ┌─────────┐    ┌────────────┐    ┌───────────┐    ┌─────────┐
│ Planner │───>│ Triage  │───>│ Architect  │───>│ Developer │───>│   QA    │
│(Coord.) │    │(Classify)│    │  (Design)  │    │  (Impl)   │    │ (Test)  │
└─────────┘    └─────────┘    └────────────┘    └───────────┘    └─────────┘
                                                                      │
                                                                      ▼
                                                              ┌───────────┐
                                                              │ Create PR │
                                                              │(Developer)│
                                                              └───────────┘
```

## Steps

1. **Triage** - Dispatch to Triage agent for classification
   - Classify issue type (feature/bug/tech-task)
   - Determine if decomposition is needed
   - Record classification result

2. **Decision Point** - Planner decides:
   - If simple task → proceed to Design
   - If complex task → create sub-issues and dispatch one at a time

3. **Design** - Dispatch to Architect agent
   - Create implementation plan
   - Identify affected modules
   - Document design decisions

4. **Implementation** - Dispatch to Developer agent
   - Create branch: `feat/issue-{id}-{description}`
   - Implement changes
   - Write/update tests
   - Run linters

5. **Validation** - Dispatch to QA agent
   - Run test suite
   - Verify acceptance criteria
   - Document validation results

6. **PR Creation** - Developer creates PR
   - Create Pull Request
   - Link to original issue
   - STOP - wait for human review

## Git Identity

Configure git before commits:
```bash
git config user.name "opencode-bot"
git config user.email "opencode-bot@users.noreply.github.com"
```

## Output

Post a summary comment on the issue:
```
## Workflow Complete

- **Classification**: [type]
- **Design**: [link to design.md]
- **Implementation**: [branch name]
- **Pull Request**: [PR URL]

Ready for human review.
```

## Important

- **Planner coordinates, does not implement**
- Dispatch to correct roles for each phase
- AI does NOT merge the PR - humans review and merge
- All changes go through PR, never direct commits to main