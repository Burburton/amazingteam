# Architect Memory - Module Map

This file maintains a living map of the codebase modules and their relationships.

---

## Module Hierarchy

### Core Modules

| Module | Path | Purpose | Dependencies |
|--------|------|---------|--------------|
| Agents | `.opencode/agents/` | AI role definitions | None |
| Skills | `.opencode/skills/` | Reusable AI skills | None |
| Commands | `.opencode/commands/` | Workflow commands | None |
| Memory | `.opencode/memory/` | Role-isolated memory | None |

### Application Modules

| Module | Path | Purpose | Dependencies |
|--------|------|---------|--------------|
| src | `src/` | Main application code | config, shared |
| config | `src/config/` | Configuration management | None |
| shared | `src/shared/` | Shared utilities | None |

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────┐
│                    GitHub Issues                     │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                   Architect Agent                    │
│  Memory: .opencode/memory/architect/                │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                  Developer Agent                     │
│  Memory: .opencode/memory/developer/                │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                      QA Agent                        │
│  Memory: .opencode/memory/qa/                       │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                   Reviewer Agent                     │
│  Memory: .opencode/memory/reviewer/                 │
└─────────────────────────────────────────────────────┘
```

---

## Integration Points

| Integration | Type | Direction | Notes |
|-------------|------|-----------|-------|
| GitHub API | REST API | Inbound/Outbound | Issue/PR management |
| GitHub Actions | Workflow | Inbound | Trigger execution |
| OpenCode | CLI | Outbound | AI execution engine |

---

## Module Change History

| Date | Module | Change Type | Notes |
|------|--------|-------------|-------|
| | | | |

---

## Notes

- Update this file when modules are added, removed, or restructured
- Keep dependency information accurate
- Use this map when assessing change impact