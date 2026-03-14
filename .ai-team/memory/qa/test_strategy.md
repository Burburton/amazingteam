# QA Memory - Test Strategy

This file defines the testing strategy and approach for the QA agent.

---

## Testing Philosophy

### Core Principles

1. **Test behavior, not implementation**
2. **Tests should be deterministic**
3. **Each test should verify one thing**
4. **Tests should be independent**
5. **Tests should be fast**

### Test Pyramid

```
        /\
       /  \
      / E2E\         Few, slow, high confidence
     /------\
    /        \
   /Integration\     Some, moderate speed
  /-----------\
 /             \
/    Unit       \    Many, fast, focused
-----------------
```

---

## Test Categories

### Unit Tests

| Aspect | Guidelines |
|--------|------------|
| Scope | Single function or class |
| Speed | < 100ms per test |
| Dependencies | Mocked |
| Coverage | > 80% for business logic |

### Integration Tests

| Aspect | Guidelines |
|--------|------------|
| Scope | Multiple components |
| Speed | < 1s per test |
| Dependencies | Real or test doubles |
| Coverage | Critical paths |

### End-to-End Tests

| Aspect | Guidelines |
|--------|------------|
| Scope | Full system |
| Speed | Seconds to minutes |
| Dependencies | All real |
| Coverage | User journeys |

---

## Test Structure (AAA Pattern)

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = createTestInput();
      const expected = createExpectedOutput();

      // Act
      const result = component.method(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

---

## Test Naming Convention

```
should_[expectedBehavior]_when_[condition]

Examples:
- should_returnUser_when_validId
- should_throwError_when_invalidInput
- should_sendEmail_when_userSubscribes
```

---

## Test Data Management

### Factories

```typescript
function createTestUser(overrides = {}) {
  return {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}
```

### Fixtures

- Store complex test data in `__fixtures__/` directories
- Keep fixtures close to tests that use them
- Use JSON for complex objects

---

## Coverage Targets

| Type | Target | Rationale |
|------|--------|-----------|
| Branches | 80% | Catch edge cases |
| Functions | 80% | All code paths tested |
| Lines | 80% | Sufficient coverage |
| Statements | 80% | Granular coverage |

---

## Notes

- Update this file when testing approach changes
- Document new testing patterns
- Track coverage trends