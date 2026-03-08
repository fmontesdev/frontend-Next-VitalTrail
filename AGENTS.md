# AGENTS.md
Guidance for agentic coding tools working in `frontend-Next-VitalTrail`.

## 1) Project Snapshot
- Stack: Next.js 15 (App Router), React, TypeScript, Tailwind CSS v3, TanStack Query, Axios, Formik + Yup.
- Backends: Symfony (primary, JWT auth) · Spring Boot (payments/subscriptions).
- Package manager: npm. Source root: `src/`. Path alias: `@/*` → `src/*`.
- IDs policy: frontend IDs are typed as `number`.
- `reactStrictMode: false` in `next.config.ts` (intentional — avoids double-invocation of effects).

## 2) Actual Repository Layout
```
src/
├── actions/         # Server actions — Prisma / SSR-only helpers
├── app/             # App Router: page.tsx, layout.tsx, route groups (browse)/ (home)/
├── auth/            # JWT cookie helpers (clientCookies.ts) + RBAC hooks (authorizations.ts)
├── components/      # Feature-sliced UI; subcomponents under ComponentName/components/
├── hooks/           # Custom React hooks (useAuth.ts, useSyncFilters.ts, useDistanceDelay.ts)
├── libs/            # Singletons: prisma.ts, queryClientConfig.ts
├── mutations/       # TanStack useMutation hooks by domain (authMutation.ts, etc.)
├── queries/         # TanStack useQuery hooks by domain (routeQuery.ts, etc.)
├── services/        # Axios service objects; apiService.ts is the central Axios client
└── shared/
    ├── interfaces/  # All TS types — entities/, props/, components/, filters/, params/
    └── utils/       # Pure utility functions (formatDate.ts, urlHelpers.ts, etc.)
```
Root: `prisma/schema.prisma`.

> Note: `src/schemas/` (Zod), `src/types/`, and `src/contexts/` do not exist. **Zod is not installed.**

## 3) Architectural Principles
- Default to **Client Components** (`'use client'`).
  Use Server Components only for SSR/metadata, SEO, or server-only data access.
- Keep features cohesive and vertically sliced:
  `components/profile/`, `services/profileService.ts`, `shared/interfaces/entities/user.ts`.
- Preserve public contracts; no opportunistic refactors.

### 3.1 Subcomponent Structure
```
components/RouteCard/
├── index.tsx (or RouteCard.tsx)
└── components/RouteCardBadge.tsx
```

## 4) App Router Conventions
- Files: `page.tsx`, `layout.tsx`; co-locate `loading.tsx`, `error.tsx`, `not-found.tsx` as needed.
- Route groups in use: `(browse)` (shared Header layout) and `(home)` (home-specific layout).
- SEO: export `metadata` or `generateMetadata` from `page.tsx` / `layout.tsx`.

## 5) Auth, RBAC and Session Rules
JWT tokens — `accessToken` + `refreshToken` — stored in cookies via `src/auth/clientCookies.ts`.

Roles: `admin` | `client`. Access rules: public → open; auth routes → any role; dashboard → `admin` only.

Mandatory Axios interceptor behavior (implemented in `src/services/apiService.ts`):
1. Attach `accessToken` as Bearer on every browser request.
2. On 401: call refresh endpoint with `refreshToken`.
3. Refresh success → store new tokens, retry the original request once.
4. Refresh failure → clear session, redirect to `/login`.
5. Single-flight refresh — one in-flight refresh at a time (prevent token storm).

## 6) Data & API Layer
- All HTTP goes through `apiService.ts` (four lazy Axios singletons: symfony/spring × browser/server).
- Browser instances inject Bearer token from cookie; server instances do not.
- Dual URL env vars: `NEXT_PUBLIC_*` for browser, `INTERNAL_*` for Docker SSR networking.
- Services export plain object literals: `export const RouteService = { getAll, getById, ... }`.
- Unwrap API envelopes inside service methods (e.g. `.then(data => data.route)`).
- Never swallow errors. No `console.log` in production code.

## 7) TanStack Query Rules
- Queries in `src/queries/`; mutations in `src/mutations/`.
- Deterministic array-based query keys; use key factories per domain.
- Invalidate related queries on mutation `onSuccess`.
- Use Query for server state; `useState`/`useReducer` for pure UI state.
- Set `staleTime`/`gcTime` explicitly when defaults are insufficient.

## 8) Form Validation
- **Formik + Yup** — not Zod. Zod is not installed.
- Define Yup schemas inline next to the form or in a co-located `*.schema.ts` file.
- Keep error messages user-facing and descriptive.

## 9) Naming Conventions
- **Components**: PascalCase file + default export (`RouteCard.tsx`)
- **Hooks**: `useXxx` camelCase (`useAuth.ts`, `useDistanceDelay.ts`)
- **Queries / Mutations**: camelCase by domain (`routeQuery.ts`, `authMutation.ts`)
- **Services**: camelCase by domain (`routeService.ts`, `profileService.ts`)
- **Interfaces (entities)**: PascalCase with `I`-prefix (`IRoute`, `IUser`, `IComment`)
- **Interfaces (props)**: `I`-prefix + Props suffix (`IRouteCardProps`, `IFiltersProps`)
- **Constants**: UPPER_SNAKE_CASE (`API_TIMEOUT_MS`)
- **Folders**: lowercase, responsibility-driven (`components/profile/`, `services/`)

## 10) Code Style
- **Indentation**: 4 spaces (`.vscode/settings.json` enforces `tabSize: 4`). No Prettier configured.
- **Quotes**: single quotes for all strings and directives.
- **`'use client'` directive**: must be the very first line of the file (before imports).
- **Import order** (observed convention):
  1. `'use client'` directive
  2. React + React hooks
  3. TanStack Query
  4. Next.js (`next/link`, `next/image`, `next/navigation`)
  5. Internal components
  6. Internal hooks / services / utils
  7. Interfaces / types
  8. Icon libraries (`@heroicons/react`)
- **Tailwind conditional classes**: template literals with ternary — `className={\`base ${condition ? 'active' : 'inactive'}\`}`. Avoid inline `style={}` unless unavoidable.
- **Prop type location**: shared reusable prop interfaces go in `shared/interfaces/props/`; one-off types may be inlined in the function signature.

## 11) TypeScript Guidelines
- `strict: true` is enabled — no unchecked `any`, no bare non-null assertion (`!`) without a comment.
- Target: ES2017. `moduleResolution: "bundler"`.
- Avoid type assertions (`as X`) unless narrowing is already proven by control flow.
- All new API response shapes need a corresponding interface in `shared/interfaces/entities/`.
- Infer types from Yup schemas (`InferType<typeof schema>`) where practical to avoid drift.

## 12) Prisma & Server Data
- Prisma access is **server-side only** — `src/actions/` or Server Components. Never in Client Components.
- Use the singleton from `src/libs/prisma.ts`.
- Use Prisma directly only when the Symfony API cannot serve the data (e.g. `CategoryRoute` list).

## 13) Environment Variables
```
DATABASE_URL                          # Prisma / PostgreSQL
NEXT_PUBLIC_SYMFONY_API_URL           # Browser → Symfony
INTERNAL_SYMFONY_API_URL              # SSR → Symfony (Docker internal network)
NEXT_PUBLIC_SPRINGBOOT_API_URL        # Browser → Spring Boot
INTERNAL_SPRINGBOOT_API_URL           # SSR → Spring Boot (Docker internal network)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
```

## 14) Commands to Validate Changes
```bash
npm run lint    # ESLint flat config: next/core-web-vitals + next/typescript
npm run build   # Production build + type-check (ESLint errors do NOT block build)
npm run dev     # Dev server with Turbopack (use npm run dev2 for without Turbopack)
```
**No test runner is configured** (Jest, Vitest, and Playwright are not installed).

## 15) Testing Policy
- No test runner configured; E2E is out of scope.
- Add targeted unit tests only for critical pure logic (utils, complex hooks).
- If adding tests, prefer Vitest — no config exists yet, document any setup here.

## 16) Agent Working Agreement
- Keep diffs minimal and task-scoped. No unrelated refactors.
- Preserve public contracts unless explicitly asked to change them.
- Run `npm run lint` and `npm run build` before finishing any non-trivial task.
- Update this file when new conventions are established.

## 17) Pre-PR Checklist
- `npm run lint` passes.
- `npm run build` passes for any change affecting production paths.
- No type regressions (`strict: true` must stay satisfied).
- No dead code, unused imports, or `console.log` introduced.
- New env vars documented in section 13.
