---
name: next-client-components-default
description: Apply project rule where Next.js features default to Client Components unless server-only benefits are explicit
---

## Project-specific rule
For this project, default to Client Components when implementing features.

Use Server Components only when there is a clear server-side advantage:
- metadata/SEO (`generateMetadata`)
- server-only secure processing
- explicit performance/security constraints

## Checklist
- Client/server boundary stated in implementation notes.
- `"use client"` only where required (not sprayed everywhere).
