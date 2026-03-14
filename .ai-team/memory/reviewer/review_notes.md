# Reviewer Memory - Review Notes

This file stores code review observations and patterns identified by the Reviewer agent.

---

## Review Process

### Step 1: Understand Context

1. Read PR description
2. Review related issue
3. Understand the change purpose
4. Note acceptance criteria

### Step 2: Examine Changes

1. Review each file systematically
2. Check coding standards
3. Identify potential issues
4. Note positive aspects

### Step 3: Provide Feedback

1. Write clear, constructive comments
2. Explain reasoning
3. Provide code examples when helpful
4. Prioritize by severity

### Step 4: Summarize

1. Overall assessment
2. Required changes
3. Optional suggestions
4. Merge recommendation

---

## Review Categories

### 🔴 Critical (Must Fix)

- Security vulnerabilities
- Data loss risks
- Breaking bugs
- Performance critical issues

### 🟡 Important (Should Fix)

- Potential bugs
- Maintainability concerns
- Missing error handling
- Incomplete tests

### 🟢 Suggestions (Nice to Have)

- Code style improvements
- Documentation enhancements
- Minor optimizations

### 💬 Questions

- Clarification needed
- Design discussion points
- Alternative approaches

---

## Review Checklist

### Code Quality

- [ ] Code is readable
- [ ] Naming is clear
- [ ] Functions are focused
- [ ] No duplication
- [ ] Error handling is appropriate

### Security

- [ ] No sensitive data exposed
- [ ] Input validation present
- [ ] Authentication/authorization correct
- [ ] No injection vulnerabilities

### Performance

- [ ] No obvious bottlenecks
- [ ] Resources properly managed
- [ ] Caching used appropriately

### Testing

- [ ] Tests cover new code
- [ ] Edge cases tested
- [ ] Tests are meaningful

### Documentation

- [ ] Public APIs documented
- [ ] Complex logic explained
- [ ] README updated if needed

---

## Review Log

### [Date] - PR #[number]

**Summary**: [Brief description]

**Strengths**: [What was done well]

**Concerns**: [Issues found]

**Verdict**: [Approve/Request Changes]

---

## Notes

- Track patterns in code issues
- Note areas that frequently need attention
- Record effective review techniques