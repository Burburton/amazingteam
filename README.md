# AmazingTeam

**可复用的 AI 开发团队底座** - 基于 OpenCode + GitHub + GitHub Actions 的半自动化软件开发系统。

具备受控的自举能力，支持初始化、验证、规划和升级下游项目。

## 特性

- 🤖 **七个 AI 角色**: Planner, Architect, Developer, QA, Reviewer, Triage, CI Analyst
- 🧠 **分层记忆系统**: 全局记忆、角色记忆、任务记忆、失败库隔离
- 📋 **任务系统**: task.yaml 任务清单，状态机驱动工作流
- 🔀 **GitHub Issue 编排**: 大任务分解为子Issue，依赖追踪，逐个派发
- 🔄 **可升级底座**: 项目开发期间可同步最新模板更新
- 📦 **开箱即用**: 一键初始化新项目
- 🔒 **安全可控**: 人工审批保留在关键节点，治理模型保护核心知识
- 🚀 **受控自举**: 支持初始化、验证、规划、升级，但不会无监管自我修改

## 快速开始

### 安装到现有项目

```bash
cd your-project

# 初始化 AmazingTeam
npx amazingteam init

# 安装依赖
npm install amazingteam --save-dev
```

### 安装后用户项目结构

AmazingTeam 作为 NPM 包安装，**不需要提交到你的仓库**：

```
your-project/
├── .github/
│   └── workflows/
│       └── amazingteam.yml     # ✅ 提交 - GitHub Actions 工作流
│
├── .amazing-team/
│   └── memory/                  # ✅ 可选提交 - AI 角色记忆状态
│
├── tasks/                       # ✅ 可选提交 - 任务历史记录
│
├── amazingteam.config.yaml      # ✅ 提交 - 项目配置
├── opencode.jsonc               # ✅ 提交 - OpenCode 配置
├── AGENTS.md                    # ✅ 提交 - 项目全局规则（可选）
├── .gitignore                   # 添加 AmazingTeam 相关忽略
│
├── node_modules/                # ❌ 不提交
│   └── amazingteam/             # NPM 包，通过 npm install 安装
│
└── src/                         # 你的源代码
```

### 需要提交的文件

| 文件 | 是否提交 | 说明 |
|------|---------|------|
| `.github/workflows/amazingteam.yml` | ✅ 是 | 引用 Foundation 版本 |
| `amazingteam.config.yaml` | ✅ 是 | 你的项目配置 |
| `opencode.jsonc` | ✅ 是 | OpenCode 配置 |
| `AGENTS.md` | ✅ 是 | 项目规则（可选，可自定义） |
| `.amazing-team/memory/` | 可选 | AI 记忆状态，提交可保留历史 |
| `tasks/` | 可选 | 任务历史，提交可追溯 |
| `node_modules/amazingteam/` | ❌ 否 | 通过 `npm install` 安装 |

### .gitignore 配置

AmazingTeam 初始化会自动添加：

```gitignore
# Node modules
node_modules/

# AmazingTeam cache
.amazing-team-cache/
.amazing-team-local/
```

### 配置 GitHub Secrets

在仓库 Settings → Secrets and variables → Actions 添加：

| Secret | 说明 |
|--------|------|
| `AMAZINGTEAM_API_KEY` | OpenCode API 密钥 |
| `GITHUB_TOKEN` | 自动提供，无需手动配置 |

### 开始使用

创建 Issue 后，评论命令触发 AI：

```
/oc /auto
```

这会自动执行：Triage → Design → Implement → Test → Create PR，等待人工审核合并。

---

### 方式一：使用 Bootstrap 脚本 (推荐)

```bash
# 克隆 Foundation
git clone https://github.com/Burburton/amazingteam.git
cd amazingteam

# 初始化新项目
./scripts/init_project.sh my-project

# 或使用 overlay
./scripts/init_project.sh -o python-backend -l python my-api
```

### 方式二：作为模板使用

```bash
# 使用 GitHub Template 创建新仓库
# 或者克隆此仓库
git clone https://github.com/Burburton/amazingteam.git my-project
cd my-project

# 初始化配置
node cli/amazingteam.cjs init
```

### 方式三：添加到现有项目

```bash
cd your-existing-project

# 下载并运行初始化脚本
npx amazingteam init
```

### 方式四：全局安装

```bash
npm install -g amazingteam

# 创建新项目
amazingteam init my-project

# 或在现有项目中初始化
cd your-project
amazingteam init
```

## Foundation 项目结构

以下是 AmazingTeam Foundation 自身的目录结构（NPM 包内容）：

```
amazingteam/                     # Foundation 源码仓库
├── .opencode/                    # OpenCode 配置入口
│   ├── agents/                   # Agent 入口文件 (YAML配置+简要描述)
│   │   ├── planner.md            # 指向 .amazing-team/agents/planner.md
│   │   ├── architect.md          # 指向 .amazing-team/agents/architect.md
│   │   └── ...                   # 其他角色入口
│   ├── skills/                   # 可复用技能
│   └── commands/                 # 工作流命令
│
├── .amazing-team/                     # AI Team 核心配置 (升级时覆盖)
│   ├── agents/                   # AI 角色详细行为定义
│   │   ├── planner.md            # 完整职责、约束、工作流程
│   │   ├── architect.md          # 完整职责、约束、工作流程
│   │   ├── developer.md          # 完整职责、约束、工作流程
│   │   ├── qa.md                 # 完整职责、约束、工作流程
│   │   ├── reviewer.md           # 完整职责、约束、工作流程
│   │   ├── triage.md             # 完整职责、约束、工作流程
│   │   └── ci-analyst.md         # 完整职责、约束、工作流程
│   └── memory/                   # 角色记忆模板
│       ├── planner/
│       │   ├── flow_rules.md           # 状态机规则
│       │   ├── decomposition_notes.md  # 分解模式
│       │   └── github_issue_patterns.md # GitHub编排模式
│       ├── architect/
│       ├── developer/
│       ├── qa/
│       ├── reviewer/
│       ├── triage/
│       ├── ci-analyst/
│       └── failures/            # 共享失败库
│
├── scripts/                     # Bootstrap 脚本
│   ├── init_project.sh          # 初始化新项目
│   ├── validate_foundation.sh   # 验证 Foundation
│   ├── validate_project_setup.sh # 验证项目配置
│   ├── plan_upgrade.sh          # 规划升级
│   ├── upgrade_foundation.sh    # 执行升级
│   ├── diff_foundation_vs_project.sh # 对比差异
│   └── generate_docs.sh         # 生成文档
│
├── .foundation/                 # Foundation 元数据模板
│   ├── foundation.lock          # 版本锁定模板
│   ├── upgrade-history.md       # 升级历史模板
│   └── local-overrides.md       # 本地覆盖模板
│
├── cli/                         # CLI 工具
│   ├── amazing-team.cjs              # 主命令
│   └── sync.cjs                 # 同步脚本
│
├── overlays/                    # 技术栈 overlay
│   ├── cpp-qt-desktop/          # C++ Qt 桌面应用
│   ├── python-backend/          # Python 后端
│   ├── web-fullstack/           # 全栈 Web
│   └── ai-agent-product/        # AI Agent 产品
│
├── .github/                     # GitHub 配置 (可自定义)
│   ├── workflows/               # CI/CD 工作流
│   └── ISSUE_TEMPLATE/          # Issue 模板
│
├── docs/                        # 文档目录
│   ├── architecture/            # 架构文档
│   ├── decisions/               # 决策记录
│   ├── patterns/                # 实现模式库
│   ├── releases/                # 发布文档
│   ├── runbooks/ci/             # CI 运维手册
│   ├── bootstrap-model.md       # Bootstrap 模型
│   ├── upgrade-policy.md        # 升级策略
│   └── overlay-guide.md         # Overlay 指南
│
├── tasks/                       # 任务记忆存储
│   ├── _template/               # 任务模板
│   │   ├── task.yaml            # 任务清单模板
│   │   └── release.md           # 发布检查模板
│   └── issue-{id}/              # 具体任务目录
│
├── src/                         # 源代码
│
├── VERSION                      # Foundation 版本
├── CHANGELOG.md                 # 版本变更记录
├── amazingteam.config.yaml          # 项目配置 (自定义)
├── AGENTS.md                    # 全局规则 (自定义)
└── README.md
```

## 使用指南

### 1. 初始化项目

```bash
# 交互式初始化
amazingteam init

# 指定参数
amazingteam init my-project \
  --language typescript \
  --framework node \
  --description "My awesome project"
```

### 2. 配置 GitHub Secrets

在仓库 Settings → Secrets and variables → Actions 添加：

| Secret | 说明 |
|--------|------|
| `AMAZINGTEAM_API_KEY` | OpenCode API 密钥 |
| `GITHUB_TOKEN` | 自动提供，无需手动配置 |

### 3. 使用 AI Team

创建 Issue 后，评论命令触发 AI：

**触发命令：**

| 命令 | 作用 |
|------|------|
| `/ai`, `/oc`, `/opencode` | 触发自动工作流（推荐） |
| `ai:process` label | 给 Issue 添加此标签触发 |

**工作流程：**

```
Issue 创建 → 评论 /ai
       │
       ▼
┌─────────────────────────────────────────────────────┐
│  GitHub Actions Workflow                            │
│      │                                              │
│      ├── Triage (AI 分析复杂度)                     │
│      │    ├── 简单任务 → 直接执行 → 创建 PR         │
│      │    └── 复杂任务 → 创建子Issue → 逐个执行     │
│      │                                              │
│      ├── 执行子任务 #1 → 创建 PR/直接提交           │
│      ├── PR 合并 / Direct 模式完成                  │
│      ├── 自动触发子任务 #2                          │
│      └── ... 直到所有子任务完成                     │
│                                                     │
│      └── 自动关闭父 Issue                           │
└─────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Human     │ ─── 审核 PR（仅 PR 模式）
└─────────────┘
```

**提交模式配置：**

在 `amazingteam.config.yaml` 中设置：

```yaml
workflow:
  commit_mode: pr  # 或 direct

  # PR 模式配置
  pr:
    require_review: true
    auto_merge: false

  # Direct 模式配置  
  direct:
    require_ci_pass: true
```

| 模式 | 触发下一个子任务 | 适用场景 |
|------|------------------|----------|
| `pr` (默认) | PR merge 后 | 团队项目，需要代码审查 |
| `direct` | 执行完成后立即 | 个人项目，快速迭代 |

**手动分步流程（高级用户）：**

```
新Issue → /triage → 判断是否需要分解
                          │
              ┌───────────┴───────────┐
              ↓                       ↓
         需要分解                  无需分解
              │                       │
              ↓                       ↓
      /breakdown-issue            /design
              │                       │
              ↓                       ↓
       创建子Issue               /implement
              │                       │
              ↓                       ↓
       /dispatch-next                ...
              │
              ↓ (循环直到完成)
              │
       /close-parent-task
```

**可用命令：**

| 命令 | 角色 | 作用 |
|------|------|------|
| `/auto` | Planner | **全自动**：分类 → 设计 → 实现 → 测试 → 创建 PR（含阻塞处理） |
| `/resume` | Planner | 阻塞解决后恢复工作流 |
| `/triage` | Triage | Issue分类，确定是否需要分解 |
| `/breakdown-issue` | Planner | 分解大任务为GitHub子Issue |
| `/dispatch-next` | Planner | 派发下一个活跃子任务 |
| `/show-blockers` | Planner | 显示被阻塞的任务 |
| `/summarize-parent` | Planner | 汇总父任务进度 |
| `/close-parent-task` | Planner | 验证并关闭父任务 |
| `/design` | Architect | 分析需求，设计方案 |
| `/implement` | Developer | 实现代码 |
| `/test` | QA | 测试验证 |
| `/review` | Reviewer | 代码审查 |
| `/ci-analyze` | CI Analyst | CI 失败分析、阻塞诊断 |
| `/release-check` | Reviewer | 发布就绪检查 |

### 4. 工作流程

#### 全自动流程（推荐）

```
Issue 创建
      │
      ▼
  /oc /auto
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  Planner (Coordinator)                              │
│      │                                              │
│      ├── Triage (分类)                              │
│      │                                              │
│      ├── 决策点                                     │
│      │    ├── 简单任务 → 直接执行                   │
│      │    └── 复杂任务 → 创建子Issue → 逐个执行     │
│      │                                              │
│      ├── Architect (设计)                           │
│      ├── Developer (实现)                           │
│      ├── QA (测试)                                  │
│      └── Developer (创建 PR)                        │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────┐
│   Human     │ ─── 审核合并
└─────────────┘
```

#### 阻塞处理流程

```
工作流执行中
      │
      ▼ (遇到问题)
┌─────────────┐
│   暂停      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ CI Analyst  │ ─── 诊断问题
└──────┬──────┘
       │
       ▼
  ┌────┴────┐
  │  决策   │
  └────┬────┘
       │
  ┌────┼────────────┐
  ↓    ↓            ↓
简单  中等        需人类
  │    │            │
  ↓    ↓            ↓
自动  创建        创建子Issue
修复  子Issue     通知人类
  │   AI解决      等待/resume
  │    │            │
  └────┴────────────┘
       │
       ▼
恢复原工作流
```

**阻塞处理示例：**

```markdown
# 简单问题 - 自动修复
Error: Cannot find module './utils'
→ 自动添加 import，继续工作流

# 中等问题 - 创建子Issue AI解决
Error: API endpoint /v2/users not found
→ 创建子Issue #205: 更新 API 端点
→ AI 解决子Issue
→ 恢复原工作流

# 需要人类 - 创建子Issue 通知人类
Error: Permission denied: Cannot push to 'main'
→ 创建子Issue #206: [Blocker] 权限问题
→ 通知人类
→ 等待人类解决后评论 `/oc /resume`
```

#### 功能开发流程（大任务 - 手动分步）

```
Issue 创建
      │
      ▼
┌─────────────┐
│   Triage    │ ─── 分类，判断是否需要分解
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Planner   │ ─── 分解为子Issue，建立依赖关系
└─────┬───────┘
      │
      ▼ (逐个派发子任务)
      │
┌─────────────┐
│  Architect  │ ─── 分析需求，设计方案
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Developer  │ ─── 实现代码，创建 PR
└─────┬───────┘
      │
      ▼
┌─────────────┐
│     QA      │ ─── 测试验证
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Reviewer   │ ─── 代码审查
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Planner   │ ─── 验证子任务完成，派发下一个
└─────┬───────┘
      │
      ▼ (循环直到所有子任务完成)
      │
┌─────────────┐
│   Human     │ ─── 审批合并，关闭父Issue
└─────────────┘
```

#### 功能开发流程（小任务）

```
Issue 创建
      │
      ▼
┌─────────────┐
│   Triage    │ ─── 分类，判断无需分解
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Architect  │ ─── 分析需求，设计方案
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Developer  │ ─── 实现代码，创建 PR
└─────┬───────┘
      │
      ▼
┌─────────────┐
│     QA      │ ─── 测试验证
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Reviewer   │ ─── 代码审查
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Human     │ ─── 审批合并
└─────────────┘
```

#### Bug 修复流程

```
Bug 报告
     │
     ▼
┌─────────────┐
│   Triage    │ ─── 分类，初步调试分析
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Developer  │ ─── 修复代码
└─────┬───────┘
      │
      ▼
┌─────────────┐
│     QA      │ ─── 回归测试
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Reviewer   │ ─── 代码审查
└─────────────┘
```

#### CI 失败流程

```
CI 失败
     │
     ▼
┌─────────────┐
│ CI Analyst  │ ─── 分析失败原因，提供修复建议
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Developer  │ ─── 应用修复
└─────┬───────┘
      │
      ▼
┌─────────────┐
│     QA      │ ─── 验证修复
└─────────────┘
```

## 任务系统

### task.yaml 任务清单

每个任务都有一个 `task.yaml` 文件：

```yaml
id: issue-123
title: 实现用户认证
type: feature
status: in_implementation
priority: high
owner_role: developer
depends_on: []
blocked_by: []
acceptance_criteria:
  - 用户可以使用邮箱密码登录
  - 登录失败有合理的错误提示
risk_level: medium
module_scope:
  - auth
  - api

github_issue: 123
github_url: https://github.com/org/repo/issues/123
parent_task: null
requires_decomposition: false

subtasks:
  - id: issue-123-subtask-01
    github_issue: 201
    title: "[Subtask] 设计认证API"
    type: design
    owner_role: architect
    status: done
  - id: issue-123-subtask-02
    github_issue: 202
    title: "[Subtask] 实现登录接口"
    type: implementation
    owner_role: developer
    status: in_progress
    depends_on: [201]
```

### 大任务分解原则

**需要分解的情况：**
- 涉及多个模块
- 需要先设计再实现
- 影响公共接口
- 需要多个 PR
- 有明显的依赖顺序

**不需要分解的情况：**
- 单模块变更
- 范围清晰
- 一个 PR 足够

### 任务状态机

```
backlog → ready → in_analysis → in_design → in_implementation → in_validation → in_review → release_candidate → done
                              ↓                                              ↓
                           blocked ←───────────────────────────────────────── ←
```

### GitHub Issue 编排

大任务通过 `/breakdown-issue` 命令分解为子Issue：

```
父Issue #120: 改进启动可靠性
    │
    ├── 子Issue #201: [Subtask] 隔离配置验证 (architect)
    │       ↓
    ├── 子Issue #202: [Subtask] 重构启动错误路径 (developer)
    │       ↓
    └── 子Issue #203: [Subtask] 添加回归测试 (qa)
```

**编排规则：**
- 一个子任务一个 PR
- 逐个派发，不并行（除非明确说明）
- 依赖关系显式记录
- 父Issue在所有子Issue完成后才关闭

**常用命令流程：**

```bash
# 1. 分类新Issue
/triage

# 2. 分解大任务（如需要）
/breakdown-issue

# 3. 派发子任务
/dispatch-next

# 4. 查看阻塞情况
/show-blockers

# 5. 查看进度
/summarize-parent

# 6. 验证完成
/close-parent-task
```

## 升级底座

当模板仓库有更新时，可以同步到你的项目：

```bash
# 检查状态
amazingteam status

# 升级到最新版本
amazingteam upgrade

# 强制升级
amazingteam upgrade --force
```

**升级注意事项：**

| 目录 | 升级行为 | 说明 |
|------|---------|------|
| `.opencode/agents/` | 覆盖 | 入口文件，通常不需要自定义 |
| `.amazing-team/agents/` | 覆盖 | 行为规范，自定义前先备份 |
| `.amazing-team/memory/` | 合并 | 保留现有记忆，添加新模式 |
| `amazingteam.config.yaml` | 跳过 | 项目自定义配置 |
| `AGENTS.md` | 跳过 | 项目全局规则 |
| `docs/` | 跳过 | 项目文档 |

**升级流程：**

```
1. amazingteam status          → 检查版本差异
2. amazingteam upgrade --dry-run  → 预览变更
3. amazingteam upgrade         → 执行升级
4. 检查变更，恢复自定义行为（如有）
5. 测试项目
6. 提交变更
```

**自定义行为保护：**

如果自定义了 `.amazing-team/agents/` 中的行为规范：

1. 升级前备份自定义内容
2. 升级后合并新功能和自定义内容
3. 或者在 `amazingteam.config.yaml` 中标记：

```yaml
upgrade:
  protected_files:
    - ".amazing-team/agents/developer.md"
```

## Bootstrap 脚本

Foundation 提供一组 Bootstrap 脚本，用于初始化、验证和升级项目。

### 脚本列表

| 脚本 | 用途 | 模式 |
|------|------|------|
| `init_project.sh` | 初始化新项目 | init |
| `validate_foundation.sh` | 验证 Foundation 完整性 | validate |
| `validate_project_setup.sh` | 验证项目配置 | validate |
| `plan_upgrade.sh` | 生成升级计划 (只读) | plan-upgrade |
| `upgrade_foundation.sh` | 执行受控升级 | apply-upgrade |
| `diff_foundation_vs_project.sh` | 对比 Foundation 与项目 | validate |
| `generate_docs.sh` | 生成文档 | - |

### 初始化新项目

```bash
# 基本用法
./scripts/init_project.sh my-project

# 指定 overlay 和语言
./scripts/init_project.sh -o python-backend -l python my-api

# 使用 C++ Qt overlay
./scripts/init_project.sh -o cpp-qt-desktop -l cpp my-desktop-app

# 完整参数
./scripts/init_project.sh \
  --language typescript \
  --framework node \
  --description "My awesome project" \
  --overlay web-fullstack \
  my-project
```

**创建的内容**:
- `.amazing-team/` - AI Team 配置
- `.github/` - GitHub 工作流和模板
- `.foundation/` - Foundation 元数据
- `docs/`, `tasks/`, `src/` - 项目目录
- `amazingteam.config.yaml`, `opencode.jsonc` - 项目配置

### 验证项目

```bash
# 验证 Foundation 自身
./scripts/validate_foundation.sh

# 验证项目配置
./scripts/validate_project_setup.sh /path/to/project

# 或在项目目录中
cd my-project
../scripts/validate_project_setup.sh .
```

**验证内容**:
- 必需目录是否存在
- Agent/Skill/Command 文件是否完整
- Memory 目录是否正确
- GitHub 工作流和模板是否存在
- Foundation lock 文件是否有效

### 规划升级

```bash
# 生成升级计划 (只读，不修改文件)
./scripts/plan_upgrade.sh /path/to/project
```

**输出**:
- 缺失文件列表
- 过期文件列表
- 受保护文件列表
- 风险评估
- 升级计划报告 (`.foundation/upgrade-plan.md`)

### 执行升级

```bash
# 执行升级
./scripts/upgrade_foundation.sh /path/to/project

# 预览变更 (不实际执行)
./scripts/upgrade_foundation.sh --dry-run /path/to/project

# 强制升级 (跳过确认)
./scripts/upgrade_foundation.sh --force /path/to/project
```

**升级行为**:
- 自动添加缺失文件 (Class A)
- 生成变更 diff 供审查 (Class B)
- 跳过受保护文件 (Class C)
- 创建备份
- 更新 `.foundation/` 元数据

### 对比差异

```bash
# 对比 Foundation 和项目的所有关键文件
./scripts/diff_foundation_vs_project.sh /path/to/project

# 对比特定文件
./scripts/diff_foundation_vs_project.sh /path/to/project .amazing-team/agents/planner.md
```

### 文件分类

| 类别 | 说明 | 升级行为 |
|------|------|---------|
| **Class A** | 自动生成 (模板、空目录) | 可自动创建/替换 |
| **Class B** | 需审查 (Agent、Skill、Command) | 生成 diff，人工审查 |
| **Class C** | 受保护 (架构文档、决策记录) | 人工批准，禁止自动修改 |

### Foundation 元数据

每个下游项目都有 `.foundation/` 目录：

```
.foundation/
├── foundation.lock      # 版本锁定
├── upgrade-history.md   # 升级历史
└── local-overrides.md   # 本地自定义记录
```

**foundation.lock**:
```yaml
foundation_repo: amazingteam
foundation_version: 2.0.0
overlay: python-backend
initialized_at: 2026-03-14
last_upgrade_at: 2026-03-20
```

**升级流程**:

```
1. plan_upgrade.sh    → 生成升级计划 (只读)
2. 审查 upgrade-plan.md
3. upgrade_foundation.sh --dry-run  → 预览变更
4. upgrade_foundation.sh            → 执行升级
5. validate_project_setup.sh        → 验证结果
6. 测试项目
7. 提交变更
```

## 记忆系统

### 四层记忆架构

```
┌─────────────────────────────────────┐
│       GLOBAL MEMORY (docs/)          │
│   项目级知识，需要人工审批修改        │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   ROLE MEMORY (.amazing-team/memory/)    │
│   角色专属记忆，自动更新              │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   FAILURES LIBRARY                   │
│   共享失败模式库，CI Analyst 维护     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      TASK MEMORY (tasks/)            │
│   任务级记忆，自动创建归档            │
└─────────────────────────────────────┘
```

### 记忆权限矩阵

| 角色 | 全局 | Planner | Architect | Developer | QA | Reviewer | Triage | CI Analyst | 失败库 | 任务 |
|------|------|---------|-----------|-----------|-----|----------|--------|------------|--------|------|
| Planner | 只读 | 读写 | 只读 | - | - | - | 只读 | - | 只读 | 读写 |
| Architect | 只读 | 只读 | 读写 | 只读 | - | - | - | - | 只读 | 读写 |
| Developer | 只读 | 只读 | 只读 | 读写 | - | - | - | - | 只读 | 读写 |
| QA | 只读 | 只读 | 只读 | - | 读写 | - | - | - | 只读 | 读写 |
| Reviewer | 只读 | 只读 | 只读 | 只读 | 只读 | 读写 | - | - | 只读 | 读写 |
| Triage | 只读 | - | - | - | - | - | 读写 | - | 只读 | 读写 |
| CI Analyst | 只读 | - | - | - | - | - | - | 读写 | 读写 | 读写 |

## 治理模型

### 变更范围保护

- Bug 修复不应进行无关重构
- 功能开发不应在未审批时重新设计公共接口
- 重构应保持行为不变
- 审查者不应静默修改实现

### 受保护知识区域

AI 不能直接修改以下区域，需要人工审批：

- `docs/architecture/`
- `docs/decisions/`
- 发布策略
- 标准文档

### 人工审批关卡

以下操作需要人工审批：

- 架构变更
- 合并到受保护分支
- 发布操作
- 修改全局知识
- 高风险任务分解

## 自定义配置

### Agent 文件结构

Agent 定义分为两部分：

| 目录 | 职责 | 内容 |
|------|------|------|
| `.opencode/agents/` | 入口文件 | YAML配置、工具权限、简要描述 |
| `.amazing-team/agents/` | 行为规范 | 完整职责、约束、工作流程、输出格式 |

**入口文件示例** (`.opencode/agents/planner.md`):
```yaml
---
description: Decomposes tasks into GitHub sub-issues
tools:
  write: false
  bash:
    "gh issue*": allow
---
You are the Planner agent. See `.amazing-team/agents/planner.md` for details.
```

**行为规范文件** (`.amazing-team/agents/planner.md`):
- 完整职责列表
- 约束和反模式
- 工作流程
- 输出格式模板

### amazingteam.config.yaml

```yaml
project:
  name: "my-project"
  description: "My project description"
  language: "typescript"
  framework: "node"

ai_team:
  version: "2.0.0"
  agents:
    planner: true
    architect: true
    developer: true
    qa: true
    reviewer: true
    triage: true
    ci_analyst: true

rules:
  coding:
    max_function_lines: 30
    test_coverage_threshold: 80
  git:
    commit_convention: "conventional"
  governance:
    protected_paths:
      - "docs/architecture/"
      - "docs/decisions/"
```

### 添加自定义角色

1. 创建角色文件 `.amazing-team/agents/custom-role.md`
2. 在配置中启用：

```yaml
ai_team:
  custom_agents:
    - name: product-manager
      enabled: true
```

### 添加自定义技能

1. 创建技能文件 `.amazing-team/skills/my-skill/skill.md`
2. 在 `opencode.jsonc` 中注册

## 开发此模板

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建
npm run build

# 本地测试 CLI
node cli/amazingteam.cjs init test-project
```

## 常见问题

### Q: 如何保留自定义修改？

A: 以下文件不会被升级覆盖：
- `amazingteam.config.yaml`
- `AGENTS.md`
- `docs/`
- `src/`
- `tests/`

### Q: 如何自定义 Agent 行为？

A: 两种方式：

1. **修改行为规范** - 编辑 `.amazing-team/agents/{role}.md`
   - 添加项目特定的职责
   - 修改输出格式
   - 调整工作流程

2. **修改入口权限** - 编辑 `.opencode/agents/{role}.md`
   - 调整工具权限
   - 添加/删除允许的 bash 命令

示例：让 Developer 可以运行数据库迁移
```yaml
# .opencode/agents/developer.md
permission:
  bash:
    "npm run db:migrate": allow
```

### Q: 如何回滚升级？

A: 升级时会自动创建备份目录 `.amazing-team-backup-{timestamp}`，可以手动恢复。

### Q: 支持 GitHub 以外的平台吗？

A: 目前主要支持 GitHub。GitLab 支持计划中。

### Q: v1 升级到 v2 需要做什么？

A: v2 新增了：
- Planner 角色（任务分解、GitHub Issue编排）
- Triage 角色（Issue分类）
- CI Analyst 角色（CI失败分析）
- GitHub Issue 子任务编排
- 任务系统

运行 `amazingteam upgrade` 会自动添加新组件。

### Q: 大任务什么时候需要分解？

A: 以下情况建议分解：
- 涉及多个模块
- 需要先设计再实现
- 影响公共接口/API
- 可能需要多个 PR
- 有明显的依赖步骤

以下情况无需分解：
- 单模块、单 PR 足够
- 范围清晰、验证简单

## 贡献

欢迎提交 Issue 和 Pull Request！

## 版本历史

### v3.0.22 - 文档更新

**改进：**
- 更新 README.md 文档，添加自动分解工作流使用说明
- 添加触发命令表格和提交模式配置说明
- 修复 workflow 中的 action 版本引用

---

### v3.0.21 - 自动分解工作流

**新增：**
- **GitHub Actions 自动分解工作流**：`amazingteam-auto.yml`
  - Triage 阶段：AI 分析任务复杂度
  - Decompose 阶段：复杂任务自动创建 GitHub sub-issues
  - Execute 阶段：逐个执行 subtask，自动触发下一个
  - 自动关闭父 issue 当所有 subtask 完成
- **Direct 模式支持**：`commit_mode: direct`
  - 执行完成后立即触发下一个 subtask
  - 无需等待 PR merge
  - 适合个人项目和快速迭代
- **详细日志**：每个阶段都有清晰的状态输出
- **E2E 测试系统**：真实的 Agent API 连接测试

**触发命令：**
- `/ai`, `/oc`, `/opencode` - 触发自动工作流
- `ai:process` label - 给 Issue 添加标签触发

---

### v3.0.4 - 安装文档完善

**修复：**
- 添加 `node_modules/` 到 gitignore 模板
- init 命令提示用户运行 `npm install amazingteam --save-dev`

### v3.0.3 - 关键修复

**修复：**
- 添加 `dist/` 到 package.json files（修复 npm 包无法运行的问题）

### v3.0.2 - Workflow 配置

**新增：**
- `workflow.commit_mode`: 支持 `pr`（默认）和 `direct` 两种提交模式
- `workflow.pr.*`: PR 模式配置（auto_merge, require_review, reviewers）
- `workflow.direct.*`: 直接提交模式配置（require_ci_pass）
- 交互式 workflow 配置提示

### v3.0.1 - 自定义 LLM Provider

**新增：**
- 自定义 LLM Provider 支持（OpenAI, Anthropic, Bailian, DeepSeek, Moonshot, Zhipu）
- `llm.base_url`: 自定义 API 端点
- `llm.api_key_env`: 环境变量 API Key 管理
- 交互式 LLM 配置提示

**重命名：**
- 包名：`amazing-team-foundation` → `amazingteam`
- CLI：`amazing-team` → `amazingteam`
- 配置文件：`amazing-team.config.yaml` → `amazingteam.config.yaml`

### v3.0.0 - 远程加载

**新增：**
- 远程加载：Foundation 作为 NPM 包/GitHub Release 加载，无需提交到项目
- GitHub Action：自动下载和配置 Foundation
- CLI 工具：init, version, upgrade, local, validate, migrate, status
- 配置预设：TypeScript、Python、Go 等语言预设
- JSON Schema：配置文件校验
- 完整测试套件

**用户项目变化：**
- 从 50+ 文件减少到 3-5 个配置文件
- Foundation 通过 workflow 引用，不占用项目空间
- 升级只需改版本号或运行命令

**迁移指南：** 见 [docs/migration-to-v3.md](./docs/migration-to-v3.md)

### v2.2.0 - 阻塞处理机制

**新增：**
- 阻塞处理流程：工作流遇到问题时自动诊断和处理
- `/resume` 命令：阻塞解决后恢复工作流
- CI Analyst 角色增强：阻塞诊断和分类
- 自动修复：简单问题现场修复
- Sub-issue 阻塞处理：复杂问题创建子 Issue 解决
- 人工通知：需要人类介入时自动通知

**阻塞处理流程：**

```
工作流执行中 → 遇到问题 → CI Analyst 诊断
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
          简单问题       中等复杂度       需要人类
              │               │               │
              ↓               ↓               ↓
          自动修复      创建子Issue      创建子Issue
              │          AI解决          通知人类
              │               │          等待/resume
              └───────────────┴───────────────┘
                              │
                              ↓
                      恢复原工作流
```

**阻塞分类决策：**

| 因素 | 低 | 中 | 高 |
|------|----|----|-----|
| 复杂度 | 自动修复 | Sub-issue (AI) | 通知人类 |
| 风险 | 自动修复 | Sub-issue (AI) | 通知人类 |
| 权限 | Sub-issue (AI) | 通知人类 | 通知人类 |

### v2.1.0 - 全自动工作流

**新增：**
- `/auto` 命令：一条命令完成 Triage → Design → Implement → Test → Create PR 全流程
- 自动 GitHub Sub-issue 创建：复杂任务自动分解为子 Issue
- 依赖调度：自动处理子任务依赖关系，按序执行
- Git 身份配置：`opencode-bot` 作为自动化提交的默认身份

**改进：**
- 工作流优化：Planner 作为协调者调度各角色，而非自己执行
- 无需人工确认：Triage 后自动执行，无需用户确认
- GitHub Actions 权限：增加 `contents: write`、`pull-requests: write` 支持 PR 创建
- 开发者角色：明确 PR 创建规则，禁止直接提交到 main

**工作流程：**

```
/oc /auto
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  Triage → (Decompose?) → Design → Implement → Test → PR │
└─────────────────────────────────────────────────────────┘
    │
    ▼
Human Review & Merge
```

**依赖处理：**

```
Parent Issue #120
    ├── Sub-issue #201 (architect) → PR merged
    │       ↓
    ├── Sub-issue #202 (developer) → wait for #201
    │       ↓
    └── Sub-issue #203 (qa) → wait for #202
```

### v2.0.0 - GitHub Issue 编排

**新增：**
- Planner 角色增强：支持 GitHub Issue 分解和编排
- `/breakdown-issue` 命令：分解大任务为子 Issue
- `/dispatch-next` 命令：派发下一个子任务
- `/show-blockers` 命令：显示阻塞任务
- `/summarize-parent` 命令：汇总父任务进度
- `/close-parent-task` 命令：验证并关闭父任务
- task.yaml 增强：支持 `github_issue`、`parent_task`、`subtasks` 字段
- Agent 文件结构优化：分离入口文件和行为规范

**改进：**
- Triage 命令增强：增加分解决策
- 工作流程更新：大任务分解后再派发
- 升级流程优化：保护自定义行为

## License

MIT