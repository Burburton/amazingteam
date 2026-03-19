# Overlay Guide

This document describes how to create and use overlays for AI Team Foundation.

## What is an Overlay?

An overlay is a set of configuration files that customize the base foundation for a specific technology stack or use case.

Overlays allow the foundation to support different project types without duplicating the entire structure.

## Available Overlays

| Overlay | Description | Use Case |
|---------|-------------|----------|
| (none) | Base foundation only | General projects |
| `cpp-qt-desktop` | C++ Qt desktop applications | Desktop GUI apps |
| `python-backend` | Python backend services | API services |
| `web-fullstack` | Full-stack web applications | Web apps |
| `ai-agent-product` | AI agent products | AI products |

## Using Overlays

### During Initialization

```bash
# Initialize with Python backend overlay
./scripts/init_project.sh -o python-backend my-api

# Initialize with C++ Qt overlay
./scripts/init_project.sh -o cpp-qt-desktop -l cpp my-desktop-app
```

### Overlay Application Order

1. Base foundation files are copied first
2. Overlay files are copied, potentially overriding base files
3. Foundation lock is created with overlay name

## Creating a New Overlay

### Directory Structure

```
overlays/
└── my-overlay/
    ├── .amazing-team/
    │   ├── agents/           # Override or add agents
    │   ├── skills/           # Add overlay-specific skills
    │   └── commands/         # Add overlay-specific commands
    ├── .github/
    │   └── workflows/        # Override or add workflows
    ├── docs/
    │   └──                   # Add overlay-specific docs
    └── overlay.yaml          # Overlay metadata
```

### overlay.yaml

```yaml
name: my-overlay
description: Description of this overlay
version: 1.0.0
compatible_foundation_versions:
  - "2.0.0"
  - "2.1.0"

# Files that will override base foundation
overrides:
  - .amazing-team/agents/developer.md
  - .github/workflows/ci.yml

# Files that will be added (not override)
additions:
  - .amazing-team/skills/my-skill/
  - docs/my-docs/
```

### Best Practices

1. **Minimal Overrides**: Only override what's necessary
2. **Document Changes**: Explain why each override is needed
3. **Version Compatibility**: Specify compatible foundation versions
4. **Test Thoroughly**: Validate overlay with different foundation versions

## Overlay Examples

### python-backend Overlay

**Purpose**: Python backend service configuration

**Overrides**:
- `.amazing-team/agents/developer.md` - Python-specific implementation guidelines
- `.github/workflows/ci.yml` - Python test/lint commands

**Additions**:
- `.amazing-team/skills/python-testing/` - Python testing skill
- `docs/python-style.md` - Python style guide

### cpp-qt-desktop Overlay

**Purpose**: C++ Qt desktop application configuration

**Overrides**:
- `.amazing-team/agents/developer.md` - C++ implementation guidelines
- `.amazing-team/skills/bugfix-playbook/skill.md` - C++ debugging patterns
- `.github/workflows/ci.yml` - CMake/build commands

**Additions**:
- `.amazing-team/skills/qt-signals-slots/` - Qt patterns skill
- `docs/qt-conventions.md` - Qt coding conventions

## Maintaining Overlays

### When Foundation Updates

1. Test overlay with new foundation version
2. Update `compatible_foundation_versions` if compatible
3. Fix any breaking changes in overridden files
4. Update overlay version

### Overlay Versioning

Overlays use semantic versioning:
- **MAJOR**: Breaking changes (incompatible with previous projects)
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes

## Contributing Overlays

To contribute a new overlay:

1. Create overlay directory structure
2. Add `overlay.yaml` with metadata
3. Add documentation
4. Test with `validate_foundation.sh`
5. Submit PR with overlay description

## Overlay-Specific Skills

Overlays can add skills for their technology stack:

```
overlays/python-backend/.amazing-team/skills/
└── python-testing/
    └── skill.md
```

When the overlay is applied, these skills are available to all agents.

## Multi-Overlay Projects

Currently, only one overlay can be applied per project. If you need features from multiple overlays:

1. Choose the primary overlay
2. Manually copy needed files from other overlays
3. Document in `.foundation/local-overrides.md`