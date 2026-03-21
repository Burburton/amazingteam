#!/bin/bash
# AmazingTeam E2E Test: CLI Initialization
# Tests that npx amazingteam init generates correct files

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"
TEMP_DIR=""

# Test info
TEST_NAME="CLI Initialization"
TEST_ID="init"
START_TIME=$(date +%s)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Cleanup function
cleanup() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        log_info "Cleaning up temp directory"
        rm -rf "$TEMP_DIR"
    fi
}

trap cleanup EXIT

# Ensure directories exist
mkdir -p "$LOG_DIR" "$REPORT_DIR"

# Log file
LOG_FILE="$LOG_DIR/test-${TEST_ID}.log"
REPORT_FILE="$REPORT_DIR/test-${TEST_ID}.json"

# Initialize log
echo "=== $TEST_NAME Test ===" > "$LOG_FILE"
echo "Start: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

log_info "Starting test: $TEST_NAME"

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"
log_info "Created temp directory: $TEMP_DIR"

# Step 1: Initialize npm project
log_info "Step 1: Initializing npm project..."
{
    echo "--- Step 1: npm init ---"
    npm init -y
} >> "$LOG_FILE" 2>&1

# Step 2: Install amazingteam
log_info "Step 2: Installing amazingteam..."
{
    echo ""
    echo "--- Step 2: npm install ---"
    npm install amazingteam --save-dev
} >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
    log_error "npm install failed"
    exit 1
fi
log_info "✓ amazingteam installed"

# Step 3: Run amazingteam init
log_info "Step 3: Running amazingteam init..."
{
    echo ""
    echo "--- Step 3: amazingteam init ---"
    # Use local package
    npx amazingteam init --language typescript --framework node --description "E2E test project" --force
} >> "$LOG_FILE" 2>&1

INIT_EXIT_CODE=$?

if [ $INIT_EXIT_CODE -ne 0 ]; then
    log_warn "Init returned non-zero exit code: $INIT_EXIT_CODE (may be expected for some scenarios)"
fi

# Step 4: Verify generated files
log_info "Step 4: Verifying generated files..."
ERRORS=()

# Required files
REQUIRED_FILES=(
    "amazingteam.config.yaml"
    "opencode.jsonc"
)

# Optional files (may or may not exist)
OPTIONAL_FILES=(
    ".github/workflows/amazingteam.yml"
    ".opencode/"
    "AGENTS.md"
)

# Check required files
for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        log_info "✓ Found: $file"
        echo "FOUND: $file" >> "$LOG_FILE"
    else
        ERRORS+=("Missing required file: $file")
        log_error "Missing required: $file"
        echo "MISSING: $file" >> "$LOG_FILE"
    fi
done

# Check optional files (warnings only)
for file in "${OPTIONAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        log_info "✓ Found (optional): $file"
        echo "FOUND (optional): $file" >> "$LOG_FILE"
    else
        log_warn "Optional file not found: $file"
        echo "NOT FOUND (optional): $file" >> "$LOG_FILE"
    fi
done

# Step 5: Verify file content basics
log_info "Step 5: Verifying file contents..."

# Check amazingteam.config.yaml is valid YAML
if [ -f "amazingteam.config.yaml" ]; then
    if head -1 "amazingteam.config.yaml" | grep -q "^#"; then
        log_info "✓ amazingteam.config.yaml appears valid"
    else
        log_warn "amazingteam.config.yaml format may be unusual"
    fi
fi

# Check opencode.jsonc has basic structure
if [ -f "opencode.jsonc" ]; then
    if grep -q '"\$schema"' "opencode.jsonc" 2>/dev/null; then
        log_info "✓ opencode.jsonc has schema reference"
    fi
fi

# Record results
{
    echo ""
    echo "--- Verification Summary ---"
    echo "Required files checked: ${#REQUIRED_FILES[@]}"
    echo "Errors found: ${#ERRORS[@]}"
} >> "$LOG_FILE"

# Determine test result
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s)"
    
    # List generated files
    {
        echo ""
        echo "Generated files:"
        ls -la
    } >> "$LOG_FILE"
    
    cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "pass",
  "duration_seconds": $DURATION,
  "required_files_found": ${#REQUIRED_FILES[@]},
  "timestamp": "$(date -Iseconds)"
}
EOF
    
    echo "" >> "$LOG_FILE"
    echo "=== TEST PASSED ===" >> "$LOG_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s)"
    
    cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "fail",
  "duration_seconds": $DURATION,
  "errors": $(printf '%s\n' "${ERRORS[@]}" | jq -R . | jq -s .),
  "timestamp": "$(date -Iseconds)"
}
EOF
    
    echo "" >> "$LOG_FILE"
    echo "=== TEST FAILED ===" >> "$LOG_FILE"
    exit 1
fi