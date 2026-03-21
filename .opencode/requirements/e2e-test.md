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

---

## 2.6 修复流程

### 测试失败后的处理流程

```
测试失败
    │
    ▼
查看测试报告（自动生成）
    │
    ▼
分析诊断建议
    │
    ├─ 简单问题 ──→ 查看 logs/ 目录详细日志
    │                    │
    │                    ▼
    │              定位问题代码 ──→ 手动修复 ──→ 重新运行测试
    │
    └─ 复杂问题 ──→ 创建 GitHub Issue（可选）
                          │
                          ▼
                    Assign 给相关开发者
                          │
                          ▼
                    手动修复 ──→ 重新运行测试
```

### 修复职责说明

| 操作 | 自动化 | 说明 |
|------|--------|------|
| 检测问题 | ✅ 自动 | E2E 测试自动检测 |
| 生成报告 | ✅ 自动 | 自动生成详细报告 |
| 诊断建议 | ⚠️ 部分 | 提供常见错误建议，复杂问题需人工分析 |
| 修复代码 | ❌ 手动 | 需要人工判断和修复 |
| 验证修复 | ✅ 自动 | 重新运行测试验证 |

### 为什么不能自动修复？

1. **问题多样性**: 失败原因可能是代码 bug、配置错误、环境问题、API 故障等
2. **修复复杂度**: 需要理解代码上下文、业务逻辑、架构设计
3. **风险控制**: 自动修复可能引入新问题
4. **责任归属**: 代码修改需要人工审核和确认

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