---
name: issue-triage
description: Classify issues by type, priority, and assign appropriate handling
license: MIT
---
# Issue Triage

## When to Use

- New issue created
- Bug reports received
- Feature requests submitted
- Technical debt identified

## Classification Categories

### Type
- **bug**: Something is broken
- **feature**: New functionality requested
- **enhancement**: Improvement to existing feature
- **tech**: Technical task (refactor, upgrade, etc.)
- **docs**: Documentation changes

### Priority
- **critical**: Blocks production or major functionality
- **high**: Significant impact, should be addressed soon
- **medium**: Normal priority, standard timeline
- **low**: Nice to have, can wait

### Severity (for bugs)
- **blocker**: System unusable
- **major**: Significant functionality broken
- **minor**: Small issue, workaround available
- **cosmetic**: UI/UX issue, no functional impact

## Triage Steps

### 1. Read the Issue
1. Understand the reported problem/request
2. Identify the reporter's intent
3. Note any reproduction steps

### 2. Classify
1. Determine the type
2. Assess priority
3. Estimate severity (if bug)
4. Identify affected components

### 3. Validate
1. Reproduce the issue (if bug)
2. Verify it's not a duplicate
3. Check for related issues

### 4. Assign
1. Identify the right agent
2. Add appropriate labels
3. Set milestone if applicable

## Issue Template

```markdown
## Classification
- **Type**: [bug|feature|enhancement|tech|docs]
- **Priority**: [critical|high|medium|low]
- **Severity**: [blocker|major|minor|cosmetic]

## Summary
[Brief description]

## Affected Components
- [Component 1]
- [Component 2]

## Next Steps
1. [Action 1]
2. [Action 2]

## Assigned To
[Agent name]
```