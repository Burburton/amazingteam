# Architect Memory - Architecture Notes

This file stores architecture-level observations and decisions made by the Architect agent.

## Purpose

Record architectural insights, module relationships, and design decisions that should be preserved across tasks.

---

## Architecture Notes

### System Overview

- **Project Type**: AI-powered autonomous development team
- **Primary Language**: TypeScript
- **Runtime**: Node.js
- **Key Frameworks**: OpenCode, GitHub Actions

### Key Design Decisions

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| | | | |

### Module Boundaries

```
src/
├── modules/     # Feature modules (independent)
├── shared/      # Shared utilities (stable)
├── config/      # Configuration (isolated)
└── index.ts     # Entry point
```

### Dependency Rules

- Modules should not have circular dependencies
- Shared utilities should not depend on modules
- Config should be loaded at startup

---

## Architecture Evolution Log

### [Date] - [Change Title]

**Context**: [Why this change was needed]

**Decision**: [What was decided]

**Impact**: [What modules were affected]

---

## Pending Architecture Questions

- [ ] [Question 1]
- [ ] [Question 2]

---

## Notes

- Update this file when making significant architectural decisions
- Include rationale to help future decision-making
- Cross-reference to `docs/decisions/` for formal ADRs