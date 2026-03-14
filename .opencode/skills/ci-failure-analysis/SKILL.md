---
name: ci-failure-analysis
description: Investigate CI failures systematically and find root causes
license: MIT
---
# CI Failure Analysis

## When to Use

- CI pipeline failed
- Tests failing in CI but not locally
- Build errors
- Deployment failures

## Analysis Steps

### 1. Identify Failure Type
- **Build failure**: Compilation/transpilation error
- **Test failure**: Tests not passing
- **Lint failure**: Code style issues
- **Deploy failure**: Deployment step failed

### 2. Gather Information
1. Read the CI logs
2. Identify the failing step
3. Note the error message
4. Check for recent changes

### 3. Analyze Root Cause

#### Build Failures
- Missing dependencies
- Type errors
- Syntax errors
- Configuration issues

#### Test Failures
- Flaky tests
- Environment differences
- Missing test data
- Timing issues

#### Lint Failures
- New lint rules
- Code style violations
- Unused imports

### 4. Propose Fix
1. Identify the minimal fix
2. Consider side effects
3. Document the solution

## Common CI Issues

### Environment Differences
```bash
# Check Node version
node --version

# Check package versions
npm list [package]
```

### Flaky Tests
- Look for timing issues
- Check for race conditions
- Verify test isolation

### Memory Issues
- Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Check for memory leaks

## Report Template

```markdown
## CI Failure Analysis

### Failure Type
[Build|Test|Lint|Deploy]

### Error Message
```
[Paste error]
```

### Root Cause
[Explanation]

### Fix
[Proposed solution]

### Prevention
[How to prevent in future]
```