#!/bin/bash
# validate_project_setup.sh
# Validate a downstream project's AI Team setup

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${1:-.}"

# Resolve to absolute path
if [[ "${PROJECT_ROOT:0:1}" != "/" ]]; then
    PROJECT_ROOT="$(pwd)/$PROJECT_ROOT"
fi

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
    if [[ -d "$PROJECT_ROOT/$1" ]]; then
        check_pass "$2"
    else
        check_fail "$2"
    fi
}

check_file() {
    if [[ -f "$PROJECT_ROOT/$1" ]]; then
        check_pass "$2"
    else
        check_fail "$2"
    fi
}

check_file_optional() {
    if [[ -f "$PROJECT_ROOT/$1" ]]; then
        check_pass "$2"
    else
        check_warn "$2 (optional)"
    fi
}

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Team Project Setup Validation${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Project Path:${NC} $PROJECT_ROOT"
echo ""

# Check if foundation lock exists
LOCK_FILE="$PROJECT_ROOT/.foundation/foundation.lock"
if [[ -f "$LOCK_FILE" ]]; then
    echo -e "${CYAN}Foundation Lock:${NC}"
    cat "$LOCK_FILE" | head -5
    echo ""
fi

# 1. Foundation Metadata
echo -e "${CYAN}[1] Foundation Metadata${NC}"
check_file ".foundation/foundation.lock" "Foundation lock file"
check_file ".foundation/upgrade-history.md" "Upgrade history"
check_file ".foundation/local-overrides.md" "Local overrides doc"
echo ""

# 2. Core Structure
echo -e "${CYAN}[2] Core Structure${NC}"
check_dir ".amazing-team" ".amazing-team directory"
check_dir ".github" ".github directory"
check_dir "docs" "docs directory"
check_dir "tasks" "tasks directory"
echo ""

# 3. Agent Files
echo -e "${CYAN}[3] Agent Files${NC}"
for agent in planner architect developer qa reviewer triage ci-analyst; do
    check_file ".amazing-team/agents/$agent.md" "Agent: $agent"
done
echo ""

# 4. Memory Directories
echo -e "${CYAN}[4] Memory Directories${NC}"
for role in planner architect developer qa reviewer triage ci-analyst failures; do
    check_dir ".amazing-team/memory/$role" "Memory: $role"
done
echo ""

# 5. GitHub Configuration
echo -e "${CYAN}[5] GitHub Configuration${NC}"
check_dir ".github/workflows" "Workflows directory"
check_file ".github/workflows/opencode.yml" "OpenCode workflow"
check_file ".github/workflows/ci.yml" "CI workflow"
check_dir ".github/ISSUE_TEMPLATE" "Issue templates directory"
echo ""

# 6. Documentation
echo -e "${CYAN}[6] Documentation${NC}"
check_file "AGENTS.md" "AGENTS.md (global rules)"
check_file "README.md" "README"
check_dir "docs/architecture" "Architecture docs"
check_dir "docs/decisions" "Decision records"
echo ""

# 7. Task Templates
echo -e "${CYAN}[7] Task Templates${NC}"
check_dir "tasks/_template" "Task template directory"
check_file "tasks/_template/task.yaml" "Task manifest template"
echo ""

# 8. Project Configuration
echo -e "${CYAN}[8] Project Configuration${NC}"
check_file "amazing-team.config.yaml" "Project configuration"
check_file "opencode.jsonc" "OpenCode runtime config"
echo ""

# 9. Source Structure
echo -e "${CYAN}[9] Source Structure${NC}"
check_dir "src" "Source directory"
check_dir "tests" "Tests directory"
echo ""

# 10. Protected Paths Check
echo -e "${CYAN}[10] Protected Paths${NC}"
if [[ -d "$PROJECT_ROOT/docs/architecture" ]]; then
    file_count=$(find "$PROJECT_ROOT/docs/architecture" -type f 2>/dev/null | wc -l)
    echo -e "  Architecture docs: $file_count files"
fi
if [[ -d "$PROJECT_ROOT/docs/decisions" ]]; then
    file_count=$(find "$PROJECT_ROOT/docs/decisions" -type f 2>/dev/null | wc -l)
    echo -e "  Decision records: $file_count files"
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
    echo -e "${GREEN}✓ Project setup validation passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Project setup validation failed with $FAIL errors${NC}"
    exit 1
fi