---
name: documentation-sync
description: Use when code changes require documentation updates. Ensures documentation stays synchronized with code, API, and feature changes. Detects doc drift and maintains consistency.
trigger: user mentions "update docs", "documentation", "README", or after significant code changes
---

# Documentation Sync Skill

## Purpose

Ensure documentation stays synchronized with code changes. Detect and fix documentation drift, maintain API documentation, and keep README, CHANGELOG, and other docs up-to-date.

## When to Use

- After implementing new features
- When API interfaces change
- After refactoring that affects user-facing behavior
- Before releases to verify documentation completeness
- When documentation is out of sync with code

## Documentation Types

| Type | Location | Purpose | Update Frequency |
|------|----------|---------|------------------|
| **README.md** | Root | Project overview, quick start | With new features |
| **CHANGELOG.md** | Root | Version history | Every release |
| **API Docs** | `docs/api/` | API reference | With API changes |
| **Architecture** | `docs/architecture/` | System design | With architectural changes |
| **AGENTS.md** | Root | AI agent rules | With workflow changes |
| **Code Comments** | Inline | Implementation details | With code changes |
| **Type Definitions** | `.d.ts`, JSDoc | Type information | With interface changes |

## Documentation Drift Detection

### Automated Checks

```bash
# Check for outdated version references
grep -r "v[0-9]\+\.[0-9]\+\.[0-9]\+" docs/ README.md

# Find TODO/FIXME in docs
grep -r "TODO\|FIXME" docs/

# Check for broken links
npx markdown-link-check README.md

# Find undocumented exports
npx ts-docs-check

# Check for missing JSDoc
npx eslint --rule 'require-jsdoc: error' src/
```

### Manual Checklist

- [ ] Version numbers updated everywhere?
- [ ] New features documented?
- [ ] Deprecated features marked?
- [ ] Breaking changes noted?
- [ ] Installation instructions current?
- [ ] Examples working?
- [ ] Links valid?

## Update Workflows

### Feature Implementation → Documentation

```markdown
## After implementing a new feature:

1. **Update README.md**
   - Add to features list
   - Update examples if relevant
   - Add to quick start if it changes initial setup

2. **Create/Update API docs**
   - Document new functions/classes
   - Add usage examples
   - Document parameters and return types

3. **Update CHANGELOG.md**
   - Add to [Unreleased] section
   - Categorize as Added/Changed/Fixed

4. **Add inline documentation**
   - JSDoc/TSDoc for public APIs
   - Comments for complex logic

5. **Update AGENTS.md** (if AI workflow affected)
   - Add new commands
   - Update agent responsibilities
```

### API Changes → Documentation

```bash
# For new API endpoints:

# 1. Document in code
/**
 * @api {get} /users/:id Get user by ID
 * @apiParam {String} id User's unique ID
 * @apiSuccess {Object} user User object
 * @apiSuccess {String} user.name User's name
 * @apiSuccess {String} user.email User's email
 */
app.get('/users/:id', (req, res) => { ... });

# 2. Generate API docs
npx api-docs -i src/ -o docs/api/

# 3. Update docs/api/README.md with new endpoint
```

### Configuration Changes → Documentation

```markdown
## When adding new configuration options:

1. **Update config schema**
   - Add to config type definitions
   - Update JSON Schema if applicable

2. **Document in README**
   - Add to configuration section
   - Provide example values

3. **Update presets**
   - Add to default.yaml
   - Document in overlay guides
```

## Documentation Templates

### README.md Structure

```markdown
# Project Name

Brief description of what the project does.

## Features

- Feature 1: Description
- Feature 2: Description

## Quick Start

\`\`\`bash
# Installation
npm install package-name

# Usage
npx package-name init
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option1` | string | `"default"` | Description of option |

## API Reference

See [API Documentation](docs/api/README.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
```

### API Documentation Template

```markdown
# Module: ModuleName

## Overview

Brief description of the module's purpose.

## Installation

\`\`\`bash
npm install @scope/module-name
\`\`\`

## Usage

\`\`\`typescript
import { FunctionName } from '@scope/module-name';

const result = FunctionName(options);
\`\`\`

## API

### `FunctionName(options)`

Description of what the function does.

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `param1` | `string` | Yes | Description |
| `param2` | `number` | No | Description (default: 0) |

#### Returns

`Promise<Result>` - Description of return value.

#### Example

\`\`\`typescript
const result = await FunctionName({
  param1: 'value',
  param2: 42
});
\`\`\`

### `ClassName`

Description of the class.

#### Constructor

\`\`\`typescript
new ClassName(options: ClassOptions)
\`\`\`

#### Methods

##### `methodName(param: Type): ReturnType`

Description of the method.

## Types

### `Options`

\`\`\`typescript
interface Options {
  param1: string;
  param2?: number;
}
\`\`\`

## Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ErrorType` | Invalid input | Provide valid input |

## See Also

- [Related Module](./related-module.md)
```

### CHANGELOG Entry Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature description (#PR)

### Changed
- Change description (#PR)

### Deprecated
- Feature marked for removal in next major version

### Removed
- Feature removed (previously deprecated)

### Fixed
- Bug fix description (#PR)

### Security
- Security fix description
```

## Automated Documentation Generation

### JSDoc → Markdown

```bash
# Install TypeDoc
npm install -D typedoc

# Generate documentation
npx typedoc src/ --out docs/api

# Configuration (typedoc.json)
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"]
}
```

### OpenAPI → Documentation

```bash
# Generate docs from OpenAPI spec
npx @redocly/cli build-docs openapi.yaml -o docs/api.html
```

### Code → README

```bash
# Generate README from code
npx readme-md-generator
```

## Documentation Validation

### Link Checking

```bash
# Install markdown-link-check
npm install -g markdown-link-check

# Check all markdown files
find . -name "*.md" -exec markdown-link-check {} \;

# Check single file
markdown-link-check README.md
```

### Spell Checking

```bash
# Install cspell
npm install -D cspell

# Check spelling
npx cspell "docs/**/*.md" README.md

# Configuration (.cspell.json)
{
  "version": "0.2",
  "words": ["opencode", "superpowers", "amazingteam"]
}
```

### Markdown Linting

```bash
# Install markdownlint
npm install -D markdownlint-cli

# Lint all markdown
npx markdownlint "**/*.md"

# Fix issues
npx markdownlint "**/*.md" --fix
```

## Sync Strategies

### Proactive (Recommended)

```markdown
1. Write documentation alongside code
2. Include doc updates in PR checklist
3. Generate docs from code (JSDoc, TypeDoc)
4. CI checks for doc coverage
```

### Reactive

```markdown
1. Schedule regular doc reviews
2. Automated drift detection
3. Create doc update issues when drift found
4. Fix in dedicated doc update sessions
```

## AmazingTeam Documentation Sync

### Files to Keep in Sync

| When Code Changes | Update These Docs |
|-------------------|-------------------|
| New CLI command | README.md, docs/cli/, AGENTS.md |
| New agent role | AGENTS.md, .opencode/agents/, amazing-team.config.yaml |
| New skill | .opencode/skills/, .opencode/SUPERPOWERS.md |
| Config schema change | README.md, presets/, docs/configuration.md |
| Workflow change | AGENTS.md, .github/workflows/, docs/workflows/ |
| Release | VERSION, package.json, CHANGELOG.md, presets/default.yaml |

### Documentation Update Checklist for PRs

```markdown
## Documentation Checklist

- [ ] README.md updated if user-facing change
- [ ] CHANGELOG.md entry added to [Unreleased]
- [ ] API docs updated if public API changed
- [ ] JSDoc/TSDoc added for new public functions
- [ ] AGENTS.md updated if AI workflow affected
- [ ] Examples updated/added
- [ ] Configuration docs updated if new options
- [ ] Migration guide added for breaking changes
```

## Best Practices

### DO
- ✅ Update docs in the same PR as code changes
- ✅ Use consistent terminology throughout docs
- ✅ Include code examples that actually work
- ✅ Document "why", not just "what"
- ✅ Keep docs close to code (co-locate)
- ✅ Use automated tools for API docs

### DON'T
- ❌ Let docs get stale
- ❌ Duplicate documentation in multiple places
- ❌ Use outdated screenshots or examples
- ❌ Skip documentation for "obvious" features
- ❌ Wait until release to update docs

## Tools Integration

### VS Code Extensions
- Markdown All in One
- markdownlint
- Code Spell Checker

### CI Integration

```yaml
# .github/workflows/docs.yml
name: Documentation

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      
      - name: Check markdown links
        run: npx markdown-link-check README.md
      
      - name: Lint markdown
        run: npx markdownlint "**/*.md"
      
      - name: Check spelling
        run: npx cspell "docs/**/*.md" README.md
```

## Examples

### Complete Feature Documentation Update

```bash
# 1. Implement feature
git checkout -b feature/user-dashboard

# 2. Add JSDoc to new code
# (Add documentation comments to all public functions)

# 3. Update README.md
# (Add feature to list, add usage example)

# 4. Create docs/features/user-dashboard.md
# (Detailed feature documentation)

# 5. Update CHANGELOG.md
echo "### Added\n- User dashboard feature (#123)" >> CHANGELOG.md

# 6. Generate API docs
npx typedoc src/dashboard/ --out docs/api/dashboard

# 7. Commit and PR
git add -A
git commit -m "feat: Add user dashboard with docs"
```