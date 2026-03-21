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
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

mkdir -p "$LOG_DIR" "$REPORT_DIR"

LOG_FILE="$LOG_DIR/test-${TEST_ID}.log"
REPORT_FILE="$REPORT_DIR/test-${TEST_ID}.json"

echo "=== $TEST_NAME Test ===" > "$LOG_FILE"
echo "Start: $(date)" >> "$LOG_FILE"

log_info "Starting test: $TEST_NAME"

ERRORS=()
WARNINGS=()
TESTS_PASSED=0
TESTS_TOTAL=0

# ============================================
# Phase 1: Agent Definition Validation
# ============================================
log_step "Phase 1: Validating Agent Definitions"

cd "$E2E_DIR/../.."
PROJECT_ROOT=$(pwd)

EXPECTED_AGENTS=("planner" "architect" "developer" "qa" "reviewer" "triage" "ci-analyst")
MISSING_AGENTS=()
INVALID_AGENTS=()

for agent in "${EXPECTED_AGENTS[@]}"; do
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    AGENT_FILE=".opencode/agents/${agent}.md"
    
    if [ -f "$AGENT_FILE" ]; then
        # Check if the file has valid YAML frontmatter
        if grep -q "^---" "$AGENT_FILE" 2>/dev/null; then
            log_info "✓ Agent '$agent' - valid definition"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            log_warn "Agent '$agent' exists but missing YAML frontmatter"
            INVALID_AGENTS+=("$agent")
            WARNINGS+=("Agent '$agent' missing YAML frontmatter")
        fi
    else
        log_error "✗ Agent '$agent' - NOT FOUND"
        MISSING_AGENTS+=("$agent")
        ERRORS+=("Missing agent: $agent")
    fi
done

if [ ${#MISSING_AGENTS[@]} -gt 0 ]; then
    log_error "Missing agents: ${MISSING_AGENTS[*]}"
fi

# ============================================
# Phase 2: Agent Memory Structure Validation
# ============================================
log_step "Phase 2: Validating Agent Memory Structure"

MEMORY_BASE=".amazing-team/memory"
EXPECTED_MEMORY_DIRS=("planner" "architect" "developer" "qa" "reviewer" "triage" "ci-analyst" "failures")

for mem_dir in "${EXPECTED_MEMORY_DIRS[@]}"; do
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    FULL_PATH="$MEMORY_BASE/$mem_dir"
    
    if [ -d "$FULL_PATH" ]; then
        FILE_COUNT=$(find "$FULL_PATH" -name "*.md" -type f 2>/dev/null | wc -l)
        if [ "$FILE_COUNT" -gt 0 ]; then
            log_info "✓ Memory '$mem_dir' - $FILE_COUNT files"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            log_warn "Memory '$mem_dir' exists but empty"
            WARNINGS+=("Memory '$mem_dir' is empty")
        fi
    else
        log_warn "Memory directory '$mem_dir' not found (may be created on first use)"
        WARNINGS+=("Memory '$mem_dir' not found")
    fi
done

# ============================================
# Phase 3: API Connection Test (if API Key available)
# ============================================
log_step "Phase 3: API Connection Test"

API_TEST_RESULT="skip"
API_TEST_REASON=""

if [ -n "$AMAZINGTEAM_API_KEY" ]; then
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    log_info "API Key found, testing connection..."
    
    # Try to call the API directly
    # Using Alibaba Cloud Bailian API endpoint
    API_URL="https://coding.dashscope.aliyuncs.com/apps/anthropic/v1/messages"
    
    TEST_PROMPT="Respond with exactly: 'E2E_TEST_OK'"
    
    API_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "x-api-key: $AMAZINGTEAM_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -d "{
            \"model\": \"qwen3.5-plus\",
            \"max_tokens\": 50,
            \"messages\": [{\"role\": \"user\", \"content\": \"$TEST_PROMPT\"}]
        }" 2>> "$LOG_FILE" || echo -e "\n000")
    
    HTTP_CODE=$(echo "$API_RESPONSE" | tail -1)
    RESPONSE_BODY=$(echo "$API_RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        log_info "✓ API connection successful (HTTP $HTTP_CODE)"
        API_TEST_RESULT="pass"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        log_error "✗ API connection failed (HTTP $HTTP_CODE)"
        API_TEST_RESULT="fail"
        API_TEST_REASON="HTTP $HTTP_CODE"
        ERRORS+=("API connection failed: HTTP $HTTP_CODE")
        echo "API Response: $RESPONSE_BODY" >> "$LOG_FILE"
    fi
else
    log_warn "AMAZINGTEAM_API_KEY not set, skipping API test"
    API_TEST_REASON="AMAZINGTEAM_API_KEY not set"
fi

# ============================================
# Phase 4: OpenCode CLI Test (optional)
# ============================================
log_step "Phase 4: OpenCode CLI Integration Test"

CLI_TEST_RESULT="skip"
CLI_TEST_REASON=""

# Check if opencode CLI is available
if command -v opencode &> /dev/null; then
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    log_info "OpenCode CLI found, testing..."
    
    # Check if opencode has valid provider configuration
    PROVIDER_COUNT=$(opencode models 2>/dev/null | grep -c "bailian-coding-plan\|openai\|anthropic" || echo "0")
    if [ "$PROVIDER_COUNT" -gt 0 ]; then
        log_info "✓ OpenCode CLI has valid provider configuration"
        CLI_TEST_RESULT="pass"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        log_warn "OpenCode CLI has no valid provider configured"
        CLI_TEST_RESULT="skip"
        CLI_TEST_REASON="No provider configured"
        WARNINGS+=("OpenCode CLI: no provider configured")
    fi
else
    log_warn "OpenCode CLI not found in PATH"
    CLI_TEST_REASON="OpenCode CLI not installed"
fi

# ============================================
# Summary
# ============================================
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "" >> "$LOG_FILE"
echo "=== Summary ===" >> "$LOG_FILE"
echo "Tests: $TESTS_PASSED/$TESTS_TOTAL passed" >> "$LOG_FILE"
echo "Errors: ${#ERRORS[@]}" >> "$LOG_FILE"
echo "Warnings: ${#WARNINGS[@]}" >> "$LOG_FILE"
echo "Duration: ${DURATION}s" >> "$LOG_FILE"

# Build JSON report
if [ ${#ERRORS[@]} -eq 0 ]; then
    STATUS="pass"
    log_info "✅ $TEST_NAME PASSED (${DURATION}s)"
    log_info "   Tests: $TESTS_PASSED/$TESTS_TOTAL passed"
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        log_warn "   Warnings: ${#WARNINGS[@]}"
    fi
else
    STATUS="fail"
    log_error "❌ $TEST_NAME FAILED (${DURATION}s)"
    log_error "   Errors: ${#ERRORS[@]}"
fi

# Create JSON report
cat > "$REPORT_FILE" << EOF
{
  "test_id": "$TEST_ID",
  "test_name": "$TEST_NAME",
  "status": "$STATUS",
  "duration_seconds": $DURATION,
  "tests_passed": $TESTS_PASSED,
  "tests_total": $TESTS_TOTAL,
  "errors": ${#ERRORS[@]},
  "warnings": ${#WARNINGS[@]},
  "phases": {
    "agent_definitions": {
      "expected": ${#EXPECTED_AGENTS[@]},
      "found": $((${#EXPECTED_AGENTS[@]} - ${#MISSING_AGENTS[@]})),
      "missing": ${#MISSING_AGENTS[@]}
    },
    "api_connection": {
      "status": "$API_TEST_RESULT",
      "reason": "$API_TEST_REASON"
    },
    "cli_integration": {
      "status": "$CLI_TEST_RESULT",
      "reason": "$CLI_TEST_REASON"
    }
  }
}
EOF

if [ "$STATUS" = "pass" ]; then
    exit 0
else
    exit 1
fi