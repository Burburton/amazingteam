---
description: Resume a blocked workflow after blocker resolution
agent: planner
---
Resume a previously blocked workflow after the blocker has been resolved.

## Usage

Comment on the blocked issue:

```
/oc /resume
```

Or with additional context:

```
/oc /resume
The permission issue has been fixed. Please continue from where you left off.
```

## When to Use

Use `/resume` when:
- A blocker sub-issue has been resolved
- Human has provided required input/approval
- External dependency is now available
- Permission/access has been granted

## Process

1. **Verify Blocker Resolution**
   - Check blocker sub-issue status
   - Verify fix was applied
   - Confirm dependencies are available

2. **Restore Workflow State**
   - Load saved workflow state
   - Identify last successful step
   - Prepare to continue

3. **Resume Execution**
   - Continue from where workflow paused
   - Execute remaining steps
   - Create PR when complete

## Output

```markdown
## Workflow Resumed

- **Original Issue**: #{issue_id}
- **Blocker**: #{blocker_id} - ✅ Resolved
- **Resuming From**: {phase}
- **Status**: In progress...

Continuing with {next_step}...
```

## If Blocker Not Resolved

```markdown
## Cannot Resume

- **Blocker**: #{blocker_id} - ❌ Not resolved
- **Status**: {blocker_status}

### Required Actions
{list of required actions to resolve blocker}

Please resolve the blocker first, then run `/resume` again.
```

## Example

```
User: /oc /resume
      Branch protection has been disabled temporarily.

Planner:
## Workflow Resumed

- **Original Issue**: #120
- **Blocker**: #206 (Permission denied) - ✅ Resolved
- **Resuming From**: Implementation phase

Continuing with implementation...
```