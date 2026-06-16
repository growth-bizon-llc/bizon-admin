---
name: Bizon Admin Project Overview
description: Next.js 16 e-commerce admin dashboard connecting to a Rails-style API backend at /api/v1
type: project
---

Bizon Admin is a Next.js 16 admin panel for managing an e-commerce store (products, categories, orders, customers, store settings).

**Why:** It's the admin interface for the Bizon e-commerce platform, connecting to a backend API (likely Rails given RESTful conventions and snake_case responses).

**How to apply:** All features are admin-facing. The backend API lives at `NEXT_PUBLIC_API_URL` (default `http://localhost:3000/api/v1`). All endpoints are prefixed with `/admin/`. Auth uses Bearer tokens stored in localStorage. Three roles: staff, admin, owner — with escalating permissions.

Key tech stack:
- Next.js 16 + React 19 + TypeScript 5
- TanStack React Query (server state) + Zustand (auth state)
- React Hook Form + Zod (forms/validation)
- Tailwind CSS 4 + Headless UI + Heroicons
- Recharts (dashboard charts)
- Vitest 4 + Testing Library (80% coverage target, 55 test files)
- Axios for HTTP with auth interceptor
