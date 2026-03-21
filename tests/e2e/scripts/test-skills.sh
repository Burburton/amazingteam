#!/bin/bash
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

cd "$E2E_DIR/../.."
PROJECT_ROOT=$(pwd)
log_info "Project root: $PROJECT_ROOT"

SKILLS_DIR="$PROJECT_ROOT/.opencode/skills"
ERRORS=()
LOADED_COUNT=0

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
    SKILL_PATH="$SKILLS_DIR/$skill"
    
    if [ -d "$SKILL_PATH" ]; then
        SKILL_FILE="$SKILL_PATH/SKILL.md"
        
        if [ -f "$SKILL_FILE" ]; then
            if head -10 "$SKILL_FILE" | grep -q "^name:"; then
                log_info "✓ $skill - valid SKILL.md"
                LOADED_COUNT=$((LOADED_COUNT + 1))
            else
                ERRORS+=("$skill: SKILL.md missing 'name' field")
                log_error "$skill: invalid SKILL.md"
            fi
        else
            ERRORS+=("$skill: SKILL.md not found")
            log_error "$skill: SKILL.md missing"
        fi
    else
        ERRORS+=("$skill: directory not found")
        log_error "$skill: directory missing"
    fi
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s) - $LOADED_COUNT/${#EXPECTED_SKILLS[@]} skills"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"pass\",\"duration_seconds\":$DURATION,\"skills_expected\":${#EXPECTED_SKILLS[@]},\"skills_loaded\":$LOADED_COUNT}" > "$REPORT_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s) - $LOADED_COUNT/${#EXPECTED_SKILLS[@]} skills"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"fail\",\"duration_seconds\":$DURATION,\"skills_expected\":${#EXPECTED_SKILLS[@]},\"skills_loaded\":$LOADED_COUNT,\"errors\":${#ERRORS[@]}}" > "$REPORT_FILE"
    exit 1
fi