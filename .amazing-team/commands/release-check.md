# /release-check Command

## Purpose

Validate code is ready for production release through comprehensive pre-release checks.

## Usage

```
/release-check [pr-number]
/release-check [branch-name]
/release-check current
```

## Examples

```
/release-check 123
/release-check release/v1.2.0
/release-check current
```

## Agent: Reviewer

## Workflow

### 1. Gather Context

- Identify PR or branch to check
- Review changes since last release
- Check current test status
- Review documentation status

### 2. Code Quality Check

- Verify all tests pass
- Check code coverage meets threshold
- Verify no linting errors
- Check for type errors
- Run security scan

### 3. Documentation Review

- Check README updates
- Verify API documentation
- Review CHANGELOG/RELEASE_NOTES
- Check for migration guides if needed

### 4. Breaking Changes Assessment

- Identify API changes
- Check backward compatibility
- Verify version bump is appropriate
- Document deprecation notices

### 5. Security Review

- Check for hardcoded secrets
- Verify dependency vulnerabilities
- Review authentication flows
- Check authorization

### 6. Performance Validation

- Check for performance regressions
- Verify resource usage
- Review startup time
- Check memory patterns

### 7. Release Preparation

- Verify version number
- Prepare release notes
- Document known issues
- Create rollback plan

## Output

Produces a release readiness report:

```markdown
## Release Readiness: [Version]

### Quality Gates
| Gate | Status | Notes |
|------|--------|-------|
| Tests | PASS/FAIL | |
| Coverage | XX% | Threshold: 80% |
| Lint | PASS/FAIL | |
| Types | PASS/FAIL | |
| Security | PASS/FAIL | |

### Breaking Changes
- [List or "None"]

### Documentation
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] API docs current

### Security
- [ ] No secrets in code
- [ ] Dependencies secure
- [ ] Auth flows verified

### Performance
- Memory: OK/Issue
- Startup: OK/Issue
- Response times: OK/Issue

### Recommendation
READY / NOT READY

### Blockers
- [List of blocking issues]

### Release Notes Draft
[Prepared release notes]
```

## Skills Used

- release-readiness-check
- regression-checklist
- safe-refactor-checklist

## Gates

| Gate | Blocking | Can Waive |
|------|----------|-----------|
| All tests pass | Yes | No |
| Coverage met | Yes | With approval |
| No security issues | Yes | No |
| Documentation complete | Yes | With approval |

## Next Steps

After `/release-check`:
1. Address any blockers
2. Get required approvals
3. Create release
4. Deploy with rollback plan ready