# Build Debug Runbook

## Symptoms

- Build fails with compilation errors
- Build fails with dependency errors
- Build succeeds locally but fails in CI
- Build timing out

## Investigation Steps

### 1. Check Error Messages

```bash
# Review the error output
# Look for:
# - Specific file and line numbers
# - Missing imports
# - Type mismatches
# - Module resolution failures
```

### 2. Check Environment Differences

```bash
# Compare local and CI environments
node --version
npm --version

# Check lock file
git diff package-lock.json

# Check for environment-specific config
git diff .env.example
```

### 3. Dependency Issues

```bash
# Clear caches and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Check for peer dependency issues
npm ls
```

### 4. Check for Missing Files

```bash
# Verify all referenced files exist
# Check for case-sensitivity issues
# Verify import paths
```

## Common Issues and Fixes

### TypeScript Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Cannot find module | Missing import or file | Add import or create file |
| Type 'X' is not assignable | Type mismatch | Fix type or add assertion |
| Property does not exist | Missing property | Add property or fix access |

### Dependency Errors

| Error | Cause | Fix |
|-------|-------|-----|
| ERESOLVE | Dependency conflict | Update dependencies or use --legacy-peer-deps |
| 404 Not Found | Package doesn't exist | Check package name |
| Permission denied | NPM registry auth | Check .npmrc |

### Memory Issues

| Error | Cause | Fix |
|-------|-------|-----|
| JavaScript heap out of memory | Large build | Increase NODE_OPTIONS |
| FATAL ERROR | Process killed | Reduce parallelism |

## Resolution

### Fix Compilation Errors

1. Identify error location from output
2. Fix the specific issue
3. Run build locally to verify
4. Commit and push

### Fix Dependency Issues

1. Check package.json for conflicts
2. Update lock file
3. Test installation from scratch
4. Commit lock file changes

### Fix Environment Issues

1. Update CI configuration
2. Add missing environment variables
3. Update Node.js version if needed
4. Test in CI

## Prevention

- Keep dependencies updated
- Use strict TypeScript config
- Run lint and typecheck in CI
- Keep build scripts simple
- Document build requirements

## Escalation

If unable to resolve:

1. Document all investigation steps
2. Note exact error messages
3. Check CI analyst memory for similar issues
4. Create issue with full context