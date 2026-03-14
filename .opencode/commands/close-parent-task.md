---
description: Verify completion conditions and close parent issue
agent: planner
---
Verify that all subtasks are complete and the parent issue can be closed.

## Steps

### 1. Read Parent Task Manifest

Check `tasks/issue-{N}/task.yaml` for:
- Overall acceptance criteria
- List of all subtasks
- Overall status

### 2. Verify All Subtasks Complete

For each subtask:
- Check `status: done` in task.yaml
- Verify GitHub issue is closed
- Check linked PR is merged (if applicable)

```bash
gh issue view {subtask-issue} --json state
gh pr view {pr-number} --json state,mergedAt
```

### 3. Verify Acceptance Criteria

For each criterion in `overall_acceptance_criteria`:
- Is there evidence of completion?
- Are there tests covering this?
- Is documentation updated?

### 4. Check for Unresolved Blockers

- No open blocking issues
- No failing CI
- No pending reviews

### 5. Close GitHub Issue

If all conditions met:
```bash
gh issue close {parent-issue} --comment "All subtasks completed. Closing parent issue."
```

### 6. Update Task Records

Update `task.yaml`:
```yaml
status: done
closed_at: YYYY-MM-DD
completion_summary: |
  All subtasks completed successfully.
  - Subtask 01: done
  - Subtask 02: done
  ...
```

## Completion Checklist

- [ ] All subtasks have status: done
- [ ] All GitHub sub-issues are closed
- [ ] All linked PRs are merged
- [ ] Overall acceptance criteria satisfied
- [ ] No unresolved blockers
- [ ] Validation coverage complete
- [ ] Documentation updated (if required)

## Output Format

### Success

```
Parent Issue Close Verification
================================

Parent: issue-{N} - {title}
GitHub: #{issue-number}

Subtask Status:
✓ issue-{N}-subtask-01: done (GitHub: #201 closed, PR #250 merged)
✓ issue-{N}-subtask-02: done (GitHub: #202 closed, PR #251 merged)
✓ issue-{N}-subtask-03: done (GitHub: #203 closed, PR #252 merged)

Acceptance Criteria:
✓ Criterion 1: Verified by tests
✓ Criterion 2: Documented in design.md
✓ Criterion 3: PR #250 includes changes

Unresolved Blockers: None

Result: READY TO CLOSE
Action: gh issue close {issue-number} --comment "All subtasks completed."
```

### Not Ready

```
Parent Issue Close Verification
================================

Parent: issue-{N} - {title}
GitHub: #{issue-number}

Subtask Status:
✓ issue-{N}-subtask-01: done
✗ issue-{N}-subtask-02: in_progress (PR #251 pending review)
○ issue-{N}-subtask-03: pending (depends on subtask-02)

Incomplete Items:
- Subtask 02 needs review approval
- Subtask 03 not started

Unresolved Blockers:
- PR #251 awaiting review

Result: NOT READY TO CLOSE
Reason: 2 subtasks incomplete
Next Action: /dispatch-next to continue subtask 02
```