# AI Team Template 使用指南

## 模板仓库 vs 项目仓库

本仓库是 **模板仓库** (Template Repository)，提供可复用的 AI Team 定义。使用时有两种场景：

### 场景 1: 模板仓库自身（演示/测试）

模板仓库可以运行 AI 来：
- 演示完整工作流
- 测试新功能
- 迭代改进模板

**这是可选的**，模板仓库不需要配置 GitHub Secrets 也能作为模板使用。

### 场景 2: 项目仓库（生产使用）

用户复制模板后，在**自己的项目仓库**中运行 AI Team。

**重要**: 项目仓库应该有自己的配置，不依赖模板仓库。

---

## 初始化新项目

### 步骤 1: 使用模板创建仓库

```bash
# 方式 A: GitHub "Use this template" 按钮
# 方式 B: 克隆后删除模板配置
git clone https://github.com/your-org/amazing-team-template.git my-project
cd my-project
rm -rf .git && git init
```

### 步骤 2: 运行初始化

```bash
node cli/amazing-team.cjs init --force
```

这会：
- 创建 `amazing-team.config.yaml` (项目配置)
- 更新 `AGENTS.md` (项目规则)
- 创建目录结构

### 步骤 3: 配置 GitHub Secrets

在你的项目仓库 Settings → Secrets 添加：

| Secret | 说明 |
|--------|------|
| `AMAZINGTEAM_API_KEY` | OpenCode API Key |
| `GITHUB_TOKEN` | 自动提供，无需配置 |

### 步骤 4: 开始使用

创建 Issue，评论：
```
/opencode use architect to analyze this issue
```

---

## 配置文件说明

### 模板仓库配置 (只读)

| 文件 | 用途 | 用户是否修改 |
|------|------|-------------|
| `.amazing-team/agents/*.md` | Agent 定义 | ❌ 不建议 |
| `.amazing-team/skills/*/skill.md` | Skill 定义 | ❌ 不建议 |
| `.amazing-team/commands/*.md` | Command 定义 | ❌ 不建议 |
| `.amazing-team/memory/*/` | Memory 模板 | ❌ 不建议 |
| `.amazing-team/opencode.template.jsonc` | 配置模板 | ❌ 不建议 |

### 项目仓库配置 (可自定义)

| 文件 | 用途 | 用户是否修改 |
|------|------|-------------|
| `opencode.jsonc` | 运行时配置 | ✅ 应该 |
| `amazing-team.config.yaml` | 项目配置 | ✅ 应该 |
| `AGENTS.md` | 全局规则 | ✅ 应该 |
| `docs/` | 项目文档 | ✅ 应该 |
| `tasks/` | 任务记忆 | ✅ 自动创建 |

---

## opencode.jsonc vs opencode.template.jsonc

### opencode.template.jsonc (模板)

- 定义了完整的 Agent/Skill/Command 配置
- 包含模板变量 `{{PROJECT_NAME}}` 等
- **不应该直接使用**

### opencode.jsonc (运行时)

- 从模板生成或手动创建
- 替换了模板变量
- **实际运行使用的配置**

### 初始化时的处理

```bash
# 初始化时会：
# 1. 读取 opencode.template.jsonc
# 2. 替换模板变量
# 3. 生成 opencode.jsonc (如果不存在)
```

---

## 升级模板

当模板仓库有更新时：

```bash
# 在你的项目仓库中
amazing-team upgrade

# 或强制升级
amazing-team upgrade --force
```

**升级只覆盖**:
- `.amazing-team/agents/`
- `.amazing-team/skills/`
- `.amazing-team/commands/`
- `.github/workflows/` (可选)

**升级不会覆盖**:
- `opencode.jsonc`
- `amazing-team.config.yaml`
- `AGENTS.md`
- `docs/`
- `tasks/`

---

## 常见问题

### Q: 模板仓库的自举能力会影响我的项目吗？

A: 不会。模板仓库和你的项目仓库是独立的。你需要在**自己的仓库**中配置 Secrets 才能运行 AI。

### Q: 我可以修改 Agent/Skill 定义吗？

A: 可以，但建议通过自定义 Agent 而不是修改模板文件：

```yaml
# amazing-team.config.yaml
ai_team:
  custom_agents:
    - name: my-custom-agent
      enabled: true
```

### Q: 模板仓库更新后，我的项目会自动更新吗？

A: 不会。需要手动运行 `amazing-team upgrade` 来同步更新。

### Q: 我不想用某些 Agent，可以禁用吗？

A: 可以：

```yaml
# amazing-team.config.yaml
ai_team:
  agents:
    planner: true
    architect: true
    developer: true
    qa: true
    reviewer: true
    triage: false      # 禁用
    ci_analyst: false  # 禁用
```