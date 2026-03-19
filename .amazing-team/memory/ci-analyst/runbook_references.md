# CI Analyst Memory - Runbook References

This file stores references to CI runbooks and investigation procedures.

---

## Runbook Quick Links

### Build Issues

| Problem | Runbook | Location |
|---------|---------|----------|
| Compilation failure | Build Debug | docs/runbooks/ci/build-debug.md |
| Dependency issues | Dependency Resolution | docs/runbooks/ci/dependencies.md |
| Out of memory | Memory Issues | docs/runbooks/ci/memory.md |

### Test Issues

| Problem | Runbook | Location |
|---------|---------|----------|
| Flaky tests | Flaky Test Investigation | docs/runbooks/ci/flaky-tests.md |
| Test timeout | Timeout Investigation | docs/runbooks/ci/timeouts.md |
| Test environment | Environment Setup | docs/runbooks/ci/environment.md |

### Infrastructure Issues

| Problem | Runbook | Location |
|---------|---------|----------|
| Resource limits | Resource Management | docs/runbooks/ci/resources.md |
| Network issues | Network Debug | docs/runbooks/ci/network.md |
| Permission errors | Access Control | docs/runbooks/ci/permissions.md |

---

## Investigation Procedures

### Standard CI Failure Investigation

1. Check error message and logs
2. Identify failure type (build/test/infra)
3. Check known issues in failure library
4. Review recent changes
5. Attempt local reproduction
6. Apply fix or escalate
7. Document resolution

### Flaky Test Investigation

1. Identify failing test
2. Check failure history
3. Look for race conditions
4. Check test isolation
5. Review mock setup
6. Add retry or fix
7. Add to flaky test registry

---

## Common Fixes Quick Reference

| Error Type | Common Fix |
|------------|------------|
| Type error | Add type, fix type mismatch |
| Import error | Fix import path, add to dependencies |
| Test assertion | Fix logic in code or test |
| Timeout | Increase timeout, optimize code |
| Out of memory | Reduce memory usage, split job |
| Permission | Update CI permissions |

---

## Escalation Paths

| Issue Type | Escalate To |
|------------|-------------|
| Code bug | Developer |
| Test bug | QA |
| Infrastructure | DevOps |
| External service | Contact provider |

---

## Notes

- Keep runbook references up to date
- Add new runbooks as they are created
- Document any temporary workarounds