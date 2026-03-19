#!/bin/bash
# validate_foundation.sh
# Validate the foundation repository integrity

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FOUNDATION_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

check_dir() {
    if [[ -d "$1" ]]; then
        check_pass "$2"
    else
        check_fail "$2"
    fi
}

check_file() {
    if [[ -f "$1" ]]; then
        check_pass "$2"
    else
        check_fail "$2"
    fi
}

check_file_optional() {
    if [[ -f "$1" ]]; then
        check_pass "$2"
    else
        check_warn "$2 (optional)"
    fi
}

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Team Foundation Validation${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""

# Read version
VERSION=$(cat "$FOUNDATION_ROOT/VERSION" 2>/dev/null || echo "unknown")
echo -e "${CYAN}Foundation Version:${NC} $VERSION"
echo ""

# 1. Core Structure
echo -e "${CYAN}[1] Core Structure${NC}"
check_dir "$FOUNDATION_ROOT/.amazing-team" "Core .amazing-team directory"
check_dir "$FOUNDATION_ROOT/.github" "GitHub configuration"
check_dir "$FOUNDATION_ROOT/docs" "Documentation directory"
check_dir "$FOUNDATION_ROOT/tasks" "Tasks directory"
check_dir "$FOUNDATION_ROOT/scripts" "Scripts directory"
echo ""

# 2. Agents
echo -e "${CYAN}[2] AI Agents${NC}"
for agent in planner architect developer qa reviewer triage ci-analyst; do
    check_file "$FOUNDATION_ROOT/.amazing-team/agents/$agent.md" "Agent: $agent"
done
echo ""

# 3. Skills
echo -e "${CYAN}[3] Skills${NC}"
check_dir "$FOUNDATION_ROOT/.amazing-team/skills" "Skills directory"
for skill in repo-architecture-reader bugfix-playbook test-first-feature-dev safe-refactor-checklist task-breakdown-and-dispatch issue-triage ci-failure-analysis regression-checklist release-readiness-check; do
    check_file "$FOUNDATION_ROOT/.amazing-team/skills/$skill/skill.md" "Skill: $skill"
done
echo ""

# 4. Commands
echo -e "${CYAN}[4] Commands${NC}"
for cmd in triage design implement test review ci-analyze release-check; do
    check_file "$FOUNDATION_ROOT/.amazing-team/commands/$cmd.md" "Command: $cmd"
done
echo ""

# 5. Memory Structure
echo -e "${CYAN}[5] Memory Structure${NC}"
for role in planner architect developer qa reviewer triage ci-analyst failures; do
    check_dir "$FOUNDATION_ROOT/.amazing-team/memory/$role" "Memory: $role"
done
echo ""

# 6. Documentation Zones
echo -e "${CYAN}[6] Documentation Zones${NC}"
check_dir "$FOUNDATION_ROOT/docs/architecture" "Architecture docs"
check_dir "$FOUNDATION_ROOT/docs/decisions" "Decision records"
check_dir "$FOUNDATION_ROOT/docs/patterns" "Patterns library"
check_dir "$FOUNDATION_ROOT/docs/releases" "Release docs"
check_dir "$FOUNDATION_ROOT/docs/runbooks" "Runbooks"
check_dir "$FOUNDATION_ROOT/docs/runbooks/ci" "CI runbooks"
echo ""

# 7. GitHub Workflows
echo -e "${CYAN}[7] GitHub Workflows${NC}"
check_file "$FOUNDATION_ROOT/.github/workflows/opencode.yml" "OpenCode workflow"
check_file "$FOUNDATION_ROOT/.github/workflows/ci.yml" "CI workflow"
check_file "$FOUNDATION_ROOT/.github/workflows/pr-check.yml" "PR check workflow"
echo ""

# 8. Issue Templates
echo -e "${CYAN}[8] Issue Templates${NC}"
for template in feature_request.md bug_report.md tech_task.md; do
    check_file "$FOUNDATION_ROOT/.github/ISSUE_TEMPLATE/$template" "Template: $template"
done
check_file "$FOUNDATION_ROOT/.github/pull_request_template.md" "PR template"
echo ""

# 9. Task Templates
echo -e "${CYAN}[9] Task Templates${NC}"
check_dir "$FOUNDATION_ROOT/tasks/_template" "Task template directory"
check_file "$FOUNDATION_ROOT/tasks/_template/task.yaml" "Task manifest template"
for file in analysis.md design.md implementation.md validation.md review.md release.md; do
    check_file "$FOUNDATION_ROOT/tasks/_template/$file" "Template: $file"
done
echo ""

# 10. Version & Metadata
echo -e "${CYAN}[10] Version & Metadata${NC}"
check_file "$FOUNDATION_ROOT/VERSION" "VERSION file"
check_file "$FOUNDATION_ROOT/CHANGELOG.md" "CHANGELOG"
check_file "$FOUNDATION_ROOT/AGENTS.md" "AGENTS.md (global rules)"
check_file "$FOUNDATION_ROOT/.amazing-team/opencode.template.jsonc" "OpenCode template config"
check_file "$FOUNDATION_ROOT/README.md" "README"
echo ""

# 11. Bootstrap Scripts
echo -e "${CYAN}[11] Bootstrap Scripts${NC}"
check_file "$FOUNDATION_ROOT/scripts/init_project.sh" "init_project.sh"
check_file "$FOUNDATION_ROOT/scripts/validate_foundation.sh" "validate_foundation.sh"
check_file "$FOUNDATION_ROOT/scripts/validate_project_setup.sh" "validate_project_setup.sh"
check_file "$FOUNDATION_ROOT/scripts/plan_upgrade.sh" "plan_upgrade.sh"
check_file "$FOUNDATION_ROOT/scripts/upgrade_foundation.sh" "upgrade_foundation.sh"
check_file "$FOUNDATION_ROOT/scripts/diff_foundation_vs_project.sh" "diff_foundation_vs_project.sh"
check_file "$FOUNDATION_ROOT/scripts/generate_docs.sh" "generate_docs.sh"
echo ""

# 12. Overlays
echo -e "${CYAN}[12] Overlays${NC}"
if [[ -d "$FOUNDATION_ROOT/overlays" ]]; then
    for overlay in "$FOUNDATION_ROOT/overlays"/*; do
        if [[ -d "$overlay" ]]; then
            name=$(basename "$overlay")
            check_dir "$overlay" "Overlay: $name"
        fi
    done
else
    check_warn "No overlays directory"
fi
echo ""

# Summary
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Validation Summary${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASS"
echo -e "  ${RED}Failed:${NC}   $FAIL"
echo -e "  ${YELLOW}Warnings:${NC} $WARN"
echo ""

if [[ $FAIL -eq 0 ]]; then
    echo -e "${GREEN}✓ Foundation validation passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Foundation validation failed with $FAIL errors${NC}"
    exit 1
fi