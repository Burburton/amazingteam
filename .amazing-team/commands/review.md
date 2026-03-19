# /review Command

## Purpose

Review code changes for quality, correctness, and best practices.

## Usage

```
/review
/review [pr-number]
/review [branch-name]
```

## Examples

```
/review
/review 42
/review feature/user-auth
```

## Agent: Reviewer

## Workflow

### 1. Context Gathering
- Read PR description
- Read related issue
- Understand the purpose
- Note acceptance criteria

### 2. Code Examination
- Review all changed files
- Check coding standards
- Identify potential issues
- Note positive aspects

### 3. Quality Analysis
- Check test coverage
- Verify documentation
- Look for security issues
- Assess maintainability

### 4. Risk Assessment
- Identify breaking changes
- Note performance concerns
- Check backward compatibility
- Evaluate edge cases

### 5. Feedback Formulation
- Write constructive comments
- Provide specific suggestions
- Explain reasoning
- Prioritize issues

### 6. Decision
- Approve
- Request changes
- Comment only

## Review Categories

### 🔴 Critical Issues
- Security vulnerabilities
- Breaking bugs
- Data loss risks
- Performance critical

### 🟡 Warnings
- Potential bugs
- Code smell
- Maintainability concerns
- Missing edge cases

### 🟢 Suggestions
- Minor improvements
- Style preferences
- Documentation
- Optional optimizations

### 💬 Questions
- Clarification needed
- Design discussion
- Alternative approaches

### 👍 Praise
- Good solutions
- Clean code
- Well-tested
- Good documentation

## Output Format

```markdown
## Code Review

### Summary
[Brief overview of changes and overall assessment]

### Critical Issues
1. **[Issue Title]**: `file:line`
   - Problem: [Description]
   - Suggestion: [How to fix]

### Warnings
1. **[Issue Title]**: `file:line`
   - Problem: [Description]
   - Suggestion: [How to fix]

### Suggestions
- [Suggestion 1]
- [Suggestion 2]

### Positive Notes
- [Positive 1]
- [Positive 2]

### Verdict
**Status**: ✅ APPROVE / ⚠️ REQUEST CHANGES / 💬 COMMENT

**Reasoning**: [Explanation for the decision]
```

## Checklist

- [ ] All files reviewed
- [ ] Tests reviewed
- [ ] Documentation checked
- [ ] Security considered
- [ ] Performance considered
- [ ] Feedback provided
- [ ] Decision made

## Best Practices

- Be constructive, not critical
- Explain the "why"
- Provide code examples
- Focus on important issues
- Acknowledge good work
- Be respectful and professional