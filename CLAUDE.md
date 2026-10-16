# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Express + MongoDB (Mongoose) REST API backend for a personal expense/income tracker ("Registro de Gastos"). Written in TypeScript, no framework beyond Express. There is no automated test suite (`npm test` is a placeholder).

## Running locally

There is no `build`/`dev` script defined in `package.json` — use these directly:

```bash
# run the TypeScript source directly (fastest for local dev)
npx ts-node index.ts

# OR compile TS -> cuentas/ (per tsconfig outDir) and run the compiled output
npx tsc
node cuentas/index.js
```

`config.ts` is gitignored and must exist locally (it is not committed). It reads `PORT`, `DB_CNN` (Mongo connection string), and `SECRETORPRIVATEKEY` (JWT secret) from env vars, each with a hardcoded fallback — so the app will boot even without a `.env`, but you should set your own `DB_CNN` to point at a real/local Mongo instance rather than relying on the fallback.

Server listens on port `3000` by default (`config.serverport`).

## Architecture

**Entry point**: `index.ts` wires everything together — creates the `Server` instance (`clases/server.ts`), configures `body-parser`/`cors`, connects Mongoose, mounts each route module under its prefix, and starts listening:

- `/auth` → `rutas/auth.ts`
- `/usuario` → `rutas/usuario.ts`
- `/debito` → `rutas/t-debito.ts`
- `/credito` → `rutas/t-creditoNacional.ts`
- `/otros-gastos` → `rutas/otros-gastos.ts`

**Compiled output is committed**: `tsconfig.json` sets `outDir: "cuentas/"`, and the `cuentas/` directory (compiled `.js`/`.d.ts`) is tracked in git, not gitignored. Both `vercel.json` and `Procfile` point directly at `cuentas/index.js` for deployment. This means **after changing any `.ts` source, you must re-run `npx tsc` and commit the regenerated files under `cuentas/`** for the deployed app to pick up the change — the deploy targets do not build TypeScript themselves. Treat `cuentas/` as a build artifact, not a place to hand-edit.

**Auth**: `rutas/auth.ts` issues a JWT (`helpers/generar-jwt.ts`, signed with `config.SECRETORPRIVATEKEY`, 1h expiry) on login. `middelwares/validar-jwt.ts` (`validarJWT`) protects routes by reading the token from the **`appToken`** request header (not `Authorization` or `x-token`) and attaches the loaded `Usuario` doc to `req.usuario`. `validarJWT` is applied to every route of `debito`/`credito`/`otros-gastos` (via `crearLedgerRouter`, see below) and to `/usuario/edit`, `GET /usuario`, `/usuario/delete`, and `/auth/renew`. Login (`/auth/login`) and user creation (`/usuario/create`) remain public, as expected.

**Ownership check**: `middelwares/validar-propietario.ts` (`validarPropietarioPorId`) runs after `validarJWT` on every ledger `update`/`delete` and compares the target record's `idUsuarioCreacion` against `req.usuario.identificador` (see the two-IDs note below) — mismatch returns `403`. `/usuario/edit` and `/usuario/delete` do the equivalent check inline by comparing `req.body.uid` to `req.usuario._id`.

**Validation**: `express-validator` checks (`check(...)`) combined with the shared `validarCampos` middleware (`middelwares/validar-campos.ts`), which short-circuits with a 400 if any check failed. Custom validators live in `helpers/db-validators.ts` (e.g. `emailExiste`, `existeUsuarioPorId`).

**User identity has two different IDs** — don't confuse them:
- `_id` / `uid`: the Mongo ObjectId, used for `/usuario/edit`, `/usuario/delete`, and JWT payload (`{ uid }`).
- `identificador` (and the `idUsuarioCreacion` field stored on every expense record): a sequential **Number**, assigned via `helpers/db-validators.ts`'s `cantidadUsuarios()` when a user is created. All `idUsuarioCreacion` fields on `TDebito`/`TCredito`/`OtrosGastos` are typed `Number` in their Mongoose schemas — passing a Mongo ObjectId string into a query/body for this field causes Mongoose to throw a low-level `AssertionError` (not a clean `CastError`) rather than a validation error, because of how this version of Mongoose (6.0.12) casts query filters.

**Ledger modules share one factory**: `helpers/crear-ledger-router.ts` (`crearLedgerRouter(Model, opciones)`) generates the common CRUD shape — `POST /crear-registro`, `GET /` (paginated listing filtered by `activo`, `mes`, `anio`, `idUsuarioCreacion`), `GET /anio` (distinct years with records for a user), `POST /update`, `POST /delete` (soft delete via `activo: false`, not a real delete) — plus `validarJWT` and the ownership check described above, already wired in. `rutas/t-debito.ts` and `rutas/otros-gastos.ts` are thin configs over this factory (`otros-gastos.ts` passes a custom `calcularTotalMontoMes` to net ingresos/egresos). When changing the shared CRUD logic, edit the factory, not the individual route files. `parseMesAnio(fechaCompra)` (also exported from the factory file) derives `mes`/`anio` from the `YYYY-MM-DD` string and is reused by all three modules.

**Installment logic (`t-creditoNacional.ts`)** is the most complex module and does not fit the factory's defaults directly — it overrides `crearRegistro` (fans a single purchase out into multiple `TCredito` documents, one per cuota, sharing a generated `identificador` via `makeRandomId` so they can later be bulk-updated/deleted together), `construirPayloadActualizacion` (extra fields: `cuotas`, `nCuota`, `facturacionInmediata`), and `eliminarRegistro` (deletes every cuota sharing `identificador`, not a single `_id`, with its own ownership check against the first matching record). `facturacionInmediata` controls whether the first cuota is billed in the purchase month or the following one. Monthly date math uses `moment`. The route is `POST /credito/update` (no `:id` param — the id travels in the body as `_id`, same as the other two modules).

## API reference

A Postman collection (`postman_collection.json`) documents every route with example bodies/queries for local testing against `http://localhost:3000`. Its `Login` request auto-populates the `token`, `uid`, and `idUsuarioCreacion` collection variables from the response, which the other requests reuse. Every protected request in the collection sends the `appToken` header.

`CAMBIOS-FRONTEND.md` lists the breaking API changes (new `appToken`-required routes, new `403` ownership responses, the `/credito/update` path change, the unified login error message) for whoever maintains the frontend client — check it before assuming an old frontend integration still matches the current backend.
