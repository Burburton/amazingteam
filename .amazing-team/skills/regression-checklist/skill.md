# Regression Checklist

## Purpose

This skill ensures comprehensive regression testing and prevents unintended side effects from code changes.

## When to Use

- Before merging a PR
- After implementing a feature
- After fixing a bug
- Before a release
- After refactoring code

## Steps

### 1. Identify Change Scope

```
1. Review the changes in the PR/commit
2. Identify affected modules
3. Map dependencies to other modules
4. Identify integration points
5. Note any API changes
```

### 2. Check Core Functionality

```
1. Application startup/shutdown
2. Core user flows
3. Authentication/authorization
4. Data persistence
5. Critical business logic
```

### 3. Check Affected Areas

```
1. Unit tests for changed modules
2. Integration tests for affected paths
3. E2E tests for user flows
4. Performance benchmarks
5. Security validations
```

### 4. Check Neighboring Modules

```
1. Modules that depend on changed code
2. Modules that provide dependencies
3. Shared utilities and helpers
4. Configuration changes
5. Database migrations
```

### 5. Check Edge Cases

```
1. Error handling paths
2. Boundary conditions
3. Null/empty inputs
4. Concurrent access scenarios
5. Resource exhaustion
```

### 6. Verify Non-Functional

```
1. Performance: No significant degradation
2. Security: No new vulnerabilities
3. Accessibility: WCAG compliance maintained
4. Compatibility: Browser/platform support
5. Logging: Appropriate log levels
```

### 7. Run Test Suite

```
1. Run all unit tests
2. Run all integration tests
3. Run E2E tests
4. Check test coverage
5. Verify no flaky tests
```

## Regression Checklist Template

```markdown
## Regression Checklist: [PR/Task Title]

### Change Summary
[Brief description of changes]

### Affected Modules
- [ ] `module1` - [Description of change]
- [ ] `module2` - [Description of change]

### Core Functionality
- [ ] Application starts correctly
- [ ] Application shuts down gracefully
- [ ] Core user flows work
- [ ] Authentication works
- [ ] Authorization works
- [ ] Data can be saved
- [ ] Data can be retrieved

### Module-Specific Tests
- [ ] Unit tests pass for affected modules
- [ ] Integration tests pass for affected paths
- [ ] E2E tests pass for affected flows

### Dependency Checks
- [ ] Upstream modules work correctly
- [ ] Downstream modules work correctly
- [ ] Shared utilities function properly
- [ ] External integrations work

### Edge Cases
- [ ] Error handling works
- [ ] Boundary conditions handled
- [ ] Null/empty inputs handled
- [ ] Concurrent access safe

### Non-Functional
- [ ] Performance acceptable
- [ ] No security regressions
- [ ] Accessibility maintained
- [ ] Compatible with supported platforms
- [ ] Logs appropriate

### Test Results
- Unit Tests: PASS / FAIL
- Integration Tests: PASS / FAIL
- E2E Tests: PASS / FAIL
- Coverage: XX%

### Notes
[Any additional observations or concerns]
```

## Risk Assessment Matrix

| Change Type | Risk Level | Recommended Testing |
|-------------|------------|---------------------|
| Single file bug fix | Low | Unit tests + affected module tests |
| Multi-file bug fix | Medium | All tests + integration tests |
| New feature | Medium | All tests + E2E + manual |
| API change | High | All tests + E2E + contract tests |
| Database migration | High | All tests + migration tests |
| Refactoring | Medium | All tests + coverage check |
| Dependency update | Medium | All tests + compatibility check |
| Configuration change | Low-Medium | Integration tests + E2E |

## Checklist

- [ ] Change scope identified
- [ ] Core functionality verified
- [ ] Affected modules tested
- [ ] Neighboring modules checked
- [ ] Edge cases tested
- [ ] Non-functional requirements met
- [ ] Test suite passed
- [ ] Coverage acceptable
- [ ] Documentation updated

## Best Practices

- Test more than just the changed code
- Pay attention to error paths
- Check for race conditions in async code
- Verify logging and monitoring
- Test in realistic environments
- Include performance-critical paths
- Check backward compatibility
- Document any known issues