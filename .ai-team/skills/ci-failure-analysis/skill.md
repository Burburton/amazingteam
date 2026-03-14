# CI Failure Analysis

## Purpose

This skill provides systematic investigation and resolution of CI pipeline failures.

## When to Use

- CI pipeline failure
- Flaky test investigation
- Build failure diagnosis
- Infrastructure issue investigation

## Steps

### 1. Gather Failure Context

```
1. Identify failed pipeline/stage
2. Collect error messages and logs
3. Note failure timestamp and branch
4. Identify commit that triggered failure
5. Check if failure is intermittent or consistent
```

### 2. Classify Failure Type

```
1. Build failure:
   - Compilation error
   - Dependency resolution failure
   - Configuration error
2. Test failure:
   - Unit test failure
   - Integration test failure
   - E2E test failure
3. Infrastructure failure:
   - Resource unavailability
   - Timeout
   - Network issue
4. Code quality failure:
   - Lint error
   - Type error
   - Security scan failure
```

### 3. Analyze Root Cause

```
1. Examine error stack trace
2. Check recent changes to affected files
3. Compare with previous successful builds
4. Identify environment differences
5. Check for resource constraints
```

### 4. Check Known Patterns

```
1. Query failure library for similar issues
2. Check docs/runbooks/ci/ for known problems
3. Review .ai-team/memory/failures/ for patterns
4. Identify if this is a recurring issue
5. Note any infrastructure issues
```

### 5. Determine Fix Strategy

```
1. Code fix:
   - Identify files to change
   - Determine minimal fix
   - Create fix branch
2. Configuration fix:
   - Identify config files
   - Update settings
   - Test locally
3. Infrastructure fix:
   - Document infrastructure issue
   - Request infrastructure support
   - Add workaround if possible
```

### 6. Implement and Verify

```
1. Apply fix
2. Run relevant tests locally
3. Push fix to CI
4. Monitor pipeline
5. Document resolution
```

### 7. Update Knowledge Base

```
1. If new failure pattern: add to failure library
2. If infrastructure issue: update runbook
3. Document solution for future reference
4. Update CI memory if recurring issue
```

## Failure Analysis Report Template

```markdown
## CI Failure Analysis: [Build #]

### Summary
- **Pipeline**: [Pipeline name]
- **Stage**: [Failed stage]
- **Branch**: [Branch name]
- **Commit**: [Commit hash]
- **Timestamp**: [Failure time]

### Failure Classification
- **Type**: build | test | infrastructure | quality
- **Severity**: blocking | non-blocking
- **Pattern**: new | recurring | flaky

### Error Details
```
[Paste relevant error logs]
```

### Root Cause
[Explanation of why the failure occurred]

### Affected Files
- `path/to/file.ts` - [Impact description]

### Resolution
- **Fix Type**: code | config | infrastructure
- **Fix Description**: [How to fix]
- **PR/Commit**: [Reference to fix]

### Prevention
[How to prevent this in the future]

### Related Issues
- #[issue number] - [description]
```

## Failure Classification Matrix

| Error Type | Likely Cause | Investigation Path |
|------------|--------------|---------------------|
| Compilation error | Syntax/type error | Check error line, recent changes |
| Dependency error | Missing/incompatible package | Check package.json, lock file |
| Test assertion failure | Code logic error | Check test, implementation |
| Test timeout | Slow operation/hang | Profile, check resources |
| Flaky test | Race condition/timing | Check async code, mocks |
| Out of memory | Resource leak | Check memory usage, leaks |
| Network timeout | External dependency | Check service status, add retry |
| Permission denied | Access control | Check permissions, CI config |

## Checklist

- [ ] Failure context gathered
- [ ] Failure type classified
- [ ] Root cause analyzed
- [ ] Known patterns checked
- [ ] Fix strategy determined
- [ ] Fix implemented
- [ ] CI verification passed
- [ ] Knowledge base updated
- [ ] Failure library updated (if new pattern)

## Best Practices

- Always check recent commits first
- Compare with last successful build
- Check if failure is environment-specific
- Document all findings, even negative ones
- Add flaky tests to known flaky list
- Create regression tests for bug fixes
- Update runbooks for recurring issues