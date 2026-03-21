#!/bin/bash
# AmazingTeam E2E Test: NPM Installation
# Tests that npm install amazingteam succeeds

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"
TEMP_DIR=""

# Test info
TEST_NAME="NPM Install"
TEST_ID="install"
START_TIME=$(date +%s)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Cleanup function
cleanup() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        log_info "Cleaning up temp directory: $TEMP_DIR"
        rm -rf "$TEMP_DIR"
    fi
}

# Register cleanup
trap cleanup EXIT

# Ensure directories exist
mkdir -p "$LOG_DIR" "$REPORT_DIR"

# Log file
LOG_FILE="$LOG_DIR/test-${TEST_ID}.log"
REPORT_FILE="$REPORT_DIR/test-${TEST_ID}.json"

# Initialize log
echo "=== $TEST_NAME Test ===" > "$LOG_FILE"
echo "Start: $(date)" >> "$LOG_FILE"
echo "Test ID: $TEST_ID" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

log_info "Starting test: $TEST_NAME"

# Get package version from parent directory
PACKAGE_VERSION=$(cat "$(dirname "$E2E_DIR")/VERSION" 2>/dev/null || echo "latest")
log_info "Testing version: $PACKAGE_VERSION"

# Create temp directory
TEMP_DIR=$(mktemp -d)
log_info "Created temp directory: $TEMP_DIR"

# Step 1: Initialize npm project
log_info "Step 1: Initializing npm project..."
cd "$TEMP_DIR"

{
    echo "--- Step 1: npm init ---"
    npm init -y
} >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
    log_error "Failed to initialize npm project"
    echo "ERROR: npm init failed" >> "$LOG_FILE"
    exit 1
fi
log_info "✓ npm project initialized"

# Step 2: Install amazingteam
log_info "Step 2: Installing amazingteam..."
{
    echo ""
    echo "--- Step 2: npm install amazingteam ---"
    npm install amazingteam --save-dev
} >> "$LOG_FILE" 2>&1

INSTALL_EXIT_CODE=$?

if [ $INSTALL_EXIT_CODE -ne 0 ]; then
    log_error "npm install failed with exit code: $INSTALL_EXIT_CODE"
    echo "ERROR: npm install failed" >> "$LOG_FILE"
    
    # Generate failure report
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "fail",
  "duration_seconds": $DURATION,
  "error": "npm install failed with exit code $INSTALL_EXIT_CODE",
  "timestamp": "$(date -Iseconds)"
}
EOF
    exit 1
fi
log_info "✓ npm install completed"

# Step 3: Verify installation
log_info "Step 3: Verifying installation..."
ERRORS=()

# Check node_modules exists
if [ ! -d "node_modules/amazingteam" ]; then
    ERRORS+=("node_modules/amazingteam directory not found")
    log_error "Package directory not found"
fi

# Check package.json entry
if ! grep -q "amazingteam" package.json; then
    ERRORS+=("amazingteam not found in package.json")
    log_error "Package not in package.json"
fi

# Check essential files
ESSENTIAL_FILES=(
    "node_modules/amazingteam/package.json"
    "node_modules/amazingteam/VERSION"
    "node_modules/amazingteam/AGENTS.md"
    "node_modules/amazingteam/cli/amazingteam.cjs"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        ERRORS+=("Missing file: $file")
        log_error "Missing: $file"
    else
        log_info "✓ Found: $file"
    fi
done

# Record verification results
{
    echo ""
    echo "--- Step 3: Verification ---"
    echo "Errors found: ${#ERRORS[@]}"
    for err in "${ERRORS[@]}"; do
        echo "  - $err"
    done
} >> "$LOG_FILE"

# Determine test result
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${#ERRORS[@]} -eq 0 ]; then
    log_info "✅ $TEST_NAME PASSED (${DURATION}s)"
    
    cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "pass",
  "duration_seconds": $DURATION,
  "version": "$PACKAGE_VERSION",
  "files_verified": ${#ESSENTIAL_FILES[@]},
  "timestamp": "$(date -Iseconds)"
}
EOF
    
    echo "" >> "$LOG_FILE"
    echo "=== TEST PASSED ===" >> "$LOG_FILE"
    exit 0
else
    log_error "❌ $TEST_NAME FAILED (${DURATION}s)"
    log_error "Errors: ${#ERRORS[@]}"
    
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