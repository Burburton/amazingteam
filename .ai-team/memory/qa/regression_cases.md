# QA Memory - Regression Cases

This file tracks regression test cases and patterns for the QA agent.

---

## Regression Test Categories

### Critical Path Tests

These tests must always pass. They cover core functionality.

| Test ID | Feature | Description | Priority |
|---------|---------|-------------|----------|
| REG-001 | AI Agents | Agent configuration loads correctly | P0 |
| REG-002 | Memory | Memory directories are accessible | P0 |
| REG-003 | Commands | Commands execute correctly | P0 |

### Security Tests

| Test ID | Feature | Description | Priority |
|---------|---------|-------------|----------|
| SEC-001 | Auth | Authentication validates tokens | P0 |
| SEC-002 | Input | Input sanitization works | P0 |
| SEC-003 | Access | Access control enforced | P1 |

### Performance Tests

| Test ID | Feature | Description | Priority |
|---------|---------|-------------|----------|
| PER-001 | Build | Build completes in reasonable time | P1 |
| PER-002 | Tests | Test suite runs in reasonable time | P1 |

---

## Regression Checklist Template

### Before Each Release

- [ ] All P0 tests pass
- [ ] All P1 tests pass
- [ ] Coverage meets threshold
- [ ] No new lint errors
- [ ] Build succeeds
- [ ] Documentation updated

### After Bug Fixes

- [ ] Bug reproduction test added
- [ ] Related tests still pass
- [ ] No regression in similar features

---

## Regression Patterns

### Pattern: State Pollution

**Symptoms**: Tests pass individually but fail when run together

**Cause**: Shared state between tests

**Prevention**: Reset state in beforeEach/afterEach

### Pattern: Timing Issues

**Symptoms**: Tests fail intermittently

**Cause**: Race conditions or async timing

**Prevention**: Use proper async handling, avoid arbitrary waits

### Pattern: Environment Differences

**Symptoms**: Tests pass locally but fail in CI

**Cause**: Different environment configuration

**Prevention**: Use consistent environment setup

---

## Regression Log

### [Date] - [Regression Description]

**Issue**: [What regressed]

**Root Cause**: [Why it happened]

**Fix**: [How it was resolved]

**Test Added**: [What test prevents recurrence]

---

## Notes

- Update regression cases when new features are added
- Document any regression patterns discovered
- Keep priority classifications current