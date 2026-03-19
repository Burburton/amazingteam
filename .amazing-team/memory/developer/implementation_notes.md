# Developer Memory - Implementation Notes

This file stores implementation-specific knowledge and observations from the Developer agent.

---

## Implementation Patterns

### Preferred Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Repository | Data access abstraction | `user.repository.ts` |
| Service | Business logic | `user.service.ts` |
| Factory | Complex object creation | `factory.ts` |

### Code Organization

```
module/
├── index.ts              # Public API
├── module.service.ts     # Business logic
├── module.repository.ts  # Data access
├── module.types.ts       # Types/interfaces
└── __tests__/            # Tests
    ├── module.service.test.ts
    └── module.repository.test.ts
```

---

## Implementation Log

### [Date] - [Feature/Bug]

**Task**: [Issue number or description]

**Approach**: [How it was implemented]

**Challenges**: [What was difficult]

**Resolution**: [How challenges were addressed]

---

## Common Implementation Tasks

### Adding a New Feature

1. Create feature branch: `feat/issue-N-description`
2. Create types/interfaces in `*.types.ts`
3. Implement business logic in `*.service.ts`
4. Add data access in `*.repository.ts` if needed
5. Write unit tests in `__tests__/`
6. Update documentation

### Fixing a Bug

1. Create fix branch: `fix/issue-N-description`
2. Write failing test that reproduces the bug
3. Make minimal fix
4. Verify test passes
5. Check for similar issues elsewhere
6. Update regression tests

---

## Code Quality Checklist

- [ ] Code follows naming conventions
- [ ] Functions are small and focused
- [ ] No code duplication
- [ ] Error handling is appropriate
- [ ] Tests cover edge cases
- [ ] Documentation is updated

---

## Notes

- Update this file when learning new patterns or encountering common issues
- Keep track of implementation strategies that work well
- Note any recurring challenges