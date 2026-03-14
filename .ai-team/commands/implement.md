# /implement Command

## Purpose

Implement a feature or fix according to the design plan.

## Usage

```
/implement [issue-number]
/implement [feature-description]
```

## Examples

```
/implement 123
/implement user authentication
/implement bug fix for login timeout
```

## Agent: Developer

## Workflow

### 1. Preparation
- Read design document (if available)
- Read issue details
- Understand acceptance criteria
- Set up development environment

### 2. Planning
- Break down into implementation steps
- Identify files to modify
- Plan the implementation order
- Consider dependencies

### 3. Implementation
- Create feature branch
- Implement changes incrementally
- Follow coding standards
- Write/update tests

### 4. Verification
- Run tests locally
- Fix any issues
- Verify acceptance criteria
- Check for regressions

### 5. Submission
- Commit changes with proper messages
- Push to remote
- Create pull request
- Add PR description

## Commit Guidelines

Follow conventional commits:

```
feat(scope): add new feature
fix(scope): fix bug description
refactor(scope): improve code structure
test(scope): add tests for feature
docs(scope): update documentation
```

## PR Template

```markdown
## Summary
[Brief description]

## Changes
- [Change 1]
- [Change 2]

## Testing
- [How to test]

## Related Issues
Closes #[issue-number]
```

## Checklist

Before completing:

- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Code follows standards
- [ ] No lint errors
- [ ] Documentation updated
- [ ] PR created with description

## Output

- Feature branch with changes
- Pull request
- Test coverage
- Updated documentation (if needed)

## Next Steps

After `/implement`, typically:
1. Use `/test` to verify testing
2. Request code review
3. Address feedback