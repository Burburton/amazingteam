# Configuration Reference

This document describes all configuration options for `amazingteam.config.yaml`.

---

## Configuration File Location

Default: `amazingteam.config.yaml` in project root.

Custom location: Specify via CLI `--config` flag or Action input.

---

## Full Configuration Example

```yaml
version: "1.0"

preset: "typescript"

project:
  name: "my-awesome-app"
  description: "My awesome application"
  language: "typescript"
  framework: "react"
  repository: "https://github.com/org/repo"

build:
  command: "npm run build"
  test: "npm test"
  lint: "npm run lint"
  typecheck: "npm run typecheck"

rules:
  test_coverage_threshold: 80
  max_function_lines: 30
  max_file_lines: 500
  commit_convention: "conventional"

agents:
  planner: true
  architect: true
  developer: true
  qa: true
  reviewer: true
  triage: true
  ci_analyst: true

workflows:
  feature:
    sequence:
      - triage
      - architect
      - developer
      - qa
      - reviewer
    auto_merge: false
  bugfix:
    sequence:
      - triage
      - developer
      - qa
    auto_merge: false

memory:
  retention_days: 90
  max_entries_per_role: 100

foundation:
  version: "3.0.0"
  registry: "https://registry.npmjs.org"

overlay:
  name: "web-fullstack"
  content: |
    ## Custom Rules
    - Use functional components
    - Prefer hooks over class components
```

---

## Configuration Fields

### Top-Level Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `version` | string | No | `"1.0"` | Config file schema version |
| `preset` | string | No | `"default"` | Preset name (default, typescript, python, go) |
| `project` | object | **Yes** | - | Project information |
| `llm` | object | No | Default | LLM provider configuration |
| `workflow` | object | No | PR mode | Commit and PR workflow settings |
| `build` | object | No | Preset default | Build commands |
| `rules` | object | No | Preset default | Coding rules |
| `agents` | object | No | All enabled | Agent configuration |
| `workflows` | object | No | Built-in defaults | Custom workflows |
| `memory` | object | No | Built-in defaults | Memory settings |
| `foundation` | object | No | Latest | Foundation version settings |
| `overlay` | object | No | None | Overlay configuration |

---

### project

**Required**. Project information.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | **Yes** | - | Project name |
| `description` | string | No | `""` | Project description |
| `language` | string | **Yes** | - | Primary language (typescript, python, go, etc.) |
| `framework` | string | No | `""` | Framework name (react, vue, django, etc.) |
| `repository` | string | No | Git origin | Repository URL |

**Examples:**

```yaml
# Minimal
project:
  name: "my-api"
  language: "python"

# Full
project:
  name: "my-fullstack-app"
  description: "Full-stack web application"
  language: "typescript"
  framework: "react"
  repository: "https://github.com/org/my-fullstack-app"
```

---

### llm

LLM provider configuration for custom AI backends.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `provider` | string | No | `"default"` | Provider name (default, openai, anthropic, bailian, deepseek, etc.) |
| `model` | string | No | `"default"` | Model name for main tasks |
| `small_model` | string | No | Same as model | Model for simple tasks |
| `base_url` | string | No | Provider default | Custom API endpoint |
| `api_key_env` | string | No | - | Environment variable name for API key |

**Supported Providers:**

| Provider | base_url | Notes |
|----------|----------|-------|
| `default` | - | Uses OpenCode's default configuration |
| `openai` | `https://api.openai.com/v1` | OpenAI GPT models |
| `anthropic` | `https://api.anthropic.com` | Claude models |
| `bailian` | `https://bailian.aliyuncs.com/v1` | Alibaba Bailian (百炼) |
| `deepseek` | `https://api.deepseek.com` | DeepSeek models |
| `moonshot` | `https://api.moonshot.cn/v1` | Moonshot (月之暗面) |
| `zhipu` | `https://open.bigmodel.cn/api/paas/v4` | Zhipu AI (智谱) |

**Examples:**

```yaml
# Use default (OpenCode handles configuration)
llm:
  provider: "default"

# Use Alibaba Bailian (百炼)
llm:
  provider: "bailian"
  model: "qwen-max"
  small_model: "qwen-turbo"
  base_url: "https://bailian.aliyuncs.com/v1"
  api_key_env: "BAILIAN_API_KEY"

# Use OpenAI
llm:
  provider: "openai"
  model: "gpt-4"
  small_model: "gpt-3.5-turbo"

# Use DeepSeek
llm:
  provider: "deepseek"
  model: "deepseek-chat"
  small_model: "deepseek-chat"

# Custom endpoint
llm:
  provider: "custom"
  model: "my-model"
  base_url: "https://my-api.example.com/v1"
  api_key_env: "CUSTOM_API_KEY"
```

**Environment Variables:**

Set your API key in environment:
```bash
# For Bailian
export BAILIAN_API_KEY="your-api-key"

# For OpenAI
export OPENAI_API_KEY="your-api-key"

# For DeepSeek
export DEEPSEEK_API_KEY="your-api-key"
```

In GitHub Actions, add to your workflow:
```yaml
env:
  BAILIAN_API_KEY: ${{ secrets.BAILIAN_API_KEY }}
```

---

### workflow

Commit and PR workflow configuration.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `commit_mode` | string | No | `"pr"` | Commit mode: `"pr"` or `"direct"` |
| `pr` | object | No | See below | PR mode settings |
| `direct` | object | No | See below | Direct commit mode settings |

#### commit_mode

| Value | Description |
|-------|-------------|
| `"pr"` | Create Pull Request, wait for human review (recommended, safer) |
| `"direct"` | Commit directly to branch (faster, less oversight) |

#### pr settings

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `auto_merge` | boolean | No | `false` | Auto-merge PR after CI passes |
| `require_review` | boolean | No | `true` | Require human review before merge |
| `reviewers` | string[] | No | `[]` | Default reviewers for PRs |

#### direct settings

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `require_ci_pass` | boolean | No | `true` | Require CI to pass before committing |

**Examples:**

```yaml
# PR mode with human review (recommended for teams)
workflow:
  commit_mode: "pr"
  pr:
    auto_merge: false
    require_review: true
    reviewers:
      - "team-lead"
      - "senior-dev"

# PR mode with auto-merge (trusted environments)
workflow:
  commit_mode: "pr"
  pr:
    auto_merge: true
    require_review: false

# Direct commits (solo projects, faster iteration)
workflow:
  commit_mode: "direct"
  direct:
    require_ci_pass: true
```

**When to use each mode:**

| Scenario | Recommended Mode |
|----------|------------------|
| Team project | `pr` with `require_review: true` |
| Solo project | `direct` or `pr` with `auto_merge: true` |
| Production codebase | `pr` with `require_review: true` |
| Prototype/POC | `direct` |
| Regulated industry | `pr` with multiple `reviewers` |

---

### build

Build and test commands.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `command` | string | No | Preset default | Build command |
| `test` | string | No | Preset default | Test command |
| `lint` | string | No | Preset default | Lint command |
| `typecheck` | string | No | Preset default | Type check command |

**Examples:**

```yaml
# TypeScript project
build:
  command: "npm run build"
  test: "npm test"
  lint: "npm run lint"
  typecheck: "npm run typecheck"

# Python project
build:
  command: "python -m build"
  test: "pytest"
  lint: "ruff check ."
  typecheck: "mypy ."

# Go project
build:
  command: "go build ./..."
  test: "go test ./..."
  lint: "golangci-lint run"
  typecheck: ""  # Go doesn't need separate typecheck
```

---

### rules

Coding rules and thresholds.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `test_coverage_threshold` | number | No | `80` | Minimum test coverage % |
| `max_function_lines` | number | No | `30` | Max lines per function |
| `max_file_lines` | number | No | `500` | Max lines per file |
| `commit_convention` | string | No | `"conventional"` | Commit message format |

**Examples:**

```yaml
rules:
  test_coverage_threshold: 90
  max_function_lines: 25
  max_file_lines: 300
  commit_convention: "conventional"  # or "angular", "gitmoji", "none"
```

---

### agents

Enable/disable agents.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `planner` | boolean | No | `true` | Enable planner agent |
| `architect` | boolean | No | `true` | Enable architect agent |
| `developer` | boolean | No | `true` | Enable developer agent |
| `qa` | boolean | No | `true` | Enable QA agent |
| `reviewer` | boolean | No | `true` | Enable reviewer agent |
| `triage` | boolean | No | `true` | Enable triage agent |
| `ci_analyst` | boolean | No | `true` | Enable CI analyst agent |

**Examples:**

```yaml
# All enabled (default)
agents:
  planner: true
  architect: true
  developer: true
  qa: true
  reviewer: true
  triage: true
  ci_analyst: true

# Minimal team
agents:
  planner: false
  architect: true
  developer: true
  qa: true
  reviewer: false
  triage: false
  ci_analyst: false
```

---

### workflows

Custom workflow definitions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `{workflow_name}` | object | No | Workflow definition |
| `{workflow_name}.sequence` | string[] | **Yes** | Ordered list of roles |
| `{workflow_name}.auto_merge` | boolean | No | Auto-merge PRs after completion |

**Built-in Workflows:**

| Name | Sequence | Description |
|------|----------|-------------|
| `feature` | triage → architect → developer → qa → reviewer | New feature development |
| `bugfix` | triage → developer → qa | Bug fixes |
| `tech-task` | triage → architect → developer → qa | Technical tasks |

**Examples:**

```yaml
workflows:
  # Override default feature workflow
  feature:
    sequence:
      - triage
      - architect
      - developer
      - developer  # Second pass
      - qa
      - reviewer
    auto_merge: false

  # Custom quick-fix workflow
  quickfix:
    sequence:
      - developer
      - qa
    auto_merge: true

  # Documentation workflow
  docs:
    sequence:
      - developer
    auto_merge: true
```

---

### memory

Memory system settings.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `retention_days` | number | No | `90` | Days to keep memory entries |
| `max_entries_per_role` | number | No | `100` | Max entries per role |

**Examples:**

```yaml
memory:
  retention_days: 30  # Shorter retention for small projects
  max_entries_per_role: 50
```

---

### foundation

Foundation version and source settings.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `version` | string | No | `"latest"` | Foundation version |
| `registry` | string | No | `"https://registry.npmjs.org"` | NPM registry URL |
| `github_repo` | string | No | Official repo | GitHub repo for fallback |

**Examples:**

```yaml
# Use specific version
foundation:
  version: "3.1.0"

# Use private registry
foundation:
  version: "3.0.0"
  registry: "https://my-private-registry.com"

# Use GitHub releases
foundation:
  version: "3.0.0"
  github_repo: "my-org/amazingteam"
```

---

### overlay

Overlay configuration for custom rules and content.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Built-in overlay name |
| `path` | string | No | Custom overlay path |
| `content` | string | No | Inline overlay content |

**Built-in Overlays:**

| Name | Description |
|------|-------------|
| `web-fullstack` | React/Vue/Node fullstack conventions |
| `python-backend` | Python/Django/FastAPI conventions |
| `cpp-qt-desktop` | C++/Qt desktop application conventions |

**Examples:**

```yaml
# Use built-in overlay
overlay:
  name: "web-fullstack"

# Use custom overlay from path
overlay:
  path: "./my-custom-overlay"

# Inline overlay content
overlay:
  content: |
    ## Project-Specific Rules
    - Use functional components only
    - All API calls must have error handling
    - Use CSS modules for styling
```

---

### preset

Quick configuration presets.

| Preset | Language | Framework | Build | Test |
|--------|----------|-----------|-------|------|
| `default` | Any | Any | `npm run build` | `npm test` |
| `typescript` | TypeScript | Any | `npm run build` | `npm test` |
| `python` | Python | Any | `python -m build` | `pytest` |
| `go` | Go | Any | `go build ./...` | `go test ./...` |

**Example:**

```yaml
# Using preset (recommended for quick setup)
preset: "typescript"

project:
  name: "my-api"

# Preset provides defaults for build, rules, etc.
# Override as needed:

build:
  test: "npm run test:coverage"
```

---

## Minimal Configuration

The minimum required configuration:

```yaml
project:
  name: "my-project"
  language: "typescript"
```

All other fields use preset or built-in defaults.

---

## Configuration Merge Order

Configuration is merged in this order (later overrides earlier):

1. Foundation defaults
2. Preset defaults
3. User configuration (`amazingteam.config.yaml`)
4. Local overlay

---

## Validation

Validate your configuration:

```bash
npx amazingteam validate
```

This checks:
- Required fields present
- Valid values for enums
- Correct types for all fields
- Valid workflow sequences

---

## Environment Variables

Override configuration with environment variables:

| Variable | Description |
|----------|-------------|
| `AI_TEAM_CONFIG` | Path to config file |
| `AI_TEAM_VERSION` | Override foundation version |
| `AI_TEAM_REGISTRY` | Override NPM registry |
| `AI_TEAM_DEBUG` | Enable debug logging |

**Example:**

```bash
AI_TEAM_CONFIG=./custom-config.yaml npx amazingteam validate
```