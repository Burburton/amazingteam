# Planner Memory - Flow Rules

This file stores workflow progression rules and state machine logic.

---

## Task State Machine

```
backlog → ready → in_analysis → in_design → in_implementation → in_validation → in_review → release_candidate → done
                              ↓                                              ↓
                           blocked ←───────────────────────────────────────── ←
```

### Valid State Transitions

| Current State | Valid Next States |
|---------------|-------------------|
| backlog | ready |
| ready | in_analysis, blocked |
| in_analysis | in_design, blocked, ready |
| in_design | in_implementation, blocked, in_analysis |
| in_implementation | in_validation, blocked, in_design |
| in_validation | in_review, in_implementation, blocked |
| in_review | release_candidate, in_implementation, blocked |
| release_candidate | done, in_review, blocked |
| blocked | (previous state before blocking) |
| done | (terminal) |

---

## State Entry Criteria

### ready

- Task has clear description
- Acceptance criteria defined
- Priority assigned

### in_analysis

- Architect assigned
- Analysis document created

### in_design

- Analysis complete
- Design document created

### in_implementation

- Design approved
- Developer assigned

### in_validation

- Implementation complete
- Tests written

### in_review

- Tests passing
- PR created

### release_candidate

- Review approved
- All checks passing

### blocked

- Blocking issue documented
- Escalation path defined

### done

- All acceptance criteria met
- PR merged

---

## Notes

- Follow state transitions strictly
- Document blocking reasons
- Escalate long-blocked tasks