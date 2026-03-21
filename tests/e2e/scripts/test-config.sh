#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"

TEST_NAME="Config Validation"
TEST_ID="config"
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

ERRORS=()
WARNINGS=()

if [ -f "amazing-team.config.yaml" ]; then
    log_info "✓ Found amazing-team.config.yaml"
else
    ERRORS+=("Missing amazing-team.config.yaml")
    log_error "Missing amazing-team.config.yaml"
fi

if [ -f "opencode.jsonc" ]; then
    log_info "✓ Found opencode.jsonc"
else
    ERRORS+=("Missing opencode.jsonc")
    log_error "Missing opencode.jsonc"
fi

if [ -f "AGENTS.md" ]; then
    log_info "✓ Found AGENTS.md"
else
    log_warn "AGENTS.md not found (optional)"
    WARNINGS+=("AGENTS.md not found")
fi

if [ -d ".opencode" ]; then
    log_info "✓ Found .opencode directory"
else
    log_warn ".opencode directory not found"
    WARNINGS+=(".opencode directory not found")
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s)"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"pass\",\"duration_seconds\":$DURATION,\"warnings\":${#WARNINGS[@]}}" > "$REPORT_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s)"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"fail\",\"duration_seconds\":$DURATION,\"errors\":${#ERRORS[@]}}" > "$REPORT_FILE"
    exit 1
fi