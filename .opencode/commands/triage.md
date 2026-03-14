---
description: Classify issue, determine decomposition need, and perform initial analysis
agent: triage
---
Classify this issue, determine whether decomposition is needed, and perform initial analysis.

## Steps

### 1. Read Issue Description

Understand:
- What is being reported or requested?
- What is the expected behavior?
- What is the actual behavior (for bugs)?
- What is the business goal (for features)?

### 2. Classify by Type

| Type | Indicators |
|------|------------|
| bug | Error, crash, incorrect behavior |
| feature | New functionality, enhancement |
| tech-task | Refactoring, dependency update, infrastructure |
| docs | Documentation changes |

### 3. Assess Priority and Severity

**Severity (bugs):**
- critical: System down, data loss, security issue
- high: Major feature broken, no workaround
- medium: Feature partially broken, workaround exists
- low: Minor issue, cosmetic

**Priority:**
- critical: Immediate action required
- high: This sprint
- medium: Next sprint
- low: Backlog

### 4. Determine Decomposition Need

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
- No architecture decision needed
- One implementation step sufficient
- One PR likely enough
- Simple validation

### 5. Perform Initial Investigation

- Check if similar issues exist
- Identify affected files/modules
- Note relevant code paths
- Check for related PRs

### 6. Suggest Next Steps

Based on classification and decomposition decision:

| Scenario | Next Step |
|----------|-----------|
| Bug, no decomposition | /implement |
| Bug, needs decomposition | /breakdown-issue |
| Feature, no decomposition | /design |
| Feature, needs decomposition | /breakdown-issue |
| Unclear issue | Ask for clarification |

## Output Format

```
Triage Report
=============

Issue: #{number} - {title}

Classification:
- Type: bug | feature | tech-task | docs
- Severity: critical | high | medium | low
- Priority: critical | high | medium | low

Scope Analysis:
- Affected modules: [list]
- Affected components: [list]
- Related issues: [list]

Decomposition Decision: required | not_required

Reason:
- [reasons for decomposition decision]

Estimated Complexity: simple | moderate | complex

Recommended Next Steps:
1. [first action]
2. [second action]

Command: /breakdown-issue | /design | /implement
```

Use the `issue-triage` skill for systematic classification.