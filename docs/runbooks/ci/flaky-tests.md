# Flaky Test Investigation

## Symptoms

- Test passes sometimes, fails sometimes
- Failure not related to code changes
- Tests fail in CI but pass locally (or vice versa)
- Failures cluster around certain times or conditions

## Common Causes

### Race Conditions
- Async operations not properly awaited
- Shared mutable state
- Timing-dependent assertions

### Test Isolation Issues
- Tests modifying shared state
- Order-dependent tests
- Resource cleanup not happening

### Environment Issues
- Resource exhaustion
- Network timing
- External service availability

## Investigation Steps

### 1. Gather Information

```bash
# Run the test multiple times
npm test -- --testNamePattern="test name" --runInBand --detectOpenHandles

# Run with verbose output
npm test -- --verbose --testNamePattern="test name"

# Check test isolation
npm test -- --testNamePattern="test name" --runInBand
```

### 2. Check for Race Conditions

- Look for unawaited promises
- Check for setTimeout/setInterval usage
- Review async/await usage
- Look for shared mutable state

### 3. Check Test Isolation

- Verify beforeEach/afterEach cleanup
- Check for global state modifications
- Look for database/file side effects
- Verify mock reset

### 4. Check Environment

- Review resource usage
- Check CI configuration
- Verify external service mocks
- Review timeout settings

## Resolution Strategies

### Fix the Root Cause

```typescript
// Bad: Race condition
it('should work', () => {
  doSomethingAsync();
  expect(result).toBe('expected'); // Too early!
});

// Good: Properly await
it('should work', async () => {
  await doSomethingAsync();
  expect(result).toBe('expected');
});
```

### Improve Test Isolation

```typescript
// Ensure cleanup
afterEach(() => {
  jest.clearAllMocks();
  // Reset any global state
});
```

### Add Retries (Last Resort)

```typescript
// jest.config.js
module.exports = {
  testRetry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
};
```

## Prevention

- Always properly await async operations
- Clean up in afterEach hooks
- Avoid shared mutable state
- Use deterministic test data
- Mock external services completely

## Escalation

If unable to resolve:

1. Add to flaky test registry
2. Create issue with investigation notes
3. Tag with `flaky-test` label
4. Assign to CI Analyst

## Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Random assertion failures | Race condition | Add await |
| State leaks between tests | Poor isolation | Add cleanup |
| CI-only failures | Environment | Check resources |
| Timeout failures | Slow operations | Increase timeout |