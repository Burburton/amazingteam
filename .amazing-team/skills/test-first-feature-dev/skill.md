# Test-First Feature Development

## Purpose

This skill guides developers through implementing features using a test-driven development approach.

## When to Use

- Implementing new features
- Adding significant functionality
- When high confidence is needed
- For complex business logic

## Steps

### 1. Understand Requirements

```
1. Read and analyze the feature requirements
2. Identify acceptance criteria
3. Clarify edge cases and error scenarios
4. Break down into testable units
5. Document assumptions
```

### 2. Write Test Cases

```
1. Start with happy path tests
2. Add edge case tests
3. Add error scenario tests
4. Consider boundary conditions
5. Document test intentions
```

### 3. Write Failing Tests

```
1. Write the test code first
2. Run tests to confirm they fail
3. Verify failure reason is correct
4. Keep tests simple and focused
```

### 4. Implement Minimum Code

```
1. Write just enough code to pass
2. Don't over-engineer
3. Focus on the current test
4. Ignore optimization for now
```

### 5. Make Tests Pass

```
1. Run tests to verify pass
2. If failing, debug and fix
3. Ensure test is testing the right thing
4. Confirm implementation is minimal
```

### 6. Refactor

```
1. Review the implementation
2. Identify code smells
3. Refactor while keeping tests green
4. Improve code organization
5. Remove duplication
```

### 7. Repeat

```
1. Write next failing test
2. Implement minimum code
3. Make test pass
4. Refactor
5. Continue until feature complete
```

## Test Structure Template

```typescript
describe('FeatureName', () => {
  describe('methodName or scenario', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test data';
      const expected = 'expected result';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle edge case', () => {
      // Test edge case
    });

    it('should throw error for invalid input', () => {
      // Test error handling
    });
  });
});
```

## Test Categories

### Unit Tests
- Test individual functions/methods
- Mock external dependencies
- Fast execution
- Isolated scope

### Integration Tests
- Test component interactions
- Use real dependencies where appropriate
- Focus on boundaries
- Verify data flow

### Acceptance Tests
- Test complete user scenarios
- Verify acceptance criteria
- End-to-end flow
- User perspective

## Test Naming Convention

```
test_[method]_[scenario]_[expectedResult]

Examples:
- test_calculateTotal_withEmptyCart_returnsZero
- test_login_withInvalidPassword_throwsException
- test_processOrder_withValidInput_completesSuccessfully
```

## Checklist

- [ ] Requirements understood
- [ ] Test cases designed
- [ ] Happy path tests written
- [ ] Edge case tests written
- [ ] Error handling tests written
- [ ] All tests passing
- [ ] Code refactored
- [ ] Test coverage adequate
- [ ] Code reviewed

## Common Patterns

### Parameterized Tests
```typescript
describe.each([
  ['input1', 'expected1'],
  ['input2', 'expected2'],
  ['input3', 'expected3'],
])('with input %s', (input, expected) => {
  it(`returns ${expected}`, () => {
    expect(fn(input)).toBe(expected);
  });
});
```

### Mocking
```typescript
// Mock a module
jest.mock('../dependency', () => ({
  method: jest.fn(),
}));

// Mock implementation
mock.method.mockImplementation(() => 'mocked value');
```

### Async Testing
```typescript
// Promise
it('should handle async', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});

// Callback
it('should call callback', (done) => {
  functionWithCallback((result) => {
    expect(result).toBe('expected');
    done();
  });
});
```

## Best Practices

- One assertion per test (when practical)
- Test behavior, not implementation
- Keep tests independent
- Use descriptive test names
- Don't test implementation details
- Test edge cases thoroughly
- Make tests deterministic