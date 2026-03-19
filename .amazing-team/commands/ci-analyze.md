# /ci-analyze Command

## Purpose

Analyze CI pipeline failures and provide detailed investigation and resolution guidance.

## Usage

```
/ci-analyze [build-number]
/ci-analyze [branch-name]
/ci-analyze latest
```

## Examples

```
/ci-analyze 1234
/ci-analyze main
/ci-analyze latest
```

## Agent: CI Analyst

## Workflow

### 1. Gather Context

- Identify failed pipeline/build
- Collect error logs and stack traces
- Note failure timestamp and branch
- Identify triggering commit

### 2. Classify Failure

- Build failure (compilation, dependencies)
- Test failure (unit, integration, E2E)
- Infrastructure failure (resources, network)
- Code quality failure (lint, type, security)

### 3. Root Cause Analysis

- Examine error messages
- Review recent changes
- Check known patterns in failure library
- Compare with successful builds

### 4. Investigation

- Search for similar issues
- Check CI memory for patterns
- Review runbooks for guidance
- Identify affected components

### 5. Resolution Strategy

- Code fix: Identify files and changes
- Config fix: Identify configuration updates
- Infrastructure: Document and escalate

## Output

Produces a failure analysis document:

```markdown
## CI Failure Analysis: Build #[number]

### Summary
- **Pipeline**: [name]
- **Stage**: [failed stage]
- **Branch**: [branch]
- **Commit**: [hash]

### Classification
- **Type**: build | test | infrastructure | quality
- **Severity**: blocking | non-blocking
- **Pattern**: new | recurring | flaky

### Error Details
```
[Error logs]
```

### Root Cause
[Explanation]

### Affected Files
- `path/to/file.ts` - [Impact]

### Resolution
- **Fix Type**: code | config | infrastructure
- **Steps**:
  1. [Step 1]
  2. [Step 2]

### Prevention
[How to prevent recurrence]
```

## Skills Used

- ci-failure-analysis
- bugfix-playbook (for code issues)

## Memory Updates

- Update `.amazing-team/memory/failures/` if new pattern
- Update `.amazing-team/memory/ci-analyst/` with findings

## Next Steps

After `/ci-analyze`:
1. Review the analysis
2. Use `/implement` to apply fix
3. Verify fix in CI
4. Update knowledge base if needed