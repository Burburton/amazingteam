# Issue Triage

## Purpose

This skill provides a systematic approach to classifying, prioritizing, and performing initial analysis on incoming issues.

## When to Use

- New issue created
- Bug report received
- Feature request submitted
- Starting work on untriaged issues

## Steps

### 1. Initial Classification

```
1. Read issue title and description
2. Classify issue type:
   - bug: Something is broken
   - feature: New functionality requested
   - enhancement: Improvement to existing feature
   - docs: Documentation issue
   - tech: Technical debt or infrastructure
   - question: Clarification needed
3. Assign priority:
   - critical: Blocks production or security issue
   - high: Major functionality impacted
   - medium: Standard priority
   - low: Nice to have
```

### 2. Validation

```
1. Verify issue is reproducible
2. Check for duplicate issues
3. Validate user-provided information
4. Request missing information if needed
5. Add reproduction steps if missing
```

### 3. Root Cause Investigation

```
1. Examine error messages and stack traces
2. Identify affected components
3. Review recent changes to affected areas
4. Check logs for related errors
5. Document findings
```

### 4. Scope Assessment

```
1. Identify affected modules
2. Determine if fix requires:
   - Single file change
   - Multiple files
   - Architectural change
   - External dependency update
3. Assess risk level
4. Estimate effort (small/medium/large)
```

### 5. Assignment Decision

```
1. Determine appropriate owner:
   - architect: Design needed
   - developer: Implementation needed
   - qa: Testing focus
   - triage: More investigation needed
2. Add appropriate labels
3. Link related issues
4. Set milestone if applicable
```

### 6. Documentation

```
1. Update issue with analysis
2. Add investigation notes
3. Document reproduction steps
4. Link to relevant code
5. Provide recommendation
```

## Triage Report Template

```markdown
## Triage Analysis: [Issue Title]

### Classification
- **Type**: bug | feature | enhancement | docs | tech | question
- **Priority**: critical | high | medium | low
- **Risk Level**: low | medium | high

### Summary
[Brief summary of the issue]

### Root Cause Analysis
[Findings from investigation, if applicable]

### Affected Components
- `module/component` - [Impact description]

### Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Recommendation
- **Owner**: architect | developer | qa
- **Effort**: small | medium | large
- **Notes**: [Additional context]

### Related Issues
- #[issue number] - [description]
```

## Classification Matrix

| Symptom | Likely Type | Likely Priority |
|---------|-------------|-----------------|
| Production down | bug | critical |
| Data loss | bug | critical |
| Security vulnerability | bug | critical |
| Feature not working | bug | high |
| Performance degradation | bug | medium |
| UI glitch | bug | low |
| New capability needed | feature | medium |
| Improvement request | enhancement | low |
| Missing documentation | docs | low |

## Checklist

- [ ] Issue type classified
- [ ] Priority assigned
- [ ] Duplicates checked
- [ ] Reproduction steps verified
- [ ] Root cause investigated
- [ ] Scope assessed
- [ ] Owner assigned
- [ ] Labels added
- [ ] Documentation complete

## Best Practices

- Always verify before assigning priority
- Request more info rather than guessing
- Check recent commits for context
- Link related issues
- Document even negative findings
- Update issue status promptly
- Follow up on blocked issues