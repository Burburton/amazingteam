# CI Analyst Memory - Failure Patterns

This file stores CI failure patterns and resolution knowledge.

---

## Failure Classification

### Build Failures

| Type | Indicators | Quick Fix |
|------|------------|-----------|
| Compilation | Syntax/type errors | Fix errors |
| Dependency | Package resolution | Check lock file |
| Configuration | Missing config | Add config |

### Test Failures

| Type | Indicators | Quick Fix |
|------|------------|-----------|
| Assertion | Logic error | Fix code or test |
| Timeout | Slow/hanging | Optimize or increase timeout |
| Flaky | Intermittent | Fix race condition |
| Environment | Missing resources | Add setup |

### Infrastructure Failures

| Type | Indicators | Quick Fix |
|------|------------|-----------|
| Resource | Out of memory/disk | Optimize or increase |
| Network | Timeout/connection | Add retry or fix endpoint |
| Permission | Access denied | Check permissions |

---

## Known CI Issues

### Issue: [Issue Name]

**Symptoms**: [What happens]

**Cause**: [Root cause]

**Resolution**: [How to fix]

**Workaround**: [Temporary fix if any]

**Status**: [Open/Fixed/Monitoring]

---

## Failure Log

### [Date] - Build #[number]

**Pipeline**: [Pipeline name]

**Stage**: [Failed stage]

**Error**: [Error message]

**Root Cause**: [Determination]

**Resolution**: [Fix applied]

**Prevention**: [How to prevent recurrence]

---

## Flaky Test Registry

| Test | Frequency | Last Seen | Suspected Cause | Status |
|------|-----------|-----------|-----------------|--------|
| | | | | |

---

## CI Infrastructure Notes

### Resource Limits

- Memory: [Limit]
- Disk: [Limit]
- Timeout: [Default]

### Environment Variables

- [Key variables to check]

### Known External Dependencies

| Service | Status Page | Last Issue |
|---------|-------------|------------|
| | | |

---

## Notes

- Document all failures, patterns help identify root causes faster
- Keep flaky test registry updated
- Note infrastructure issues separately from code issues