# QA Memory - Validation Notes

This file records validation observations and lessons learned by the QA agent.

---

## Validation Process

### For Features

1. **Requirements Review**
   - Verify acceptance criteria are testable
   - Identify edge cases
   - Note dependencies

2. **Test Design**
   - Design test cases for each criterion
   - Include happy path and error paths
   - Consider boundary conditions

3. **Execution**
   - Run all relevant tests
   - Verify behavior matches expectations
   - Document any deviations

4. **Reporting**
   - Summarize results
   - Report issues found
   - Recommend sign-off or revision

### For Bug Fixes

1. **Reproduction Verification**
   - Verify the reported issue exists
   - Confirm fix addresses root cause
   - Check for similar issues

2. **Regression Testing**
   - Run related tests
   - Check adjacent functionality
   - Verify no new issues

3. **Documentation**
   - Update test coverage
   - Add regression tests
   - Document lessons learned

---

## Validation Results Log

### [Date] - [Issue/Feature]

**Type**: [Feature/Bug Fix/Refactor]

**Items Tested**: [List of items]

**Results**: [Summary of results]

**Issues Found**: [List any issues]

**Recommendation**: [Approve/Request Changes]

---

## Common Validation Issues

### False Positives

| Issue | Cause | Mitigation |
|-------|-------|------------|
| Flaky test | Timing/state | Add retry/stabilize |
| Environment config | Different settings | Use consistent config |

### False Negatives

| Issue | Cause | Mitigation |
|-------|-------|------------|
| Missing test case | Incomplete coverage | Add test |
| Wrong assertion | Misunderstood requirement | Clarify requirement |

---

## Validation Checklist

### Pre-Validation

- [ ] Requirements understood
- [ ] Test cases designed
- [ ] Environment prepared

### During Validation

- [ ] Tests executed
- [ ] Results recorded
- [ ] Edge cases explored

### Post-Validation

- [ ] Results summarized
- [ ] Issues documented
- [ ] Recommendation provided

---

## Notes

- Record validation patterns that work well
- Document common issues and solutions
- Track validation efficiency metrics