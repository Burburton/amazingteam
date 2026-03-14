---
name: regression-checklist
description: Checklist for detecting regressions after changes
license: MIT
---
# Regression Checklist

## When to Use

- After implementing changes
- Before merging PRs
- After refactoring
- Before releases

## Pre-Change Baseline

- [ ] All tests passing
- [ ] No lint errors
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Documentation current

## Regression Tests

### Functional Tests
- [ ] Core features work as expected
- [ ] User flows complete successfully
- [ ] API responses correct
- [ ] Data integrity maintained

### Performance Tests
- [ ] Response times acceptable
- [ ] No memory leaks
- [ ] No CPU spikes
- [ ] Bundle size not increased significantly

### Integration Tests
- [ ] External services work
- [ ] Database operations correct
- [ ] Authentication/authorization works
- [ ] File operations work

### UI Tests (if applicable)
- [ ] Layouts render correctly
- [ ] Responsive design works
- [ ] Accessibility maintained
- [ ] No console errors

## Post-Change Verification

### Code Quality
- [ ] No new lint warnings
- [ ] Test coverage maintained
- [ ] No deprecated API usage
- [ ] Security best practices followed

### Documentation
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] Changelog updated
- [ ] Comments accurate

## Regression Report Template

```markdown
## Regression Check: [PR/Change]

### Tests Run
- [ ] Unit tests: X passing
- [ ] Integration tests: X passing
- [ ] E2E tests: X passing

### Issues Found
| Issue | Severity | Status |
|-------|----------|--------|
| [Description] | [High/Med/Low] | [Fixed/Open] |

### Sign-off
- [ ] All regressions addressed
- [ ] Ready for merge
```