---
description: Execute full automated workflow from issue to pull request
agent: planner
---
Execute the complete automated workflow: Triage → (Decompose if needed) → Design → Implement → Test → Create PR.

## Role

You are the **Planner** coordinating this workflow. Your job is to **dispatch to appropriate roles**, not execute all steps yourself.

## Workflow Decision Tree

```
                    ┌─────────────┐
                    │   Triage    │
                    │ (Classify)  │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
        Simple Task              Complex Task
              │                         │
              │                         ▼
              │               ┌──────────────────┐
              │               │ Create Sub-Issues│
              │               │    on GitHub     │
              │               └────────┬─────────┘
              │                        │
              │                        ▼
              │               ┌──────────────────┐
              │               │ For each subtask │
              │               │ (respect deps)   │
              │               └────────┬─────────┘
              │                        │
              └────────────┬───────────┘
                           ↓
              ┌────────────────────────┐
              │ Design → Implement →   │
              │ Test → Create PR       │
              └────────────┬───────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │ Human Review│
                   │   & Merge   │
                   └─────────────┘
```

## Steps

### Step 1: Triage (Dispatch to Triage agent)
- Classify issue type (feature/bug/tech-task)
- Determine if decomposition is needed
- Return classification to Planner

### Step 2: Decision Point

**If NO decomposition needed:**
- Proceed directly to Step 3

**If decomposition needed:**
1. **Create Sub-Issues on GitHub**
   ```bash
   gh issue create --title "[Subtask] Title" --body "..." --label "type:subtask"
   ```
2. **Record dependencies** in parent issue body and local task.yaml
3. **Execute subtasks one by one** (respecting dependencies)
4. **Post comment** on parent issue listing all sub-issues

### Step 3: Design (Dispatch to Architect agent)
- Create implementation plan
- Identify affected modules
- Document design decisions

### Step 4: Implementation (Dispatch to Developer agent)
- Create branch: `feat/issue-{id}-{description}`
- Implement changes
- Write/update tests
- Run linters

### Step 5: Validation (Dispatch to QA agent)
- Run test suite
- Verify acceptance criteria
- Document validation results

### Step 6: PR Creation (Dispatch to Developer agent)
- Create Pull Request
- Link to original issue (or sub-issue)
- STOP - wait for human review

## GitHub Sub-Issue Creation

When decomposition is needed, create sub-issues:

```bash
# Configure git identity
git config user.name "opencode-bot"
git config user.email "opencode-bot@users.noreply.github.com"

# Create sub-issue
gh issue create \
  --title "[Subtask] Implement authentication API" \
  --body "Parent Issue: #120
Dependencies: None
Owner Role: developer

Scope:
- Implement login endpoint
- Add token validation

Acceptance Criteria:
- [ ] POST /auth/login works
- [ ] Returns valid JWT token" \
  --label "type:subtask,role:developer"
```

## Dependency Handling

For subtasks with dependencies:

```yaml
# In parent task.yaml
subtasks:
  - id: issue-120-subtask-01
    github_issue: 201
    title: "[Subtask] Design auth API"
    owner_role: architect
    status: done
    depends_on: []
    
  - id: issue-120-subtask-02
    github_issue: 202
    title: "[Subtask] Implement auth API"
    owner_role: developer
    status: pending
    depends_on: [201]  # Wait for #201 to complete
```

**Execution order:**
1. Execute #201 first (no dependencies)
2. After #201's PR is merged, execute #202
3. Continue until all subtasks done
4. Close parent issue

## Output

Post a summary comment:

**For simple task:**
```
## Workflow Complete

- **Classification**: feature (no decomposition)
- **Pull Request**: #123

Ready for human review and merge.
```

**For complex task:**
```
## Decomposition Complete

- **Parent Issue**: #120
- **Sub-issues created**: 3

| Sub-issue | Role | Status | Depends on |
|-----------|------|--------|------------|
| #201 | architect | ready | - |
| #202 | developer | blocked | #201 |
| #203 | qa | blocked | #202 |

Starting with #201 (Design phase)...

---

## Sub-issue #201 PR Created

- **Pull Request**: #204
- Ready for human review and merge.

After merge, run `/dispatch-next` to continue with #202.
```

## Blocker Handling

When a blocker is encountered during workflow:

### Step 1: Pause and Diagnose

```
## ⚠️ Workflow Blocked

- **Phase**: Implementation
- **Error**: {error_message}

Dispatching to CI Analyst for diagnosis...
```

### Step 2: CI Analyst Diagnosis

Dispatch to CI Analyst who determines:

| Resolution | Action |
|------------|--------|
| Auto-fix now | Fix immediately, continue |
| Create sub-issue (AI) | Create blocker sub-issue, resolve, resume |
| Create sub-issue (Human) | Create blocker sub-issue, notify human, wait |

### Step 3: Resolution Paths

**Path A: Auto-fix**
```markdown
## Blocker Auto-Resolved

- **Issue**: {description}
- **Fix Applied**: {fix_description}
- **Status**: Continuing workflow...
```

**Path B: Sub-issue (AI Resolve)**
```markdown
## Blocker Sub-issue Created

- **Blocker Issue**: #205 - [Blocker] {title}
- **Type**: {type}
- **Resolution**: AI will resolve
- **Status**: Resolving blocker...

---

## Blocker Resolved

- **Blocker**: #205 ✅
- **Resume**: Continuing original workflow...
```

**Path C: Human Required**
```markdown
## ⚠️ Workflow Blocked - Human Attention Required

- **Blocker Issue**: #206 - [Blocker] {title}
- **Reason**: {why human is needed}

### Required Actions
1. {action_1}
2. {action_2}

### To Resume
After resolving the blocker, comment:
```
/oc /resume
```

*Workflow is paused, waiting for human input.*
```

## Important

- **Planner coordinates, does not implement**
- **Create GitHub sub-issues** when decomposition is needed
- **Handle blockers gracefully** - diagnose, resolve or escalate
- **Respect dependencies** - don't start a subtask until its dependencies are merged
- **AI does NOT merge PRs** - humans review and merge
- **All changes go through PR** - never direct commits to main