# Local Overrides

This file documents project-specific customizations that should be preserved during foundation upgrades.

## Purpose

When upgrading from a new foundation version, the upgrade script will read this file to understand which local customizations should not be overwritten.

## Customization Categories

### AGENTS.md Additions

Document any custom sections added to `AGENTS.md`:

- [ ] Custom build/test commands
- [ ] Project-specific naming conventions
- [ ] Custom safety constraints
- [ ] Additional governance rules

```
Example:
- Added section "Build Commands" with custom npm scripts
- Added section "Database Migrations" with migration workflow
```

### Workflow Customizations

Document any changes to `.github/workflows/`:

- [ ] Modified CI workflow
- [ ] Added custom deployment workflow
- [ ] Custom environment setup

```
Example:
- ci.yml: Added integration test stage
- Added deploy.yml for custom deployment
```

### Agent Prompt Modifications

Document any changes to `.amazing-team/agents/`:

- [ ] Modified agent behavior
- [ ] Added project-specific instructions
- [ ] Custom memory access rules

```
Example:
- developer.md: Added custom code style preferences
- architect.md: Added project-specific design constraints
```

### Custom Skills or Commands

Document any custom skills or commands added:

- [ ] Custom skills in `.amazing-team/skills/`
- [ ] Custom commands in `.amazing-team/commands/`

```
Example:
- Added skill: database-migration
- Added command: /deploy
```

### Memory Customizations

Document any custom memory rules or files:

- [ ] Custom memory structure
- [ ] Additional memory files
- [ ] Custom isolation rules

```
Example:
- Added .amazing-team/memory/project-specific/
```

---

## Upgrade Behavior

When upgrading:

1. Files listed here will be flagged for review
2. The upgrade script will generate diffs for these files
3. You will be prompted to confirm changes
4. Protected customizations will not be auto-overwritten

---

## Notes

- Update this file whenever you make local customizations
- Be specific about what was changed and why
- This file is preserved during all upgrades