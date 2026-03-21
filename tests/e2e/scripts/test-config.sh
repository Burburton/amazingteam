#!/bin/bash
# AmazingTeam E2E Test: Configuration Validation
# Validates generated configuration files

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$E2E_DIR/logs"
REPORT_DIR="$E2E_DIR/reports"

# Test info
TEST_NAME="Config Validation"
TEST_ID="config"
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

# Get project root
PROJECT_ROOT="$(dirname "$(dirname "$(dirname "$E2E_DIR")")")"
cd "$PROJECT_ROOT"

log_info "Project root: $PROJECT_ROOT"

# Errors array
ERRORS=()
WARNINGS=()

# ============================================
# Test 1: Validate amazingteam.config.yaml
# ============================================
log_info "Test 1: Validating amazingteam.config.yaml..."

CONFIG_FILE="amazingteam.config.yaml"

if [ -f "$CONFIG_FILE" ]; then
    log_info "✓ Found $CONFIG_FILE"
    
    # Check YAML syntax using node (cross-platform)
    if command -v node &> /dev/null; then
        VALIDATE_YAML=$(node -e "
            const fs = require('fs');
            try {
                // Simple YAML validation - check for basic syntax issues
                const content = fs.readFileSync('$CONFIG_FILE', 'utf8');
                
                // Check for common YAML issues
                const lines = content.split('\n');
                let errors = [];
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const lineNum = i + 1;
                    
                    // Check for tabs (YAML should use spaces)
                    if (line.includes('\t')) {
                        errors.push('Line ' + lineNum + ': Contains tabs (use spaces)');
                    }
                    
                    // Check for trailing spaces before colon
                    if (line.match(/\\s+:/)) {
                        errors.push('Line ' + lineNum + ': Space before colon');
                    }
                }
                
                if (errors.length > 0) {
                    console.log('WARN:' + errors.join('|'));
                    process.exit(0);
                }
                
                console.log('OK');
            } catch (e) {
                console.log('ERROR:' + e.message);
                process.exit(1);
            }
        " 2>&1)
        
        if [[ "$VALIDATE_YAML" == "OK" ]]; then
            log_info "✓ YAML syntax valid"
        elif [[ "$VALIDATE_YAML" == WARN:* ]]; then
            log_warn "YAML has minor issues: ${VALIDATE_YAML#WARN:}"
            WARNINGS+=("YAML issues: ${VALIDATE_YAML#WARN:}")
        else
            log_error "YAML syntax error: ${VALIDATE_YAML#ERROR:}"
            ERRORS+=("YAML syntax error: ${VALIDATE_YAML#ERROR:}")
        fi
    else
        log_warn "Node not available, skipping YAML syntax check"
    fi
    
    # Check required fields
    REQUIRED_FIELDS=("version" "project")
    
    for field in "${REQUIRED_FIELDS[@]}"; do
        if grep -q "^${field}:" "$CONFIG_FILE"; then
            log_info "✓ Has field: $field"
        else
            ERRORS+=("Missing required field: $field")
            log_error "Missing field: $field"
        fi
    done
    
    # Check project name if project field exists
    if grep -q "^project:" "$CONFIG_FILE"; then
        if grep -A5 "^project:" "$CONFIG_FILE" | grep -q "name:"; then
            log_info "✓ Has project.name"
        else
            log_warn "Missing project.name"
            WARNINGS+=("Missing project.name")
        fi
    fi
    
else
    ERRORS+=("Config file not found: $CONFIG_FILE")
    log_error "Missing $CONFIG_FILE"
fi

# ============================================
# Test 2: Validate opencode.jsonc
# ============================================
log_info "Test 2: Validating opencode.jsonc..."

OPENCODE_FILE="opencode.jsonc"

if [ -f "$OPENCODE_FILE" ]; then
    log_info "✓ Found $OPENCODE_FILE"
    
    # Check JSONC syntax using node
    if command -v node &> /dev/null; then
        VALIDATE_JSON=$(node -e "
            const fs = require('fs');
            try {
                const content = fs.readFileSync('$OPENCODE_FILE', 'utf8');
                
                // Strip comments (simple approach for JSONC)
                let json = content
                    .replace(/\\/\\/[^\n]*/g, '')  // Remove single-line comments
                    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');  // Remove multi-line comments
                
                JSON.parse(json);
                console.log('OK');
            } catch (e) {
                console.log('ERROR:' + e.message);
            }
        " 2>&1)
        
        if [[ "$VALIDATE_JSON" == "OK" ]]; then
            log_info "✓ JSONC syntax valid"
        else
            log_error "JSONC syntax error: ${VALIDATE_JSON#ERROR:}"
            ERRORS+=("JSONC syntax error: ${VALIDATE_JSON#ERROR:}")
        fi
    fi
    
    # Check required fields
    if grep -q '"model"' "$OPENCODE_FILE" 2>/dev/null; then
        log_info "✓ Has model field"
    else
        log_warn "Missing model field (using default)"
        WARNINGS+=("Missing model field")
    fi
    
    # Check schema reference
    if grep -q '"\$schema"' "$OPENCODE_FILE" 2>/dev/null; then
        log_info "✓ Has \$schema reference"
    else
        log_warn "Missing \$schema reference"
        WARNINGS+=("Missing \$schema")
    fi
    
else
    ERRORS+=("OpenCode config not found: $OPENCODE_FILE")
    log_error "Missing $OPENCODE_FILE"
fi

# ============================================
# Test 3: Validate AGENTS.md
# ============================================
log_info "Test 3: Validating AGENTS.md..."

AGENTS_FILE="AGENTS.md"

if [ -f "$AGENTS_FILE" ]; then
    log_info "✓ Found $AGENTS_FILE"
    
    # Check it's not empty
    if [ -s "$AGENTS_FILE" ]; then
        log_info "✓ AGENTS.md is not empty"
        
        # Check for basic structure
        if grep -q "^#" "$AGENTS_FILE"; then
            log_info "✓ Has markdown headers"
        fi
    else
        log_warn "AGENTS.md is empty"
        WARNINGS+=("AGENTS.md is empty")
    fi
else
    log_warn "AGENTS.md not found (optional)"
    WARNINGS+=("AGENTS.md not found")
fi

# ============================================
# Test 4: Validate .opencode directory
# ============================================
log_info "Test 4: Validating .opencode directory..."

OPENCODE_DIR=".opencode"

if [ -d "$OPENCODE_DIR" ]; then
    log_info "✓ Found $OPENCODE_DIR"
    
    # Check for expected subdirectories
    EXPECTED_DIRS=("agents" "skills" "commands")
    
    for dir in "${EXPECTED_DIRS[@]}"; do
        if [ -d "$OPENCODE_DIR/$dir" ]; then
            COUNT=$(find "$OPENCODE_DIR/$dir" -type f 2>/dev/null | wc -l)
            log_info "✓ Found $OPENCODE_DIR/$dir ($COUNT files)"
        else
            log_warn "Missing $OPENCODE_DIR/$dir"
            WARNINGS+=("Missing .opencode/$dir")
        fi
    done
else
    log_warn ".opencode directory not found"
    WARNINGS+=(".opencode directory not found")
fi

# ============================================
# Generate Report
# ============================================
{
    echo ""
    echo "=== Validation Summary ==="
    echo "Errors: ${#ERRORS[@]}"
    echo "Warnings: ${#WARNINGS[@]}"
    
    if [ ${#ERRORS[@]} -gt 0 ]; then
        echo ""
        echo "Errors:"
        for err in "${ERRORS[@]}"; do
            echo "  - $err"
        done
    fi
    
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        echo ""
        echo "Warnings:"
        for warn in "${WARNINGS[@]}"; do
            echo "  - $warn"
        done
    fi
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
  "warnings": ${#WARNINGS[@]},
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
  "warnings": $(printf '%s\n' "${WARNINGS[@]}" | jq -R . | jq -s .),
  "timestamp": "$(date -Iseconds)"
}
EOF
    
    echo "" >> "$LOG_FILE"
    echo "=== TEST FAILED ===" >> "$LOG_FILE"
    exit 1
fi