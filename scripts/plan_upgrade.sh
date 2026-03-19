#!/bin/bash
# plan_upgrade.sh
# Compare downstream project against foundation and generate upgrade plan

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FOUNDATION_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="${1:-.}"

# Resolve to absolute path
if [[ "${PROJECT_ROOT:0:1}" != "/" ]]; then
    PROJECT_ROOT="$(pwd)/$PROJECT_ROOT"
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# File classification
# Class A: Auto-generatable (safe to create/replace)
# Class B: Auto-suggested, not auto-committed (review required)
# Class C: Protected (human approval mandatory)

CLASS_A_FILES=(
    "tasks/_template/*"
    ".github/ISSUE_TEMPLATE/*"
    ".amazing-team/memory/*/*.md"
)

CLASS_B_FILES=(
    ".amazing-team/agents/*.md"
    ".amazing-team/skills/*/skill.md"
    ".amazing-team/commands/*.md"
    ".github/workflows/*.yml"
    "AGENTS.md"
)

CLASS_C_FILES=(
    "docs/architecture/*"
    "docs/decisions/*"
)

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Team Foundation Upgrade Planner${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""

# Read versions
FOUNDATION_VERSION=$(cat "$FOUNDATION_ROOT/VERSION" 2>/dev/null || echo "unknown")

LOCK_FILE="$PROJECT_ROOT/.foundation/foundation.lock"
if [[ -f "$LOCK_FILE" ]]; then
    PROJECT_VERSION=$(grep "foundation_version:" "$LOCK_FILE" | cut -d: -f2 | tr -d ' ')
    PROJECT_OVERLAY=$(grep "overlay:" "$LOCK_FILE" | cut -d: -f2 | tr -d ' ')
else
    PROJECT_VERSION="unknown"
    PROJECT_OVERLAY="none"
fi

echo -e "${CYAN}Foundation Version:${NC} $FOUNDATION_VERSION"
echo -e "${CYAN}Project Version:${NC}    $PROJECT_VERSION"
echo -e "${CYAN}Project Overlay:${NC}    $PROJECT_OVERLAY"
echo ""

# Track changes
MISSING_FILES=()
OUTDATED_FILES=()
PROTECTED_FILES=()
LOCAL_OVERRIDES=()

echo -e "${CYAN}[1] Checking for missing files...${NC}"
echo ""

# Check agents
for agent in planner architect developer qa reviewer triage ci-analyst; do
    if [[ ! -f "$PROJECT_ROOT/.amazing-team/agents/$agent.md" ]]; then
        MISSING_FILES+=(".amazing-team/agents/$agent.md (Class B)")
        echo -e "  ${YELLOW}Missing:${NC} .amazing-team/agents/$agent.md"
    fi
done

# Check skills
for skill_dir in "$FOUNDATION_ROOT/.amazing-team/skills"/*; do
    if [[ -d "$skill_dir" ]]; then
        skill=$(basename "$skill_dir")
        if [[ ! -f "$PROJECT_ROOT/.amazing-team/skills/$skill/skill.md" ]]; then
            MISSING_FILES+=(".amazing-team/skills/$skill/skill.md (Class B)")
            echo -e "  ${YELLOW}Missing:${NC} .amazing-team/skills/$skill/skill.md"
        fi
    fi
done

# Check commands
for cmd in triage design implement test review ci-analyze release-check; do
    if [[ ! -f "$PROJECT_ROOT/.amazing-team/commands/$cmd.md" ]]; then
        MISSING_FILES+=(".amazing-team/commands/$cmd.md (Class B)")
        echo -e "  ${YELLOW}Missing:${NC} .amazing-team/commands/$cmd.md"
    fi
done

# Check memory directories
for role in planner architect developer qa reviewer triage ci-analyst failures; do
    if [[ ! -d "$PROJECT_ROOT/.amazing-team/memory/$role" ]]; then
        MISSING_FILES+=(".amazing-team/memory/$role/ (Class A)")
        echo -e "  ${YELLOW}Missing:${NC} .amazing-team/memory/$role/"
    fi
done

# Check documentation zones
for zone in patterns releases runbooks/ci; do
    if [[ ! -d "$PROJECT_ROOT/docs/$zone" ]]; then
        MISSING_FILES+=("docs/$zone/ (Class A)")
        echo -e "  ${YELLOW}Missing:${NC} docs/$zone/"
    fi
done

echo ""
echo -e "${CYAN}[2] Checking for outdated files...${NC}"
echo ""

# Compare file contents (simplified - in real implementation, use proper diff)
check_outdated() {
    local foundation_file="$1"
    local project_file="$2"
    local file_class="$3"
    
    if [[ -f "$foundation_file" ]] && [[ -f "$project_file" ]]; then
        if ! diff -q "$foundation_file" "$project_file" > /dev/null 2>&1; then
            OUTDATED_FILES+=("$project_file ($file_class)")
            echo -e "  ${BLUE}Modified:${NC} $project_file"
        fi
    fi
}

# Check key files for modifications
for agent in planner architect developer qa reviewer triage ci-analyst; do
    check_outdated \
        "$FOUNDATION_ROOT/.amazing-team/agents/$agent.md" \
        "$PROJECT_ROOT/.amazing-team/agents/$agent.md" \
        "Class B"
done

echo ""
echo -e "${CYAN}[3] Checking protected files...${NC}"
echo ""

# Check protected areas
for protected in "docs/architecture" "docs/decisions"; do
    if [[ -d "$PROJECT_ROOT/$protected" ]]; then
        file_count=$(find "$PROJECT_ROOT/$protected" -type f 2>/dev/null | wc -l)
        if [[ $file_count -gt 0 ]]; then
            PROTECTED_FILES+=("$protected/ ($file_count files)")
            echo -e "  ${RED}Protected:${NC} $protected/ ($file_count files)"
        fi
    fi
done

echo ""
echo -e "${CYAN}[4] Checking local overrides...${NC}"
echo ""

OVERRIDES_FILE="$PROJECT_ROOT/.foundation/local-overrides.md"
if [[ -f "$OVERRIDES_FILE" ]]; then
    echo -e "  Local overrides documented at: .foundation/local-overrides.md"
    # In a real implementation, parse and display the overrides
else
    echo -e "  ${YELLOW}Warning:${NC} No local-overrides.md found"
fi

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Upgrade Plan Summary${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Missing Files:${NC} ${#MISSING_FILES[@]}"
for f in "${MISSING_FILES[@]:0:5}"; do
    echo -e "  - $f"
done
if [[ ${#MISSING_FILES[@]} -gt 5 ]]; then
    echo -e "  ... and $(( ${#MISSING_FILES[@]} - 5 )) more"
fi
echo ""

echo -e "${BLUE}Outdated Files:${NC} ${#OUTDATED_FILES[@]}"
for f in "${OUTDATED_FILES[@]:0:5}"; do
    echo -e "  - $f"
done
if [[ ${#OUTDATED_FILES[@]} -gt 5 ]]; then
    echo -e "  ... and $(( ${#OUTDATED_FILES[@]} - 5 )) more"
fi
echo ""

echo -e "${RED}Protected Files:${NC} ${#PROTECTED_FILES[@]}"
for f in "${PROTECTED_FILES[@]}"; do
    echo -e "  - $f"
done
echo ""

# Risk assessment
echo -e "${CYAN}Risk Assessment:${NC}"
if [[ ${#PROTECTED_FILES[@]} -gt 0 ]]; then
    echo -e "  ${RED}HIGH RISK${NC} - Protected files require manual review"
elif [[ ${#OUTDATED_FILES[@]} -gt 0 ]]; then
    echo -e "  ${YELLOW}MEDIUM RISK${NC} - Modified files need review before patching"
elif [[ ${#MISSING_FILES[@]} -gt 0 ]]; then
    echo -e "  ${GREEN}LOW RISK${NC} - Only additive changes needed"
else
    echo -e "  ${GREEN}NO CHANGES${NC} - Project is up to date"
fi
echo ""

# Generate upgrade report
REPORT_FILE="$PROJECT_ROOT/.foundation/upgrade-plan.md"
cat > "$REPORT_FILE" << EOF
# Upgrade Plan

Generated: $(date -I)
From: $PROJECT_VERSION
To: $FOUNDATION_VERSION

## Summary

- Missing Files: ${#MISSING_FILES[@]}
- Outdated Files: ${#OUTDATED_FILES[@]}
- Protected Files: ${#PROTECTED_FILES[@]}

## Missing Files

$(for f in "${MISSING_FILES[@]}"; do echo "- $f"; done)

## Outdated Files

$(for f in "${OUTDATED_FILES[@]}"; do echo "- $f"; done)

## Protected Files (Manual Review Required)

$(for f in "${PROTECTED_FILES[@]}"; do echo "- $f"; done)

## Recommendations

$(if [[ ${#PROTECTED_FILES[@]} -gt 0 ]]; then
    echo "1. Review all protected files before proceeding"
    echo "2. Document any customizations in local-overrides.md"
    echo "3. Run upgrade with --review flag"
elif [[ ${#OUTDATED_FILES[@]} -gt 0 ]]; then
    echo "1. Review outdated file diffs"
    echo "2. Decide which changes to keep"
    echo "3. Run upgrade with selective files"
else
    echo "1. Safe to run automatic upgrade"
    echo "2. No conflicts detected"
fi)

## Next Steps

1. Review this plan
2. Run: ./scripts/upgrade_foundation.sh
3. Verify changes after upgrade
EOF

echo -e "${GREEN}Upgrade plan saved to:${NC} $REPORT_FILE"
echo ""