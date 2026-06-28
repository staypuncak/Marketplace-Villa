# Database Analysis Report

**Project:** StayPuncak.com

**Analysis Date:** 2026-06-28

**Mode:** ANALYSIS (Read-only)

---

## Executive Summary

The Supabase MCP tools are connected to the **wrong project**. The MCP server is pointing to the old Mini CRM project (`hisyyiiorextnmplcesg`) instead of the new official StayPuncak project (`ypofadoecoreanwppmyt`). The official StayPuncak project cannot be inspected until the MCP server is reconfigured.

---

## 1. Project Connection Status

### MCP Tools Current Target

| Property | Value |
|----------|-------|
| URL | `https://hisyyiiorextnmplcesg.supabase.co` |
| Identity | Mini CRM project (pre-existing, not StayPuncak) |
| Database | Timed out — `Connection terminated due to connection timeout` |
| Extensions | Could not query |
| Tables | Could not query |
| Postgres Logs | Showing `Connection reset by peer` errors — project may be in degraded state |

### Official StayPuncak Target

| Property | Value |
|----------|-------|
| URL | `https://ypofadoecoreanwppmyt.supabase.co` |
| Anon/Publishable Key | `sb_publishable_mk5jybAJsyNPuuJ3x3cCFg_v9bsucLZ` |
| Configured in `.env.local` | ✅ Yes |
| MCP Tools Access | ❌ **Not connected** — MCP server is still on old project |

### Critical Finding

The MCP server configuration must be updated to point to the new official project before any database inspection can proceed.

---

## 2. Current Database State (Old Project)

Since the old project's database is timing out, limited data is available. Known from earlier Sprint context:

| Item | Status | Detail |
|------|--------|--------|
| `customers` table | Exists (inferred) | From `types.ts` and Sprint 01 history |
| `customer_notes` table | Exists (inferred) | From `types.ts` and Sprint 01 history |
| Auth users | Exists | `test-owner@minicrm.com` |
| RLS | Disabled | Known from Sprint 01 notes |
| Edge Functions | None | Confirmed ✅ |

These tables are **unrelated to StayPuncak** (Mini CRM domain).

---

## 3. Database.md Expected Schema

Per `06 - DATABASE.md`, StayPuncak requires these entities:

| Entity | Purpose | Status |
|--------|---------|--------|
| `owners` | Villa owner (prepared for future multi-owner) | ❌ Missing |
| `villas` | Core product — villa information | ❌ Missing |
| `media` | Villa images (one villa has many media) | ❌ Missing |
| `bookings` | Booking requests from WhatsApp | ❌ Missing |
| `customers` | Customer information | ❌ Missing (a different `customers` table exists in old CRM project) |
| `admins` | Dashboard users | ❌ Missing |

### Expected Relationships

```
owners 1──N villas
villas  1──N media
villas  1──N bookings
customers 1──N bookings
admins    manages villas
```

### Expected Attributes (per Database.md)

- `owners`: name, phone, email, address, status
- `villas`: name, slug, description, price, capacity, location, google_maps, status, owner_id
- `media`: villa_id, image_url, is_cover, sort_order
- `bookings`: villa_id, customer_id, check_in, check_out, notes, status
- `customers`: name, phone, email
- `admins`: name, email, role

---

## 4. Gap Analysis

| Requirement | Current State | Gap |
|-------------|---------------|-----|
| StayPuncak schema exists | ❌ | Entire schema is missing |
| StayPuncak tables exist | ❌ | All 6 entities need creation |
| StayPuncak RLS policies exist | ❌ | No policies exist |
| StayPuncak storage buckets exist | ❌ | Villa images bucket needed |
| Auth users configured | ❌ | Only old CRM user exists |
| MCP connected to correct project | ❌ | MCP server must be re-pointed |

---

## 5. Blockers

1. **MCP Server Configuration** — The MCP tools cannot inspect the official StayPuncak project. The MCP configuration needs to be updated to use the new project reference (`ypofadoecoreanwppmyt`) before any detailed database analysis can be performed.

2. **Missing Service Role Key** — The publishable key cannot access the PostgREST API for schema introspection. A service_role key is needed to query `information_schema` and inspect the database programmatically via REST.

---

## 6. Recommendations

### Phase 0 — Unblock Analysis
1. Reconfigure Supabase MCP server to point to `ypofadoecoreanwppmyt` (the official project)
2. Obtain a service_role key for the official project (for REST API schema introspection)

### Phase 1 — Schema Creation (after human approval)
3. Create owners table
4. Create villas table
5. Create media table
6. Create customers table
7. Create bookings table
8. Create admins table

### Phase 2 — Security (after human approval)
9. Enable RLS on all tables
10. Create auth users for admin
11. Create storage bucket for villa images

### Phase 3 — Integration (after human approval)
12. Update `src/lib/supabase/types.ts` with Database.md schema types
13. Connect villa static data to database

---

## 7. Constraints

- This was a **read-only analysis** — no SQL executed, no tables created, no data modified.
- MCP tools are **not connected to the official project** — all findings above assume the new project is empty until it can be verified.
- Awaiting human approval before entering Planning Mode.
