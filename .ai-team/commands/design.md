# /design Command

## Purpose

Analyze requirements and design an implementation plan without writing code.

## Usage

```
/design [issue-number]
/design [feature-description]
```

## Examples

```
/design 123
/design add user authentication
/design implement caching layer
```

## Agent: Architect

## Workflow

### 1. Input Analysis
- Parse the issue or feature description
- Identify key requirements
- Clarify ambiguous points
- Document constraints

### 2. Architecture Review
- Study existing codebase structure
- Identify relevant modules
- Note architectural patterns
- Find similar implementations

### 3. Design Phase
- Propose high-level design
- Identify components needed
- Define interfaces
- Consider data flow

### 4. Implementation Planning
- Break down into tasks
- Identify dependencies
- Estimate complexity
- Prioritize steps

### 5. Risk Assessment
- Identify technical risks
- Consider edge cases
- Note potential issues
- Propose mitigations

## Output

Produces an architecture document containing:

```markdown
## Design: [Feature Name]

### Requirements
- [Requirement 1]
- [Requirement 2]

### Current Architecture
[Description of relevant existing architecture]

### Proposed Design
[High-level design description]

### Components
1. **Component A**: [Description]
2. **Component B**: [Description]

### Data Flow
[Description or diagram]

### Implementation Plan
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| ... | ... | ... |

### Questions
- [Question 1]
- [Question 2]
```

## Next Steps

After `/design`, typically:
1. Review the design document
2. Discuss and refine
3. Use `/implement` to begin coding