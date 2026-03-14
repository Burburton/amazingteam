# Developer Memory - Build Issues

This file records build system knowledge and common issues encountered by the Developer agent.

---

## Build System Overview

### Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| TypeScript | 5.x | Language |
| npm | 10.x | Package manager |
| Jest | 29.x | Testing |
| ESLint | 8.x | Linting |

### Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript |
| `npm test` | Run tests |
| `npm run lint` | Check code style |
| `npm run typecheck` | Type checking |

---

## Build Issues Log

### [Date] - [Issue Title]

**Error**: [Error message or description]

**Cause**: [What caused the issue]

**Solution**: [How it was resolved]

**Prevention**: [How to avoid in future]

---

## Common Build Issues

### TypeScript Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Cannot find module | Missing import or path | Check import path |
| Type not assignable | Wrong type | Add type assertion or fix type |
| Property not exists | Missing property | Add property or use optional chaining |

### Test Failures

| Error | Cause | Solution |
|-------|-------|----------|
| Timeout | Async operation slow | Increase timeout or fix async |
| Mock not working | Incorrect mock setup | Check mock configuration |
| Snapshot mismatch | Output changed | Update snapshot if expected |

### Dependency Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Version conflict | Incompatible versions | Use resolutions or update |
| Missing peer dependency | Not installed | Install peer dependency |
| Security vulnerability | Outdated package | Update to secure version |

---

## Build Configuration

### tsconfig.json Key Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Jest Configuration

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80 }
  }
};
```

---

## CI/CD Notes

### GitHub Actions Workflow

- Build runs on: `ubuntu-latest`
- Node version: 20
- Cache: npm
- Steps: install → lint → typecheck → test → build

---

## Notes

- Document any build issues and their solutions
- Keep track of configuration changes
- Note performance optimization opportunities