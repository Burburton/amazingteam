---
name: release-readiness-check
description: Validate that the project is ready for release
license: MIT
---
# Release Readiness Check

## When to Use

- Before creating a release
- Before merging to main
- Before deploying to production

## Pre-Release Checklist

### Code Quality
- [ ] All tests pass
- [ ] Test coverage meets threshold (≥80%)
- [ ] No lint errors
- [ ] No TypeScript errors
- [ ] No security vulnerabilities

### Documentation
- [ ] CHANGELOG.md updated
- [ ] README.md current
- [ ] API documentation updated
- [ ] Migration guide (if breaking changes)

### Version
- [ ] Version bumped appropriately
- [ ] Version in package.json correct
- [ ] Git tag prepared

### Dependencies
- [ ] Dependencies up to date
- [ ] No known vulnerabilities in dependencies
- [ ] Lock file committed

## Breaking Changes Check

If this release includes breaking changes:

- [ ] Breaking changes documented
- [ ] Migration guide provided
- [ ] Deprecation warnings added in previous version
- [ ] Major version bumped (semver)

## Deployment Readiness

- [ ] Environment variables documented
- [ ] Database migrations ready (if needed)
- [ ] Feature flags configured
- [ ] Rollback plan documented

## Release Notes Template

```markdown
## [Version] - YYYY-MM-DD

### Added
- [New features]

### Changed
- [Changes to existing features]

### Fixed
- [Bug fixes]

### Breaking Changes
- [Breaking changes with migration guide]

### Dependencies
- [Updated dependencies]
```

## Sign-off

- [ ] All checks passed
- [ ] Release notes reviewed
- [ ] Stakeholders notified
- [ ] Ready to release