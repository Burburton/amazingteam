# Bootstrap Model

This document describes the self-bootstrap capability of AI Team Foundation.

## Philosophy

The foundation repository supports **controlled operational bootstrap**, not uncontrolled autonomous mutation.

### The Foundation Should Be Able To

- Initialize new downstream projects
- Validate its own integrity
- Validate downstream project setup
- Plan controlled upgrades
- Apply safe, reviewable upgrades
- Generate operational documentation

### The Foundation Should NOT Automatically

- Rewrite its own core governance
- Rewrite durable truth documents casually
- Upgrade all downstream projects without approval
- Merge downstream customizations back into foundation
- Overwrite protected project-specific configuration

## Capability Categories

### 1. Initialization Capability

**Purpose**: Create new downstream project repositories from the foundation.

**Responsibilities**:
- Copy base structure
- Apply selected overlay (if any)
- Initialize `.amazing-team/`, `.github/`, `docs/`, `tasks/`
- Create foundation lock metadata

**Script**: `scripts/init_project.sh`

**When to Use**:
- Starting a new project
- Creating a project from a specific overlay

---

### 2. Validation Capability

**Purpose**: Check structural completeness and policy compliance.

**Responsibilities**:
- Verify required directories
- Verify required templates
- Verify agent/skill/command files
- Verify version metadata

**Scripts**:
- `scripts/validate_foundation.sh` - Validate foundation itself
- `scripts/validate_project_setup.sh` - Validate downstream project

**When to Use**:
- After initialization
- After upgrade
- In CI pipeline
- Before release

---

### 3. Upgrade Planning Capability

**Purpose**: Compare downstream project with foundation release.

**Responsibilities**:
- Detect missing files
- Detect outdated templates
- Detect local overrides
- Classify upgrade risk
- Generate upgrade report

**Script**: `scripts/plan_upgrade.sh`

**When to Use**:
- When new foundation version is released
- Before applying upgrades
- To audit project drift

---

### 4. Controlled Upgrade Capability

**Purpose**: Apply upgrades after review and approval.

**Responsibilities**:
- Create missing directories
- Add new template files
- Patch allowed files
- Preserve local overrides
- Log upgrade history

**Script**: `scripts/upgrade_foundation.sh`

**Approval Gates**:
- Class A: May be automatic
- Class B: Requires review
- Class C: Requires explicit approval

---

### 5. Documentation Generation Capability

**Purpose**: Generate operational documentation.

**Responsibilities**:
- Generate structure docs
- Generate role/skill inventories
- Generate version docs

**Script**: `scripts/generate_docs.sh`

**When to Use**:
- After major changes
- For documentation updates
- To audit current state

---

## Operating Modes

### Mode A: init

Initialize a new project.

```bash
./scripts/init_project.sh my-project
./scripts/init_project.sh -o python-backend my-api
```

**Behavior**:
- Creates new scaffold
- Applies base templates
- Applies selected overlay
- Creates lock metadata
- Does NOT touch business code

---

### Mode B: validate

Validate structure (read-only).

```bash
./scripts/validate_foundation.sh
./scripts/validate_project_setup.sh /path/to/project
```

**Behavior**:
- Read-only
- No changes applied
- Returns validation report
- Identifies missing or inconsistent elements

---

### Mode C: plan-upgrade

Analyze upgrade requirements (read-only).

```bash
./scripts/plan_upgrade.sh /path/to/project
```

**Behavior**:
- Read-only
- Compares against foundation version
- Classifies changes
- Generates upgrade report
- Identifies conflicts

---

### Mode D: apply-upgrade

Perform controlled upgrade.

```bash
./scripts/upgrade_foundation.sh /path/to/project
./scripts/upgrade_foundation.sh --dry-run /path/to/project
```

**Behavior**:
- Applies only allowed changes
- Preserves local overrides
- Stops on protected conflicts
- Writes upgrade history
- Updates lock metadata

---

## File Classification

### Class A: Auto-Generatable

Safe to create or replace automatically.

**Examples**:
- Empty directory placeholders
- Task templates
- Issue templates
- Base workflow drafts
- Missing skill skeletons

**Upgrade Policy**: May be automatically created/replaced.

---

### Class B: Review Required

Can receive update proposals, but not silently overwritten.

**Examples**:
- `AGENTS.md`
- Agent prompt files
- Command files
- Skill definitions
- Workflow files

**Upgrade Policy**: Generate diff, human reviews, then apply.

---

### Class C: Protected

Must not be changed automatically without explicit approval.

**Examples**:
- `docs/architecture/`
- `docs/decisions/`
- Governance policy
- Standards policy

**Upgrade Policy**: Human-reviewed only. Never auto-modified.

---

## Approval Gates

### Gate 1: Additive Scaffold

**Examples**:
- Create missing folder
- Create missing template file

**Approval**: May be automatic

---

### Gate 2: Patch Proposal

**Examples**:
- Update `AGENTS.md`
- Update agent prompts
- Update workflow templates

**Approval**: Generate diff → Human review → Apply

---

### Gate 3: Protected Knowledge

**Examples**:
- Update `docs/architecture/`
- Update `docs/decisions/`
- Update governance policy

**Approval**: Human approval required before any write

---

### Gate 4: Multi-Project Rollout

**Examples**:
- Applying new foundation version to many projects

**Approval**: Per-project or explicitly approved batch process only

---

## Safe Operations

✅ **Allowed**:
- Create missing directories
- Create missing template files
- Generate documentation
- Validate repository structure
- Compare versions
- Generate upgrade plans
- Apply additive upgrades to safe file classes
- Update lock metadata
- Update upgrade history

❌ **Blocked by Default**:
- Rewrite durable truth docs automatically
- Overwrite local project overrides without confirmation
- Rewrite role policy arbitrarily
- Rewrite foundation governance without approval
- Mass-upgrade all downstream projects automatically
- Auto-merge downstream changes back into foundation

---

## Anti-Patterns

### Anti-Pattern 1: Infinite Self-Rewrite

The foundation automatically rewrites its own governance and role policies.

**Why Bad**: Destroys stability and traceability.

---

### Anti-Pattern 2: Automatic Global Rollout

A new foundation version pushes itself to every downstream project automatically.

**Why Bad**: Different projects have different risks and customizations.

---

### Anti-Pattern 3: Foundation as Business Repo

The foundation stores real project tasks and project-specific memory.

**Why Bad**: Breaks reusability.

---

### Anti-Pattern 4: No Lock File

Downstream projects do not record which foundation version they use.

**Why Bad**: Upgrades become chaotic.

---

### Anti-Pattern 5: No File Classification

All files are treated as equally safe to overwrite.

**Why Bad**: Critical governance or customized files get damaged.

---

## Summary

**The foundation should be self-bootstrapping, but not self-governing without human oversight.**

This is the correct balance for a reusable AI team foundation product.