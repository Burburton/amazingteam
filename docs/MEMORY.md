# 双重记忆系统架构

本项目使用 **双重记忆架构**，结合了结构化记忆和语义记忆的各自优势。

## 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                    双重记忆系统                                  │
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │  结构化记忆层        │      │  语义记忆层 (opencode-mem)   │  │
│  │  (文件系统)          │      │  (向量数据库)                 │  │
│  ├─────────────────────┤      ├─────────────────────────────┤  │
│  │ • tasks/            │      │ • 自动上下文提取             │  │
│  │ • docs/architecture/│      │ • 语义搜索                   │  │
│  │ • .amazing-team/    │      │ • 用户画像学习               │  │
│  │ • AGENTS.md         │      │ • 跨项目记忆共享             │  │
│  └─────────────────────┘      └─────────────────────────────┘  │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          │                                      │
│                    ┌─────┴─────┐                                │
│                    │  AI Agent │                                │
│                    └───────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 结构化记忆层 (AmazingTeam)

**特点**：显式、结构化、人工维护

### 用途
- **任务跟踪** (`tasks/`): 具体的开发任务和状态
- **架构文档** (`docs/architecture/`): 系统设计决策
- **角色定义** (`.amazing-team/agents/`): AI 角色行为规范
- **全局规则** (`AGENTS.md`): 项目级约束和约定

### 何时使用
- ✅ 需要精确记录的任务状态
- ✅ 架构决策和原因
- ✅ 团队共享的规范和约定
- ✅ 需要版本控制的文档

### 访问方式
- 文件系统直接访问
- Git 版本控制
- 人工可阅读和编辑

## 🧠 语义记忆层 (opencode-mem)

**特点**：自动、语义化、智能检索

### 用途
- **上下文记忆**: 自动记录对话中的重要信息
- **用户画像**: 学习你的编码偏好和习惯
- **语义搜索**: 通过语义相似度检索过往经验
- **跨项目共享**: 个人偏好跨项目生效

### 何时使用
- ✅ 自动捕获的编码偏好
- ✅ 通过语义搜索过往经验
- ✅ 跨会话的上下文连续性
- ✅ 快速召回相关信息

### 访问方式
```typescript
// 添加记忆
memory({ 
  mode: "add", 
  content: "项目使用 TypeScript + React 技术栈" 
});

// 搜索记忆
memory({ 
  mode: "search", 
  query: "技术栈选择" 
});

// 查看用户画像
memory({ mode: "profile" });
```

### Web UI
访问 http://127.0.0.1:4747 可视化浏览和管理记忆。

## 🔄 两层记忆的协作

### 场景 1：新项目初始化
```
用户: "我想做一个电商后台管理系统"

语义记忆层:
→ 自动提取: 用户偏好 React + TypeScript
→ 自动提取: 用户习惯使用 Ant Design

结构化记忆层:
→ 创建 tasks/issue-001/task.yaml
→ 记录需求文档到 .opencode/requirements/

AI 结合两层记忆:
→ "根据你之前的偏好，我建议使用 React + TypeScript + Ant Design"
→ 同时遵循项目的结构化任务流程
```

### 场景 2：日常开发
```
用户: "帮我修复这个 bug"

语义记忆层:
→ 搜索: "类似 bug 修复经验"
→ 回忆: "用户习惯先写测试"

结构化记忆层:
→ 读取: .amazing-team/memory/developer/bug_investigation.md
→ 遵循: AGENTS.md 中的调试流程

AI 结合两层记忆:
→ 按照项目规范执行调试流程
→ 同时参考个人习惯先写测试
```

### 场景 3：架构决策
```
用户: "我们应该用微服务还是单体架构？"

结构化记忆层:
→ 查询: docs/architecture/ 中的现有决策
→ 遵循: AGENTS.md 中的架构评审流程

语义记忆层:
→ 搜索: "微服务经验教训"
→ 回忆: "用户倾向于简单方案"

AI 结合两层记忆:
→ 基于项目架构文档给出分析
→ 结合过往经验给出倾向性建议
```

## 📊 对比与选择

| 场景 | 推荐记忆层 | 原因 |
|------|-----------|------|
| 任务状态跟踪 | 结构化 | 精确、可控、可审计 |
| 架构文档 | 结构化 | 需要版本控制和团队共享 |
| 编码偏好 | 语义 | 自动学习、跨项目生效 |
| 快速经验召回 | 语义 | 语义搜索更自然 |
| 项目特定规范 | 结构化 | 与项目绑定 |
| 跨项目知识 | 语义 | 个人知识库 |

## 🛠️ 配置

### 安装 opencode-mem 配置

项目已提供配置模板，需要手动复制到全局配置目录：

**macOS/Linux:**
```bash
mkdir -p ~/.config/opencode
cp .opencode/opencode-mem.jsonc ~/.config/opencode/
```

**Windows:**
```powershell
# 创建目录
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode"
# 复制配置文件
Copy-Item ".opencode\opencode-mem.jsonc" "$env:APPDATA\opencode\"
```

### 全局配置说明
配置文件位置: `~/.config/opencode/opencode-mem.jsonc` (macOS/Linux) 或 `%APPDATA%\opencode\opencode-mem.jsonc` (Windows)

```jsonc
{
  // 数据存储位置
  "storagePath": "~/.opencode-mem/data",
  
  // 嵌入模型（用于语义搜索）
  "embeddingModel": "Xenova/nomic-embed-text-v1",
  
  // 启用 Web UI 管理界面 http://127.0.0.1:4747
  "webServerEnabled": true,
  
  // 最大记忆条数
  "maxMemories": 1000,
  
  // 记忆压缩设置
  "compaction": {
    "enabled": true,
    "memoryLimit": 100
  },
  
  // 自动从对话提取记忆
  "chatMessage": {
    "enabled": true,
    "maxMemories": 5,
    "excludeCurrentSession": true,
    "injectOn": "first"
  },
  
  // 用户画像分析间隔（消息数）
  "userProfileAnalysisInterval": 10,
  
  // 最大画像项目数
  "maxProfileItems": 20
}
```

### 项目级配置
已集成到 `opencode.jsonc`:
```json
{
  "plugin": [
    "superpowers@git+https://github.com/obra/superpowers.git",
    "opencode-mem"
  ]
}
```

重启 OpenCode 后插件自动下载并生效。

## 💡 最佳实践

### DO
- ✅ 使用结构化记忆记录**关键决策**和**任务状态**
- ✅ 让语义记忆自动学习你的**偏好**和**习惯**
- ✅ 定期使用 Web UI 清理过期的语义记忆
- ✅ 在 AGENTS.md 中引用重要的架构决策

### DON'T
- ❌ 不要手动维护所有细节到结构化记忆中
- ❌ 不要把临时信息存入结构化记忆
- ❌ 不要依赖语义记忆做精确的状态跟踪
- ❌ 不要在 `.amazing-team/memory/` 中记录个人偏好

## 🔮 未来演进

随着使用时间的增加，我们期望：

1. **语义记忆增强**: AI 更了解你的编码风格
2. **智能推荐**: 自动推荐过往类似问题的解决方案
3. **混合检索**: 同时查询两层记忆，智能合并结果
4. **知识沉淀**: 重要的语义记忆可手动提升为结构化文档

---

**总结**: 结构化记忆确保项目可控，语义记忆提升个人效率。两者结合，实现既规范又智能的开发体验。
