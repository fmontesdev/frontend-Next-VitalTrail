---
name: api-integration-symfony-spring
description: Implement service-layer integrations for Symfony and Spring APIs with consistent contracts and error handling
---

## Goal
Integrate API calls through `src/services` using backend-aware modules and predictable return shapes.

## Rules
- Keep API calls out of components.
- Group services by domain/feature.
- Normalize backend response differences in service mappers.
- Return actionable errors; never swallow exceptions.
