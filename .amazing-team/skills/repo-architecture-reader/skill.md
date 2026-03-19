# Repository Architecture Reader

## Purpose

This skill enables an agent to quickly understand and document a repository's architecture, structure, and design patterns.

## When to Use

- Starting work on a new repository
- Analyzing codebase for the first time
- Creating architecture documentation
- Planning major refactoring
- Onboarding new team members

## Steps

### 1. Initial Exploration

```
1. Identify the project type (web app, library, CLI, etc.)
2. Locate configuration files (package.json, tsconfig.json, etc.)
3. Identify the main entry point(s)
4. Map the top-level directory structure
```

### 2. Dependency Analysis

```
1. Parse package.json / requirements.txt / Cargo.toml
2. Categorize dependencies:
   - Production dependencies
   - Development dependencies
   - Peer dependencies
3. Identify the tech stack:
   - Framework(s)
   - Build tools
   - Testing frameworks
   - Linting/formatting tools
```

### 3. Code Organization

```
1. Identify source code directories
2. Map module structure:
   - Core modules
   - Shared/utilities
   - Domain-specific modules
   - Third-party integrations
3. Identify architectural patterns:
   - MVC/MVVM/MVI
   - Layered architecture
   - Microservices
   - Monorepo structure
```

### 4. Data Flow Analysis

```
1. Trace main data flows
2. Identify state management
3. Map API boundaries
4. Document event flows
```

### 5. Configuration & Environment

```
1. Identify environment configuration
2. Map configuration sources
3. Document secrets management
4. Note feature flags
```

### 6. Testing Structure

```
1. Locate test files
2. Identify test types:
   - Unit tests
   - Integration tests
   - E2E tests
3. Document test utilities and fixtures
```

## Output Format

```markdown
# Repository Architecture: [Project Name]

## Overview
[Brief description of the project]

## Tech Stack
- **Language**: [Primary language]
- **Framework**: [Main framework]
- **Build Tool**: [Build tool]
- **Testing**: [Testing framework]

## Directory Structure
```
project/
├── src/           # Source code
│   ├── core/      # Core business logic
│   ├── api/       # API layer
│   ├── utils/     # Utilities
│   └── index.ts   # Entry point
├── tests/         # Test files
├── docs/          # Documentation
└── config/        # Configuration
```

## Key Modules

### [Module Name]
- **Purpose**: [What this module does]
- **Dependencies**: [What it depends on]
- **Consumers**: [What depends on it]
- **Key Files**: [Important files]

## Data Flow
[Description or diagram of data flow]

## Configuration
[How configuration is managed]

## Testing Strategy
[How testing is organized]

## Notes
[Any special considerations or gotchas]
```

## Best Practices

- Start with high-level understanding before diving deep
- Use diagrams for complex relationships
- Note any anti-patterns or technical debt
- Keep documentation updated as codebase evolves