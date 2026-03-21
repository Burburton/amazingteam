# Plan: Implement Full Execution Flow for AmazingTeam Workflow

## Confirmed Decisions

| 决策项 | 选择 | 说明 |
|--------|------|------|
| 执行引擎 | OpenCode | 使用 `anomalyco/opencode/github@latest` |
| 上下文准备 | Context 文件 | 创建 `tasks/issue-{id}/context.md` |
| 模型选择 | glm-5 | 设置 `OPENCODE_MODEL=bailian-coding-plan/glm-5` |
| 分支策略 | 依赖感知 | 无依赖→main，有依赖→依赖分支 |
| 错误处理 | 3次重试 | CI Analyst 分析解决，失败通知人类 |
| Job 合并 | 是 | execute + execute-direct → execute |

---

## Architecture Design

### Branch Strategy (Dependency-Aware)

```
Issue #1 (Parent)
    │
    ├── Issue #2 (subtask, no deps)
    │       base: main
    │       branch: ai/issue-2
    │       PR: ai/issue-2 → main
    │       status: merged ✓
    │
    ├── Issue #3 (subtask, depends on #2)
    │       base: ai/issue-2 (before merge) or main (after merge)
    │       branch: ai/issue-3
    │       PR: ai/issue-3 → main
    │       status: merged ✓
    │
    └── Issue #4 (subtask, depends on #3)
            base: ai/issue-3 (before merge) or main (after merge)
            branch: ai/issue-4
            PR: ai/issue-4 → main
            status: pending
```

**Implementation Logic**:
```bash
# Determine base branch
if [ -z "$DEPENDENCIES" ] || [ "$DEPENDENCIES" = "[]" ]; then
  BASE_BRANCH="main"
else
  # Get the last dependency's branch (if still open) or main (if merged)
  LAST_DEP=$(echo "$DEPENDENCIES" | jq -r '.[-1]')
  DEP_STATE=$(gh issue view "$LAST_DEP" --json state -q '.state')
  
  if [ "$DEP_STATE" = "CLOSED" ]; then
    BASE_BRANCH="main"
  else
    # Check if dependency has an open PR/branch
    DEP_BRANCH="ai/issue-$LAST_DEP"
    if git ls-remote --heads origin "$DEP_BRANCH" | grep -q .; then
      BASE_BRANCH="$DEP_BRANCH"
    else
      BASE_BRANCH="main"
    fi
  fi
fi
```

### Context File Structure

**File**: `tasks/issue-{id}/context.md`

```markdown
# Task: {Issue Title}

## Issue Number
{issue_number}

## Parent Issue
#{parent_issue}

## Role
{role} (architect | developer | qa)

## Dependencies
{dependencies: [issue_num, ...]}

## Task Description
{Full issue body from parent, or specific subtask description}

## Acceptance Criteria
- [ ] {criterion 1}
- [ ] {criterion 2}

## Technical Context
{Any design decisions from architect phase}

## Instructions for AI
1. Read the task description above
2. Create a branch: `ai/issue-{issue_number}`
3. Implement the changes
4. Create a PR targeting the appropriate base branch
5. Reference this issue in the PR description with "Closes #{issue_number}"
```

### Error Handling Flow

```
Execute Job
    │
    ├── Run OpenCode
    │       │
    │       ├── Success → PR created
    │       │
    │       └── Failure
    │               │
    │               ▼
    │       Check retry count
    │               │
    │               ├── retry < 3
    │               │       │
    │               │       ▼
    │               │   Dispatch CI Analyst
    │               │       │
    │               │       ▼
    │               │   CI Analyst analyzes
    │               │       │
    │               │       ├── Can fix → Fix + Comment "/oc" → Retry
    │               │       │
    │               │       └── Cannot fix → Notify human
    │               │
    │               └── retry >= 3
    │                       │
    │                       ▼
    │               Mark as blocked
    │               Block downstream issues
    │               Notify human
    │
    └── End
```

---

## Implementation Details

### 1. Context File Generation (in Decompose Job)

Add to `decompose` job:

```yaml
- name: Generate Context Files
  run: |
    for row in $(echo "$CREATED" | jq -r '.[] | @base64'); do
      ST_NUM=$(echo "$row" | base64 -d | jq -r '.issue')
      ST_TITLE=$(echo "$row" | base64 -d | jq -r '.title')
      ST_ROLE=$(echo "$row" | base64 -d | jq -r '.role')
      ST_DEPS=$(echo "$row" | base64 -d | jq -c '.depends_on')
      
      mkdir -p "tasks/issue-$ST_NUM"
      
      cat > "tasks/issue-$ST_NUM/context.md" << EOF
    # Task: $ST_TITLE
    
    ## Issue Number
    $ST_NUM
    
    ## Parent Issue
    #$PARENT_NUM
    
    ## Role
    $ST_ROLE
    
    ## Dependencies
    $ST_DEPS
    
    ## Task Description
    $ST_TITLE - Part of parent issue #$PARENT_NUM
    
    ## Instructions for AI
    1. Read the task description above
    2. Create a branch: \`ai/issue-$ST_NUM\`
    3. Implement the changes
    4. Create a PR
    5. Reference this issue: "Closes #$ST_NUM"
    EOF
    done
```

### 2. Merged Execute Job

**Triggers**: 
- Simple task (`action=triage` and `complexity=simple`)
- Subtask execution (`action=execute_subtask`)

```yaml
execute:
  needs: [planner, triage]
  if: |
    needs.planner.outputs.action == 'execute_subtask' ||
    (needs.triage.outputs.complexity == 'simple' && needs.triage.result == 'success')
  runs-on: ubuntu-latest
  timeout-minutes: 30
  outputs:
    issue_num: ${{ steps.context.outputs.issue_num }}
    status: ${{ steps.result.outputs.status }}
    retry_count: ${{ steps.context.outputs.retry_count }}
  permissions:
    issues: write
    contents: write
    pull-requests: write
    actions: write
  
  steps:
    # 1. Checkout
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
        token: ${{ secrets.GITHUB_TOKEN }}
    
    # 2. Setup Git
    - run: |
        git config --global user.name "opencode-bot"
        git config --global user.email "opencode-bot@users.noreply.github.com"
    
    # 3. Determine Issue Number
    - name: Determine Issue
      id: issue
      run: |
        if [ "${{ needs.planner.outputs.action }}" = "execute_subtask" ]; then
          echo "issue_num=${{ needs.planner.outputs.issue_num }}" >> $GITHUB_OUTPUT
        else
          echo "issue_num=${{ needs.planner.outputs.issue_num }}" >> $GITHUB_OUTPUT
        fi
    
    # 4. Prepare Context & Determine Base Branch
    - name: Prepare Context
      id: context
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ISSUE_NUM: ${{ steps.issue.outputs.issue_num }}
      run: |
        # Get issue details
        ISSUE_DATA=$(gh issue view "$ISSUE_NUM" --json title,body,state)
        TITLE=$(echo "$ISSUE_DATA" | jq -r '.title')
        BODY=$(echo "$ISSUE_DATA" | jq -r '.body')
        
        # Extract dependencies from body
        DEPS=$(echo "$BODY" | grep -oE 'Dependencies: \[[0-9,\s]*\]' | grep -oE '\[[0-9,\s]*\]' || echo "[]")
        
        # Use existing context file or create one
        if [ ! -f "tasks/issue-$ISSUE_NUM/context.md" ]; then
          mkdir -p "tasks/issue-$ISSUE_NUM"
          cat > "tasks/issue-$ISSUE_NUM/context.md" << EOF
        # Task: $TITLE
        
        ## Issue Number
        $ISSUE_NUM
        
        ## Task Description
        $BODY
        
        ## Dependencies
        $DEPS
        
        ## Instructions for AI
        1. Read the task description above
        2. Create a branch: \`ai/issue-$ISSUE_NUM\`
        3. Implement the changes
        4. Create a PR
        5. Reference this issue: "Closes #$ISSUE_NUM"
        EOF
        fi
        
        # Determine base branch based on dependencies
        if [ "$DEPS" = "[]" ] || [ -z "$DEPS" ]; then
          BASE_BRANCH="main"
        else
          LAST_DEP=$(echo "$DEPS" | jq -r '.[-1]')
          DEP_BRANCH="ai/issue-$LAST_DEP"
          if git ls-remote --heads origin "$DEP_BRANCH" 2>/dev/null | grep -q .; then
            BASE_BRANCH="$DEP_BRANCH"
          else
            BASE_BRANCH="main"
          fi
        fi
        
        echo "base_branch=$BASE_BRANCH" >> $GITHUB_OUTPUT
        echo "issue_num=$ISSUE_NUM" >> $GITHUB_OUTPUT
        
        # Get retry count
        RETRY_COUNT=0
        if [ -f "tasks/issue-$ISSUE_NUM/task.yaml" ]; then
          RETRY_COUNT=$(grep "retry_count:" tasks/issue-$ISSUE_NUM/task.yaml 2>/dev/null | awk '{print $2}' || echo "0")
        fi
        echo "retry_count=${RETRY_COUNT:-0}" >> $GITHUB_OUTPUT
    
    # 5. Setup Foundation
    - uses: Burburton/amazingteam-action@v1
      with:
        version: '3.0.23'
        config: 'amazingteam.config.yaml'
    
    # 6. Run OpenCode
    - name: Run OpenCode
      id: opencode
      uses: anomalyco/opencode/github@latest
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        OPENCODE_MODEL: bailian-coding-plan/glm-5
      continue-on-error: true
    
    # 7. Handle Result
    - name: Handle Result
      id: result
      if: always()
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ISSUE_NUM: ${{ steps.context.outputs.issue_num }}
        OPENCODE_OUTCOME: ${{ steps.opencode.outcome }}
      run: |
        if [ "$OPENCODE_OUTCOME" = "success" ]; then
          PR=$(gh pr list --author opencode-bot --state open --json url,number -q '.[0]' 2>/dev/null || echo "")
          
          if [ -n "$PR" ] && [ "$PR" != "null" ]; then
            PR_NUM=$(echo "$PR" | jq -r '.number')
            PR_URL=$(echo "$PR" | jq -r '.url')
            gh issue comment "$ISSUE_NUM" --body "## ✅ Implementation Complete\n\nPR: #$PR_NUM\n$PR_URL\n\nWaiting for review and merge."
            echo "status=pr_created" >> $GITHUB_OUTPUT
          else
            gh issue comment "$ISSUE_NUM" --body "## ✅ Implementation Complete\n\nNo PR was created. Check logs."
            echo "status=no_pr" >> $GITHUB_OUTPUT
          fi
        else
          gh issue comment "$ISSUE_NUM" --body "## ⚠️ Execution Failed\n\nOpenCode encountered an error. CI Analyst will investigate."
          echo "status=failed" >> $GITHUB_OUTPUT
        fi
    
    # 8. Update Task Status
    - name: Update Task Status
      if: always()
      env:
        ISSUE_NUM: ${{ steps.context.outputs.issue_num }}
        STATUS: ${{ steps.result.outputs.status }}
        RETRY_COUNT: ${{ steps.context.outputs.retry_count }}
      run: |
        if [ -f "tasks/issue-$ISSUE_NUM/task.yaml" ]; then
          if [ "$STATUS" = "failed" ]; then
            NEW_RETRY=$((RETRY_COUNT + 1))
            sed -i "s/retry_count:.*/retry_count: $NEW_RETRY/" tasks/issue-$ISSUE_NUM/task.yaml 2>/dev/null || \
              echo "retry_count: $NEW_RETRY" >> tasks/issue-$ISSUE_NUM/task.yaml
          fi
          git add tasks/ && git commit -m "chore: update task status" || true
          git push || true
        fi
```

### 3. CI Analyst Job

```yaml
ci-analyst:
  needs: execute
  if: needs.execute.outputs.status == 'failed'
  runs-on: ubuntu-latest
  timeout-minutes: 15
  permissions:
    issues: write
    contents: read
  steps:
    - uses: actions/checkout@v4
    
    - name: Analyze Failure
      id: analyze
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ISSUE_NUM: ${{ needs.execute.outputs.issue_num }}
        RETRY_COUNT: ${{ needs.execute.outputs.retry_count }}
        AMAZINGTEAM_API_KEY: ${{ secrets.AMAZINGTEAM_API_KEY }}
      run: |
        CONTEXT=$(cat tasks/issue-$ISSUE_NUM/context.md 2>/dev/null || echo "No context")
        
        PROMPT="Analyze this OpenCode execution failure:\n\nIssue: #$ISSUE_NUM\nRetry: $RETRY_COUNT/3\nContext:\n$CONTEXT\n\nSuggest a fix or indicate if human intervention is needed."
        
        ANALYSIS=$(curl -s -X POST "https://coding.dashscope.aliyuncs.com/apps/anthropic/v1/messages" \
          -H "x-api-key: $AMAZINGTEAM_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d "{\"model\":\"glm-5\",\"max_tokens\":1000,\"messages\":[{\"role\":\"user\",\"content\":\"$PROMPT\"}]}" \
          | jq -r '.content[0].text // .content[0].thinking // "Analysis failed"')
        
        echo "analysis<<EOF" >> $GITHUB_OUTPUT
        echo "$ANALYSIS" >> $GITHUB_OUTPUT
        echo "EOF" >> $GITHUB_OUTPUT
    
    - name: Check Retry Limit
      id: check
      run: |
        RETRY_COUNT="${{ needs.execute.outputs.retry_count }}"
        if [ "${RETRY_COUNT:-0}" -ge 3 ]; then
          echo "max_retries=true" >> $GITHUB_OUTPUT
        else
          echo "max_retries=false" >> $GITHUB_OUTPUT
        fi
    
    - name: Notify Human (Max Retries)
      if: steps.check.outputs.max_retries == 'true'
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ISSUE_NUM: ${{ needs.execute.outputs.issue_num }}
      run: |
        gh issue edit "$ISSUE_NUM" --add-label "status:blocked" || true
        gh issue comment "$ISSUE_NUM" --body "## 🚫 Max Retries Exceeded\n\nAfter 3 attempts, this issue could not be completed.\n\n### Analysis\n${{ steps.analyze.outputs.analysis }}\n\n### Action Required\nHuman intervention needed. Downstream issues are blocked.\n\nComment \`/oc\` to retry, or \`/skip\` to skip."
    
    - name: Retry Execution
      if: steps.check.outputs.max_retries == 'false'
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ISSUE_NUM: ${{ needs.execute.outputs.issue_num }}
      run: |
        gh issue comment "$ISSUE_NUM" --body "## 🔄 Retrying\n\nAnalysis complete. Retrying...\n\n### Analysis\n${{ steps.analyze.outputs.analysis }}"
        sleep 5
        gh issue comment "$ISSUE_NUM" --body "/oc"
```

### 4. Remove execute-direct Job

The `execute-direct` job will be completely removed. Its trigger condition is now handled by `execute`.

---

## Files to Modify

| File | Changes |
|------|---------|
| `.github/workflows/amazingteam-auto.yml` | Remove `execute-direct`, redesign `execute`, add `ci-analyst`, update `decompose` for context files |
| `tasks/_template/task.yaml` | Add `retry_count` and `last_error` fields |

---

## Testing Checklist

- [ ] Simple task creates PR via OpenCode
- [ ] Complex task decomposes with context files
- [ ] First subtask (no deps) creates branch from main
- [ ] Dependent subtask creates branch from dependency
- [ ] PR merge triggers next subtask
- [ ] Failure triggers CI Analyst
- [ ] CI Analyst retry works (up to 3 times)
- [ ] Max retries notifies human and blocks downstream