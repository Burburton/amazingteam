# /triage Command

## Purpose

Classify and prioritize issues, determining the appropriate workflow and next steps.

## Usage

```
/triage [issue-number]
/triage
```

## Examples

```
/triage 123
/triage
```

## Agent: Architect

## Workflow

### 1. Issue Analysis

- Read the issue content
- Understand the request type
- Identify key information
- Note missing details

### 2. Classification

Determine the issue type:

| Type | Indicators | Workflow |
|------|------------|----------|
| Feature | New capability, enhancement | feature workflow |
| Bug | Error, crash, incorrect behavior | bugfix workflow |
| Tech Task | Refactoring, dependency, performance | tech workflow |
| Question | Clarification, discussion | respond directly |
| Invalid | Spam, duplicate, not actionable | close/comment |

### 3. Priority Assessment

Assess priority based on:

| Factor | Points |
|--------|--------|
| Blocks other work | +3 |
| Security issue | +3 |
| Customer impact | +2 |
| Regression | +2 |
| Easy fix | +1 |
| Long-standing | -1 |

**Priority Levels:**
- **P0 Critical**: Immediate attention required
- **P1 High**: Should be addressed soon
- **P2 Medium**: Normal priority
- **P3 Low**: Nice to have

### 4. Label Assignment

Apply appropriate labels:

| Category | Labels |
|----------|--------|
| Type | `feature`, `bug`, `tech-debt`, `question` |
| Priority | `priority:critical`, `priority:high`, `priority:medium`, `priority:low` |
| Module | `module:core`, `module:api`, `module:ui`, etc. |
| Status | `needs-info`, `ready`, `blocked` |

### 5. Next Steps

Determine and document:
- Which agent should handle next
- What information is needed
- Any dependencies or blockers

## Output Format

```markdown
## Triage Report

### Classification
- **Type**: [Feature/Bug/Tech Task/Question]
- **Priority**: [P0/P1/P2/P3]
- **Module**: [Affected module(s)]

### Summary
[Brief summary of the issue]

### Assessment
[Analysis of the issue]

### Labels Applied
- `label1`
- `label2`

### Next Steps
1. [Next step 1]
2. [Next step 2]

### Recommended Agent
[Agent name] - [Reason]

### Questions/Clarifications Needed
- [Question 1]
- [Question 2]
```

## Checklist

- [ ] Issue type determined
- [ ] Priority assigned
- [ ] Labels applied
- [ ] Module identified
- [ ] Next steps documented
- [ ] Recommended agent specified

## Automation

When `/triage` is run:

1. Analyze issue content
2. Apply classification labels
3. Set priority label
4. Assign to appropriate module
5. Comment with triage report
6. Recommend next action

## Notes

- Triage should be fast but thorough
- When in doubt, ask for clarification
- Don't assume missing context
- Keep the triage report concise