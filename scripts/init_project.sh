#!/bin/bash
# init_project.sh
# Initialize a new downstream project from the foundation base

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FOUNDATION_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
PROJECT_NAME=""
PROJECT_PATH=""
OVERLAY=""
LANGUAGE="typescript"
FRAMEWORK="node"
DESCRIPTION=""
FORCE=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 [OPTIONS] <project-name>"
    echo ""
    echo "Initialize a new downstream project from AI Team Foundation."
    echo ""
    echo "Options:"
    echo "  -p, --path <path>       Target directory path (default: ./<project-name>)"
    echo "  -o, --overlay <name>    Apply overlay (cpp-qt-desktop, python-backend, web-fullstack)"
    echo "  -l, --language <lang>   Programming language (default: typescript)"
    echo "  -f, --framework <name>  Framework name (default: node)"
    echo "  -d, --description <d>   Project description"
    echo "  --force                 Overwrite existing directory"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 my-awesome-project"
    echo "  $0 -o python-backend -l python my-api"
    echo "  $0 -o cpp-qt-desktop -l cpp my-desktop-app"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--path)
                PROJECT_PATH="$2"
                shift 2
                ;;
            -o|--overlay)
                OVERLAY="$2"
                shift 2
                ;;
            -l|--language)
                LANGUAGE="$2"
                shift 2
                ;;
            -f|--framework)
                FRAMEWORK="$2"
                shift 2
                ;;
            -d|--description)
                DESCRIPTION="$2"
                shift 2
                ;;
            --force)
                FORCE=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                if [[ -z "$PROJECT_NAME" ]]; then
                    PROJECT_NAME="$1"
                fi
                shift
                ;;
        esac
    done
}

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    if [[ -z "$PROJECT_NAME" ]]; then
        log_error "Project name is required"
        usage
        exit 1
    fi
    
    if [[ -z "$PROJECT_PATH" ]]; then
        PROJECT_PATH="./$PROJECT_NAME"
    fi
    
    if [[ -d "$PROJECT_PATH" ]] && [[ "$FORCE" != true ]]; then
        log_error "Directory $PROJECT_PATH already exists. Use --force to overwrite."
        exit 1
    fi
    
    if [[ -n "$OVERLAY" ]] && [[ ! -d "$FOUNDATION_ROOT/overlays/$OVERLAY" ]]; then
        log_error "Overlay '$OVERLAY' not found"
        log_info "Available overlays:"
        ls -1 "$FOUNDATION_ROOT/overlays" 2>/dev/null || echo "  (none)"
        exit 1
    fi
}

read_version() {
    VERSION=$(cat "$FOUNDATION_ROOT/VERSION" 2>/dev/null || echo "unknown")
}

create_directory_structure() {
    log_info "Creating directory structure..."
    
    # Core directories
    mkdir -p "$PROJECT_PATH/.amazing-team/agents"
    mkdir -p "$PROJECT_PATH/.amazing-team/skills"
    mkdir -p "$PROJECT_PATH/.amazing-team/commands"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory"
    
    # Memory directories for all roles
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/planner"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/architect"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/developer"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/qa"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/reviewer"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/triage"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/ci-analyst"
    mkdir -p "$PROJECT_PATH/.amazing-team/memory/failures"
    
    # GitHub directories
    mkdir -p "$PROJECT_PATH/.github/workflows"
    mkdir -p "$PROJECT_PATH/.github/ISSUE_TEMPLATE"
    
    # Documentation directories
    mkdir -p "$PROJECT_PATH/docs/architecture"
    mkdir -p "$PROJECT_PATH/docs/decisions"
    mkdir -p "$PROJECT_PATH/docs/patterns"
    mkdir -p "$PROJECT_PATH/docs/releases"
    mkdir -p "$PROJECT_PATH/docs/runbooks/ci"
    
    # Task directories
    mkdir -p "$PROJECT_PATH/tasks/_template"
    
    # Foundation metadata
    mkdir -p "$PROJECT_PATH/.foundation"
    
    # Source directories
    mkdir -p "$PROJECT_PATH/src"
    mkdir -p "$PROJECT_PATH/tests"
}

copy_base_templates() {
    log_info "Copying base templates..."
    
    # Copy .amazing-team structure
    if [[ -d "$FOUNDATION_ROOT/.amazing-team" ]]; then
        cp -r "$FOUNDATION_ROOT/.amazing-team/agents"/* "$PROJECT_PATH/.amazing-team/agents/" 2>/dev/null || true
        cp -r "$FOUNDATION_ROOT/.amazing-team/skills"/* "$PROJECT_PATH/.amazing-team/skills/" 2>/dev/null || true
        cp -r "$FOUNDATION_ROOT/.amazing-team/commands"/* "$PROJECT_PATH/.amazing-team/commands/" 2>/dev/null || true
        cp -r "$FOUNDATION_ROOT/.amazing-team/memory"/* "$PROJECT_PATH/.amazing-team/memory/" 2>/dev/null || true
        cp "$FOUNDATION_ROOT/.amazing-team/opencode.template.jsonc" "$PROJECT_PATH/.amazing-team/" 2>/dev/null || true
    fi
    
    # Copy GitHub workflows
    if [[ -d "$FOUNDATION_ROOT/.github/workflows" ]]; then
        cp -r "$FOUNDATION_ROOT/.github/workflows"/* "$PROJECT_PATH/.github/workflows/" 2>/dev/null || true
    fi
    
    # Copy Issue templates
    if [[ -d "$FOUNDATION_ROOT/.github/ISSUE_TEMPLATE" ]]; then
        cp -r "$FOUNDATION_ROOT/.github/ISSUE_TEMPLATE"/* "$PROJECT_PATH/.github/ISSUE_TEMPLATE/" 2>/dev/null || true
    fi
    
    # Copy PR template
    cp "$FOUNDATION_ROOT/.github/pull_request_template.md" "$PROJECT_PATH/.github/" 2>/dev/null || true
    
    # Copy task templates
    if [[ -d "$FOUNDATION_ROOT/tasks/_template" ]]; then
        cp -r "$FOUNDATION_ROOT/tasks/_template"/* "$PROJECT_PATH/tasks/_template/" 2>/dev/null || true
    fi
    
    # Copy AGENTS.md
    cp "$FOUNDATION_ROOT/AGENTS.md" "$PROJECT_PATH/" 2>/dev/null || true
}

apply_overlay() {
    if [[ -z "$OVERLAY" ]]; then
        return
    fi
    
    log_info "Applying overlay: $OVERLAY"
    
    OVERLAY_PATH="$FOUNDATION_ROOT/overlays/$OVERLAY"
    
    if [[ ! -d "$OVERLAY_PATH" ]]; then
        log_warning "Overlay directory not found, skipping..."
        return
    fi
    
    # Copy overlay files (these may override base files)
    if [[ -d "$OVERLAY_PATH/.amazing-team" ]]; then
        cp -r "$OVERLAY_PATH/.amazing-team"/* "$PROJECT_PATH/.amazing-team/" 2>/dev/null || true
    fi
    
    if [[ -d "$OVERLAY_PATH/.github" ]]; then
        cp -r "$OVERLAY_PATH/.github"/* "$PROJECT_PATH/.github/" 2>/dev/null || true
    fi
    
    if [[ -d "$OVERLAY_PATH/docs" ]]; then
        cp -r "$OVERLAY_PATH/docs"/* "$PROJECT_PATH/docs/" 2>/dev/null || true
    fi
}

create_foundation_lock() {
    log_info "Creating foundation lock file..."
    
    cat > "$PROJECT_PATH/.foundation/foundation.lock" << EOF
foundation_repo: amazing-team-foundation
foundation_version: $VERSION
overlay: ${OVERLAY:-none}
initialized_at: $(date -I)
last_upgrade_at: $(date -I)
upgrade_policy: controlled
language: $LANGUAGE
framework: $FRAMEWORK
EOF
}

create_upgrade_history() {
    cat > "$PROJECT_PATH/.foundation/upgrade-history.md" << EOF
# Upgrade History

This file records all foundation upgrades applied to this project.

## Initial Setup

- **Date**: $(date -I)
- **Foundation Version**: $VERSION
- **Overlay**: ${OVERLAY:-none}
- **Action**: Initial project creation

EOF
}

create_local_overrides() {
    cat > "$PROJECT_PATH/.foundation/local-overrides.md" << EOF
# Local Overrides

This file documents project-specific customizations that should be preserved during upgrades.

## Customizations

<!-- Document any local changes to templates, workflows, or configuration -->

- [ ] Custom AGENTS.md additions
- [ ] Custom workflows
- [ ] Custom skills or commands
- [ ] Project-specific memory rules

EOF
}

create_project_config() {
    log_info "Creating project configuration..."
    
    cat > "$PROJECT_PATH/amazing-team.config.yaml" << EOF
# AI Team Project Configuration
# This file is project-specific and will not be overwritten during upgrades

project:
  name: "$PROJECT_NAME"
  description: "${DESCRIPTION:-My awesome project}"
  language: "$LANGUAGE"
  framework: "$FRAMEWORK"

ai_team:
  version: "$VERSION"
  
  agents:
    planner: true
    architect: true
    developer: true
    qa: true
    reviewer: true
    triage: true
    ci_analyst: true

  memory:
    enabled: true
    isolation: true
    failures_library: true

  task_system:
    enabled: true
    state_machine: true

rules:
  coding:
    max_function_lines: 30
    test_coverage_threshold: 80
  
  git:
    commit_convention: "conventional"
  
  governance:
    protected_paths:
      - "docs/architecture/"
      - "docs/decisions/"

# Add project-specific configuration below
EOF
}

generate_opencode_config() {
    log_info "Generating opencode.jsonc..."
    
    if [[ -f "$FOUNDATION_ROOT/.amazing-team/opencode.template.jsonc" ]]; then
        # Replace template variables
        sed -e "s/{{AI_TEAM_VERSION}}/$VERSION/g" \
            -e "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" \
            -e "s/{{PROJECT_DESCRIPTION}}/${DESCRIPTION:-My awesome project}/g" \
            -e "s/{{LANGUAGE}}/$LANGUAGE/g" \
            -e "s/{{FRAMEWORK}}/$FRAMEWORK/g" \
            "$FOUNDATION_ROOT/.amazing-team/opencode.template.jsonc" \
            > "$PROJECT_PATH/opencode.jsonc"
    fi
}

create_readme() {
    log_info "Creating README.md..."
    
    cat > "$PROJECT_PATH/README.md" << EOF
# $PROJECT_NAME

${DESCRIPTION:-}

## AI Team

This project uses [AI Team Foundation](https://github.com/your-org/amazing-team-foundation) v$VERSION.

### Quick Start

1. Configure GitHub Secrets:
   - \`ALIBABA_CODING_PLAN_API_KEY\` or \`OPENCODE_API_KEY\`

2. Create an Issue using a template

3. Trigger AI:
   \`\`\`
   /opencode use architect to analyze this issue
   \`\`\`

### Available Commands

| Command | Agent | Purpose |
|---------|-------|---------|
| \`/triage\` | Triage | Issue classification |
| \`/design\` | Architect | Design solution |
| \`/implement\` | Developer | Implement changes |
| \`/test\` | QA | Validate implementation |
| \`/review\` | Reviewer | Code review |
| \`/ci-analyze\` | CI Analyst | CI failure analysis |
| \`/release-check\` | Reviewer | Release readiness |

## Development

\`\`\`bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Validate AI Team setup
node scripts/validate_project_setup.cjs
\`\`\`

## License

MIT
EOF
}

print_next_steps() {
    echo ""
    log_success "Project initialized successfully!"
    echo ""
    echo -e "${CYAN}Project created at:${NC} $PROJECT_PATH"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. cd $PROJECT_PATH"
    echo "  2. Review and customize amazing-team.config.yaml"
    echo "  3. Add your GitHub secrets (ALIBABA_CODING_PLAN_API_KEY)"
    echo "  4. Create your first issue!"
    echo ""
    echo -e "${CYAN}Foundation version:${NC} $VERSION"
    if [[ -n "$OVERLAY" ]]; then
        echo -e "${CYAN}Overlay:${NC} $OVERLAY"
    fi
    echo ""
}

# Main execution
main() {
    parse_args "$@"
    check_prerequisites
    read_version
    
    log_info "Initializing project: $PROJECT_NAME"
    log_info "Foundation version: $VERSION"
    
    # Remove existing if force
    if [[ "$FORCE" == true ]] && [[ -d "$PROJECT_PATH" ]]; then
        log_warning "Removing existing directory..."
        rm -rf "$PROJECT_PATH"
    fi
    
    create_directory_structure
    copy_base_templates
    apply_overlay
    create_foundation_lock
    create_upgrade_history
    create_local_overrides
    create_project_config
    generate_opencode_config
    create_readme
    
    print_next_steps
}

main "$@"