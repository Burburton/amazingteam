---
name: safe-refactor-checklist
description: Checklist for safe code refactoring without breaking changes
license: MIT
---
# Safe Refactor Checklist

## When to Use

- Refactoring existing code
- Improving code structure
- Reducing technical debt
- Optimizing performance

## Pre-Refactor Checklist

- [ ] All existing tests pass
- [ ] Test coverage is adequate (>80%)
- [ ] Understand the code's current behavior
- [ ] Identify all consumers of the code
- [ ] Document the refactoring goal

## During Refactor

### 1. Make Small Changes
- One refactoring at a time
- Run tests after each change
- Commit frequently

### 2. Preserve Behavior
- Don't change public interfaces
- Keep the same inputs/outputs
- Maintain backward compatibility

### 3. Update Tests
- Update tests if behavior changes
- Add tests for new code paths
- Remove obsolete tests

## Post-Refactor Checklist

- [ ] All tests pass
- [ ] No new lint errors
- [ ] No TypeScript errors
- [ ] Test coverage maintained or improved
- [ ] Documentation updated
- [ ] No breaking changes to public API

## Common Refactoring Patterns

### Extract Method
```typescript
// Before
function process(data) {
  // validation logic
  // processing logic
  // formatting logic
}

// After
function process(data) {
  validate(data);
  const result = processData(data);
  return formatResult(result);
}
```

### Rename Variable
- Use IDE refactoring tools
- Update all references
- Run tests to verify

### Move Method
- Update imports
- Check for circular dependencies
- Verify all callers updated