# AGENTS.md - Global Rules for AI Agents

This file defines the global rules and guidelines that all AI agents must follow when working on this project.

## Project Overview

This is an AI-powered autonomous development team project that uses OpenCode, GitHub, and GitHub Actions to enable semi-autonomous software development.

## Coding Standards

### General Principles

1. **Clean Code**
   - Write readable, self-documenting code
   - Use meaningful names for variables, functions, and classes
   - Keep functions small and focused (max 30 lines preferred)
   - Avoid deep nesting (max 3 levels)

2. **DRY (Don't Repeat Yourself)**
   - Extract common logic into reusable functions
   - Avoid code duplication
   - Use composition over inheritance

3. **SOLID Principles**
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

### TypeScript/JavaScript Standards

```typescript
// Use explicit types for function parameters and return values
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Prefer interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use const assertions for literal types
const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];

// Prefer async/await over .then()
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|----------|
| Variables | camelCase | `userName` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Functions | camelCase | `getUserById` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `IUserRepository` |
| Types | PascalCase | `UserRole` |
| Files | kebab-case | `user-service.ts` |
| Directories | kebab-case | `user-management/` |

### File Organization

```
src/
├── modules/           # Feature modules
│   └── user/
│       ├── index.ts           # Public API
│       ├── user.service.ts    # Business logic
│       ├── user.repository.ts # Data access
│       ├── user.types.ts      # Types/interfaces
│       └── __tests__/         # Tests
├── shared/            # Shared utilities
│   ├── utils/
│   ├── types/
│   └── constants/
├── config/            # Configuration
└── index.ts           # Entry point
```

## Testing Strategy

### Test Requirements

1. **Unit Tests**
   - Required for all business logic
   - Minimum 80% code coverage
   - Test edge cases and error scenarios

2. **Integration Tests**
   - Required for API endpoints
   - Required for database interactions
   - Test happy paths and error cases

3. **Test Naming**
   ```typescript
   describe('UserService', () => {
     describe('createUser', () => {
       it('should create a user with valid data', () => {});
       it('should throw error when email is invalid', () => {});
       it('should throw error when user already exists', () => {});
     });
   });
   ```

### Test Structure (AAA Pattern)

```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
```

## Git Workflow

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/issue-123-description` | `feat/issue-123-user-auth` |
| Bug Fix | `fix/issue-456-description` | `fix/issue-456-login-timeout` |
| Refactor | `refactor/description` | `refactor/user-service` |
| Tech Task | `tech/description` | `tech/update-dependencies` |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `style`: Code style changes
- `perf`: Performance improvements

**Examples:**
```
feat(auth): add JWT token refresh mechanism

- Implement token refresh endpoint
- Add automatic token refresh in interceptor
- Update auth service to handle expired tokens

Closes #123
```

### Pull Request Guidelines

1. **Title**: Use conventional commit format
2. **Description**: Use the PR template
3. **Size**: Keep PRs under 500 lines of changes
4. **Reviews**: Require at least one approval
5. **CI**: All checks must pass

## Dependency Rules

### Adding Dependencies

1. Check if existing dependency can be used
2. Evaluate package health (stars, issues, updates)
3. Check bundle size impact
4. Document the reason in PR

### Forbidden Patterns

- Don't use `any` type without justification
- Don't disable ESLint rules inline
- Don't skip tests with `.skip`
- Don't use `console.log` in production code
- Don't commit sensitive data

## Security Guidelines

1. **Input Validation**
   - Validate all user inputs
   - Sanitize data before display
   - Use parameterized queries

2. **Authentication/Authorization**
   - Never store passwords in plain text
   - Use secure session management
   - Implement proper access control

3. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS for all communications
   - Don't expose internal errors to users

## Performance Guidelines

1. **Database**
   - Use indexes appropriately
   - Avoid N+1 queries
   - Implement pagination

2. **API**
   - Implement rate limiting
   - Use caching where appropriate
   - Compress responses

3. **Frontend**
   - Lazy load components
   - Optimize images
   - Minimize bundle size

## Documentation Standards

### Code Comments

```typescript
/**
 * Calculates the total price of items in a cart.
 * 
 * @param items - Array of cart items
 * @param options - Calculation options
 * @returns The total price including tax and discounts
 * 
 * @example
 * const total = calculateTotal(items, { includeTax: true });
 */
function calculateTotal(items: CartItem[], options?: CalcOptions): number {
  // Implementation
}
```

### README Structure

1. Project description
2. Installation instructions
3. Usage examples
4. Configuration options
5. Contributing guidelines
6. License

## Error Handling

```typescript
// Use custom error classes
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Handle errors appropriately
try {
  await processOrder(order);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof DatabaseError) {
    // Handle database errors
  } else {
    // Handle unexpected errors
    logger.error('Unexpected error', { error });
    throw new InternalServerError('An unexpected error occurred');
  }
}
```

## Logging Standards

```typescript
// Use structured logging
logger.info('User logged in', {
  userId: user.id,
  timestamp: new Date().toISOString(),
  ip: request.ip
});

// Log levels
// - error: Application errors
// - warn: Warning conditions
// - info: Informational events
// - debug: Debug information
```

## Agent-Specific Rules

### For Planner Agent (v2)

**Core Principle:** Large issues should be decomposed into explicit GitHub subtasks before broad implementation begins.

**Decomposition Responsibilities:**
- Determine whether a task requires decomposition
- Create child GitHub issues with narrow scope
- Define acceptance criteria per subtask
- Define dependency order between subtasks
- Assign recommended owner role for each subtask
- Record parent/child relationships explicitly

**Dispatch Responsibilities:**
- Dispatch one subtask at a time (not all at once)
- Identify the next active subtask
- Determine the correct role to dispatch to
- Check dependency satisfaction before dispatch
- Detect and record blocked states

**What Planner Does NOT Do:**
- Direct code implementation
- Deep architecture design details (Architect's role)
- Final code review (Reviewer's role)
- CI debugging (CI Analyst's role)
- Replace specialist role reasoning

**Decomposition Decision Guide:**

| Condition | Decompose? |
|-----------|------------|
| Touches multiple modules | Yes |
| Requires design before implementation | Yes |
| Impacts public interfaces/APIs | Yes |
| Likely needs multiple PRs | Yes |
| Contains several distinct steps | Yes |
| Single module, one PR sufficient | No |
| Simple validation, clear scope | No |

**GitHub Issue Mapping:**
- Parent Issue = Overall work item with acceptance criteria
- Child Issues = Subtasks with narrow scope
- Dependencies = Explicit ordering between subtasks
- One PR per subtask is preferred

**Commands:**
- `/breakdown-issue` - Decompose into sub-issues
- `/dispatch-next` - Identify next active subtask
- `/show-blockers` - List blocked items
- `/close-parent-task` - Verify completion
- `/summarize-parent` - Progress summary

### For Architect Agent
- Never modify code directly
- Always provide implementation plans
- Consider scalability and maintainability
- Document architectural decisions

### For Developer Agent
- Make minimal changes
- Always add tests for bug fixes
- Follow existing patterns
- Update documentation

### For QA Agent
- Focus on quality, not implementation
- Add missing tests
- Document test cases
- Verify acceptance criteria

### For Reviewer Agent
- Be constructive
- Focus on important issues
- Provide code examples
- Consider long-term maintainability

### For Triage Agent (v2)
- Classify issues by type and priority
- Perform initial root cause analysis
- Route issues to appropriate roles
- Update classification heuristics

### For CI Analyst Agent (v2)
- Investigate CI failures systematically
- Document failure patterns
- Update failure library with new patterns
- Maintain CI runbook references

## Workflow Automation

### Issue Processing Lifecycle

The complete issue-to-merge lifecycle follows this flow:

```
Issue Created → Planner (Coordinator)
                    │
                    ├── Dispatch → Triage (Classify)
                    ├── Dispatch → Architect (Design)
                    ├── Dispatch → Developer (Implement)
                    ├── Dispatch → QA (Validate)
                    └── Dispatch → Developer (Create PR)
                                              │
                                              └── STOP: wait for human to review and merge
```

### Role Dispatch Model

**Planner is the coordinator** - it dispatches work to appropriate roles:

| Phase | Role | Responsibility |
|-------|------|----------------|
| Triage | Triage agent | Classify issue, determine decomposition |
| Design | Architect agent | Create implementation plan |
| Implementation | Developer agent | Write code, tests |
| Validation | QA agent | Run tests, verify criteria |
| PR Creation | Developer agent | Submit PR for review |

### Automated Workflow Steps

1. **Triage** (Dispatch to Triage agent)
   - Classify issue type (feature/bug/tech-task)
   - Determine if decomposition is needed
   - Return classification to Planner

2. **Design** (Dispatch to Architect agent)
   - Architect analyzes requirements
   - Creates implementation plan
   - Identifies affected modules

3. **Implementation** (Dispatch to Developer agent)
   - Developer creates feature branch
   - Implements changes incrementally
   - Writes/updates tests
   - Runs linters and type checks

4. **Validation** (Dispatch to QA agent)
   - QA validates functionality
   - Runs test suite
   - Checks acceptance criteria

5. **PR Creation** (Dispatch to Developer agent)
   - Create Pull Request with description
   - Link to original issue
   - **STOP** - wait for human review and merge

6. **Human Review & Merge**
   - Human reviews PR
   - Human approves and merges
   - AI does NOT merge

### Critical Rules

| Rule | Description |
|------|-------------|
| **No Direct Commits to Main** | All changes MUST go through a Pull Request |
| **Planner Coordinates** | Planner dispatches to roles, does not implement itself |
| **Human Merge Gate** | AI creates PR but does NOT merge; humans merge |
| **PR Required for All Changes** | Even small fixes need a PR for traceability |

### Command Triggers

| Command | Agent | Action |
|---------|-------|--------|
| `/auto` | Planner | **Coordinator**: Dispatch Triage → Design → Implement → Test → Create PR |
| `/triage` | Triage | Classify, determine decomposition need |
| `/breakdown-issue` | Planner | Decompose into GitHub sub-issues |
| `/dispatch-next` | Planner | Identify and dispatch next subtask |
| `/show-blockers` | Planner | List blocked subtasks |
| `/summarize-parent` | Planner | Summarize parent issue progress |
| `/close-parent-task` | Planner | Verify and close parent issue |
| `/design` | Architect | Analyze and design |
| `/implement` | Developer | Implement changes |
| `/test` | QA | Run tests and validate |
| `/review` | Reviewer | Review code |
| `/ci-analyze` | CI Analyst | Analyze CI failures |
| `/release-check` | Reviewer | Validate release readiness |

### Git Identity for Automated Commits

Default identity used when AI creates commits:
- **Username**: `opencode-bot`
- **Email**: `opencode-bot@users.noreply.github.com`

## Safety Constraints

1. **No Direct Commits to Main**
   - All changes MUST go through a Pull Request
   - Create a branch, make changes, create PR
   - Wait for human review and approval
   - AI does NOT merge PRs - humans merge

2. **No Destructive Operations**
   - Don't delete files without confirmation
   - Don't drop database tables
   - Don't remove critical configuration

3. **Minimal Changes**
   - Only change what's necessary
   - Don't refactor unrelated code
   - Keep PRs focused

4. **Human Approval Required**
   - All merges require human approval
   - Breaking changes need explicit sign-off
   - Security changes need review

5. **Rollback Ready**
   - All changes must be reversible
   - Document rollback procedures
   - Keep migration scripts

## Memory System

This project uses a **layered memory architecture** to prevent role contamination while preserving useful shared context.

### Memory Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     ROLE MEMORY                                  │
│  Location: .ai-team/memory/{role}/                              │
│  Access: Read/Write for owning role, Read for others            │
│  Update: Automatic by role agent                                │
│  Content: Role-specific knowledge, patterns, observations       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ROLE MEMORY                                  │
│  Location: .opencode/memory/{role}/                             │
│  Access: Read/Write for owning role, Read for others            │
│  Update: Automatic by role agent                                │
│  Content: Role-specific knowledge, patterns, observations       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TASK MEMORY                                  │
│  Location: tasks/issue-{id}/                                    │
│  Access: Current task only                                      │
│  Update: During task execution                                  │
│  Content: Task-specific notes, decisions, outcomes              │
└─────────────────────────────────────────────────────────────────┘
```

### Memory Permissions Matrix

| Role | Global Memory | Planner Memory | Architect Memory | Developer Memory | QA Memory | Reviewer Memory | Triage Memory | CI Analyst Memory | Failures Memory | Task Memory |
|------|---------------|----------------|------------------|------------------|-----------|-----------------|---------------|-------------------|-----------------|-------------|
| Planner | Read | Read/Write | Read | Read | Read | Read | Read | Read | Read | Read/Write |
| Architect | Read | Read | Read/Write | Read | - | - | - | - | Read | Read/Write |
| Developer | Read | Read | Read | Read/Write | - | - | - | - | Read | Read/Write |
| QA | Read | Read | Read | - | Read/Write | - | - | - | Read | Read/Write |
| Reviewer | Read | Read | Read | Read | Read | Read/Write | - | - | Read | Read/Write |
| Triage | Read | - | - | - | - | - | Read/Write | - | Read | Read/Write |
| CI Analyst | Read | - | - | - | - | - | - | Read/Write | Read/Write | Read/Write |

**Notes:**
- "-" means no access (neither read nor write)
- "Read" means read-only access
- "Read/Write" means full access
- Planner can read all role memories for coordination purposes
- All roles can read Global Memory (docs/, AGENTS.md)
- All roles can read Failures Memory for learning from past issues

### Memory Update Rules

1. **Global Memory**
   - NEVER automatically write to global memory
   - Updates require explicit human approval
   - Changes to `docs/decisions/` must be reviewed

2. **Role Memory**
   - Each role may update its own memory
   - Updates should be meaningful and lasting
   - Avoid temporary information in role memory

3. **Task Memory**
   - Created automatically when work begins
   - Updated during task execution
   - Preserved after completion for traceability

### Memory Directory Structure

```
.ai-team/memory/
├── planner/
│   ├── decomposition_notes.md  # Task decomposition patterns
│   ├── flow_rules.md           # Workflow state machine rules
│   └── github_issue_patterns.md # GitHub issue orchestration patterns
│
├── architect/
│   ├── architecture_notes.md   # Architecture decisions
│   ├── module_map.md           # Module relationships
│   └── design_rationale.md     # Design reasoning
│
├── developer/
│   ├── implementation_notes.md # Implementation patterns
│   ├── bug_investigation.md    # Bug investigation log
│   └── build_issues.md         # Build/toolchain notes
│
├── qa/
│   ├── test_strategy.md        # Testing approach
│   ├── regression_cases.md     # Regression tests
│   └── validation_notes.md     # Validation records
│
├── reviewer/
│   ├── review_notes.md         # Review observations
│   ├── quality_rules.md        # Quality standards
│   └── recurring_risks.md      # Common risk patterns
│
├── triage/
│   ├── classification_heuristics.md  # Issue classification patterns
│   └── debug_notes.md                # Debug investigation notes
│
├── ci-analyst/
│   ├── failure_patterns.md     # CI failure patterns
│   └── runbook_references.md   # Links to CI runbooks
│
└── failures/
    └── failure_library.md      # Shared recurring failure patterns

tasks/
├── _template/
│   ├── task.yaml               # Task manifest template
│   ├── analysis.md             # Architect's analysis
│   ├── design.md               # Design document
│   ├── implementation.md       # Developer's notes
│   ├── validation.md           # QA's validation
│   ├── review.md               # Reviewer's findings
│   ├── release.md              # Release checklist
│   └── subtasks/
│       └── task.yaml           # Subtask template
│
└── issue-{id}/
    ├── task.yaml               # Task manifest
    ├── analysis.md             # Architect's analysis
    ├── design.md               # Design document
    ├── implementation.md       # Developer's notes
    ├── validation.md           # QA's validation
    ├── review.md               # Reviewer's findings
    └── release.md              # Release checklist
```

### Memory Guidelines

1. **Before Writing**: Consider if information is:
   - Role-specific or shared?
   - Permanent or task-specific?
   - Verified or speculative?

2. **When Writing**:
   - Be concise and structured
   - Include timestamps for logs
   - Cross-reference related files

3. **After Writing**:
   - Verify location is appropriate
   - Ensure permissions are correct
   - Check for duplication

## Task System (v2)

### Task Manifest

Every task should have a `task.yaml` file:

```yaml
id: issue-123
title: Task title
type: feature | bug | refactor | docs | tech
status: backlog | ready | in_analysis | in_design | in_implementation | in_validation | in_review | release_candidate | blocked | done
priority: critical | high | medium | low
owner_role: planner | architect | developer | qa | reviewer | triage | ci-analyst
depends_on: []
blocked_by: []
acceptance_criteria:
  - Criterion 1
  - Criterion 2
risk_level: low | medium | high
module_scope:
  - module1
  - module2

github_issue: 123
github_url: https://github.com/org/repo/issues/123
parent_task: null
parent_github_issue: null
requires_decomposition: false

subtasks:
  - id: issue-123-subtask-01
    github_issue: 201
    title: "[Subtask] Analysis"
    type: analysis
    owner_role: architect
    status: pending
    depends_on: []
```

### Task States

Standard state machine:

```
backlog → ready → in_analysis → in_design → in_implementation → in_validation → in_review → release_candidate → done
                              ↓                                              ↓
                           blocked ←───────────────────────────────────────── ←
```

### State Transitions

| Current State | Valid Next States |
|---------------|-------------------|
| backlog | ready |
| ready | in_analysis, blocked |
| in_analysis | in_design, blocked, ready |
| in_design | in_implementation, blocked, in_analysis |
| in_implementation | in_validation, blocked, in_design |
| in_validation | in_review, in_implementation, blocked |
| in_review | release_candidate, in_implementation, blocked |
| release_candidate | done, in_review, blocked |
| blocked | (previous state) |

## Governance Model (v2)

### Change Scope Guard

- Bug fixes should not perform unrelated refactoring
- Features should not redesign public interfaces without approval
- Refactors should preserve behavior
- Reviewers should not silently mutate implementation

### Protected Knowledge Guard

AI should not directly modify durable truth areas without explicit approval:

- `docs/architecture/`
- `docs/decisions/`
- Release policy
- Standards docs

### Human Approval Gates

Humans should approve:

- **All Pull Requests** (AI creates PR, human merges)
- Architecture changes
- Merge to protected branches
- Release operations
- Changes to global truth
- Major task decomposition if risk is high

### Release Gates

| Gate | Blocking | Can Waive |
|------|----------|-----------|
| All tests pass | Yes | No |
| No security vulnerabilities | Yes | No |
| Code coverage met | Yes | With approval |
| Documentation updated | Yes | With approval |
| Code review approved | Yes | No |