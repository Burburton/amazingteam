# Issue Blocker Resolution Design

## Overview

This document defines the process for handling blockers encountered during automated workflow execution.

## Problem Handling Flow

```
Workflow Execution
        │
        ▼ (Encounter Problem)
┌───────────────┐
│ Problem Detect│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Dispatch    │
│ to CI Analyst │
│   (Diagnose)  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Classification│
│  & Analysis   │
└───────┬───────┘
        │
        ▼
   ┌────┴────┐
   │Decision │
   └────┬────┘
        │
   ┌────┴────────────────┐
   ↓                     ↓
Can Resolve           Cannot Resolve
Now                    │
   │                     ▼
   │            ┌────────────────┐
   │            │ Create Sub-issue│
   │            │   (Blocker)     │
   │            └───────┬────────┘
   │                    │
   │                    ▼
   │               ┌────┴────┐
   │               │ Needs   │
   │               │ Human?  │
   │               └────┬────┘
   │                    │
   │           ┌────────┴────────┐
   │           ↓                 ↓
   │          Yes               No
   │           │                 │
   │           ▼                 ▼
   │    ┌─────────────┐   ┌─────────────┐
   │    │ Notify Human│   │ Auto-resolve│
   │    │ (Wait)      │   │ Sub-issue   │
   │    └──────┬──────┘   └──────┬──────┘
   │           │                 │
   │           │                 ▼
   │           │          Sub-issue Done
   │           │                 │
   │           └────────┬────────┘
   │                    │
   └────────────────────┤
                        ▼
               Resume Original Task
```

## Blocker Categories

### Category 1: Auto-Resolvable

| Blocker Type | Description | Resolution |
|--------------|-------------|------------|
| Code Error | Syntax, type errors | Auto-fix by Developer |
| Missing Import | Import statement missing | Auto-add import |
| Test Failure | Logic error in test | Auto-fix test |
| Lint Error | Style violation | Auto-fix with linter |
| Missing Dependency | Package not installed | Auto-install |
| Config Error | Wrong configuration | Auto-correct |

### Category 2: Sub-issue Resolvable (AI)

| Blocker Type | Description | Action |
|--------------|-------------|--------|
| Complex Bug | Requires investigation | Create sub-issue, auto-resolve |
| API Change | External API changed | Create sub-issue, adapt code |
| Performance Issue | Slow performance | Create sub-issue, optimize |
| Missing Feature | Prerequisite not implemented | Create sub-issue, implement |

### Category 3: Human Required

| Blocker Type | Description | Action |
|--------------|-------------|--------|
| Permission Denied | No access to resource | Notify human, wait |
| Secret Missing | API key or credential needed | Notify human, wait |
| Architecture Decision | Major design choice | Notify human, wait |
| External Dependency | Third-party service down | Notify human, wait |
| Business Logic Unclear | Requirements ambiguous | Notify human, wait |
| Security Issue | Potential vulnerability | Notify human, wait |

## Decision Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKER RESOLUTION MATRIX                     │
├─────────────────┬───────────────┬─────────────┬────────────────┤
│     Factor      │    Low        │   Medium    │     High       │
├─────────────────┼───────────────┼─────────────┼────────────────┤
│ Complexity      │ Auto-fix now  │ Sub-issue   │ Notify Human   │
│ Risk            │ Auto-fix now  │ Sub-issue   │ Notify Human   │
│ External Dep    │ Sub-issue     │ Sub-issue   │ Notify Human   │
│ Permission      │ Sub-issue     │ Notify Human│ Notify Human   │
│ Business Impact │ Auto-fix now  │ Sub-issue   │ Notify Human   │
└─────────────────┴───────────────┴─────────────┴────────────────┘
```

## Process Details

### Step 1: Problem Detection

When workflow encounters an error:
1. Capture error context
2. Save current workflow state
3. Pause workflow execution
4. Dispatch to CI Analyst

### Step 2: Diagnosis (CI Analyst)

CI Analyst performs:
1. Analyze error logs
2. Identify root cause
3. Classify blocker type
4. Determine resolution path
5. Estimate resolution effort

Output:
```markdown
## Blocker Analysis

- **Type**: [code/infra/permission/external/unknown]
- **Severity**: [low/medium/high/critical]
- **Complexity**: [simple/moderate/complex]
- **Risk Level**: [low/medium/high]
- **Can Auto-Resolve**: [yes/no/partial]
- **Needs Human**: [yes/no]

### Root Cause
[Description]

### Recommended Action
- [ ] Auto-fix now
- [ ] Create sub-issue (AI resolve)
- [ ] Create sub-issue (Human required)
- [ ] Notify human immediately
```

### Step 3: Resolution Path

#### Path A: Auto-Resolve Now

For simple, low-risk blockers:
1. Developer fixes the issue
2. Continue workflow immediately
3. Log the fix

#### Path B: Create Sub-issue (AI Resolve)

For moderate complexity blockers:
1. Create blocker sub-issue
2. Execute sub-issue resolution
3. Verify fix
4. Continue original workflow

#### Path C: Notify Human

For blockers requiring human intervention:
1. Create blocker sub-issue
2. Send notification
3. Pause workflow
4. Wait for human resolution
5. Resume after human input

## Sub-issue Creation

### Blocker Sub-issue Template

```bash
gh issue create \
  --title "[Blocker] {blocker_description}" \
  --body "## Parent Issue
#{parent_issue_id}

## Blocking Reason
{why this blocks the workflow}

## Analysis
- **Type**: {type}
- **Severity**: {severity}
- **Complexity**: {complexity}

## Root Cause
{root_cause}

## Recommended Resolution
{suggested_fix}

## Requires Human
{yes/no}

## Reason for Human Involvement
{if yes, explain why AI cannot resolve}

## Acceptance Criteria
- [ ] Blocker resolved
- [ ] Workflow can resume

## Impact
- **Blocked Issue**: #{parent_issue_id}
- **Blocked Workflow Phase**: {phase}
- **Time Sensitive**: {yes/no}" \
  --label "type:blocker,priority:{priority}"
```

## Human Notification

### Notification Channels

| Channel | When to Use |
|---------|-------------|
| Issue Comment | Always (primary) |
| Email | Critical blockers, time-sensitive |
| Slack/Teams | Critical blockers requiring immediate attention |

### Notification Template

```markdown
## ⚠️ Workflow Blocked - Human Attention Required

**Issue**: #{issue_id} - {issue_title}
**Blocker**: #{blocker_issue_id} - {blocker_title}

### Summary
{brief description of the blocker}

### Why Human is Needed
{explanation of why AI cannot resolve}

### Suggested Actions
1. {action_1}
2. {action_2}

### Resume Command
After resolving the blocker, comment:
```
/oc /resume
```

### Time Sensitivity
{critical/high/medium/low}

---
*This is an automated notification from the AI Team workflow.*
```

## Resume Workflow

After blocker resolution:
1. Verify blocker is resolved
2. Restore workflow state
3. Continue from last successful step
4. Log resolution

### Resume Command

```markdown
/oc /resume

# Or with additional context
/oc /resume
The permission issue has been fixed. Please continue.
```

## Examples

### Example 1: Auto-Resolvable

```
Error: Cannot find module './utils'

CI Analyst Diagnosis:
- Type: code
- Severity: low
- Can Auto-Resolve: yes
- Action: Add missing import

Resolution: Developer adds import, workflow continues.
```

### Example 2: Sub-issue (AI Resolve)

```
Error: API endpoint /v2/users not found

CI Analyst Diagnosis:
- Type: external
- Severity: medium
- Can Auto-Resolve: no (requires code change)
- Needs Human: no
- Action: Create sub-issue to update API endpoint

Resolution:
1. Create sub-issue #205: Update API endpoint to /v3/users
2. Developer implements fix
3. Tests pass
4. Resume original workflow
```

### Example 3: Human Required

```
Error: Permission denied: Cannot push to protected branch 'main'

CI Analyst Diagnosis:
- Type: permission
- Severity: high
- Can Auto-Resolve: no
- Needs Human: yes (branch protection rules)
- Action: Notify human

Resolution:
1. Create blocker sub-issue #206
2. Post notification on parent issue
3. Send email if critical
4. Wait for human to:
   - Temporarily disable branch protection
   - OR grant required permissions
   - OR provide alternative approach
5. Human comments `/oc /resume`
6. Continue workflow
```

## Integration with /auto Command

The `/auto` command integrates blocker handling:

```markdown
## /auto Command Flow with Blockers

1. Triage → Design → Implement
2. If blocker encountered:
   a. Pause
   b. Dispatch to CI Analyst
   c. Diagnose
   d. Resolve (auto/sub-issue/human)
   e. Resume
3. Continue: Test → Create PR
```

## Metrics

Track blocker metrics for improvement:

| Metric | Description |
|--------|-------------|
| Blocker Rate | Blockers per issue |
| Auto-Resolve Rate | % auto-resolved |
| Human Intervention Rate | % requiring human |
| Avg Resolution Time | Time to unblock |
| Common Blocker Types | Most frequent blockers |