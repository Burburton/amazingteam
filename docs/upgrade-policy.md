# Upgrade Policy

This document defines the upgrade policy for AI Team Foundation.

## Versioning

AI Team Foundation follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Breaking changes requiring migration
- **MINOR** version: New features, backward compatible
- **PATCH** version: Bug fixes, backward compatible

## Upgrade Types

### Automatic Upgrades

The following changes can be applied automatically:

| Change Type | Class | Example |
|-------------|-------|---------|
| New agent added | B | Adding `ci-analyst.md` |
| New skill added | B | Adding `regression-checklist` |
| New command added | B | Adding `/release-check` |
| New memory directory | A | Adding `.amazing-team/memory/triage/` |
| New documentation zone | A | Adding `docs/patterns/` |
| Task template additions | A | Adding `release.md` template |
| Bug fixes to templates | B | Fixing typos in agent prompts |

### Review-Required Upgrades

The following changes require review before applying:

| Change Type | Class | Action |
|-------------|-------|--------|
| Agent prompt changes | B | Generate diff, review, then apply |
| Skill procedure changes | B | Generate diff, review, then apply |
| Command workflow changes | B | Generate diff, review, then apply |
| Workflow file changes | B | Generate diff, review, then apply |
| AGENTS.md updates | B | Generate diff, review, then apply |

### Manual-Approval Upgrades

The following changes require explicit human approval:

| Change Type | Class | Action |
|-------------|-------|--------|
| Architecture document changes | C | Manual review and approval |
| Decision record changes | C | Manual review and approval |
| Governance policy changes | C | Manual review and approval |
| Breaking changes | Special | Migration guide required |

## Upgrade Process

### Step 1: Plan

```bash
./scripts/plan_upgrade.sh /path/to/project
```

This generates an upgrade plan showing:
- Missing files
- Outdated files
- Protected files
- Risk assessment

### Step 2: Review

Review the generated upgrade plan at:
```
/path/to/project/.foundation/upgrade-plan.md
```

Key questions:
- Are there protected files affected?
- Are there local customizations that might be overwritten?
- Is this a breaking change?

### Step 3: Apply

```bash
# Safe upgrade (skips protected files)
./scripts/upgrade_foundation.sh /path/to/project

# Force upgrade (use with caution)
./scripts/upgrade_foundation.sh --force /path/to/project

# Dry run (preview changes)
./scripts/upgrade_foundation.sh --dry-run /path/to/project
```

### Step 4: Validate

```bash
./scripts/validate_project_setup.sh /path/to/project
```

### Step 5: Test

Run the project's test suite to verify everything works.

### Step 6: Commit

```bash
git add .
git commit -m "chore: upgrade amazing-team-foundation to v2.0.0"
```

## Protected Paths

The following paths are protected and will never be automatically modified:

- `docs/architecture/` - Project architecture documentation
- `docs/decisions/` - Architecture decision records (ADRs)
- Any files listed in `.foundation/local-overrides.md`

## Local Overrides

Projects can specify local customizations that should be preserved:

```markdown
# .foundation/local-overrides.md

## Custom AGENTS.md Additions
- Added custom build commands section
- Added project-specific naming conventions

## Custom Workflows
- Modified ci.yml to add integration tests
- Added custom deployment workflow

## Custom Skills
- Added project-specific skill: database-migration
```

## Breaking Changes

When a new version contains breaking changes:

1. The CHANGELOG.md will have a "Breaking Changes" section
2. A migration guide will be provided
3. The upgrade script will require `--force` flag
4. Manual review is mandatory

### Breaking Change Examples

- Agent interface changes (new required fields)
- Command signature changes
- Memory structure reorganization
- Required configuration changes

## Rollback

If an upgrade causes issues:

1. Restore from backup:
   ```bash
   cp -r .foundation/backup-TIMESTAMP/.amazing-team ./
   ```

2. Revert the commit:
   ```bash
   git revert HEAD
   ```

3. Report the issue for investigation

## Version Support

| Version | Status | Support Ends |
|---------|--------|--------------|
| 2.x | Current | - |
| 1.x | Maintenance | 2024-12-31 |

## Upgrade Frequency

Recommended upgrade frequency:

- **Critical security fixes**: Immediately
- **Bug fixes**: Within 1 week
- **Minor features**: Within 1 month
- **Major versions**: After thorough review

## Questions?

For questions about upgrades:
1. Check CHANGELOG.md for details
2. Review the upgrade plan
3. Create an issue with `[UPGRADE]` label