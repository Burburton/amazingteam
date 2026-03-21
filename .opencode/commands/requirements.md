---
description: Start requirements discussion to systematically capture user needs
---

# Requirements Discussion

Use this command to start a structured requirements gathering process.

## What This Does

1. **Gathers context** through Socratic questioning
2. **Captures functional and non-functional requirements**
3. **Defines acceptance criteria**
4. **Creates a requirements document** at `.opencode/requirements/{feature-name}.md`

## Usage

Say: `对需求` or describe what you want to build.

## Process

The AI will guide you through:

1. **Context Gathering** - What, Why, Who, When, Where
2. **Functional Requirements** - Core features, user workflows
3. **Non-Functional Requirements** - Performance, security, scalability
4. **Constraints** - Technical, business, dependencies
5. **Acceptance Criteria** - How to measure success

## Example

```
User: 对需求，我想做一个用户管理系统

AI: 好的，让我来帮你梳理一下需求。首先，这个系统的核心目标是什么？
    是解决现有系统的什么问题，还是全新的业务需求？
    
    1. 用户规模：大概有多少用户？
    2. 核心功能：增删改查之外，还需要什么？
    3. 集成需求：需要对接现有系统吗？
    4. 安全要求：有什么合规要求？
```

---

**Now loading the requirements-discussion skill...**

@skill requirements-discussion