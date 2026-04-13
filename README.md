# VitalTrail — Frontend

> **Explora el exterior, equilibra tu interior.**

Aplicación web para descubrir, publicar y registrar rutas al aire libre. Los usuarios pueden explorar rutas por categoría, seguir a otros senderistas, registrar sesiones en tiempo real con GPS, y gestionar su perfil. Incluye panel de administración y suscripciones Premium mediante Stripe.

---

## Índice

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Funcionalidades](#funcionalidades)
- [Backends](#backends)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Capa de datos](#capa-de-datos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y desarrollo](#instalación-y-desarrollo)
- [Docker](#docker)
- [Comandos disponibles](#comandos-disponibles)
- [Convenciones de código](#convenciones-de-código)
- [Sistema de colores](#sistema-de-colores)

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| UI | React 18, Tailwind CSS v3, Framer Motion |
| Estado servidor | TanStack Query v5 |
| Formularios | Formik + Yup |
| HTTP | Axios |
| Mapas | Leaflet + React-Leaflet |
| Gráficos | Recharts |
| Pagos | Stripe.js |
| Carruseles | Embla Carousel |
| Base de datos (SSR) | Prisma + PostgreSQL |
| Lenguaje | TypeScript 5 (strict mode) |
| Linting | ESLint (next/core-web-vitals + next/typescript) |

---

## Arquitectura

El frontend sigue un modelo de **Client Components por defecto**. Los Server Components se usan exclusivamente cuando hay un beneficio claro: SSR para SEO, acceso a base de datos vía Prisma, o generación de metadatos.

Las funcionalidades están organizadas de forma **vertical** (feature slices): cada dominio agrupa su componente, servicio, query y mutación. No existe una carpeta global de "state" ni "store" — el estado de servidor vive en TanStack Query y el estado de UI en `useState`/`useReducer` local.

```
HTTP → apiService.ts (Axios singletons)
         ├── symfony-browser / symfony-server
         └── spring-browser  / spring-server
              ↓
         services/*.ts  (contratos de dominio)
              ↓
    queries/*.ts   mutations/*.ts   (TanStack Query)
              ↓
         components/**  (UI)
```

El servicio `apiService.ts` expone **cuatro instancias Axios lazy**: Symfony y Spring Boot × browser y server. Las instancias de browser inyectan automáticamente el `Bearer` token desde la cookie en cada petición.

---

## Estructura del proyecto

```
src/
├── actions/          # Server Actions — acceso a Prisma, solo SSR
├── app/
│   ├── (home)/       # Landing page (layout propio con hero header)
│   ├── (browse)/     # Rutas públicas/auth con header estándar
│   │   ├── routes/         # Listado y creación de rutas
│   │   ├── route/[slug]/   # Detalle de ruta
│   │   ├── tracking/       # Rastreo GPS en vivo
│   │   ├── profile/[username]/
│   │   ├── premium/        # Checkout Stripe
│   │   ├── login/
│   │   └── register/
│   └── (admin)/      # Panel de administración (ROLE_ADMIN)
│       └── admin/
│           ├── users/
│           ├── routes/
│           ├── subscriptions/
│           └── notifications/
├── auth/             # JWT cookie helpers + hooks RBAC
├── components/       # UI organizado por dominio
├── hooks/            # Custom hooks (useAuth, useSyncFilters, ...)
├── libs/             # Singletons: prisma.ts, queryClientConfig.ts
├── mutations/        # TanStack useMutation por dominio
├── queries/          # TanStack useQuery por dominio
├── services/         # Objetos de servicio Axios por dominio
└── shared/
    ├── interfaces/   # Tipos TS: entities/, props/, filters/, params/
    └── utils/        # Utilidades puras (formatDate, urlHelpers, ...)
```

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing con categorías, rutas trending y rutas cercanas |
| `/routes` | Público | Listado de rutas con filtros avanzados |
| `/routes/new` | Auth | Crear nueva ruta |
| `/route/[slug]` | Público | Detalle: mapa, galería, comentarios, valoraciones |
| `/tracking` | Auth | Rastreo GPS en tiempo real con sesión activa |
| `/profile/[username]` | Auth | Perfil: rutas, sesiones, comentarios, favoritos, seguidores |
| `/premium` | Auth | Checkout de suscripción Premium via Stripe |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro con selector de avatar |
| `/admin` | Admin | Dashboard de administración |
| `/admin/users` | Admin | Gestión de usuarios |
| `/admin/routes` | Admin | Gestión de rutas |
| `/admin/subscriptions` | Admin | Gestión de suscripciones |
| `/admin/notifications` | Admin | Envío de notificaciones segmentadas |

---

## Funcionalidades

### Exploración de rutas
- Filtros por dificultad, distancia, duración, tipo, categoría y localización
- Vista de listado con mapa integrado (React-Leaflet)
- Rutas trending y rutas cercanas en la landing
- Grid de categorías con imágenes

### Detalle de ruta
- Mapa interactivo con trazado GPS
- Galería de imágenes en carrusel
- Estadísticas: distancia, duración, dificultad, tipo
- Sistema de comentarios con valoración (1–5 estrellas)
- Botón de favorito
- Sesiones registradas para esa ruta

### Rastreo GPS
- Sesión activa con banner persistente en header
- Seguimiento en tiempo real con `navigator.geolocation`
- Visualización de recorrido en mapa en vivo
- Registro de sesión al finalizar (distancia, duración, puntos GPS)

### Perfiles de usuario
- Rutas publicadas, sesiones registradas, comentarios, favoritos
- Seguir / dejar de seguir usuarios
- Lista de seguidores y seguidos
- Tabs adaptados según si es el perfil propio o ajeno
- Avatar personalizable (18 opciones predefinidas)

### Notificaciones
- Campana con contador de no leídas en el header
- Panel dropdown con listado de notificaciones
- Vista completa en perfil con historial

### Suscripción Premium
- Checkout integrado con Stripe
- Planes mensual y anual
- Gestión de suscripciones activas desde panel admin

### Panel de administración
- CRUD de usuarios, rutas y suscripciones
- Envío de notificaciones segmentadas por tipo (todos, rol, usuario específico)
- Estadísticas y métricas

### Logros (Achievements)
- Sistema de logros por actividad, desbloqueables por usuario

### Check-in de bienestar
- Registro periódico del estado de bienestar del usuario post-sesión

---

## Backends

El frontend consume **dos APIs independientes**:

| Backend | Responsabilidad | URL (dev) |
|---|---|---|
| **Symfony** | Auth, usuarios, rutas, comentarios, valoraciones, notificaciones, seguidores, favoritos | `http://localhost:8000/api` |
| **Spring Boot** | Pagos, suscripciones, planes Premium | `http://localhost:8080` |

Cada backend tiene dos instancias Axios: una para el browser (URL pública) y otra para SSR dentro de Docker (URL interna de red).

---

## Autenticación y autorización

- Tokens JWT almacenados en cookies: `token` (1 día) y `refreshToken` (7 días)
- Interceptor de request en `apiService.ts`: adjunta `Authorization: Bearer <token>` en toda petición de browser
- Flujo de refresh automático: en 401 → llama al endpoint de refresh → reintenta la petición original una vez → si falla, limpia sesión y redirige a `/login`
- **Roles**: `ROLE_CLIENT` (usuario estándar) | `ROLE_ADMIN` (acceso completo)
- Guards en servicios: `src/services/guards/`

---

## Capa de datos

### Servicios (`src/services/`)
Objetos planos que encapsulan las llamadas HTTP y desenvuelven los envelopes de la API:

```ts
export const RouteService = {
    getAll: (params) => symfonyApi().get('/routes', { params }).then(r => r.data),
    getBySlug: (slug) => symfonyApi().get(`/routes/${slug}`).then(r => r.data.route),
    // ...
};
```

### Queries (`src/queries/`)
Hooks de TanStack Query con query keys deterministas por dominio:

```ts
export const routeKeys = {
    all: ['routes'] as const,
    filtered: (filters) => [...routeKeys.all, filters] as const,
    detail: (slug: string) => ['route', slug] as const,
};
```

### Mutations (`src/mutations/`)
Hooks de TanStack `useMutation` con invalidación de queries relacionadas en `onSuccess`.

### Prisma (`src/actions/`)
Acceso directo a PostgreSQL exclusivamente desde Server Actions o Server Components. Nunca desde Client Components. Usa el singleton de `src/libs/prisma.ts`.

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz con:

```env
# Base de datos (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/vitaltrail

# Symfony API
NEXT_PUBLIC_SYMFONY_API_URL=http://localhost:8000/api
INTERNAL_SYMFONY_API_URL=http://symfony:8000/api

# Spring Boot API
NEXT_PUBLIC_SPRINGBOOT_API_URL=http://localhost:8080
INTERNAL_SPRINGBOOT_API_URL=http://springboot:8080

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID=price_...
```

> Las variables `NEXT_PUBLIC_*` son accesibles en el browser. Las `INTERNAL_*` solo en SSR (red interna Docker).

---

## Instalación y desarrollo

### Requisitos
- Node.js 20+
- npm
- Docker + Docker Compose (recomendado para el stack completo)

### Sin Docker (solo frontend)

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Levantar servidor de desarrollo
npm run dev
```

### Con Docker (stack completo)

Ver sección [Docker](#docker) más abajo.

---

## Docker

El proyecto corre dentro de Docker Compose. El `docker-compose.yaml` está en la raíz del monorepo (`/VitalTrail/`).

El código fuente está **montado como bind mount**, lo que significa que cualquier cambio en `.ts` / `.tsx` / `.css` se refleja automáticamente vía hot reload de Turbopack — **no requiere rebuild**.

```bash
# Desde /VitalTrail/

# Levantar todos los servicios
docker compose up

# Solo el frontend
docker compose up next

# Rebuild (solo cuando cambien package.json o package-lock.json)
docker compose down -v && docker compose up --build next

# Ejecutar comandos dentro del contenedor
docker compose exec next npm run lint
docker compose exec -e NODE_ENV=production next npm run build
```

> **Importante:** `npm run build` dentro del contenedor requiere `NODE_ENV=production` explícito. Sin él, Next.js 15.2.x lanza un error relacionado con `<Html>` en entorno de desarrollo.

---

## Comandos disponibles

```bash
npm run dev       # Servidor de desarrollo con Turbopack (puerto 3000)
npm run dev2      # Servidor de desarrollo sin Turbopack
npm run build     # Build de producción + type-check
npm run start     # Servidor de producción
npm run lint      # ESLint (next/core-web-vitals + next/typescript)
```

> No hay test runner configurado. Las pruebas unitarias (si se agregan) usarán Vitest.

---

## Convenciones de código

| Elemento | Convención |
|---|---|
| Indentación | 4 espacios |
| Comillas | Simples |
| Componentes | PascalCase (`RouteCard.tsx`) |
| Hooks | `useXxx` camelCase |
| Queries / Mutations | camelCase por dominio (`routeQuery.ts`) |
| Interfaces entidades | `I`-prefix PascalCase (`IRoute`, `IUser`) |
| Interfaces props | `I`-prefix + `Props` (`IRouteCardProps`) |
| Constantes | `UPPER_SNAKE_CASE` |
| Carpetas | lowercase, orientadas a responsabilidad |
| `'use client'` | Primera línea del archivo, antes de imports |

### Estructura de subcomponentes

```
components/RouteCard/
├── index.tsx               ← componente principal
└── components/
    └── RouteCardBadge.tsx
```

### Orden de imports

```ts
'use client';

import { useState } from 'react';                          // React
import { useQuery } from '@tanstack/react-query';          // TanStack
import Link from 'next/link';                              // Next.js
import { RouteCard } from '@/components/routes/RouteCard'; // componentes internos
import { useAuth } from '@/hooks/useAuth';                 // hooks / services / utils
import type { IRoute } from '@/shared/interfaces/...';     // tipos
import { MapIcon } from '@heroicons/react/24/outline';     // iconos
```

---

## Sistema de colores

VitalTrail usa dos familias de colores Tailwind con roles **no intercambiables**:

| Color | Rol | Ejemplos de uso |
|---|---|---|
| `teal` | Identidad / contenido | Títulos H1/H2, datos de ruta, nombres de autor, footer (`teal-800`), logo "Trail" |
| `lime` | Acción / energía | Botones CTA (`bg-lime-600`), links de navegación, chips de filtro activos, paginación activa, logo "Vital" |

```
Botón primario   → bg-lime-600 hover:bg-lime-700 text-white
Estado activo    → border-lime-600 bg-lime-600
Focus ring       → focus:ring-lime-600 focus:border-lime-600
Título / heading → text-teal-700
Label / dato     → text-teal-600
Tab activo       → text-teal-700 border-b-2 border-teal-700
```

> **Regla:** `teal` nunca en botones de acción. `lime` nunca en texto de contenido (contraste insuficiente sobre blanco).

---

## Licencia

Proyecto académico / privado. Todos los derechos reservados.
