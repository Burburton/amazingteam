# Design

## Issue: [Issue Title]

**Issue ID**: issue-XXX  
**Date**: YYYY-MM-DD

---

## Design Overview

[High-level description of the solution]

---

## Architecture

### Component Diagram

```
┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  Component  │
└─────────────┘     └─────────────┘
```

### Data Flow

```
Input → Process → Output
```

---

## Components

### [Component Name]

**Purpose**: [What it does]

**Responsibilities**:
- [Responsibility 1]
- [Responsibility 2]

**Interface**:
```typescript
interface ComponentName {
  method(): ReturnType;
}
```

---

## API Changes

### New Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/resource | [Description] |

### Modified Endpoints

| Method | Path | Change |
|--------|------|--------|
| | | |

---

## Database Changes

### New Tables

```sql
CREATE TABLE table_name (
  id SERIAL PRIMARY KEY,
  -- columns
);
```

### Modified Tables

| Table | Change |
|-------|--------|
| | |

---

## Security Considerations

- [Security consideration 1]
- [Security consideration 2]

---

## Performance Considerations

- [Performance consideration 1]
- [Performance consideration 2]

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| | |

---

## Implementation Plan

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Alternatives Considered

1. **[Alternative 1]**: [Why not chosen]
2. **[Alternative 2]**: [Why not chosen]