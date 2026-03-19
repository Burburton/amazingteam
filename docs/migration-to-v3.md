# Migration Guide: v2 to v3

This guide helps you migrate from AmazingTeam Foundation v2 to v3.

---

## Overview of Changes

### v2 Architecture
- Foundation files committed to each project
- ~50+ files in `.amazing-team/`, `.opencode/`, `tasks/`, etc.
- Upgrades require manual copy/merge
- Difficult to track which version is being used

### v3 Architecture
- Foundation loaded at runtime from NPM/GitHub
- Only 2-3 files needed in user repo
- One-command upgrades
- Explicit version control
- Better separation of user customizations

---

## Migration Steps

### Step 1: Backup Your Project

```bash
# Create a backup branch
git checkout -b backup-before-v3-migration

# Commit any uncommitted changes
git add -A && git commit -m "chore: backup before v3 migration"

# Go back to main branch
git checkout main
```

### Step 2: Identify Your Customizations

Before migrating, identify what you've customized:

```bash
# Files you may have customized:
# - AGENTS.md (global rules)
# - .amazing-team/agents/*.md (agent behaviors)
# - .amazing-team/skills/*/skill.md (custom skills)
# - .amazing-team/commands/*.md (custom commands)
# - .amazing-team/memory/*/ (agent memories)
# - presets/ (if you created custom presets)
```

### Step 3: Run Migration Command

```bash
# Run the migration tool
npx amazingteam migrate

# This will:
# 1. Scan for v2 structure
# 2. Extract your customizations
# 3. Create amazingteam.config.yaml
# 4. Generate new workflow file
# 5. Update .gitignore
# 6. Remove foundation files from git tracking
```

### Step 4: Review Generated Files

The migration creates these files:

```
your-project/
├── amazingteam.config.yaml      # Your extracted configuration
├── .github/
│   └── workflows/
│       └── amazingteam.yml      # Updated workflow
└── .gitignore               # Updated to ignore foundation files
```

Review `amazingteam.config.yaml` and adjust as needed.

### Step 5: Handle Customizations

#### Custom AGENTS.md
If you modified `AGENTS.md`, you have two options:

**Option A: Overlay in config**
```yaml
# amazingteam.config.yaml
overlay:
  agents: |
    # Your custom AGENTS.md additions
    ## Custom Rules
    - Your custom rules here
```

**Option B: Keep local AGENTS.md**
```bash
# Keep your custom AGENTS.md
# It will be used instead of foundation's
```

#### Custom Skills
```bash
# Keep your custom skills in .amazing-team/skills/
# They will be merged with foundation skills
```

#### Custom Commands
```yaml
# Add custom commands in config
commands:
  my-custom-command:
    description: "My custom workflow"
    sequence:
      - triage
      - architect
      - developer
```

### Step 6: Remove Foundation Files

```bash
# The migration tool does this automatically, but verify:
git rm -r --cached .amazing-team/agents/
git rm -r --cached .amazing-team/skills/
git rm -r --cached .amazing-team/commands/
git rm -r --cached .opencode/skills/
git rm -r --cached .opencode/commands/
git rm --cached AGENTS.md

# But KEEP these directories (they contain your data):
# - .amazing-team/memory/ (your agent memories)
# - tasks/ (your task history)
```

### Step 7: Update .gitignore

Add these entries to `.gitignore`:

```gitignore
# AmazingTeam Foundation v3
.amazing-team-local/
```

### Step 8: Commit Migration

```bash
git add -A
git commit -m "chore: migrate to AmazingTeam Foundation v3

- Remove committed foundation files
- Add amazingteam.config.yaml
- Update workflow file
- Update .gitignore
"
```

### Step 9: Test Migration

```bash
# Download foundation locally
npx amazingteam local

# Verify setup
npx amazingteam validate

# Check status
npx amazingteam status
```

### Step 10: Push and Test in CI

```bash
git push origin main

# Create a test issue with a command like:
# /ai status
```

---

## Detailed Migration Scenarios

### Scenario 1: Minimal Customization

If you only changed presets and have no custom skills/commands:

```yaml
# amazingteam.config.yaml
version: "1.0"
project:
  name: "my-project"
  language: "typescript"

build:
  command: "npm run build"
  test: "npm test"
  lint: "npm run lint"
```

### Scenario 2: Custom Skills

If you created custom skills:

```bash
# Keep your skills
mkdir -p .amazing-team/skills
# Your existing skills remain in .amazing-team/skills/

# They will be automatically merged with foundation skills
```

### Scenario 3: Modified AGENTS.md

If you heavily modified `AGENTS.md`:

**Option A: Use as overlay**
```yaml
# amazingteam.config.yaml
overlay:
  content: |
    # Your custom additions to AGENTS.md
    ## Project-Specific Rules
    - Use specific naming conventions
    - Follow company coding standards
```

**Option B: Replace entirely**
```bash
# Keep your AGENTS.md as-is
# It will override foundation's AGENTS.md
```

### Scenario 4: Custom Memory Content

Your agent memories in `.amazing-team/memory/` are preserved:

```bash
# These directories are NOT removed during migration:
.amazing-team/memory/planner/
.amazing-team/memory/developer/
# etc.
```

---

## Breaking Changes

### 1. Skill Path Changes

**v2:**
```
.opencode/skills/test-first-feature-dev/SKILL.md
```

**v3:**
Skills are loaded from foundation at runtime. Custom skills in `.amazing-team/skills/` are merged.

### 2. Command Path Changes

**v2:**
```
.opencode/commands/auto.md
```

**v3:**
Commands are loaded from foundation. Custom commands defined in `amazingteam.config.yaml`.

### 3. Preset Structure

**v2:**
Presets were files in `presets/` directory.

**v3:**
Presets are built-in to foundation. Specify by name:

```yaml
# amazingteam.config.yaml
preset: "typescript"  # or "python", "go", "default"
```

---

## Troubleshooting

### "Migration tool not found"

```bash
# Install globally first
npm install -g amazingteam

# Or use npx
npx amazingteam migrate
```

### "v2 structure not detected"

The migration tool looks for these markers:
- `.amazing-team/agents/` directory
- `.opencode/skills/` directory
- `AGENTS.md` file

If your project uses a different structure, you may need to create `amazingteam.config.yaml` manually.

### "My customizations were lost"

1. Check the `backup-before-v3-migration` branch
2. Look for extracted customizations in `amazingteam.config.yaml`
3. Your memories and tasks are preserved in `.amazing-team/memory/` and `tasks/`

### "CI fails after migration"

1. Verify `amazingteam.config.yaml` exists
2. Verify `.github/workflows/amazingteam.yml` exists
3. Check GitHub Actions logs for specific error
4. Run `npx amazingteam validate` locally

### "OpenCode can't find commands/skills"

```bash
# Download foundation locally
npx amazingteam local

# Verify opencode.jsonc exists
cat opencode.jsonc
```

---

## Rollback

If migration causes issues, rollback:

```bash
# Restore from backup
git checkout backup-before-v3-migration

# Create a new branch for another migration attempt
git checkout -b retry-v3-migration

# Try migration again
npx amazingteam migrate
```

---

## Getting Help

If you encounter issues:

1. Check the [troubleshooting guide](./quick-start-v3.md#troubleshooting)
2. Review [config reference](./config-reference.md)
3. Open an issue at https://github.com/your-org/amazingteam/issues