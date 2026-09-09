# Rental/Property-Management Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Node/Express/PostgreSQL/Knex backend foundation (schema, models, controllers, routes, auth, seed data) for the Bijengwa rental/property-management app, exactly per the user-supplied spec.

**Architecture:** Layered REST API — Knex migrations define the schema (UUID PKs), a thin repository/model layer wraps Knex query builders per table, controllers hold business rules + ownership authorization, Express routers wire HTTP to controllers. One `profiles` table serves both landlord and tenant roles (role is relational, not a column). Auth is stateless JWT (no session table); forgot/reset-password and phone verification also use short-lived signed tokens instead of new tables, to respect "do not add unnecessary tables."

**Tech Stack:** Node.js, Express 4, PostgreSQL (Neon, already provisioned via `.env` `DATABASE_URL`), Knex 3, bcryptjs, jsonwebtoken, Jest + Supertest for integration tests.

## Global Constraints (from user spec — apply to every task)

- Exactly the 8 tables named in the spec: profiles, properties, units, rental_agreements, payments, chats, chat_messages, settings. No extra tables.
- UUID primary keys everywhere, `gen_random_uuid()` default (native in PG18, no extension needed).
- Never store `confirm_password`. Passwords hashed (bcryptjs) before storage in `profiles.password`.
- Search endpoint returns only `units.status = 'available'`, never occupied units.
- Payments always belong to a `rental_agreement` — never attach directly to a property or profile.
- Chats are pre-rental only; never auto-create a `rental_agreement` from a chat.
- Authorization: never trust a client-supplied `owner_uuid`/`tenant_uuid` for mutation — always derive/check ownership server-side from the authenticated user (`req.user.uuid`) and the resource's actual FK chain.
- A single profile can simultaneously own properties and hold rental agreements as tenant — never split into separate landlord/tenant tables.
- DB confirmed empty (PostgreSQL 18.6 on Neon) — migrations run on a clean database.

---

## File Structure

```
node/
  knexfile.js
  .env.example
  src/
    config/{db.js, env.js}
    db/migrations/  (8 files, FK order)
    db/seeds/        (5 files)
    models/          (8 files, one per table)
    utils/           (ApiError, apiResponse, asyncHandler, password, token, username, validators)
    middleware/       (auth, errorHandler)
    controllers/      (auth, profile, property, unit, search, rentalAgreement, payment, chat, settings)
    routes/           (matching routers + index.js)
    app.js
    server.js
  tests/
    helpers/setupApp.js
    flow.integration.test.js
```

**Shared interfaces:**
- `req.user` set by `middleware/auth.js` = `{ uuid, email }` (decoded JWT payload).
- Model functions return plain row objects, e.g. `propertyModel.findById(uuid) -> Promise<Property|undefined>`.
- `apiResponse.ok(res, data, status=200)` / `apiResponse.created(res, data)` — envelope `{ success: true, data }`.
- `ApiError(statusCode, message)` thrown, caught by `errorHandler` -> `{ success: false, error: { message } }`.
- `asyncHandler(fn)` wraps async route handlers.

---

## Tasks

1. Project scaffolding, knexfile, env config, db singleton.
2. Migrations — all 8 tables, correct FK order, indexes, check constraints on enum-like status fields. Verify migrate up/down/up cycles cleanly.
3. Utilities and middleware (ApiError, apiResponse, asyncHandler, password hashing, JWT token helpers incl. purpose-scoped reset/otp tokens, username generator, validators, requireAuth, errorHandler).
4. Model/repository layer — one file per table, thin Knex wrappers only, no business rules.
5. Auth controller+routes: register (rejects confirm_password mismatch, hashes password, auto-creates settings row), login, forgot/reset password (stateless signed token, no new table), phone verification (stateless signed OTP token, no new table, documented as dev-mode since no SMS provider configured).
6. Profile controller+routes: get/update own profile (`/me` only — no arbitrary-uuid mutation route), public profile view by uuid.
7. Properties controller+routes: create/list-mine/get/update/delete, owner-only authorization enforced server-side, ignore client-supplied owner_uuid.
8. Units controller+routes: create/list-for-property/get/update/delete/status-patch, owner-only via property chain.
9. Search controller+routes: `GET /api/search/units`, status=available only, filters (location/street/purpose/room_type/property_type/price range), response includes unit+property+landlord info per spec.
10. Rental agreements controller+routes: create (landlord-only, snapshots unit terms, flips unit to occupied), get mine (tenant/landlord), get by id (participant-only), patch status (landlord-only; ended/cancelled flips unit back to available).
11. Payments controller+routes: create (landlord-only, tied to rental_agreement_uuid), get-for-agreement/tenant-mine/landlord-mine/get-by-id, all participant-checked.
12. Chats + chat_messages controller+routes: create/find-or-create by (unit,tenant), list mine, get by id, post/list messages — all participant-checked, never creates a rental_agreement.
13. Settings controller+routes: get/update own settings (language/theme enums validated).
14. App assembly (`app.js`/`server.js`/`routes/index.js`): helmet, cors, json body parsing, mount routers, 404 handler, error handler.
15. Seed data: David (landlord, 3 properties: 4 units / 1 unit / demo multi-property), Grace (tenant), one active rental agreement + 2 payments, one chat + messages, settings for both.
16. End-to-end verification: rollback-all -> migrate -> seed repeatability check, full `npm test` green, manual confirmation of search-excludes-occupied, single-profile-dual-role, and 403 authorization boundaries; write final report.

Execution: implemented inline in this session (no subagent dispatch — single coherent build with full context already loaded). Tests focus on the business rules explicitly called out in the spec (auth password handling, ownership authorization, search availability filter, agreement/payment/unit-status state transitions, chat participant isolation) rather than exhaustive per-field CRUD coverage.
