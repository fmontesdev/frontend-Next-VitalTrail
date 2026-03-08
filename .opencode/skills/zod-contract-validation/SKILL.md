---
name: zod-contract-validation
description: Validate API payloads and responses with Zod schemas and inferred types
---

## Rules
- Create/update schemas in `src/schemas/<feature>`.
- Parse external payloads at service boundaries.
- Export inferred types when useful to avoid duplication.
- Keep validation messages useful for debugging and UX.
