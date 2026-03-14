# /test Command

## Purpose

Run tests and ensure code quality for the current changes.

## Usage

```
/test
/test [specific-test-pattern]
/test --coverage
/test --watch
```

## Examples

```
/test
/test user-auth
/test --coverage
/test src/components/Button
```

## Agent: QA

## Workflow

### 1. Test Discovery
- Find test files related to changes
- Identify test types needed
- Check test configuration

### 2. Test Execution
- Run unit tests
- Run integration tests (if applicable)
- Run lint checks
- Run type checks

### 3. Coverage Analysis
- Check test coverage
- Identify uncovered lines
- Note coverage changes

### 4. Validation
- Verify test results
- Check for flaky tests
- Validate test quality

### 5. Reporting
- Summarize test results
- Report coverage
- Note any issues

## Test Types

### Unit Tests
- Test individual functions
- Mock dependencies
- Fast execution

### Integration Tests
- Test component interactions
- Use real dependencies
- Focus on boundaries

### E2E Tests
- Test complete flows
- User perspective
- Browser/API testing

## Output

```markdown
## Test Report

### Summary
- **Total Tests**: X
- **Passed**: Y
- **Failed**: Z
- **Skipped**: W

### Coverage
- **Lines**: X%
- **Functions**: Y%
- **Branches**: Z%
- **Statements**: W%

### Results by File
| File | Tests | Passed | Failed |
|------|-------|--------|--------|
| ... | ... | ... | ... |

### Failures
[Test failure details]

### Recommendations
- [Recommendation 1]
- [Recommendation 2]
```

## Checklist

- [ ] All tests pass
- [ ] Coverage meets threshold
- [ ] No flaky tests
- [ ] New code is tested
- [ ] Edge cases covered

## Next Steps

After `/test`:
- Fix any failing tests
- Add missing test coverage
- Use `/review` for code review