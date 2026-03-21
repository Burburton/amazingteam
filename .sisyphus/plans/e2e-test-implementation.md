# Implementation Plan: E2E Testing System

**Created**: 2026-03-21
**Based on**: `.opencode/requirements/e2e-test.md`
**Status**: Ready for Implementation

---

## Overview

实现 AmazingTeam 的端到端测试系统，包含测试框架、CI 集成和自动修复流程。

---

## Phase 1: Basic Test Framework (Priority: HIGH)

### 1.1 Create Directory Structure

**Scope**: Create `tests/e2e/` directory structure
**Owner**: Developer
**Dependencies**: None
**Estimated Time**: 15 min

**Tasks**:
```bash
mkdir -p tests/e2e/{fixtures,scripts,local,ci,logs,reports}
mkdir -p tests/e2e/fixtures/{minimal-project,full-project}
mkdir -p tests/e2e/local/{reports,tmp}
```

**Deliverables**:
- `tests/e2e/` directory structure
- `tests/e2e/README.md` - 测试说明文档
- `tests/e2e/package.json` - 测试依赖

**Acceptance Criteria**:
- [ ] Directory structure matches design
- [ ] README.md documents test system
- [ ] package.json includes test dependencies

---

### 1.2 Implement Install Test

**Scope**: `tests/e2e/scripts/test-install.sh`
**Owner**: Developer
**Dependencies**: 1.1
**Estimated Time**: 30 min

**Tasks**:
- Create test script that runs `npm install amazingteam`
- Verify package installs without errors
- Check installed files exist
- Generate test report

**Script Template**:
```bash
#!/bin/bash
set -e

TEST_NAME="NPM Install"
LOG_FILE="tests/e2e/logs/test-install.log"

echo "Testing: $TEST_NAME" | tee "$LOG_FILE"
echo "Start: $(date)" | tee -a "$LOG_FILE"

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Test: npm install
echo "Running: npm install amazingteam" | tee -a "$LOG_FILE"
if npm install amazingteam >> "$LOG_FILE" 2>&1; then
    echo "✅ Install successful" | tee -a "$LOG_FILE"
else
    echo "❌ Install failed" | tee -a "$LOG_FILE"
    exit 1
fi

# Verify: check node_modules
if [ -d "node_modules/amazingteam" ]; then
    echo "✅ Package directory exists" | tee -a "$LOG_FILE"
else
    echo "❌ Package directory missing" | tee -a "$LOG_FILE"
    exit 1
fi

# Cleanup
cd -
rm -rf "$TEMP_DIR"

echo "End: $(date)" | tee -a "$LOG_FILE"
echo "✅ $TEST_NAME PASSED"
```

**Acceptance Criteria**:
- [ ] Script executes successfully
- [ ] Detects install failures
- [ ] Generates log file
- [ ] Returns proper exit code

---

### 1.3 Implement Init Test

**Scope**: `tests/e2e/scripts/test-init.sh`
**Owner**: Developer
**Dependencies**: 1.1
**Estimated Time**: 30 min

**Tasks**:
- Create test project directory
- Run `npx amazingteam init`
- Verify all expected files are generated
- Check file content validity

**Expected Generated Files**:
```
amazingteam.config.yaml
opencode.jsonc
.github/workflows/amazingteam.yml
.opencode/
AGENTS.md (optional)
```

**Acceptance Criteria**:
- [ ] Script executes successfully
- [ ] Verifies all required files generated
- [ ] Detects missing files
- [ ] Generates log file

---

### 1.4 Implement Config Validation Test

**Scope**: `tests/e2e/scripts/test-config.sh`
**Owner**: Developer
**Dependencies**: 1.3
**Estimated Time**: 20 min

**Tasks**:
- Validate generated config files
- Check YAML syntax
- Verify required fields exist
- Validate against JSON schema

**Acceptance Criteria**:
- [ ] Validates YAML syntax
- [ ] Checks required fields
- [ ] Reports validation errors clearly
- [ ] Generates log file

---

### 1.5 Create Local Test Runner

**Scope**: `tests/e2e/local/run-all.sh`
**Owner**: Developer
**Dependencies**: 1.2, 1.3, 1.4
**Estimated Time**: 20 min

**Tasks**:
- Create master script to run all tests
- Generate combined report
- Support selective test execution

**Acceptance Criteria**:
- [ ] Runs all basic tests
- [ ] Generates combined report
- [ ] Supports `--scope` option
- [ ] Returns correct exit code

---

## Phase 2: Skills & Agent Tests (Priority: HIGH)

### 2.1 Implement Skills Loading Test

**Scope**: `tests/e2e/scripts/test-skills.sh`
**Owner**: Developer
**Dependencies**: Phase 1
**Estimated Time**: 30 min

**Tasks**:
- Test loading all 13 skills
- Verify skill metadata
- Check skill files exist

**Skills to Test**:
```
requirements-discussion
task-breakdown-and-dispatch
repo-architecture-reader
test-first-feature-dev
bugfix-playbook
issue-triage
ci-failure-analysis
regression-checklist
release-readiness-check
safe-refactor-checklist
github-integration
release-automation
documentation-sync
```

**Acceptance Criteria**:
- [ ] All 13 skills load successfully
- [ ] Each skill has valid SKILL.md
- [ ] Missing skills are reported

---

### 2.2 Implement Agent Response Test

**Scope**: `tests/e2e/scripts/test-agent.sh`
**Owner**: Developer
**Dependencies**: Phase 1
**Estimated Time**: 45 min
**Requires API**: Yes

**Tasks**:
- Test basic Agent response
- Use simple prompt
- Verify response received
- Handle timeout gracefully

**Acceptance Criteria**:
- [ ] Agent responds to simple prompt
- [ ] Timeout is handled gracefully
- [ ] API errors are reported clearly
- [ ] Generates log file

---

## Phase 3: CI Integration (Priority: HIGH)

### 3.1 Create E2E Workflow File

**Scope**: `.github/workflows/e2e-test.yml`
**Owner**: Developer
**Dependencies**: Phase 1, Phase 2
**Estimated Time**: 45 min

**Tasks**:
- Create GitHub Actions workflow
- Configure triggers (PR, push, manual, schedule)
- Set up job dependencies
- Configure secrets

**Workflow Features**:
- PR trigger: basic tests only
- Push to main: basic tests only
- Manual trigger: configurable scope
- Schedule: full tests daily

**Acceptance Criteria**:
- [ ] Workflow triggers correctly
- [ ] Basic tests run on PR
- [ ] Full tests run on schedule
- [ ] Secrets are properly used

---

### 3.2 Implement PR Comment Action

**Scope**: Add PR comment step to workflow
**Owner**: Developer
**Dependencies**: 3.1
**Estimated Time**: 30 min

**Tasks**:
- Generate test report
- Post as PR comment
- Handle comment updates

**Acceptance Criteria**:
- [ ] Comment posted on PR
- [ ] Report shows test results
- [ ] Comment updates on re-run

---

### 3.3 Implement Issue Creation on Failure

**Scope**: Add Issue creation step
**Owner**: Developer
**Dependencies**: 3.1
**Estimated Time**: 30 min

**Tasks**:
- Create Issue on test failure
- Add appropriate labels
- Include diagnostic info

**Acceptance Criteria**:
- [ ] Issue created on failure
- [ ] Correct labels applied
- [ ] Contains diagnostic info

---

### 3.4 Configure GitHub Secrets

**Scope**: Repository settings
**Owner**: Maintainer (User)
**Dependencies**: None
**Estimated Time**: 5 min

**Secrets Required**:
- `AMAZINGTEAM_API_KEY` - For Agent tests

---

## Phase 4: Auto-Fix Integration (Priority: MEDIUM)

### 4.1 Create Issue Labeling Logic

**Scope**: Add auto-labeling to workflow
**Owner**: Developer
**Dependencies**: 3.3
**Estimated Time**: 30 min

**Tasks**:
- Define simple vs complex issue rules
- Implement label assignment logic
- Test label accuracy

**Acceptance Criteria**:
- [ ] Issues get correct labels
- [ ] `auto-fix` for simple issues
- [ ] `needs-triage` for complex issues

---

### 4.2 Create Report Generation Script

**Scope**: `tests/e2e/scripts/generate-report.sh`
**Owner**: Developer
**Dependencies**: Phase 1
**Estimated Time**: 45 min

**Tasks**:
- Generate Markdown report
- Generate JSON report
- Generate JUnit XML report
- Upload as artifacts

**Acceptance Criteria**:
- [ ] All report formats generated
- [ ] Reports uploaded as artifacts
- [ ] Reports downloadable

---

### 4.3 Update .gitignore

**Scope**: Root `.gitignore`
**Owner**: Developer
**Dependencies**: None
**Estimated Time**: 5 min

**Tasks**:
- Add test temporary files
- Add local reports (optional)

**Additions**:
```
# E2E Test temporary files
tests/e2e/local/tmp/
tests/e2e/logs/*.log
```

---

## Execution Order

```
Phase 1.1 (Create directories)
    │
    ├── Phase 1.2 (Install test) ──┐
    ├── Phase 1.3 (Init test)   ──┼── Phase 1.5 (Local runner)
    └── Phase 1.4 (Config test) ──┘
                    │
                    ▼
    Phase 2.1 (Skills test) ──┐
    Phase 2.2 (Agent test)  ──┼── Phase 3.1 (E2E workflow)
                              │
                              ├── Phase 3.2 (PR comment)
                              ├── Phase 3.3 (Issue creation)
                              └── Phase 4.1 (Auto-labeling)
                                        │
                                        ▼
                               Phase 4.2 (Report generation)
```

---

## Parallelization Opportunities

| Can Run in Parallel |
|---------------------|
| 1.2 + 1.3 + 1.4 (after 1.1) |
| 2.1 + 2.2 (after Phase 1) |
| 3.2 + 3.3 + 4.1 (after 3.1) |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API Key not configured | High | Medium | Document in README |
| Test flakiness | Medium | High | Add retry logic |
| CI minutes exceeded | Low | Low | Schedule during off-peak |
| False positive auto-fix | Medium | High | Require human review |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Basic test execution time | < 30s |
| Full test execution time | < 10min |
| Test pass rate | > 95% |
| Issue auto-label accuracy | > 90% |

---

## Definition of Done

- [ ] All Phase 1 tasks complete
- [ ] All Phase 2 tasks complete
- [ ] CI workflow runs successfully
- [ ] PR comments work
- [ ] Issue creation works
- [ ] Documentation complete
- [ ] Code reviewed and merged