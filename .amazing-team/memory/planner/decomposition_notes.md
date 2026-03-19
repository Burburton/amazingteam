# Planner Memory - Task Decomposition Notes

This file stores task decomposition and workflow orchestration knowledge.

---

## Task Decomposition Patterns

### Feature Tasks

| Complexity | Typical Phases | Typical Duration |
|------------|----------------|------------------|
| Simple | Design → Implement → Test | 1-2 days |
| Moderate | Design → Implement → Test → Review | 3-5 days |
| Complex | Analysis → Design → Implement → Test → Review → Release | 1-2 weeks |

### Bug Tasks

| Severity | Typical Flow | Priority |
|----------|--------------|----------|
| Critical | Triage → Fix → Test → Deploy | Immediate |
| High | Triage → Fix → Test → Review | Within sprint |
| Medium | Triage → Fix → Test | Next sprint |
| Low | Triage → Fix | Backlog |

---

## Workflow Rules

### Handoff Rules

| From | To | Criteria |
|------|-----|----------|
| Architect | Developer | Design approved |
| Developer | QA | Implementation complete |
| QA | Reviewer | Tests passing |
| Reviewer | Release | Review approved |

### Blocking Conditions

- Design not approved → Block implementation
- Tests failing → Block review
- Review not approved → Block merge
- Dependencies incomplete → Block start

---

## Dispatch Log

### [Date] - [Task ID]

**Task**: [Description]

**Decomposition**: [How it was broken down]

**Dispatch**: [Which roles were involved]

**Outcome**: [Result]

---

## Dependency Tracking

### Active Dependencies

| Task | Depends On | Status |
|------|------------|--------|
| | | |

### Dependency Resolution Strategies

- Parallelize when possible
- Break dependencies with interfaces
- Document assumptions when blocking

---

## Notes

- Update after each task decomposition
- Track patterns that work well
- Note recurring dependency issues