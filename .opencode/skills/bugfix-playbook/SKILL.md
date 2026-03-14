---
name: bugfix-playbook
description: Systematic approach to identifying, analyzing, and fixing bugs
license: MIT
---
# Bug Fix Playbook

## When to Use

- Fixing reported bugs
- Debugging production issues
- Investigating test failures
- Resolving regression issues

## Steps

### 1. Reproduce the Bug
1. Document exact reproduction steps
2. Verify the bug exists in current version
3. Create minimal reproduction case
4. Capture relevant logs/errors

### 2. Gather Information
1. Review bug report details
2. Check for related issues
3. Review recent changes
4. Collect stack traces

### 3. Locate the Source
1. Use stack traces to identify locations
2. Search for error messages in codebase
3. Trace execution flow
4. Identify the specific file and function

### 4. Analyze the Root Cause
1. Understand the expected behavior
2. Compare with actual behavior
3. Identify why the discrepancy occurs
4. Document the root cause clearly

### 5. Design the Fix
1. Determine the minimal change needed
2. Consider potential side effects
3. Plan any necessary refactoring

### 6. Implement the Fix
1. Write the fix (minimal, targeted)
2. Add/update tests
3. Verify fix resolves the issue
4. Run all tests to catch regressions

## Root Cause Analysis Template

```markdown
## Bug Analysis: [Bug Title]

### Issue
[Description of the bug]

### Root Cause
[Explanation of why the bug occurs]

### Affected Code
- `file_path:line_number` - [Description]

### Fix Approach
[Description of how to fix]

### Tests to Add
1. [Test case 1]
2. [Test case 2]
```

## Checklist

- [ ] Bug reproduced
- [ ] Root cause identified
- [ ] Fix implemented (minimal change)
- [ ] Tests added for the bug
- [ ] All tests pass
- [ ] No regressions detected