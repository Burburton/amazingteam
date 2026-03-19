# Architect Memory - Design Rationale

This file records the reasoning behind architectural decisions to support future decision-making.

---

## Design Principles

### 1. Memory Isolation

**Decision**: Each AI role has isolated memory directories.

**Rationale**: 
- Prevents cross-role contamination
- Allows role-specific knowledge accumulation
- Reduces context confusion between roles

**Trade-offs**:
- (+) Clear ownership of knowledge
- (+) Easier debugging of role behavior
- (-) Requires explicit sharing for cross-role context
- (-) More files to maintain

### 2. Task-Scoped Memory

**Decision**: Each issue/task has its own memory directory under `tasks/`.

**Rationale**:
- Keeps task context isolated
- Provides traceable history
- Allows archiving completed tasks

**Trade-offs**:
- (+) Clean separation of concerns
- (+) Easy to review specific task decisions
- (-) Requires manual or automated cleanup
- (-) Potential duplication with issue comments

### 3. Global Memory Protection

**Decision**: Global memory (`docs/`, `AGENTS.md`) requires human approval for changes.

**Rationale**:
- Prevents AI from corrupting project truths
- Maintains human governance
- Ensures stability of core knowledge

**Trade-offs**:
- (+) Stable project documentation
- (+) Human oversight maintained
- (-) Slower updates to global docs
- (-) Requires explicit approval workflow

### 4. Role-Based Permissions

**Decision**: Each role has defined read/write permissions for memory locations.

**Rationale**:
- Enforces separation of concerns
- Prevents unintended modifications
- Clarifies responsibility

---

## Architecture Decision Records (ADRs)

For formal architectural decisions, create entries in `docs/decisions/`.

### ADR Template

```markdown
# ADR-NNN: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[What is the issue we're addressing]

## Decision
[What is the change we're proposing/have made]

## Consequences
[What becomes easier/harder as a result]
```

---

## Design Patterns Used

| Pattern | Application | Reason |
|---------|-------------|--------|
| Layered Architecture | System design | Separation of concerns |
| Repository Pattern | Data access | Abstraction over storage |
| Agent Pattern | AI roles | Specialized behavior |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why Avoid | Alternative |
|--------------|-----------|-------------|
| God Object | Hard to maintain, test | Single responsibility |
| Circular Dependencies | Confusing, hard to debug | Dependency injection |
| Global State | Hard to track changes | Explicit parameters |

---

## Notes

- Update this file when making significant design decisions
- Cross-reference formal ADRs in `docs/decisions/`
- Include trade-off analysis for major decisions