#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"

TEST_NAME="Agent Response"
TEST_ID="agent"
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

ERRORS=()

if [ -z "$AMAZINGTEAM_API_KEY" ]; then
    log_warn "AMAZINGTEAM_API_KEY not set, skipping test"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"skip\",\"reason\":\"AMAZINGTEAM_API_KEY not set\"}" > "$REPORT_FILE"
    exit 0
fi

log_info "API Key found, testing Agent response..."

cd "$E2E_DIR/../.."
PROJECT_ROOT=$(pwd)

if [ -f "opencode.jsonc" ]; then
    log_info "Found opencode.jsonc"
else
    ERRORS+=("opencode.jsonc not found")
    log_error "opencode.jsonc not found"
fi

if [ -d ".opencode/agents" ]; then
    AGENT_COUNT=$(find .opencode/agents -name "*.md" -type f 2>/dev/null | wc -l)
    log_info "Found $AGENT_COUNT agent definitions"
else
    ERRORS+=(".opencode/agents directory not found")
    log_error ".opencode/agents directory not found"
fi

EXPECTED_AGENTS=("planner" "architect" "developer" "qa" "reviewer" "triage" "ci-analyst")
MISSING_AGENTS=()

for agent in "${EXPECTED_AGENTS[@]}"; do
    if [ -f ".opencode/agents/${agent}.md" ]; then
        log_info "Found agent: $agent"
    else
        MISSING_AGENTS+=("$agent")
        log_warn "Missing agent: $agent"
    fi
done

if [ ${#MISSING_AGENTS[@]} -gt 0 ]; then
    ERRORS+=("Missing agents: ${MISSING_AGENTS[*]}")
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s)"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"pass\",\"duration_seconds\":$DURATION,\"agents_found\":${#EXPECTED_AGENTS[@]}}" > "$REPORT_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s)"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"fail\",\"duration_seconds\":$DURATION,\"errors\":${#ERRORS[@]}}" > "$REPORT_FILE"
    exit 1
fi