# AI Team Foundation v3 - Quick Start (Draft)

## Overview

This guide shows how to use AI Team Foundation v3 in your project with minimal setup.

---

## Installation

### Option 1: Initialize in Existing Project

```bash
# Navigate to your project
cd my-project

# Initialize AI Team
npx ai-team-foundation init
```

### Option 2: Create New Project

```bash
# Create new project with AI Team
npx ai-team-foundation init my-new-project
cd my-new-project
```

---

## What Gets Created

```
my-project/
├── .github/
│   └── workflows/
│       └── ai-team.yml      # GitHub Action workflow
├── ai-team.config.yaml      # Your configuration
└── .gitignore               # Updated (ignores .ai-team-local/)
```

**That's it!** Only 3 files added to your repository.

---

## Configuration

### Minimal Configuration

```yaml
# ai-team.config.yaml
project:
  name: "my-project"
  language: "typescript"
```

### Full Configuration

```yaml
# ai-team.config.yaml
version: "1.0"

project:
  name: "my-awesome-app"
  description: "My awesome application"
  language: "typescript"
  framework: "react"

# Build commands (override defaults)
build:
  command: "npm run build"
  test: "npm test"
  lint: "npm run lint"
  typecheck: "npm run typecheck"

# Custom rules
rules:
  test_coverage_threshold: 80
  max_function_lines: 30
  commit_convention: "conventional"

# Agent configuration
agents:
  planner: true
  architect: true
  developer: true
  qa: true
  reviewer: true
  triage: true
  ci_analyst: true

# Technology overlay (optional)
overlay: "web-fullstack"
```

---

## Usage

### In GitHub (CI/CD)

1. Push your code to GitHub
2. Create an issue or comment on an issue
3. Type a command like `/ai implement this feature`
4. AI Team will process your request

### Local Development

```bash
# Download foundation for local use
npx ai-team-foundation local

# This creates .ai-team-local/ with all foundation files
# Now you can use OpenCode locally with full AI Team capabilities
```

---

## Upgrading

### Check for Updates

```bash
npx ai-team-foundation check-update

# Output:
# Current version: 3.0.0
# Latest version: 3.1.0
# 
# Changes in 3.1.0:
# - feat: New skill for API documentation
# - fix: Memory handling improvement
# 
# Run `ai-team upgrade` to update
```

### Upgrade

```bash
npx ai-team-foundation upgrade

# Output:
# Upgrading from 3.0.0 to 3.1.0...
# 
# Updated files:
# - .github/workflows/ai-team.yml
# 
# No breaking changes.
# Upgrade complete!
```

### Upgrade to Specific Version

```bash
npx ai-team-foundation upgrade --to 3.0.5
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize AI Team in project |
| `version` | Show current foundation version |
| `check-update` | Check for available updates |
| `upgrade` | Upgrade to latest version |
| `local` | Download foundation for local dev |
| `validate` | Validate configuration |

---

## Workflow File

The generated `.github/workflows/ai-team.yml`:

```yaml
name: AI Team

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  ai-team:
    if: |
      startsWith(github.event.comment.body, '/ai') ||
      startsWith(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup AI Team
        uses: your-org/ai-team-action@v3.0.0  # Version is auto-managed
        with:
          config: 'ai-team.config.yaml'

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ALIBABA_CODING_PLAN_API_KEY: ${{ secrets.ALIBABA_CODING_PLAN_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          model: alibaba-coding-plan/glm-5
```

---

## Comparison: v2 vs v3

| Aspect | v2 | v3 |
|--------|----|----|
| Files in user repo | ~50+ files | 2-3 files |
| Upgrade method | Manual copy/merge | Single command |
| Foundation location | Committed to repo | Loaded at runtime |
| Local development | Files already present | `ai-team local` command |
| Version control | Hard to track | Explicit in workflow |

---

## Migration from v2

If you have an existing v2 project:

```bash
# Run migration
npx ai-team-foundation migrate

# This will:
# 1. Extract your customizations
# 2. Create ai-team.config.yaml
# 3. Update workflow file
# 4. Add foundation files to .gitignore
# 5. Remove foundation files from git tracking
```

---

## FAQ

### Q: What if I need to customize AGENTS.md?

A: You can create a local `AGENTS.md` in your project root. It will be merged with foundation's AGENTS.md.

### Q: What if I need custom skills?

A: Create `.ai-team/skills/` in your project. These will be merged with foundation skills.

### Q: What if CI fails to download foundation?

A: The action caches foundation downloads. If network fails, it uses cache. You can also run `ai-team local` and commit `.ai-team-local/` as fallback.

### Q: Can I use a specific version?

A: Yes, specify version in workflow file or use `ai-team upgrade --to x.x.x`.

---

## Troubleshooting

### "Foundation download failed"

```bash
# Try downloading manually
npx ai-team-foundation local

# If still fails, check network or use VPN
```

### "Configuration validation failed"

```bash
# Validate your config
npx ai-team-foundation validate

# Check for errors and fix
```

### "OpenCode can't find skills"

```bash
# Ensure foundation is downloaded
npx ai-team-foundation local

# Check opencode.jsonc references
cat opencode.jsonc
```