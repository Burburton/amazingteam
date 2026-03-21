---
name: release-automation
description: Use when releasing a new version of the software. Automates version bumping, changelog updates, git tagging, and release creation. Supports both single and dual-repository release workflows.
trigger: user mentions "release", "publish", "version bump", or needs to create a new version
---

# Release Automation Skill

## Purpose

Systematize the release process for software projects, ensuring consistent versioning, changelog updates, and proper git tagging. Supports both single-repository and dual-repository workflows (like AmazingTeam).

## When to Use

- Creating a new release
- Version bumping (major, minor, patch)
- Updating changelogs
- Creating git tags and GitHub releases
- Publishing to package registries (NPM, PyPI, etc.)
- Coordinating releases across multiple repositories

## Release Types

| Type | Version Change | When to Use |
|------|----------------|-------------|
| **Major** | X.0.0 | Breaking changes, incompatible API changes |
| **Minor** | 0.X.0 | New features, backward compatible |
| **Patch** | 0.0.X | Bug fixes, backward compatible |
| **Prerelease** | 0.0.0-X | Alpha, beta, RC versions |

## Pre-Release Checklist

Before starting a release:

- [ ] All tests pass (`npm test` or equivalent)
- [ ] No uncommitted changes (`git status` is clean)
- [ ] All PRs merged that should be included
- [ ] CHANGELOG.md prepared with changes
- [ ] Documentation updated if needed
- [ ] Dependencies updated and audited

## Single Repository Release Workflow

### Step 1: Determine Version

```bash
# Check current version
cat VERSION 2>/dev/null || cat package.json | grep '"version"'

# Decide on version bump type
# - Patch: Bug fixes only
# - Minor: New features
# - Major: Breaking changes
```

### Step 2: Update Version Files

```bash
# Using npm (Node.js projects)
npm version patch  # or minor, major

# Or manually update:
# - VERSION file
# - package.json version field
# - Any other version files
```

### Step 3: Update Changelog

```markdown
# CHANGELOG.md

## [3.0.16] - 2026-03-21

### Added
- New feature for X

### Changed
- Improved performance of Y

### Fixed
- Bug fix for Z

### Breaking Changes
- None
```

### Step 4: Commit and Tag

```bash
# Stage changes
git add VERSION package.json CHANGELOG.md presets/default.yaml

# Commit with version
git commit -m "chore: Release v3.0.16"

# Create annotated tag
git tag -a v3.0.16 -m "Release v3.0.16"

# Push commit and tag
git push origin main
git push origin v3.0.16
```

### Step 5: Create GitHub Release

```bash
gh release create v3.0.16 \
  --title "Version 3.0.16" \
  --notes-file RELEASE_NOTES.md
```

### Step 6: Publish (if applicable)

```bash
# NPM
npm publish --otp=<OTP>

# PyPI
twine upload dist/*

# Docker
docker build -t myapp:3.0.16 .
docker push myapp:3.0.16
```

## Dual Repository Release Workflow (AmazingTeam)

**IMPORTANT**: AmazingTeam requires updating TWO repositories for each release.

### Repository Overview

| Repository | Purpose | Key Files |
|------------|---------|-----------|
| `amazingteam` | NPM package, foundation files | VERSION, package.json, CHANGELOG.md, presets/default.yaml |
| `amazingteam-action` | GitHub Action for CI/CD | action.yml, README.md |

### Complete Dual-Repo Release Process

```bash
#!/bin/bash
# release.sh - AmazingTeam release script

VERSION=$1  # e.g., "3.0.16"

if [ -z "$VERSION" ]; then
  echo "Usage: ./release.sh <version>"
  exit 1
fi

# ============================================
# PART 1: Update amazingteam repository
# ============================================

echo "Updating amazingteam repository..."

# Update VERSION file
echo "$VERSION" > VERSION

# Update package.json
jq --arg v "$VERSION" '.version = $v' package.json > package.json.tmp && mv package.json.tmp package.json

# Update presets/default.yaml
sed -i "s/^  version: .*/  version: \"$VERSION\"/" presets/default.yaml

# Update CHANGELOG.md (manual or automated)
# Add new section with version and date

# Commit and tag
git add VERSION package.json presets/default.yaml CHANGELOG.md
git commit -m "chore: Release v$VERSION"
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

# ============================================
# PART 2: Update amazingteam-action repository
# ============================================

echo "Updating amazingteam-action repository..."

cd ../amazingteam-action || exit 1

# Pull latest
git pull origin main

# Update action.yml default version
sed -i "s/default: 'v[0-9.]*'/default: 'v$VERSION'/" action.yml

# Update README.md version examples
sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$VERSION/g" README.md

# Commit, push, and tag
git add action.yml README.md
git commit -m "chore: Update to v$VERSION"
git push origin main
git tag "v$VERSION"
git push origin "v$VERSION"

# ============================================
# PART 3: Publish to NPM
# ============================================

echo "Publishing to NPM..."
cd ../amazingteam
npm publish --otp=<OTP>

echo "Release v$VERSION complete!"
```

### Manual Dual-Repo Release Steps

```bash
# Step 1: Update amazingteam repo
cd amazingteam
echo "3.0.16" > VERSION
# Update package.json version
# Update presets/default.yaml amazingteam.version
# Update CHANGELOG.md

git add -A
git commit -m "chore: Release v3.0.16"
git push origin main
git tag v3.0.16
git push origin v3.0.16

# Step 2: Update amazingteam-action repo
cd ../amazingteam-action
git pull origin main

# Edit action.yml - update default version
# Edit README.md - update version examples

git add -A
git commit -m "chore: Update to v3.0.16"
git push origin main
git tag v3.0.16
git push origin v3.0.16

# Step 3: Publish NPM package
cd ../amazingteam
npm publish --otp=<OTP>
```

## Changelog Format

### Standard Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ...

## [3.0.16] - 2026-03-21

### Added
- New feature for requirements discussion

### Changed
- Improved memory system documentation

### Fixed
- Bug in post summary comment formatting

### Security
- Updated dependencies to fix vulnerabilities

## [3.0.15] - 2026-03-19

...
```

### Generating Changelog from Commits

```bash
# Get commits since last release
git log v3.0.15..HEAD --oneline

# Generate changelog section
git log v3.0.15..HEAD --pretty=format:"- %s" --no-merges
```

## Version File Updates by Project Type

### Node.js / NPM

```bash
# Automatic
npm version patch  # Updates package.json and creates git tag

# Manual
jq '.version = "3.0.16"' package.json > tmp && mv tmp package.json
```

### Python

```bash
# Update pyproject.toml or setup.py
# Update __version__ in __init__.py
```

### Go

```bash
# Update version in code or use git tags only
```

### Rust

```bash
# Update Cargo.toml
cargo update  # Update Cargo.lock
```

## GitHub Release Creation

### Using gh CLI

```bash
# Interactive
gh release create v3.0.16

# With notes file
gh release create v3.0.16 \
  --title "v3.0.16" \
  --notes-file CHANGELOG.md

# With inline notes
gh release create v3.0.16 \
  --title "v3.0.16" \
  --notes "## Changes
- Feature A
- Bug fix B"

# With assets
gh release create v3.0.16 \
  --title "v3.0.16" \
  ./dist/*.zip
```

### Release Notes Template

```markdown
## What's Changed

### 🚀 Features
- Add feature X by @user in #123

### 🐛 Bug Fixes
- Fix bug Y by @user in #124

### 📝 Documentation
- Update docs for Z by @user in #125

### 🔧 Maintenance
- Update dependencies by @user in #126

**Full Changelog**: https://github.com/owner/repo/compare/v3.0.15...v3.0.16
```

## Rollback Procedure

If something goes wrong:

```bash
# Delete GitHub release
gh release delete v3.0.16 --yes

# Delete git tag locally and remotely
git tag -d v3.0.16
git push origin :refs/tags/v3.0.16

# Revert commit (if already pushed)
git revert HEAD
git push origin main

# If NPM package published (within 72 hours)
npm unpublish amazingteam@3.0.16
```

## Best Practices

### DO
- ✅ Always run tests before release
- ✅ Update CHANGELOG.md with all changes
- ✅ Use semantic versioning
- ✅ Create annotated git tags (`git tag -a`)
- ✅ Include migration guides for breaking changes
- ✅ Test release on staging environment first

### DON'T
- ❌ Release on Friday (unless necessary)
- ❌ Skip updating changelog
- ❌ Force push after release
- ❌ Delete release tags
- ❌ Release without backup plan

## Automation Options

### GitHub Actions Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Publish to NPM
        run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
```

### Release-it Integration

```bash
# Install
npm install -D release-it

# Interactive release
npx release-it

# Automatic version bump
npx release-it patch  # or minor, major
```

## AmazingTeam Specific Files to Update

| File | Field/Line | Example |
|------|------------|---------|
| `VERSION` | Entire file | `3.0.16` |
| `package.json` | `version` | `"version": "3.0.16"` |
| `presets/default.yaml` | `amazingteam.version` | `version: "3.0.16"` |
| `CHANGELOG.md` | New section | `## [3.0.16] - 2026-03-21` |
| `amazingteam-action/action.yml` | `inputs.version.default` | `default: 'v3.0.16'` |
| `amazingteam-action/README.md` | Version examples | `uses: Burburton/amazingteam-action@v3.0.16` |