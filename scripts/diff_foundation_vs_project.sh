#!/bin/bash
# diff_foundation_vs_project.sh
# Compare foundation and project files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FOUNDATION_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="${1:-.}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

usage() {
    echo "Usage: $0 [project-path] [file-pattern]"
    echo ""
    echo "Compare foundation and project files."
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 ./my-project"
    echo "  $0 ./my-project .amazing-team/agents/planner.md"
}

# Resolve to absolute path
if [[ "${PROJECT_ROOT:0:1}" != "/" ]]; then
    PROJECT_ROOT="$(pwd)/$PROJECT_ROOT"
fi

FILE_PATTERN="${2:-}"

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Foundation vs Project Diff${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}Foundation:${NC} $FOUNDATION_ROOT"
echo -e "${CYAN}Project:${NC}    $PROJECT_ROOT"
echo ""

# Classify a file
classify_file() {
    local file="$1"
    
    # Class C (Protected)
    if [[ "$file" == docs/architecture/* ]] || [[ "$file" == docs/decisions/* ]]; then
        echo -e "${RED}[Class C - Protected]${NC}"
        return
    fi
    
    # Class B (Review required)
    if [[ "$file" == .amazing-team/agents/* ]] || \
       [[ "$file" == .amazing-team/skills/* ]] || \
       [[ "$file" == .amazing-team/commands/* ]] || \
       [[ "$file" == .github/workflows/* ]] || \
       [[ "$file" == AGENTS.md ]]; then
        echo -e "${YELLOW}[Class B - Review Required]${NC}"
        return
    fi
    
    # Class A (Auto-generatable)
    echo -e "${GREEN}[Class A - Auto-generatable]${NC}"
}

# Compare a single file
compare_file() {
    local relative_path="$1"
    local foundation_file="$FOUNDATION_ROOT/$relative_path"
    local project_file="$PROJECT_ROOT/$relative_path"
    
    echo -e "${CYAN}────────────────────────────────────────────────${NC}"
    echo -e "File: $relative_path"
    classify_file "$relative_path"
    echo ""
    
    if [[ ! -f "$foundation_file" ]]; then
        echo -e "${YELLOW}Not in foundation (project-specific)${NC}"
        return
    fi
    
    if [[ ! -f "$project_file" ]]; then
        echo -e "${YELLOW}Not in project (missing)${NC}"
        return
    fi
    
    if diff -q "$foundation_file" "$project_file" > /dev/null 2>&1; then
        echo -e "${GREEN}Identical${NC}"
    else
        echo -e "${YELLOW}Different:${NC}"
        echo ""
        diff -u "$foundation_file" "$project_file" | head -50
        echo ""
    fi
}

# Compare all files or specific file
if [[ -n "$FILE_PATTERN" ]]; then
    compare_file "$FILE_PATTERN"
else
    # Compare key files
    FILES_TO_COMPARE=(
        "AGENTS.md"
        ".amazing-team/agents/planner.md"
        ".amazing-team/agents/architect.md"
        ".amazing-team/agents/developer.md"
        ".amazing-team/agents/qa.md"
        ".amazing-team/agents/reviewer.md"
        ".amazing-team/agents/triage.md"
        ".amazing-team/agents/ci-analyst.md"
        ".github/workflows/opencode.yml"
        ".github/workflows/ci.yml"
    )
    
    for file in "${FILES_TO_COMPARE[@]}"; do
        compare_file "$file"
    done
fi

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Classification Legend${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}[Class A]${NC} Auto-generatable - Safe to create/replace"
echo -e "  ${YELLOW}[Class B]${NC} Review required - Generate diff, human reviews"
echo -e "  ${RED}[Class C]${NC} Protected - Human approval mandatory"
echo ""