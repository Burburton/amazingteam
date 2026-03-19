# Developer Memory - Bug Investigation

This file records bug investigation patterns and common issues discovered by the Developer agent.

---

## Bug Categories

### Common Bug Types

| Type | Symptoms | Common Causes | Fix Pattern |
|------|----------|---------------|-------------|
| Null/Undefined | Runtime errors | Missing checks | Add null guards |
| Logic Error | Wrong output | Incorrect conditions | Fix condition logic |
| Race Condition | Intermittent failures | Async timing | Add synchronization |
| State Bug | UI inconsistent | Stale state | Force re-render/reload |

---

## Investigation Process

### Step 1: Reproduce

1. Get exact reproduction steps
2. Create minimal reproduction case
3. Verify bug exists in current version
4. Document environment details

### Step 2: Locate

1. Use stack traces to find location
2. Search for error messages
3. Trace execution flow
4. Identify affected files

### Step 3: Analyze

1. Understand expected behavior
2. Compare with actual behavior
3. Identify root cause
4. Consider similar issues

### Step 4: Fix

1. Write failing test
2. Make minimal fix
3. Verify fix resolves issue
4. Check for regressions

---

## Bug Investigation Log

### [Date] - [Bug Title]

**Issue**: [Issue number]

**Symptoms**: [What was observed]

**Root Cause**: [Why it happened]

**Location**: `file:line`

**Fix**: [What was changed]

**Lessons Learned**: [What can be applied elsewhere]

---

## Recurring Issues

| Issue | Frequency | Pattern | Prevention |
|-------|-----------|---------|------------|
| | | | |

---

## Debugging Tools

### Useful Commands

```bash
# Run specific test
npm test -- --testNamePattern="test name"

# Debug with Node
node --inspect-brk dist/index.js

# Check types
npm run typecheck

# Lint
npm run lint
```

---

## Notes

- Document bugs that reveal patterns
- Note investigation techniques that work well
- Track recurring issues for prevention