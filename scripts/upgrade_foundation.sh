#!/bin/bash
# upgrade_foundation.sh
# Apply controlled upgrade to downstream project

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FOUNDATION_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="${1:-.}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Flags
FORCE=false
DRY_RUN=false
SKIP_PROTECTED=true

usage() {
    echo "Usage: $0 [OPTIONS] [project-path]"
    echo ""
    echo "Apply controlled foundation upgrade to a downstream project."
    echo ""
    echo "Options:"
    echo "  --force         Skip confirmation prompts"
    echo "  --dry-run       Show what would be done without making changes"
    echo "  --include-protected  Attempt to upgrade protected files (dangerous)"
    echo "  -h, --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 ./my-project"
    echo "  $0 --dry-run ."
    echo "  $0 --force ./my-project"
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force)
                FORCE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --include-protected)
                SKIP_PROTECTED=false
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                PROJECT_ROOT="$1"
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

log_dry_run() {
    echo -e "${BLUE}[DRY-RUN]${NC} Would: $1"
}

# File classification functions
is_class_a() {
    local file="$1"
    # Class A: Auto-generatable
    [[ "$file" == tasks/_template/* ]] && return 0
    [[ "$file" == .github/ISSUE_TEMPLATE/* ]] && return 0
    [[ "$file" == .amazing-team/memory/* ]] && return 0
    return 1
}

is_class_b() {
    local file="$1"
    # Class B: Review required
    [[ "$file" == .amazing-team/agents/* ]] && return 0
    [[ "$file" == .amazing-team/skills/* ]] && return 0
    [[ "$file" == .amazing-team/commands/* ]] && return 0
    [[ "$file" == .github/workflows/* ]] && return 0
    [[ "$file" == AGENTS.md ]] && return 0
    return 1
}

is_class_c() {
    local file="$1"
    # Class C: Protected
    [[ "$file" == docs/architecture/* ]] && return 0
    [[ "$file" == docs/decisions/* ]] && return 0
    return 1
}

is_protected() {
    local file="$1"
    if [[ "$SKIP_PROTECTED" == true ]] && is_class_c "$file"; then
        return 0
    fi
    return 1
}

# Backup function
create_backup() {
    local backup_dir="$PROJECT_ROOT/.foundation/backup-$(date +%Y%m%d-%H%M%S)"
    log_info "Creating backup at $backup_dir"
    
    if [[ "$DRY_RUN" == true ]]; then
        log_dry_run "create backup at $backup_dir"
    else
        mkdir -p "$backup_dir"
        # Backup key directories
        [[ -d "$PROJECT_ROOT/.amazing-team" ]] && cp -r "$PROJECT_ROOT/.amazing-team" "$backup_dir/"
        [[ -f "$PROJECT_ROOT/AGENTS.md" ]] && cp "$PROJECT_ROOT/AGENTS.md" "$backup_dir/"
        [[ -f "$PROJECT_ROOT/opencode.jsonc" ]] && cp "$PROJECT_ROOT/opencode.jsonc" "$backup_dir/"
    fi
}

# Add missing files
add_missing_files() {
    log_info "Adding missing files..."
    
    local added=0
    local skipped=0
    
    # Agents
    for agent in planner architect developer qa reviewer triage ci-analyst; do
        local target="$PROJECT_ROOT/.amazing-team/agents/$agent.md"
        local source="$FOUNDATION_ROOT/.amazing-team/agents/$agent.md"
        
        if [[ ! -f "$target" ]] && [[ -f "$source" ]]; then
            if [[ "$DRY_RUN" == true ]]; then
                log_dry_run "add $target"
            else
                mkdir -p "$(dirname "$target")"
                cp "$source" "$target"
                log_success "Added: .amazing-team/agents/$agent.md"
            fi
            ((added++))
        fi
    done
    
    # Skills
    for skill_dir in "$FOUNDATION_ROOT/.amazing-team/skills"/*; do
        if [[ -d "$skill_dir" ]]; then
            local skill=$(basename "$skill_dir")
            local target="$PROJECT_ROOT/.amazing-team/skills/$skill/skill.md"
            local source="$skill_dir/skill.md"
            
            if [[ ! -f "$target" ]] && [[ -f "$source" ]]; then
                if [[ "$DRY_RUN" == true ]]; then
                    log_dry_run "add $target"
                else
                    mkdir -p "$(dirname "$target")"
                    cp "$source" "$target"
                    log_success "Added: .amazing-team/skills/$skill/skill.md"
                fi
                ((added++))
            fi
        fi
    done
    
    # Memory directories
    for role in planner architect developer qa reviewer triage ci-analyst failures; do
        local target="$PROJECT_ROOT/.amazing-team/memory/$role"
        local source="$FOUNDATION_ROOT/.amazing-team/memory/$role"
        
        if [[ ! -d "$target" ]] && [[ -d "$source" ]]; then
            if [[ "$DRY_RUN" == true ]]; then
                log_dry_run "add $target/"
            else
                mkdir -p "$target"
                cp -r "$source"/* "$target/" 2>/dev/null || true
                log_success "Added: .amazing-team/memory/$role/"
            fi
            ((added++))
        fi
    done
    
    # Documentation zones
    for zone in patterns releases runbooks/ci; do
        local target="$PROJECT_ROOT/docs/$zone"
        local source="$FOUNDATION_ROOT/docs/$zone"
        
        if [[ ! -d "$target" ]] && [[ -d "$source" ]]; then
            if [[ "$DRY_RUN" == true ]]; then
                log_dry_run "add $target/"
            else
                mkdir -p "$target"
                cp -r "$source"/* "$target/" 2>/dev/null || true
                log_success "Added: docs/$zone/"
            fi
            ((added++))
        fi
    done
    
    echo ""
    log_info "Added: $added, Skipped: $skipped"
}

# Update outdated files (Class B only, with confirmation)
update_outdated_files() {
    log_info "Checking for outdated files..."
    
    local updated=0
    local skipped=0
    
    # Check agents (Class B)
    for agent in planner architect developer qa reviewer triage ci-analyst; do
        local target="$PROJECT_ROOT/.amazing-team/agents/$agent.md"
        local source="$FOUNDATION_ROOT/.amazing-team/agents/$agent.md"
        
        if [[ -f "$target" ]] && [[ -f "$source" ]]; then
            if ! diff -q "$source" "$target" > /dev/null 2>&1; then
                if [[ "$FORCE" == true ]]; then
                    if [[ "$DRY_RUN" == true ]]; then
                        log_dry_run "update $target"
                    else
                        cp "$source" "$target"
                        log_success "Updated: .amazing-team/agents/$agent.md"
                    fi
                    ((updated++))
                else
                    log_warning "Modified: .amazing-team/agents/$agent.md (use --force to update)"
                    ((skipped++))
                fi
            fi
        fi
    done
    
    echo ""
    log_info "Updated: $updated, Skipped (use --force): $skipped"
}

# Update lock file
update_lock_file() {
    local lock_file="$PROJECT_ROOT/.foundation/foundation.lock"
    local foundation_version=$(cat "$FOUNDATION_ROOT/VERSION")
    
    if [[ "$DRY_RUN" == true ]]; then
        log_dry_run "update $lock_file"
        return
    fi
    
    if [[ -f "$lock_file" ]]; then
        # Update version and last_upgrade_at
        sed -i "s/foundation_version:.*/foundation_version: $foundation_version/" "$lock_file"
        sed -i "s/last_upgrade_at:.*/last_upgrade_at: $(date -I)/" "$lock_file"
        log_success "Updated foundation.lock"
    fi
}

# Update upgrade history
update_upgrade_history() {
    local history_file="$PROJECT_ROOT/.foundation/upgrade-history.md"
    local foundation_version=$(cat "$FOUNDATION_ROOT/VERSION")
    local project_version="unknown"
    
    if [[ -f "$PROJECT_ROOT/.foundation/foundation.lock" ]]; then
        project_version=$(grep "foundation_version:" "$PROJECT_ROOT/.foundation/foundation.lock" | cut -d: -f2 | tr -d ' ')
    fi
    
    if [[ "$DRY_RUN" == true ]]; then
        log_dry_run "update $history_file"
        return
    fi
    
    cat >> "$history_file" << EOF

## Upgrade - $(date -I)

- **From Version**: $project_version
- **To Version**: $foundation_version
- **Action**: Controlled upgrade applied
- **Protected Files**: Skipped
- **Manual Review Required**: No

EOF
    
    log_success "Updated upgrade-history.md"
}

# Main
parse_args "$@"

# Resolve to absolute path
if [[ "${PROJECT_ROOT:0:1}" != "/" ]]; then
    PROJECT_ROOT="$(pwd)/$PROJECT_ROOT"
fi

FOUNDATION_VERSION=$(cat "$FOUNDATION_ROOT/VERSION" 2>/dev/null || echo "unknown")

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  AI Team Foundation Upgrade${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Foundation Version:${NC} $FOUNDATION_VERSION"
echo -e "${CYAN}Project Path:${NC}       $PROJECT_ROOT"
if [[ "$DRY_RUN" == true ]]; then
    echo -e "${BLUE}Mode:${NC}              DRY RUN (no changes will be made)"
fi
echo ""

# Check if project has foundation lock
if [[ ! -f "$PROJECT_ROOT/.foundation/foundation.lock" ]]; then
    log_warning "No foundation.lock found. Is this a foundation-initialized project?"
    if [[ "$FORCE" != true ]]; then
        echo "Use --force to proceed anyway."
        exit 1
    fi
fi

# Create backup
if [[ "$DRY_RUN" != true ]]; then
    create_backup
fi
echo ""

# Add missing files (Class A - always safe)
add_missing_files
echo ""

# Update outdated files (Class B - needs review/force)
update_outdated_files
echo ""

# Update metadata
update_lock_file
update_upgrade_history
echo ""

echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}Upgrade Complete${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Foundation upgraded to version:${NC} $FOUNDATION_VERSION"
echo ""
echo -e "Next steps:"
echo "  1. Review changes"
echo "  2. Run: ./scripts/validate_project_setup.sh $PROJECT_ROOT"
echo "  3. Run: npm test (or your test command)"
echo "  4. Commit changes"
echo ""