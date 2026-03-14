---
name: test-first-feature-dev
description: Implement features using test-driven development approach
license: MIT
---
# Test-First Feature Development

## When to Use

- Implementing new features
- Adding significant functionality
- When high confidence is needed
- For complex business logic

## Steps

### 1. Understand Requirements
1. Read and analyze the feature requirements
2. Identify acceptance criteria
3. Clarify edge cases and error scenarios
4. Break down into testable units

### 2. Write Test Cases
1. Start with happy path tests
2. Add edge case tests
3. Add error scenario tests
4. Consider boundary conditions

### 3. Write Failing Tests
1. Write the test code first
2. Run tests to confirm they fail
3. Verify failure reason is correct
4. Keep tests simple and focused

### 4. Implement Minimum Code
1. Write just enough code to pass
2. Don't over-engineer
3. Focus on the current test

### 5. Make Tests Pass
1. Run tests to verify pass
2. If failing, debug and fix
3. Confirm implementation is minimal

### 6. Refactor
1. Review the implementation
2. Identify code smells
3. Refactor while keeping tests green
4. Remove duplication

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
  });
});
```

## Checklist

- [ ] Requirements understood
- [ ] Test cases designed
- [ ] Happy path tests written
- [ ] Edge case tests written
- [ ] All tests passing
- [ ] Code refactored