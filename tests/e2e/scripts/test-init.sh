#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"
TEMP_DIR=""

TEST_NAME="CLI Initialization"
TEST_ID="init"
START_TIME=$(date +%s)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cleanup() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}

trap cleanup EXIT

mkdir -p "$LOG_DIR" "$REPORT_DIR"

LOG_FILE="$LOG_DIR/test-${TEST_ID}.log"
REPORT_FILE="$REPORT_DIR/test-${TEST_ID}.json"

echo "=== $TEST_NAME Test ===" > "$LOG_FILE"
echo "Start: $(date)" >> "$LOG_FILE"

log_info "Starting test: $TEST_NAME"

TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"
log_info "Created temp directory: $TEMP_DIR"

log_info "Step 1: Initializing npm project..."
npm init -y >> "$LOG_FILE" 2>&1

log_info "Step 2: Installing amazingteam..."
npm install amazingteam --save-dev >> "$LOG_FILE" 2>&1
log_info "✓ amazingteam installed"

log_info "Step 3: Running amazingteam init..."
npx amazingteam init \
  --language typescript \
  --framework node \
  --description "E2E test project" \
  --overlay "" \
  --commitMode pr \
  --requireReview y \
  --githubAction "Burburton/amazingteam-action@v1" \
  --force >> "$LOG_FILE" 2>&1 || true

log_info "Step 4: Verifying generated files..."
ERRORS=()

ls -la >> "$LOG_FILE" 2>&1

if [ -f "amazingteam.config.yaml" ]; then
    log_info "✓ Found amazingteam.config.yaml"
else
    ERRORS+=("Missing amazingteam.config.yaml")
    log_error "Missing amazingteam.config.yaml"
fi

if [ -f "opencode.jsonc" ]; then
    log_info "✓ Found opencode.jsonc"
else
    ERRORS+=("Missing opencode.jsonc")
    log_error "Missing opencode.jsonc"
fi

if [ -d ".opencode" ]; then
    log_info "✓ Found .opencode/"
else
    log_warn ".opencode/ not found (optional)"
fi

if [ -f "AGENTS.md" ]; then
    log_info "✓ Found AGENTS.md"
else
    log_warn "AGENTS.md not found (optional)"
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s)"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"pass\",\"duration_seconds\":$DURATION}" > "$REPORT_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s)"
    echo "{\"test_id\":\"$TEST_ID\",\"test_name\":\"$TEST_NAME\",\"status\":\"fail\",\"duration_seconds\":$DURATION,\"errors\":${#ERRORS[@]}}" > "$REPORT_FILE"
    exit 1
fi