# Superpowers Configuration

This project uses superpowers for systematic development workflow.

## Activated Skills

Superpowers automatically activates these skills based on context:

### Process Skills (Auto-triggered)
- `brainstorming` - Triggered when starting new features
- `writing-plans` - Triggered after design approval
- `test-driven-development` - Triggered during implementation
- `systematic-debugging` - Triggered when encountering bugs

### Workflow Skills
- `subagent-driven-development` - Used for parallel task execution
- `requesting-code-review` - Used between development phases
- `receiving-code-review` - Used when processing feedback
- `using-git-worktrees` - Used for isolated feature branches
- `finishing-a-development-branch` - Used when completing work
- `verification-before-completion` - Used before claiming completion

## Project-Specific Skills

Located in `.opencode/skills/`:

| Skill | Purpose | Used By |
|-------|---------|---------|
| requirements-discussion | Capture user requirements | All agents |
| task-breakdown-and-dispatch | Decompose tasks | Planner |
| repo-architecture-reader | Understand codebase | Architect |
| test-first-feature-dev | TDD implementation | Developer, QA |
| bugfix-playbook | Systematic bug fixing | Developer, Triage, CI Analyst |
| issue-triage | Classify issues | Triage |
| ci-failure-analysis | Analyze CI failures | CI Analyst |
| regression-checklist | Prevent regressions | QA, Reviewer |
| release-readiness-check | Validate releases | Reviewer |
| safe-refactor-checklist | Safe refactoring | Reviewer |
| **github-integration** | GitHub API operations | All agents |
| **release-automation** | Version release workflow | Reviewer, Planner |
| **documentation-sync** | Keep docs synchronized | Developer, Reviewer |

## Usage

Skills are automatically loaded when needed. To manually invoke:

```
Use skill tool to load requirements-discussion
```

Or mention the skill by name in conversation.

## Integration with AmazingTeam

Superpowers skills work alongside AmazingTeam's 7-agent workflow:

1. **User Request** → `requirements-discussion` captures needs
2. **Planning** → `brainstorming` + `writing-plans` create implementation plan
3. **Development** → `test-driven-development` enforces RED-GREEN-REFACTOR
4. **Debugging** → `systematic-debugging` for complex issues
5. **Review** → `requesting-code-review` before completion

See AGENTS.md for full workflow documentation.
