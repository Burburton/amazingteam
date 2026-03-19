# Triage Memory - Classification Heuristics

This file stores issue classification patterns and heuristics.

---

## Classification Quick Reference

### Issue Type Indicators

| Type | Indicators |
|------|------------|
| bug | Error messages, crashes, unexpected behavior |
| feature | New capability request, "would like to" |
| enhancement | Improvement to existing, "better", "faster" |
| docs | Missing/outdated documentation |
| tech | Technical debt, infrastructure |
| question | "How do I", clarification needed |

### Priority Indicators

| Priority | Indicators |
|----------|------------|
| critical | Production down, security issue, data loss |
| high | Major feature broken, many users affected |
| medium | Standard issue, workaround exists |
| low | Minor issue, niche case |

---

## Debugging Heuristics

### Error Pattern → Likely Cause

| Error Pattern | Likely Cause | Investigation |
|---------------|--------------|---------------|
| Null reference | Missing null check | Check data flow |
| Timeout | Network/slow operation | Check async code |
| Permission denied | Access control | Check auth/config |
| Type error | Type mismatch | Check types/interfaces |
| Not found | Missing resource | Check paths/IDs |

### Recent Change Check

1. Check commits in last 24-48 hours
2. Look for changes in affected modules
3. Check dependency updates
4. Review config changes

---

## Classification Log

### [Date] - Issue #[number]

**Symptoms**: [What was reported]

**Classification**: [Type/Priority]

**Rationale**: [Why classified this way]

**Outcome**: [Resolution or handoff]

---

## Common Issue Patterns

### Pattern: [Pattern Name]

**Symptoms**: [Typical symptoms]

**Root Cause**: [Typical cause]

**Quick Fix**: [Typical fix]

---

## Notes

- Update with new patterns as discovered
- Document false positives
- Track classification accuracy