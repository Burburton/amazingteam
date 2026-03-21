#!/bin/bash
# AmazingTeam E2E Test: Skills Loading
# Tests that all 13 skills load successfully

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"

TEST_NAME="Skills Loading"
TEST_ID="skills"
START_TIME=$(date +%s)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

mkdir -p "$LOG_DIR" "$REPORT_DIR"

LOG_FILE="$LOG_DIR/test-${TEST_ID}.log"
REPORT_FILE="$REPORT_DIR/test-${TEST_ID}.json"

echo "=== $TEST_NAME Test ===" > "$LOG_FILE"
echo "Start: $(date)" >> "$LOG_FILE"

log_info "Starting test: $TEST_NAME"

PROJECT_ROOT="$(dirname "$(dirname "$(dirname "$E2E_DIR")")")"
cd "$PROJECT_ROOT"

SKILLS_DIR=".opencode/skills"
ERRORS=()
LOADED_COUNT=0
TOTAL_COUNT=0

EXPECTED_SKILLS=(
    "requirements-discussion"
    "task-breakdown-and-dispatch"
    "repo-architecture-reader"
    "test-first-feature-dev"
    "bugfix-playbook"
    "issue-triage"
    "ci-failure-analysis"
    "regression-checklist"
    "release-readiness-check"
    "safe-refactor-checklist"
    "github-integration"
    "release-automation"
    "documentation-sync"
)

log_info "Checking ${#EXPECTED_SKILLS[@]} expected skills..."

for skill in "${EXPECTED_SKILLS[@]}"; do
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    SKILL_PATH="$SKILLS_DIR/$skill"
    
    if [ -d "$SKILL_PATH" ]; then
        SKILL_FILE="$SKILL_PATH/SKILL.md"
        
        if [ -f "$SKILL_FILE" ]; then
            if head -10 "$SKILL_FILE" | grep -q "^name:"; then
                log_info "✓ $skill - valid SKILL.md"
                LOADED_COUNT=$((LOADED_COUNT + 1))
                echo "LOADED: $skill" >> "$LOG_FILE"
            else
                ERRORS+=("$skill: SKILL.md missing 'name' field")
                log_error "$skill: invalid SKILL.md"
                echo "INVALID: $skill (no name field)" >> "$LOG_FILE"
            fi
        else
            ERRORS+=("$skill: SKILL.md not found")
            log_error "$skill: SKILL.md missing"
            echo "MISSING: $skill/SKILL.md" >> "$LOG_FILE"
        fi
    else
        ERRORS+=("$skill: directory not found")
        log_error "$skill: directory missing"
        echo "MISSING: $skill directory" >> "$LOG_FILE"
    fi
done

ADDITIONAL_SKILLS=$(find "$SKILLS_DIR" -maxdepth 1 -type d ! -path "$SKILLS_DIR" -exec basename {} \; 2>/dev/null | sort)

for skill in $ADDITIONAL_SKILLS; do
    if [[ ! " ${EXPECTED_SKILLS[@]} " =~ " ${skill} " ]]; then
        log_info "Found additional skill: $skill"
        echo "ADDITIONAL: $skill" >> "$LOG_FILE"
    fi
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

{
    echo ""
    echo "=== Summary ==="
    echo "Expected skills: ${#EXPECTED_SKILES[@]}"
    echo "Loaded: $LOADED_COUNT"
    echo "Errors: ${#ERRORS[@]}"
} >> "$LOG_FILE"

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s) - $LOADED_COUNT/$TOTAL_COUNT skills"
    
    cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "pass",
  "duration_seconds": $DURATION,
  "skills_expected": ${#EXPECTED_SKILLS[@]},
  "skills_loaded": $LOADED_COUNT,
  "timestamp": "$(date -Iseconds)"
}
EOF
    
    echo "=== TEST PASSED ===" >> "$LOG_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s) - $LOADED_COUNT/$TOTAL_COUNT skills"
    
    cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "fail",
  "duration_seconds": $DURATION,
  "skills_expected": ${#EXPECTED_SKILLS[@]},
  "skills_loaded": $LOADED_COUNT,
  "errors": $(printf '%s\n' "${ERRORS[@]}" | jq -R . | jq -s .),
  "timestamp": "$(date -Iseconds)"
}
EOF
    
    echo "=== TEST FAILED ===" >> "$LOG_FILE"
    exit 1
fi