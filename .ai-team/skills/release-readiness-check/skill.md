# Release Readiness Check

## Purpose

This skill ensures code is ready for production release through comprehensive pre-release validation.

## When to Use

- Before merging to main/release branch
- Before deploying to production
- Before creating a release
- During release candidate review

## Steps

### 1. Code Quality Verification

```
1. All tests pass (unit, integration, E2E)
2. Code coverage meets threshold (≥80%)
3. No linting errors
4. No type errors
5. No security vulnerabilities
6. Technical debt documented
```

### 2. Documentation Review

```
1. README updated if needed
2. API documentation current
3. CHANGELOG/RELEASE_NOTES updated
4. Breaking changes documented
5. Migration guide provided (if needed)
6. Configuration changes documented
```

### 3. Breaking Changes Assessment

```
1. Identify API changes
2. Check backward compatibility
3. Document deprecation notices
4. Plan migration path for users
5. Version bump appropriate
```

### 4. Security Review

```
1. No hardcoded secrets
2. No SQL injection vulnerabilities
3. No XSS vulnerabilities
4. Authentication flows correct
5. Authorization checks in place
6. Sensitive data encrypted
7. Dependencies checked for vulnerabilities
```

### 5. Performance Validation

```
1. No significant performance regressions
2. Memory usage acceptable
3. Startup time acceptable
4. Response times within SLA
5. Resource cleanup correct
6. No memory leaks
```

### 6. Infrastructure Readiness

```
1. Database migrations ready
2. Feature flags configured
3. Rollback plan documented
4. Monitoring/alerting updated
5. Load testing completed (if applicable)
```

### 7. Release Documentation

```
1. Version number determined
2. Release notes prepared
3. Known issues documented
4. Breaking changes listed
5. Upgrade instructions provided
```

## Release Readiness Checklist Template

```markdown
## Release Readiness: [Version X.Y.Z]

### Code Quality
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Code coverage: XX% (threshold: 80%)
- [ ] No linting errors
- [ ] No type errors
- [ ] Static analysis clean

### Security
- [ ] No hardcoded secrets
- [ ] No known vulnerabilities in dependencies
- [ ] Security scan passed
- [ ] Authentication verified
- [ ] Authorization verified
- [ ] Input validation in place
- [ ] Output encoding correct

### Documentation
- [ ] README up to date
- [ ] API documentation current
- [ ] CHANGELOG updated
- [ ] Breaking changes documented
- [ ] Migration guide provided
- [ ] Configuration documented

### Performance
- [ ] No performance regressions
- [ ] Memory usage acceptable
- [ ] Startup time acceptable
- [ ] Response times within SLA
- [ ] Load tested (if applicable)

### Infrastructure
- [ ] Database migrations ready
- [ ] Feature flags configured
- [ ] Monitoring updated
- [ ] Rollback plan ready
- [ ] Deployment tested

### Versioning
- [ ] Version number appropriate
- [ ] Breaking changes → Major version
- [ ] New features → Minor version
- [ ] Bug fixes → Patch version

### Release Notes Draft
```
## [Version X.Y.Z] - YYYY-MM-DD

### Added
- [New features]

### Changed
- [Changes]

### Fixed
- [Bug fixes]

### Breaking Changes
- [Breaking changes with migration guide]

### Known Issues
- [Known issues]
```

### Approval
- [ ] Code review approved
- [ ] QA approved
- [ ] Security review (if applicable)
- [ ] Product owner approval (if applicable)

### Sign-off
- **Prepared by**: [Name]
- **Reviewed by**: [Name]
- **Approved by**: [Name]
- **Target Date**: [Date]
```

## Version Bumping Guide

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Breaking API change | Major | 1.0.0 → 2.0.0 |
| New feature (backward compatible) | Minor | 1.0.0 → 1.1.0 |
| Bug fix (backward compatible) | Patch | 1.0.0 → 1.0.1 |
| Internal change | Patch | 1.0.0 → 1.0.1 |

## Release Gates

| Gate | Must Pass | Can Waive |
|------|-----------|-----------|
| All tests pass | Yes | No |
| No security vulnerabilities | Yes | No |
| Code coverage met | Yes | With approval |
| Documentation updated | Yes | With approval |
| Performance acceptable | Yes | With approval |
| Code review approved | Yes | No |

## Checklist

- [ ] Code quality verified
- [ ] Security reviewed
- [ ] Documentation complete
- [ ] Performance validated
- [ ] Infrastructure ready
- [ ] Release notes prepared
- [ ] Version bumped appropriately
- [ ] All gates passed
- [ ] Approvals obtained

## Best Practices

- Never skip security review
- Document all decisions
- Test rollback procedure
- Communicate breaking changes early
- Provide upgrade guides
- Keep release notes user-friendly
- Test in production-like environment
- Have a rollback plan ready