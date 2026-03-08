---
name: tanstack-query-patterns
description: Apply TanStack Query best practices for query keys, invalidation, and mutation side effects
---

## Rules
- Place query hooks in `src/hooks/queries`.
- Use deterministic array query keys.
- Invalidate related keys after mutations.
- Set stale/refetch behavior intentionally.
