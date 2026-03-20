---
name: requirements-discussion
description: Use when starting a new feature or project to systematically capture user requirements through Socratic questioning. Creates a requirements document that can be used for design and implementation planning.
trigger: user says "对需求", "讨论需求", "requirements", or starts describing a new feature/project
---

# Requirements Discussion Skill

## Purpose

This skill helps systematically capture user requirements through structured questioning and dialogue. It ensures:
- Complete understanding of the problem space
- Clear definition of scope and constraints  
- Explicit acceptance criteria
- Alignment between user expectations and implementation

## When to Use

- Starting a new feature development
- Beginning a new project
- When requirements are unclear or ambiguous
- Before design phase to ensure completeness

## Process

### Phase 1: Context Gathering

Ask clarifying questions to understand:
1. **What** - What is the core functionality needed?
2. **Why** - What problem does this solve? Who benefits?
3. **Who** - Who are the users? What are their personas?
4. **When** - Are there time constraints or deadlines?
5. **Where** - What platforms/environments? (web, mobile, desktop)

### Phase 2: Functional Requirements

Explore functional aspects:
- Core features and capabilities
- User interactions and workflows
- Data inputs and outputs
- Integration points with existing systems
- API requirements (if applicable)

### Phase 3: Non-Functional Requirements

Discuss quality attributes:
- Performance expectations (response time, throughput)
- Scalability needs
- Security requirements
- Reliability/availability targets
- Compliance or regulatory needs

### Phase 4: Constraints and Assumptions

Identify limitations:
- Technical constraints (tech stack, legacy systems)
- Business constraints (budget, timeline, resources)
- Dependencies on other teams or systems
- Assumptions being made

### Phase 5: Acceptance Criteria

Define "done":
- Specific, measurable criteria for success
- Test scenarios that must pass
- User validation steps

## Output

Create a requirements document at `.opencode/requirements/{feature-name}.md`:

```markdown
# Requirements: {Feature Name}

**Date**: {YYYY-MM-DD}
**Status**: Draft → Approved

## 1. Overview

### Problem Statement
{Clear description of the problem being solved}

### Target Users
{User personas and their needs}

### Success Metrics
{How will we measure success?}

## 2. Functional Requirements

### Must Have (P0)
- [ ] {Critical requirement 1}
- [ ] {Critical requirement 2}

### Should Have (P1)
- [ ] {Important requirement 1}
- [ ] {Important requirement 2}

### Nice to Have (P2)
- [ ] {Desirable requirement 1}

## 3. User Stories

### Story 1: {Title}
**As a** {user type}
**I want to** {action}
**So that** {benefit}

**Acceptance Criteria:**
- {Criterion 1}
- {Criterion 2}

## 4. Non-Functional Requirements

### Performance
- {Performance requirement 1}

### Security
- {Security requirement 1}

### Reliability
- {Reliability requirement 1}

## 5. Constraints

### Technical
- {Technical constraint 1}

### Business
- {Business constraint 1}

## 6. Out of Scope

Explicitly NOT included:
- {Out of scope item 1}
- {Out of scope item 2}

## 7. Open Questions

- [ ] {Question 1}
- [ ] {Question 2}

## 8. Approval

- [ ] Requirements reviewed with user
- [ ] Acceptance criteria agreed upon
- [ ] Ready for design phase
```

## Interaction Guidelines

### DO
- Ask open-ended questions to explore the problem space
- Paraphrase requirements back to ensure understanding
- Challenge assumptions gently to uncover hidden requirements
- Prioritize requirements with the user (MoSCoW method)
- Document decisions and rationale

### DON'T
- Jump to solution/implementation details
- Make assumptions without validating
- Accept vague requirements without clarification
- Skip non-functional requirements
- Rush through the process

## Example Dialogue Flow

```
User: "我想做一个用户管理系统"

AI: "好的，让我来帮你梳理一下需求。首先，这个系统的核心目标是什么？
    是解决现有系统的什么问题，还是全新的业务需求？"

User: "我们需要管理内部员工账号"

AI: "明白了，内部员工账号管理。接下来我想了解几个维度：
    
    1. **用户规模**：大概有多少员工需要使用这个系统？
    2. **核心功能**：除了基本的增删改查，还需要哪些功能？
       比如：权限管理？部门架构？密码重置？
    3. **集成需求**：需要对接现有系统吗？比如 LDAP、企业微信、钉钉？
    4. **安全要求**：有什么特殊的合规或安全要求吗？"

[Continue questioning until requirements are complete...]

AI: "好的，根据我们的讨论，我整理了以下需求文档。请看一下是否准确：
    
    [Present structured requirements]
    
    有什么需要调整或补充的吗？"
```

## Integration with Superpowers

After requirements are captured and approved:
1. **brainstorming** skill can be triggered for design exploration
2. **writing-plans** skill creates implementation tasks
3. Requirements document serves as reference throughout development
