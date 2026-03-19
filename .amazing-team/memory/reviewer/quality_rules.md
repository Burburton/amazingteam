# Reviewer Memory - Quality Rules

This file defines code quality rules and standards enforced by the Reviewer agent.

---

## Code Quality Standards

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Functions | camelCase | `getUserById` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `IUserRepository` |
| Types | PascalCase | `UserRole` |
| Files | kebab-case | `user-service.ts` |

### Code Structure

| Rule | Rationale |
|------|-----------|
| Max function length: 30 lines | Readability |
| Max nesting: 3 levels | Complexity management |
| One responsibility per function | Maintainability |
| No magic numbers | Clarity |

### TypeScript Rules

| Rule | Standard |
|------|----------|
| Explicit return types | Required for public functions |
| No `any` type | Use specific types |
| Strict null checks | Enabled |
| No unused variables | Error |

---

## Quality Metrics

### Maintainability Index

| Score | Rating | Action |
|-------|--------|--------|
| 0-9 | Low | Refactor required |
| 10-19 | Medium | Consider refactoring |
| 20+ | High | Good |

### Complexity Thresholds

| Metric | Warning | Error |
|--------|---------|-------|
| Cyclomatic Complexity | 10 | 20 |
| Cognitive Complexity | 15 | 25 |
| Lines of Code (per function) | 20 | 30 |

---

## Forbidden Patterns

| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| `any` type | Loses type safety | Use specific type or `unknown` |
| `console.log` in production | Performance, security | Use logger |
| Deep nesting | Hard to read | Early returns, extract methods |
| Magic numbers | Unclear meaning | Named constants |
| Uncaught promises | Silent failures | Try/catch or .catch() |

---

## Code Smells

### Detect and Address

| Smell | Detection | Fix |
|-------|-----------|-----|
| Long method | > 30 lines | Extract methods |
| Large class | > 200 lines | Split responsibilities |
| Duplicate code | Similar blocks | Extract common code |
| Dead code | Unused | Remove |
| Feature envy | Using other's data | Move method |

---

## Security Rules

### Must Check

| Area | Rule |
|------|------|
| Input | Validate and sanitize |
| Output | Encode for context |
| Auth | Verify on every request |
| Secrets | Never in code |
| Logs | No sensitive data |

---

## Notes

- Update when new patterns emerge
- Document exceptions to rules
- Track effectiveness of rules