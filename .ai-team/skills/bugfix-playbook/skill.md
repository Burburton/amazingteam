# Bug Fix Playbook

## Purpose

This skill provides a systematic approach to identifying, analyzing, and fixing bugs.

## When to Use

- Fixing reported bugs
- Debugging production issues
- Investigating test failures
- Resolving regression issues

## Steps

### 1. Reproduce the Bug

```
1. Document exact reproduction steps
2. Verify the bug exists in current version
3. Identify if bug is environment-specific
4. Create minimal reproduction case
5. Capture relevant logs/errors
```

### 2. Gather Information

```
1. Review bug report details
2. Check for related issues (past or present)
3. Review recent changes that might be related
4. Collect stack traces and error logs
5. Note any user-reported symptoms
```

### 3. Locate the Source

```
1. Use stack traces to identify locations
2. Search for error messages in codebase
3. Trace execution flow from entry point
4. Use debugging tools (logs, breakpoints, etc.)
5. Identify the specific file and function
```

### 4. Analyze the Root Cause

```
1. Understand the expected behavior
2. Compare with actual behavior
3. Identify why the discrepancy occurs
4. Consider edge cases
5. Document the root cause clearly
```

### 5. Design the Fix

```
1. Determine the minimal change needed
2. Consider potential side effects
3. Think about similar issues elsewhere
4. Plan any necessary refactoring
5. Document the fix approach
```

### 6. Implement the Fix

```
1. Write the fix (minimal, targeted)
2. Add/update tests
3. Verify fix resolves the issue
4. Run all tests to catch regressions
5. Update documentation if needed
```

### 7. Verify the Solution

```
1. Reproduce original bug (should fail before fix)
2. Apply fix
3. Verify bug is resolved
4. Run test suite
5. Manual testing of affected area
6. Check for related issues
```

## Root Cause Analysis Template

```markdown
## Bug Analysis: [Bug Title]

### Issue
[Description of the bug]

### Symptoms
- [Symptom 1]
- [Symptom 2]

### Root Cause
[Explanation of why the bug occurs]

### Affected Code
- `file_path:line_number` - [Description]

### Fix Approach
[Description of how to fix]

### Risk Assessment
- **Risk Level**: [Low/Medium/High]
- **Impact if unfixed**: [Description]
- **Potential side effects**: [Description]

### Tests to Add
1. [Test case 1]
2. [Test case 2]
```

## Commit Message Template

```
fix(scope): brief description of the fix

- What was the issue
- What was the root cause
- How it was fixed

Fixes #issue-number
```

## Checklist

- [ ] Bug reproduced
- [ ] Root cause identified
- [ ] Fix implemented (minimal change)
- [ ] Tests added for the bug
- [ ] All tests pass
- [ ] No regressions detected
- [ ] Documentation updated (if needed)
- [ ] PR created with proper description

## Common Bug Patterns

### Null/Undefined Errors
- Missing null checks
- Uninitialized variables
- Optional chaining issues

### Logic Errors
- Off-by-one errors
- Incorrect conditions
- Missing edge cases

### Async Issues
- Race conditions
- Unhandled promises
- Incorrect async/await usage

### State Issues
- Stale state
- Incorrect state updates
- Missing state reset

### Integration Issues
- API contract mismatch
- Version incompatibility
- Environment differences

## Best Practices

- Fix the root cause, not the symptom
- Add regression tests for all bugs
- Keep fixes minimal and focused
- Update documentation if behavior changes
- Consider if similar bugs exist elsewhere