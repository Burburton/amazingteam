#!/bin/bash
# generate_docs.sh
# Generate documentation for the foundation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FOUNDATION_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

VERSION=$(cat "$FOUNDATION_ROOT/VERSION" 2>/dev/null || echo "unknown")
OUTPUT_DIR="$FOUNDATION_ROOT/docs/generated"

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Team Foundation Documentation Generator${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""

mkdir -p "$OUTPUT_DIR"

# Generate role inventory
echo -e "${CYAN}Generating role inventory...${NC}"
cat > "$OUTPUT_DIR/role-inventory.md" << EOF
# Role Inventory

Generated: $(date -I)
Foundation Version: $VERSION

## Core Roles

| Role | File | Description |
|------|------|-------------|
| Planner | .amazing-team/agents/planner.md | Task decomposition and workflow orchestration |
| Architect | .amazing-team/agents/architect.md | Design technical approach and impact boundaries |
| Developer | .amazing-team/agents/developer.md | Implement approved changes |
| QA | .amazing-team/agents/qa.md | Validate functionality and regression safety |
| Reviewer | .amazing-team/agents/reviewer.md | Assess correctness and maintainability |
| Triage | .amazing-team/agents/triage.md | Classify work and perform first-pass debug |
| CI Analyst | .amazing-team/agents/ci-analyst.md | Investigate CI failure patterns |

## Memory Areas

| Role | Memory Directory | Purpose |
|------|------------------|---------|
| Planner | .amazing-team/memory/planner/ | Task decomposition patterns |
| Architect | .amazing-team/memory/architect/ | Architecture decisions |
| Developer | .amazing-team/memory/developer/ | Implementation patterns |
| QA | .amazing-team/memory/qa/ | Test strategy and cases |
| Reviewer | .amazing-team/memory/reviewer/ | Quality rules and risks |
| Triage | .amazing-team/memory/triage/ | Classification heuristics |
| CI Analyst | .amazing-team/memory/ci-analyst/ | Failure patterns |
| Failures | .amazing-team/memory/failures/ | Shared failure library |
EOF
echo -e "${GREEN}  Created: role-inventory.md${NC}"

# Generate skill inventory
echo -e "${CYAN}Generating skill inventory...${NC}"
cat > "$OUTPUT_DIR/skill-inventory.md" << EOF
# Skill Inventory

Generated: $(date -I)
Foundation Version: $VERSION

## Understanding Skills

| Skill | Directory | Purpose |
|-------|-----------|---------|
| repo-architecture-reader | .amazing-team/skills/repo-architecture-reader/ | Quickly understand repository structure |

## Execution Skills

| Skill | Directory | Purpose |
|-------|-----------|---------|
| task-breakdown-and-dispatch | .amazing-team/skills/task-breakdown-and-dispatch/ | Decompose tasks into subtasks |
| bugfix-playbook | .amazing-team/skills/bugfix-playbook/ | Systematic bug fixing |
| test-first-feature-dev | .amazing-team/skills/test-first-feature-dev/ | TDD approach for features |
| safe-refactor-checklist | .amazing-team/skills/safe-refactor-checklist/ | Safe refactoring checklist |

## Validation Skills

| Skill | Directory | Purpose |
|-------|-----------|---------|
| issue-triage | .amazing-team/skills/issue-triage/ | Issue classification |
| ci-failure-analysis | .amazing-team/skills/ci-failure-analysis/ | CI failure investigation |
| regression-checklist | .amazing-team/skills/regression-checklist/ | Regression testing |
| release-readiness-check | .amazing-team/skills/release-readiness-check/ | Pre-release validation |
EOF
echo -e "${GREEN}  Created: skill-inventory.md${NC}"

# Generate command inventory
echo -e "${CYAN}Generating command inventory...${NC}"
cat > "$OUTPUT_DIR/command-inventory.md" << EOF
# Command Inventory

Generated: $(date -I)
Foundation Version: $VERSION

## Available Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| /triage | Triage | Classify and investigate issue |
| /design | Architect | Analyze requirements and design |
| /implement | Developer | Implement changes |
| /test | QA | Run tests and validate |
| /review | Reviewer | Review code |
| /ci-analyze | CI Analyst | Analyze CI failures |
| /release-check | Reviewer | Validate release readiness |

## Usage

In a GitHub Issue or PR comment:

\`\`\`
/opencode use <agent> to <action>
\`\`\`

Examples:
\`\`\`
/opencode use architect to design this feature
/opencode use developer to implement the solution
/opencode use qa to validate the changes
\`\`\`
EOF
echo -e "${GREEN}  Created: command-inventory.md${NC}"

# Generate structure overview
echo -e "${CYAN}Generating structure overview...${NC}"
cat > "$OUTPUT_DIR/structure-overview.md" << EOF
# Foundation Structure Overview

Generated: $(date -I)
Foundation Version: $VERSION

## Directory Structure

\`\`\`
amazing-team-foundation/
├── .amazing-team/                 # AI Team core configuration
│   ├── agents/               # Agent definitions (7 roles)
│   ├── skills/               # Skill definitions (9 skills)
│   ├── commands/             # Command definitions (7 commands)
│   ├── memory/               # Memory templates (8 areas)
│   └── opencode.template.jsonc
│
├── .github/                  # GitHub configuration
│   ├── workflows/            # GitHub Actions workflows
│   └── ISSUE_TEMPLATE/       # Issue templates
│
├── docs/                     # Documentation
│   ├── architecture/         # Architecture documents
│   ├── decisions/            # Decision records (ADRs)
│   ├── patterns/             # Implementation patterns
│   ├── releases/             # Release documentation
│   └── runbooks/ci/          # CI operational runbooks
│
├── scripts/                  # Bootstrap scripts
│   ├── init_project.sh
│   ├── validate_foundation.sh
│   ├── validate_project_setup.sh
│   ├── plan_upgrade.sh
│   ├── upgrade_foundation.sh
│   ├── diff_foundation_vs_project.sh
│   └── generate_docs.sh
│
├── overlays/                 # Technology overlays
│
├── tasks/                    # Task templates
│   └── _template/
│
├── VERSION                   # Current version
├── CHANGELOG.md              # Version history
├── AGENTS.md                 # Global rules
└── README.md                 # Project overview
\`\`\`

## File Classification

| Class | Description | Upgrade Behavior |
|-------|-------------|------------------|
| A | Auto-generatable | Safe to create/replace automatically |
| B | Review required | Generate diff, human reviews before applying |
| C | Protected | Human approval mandatory, never auto-modified |

## Key Files

- **VERSION**: Current foundation version
- **CHANGELOG.md**: Version history and migration notes
- **AGENTS.md**: Global rules for all AI agents
- **opencode.template.jsonc**: Template for project configuration
EOF
echo -e "${GREEN}  Created: structure-overview.md${NC}"

echo ""
echo -e "${GREEN}Documentation generated in: $OUTPUT_DIR/${NC}"
echo ""