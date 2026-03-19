# Safe Refactor Checklist

## Purpose

This skill provides a systematic checklist for safely refactoring code without introducing bugs.

## When to Use

- Improving code structure
- Reducing technical debt
- Optimizing performance
- Preparing for new features
- Cleaning up legacy code

## Pre-Refactor Checklist

### 1. Verify Test Coverage
- [ ] Adequate test coverage exists
- [ ] Tests are reliable and passing
- [ ] Edge cases are covered
- [ ] Can add more tests if needed

### 2. Understand Current Code
- [ ] Read and understand the code
- [ ] Identify dependencies
- [ ] Note any side effects
- [ ] Document current behavior

### 3. Identify Refactor Scope
- [ ] Define clear boundaries
- [ ] Identify affected modules
- [ ] Check for code that uses this code
- [ ] Document entry points

### 4. Create Safety Net
- [ ] Ensure all tests pass before starting
- [ ] Create a feature branch
- [ ] Consider creating characterization tests
- [ ] Document current behavior if unclear

## Refactor Principles

### 1. Small Steps
- Make one small change at a time
- Run tests after each change
- Commit frequently
- Keep changes reversible

### 2. Preserve Behavior
- Don't change what the code does
- Only change how it does it
- Keep the same public interface
- Maintain backward compatibility

### 3. Tests Are Your Friend
- Run tests constantly
- Add tests before refactoring
- Trust failing tests
- Fix issues immediately

## Refactor Patterns

### Extract Method
```
Before:
function complexFunction() {
  // lots of code
  // section A
  // section B
  // section C
}

After:
function complexFunction() {
  doSectionA();
  doSectionB();
  doSectionC();
}

function doSectionA() { /* ... */ }
function doSectionB() { /* ... */ }
function doSectionC() { /* ... */ }
```

### Extract Variable
```
Before:
if (item.price * (1 + taxRate) > threshold) { ... }

After:
const totalWithTax = item.price * (1 + taxRate);
if (totalWithTax > threshold) { ... }
```

### Rename Variable/Method
```
Before:
function calc(x, y) { return x * y; }

After:
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

### Move Method/Field
- Move to the class that uses it most
- Update all references
- Consider creating a delegate

### Inline Method
- When the method body is clearer than the name
- Replace calls with the body
- Remove the method

## During Refactor Checklist

### After Each Change
- [ ] Run tests (all must pass)
- [ ] Check for compile errors
- [ ] Verify behavior unchanged
- [ ] Commit if tests pass

### Periodic Checks
- [ ] Run full test suite
- [ ] Check for performance impact
- [ ] Review for unintended changes
- [ ] Update documentation

## Post-Refactor Checklist

### Verification
- [ ] All tests pass
- [ ] No new lint warnings
- [ ] No type errors
- [ ] Performance is acceptable

### Quality
- [ ] Code is more readable
- [ ] Duplication is reduced
- [ ] Complexity is reduced
- [ ] Tests are improved

### Documentation
- [ ] Comments updated
- [ ] API docs updated
- [ ] README updated if needed
- [ ] Migration guide if breaking

### Final Checks
- [ ] Peer review done
- [ ] Merge conflicts resolved
- [ ] CI/CD passes
- [ ] Ready for merge

## Red Flags - Stop Refactoring

- Tests start failing unexpectedly
- Behavior changes unexpectedly
- Scope keeps expanding
- Can't verify behavior
- No test coverage for critical code
- Changes are too risky

## Refactor Log Template

```markdown
## Refactor: [Description]

### Date
[Date]

### Scope
[What was refactored]

### Changes
1. [Change 1]
2. [Change 2]

### Files Modified
- `file1.ts`: [Description]
- `file2.ts`: [Description]

### Tests Added
- [Test 1]
- [Test 2]

### Risks Mitigated
- [Risk 1]: [How it was addressed]

### Review Notes
[Any notes for reviewers]
```

## Best Practices

1. **Never refactor without tests**
   - If no tests, write them first
   - Characterization tests for legacy code

2. **One thing at a time**
   - Don't mix refactoring with feature changes
   - Keep refactor commits separate

3. **Test frequently**
   - After every small change
   - Don't wait until the end

4. **Revert if stuck**
   - It's okay to abandon a refactor
   - Learn from what didn't work

5. **Document why, not what**
   - Explain the reason for refactoring
   - Let code show what changed