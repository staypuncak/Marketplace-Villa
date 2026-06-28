# Infrastructure Audit Report

**Project:** StayPuncak.com

**Audit Date:** 2026-06-28

**Status:** Read-Only Audit (No changes made)

---

## Executive Summary

StayPuncak is currently running entirely on **temporary local development infrastructure**. No production services have been configured. The project has no git remote, no deployment platform setup, no production domain, and is connected to a Supabase project inherited from an unrelated Mini CRM application.

---

## 1. Supabase

| Check | Status | Detail |
|-------|--------|--------|
| `.env.local` exists | ✅ | `/home/farid/Stay-Puncak/.env.local` |
| URL configured | ✅ | `https://hisyyiiorextnmplcesg.supabase.co` |
| Project ownership | ❌ **Not StayPuncak** | Project `hisyyiiorextnmplcesg` was created for a **Mini CRM** application (tables: `customers`, `customer_notes`; auth user: `test-owner@minicrm.com`) |
| Database reachable | ⚠️ **Timeout** | Postgres connection fails with `Connection terminated due to connection timeout` |
| Client helper | ✅ | `src/lib/supabase/client.ts` — standard `createBrowserClient` |
| Server helper | ✅ | `src/lib/supabase/server.ts` — standard `createServerClient` with async cookies |
| Proxy (middleware) | ✅ | `src/proxy.ts` — standard Next.js 16 auth proxy using `getUser()` |
| Database types match StayPuncak | ❌ | `src/lib/supabase/types.ts` defines `customers` and `customer_notes` (CRM), not `villas`/`bookings`/`owners` |
| StayPuncak tables exist | ❌ | No `villas`, `bookings`, `owners`, `media`, `admins` tables exist |

---

## 2. Environment Variables

| Check | Status | Detail |
|-------|--------|--------|
| `.env.example` exists | ✅ | Contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with empty values |
| Secrets excluded from Git | ✅ | `.env*` is in `.gitignore`; `.env.example` has no real values |
| Required vars defined | ⚠️ **Partial** | Only 2 vars are defined. **Missing:** `NEXT_PUBLIC_SITE_URL` (site.ts line 5 falls back to `http://localhost:3000`) |

---

## 3. GitHub

| Check | Status | Detail |
|-------|--------|--------|
| Git remote configured | ❌ **None** | `git remote -v` returns empty; `.git/config` has no `[remote "origin"]` section |
| Repository URL | ❌ | Not configured |
| Ownership | ❌ **Temporary** | Repository exists only on local machine (`farid@linux`) |

---

## 4. Deployment (Vercel)

| Check | Status | Detail |
|-------|--------|--------|
| `vercel.json` | ❌ | Does not exist |
| `.vercel` directory | ❌ | Does not exist |
| Vercel CLI installed | ❌ | Not in `node_modules` or `package.json` |
| `.gitignore` has `.vercel` entry | ✅ | Present |
| Deployment readiness | ⚠️ | Build passes locally, but no deployment target configured |

---

## 5. Domain

| Check | Status | Detail |
|-------|--------|--------|
| Production domain configured | ❌ | Not configured |
| `NEXT_PUBLIC_SITE_URL` set | ❌ | Falls back to `http://localhost:3000` in `src/config/site.ts:5` |
| PRD mentions `StayPuncak.com` | ✅ | Documented but not implemented |

---

## 6. Temporary Resources

These resources **must be replaced** before going to production:

| Resource | Current | Production Target | Risk if not replaced |
|----------|---------|-------------------|----------------------|
| Supabase project | `hisyyiiorextnmplcesg` (Mini CRM) | New Supabase project for StayPuncak | CRM tables exposed; wrong DB schema; reusing shared resource |
| Git remote | None | GitHub repository (StayPuncak org) | No collaboration, backup, or CI/CD |
| Domain | `localhost:3000` | `staypuncak.com` | Website inaccessible |
| Hosting | Local dev server only | Vercel production deployment | No public access |
| `NEXT_PUBLIC_SITE_URL` | Unset (falls back to `localhost`) | `https://staypuncak.com` | Incorrect canonical URLs, OG tags, sitemap |

---

## 7. Recommended Migration Sequence

### Phase 1 — Supabase
1. Create a **new Supabase project** under the StayPuncak organization
2. Obtain new project URL + anon key
3. Update `.env.example` with new project reference
4. Update `.env.local` with new credentials
5. Replace `src/lib/supabase/types.ts` with StayPuncak domain types
6. Apply Database.md schema (`villas`, `bookings`, `owners`, `media`, `admins` tables)
7. Verify connection via a test query

### Phase 2 — Git & GitHub
8. Create GitHub repository (`staypuncak/staypuncak.com` or similar)
9. Add remote origin
10. Push current `master` branch
11. Configure branch protection rules

### Phase 3 — Vercel
12. Connect GitHub repo to Vercel
13. Configure environment variables in Vercel dashboard
14. Deploy preview and verify build
15. Set production domain to `staypuncak.com`

### Phase 4 — Domain
16. Configure `staypuncak.com` DNS (CNAME to Vercel)
17. Set `NEXT_PUBLIC_SITE_URL` in Vercel env vars
18. Verify SSL certificate provisioning

---

## 8. Constraints

- This was a **read-only audit** — no files were modified, no database tables created, no new services connected.
- No Sprint progress was interrupted.
- Awaiting human approval before proceeding with any migration.
