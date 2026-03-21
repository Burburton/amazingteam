---
name: github-integration
description: Use when working with GitHub issues, pull requests, releases, or repository operations. Provides systematic approach to GitHub API interactions via gh CLI.
trigger: user mentions GitHub issues, PRs, releases, or needs repository operations
---

# GitHub Integration Skill

## Purpose

Systematize GitHub operations for AI agents working with issues, pull requests, releases, and repository management. Uses `gh` CLI for all GitHub interactions.

## When to Use

- Creating or updating GitHub issues
- Managing pull requests (create, review, merge)
- Creating releases and tags
- Repository operations (branch management, file operations)
- Issue labeling and assignment
- GitHub project board operations

## Prerequisites

```bash
# Verify gh CLI is installed and authenticated
gh auth status

# If not authenticated:
gh auth login
```

## Core Operations

### Issue Management

#### Create Issue
```bash
# Basic issue creation
gh issue create --title "Issue title" --body "Issue description"

# With labels and assignee
gh issue create \
  --title "Fix login timeout" \
  --body "Users are experiencing timeout errors during login" \
  --label "bug,priority-high" \
  --assignee "@me"

# With project and milestone
gh issue create \
  --title "Add user dashboard" \
  --body "Implement user dashboard with analytics" \
  --project "Q2 Roadmap" \
  --milestone "v2.0"
```

#### Update Issue
```bash
# Add comment
gh issue comment 123 --body "Investigation complete. Root cause identified."

# Add labels
gh issue edit 123 --add-label "in-progress,needs-review"

# Close issue
gh issue close 123 --comment "Fixed in #456"

# Reopen issue
gh issue reopen 123 --comment "Regression detected in v1.2.3"
```

#### List/Search Issues
```bash
# List open issues
gh issue list --state open --limit 20

# Search with filters
gh issue list \
  --label "bug" \
  --assignee "@me" \
  --state open

# Search by keyword
gh search issues "login timeout" --repo owner/repo
```

### Pull Request Management

#### Create PR
```bash
# Basic PR creation
gh pr create \
  --title "feat: Add user authentication" \
  --body "Implements JWT-based authentication system"

# With reviewers and labels
gh pr create \
  --title "fix: Resolve login timeout" \
  --body "Fixes #123\n\nChanges:\n- Increased timeout to 30s\n- Added retry logic" \
  --reviewer "teammate1,teammate2" \
  --label "bug,needs-review" \
  --base main \
  --head feature/login-fix

# Draft PR
gh pr create --draft --title "WIP: New feature"
```

#### Review PR
```bash
# View PR details
gh pr view 456

# Checkout PR locally
gh pr checkout 456

# Approve PR
gh pr review 456 --approve --body "LGTM! Great work."

# Request changes
gh pr review 456 --request-changes --body "Please add unit tests for the new function."

# Comment on PR
gh pr review 456 --comment --body "Question: Why did you choose this approach?"
```

#### Merge PR
```bash
# Merge with default method
gh pr merge 456 --merge

# Squash merge
gh pr merge 456 --squash --delete-branch

# Rebase merge
gh pr merge 456 --rebase
```

### Release Management

#### Create Release
```bash
# Create release with tag
gh release create v1.2.0 \
  --title "Version 1.2.0" \
  --notes "## Changes\n- Feature A\n- Bug fix B"

# Create from existing tag
gh release create v1.2.0 --target main

# Create with assets
gh release create v1.2.0 \
  --title "Version 1.2.0" \
  ./dist/app.zip ./dist/checksums.txt
```

#### Manage Releases
```bash
# List releases
gh release list --limit 10

# View release details
gh release view v1.2.0

# Delete release (and tag)
gh release delete v1.2.0 --yes

# Upload assets to existing release
gh release upload v1.2.0 ./dist/app.zip
```

### Repository Operations

#### Branch Management
```bash
# List branches
gh branch list

# Create branch
gh branch create feature/new-feature --base main

# Delete branch
gh branch delete feature/old-feature --yes
```

#### Repository Info
```bash
# View repo info
gh repo view

# List repo contents
gh api repos/{owner}/{repo}/contents

# Get repo stats
gh repo view --json stargazerCount,forkCount,openIssuesCount
```

## AmazingTeam Integration

### Issue Creation Workflow

```bash
# 1. Triage agent creates issue
gh issue create \
  --title "[Bug] Login timeout on slow networks" \
  --body "## Description\nUsers report 30-second timeouts...\n\n## Steps to Reproduce\n1. ...\n2. ...\n\n## Expected Behavior\n...\n\n## Environment\n- Browser: ...\n- Version: ..." \
  --label "bug,needs-triage"

# 2. Planner breaks down into sub-issues
gh issue create \
  --title "[Subtask] Investigate timeout configuration" \
  --body "Parent: #123\n\nInvestigate current timeout settings and identify bottlenecks." \
  --label "subtask,investigation"

# 3. Link parent issue
gh issue comment 123 --body "Subtask created: #124"
```

### PR Workflow Integration

```bash
# 1. Developer creates feature branch
gh branch create feature/login-timeout-fix --base main

# 2. After implementation, create PR
gh pr create \
  --title "fix: Increase login timeout and add retry logic" \
  --body "Fixes #123\n\n## Changes\n- Increased timeout from 10s to 30s\n- Added exponential backoff retry\n- Added unit tests\n\n## Testing\n- [x] Unit tests pass\n- [x] Manual testing on slow network\n\n## Checklist\n- [x] Code follows project conventions\n- [x] Tests added/updated\n- [x] Documentation updated" \
  --label "bug,needs-review" \
  --reviewer "@me"

# 3. After review approval
gh pr merge --squash --delete-branch
```

## Error Handling

### Common Errors

```bash
# Authentication error
# Solution: Run gh auth login

# Permission denied
# Solution: Check repository permissions, ensure GITHUB_TOKEN has correct scopes

# Branch protection error
# Solution: PR must be reviewed before merging, or use admin privileges
```

### Rate Limiting

```bash
# Check rate limit
gh api rate_limit

# If rate limited, wait and retry
sleep 60 && gh issue list
```

## Best Practices

### DO
- ✅ Use `--body-file` for long descriptions
- ✅ Link issues with "Fixes #123" or "Closes #123"
- ✅ Use semantic commit prefixes in PR titles (feat:, fix:, refactor:)
- ✅ Delete branches after merging
- ✅ Add meaningful labels to issues and PRs

### DON'T
- ❌ Force push to protected branches
- ❌ Merge without review (unless explicitly allowed)
- ❌ Create PRs without description
- ❌ Ignore CI failures before merging

## Two-Repository Release (AmazingTeam Specific)

For projects with dual repository release process:

```bash
# 1. Update main repo
cd amazingteam
# Update VERSION, package.json, CHANGELOG.md
git add -A && git commit -m "chore: Release v3.0.16"
git push origin main
git tag v3.0.16
git push origin v3.0.16

# 2. Update action repo
cd ../amazingteam-action
# Update action.yml, README.md
git add -A && git commit -m "chore: Update to v3.0.16"
git push origin main
git tag v3.0.16
git push origin v3.0.16

# 3. Publish to NPM (if applicable)
cd ../amazingteam
npm publish --otp=<OTP>
```

## Examples

### Complete Feature Workflow

```bash
# 1. Create issue
ISSUE=$(gh issue create \
  --title "feat: Add dark mode support" \
  --body "Implement dark mode with system preference detection" \
  --label "enhancement" \
  --json number --jq '.number')

# 2. Create branch
gh branch create "feature/dark-mode-$ISSUE" --base main

# 3. After development, create PR
gh pr create \
  --title "feat: Add dark mode support" \
  --body "Closes #$ISSUE\n\nImplementation details..." \
  --label "enhancement,needs-review"

# 4. After approval, merge
gh pr merge --squash --delete-branch

# 5. Close issue
gh issue close $ISSUE --comment "Implemented in PR"
```