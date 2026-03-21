# AmazingTeam E2E Tests

End-to-end testing system for AmazingTeam Foundation.

## Overview

This directory contains comprehensive E2E tests that verify:

1. **NPM Installation** - Package installs correctly
2. **CLI Initialization** - `amazingteam init` generates correct files
3. **Configuration Validation** - Generated configs are valid
4. **Skills Loading** - All 13 skills load successfully
5. **Agent Response** - Agents respond to prompts
6. **GitHub Actions Workflow** - Workflow runs correctly

## Directory Structure

```
tests/e2e/
├── fixtures/              # Test project templates
│   ├── minimal-project/   # Minimal test project
│   └── full-project/      # Full test project
├── scripts/               # Test scripts
│   ├── test-install.sh    # Installation test
│   ├── test-init.sh       # Initialization test
│   ├── test-config.sh     # Config validation test
│   ├── test-skills.sh     # Skills loading test
│   ├── test-agent.sh      # Agent response test
│   └── generate-report.sh # Report generation
├── local/                 # Local testing
│   ├── run-all.sh         # Run all local tests
│   ├── reports/           # Generated reports
│   └── tmp/               # Temporary files
├── ci/                    # CI configuration
├── logs/                  # Test logs
└── reports/               # CI reports
```

## Running Tests

### Local Testing

```bash
# Run all basic tests
./tests/e2e/local/run-all.sh

# Run specific test
./tests/e2e/scripts/test-install.sh

# Run with scope
./tests/e2e/local/run-all.sh --scope basic
```

### CI Testing

Tests run automatically in GitHub Actions:

| Trigger | Tests Run |
|---------|-----------|
| PR created/updated | Basic tests (install, init, config) |
| Push to main | Basic tests |
| Manual trigger | Configurable (basic/all/specific) |
| Daily schedule | All tests |

## Test Scripts

### test-install.sh

Tests that `npm install amazingteam` succeeds and files are correctly installed.

### test-init.sh

Tests that `npx amazingteam init` generates all required files:
- `amazingteam.config.yaml`
- `opencode.jsonc`
- `.github/workflows/amazingteam.yml`
- `.opencode/`

### test-config.sh

Validates generated configuration files:
- YAML syntax validation
- Required fields validation
- JSON schema validation

### test-skills.sh

Tests that all 13 skills load successfully:
- requirements-discussion
- task-breakdown-and-dispatch
- repo-architecture-reader
- test-first-feature-dev
- bugfix-playbook
- issue-triage
- ci-failure-analysis
- regression-checklist
- release-readiness-check
- safe-refactor-checklist
- github-integration
- release-automation
- documentation-sync

### test-agent.sh

Tests Agent response with simple prompt.
**Requires**: `AMAZINGTEAM_API_KEY` environment variable.

## Reports

### Report Formats

- `summary.md` - Human-readable summary
- `summary.json` - Machine-readable JSON
- `junit-report.xml` - JUnit format for CI

### Report Locations

| Environment | Location |
|-------------|----------|
| Local | `tests/e2e/local/reports/` |
| CI | GitHub Actions Artifacts |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AMAZINGTEAM_API_KEY` | Agent tests only | API key for OpenCode |

## Troubleshooting

### Test Fails

1. Check logs in `tests/e2e/logs/`
2. Review generated report
3. Run individual test for more details

### API Key Issues

```bash
# Set API key for local testing
export AMAZINGTEAM_API_KEY="your-api-key"
```

### Cleanup

```bash
# Clean temporary files
rm -rf tests/e2e/local/tmp/*
rm -rf tests/e2e/logs/*.log
```

## Contributing

When adding new features to AmazingTeam:

1. Add corresponding E2E test
2. Update this README
3. Ensure all existing tests pass