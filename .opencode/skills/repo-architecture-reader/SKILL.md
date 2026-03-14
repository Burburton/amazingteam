---
name: repo-architecture-reader
description: Quickly understand and document a repository's architecture, structure, and design patterns
license: MIT
---
# Repository Architecture Reader

## When to Use

- Starting work on a new repository
- Analyzing codebase for the first time
- Creating architecture documentation
- Planning major refactoring

## Steps

### 1. Initial Exploration
1. Identify the project type (web app, library, CLI, etc.)
2. Locate configuration files (package.json, tsconfig.json, etc.)
3. Identify the main entry point(s)
4. Map the top-level directory structure

### 2. Dependency Analysis
1. Parse package.json / requirements.txt / Cargo.toml
2. Categorize dependencies (production, dev, peer)
3. Identify the tech stack (framework, build tools, testing)

### 3. Code Organization
1. Identify source code directories
2. Map module structure (core, shared, domain-specific)
3. Identify architectural patterns (MVC, layered, microservices)

### 4. Data Flow Analysis
1. Trace main data flows
2. Identify state management
3. Map API boundaries

### 5. Testing Structure
1. Locate test files
2. Identify test types (unit, integration, E2E)
3. Document test utilities

## Output Format

```markdown
# Repository Architecture: [Project Name]

## Overview
[Brief description]

## Tech Stack
- **Language**: [Primary language]
- **Framework**: [Main framework]
- **Build Tool**: [Build tool]
- **Testing**: [Testing framework]

## Directory Structure
[Directory tree]

## Key Modules
### [Module Name]
- **Purpose**: [What this module does]
- **Dependencies**: [What it depends on]
- **Key Files**: [Important files]
```