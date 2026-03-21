# Requirements: AmazingTeam E2E Testing System

**Date**: 2026-03-21
**Status**: Approved

---

## 1. Overview

### Problem Statement

AmazingTeam 是一个复杂的 AI 开发团队底座项目，包含多个组件：
- NPM 包安装
- CLI 初始化命令
- GitHub Actions 工作流
- 7 个 Agent 角色
- 13 个技能（Skills）
- 双仓库发布流程

目前缺乏系统化的端到端测试，无法验证：
1. 用户安装后是否能正常运行
2. 各组件集成后是否正常工作
3. GitHub Actions 工作流是否正确执行
4. 真实环境下的完整 Issue→PR 流程

### Target Users

- **开发者**：验证代码变更不会破坏现有功能
- **维护者**：发布前验证质量
- **用户**：确保下载的包能正常使用

### Success Metrics

- 所有测试通过率 ≥ 95%
- CI 测试执行时间 ≤ 15 分钟
- 能发现并报告具体的失败原因

---

## 2. Functional Requirements

### Must Have (P0)

- [ ] **NPM 安装测试**：验证 `npm install amazingteam` 成功
- [ ] **CLI 初始化测试**：验证 `npx amazingteam init` 正确生成配置文件
- [ ] **配置文件验证**：验证生成的文件结构和内容正确
- [ ] **Skills 加载测试**：验证 13 个技能能正常加载
- [ ] **GitHub Actions 工作流测试**：验证 `.github/workflows/opencode.yml` 能正常运行
- [ ] **端到端流程测试**：Issue 创建 → AI 处理 → PR 创建 完整流程

### Should Have (P1)

- [ ] **Agent 角色测试**：验证 7 个 Agent 能正常响应
- [ ] **本地测试脚本**：提供一键本地测试入口
- [ ] **测试报告生成**：自动生成测试结果报告（详见下方"测试报告规范"）

### Nice to Have (P2)

- [ ] **性能基准测试**：记录各步骤执行时间
- [ ] **回归测试套件**：自动检测已知问题
- [ ] **测试覆盖率报告**：统计测试覆盖范围

---

## 2.5 测试报告规范

### 报告内容

测试报告应包含以下信息：

```markdown
# AmazingTeam E2E Test Report

**执行时间**: 2026-03-21 10:30:00
**执行环境**: CI (GitHub Actions) / Local
**测试范围**: all / install-only / workflow-only
**总耗时**: 5m 30s

## 测试结果摘要

| 测试项 | 状态 | 耗时 | 备注 |
|--------|------|------|------|
| NPM 安装 | ✅ PASS | 10s | - |
| CLI 初始化 | ✅ PASS | 5s | - |
| 配置验证 | ✅ PASS | 2s | - |
| Skills 加载 | ✅ PASS | 3s | 13/13 skills loaded |
| Agent 响应 | ❌ FAIL | 30s | Timeout waiting for response |
| GitHub Actions | ⏭️ SKIP | - | Requires manual trigger |

## 失败详情

### Agent 响应测试

**错误信息**:
```
Error: Timeout waiting for agent response
  at test-agent.sh:45
```

**诊断建议**:
1. 检查 API Key 是否有效
2. 检查网络连接
3. 查看详细日志: tests/e2e/logs/agent-test.log

## 环境信息

- Node.js: v20.11.0
- npm: v10.2.4
- OS: Ubuntu 22.04
- amazingteam: v3.0.16
```

### 报告输出位置

| 环境 | 位置 |
|------|------|
| **本地测试** | `tests/e2e/local/reports/` |
| **CI 测试** | GitHub Actions Artifacts + PR 评论 |

### 报告输出详解

#### 1. GitHub Actions 控制台（实时）

**位置**: `GitHub → Actions → 点击具体运行记录`

**展示内容**:
```
Run basic tests
  ✅ test-install.sh - PASS (10s)
  ✅ test-init.sh - PASS (5s)  
  ✅ test-config.sh - PASS (2s)

Summary: 3 passed, 0 failed
Duration: 17s
```

**特点**: 实时输出，适合调试

#### 2. PR 评论（推荐）

**位置**: `PR 页面 → Conversation → 自动评论`

**展示格式**:
```markdown
## 🧪 E2E Test Results

**Commit**: abc1234
**Branch**: feature/new-feature
**Duration**: 17s

| Test | Status | Duration |
|------|--------|----------|
| NPM Install | ✅ PASS | 10s |
| CLI Init | ✅ PASS | 5s |
| Config Validation | ✅ PASS | 2s |

### Summary
- **Total**: 3 tests
- **Passed**: 3 ✅
- **Failed**: 0
- **Duration**: 17s

[📋 View Full Report](链接到Actions) | [📥 Download Logs](链接到Artifacts)
```

**失败时展示**:
```markdown
## 🧪 E2E Test Results

**Commit**: abc1234
**Status**: ❌ FAILED

| Test | Status | Duration |
|------|--------|----------|
| NPM Install | ✅ PASS | 10s |
| CLI Init | ❌ FAIL | 5s |
| Config Validation | ⏭️ SKIP | - |

### ❌ Failed: CLI Init

**Error**: Missing required file
```
Expected: amazingteam.config.yaml
Actual: File not found
```

**Diagnostic Suggestions**:
1. Check if `amazingteam init` completed successfully
2. Verify file permissions
3. View detailed logs: [test-init.log](链接)

[📋 View Full Report](链接) | [📥 Download Logs](链接)
```

**特点**: 开发者无需离开 PR 页面即可查看结果

#### 3. GitHub Actions Artifacts（详细报告）

**位置**: `Actions → 点击运行记录 → Artifacts → 下载`

**文件结构**:
```
e2e-test-report-2026-03-21-10-30-00.zip
├── summary.md              # 摘要报告（Markdown）
├── summary.json            # 摘要报告（JSON，机器可读）
├── junit-report.xml        # JUnit 格式（CI 集成用）
│
├── logs/
│   ├── test-install.log    # 安装测试详细日志
│   ├── test-init.log       # 初始化测试详细日志
│   ├── test-config.log     # 配置验证详细日志
│   └── full-test.log       # 完整测试输出
│
├── artifacts/
│   ├── generated-files/    # 测试生成的文件快照
│   └── screenshots/        # 截图（如有）
│
└── environment.json        # 测试环境信息
```

**保留时间**: 30 天

#### 4. GitHub Issue（失败时可选创建）

**触发条件**: 测试失败且指定 `create_issue_on_failure: true`

**Issue 内容**:
```markdown
## 🚨 E2E Test Failure

**Workflow**: e2e-test.yml
**Run ID**: 1234567890
**Commit**: abc1234
**Branch**: main
**Triggered by**: schedule

### Failed Tests

- ❌ CLI Init

### Error Details

\`\`\`
Error: Missing required file
Expected: amazingteam.config.yaml
\`\`\`

### Actions

- [View Workflow Run](链接)
- [Download Logs](链接)
- [Re-run Tests](链接)

---
*This issue was automatically created by E2E Test Workflow*
```

#### 5. 本地测试报告

**位置**: `tests/e2e/local/reports/`

**文件结构**:
```
tests/e2e/local/reports/
├── latest/                 # 最新报告（软链接）
│   ├── summary.md
│   └── logs/
│
├── 2026-03-21_10-30-00/   # 历史报告（按时间）
│   ├── summary.md
│   └── logs/
│
└── 2026-03-20_15-45-00/
    ├── summary.md
    └── logs/
```

**查看命令**:
```bash
# 运行测试并生成报告
./tests/e2e/local/run-all.sh

# 查看最新报告
cat tests/e2e/local/reports/latest/summary.md

# 或打开浏览器查看
open tests/e2e/local/reports/latest/summary.md
```

---

### 报告格式规范

#### summary.md 格式

```markdown
# AmazingTeam E2E Test Report

**Generated**: 2026-03-21 10:30:00 CST
**Environment**: CI (GitHub Actions) / Local
**Test Scope**: basic / all
**Total Duration**: 5m 30s

---

## 📊 Test Results Summary

| # | Test | Status | Duration | Notes |
|---|------|--------|----------|-------|
| 1 | NPM Install | ✅ PASS | 10s | v3.0.16 installed |
| 2 | CLI Init | ✅ PASS | 5s | All files generated |
| 3 | Config Validation | ✅ PASS | 2s | Valid YAML |
| 4 | Skills Loading | ✅ PASS | 5s | 13/13 skills loaded |
| 5 | Agent Response | ❌ FAIL | 30s | Timeout |
| 6 | GitHub Actions | ⏭️ SKIP | - | Not in scope |

**Summary**: 4 passed, 1 failed, 1 skipped

---

## ❌ Failed Tests

### 5. Agent Response Test

**Error**:
\`\`\`
Error: Timeout waiting for agent response
  at test-agent.sh:45 (callAgent)
\`\`\`

**Diagnostic Suggestions**:
1. Check if `AMAZINGTEAM_API_KEY` is valid
2. Verify network connectivity
3. Check API service status
4. View detailed log: logs/test-agent.log

---

## 📋 Environment Info

| Item | Value |
|------|-------|
| Node.js | v20.11.0 |
| npm | v10.2.4 |
| OS | Ubuntu 22.04 (CI) / macOS 14.3 (Local) |
| amazingteam | v3.0.16 |
| Test Runner | e2e-test v1.0.0 |

---

## 📁 Artifacts

- [View detailed logs](./logs/)
- [Download full report](./e2e-report.zip)

---

*Report generated by AmazingTeam E2E Test System*
```

#### summary.json 格式（机器可读）

```json
{
  "report_version": "1.0.0",
  "generated_at": "2026-03-21T10:30:00+08:00",
  "environment": {
    "type": "ci",
    "runner": "ubuntu-latest",
    "node_version": "20.11.0",
    "npm_version": "10.2.4",
    "os": "Ubuntu 22.04"
  },
  "test_scope": "basic",
  "total_duration_ms": 330000,
  "results": [
    {
      "name": "NPM Install",
      "status": "pass",
      "duration_ms": 10000,
      "message": "v3.0.16 installed"
    },
    {
      "name": "CLI Init",
      "status": "pass",
      "duration_ms": 5000,
      "message": "All files generated"
    }
  ],
  "summary": {
    "total": 3,
    "passed": 3,
    "failed": 0,
    "skipped": 0
  }
}
```

---

### 配置选项

在 `.github/workflows/e2e-test.yml` 中可配置：

```yaml
env:
  # 报告配置
  REPORT_FORMAT: 'markdown,json,junit'  # 输出格式
  REPORT_ARTIFACT_RETENTION: 30          # Artifacts 保留天数
  CREATE_ISSUE_ON_FAILURE: false         # 失败时是否创建 Issue
  PR_COMMENT_ENABLED: true               # 是否在 PR 中评论
```

---

## 2.6 修复流程

### 测试失败后的处理流程

```
测试失败
    │
    ▼
自动创建 GitHub Issue + 标签
    │
    ├── 简单问题（标签: auto-fix）
    │       │
    │       ▼
    │   OpenCode 自动处理 ← 定期扫描带标签的 Issue
    │       │
    │       ├── 分析问题
    │       ├── 生成修复方案
    │       ├── 创建 PR
    │       └── 等待人工审核合并
    │
    └── 复杂问题（标签: needs-triage）
            │
            ▼
        通知开发者
            │
            ▼
        手动修复 ──→ 重新运行测试
```

### 修复触发机制

#### 1. 测试失败自动创建 Issue

当 E2E 测试失败时，自动创建 GitHub Issue：

**触发条件**: 测试失败且 `CREATE_ISSUE_ON_FAILURE: true`

**Issue 模板**:
```markdown
## 🚨 E2E Test Failure

**Priority**: auto-fix / needs-triage
**Workflow**: e2e-test.yml
**Run ID**: 1234567890
**Commit**: abc1234
**Branch**: main
**Triggered by**: schedule / PR / manual

### Failed Tests

- ❌ CLI Init: Missing required file

### Error Details

\`\`\`
Error: Missing required file
Expected: amazingteam.config.yaml
Actual: File not found
\`\`\`

### Diagnostic Info

- Node.js: v20.11.0
- OS: Ubuntu 22.04
- Duration: 5s

### Actions

- [View Workflow Run](链接)
- [Download Logs](链接)
- [Re-run Tests](链接)

### Labels

- `bug` - 自动添加
- `auto-fix` / `needs-triage` - 根据问题类型自动判断

---
*This issue was automatically created by E2E Test Workflow*
```

#### 2. Issue 标签分类

| 标签 | 含义 | 处理方式 |
|------|------|---------|
| `auto-fix` | 简单问题，可自动修复 | OpenCode 自动处理 |
| `needs-triage` | 复杂问题，需要人工判断 | 通知开发者 |
| `bug` | 确认是 bug | 统一标记 |
| `e2e-test` | E2E 测试相关 | 便于筛选 |

**自动判断逻辑**:
```yaml
# 问题类型判断规则
simple_issues:  # 标签: auto-fix
  - "Missing required file"
  - "File not found"
  - "Permission denied"
  - "Config validation failed"
  - "Dependency install failed"

complex_issues:  # 标签: needs-triage
  - "Timeout"
  - "API error"
  - "Network error"
  - "Unknown error"
  - "Multiple failures"
```

#### 3. OpenCode 自动处理流程

**触发方式**: 定时扫描 + 事件触发

```
方式 A: 定时扫描（每小时）
    │
    └── 扫描 Issues 带有 `auto-fix` 标签
            │
            └── 逐个处理

方式 B: 事件触发（Webhook）
    │
    └── Issue 创建时检测标签
            │
            └── 立即处理
```

**处理步骤**:
```
1. 读取 Issue 内容
2. 分析失败原因
3. 定位问题代码
4. 生成修复方案
5. 创建修复分支
6. 实施修复
7. 运行测试验证
8. 创建 PR
9. 更新 Issue 状态
10. 等待人工审核合并
```

**PR 模板**:
```markdown
## 🤖 Auto Fix

Fixes #123

### Problem

E2E test `CLI Init` failed with error:
```
Missing required file: amazingteam.config.yaml
```

### Solution

- Added missing template file: `templates/amazingteam.config.yaml`
- Updated init script to copy template

### Changes

| File | Change |
|------|--------|
| `templates/amazingteam.config.yaml` | Added new file |
| `cli/commands/init.cjs` | Updated copy logic |

### Verification

- [x] Tests pass locally
- [x] Changes are minimal
- [x] No breaking changes

---

🤖 This PR was automatically generated by OpenCode.

**Review Required**: Please review before merging.
```

#### 4. 人工审核节点

| 节点 | 自动化 | 说明 |
|------|--------|------|
| 创建 Issue | ✅ 自动 | 测试失败自动创建 |
| 分类标签 | ✅ 自动 | 根据错误类型自动判断 |
| 分析问题 | ✅ 自动 | OpenCode 分析 |
| 修复代码 | ✅ 自动 | OpenCode 修复 |
| 创建 PR | ✅ 自动 | OpenCode 创建 PR |
| **代码审核** | ❌ **人工** | **必须人工审核** |
| **合并 PR** | ❌ **人工** | **必须人工合并** |
| 关闭 Issue | ✅ 自动 | PR 合并后自动关闭 |

### 配置选项

在 `.github/workflows/e2e-test.yml` 中配置：

```yaml
env:
  # Issue 创建配置
  CREATE_ISSUE_ON_FAILURE: true
  AUTO_LABEL_ENABLED: true
  
  # 自动修复配置
  AUTO_FIX_ENABLED: true
  AUTO_FIX_LABEL: 'auto-fix'
  AUTO_FIX_SCHEDULE: '0 * * * *'  # 每小时扫描一次
  
  # 通知配置
  NOTIFY_ON_SLACK: false
  NOTIFY_ON_EMAIL: false
```

### 安全保障

1. **代码审核必须人工**: PR 创建后不会自动合并
2. **修复范围限制**: 只修复标记为 `auto-fix` 的简单问题
3. **回滚机制**: 每次修复创建独立分支，可快速回滚
4. **变更最小化**: 只修改必要的文件
5. **测试验证**: 修复后自动运行测试，测试失败不创建 PR

---

## 3. Test Matrix

| 测试项 | 本地测试 | CI 测试 | 需要真实 API | PR 触发 | 手动触发 | 每日触发 |
|--------|---------|--------|-------------|---------|---------|---------|
| NPM 安装 | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| CLI 初始化 | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| 配置文件验证 | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Skills 加载 | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| GitHub Actions 工作流 | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Agent 测试 | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| 端到端流程 | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |

### 触发策略说明

| 触发场景 | 测试范围 | 原因 |
|---------|---------|------|
| **PR 创建/更新** | 基础测试（安装、初始化、配置验证）| 快速反馈，不消耗 API |
| **Push to main** | 基础测试 | 同 PR，保证主分支质量 |
| **手动触发** | 可选范围 | 按需执行完整测试 |
| **每日定时** | 全部测试 | 定期验证，发现潜在问题 |

---

## 4. Technical Design

### Directory Structure

```
amazingteam/
├── tests/
│   └── e2e/                          # 端到端测试（不发布到 npm）
│       ├── README.md                 # 测试说明文档
│       ├── package.json              # 测试依赖（独立 package）
│       │
│       ├── fixtures/                 # 测试固件
│       │   ├── minimal-project/      # 最小项目模板
│       │   │   ├── package.json
│       │   │   └── src/
│       │   └── full-project/         # 完整项目模板
│       │       ├── package.json
│       │       ├── src/
│       │       └── tests/
│       │
│       ├── scripts/                  # 测试脚本
│       │   ├── test-install.sh       # 安装测试
│       │   ├── test-init.sh          # 初始化测试
│       │   ├── test-config.sh        # 配置验证测试
│       │   ├── test-skills.sh        # Skills 加载测试
│       │   └── test-agent.sh         # Agent 测试
│       │
│       ├── local/                    # 本地测试入口
│       │   ├── run-all.sh            # 运行所有本地测试
│       │   └── setup-local.sh        # 本地环境设置
│       │
│       └── ci/                       # CI 相关配置
│           └── test-matrix.json      # 测试矩阵配置
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # 常规 CI（lint, build, unit test）
│       └── e2e-test.yml              # E2E 测试（手动触发 + 每日触发）
│
├── .gitignore                        # tests/e2e/local/tmp/ 可排除临时文件
└── package.json                      # files 字段不包含 tests/e2e/
```

### CI Workflow Design

```yaml
# .github/workflows/e2e-test.yml
name: E2E Tests

on:
  # PR 触发：仅基础测试
  pull_request:
    branches: [main]
    
  # Push to main：仅基础测试
  push:
    branches: [main]
    
  # 手动触发：可选完整测试
  workflow_dispatch:
    inputs:
      test_scope:
        description: 'Test scope'
        required: true
        default: 'basic'
        type: choice
        options:
          - basic        # 基础测试（安装、初始化、配置验证）
          - all          # 全部测试（包括 Agent、E2E）
          - install-only # 仅安装测试
          - workflow-only # 仅工作流测试
          
  # 每日定时：完整测试
  schedule:
    - cron: '0 2 * * *'  # UTC 02:00 = 北京时间 10:00

jobs:
  # 基础测试（PR/Push/手动/定时都会运行）
  basic-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run basic tests
        run: |
          cd tests/e2e
          ./scripts/test-install.sh
          ./scripts/test-init.sh
          ./scripts/test-config.sh

  # 完整测试（仅手动触发和定时触发）
  full-tests:
    if: github.event_name == 'workflow_dispatch' || github.event_name == 'schedule'
    runs-on: ubuntu-latest
    needs: basic-tests
    steps:
      - uses: actions/checkout@v4
      - name: Run full tests
        env:
          AMAZINGTEAM_API_KEY: ${{ secrets.AMAZINGTEAM_API_KEY }}
        run: |
          cd tests/e2e
          ./scripts/test-skills.sh
          ./scripts/test-agent.sh
          # ... 更多测试
```

---

## 5. Non-Functional Requirements

### Performance

- CI 测试总执行时间 ≤ 15 分钟
- 单个测试脚本执行时间 ≤ 5 分钟
- 本地测试支持并行执行

### Security

- API Key 通过 GitHub Secrets 管理
- 测试日志不暴露敏感信息
- 测试仓库使用独立的测试账号

### Reliability

- 测试支持重试机制（失败后最多重试 2 次）
- 测试结果可追溯（保存执行日志）
- 提供测试失败的诊断信息

---

## 6. Constraints

### Technical

- 测试代码放在 `tests/e2e/` 目录
- 测试代码不包含在 `package.json` 的 `files` 字段中
- CI 测试需要 `AMAZINGTEAM_API_KEY` secret
- 本地测试需要用户手动配置 API Key

### Business

- 测试不应影响主项目开发效率
- CI 测试不应过度消耗资源
- 测试代码提交到 GitHub，但不发布到 npm

---

## 7. Out of Scope

以下功能暂不包含在本次需求中：

- ❌ 压力测试/负载测试
- ❌ 安全渗透测试
- ❌ 跨平台兼容性测试（仅 Linux CI）
- ❌ 多版本 Node.js 兼容性测试

---

## 8. Implementation Phases

### Phase 1: 基础测试框架（优先）

- [ ] 创建 `tests/e2e/` 目录结构
- [ ] 实现安装测试
- [ ] 实现初始化测试
- [ ] 实现配置验证测试

### Phase 2: Skills & Agent 测试

- [ ] 实现 Skills 加载测试
- [ ] 实现 Agent 响应测试
- [ ] 创建本地测试脚本

### Phase 3: CI 集成

- [ ] 创建 `.github/workflows/e2e-test.yml`
- [ ] 配置 GitHub Secrets
- [ ] 实现手动触发和定时触发

### Phase 4: 端到端测试

- [ ] 实现 Issue 创建测试
- [ ] 实现 GitHub Actions 工作流测试
- [ ] 实现 PR 创建验证

---

## 9. Acceptance Criteria

### Definition of Done

- [ ] 所有测试脚本可执行
- [ ] CI workflow 正常运行
- [ ] 测试结果有明确报告
- [ ] 文档完整（README.md）
- [ ] 代码通过 review

### Test Cases to Pass

| # | 测试用例 | 预期结果 |
|---|---------|---------|
| 1 | `npm install amazingteam` | 安装成功，无错误 |
| 2 | `npx amazingteam init` | 生成所有必需文件 |
| 3 | 配置文件验证 | 文件结构正确，内容有效 |
| 4 | Skills 加载 | 13 个技能全部加载成功 |
| 5 | Agent 响应 | Agent 能正常处理请求 |
| 6 | E2E 流程 | Issue → PR 流程完整 |

---

## 10. Risks & Mitigations

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|-------|------|---------|
| API 调用失败 | 中 | 高 | 重试机制 + 错误日志 |
| CI 环境差异 | 低 | 中 | 使用容器化测试环境 |
| 测试数据污染 | 低 | 中 | 每次测试清理环境 |
| 资源消耗过大 | 中 | 低 | 限制并发测试数量 |

---

## Approval

- [x] Requirements reviewed with user
- [x] Acceptance criteria agreed upon
- [x] Ready for implementation planning