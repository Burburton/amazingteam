# Reviewer Memory - Recurring Risks

This file tracks recurring code risks and patterns that frequently cause issues.

---

## Risk Categories

### High Risk Patterns

| Risk | Frequency | Impact | Mitigation |
|------|-----------|--------|------------|
| Missing null checks | High | Runtime error | Use optional chaining |
| Unhandled promises | Medium | Silent failure | Async/await with try/catch |
| Hardcoded values | Medium | Maintenance | Use configuration |
| Missing tests | High | Regression | Require tests for changes |

### Medium Risk Patterns

| Risk | Frequency | Impact | Mitigation |
|------|-----------|--------|------------|
| Complex conditionals | Medium | Bugs | Simplify or document |
| Large functions | Medium | Maintainability | Extract methods |
| Deep nesting | Low | Readability | Early returns |
| Missing error handling | Medium | Poor UX | Handle all cases |

---

## Risk Detection Patterns

### Security Risks

```typescript
// Risk: SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;
// Fix: Use parameterized queries

// Risk: XSS
element.innerHTML = userInput;
// Fix: Use textContent or sanitize

// Risk: Hardcoded secrets
const apiKey = "sk-xxxxx";
// Fix: Use environment variables
```

### Performance Risks

```typescript
// Risk: N+1 queries
for (const user of users) {
  const posts = await getPosts(user.id);
}
// Fix: Batch query

// Risk: Memory leak
const listener = () => {};
element.addEventListener('click', listener);
// Fix: Remove listener when done
```

### Correctness Risks

```typescript
// Risk: Race condition
let value = 0;
async function increment() {
  value++;
}
// Fix: Use atomic operations or locks

// Risk: Stale closure
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Fix: Use let or capture value
```

---

## Risk Log

### [Date] - [Risk Description]

**Pattern**: [Code pattern that indicates risk]

**Impact**: [What could go wrong]

**Frequency**: [How often seen]

**Mitigation**: [How to prevent/fix]

---

## Risk Assessment Matrix

| Likelihood \ Impact | Low | Medium | High |
|---------------------|-----|--------|------|
| High | Monitor | Address | Critical |
| Medium | Accept | Monitor | Address |
| Low | Accept | Accept | Monitor |

---

## Notes

- Update when new recurring risks are identified
- Track effectiveness of mitigations
- Share patterns with Developer agent for prevention