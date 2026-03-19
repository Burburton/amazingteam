# Foundation Repo Self-Bootstrap Capability Design
## Design Specification for a Reusable `amazing-team-foundation` Repository

This document defines the **self-bootstrap capability model** for a reusable `amazing-team-foundation` repository.

The purpose of this design is to make the foundation repository capable of:

- initializing new downstream project repositories
- validating its own integrity
- validating downstream project setup
- planning controlled upgrades
- applying safe, reviewable upgrades
- generating operational documentation

At the same time, this design explicitly prevents the foundation from becoming an uncontrolled self-modifying system.

The key principle is:

**The foundation repository should be able to bootstrap, validate, and upgrade in a controlled way, but it should not behave like an autonomous self-rewriting platform.**

---

# 1. Why Self-Bootstrap Matters

A reusable AI team foundation repository is not just a static template.
It is a long-lived reusable engineering base.

If it has no bootstrap capability, every downstream project will require:

- manual setup
- inconsistent structure
- ad hoc upgrades
- repeated mistakes
- weak reuse

If it has too much bootstrap capability, it becomes dangerous:

- it may rewrite its own core rules
- it may drift over time
- it may overwrite downstream project customizations
- it may spread unstable policy changes

Therefore, self-bootstrap must be **explicitly scoped**.

---

# 2. Bootstrap Design Principle

The foundation should support **controlled operational bootstrap**, not uncontrolled autonomous mutation.

Recommended capability boundary:

## The foundation should be able to:
- initialize
- validate
- diff
- plan upgrades
- apply approved upgrades
- generate documentation
- generate missing scaffolding

## The foundation should not automatically:
- rewrite its own core governance
- rewrite durable truth documents casually
- upgrade all downstream projects without approval
- merge downstream project customizations back into foundation
- overwrite protected project-specific configuration silently

---

# 3. Capability Categories

The bootstrap system should be divided into five capability categories.

## 3.1 Initialization Capability

Purpose:
Create a new downstream project repository from the foundation base and optional overlays.

Typical responsibilities:
- copy base structure
- apply selected overlay
- initialize `.opencode/`
- initialize `.github/`
- initialize `docs/`
- initialize `tasks/`
- create foundation lock metadata

This is required.

---

## 3.2 Validation Capability

Purpose:
Check whether the foundation or a downstream project is structurally complete and policy-compliant.

Typical responsibilities:
- verify required directories
- verify required templates
- verify required agent files
- verify required workflow files
- verify version metadata
- verify task template integrity
- verify memory layout integrity

This is required.

---

## 3.3 Upgrade Planning Capability

Purpose:
Compare current downstream project state with the current foundation release and generate a safe upgrade plan.

Typical responsibilities:
- detect missing files
- detect outdated template files
- detect overlay mismatch
- detect local overrides
- classify upgrade as breaking or non-breaking
- generate diff and change plan

This is required.

---

## 3.4 Controlled Upgrade Application Capability

Purpose:
Apply upgrades only after review and approval.

Typical responsibilities:
- create missing directories
- add new template files
- patch allowed files
- preserve local overrides
- log upgrade history
- stop on protected file conflicts

This is required, but must be gated.

---

## 3.5 Documentation Generation Capability

Purpose:
Generate operational docs for both foundation maintainers and downstream users.

Typical responsibilities:
- generate structure docs
- generate upgrade docs
- generate version docs
- generate role inventory docs
- generate overlay inventory docs
- generate bootstrap usage docs

This is strongly recommended.

---

# 4. Capability Modes

The bootstrap system should support four explicit operating modes.

## Mode A — init

Used when creating a new project from the foundation.

Expected behavior:
- create a new scaffold
- apply base templates
- apply selected overlay
- create lock metadata
- do not touch business code

Example command concept:
- `init_project.sh`

---

## Mode B — validate

Used to inspect the health of either:
- the foundation itself
- a downstream project

Expected behavior:
- read-only
- no changes applied
- returns a validation report
- identifies missing or inconsistent elements

Example command concepts:
- `validate_foundation.sh`
- `validate_project_setup.sh`

---

## Mode C — plan-upgrade

Used to analyze how a downstream project differs from the current foundation release.

Expected behavior:
- read-only
- compare current state against foundation version
- classify changes
- generate upgrade report
- identify risky conflicts

Example command concept:
- `plan_upgrade.sh`

---

## Mode D — apply-upgrade

Used to perform a controlled upgrade on a downstream project after explicit approval.

Expected behavior:
- apply only allowed changes
- preserve local overrides
- stop on protected conflicts
- write upgrade history
- update lock metadata

Example command concept:
- `upgrade_foundation.sh`

---

# 5. Recommended Repository Structure for Bootstrap

```text
amazing-team-foundation/
├─ base/
│  ├─ .github/
│  ├─ .opencode/
│  ├─ docs/
│  ├─ tasks/
│  └─ AGENTS.md
│
├─ overlays/
│  ├─ cpp-qt-desktop/
│  ├─ python-backend/
│  ├─ web-fullstack/
│  └─ ai-agent-product/
│
├─ scripts/
│  ├─ init_project.sh
│  ├─ validate_foundation.sh
│  ├─ validate_project_setup.sh
│  ├─ plan_upgrade.sh
│  ├─ upgrade_foundation.sh
│  ├─ diff_foundation_vs_project.sh
│  └─ generate_docs.sh
│
├─ docs/
│  ├─ how-to-use.md
│  ├─ bootstrap-model.md
│  ├─ upgrade-policy.md
│  ├─ versioning.md
│  └─ overlay-guide.md
│
├─ examples/
│  ├─ minimal-project/
│  └─ cpp-qt-project/
│
├─ VERSION
└─ CHANGELOG.md
```

This structure keeps bootstrap logic separate from reusable base content.

---

# 6. Separation Between Foundation and Downstream Projects

This is the most important architectural rule.

## Foundation repository should contain:
- reusable templates
- reusable roles
- reusable skills
- reusable commands
- reusable workflows
- reusable governance model
- reusable memory layout template
- bootstrap scripts
- upgrade policy
- example overlays

## Downstream project repositories should contain:
- business code
- project-specific memory
- project-specific architecture
- project-specific decisions
- real tasks
- project-specific task state
- project-specific CI behavior
- project-specific command customizations where needed

This separation prevents upstream/downstream contamination.

---

# 7. Version and Lock Design

The foundation should use explicit version tracking.

## 7.1 Foundation Version

The foundation repository must include:

```text
VERSION
CHANGELOG.md
docs/upgrade-policy.md
```

### VERSION
Stores the current release version of the foundation.

### CHANGELOG.md
Describes:
- new features
- changed files
- deprecated elements
- breaking changes
- migration notes

### upgrade-policy.md
Describes:
- what can be upgraded automatically
- what requires manual review
- what is protected

---

## 7.2 Project Lock File

Each downstream project should contain a lock file such as:

```text
.foundation/foundation.lock
```

Recommended contents:

```yaml
foundation_repo: amazing-team-foundation
foundation_version: 2.0.0
overlay: cpp-qt-desktop
initialized_at: 2026-03-14
last_upgrade_at: 2026-03-20
upgrade_policy: controlled
```

This file allows downstream projects to know:
- what they were initialized from
- what version they are on
- what overlay was used
- whether they are behind the latest release

---

## 7.3 Upgrade History File

Each downstream project should also maintain:

```text
.foundation/upgrade-history.md
```

This should record:
- upgrade date
- from version
- to version
- files added
- files skipped
- conflicts found
- manual decisions taken

This is critical for auditability.

---

# 8. Local Override Design

Downstream projects will almost always need local customization.

To avoid destructive upgrades, each downstream project should maintain:

```text
.foundation/local-overrides.md
```

This file should describe local changes such as:
- custom role prompt modifications
- project-specific AGENTS.md additions
- extra workflow behavior
- custom memory rules
- custom commands or skills

Upgrade tools should read this file and treat it as a preservation source.

---

# 9. File Classification Policy

All files in the foundation model should be classified into three levels.

## Class A — Auto-Generatable

These files may be safely created or replaced when missing:

Examples:
- empty directory placeholders
- task templates
- issue templates
- base workflow drafts
- example docs
- missing skill skeletons

Rule:
Safe for automated creation.

---

## Class B — Auto-Suggested, Not Auto-Committed

These files may receive generated diffs or update proposals, but should not be silently overwritten:

Examples:
- `AGENTS.md`
- role prompt files
- command files
- certain workflow files
- skill definitions

Rule:
Can be patched only after review.

---

## Class C — Protected Governance / Durable Truth

These files must not be changed automatically without explicit approval:

Examples:
- `docs/architecture/`
- `docs/decisions/`
- governance policy
- standards policy
- release rules
- protected memory policy docs

Rule:
Human-reviewed only.

This classification model is essential for safe bootstrap behavior.

---

# 10. Safe Bootstrap Boundaries

The bootstrap system should be limited to the following safe operations.

## Safe Operations
- create missing directories
- create missing template files
- generate documentation
- validate repository structure
- compare versions
- generate upgrade plans
- apply additive upgrades to approved file classes
- update lock metadata
- update upgrade history

## Unsafe Operations
- rewrite durable truth docs automatically
- overwrite local project overrides without confirmation
- rewrite role policy arbitrarily
- rewrite foundation governance without approval
- mass-upgrade all downstream projects automatically
- auto-merge downstream project changes back into foundation

Unsafe operations should be blocked by default.

---

# 11. Foundation Self-Bootstrap vs Self-Modification

A critical distinction must be preserved.

## Self-Bootstrap means:
- generating structure
- validating structure
- upgrading structure in a controlled way
- generating documentation
- improving operational scaffolding

## Uncontrolled Self-Modification means:
- rewriting core governance
- mutating policy sources without review
- redefining protected role boundaries silently
- changing versioned truth without approval

The foundation should support the first and block the second.

---

# 12. Suggested Script Responsibilities

## `init_project.sh`

Purpose:
Initialize a new downstream project.

Should:
- copy base templates
- apply selected overlay
- create `.foundation/foundation.lock`
- create local project skeleton docs
- preserve empty project source layout

Should not:
- modify business code
- write real architecture decisions
- infer project-specific truth automatically

---

## `validate_foundation.sh`

Purpose:
Validate the foundation repository itself.

Should:
- verify required directories
- verify required scripts
- verify required templates
- verify overlay completeness
- verify docs coverage
- verify version/changelog consistency

Should not:
- auto-fix protected files silently

---

## `validate_project_setup.sh`

Purpose:
Validate that a downstream project is correctly initialized from the foundation.

Should:
- verify lock file
- verify required directories
- verify role and skill scaffolding
- verify tasks template presence
- verify workflow presence
- detect missing docs skeletons

Should not:
- overwrite project customizations

---

## `plan_upgrade.sh`

Purpose:
Generate an upgrade plan for a downstream project.

Should:
- compare downstream state against foundation release
- detect missing files
- detect outdated templates
- detect local overrides
- detect protected file conflicts
- produce a readable upgrade report

Should not:
- mutate files directly

---

## `upgrade_foundation.sh`

Purpose:
Apply approved upgrades to a downstream project.

Should:
- use lock metadata
- apply allowed non-destructive changes
- skip protected files by default
- log all actions
- update upgrade history
- stop on conflicts requiring manual review

Should not:
- overwrite protected local customizations
- write durable truth automatically

---

## `diff_foundation_vs_project.sh`

Purpose:
Provide a structured comparison report.

Should:
- show file-level differences
- show missing additions
- classify differences by file class
- identify whether changes are:
  - additive
  - patchable
  - protected
  - breaking

This is useful before an upgrade.

---

## `generate_docs.sh`

Purpose:
Generate documentation snapshots.

Should:
- describe repository layout
- list role files
- list skills
- list overlays
- summarize current version
- summarize upgrade path

Should not:
- generate fake project-specific decisions

---

# 13. Approval Gates

The bootstrap system should use explicit approval gates.

## Gate 1 — Additive Scaffold Gate
Examples:
- create missing folder
- create missing template file

Approval model:
May be automatic.

---

## Gate 2 — Patch Proposal Gate
Examples:
- update `AGENTS.md`
- update role prompt
- update workflow template
- update command file

Approval model:
Generate diff first, human reviews, then apply.

---

## Gate 3 — Protected Knowledge Gate
Examples:
- update `docs/architecture/`
- update `docs/decisions/`
- update governance policy
- update release policy

Approval model:
Human approval required before any write.

---

## Gate 4 — Multi-Project Rollout Gate
Examples:
- applying a new foundation version to many downstream repos

Approval model:
Per-project or explicitly approved batch process only.

The foundation should never assume mass rollout is safe.

---

# 14. Upstream vs Downstream Knowledge Flow

This must be carefully designed.

## Allowed upstream flow
Downstream projects may produce:
- lessons learned
- repeated failure patterns
- reusable patterns
- improved role ideas

These may be reviewed and extracted manually into the foundation.

---

## Disallowed upstream flow
Downstream projects should not automatically push back:
- task memory
- project-specific architecture
- local hacks
- weakened governance
- low-quality prompt shortcuts

In other words:
- downstream experience may inform foundation
- but downstream state must not automatically rewrite foundation

---

# 15. Recommended Downstream Metadata Layout

Each downstream project should include:

```text
.foundation/
├─ foundation.lock
├─ local-overrides.md
├─ upgrade-history.md
└─ validation-report.md
```

Purpose of each file:

- `foundation.lock` = current linked foundation version
- `local-overrides.md` = project-specific template deviations
- `upgrade-history.md` = applied upgrade record
- `validation-report.md` = latest structure check result

This makes the system easier to govern over time.

---

# 16. Bootstrap Lifecycle

A healthy bootstrap lifecycle should look like this.

## Stage 1 — Foundation Release
The foundation publishes a new version.

Artifacts:
- VERSION update
- CHANGELOG update
- upgrade notes
- new or changed templates

---

## Stage 2 — New Project Initialization
A new downstream project is created.

Actions:
- run init
- select overlay
- create project lock
- create base structure

---

## Stage 3 — Project Customization
The downstream project adds:
- business code
- project-specific build/test commands
- project-specific AGENTS.md additions
- project-specific docs and task flow

---

## Stage 4 — Foundation Upgrade Planning
Later, the downstream project wants to adopt a newer foundation version.

Actions:
- run validate
- run plan-upgrade
- inspect conflicts
- inspect local overrides

---

## Stage 5 — Controlled Upgrade
Actions:
- apply approved upgrade
- preserve project local customizations
- update lock metadata
- record history

This lifecycle should be repeatable and auditable.

---

# 17. Anti-Patterns to Avoid

The foundation design should explicitly avoid these anti-patterns.

## Anti-Pattern 1 — Infinite Self-Rewrite
The foundation automatically rewrites its own governance and role policies.

Why bad:
It destroys stability and traceability.

---

## Anti-Pattern 2 — Automatic Global Rollout
A new foundation version pushes itself to every downstream project automatically.

Why bad:
Different projects have different risks and customizations.

---

## Anti-Pattern 3 — Foundation as Business Repo
The foundation stores real project tasks and project-specific memory.

Why bad:
It breaks reusability.

---

## Anti-Pattern 4 — No Lock File
Downstream projects do not record which foundation version they use.

Why bad:
Upgrades become chaotic.

---

## Anti-Pattern 5 — No File Classification
All files are treated as equally safe to overwrite.

Why bad:
Critical governance or customized files get damaged.

---

# 18. Recommended Governance Policy for Bootstrap

The foundation bootstrap policy should be summarized as follows.

## Automatic actions allowed
- create missing scaffold
- validate structure
- generate docs
- generate upgrade plan
- apply additive non-breaking changes to safe file classes

## Human review required
- changes to role behavior
- changes to workflows
- changes to commands
- changes to AGENTS.md
- changes to project-level protected templates

## Human approval mandatory
- changes to durable truth
- changes to governance policy
- changes to release policy
- mass rollouts
- any breaking upgrade

---

# 19. Minimal Viable Bootstrap Capability

If you want a minimal but correct first version, the bootstrap system only needs:

- `init_project.sh`
- `validate_foundation.sh`
- `validate_project_setup.sh`
- `plan_upgrade.sh`
- `upgrade_foundation.sh`
- `foundation.lock`
- `upgrade-history.md`
- file classification policy
- approval gates

This is enough to support real reuse safely.

---

# 20. Final Design Summary

A reusable `amazing-team-foundation` repository should absolutely have self-bootstrap capability.

But that capability must be controlled, versioned, and review-aware.

The correct design is:

- bootstrap for initialization
- bootstrap for validation
- bootstrap for upgrade planning
- bootstrap for controlled upgrade execution

The incorrect design is:

- unrestricted self-rewriting
- unrestricted downstream overwriting
- automatic upstream contamination
- silent governance mutation

In short:

**The foundation should be self-bootstrapping, but not self-governing without human oversight.**

That is the correct balance for a reusable AI team foundation product.
