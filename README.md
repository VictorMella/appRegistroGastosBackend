# Registro de Gastos - Backend

API REST en Express + TypeScript + MongoDB (Mongoose) para una app personal
de registro de ingresos y gastos: tarjeta de débito, tarjeta de crédito
nacional (con cuotas) y otros gastos/ingresos.

## Stack

- Node.js + Express
- TypeScript (sin framework adicional sobre Express)
- MongoDB vía Mongoose
- Auth con JWT (`jsonwebtoken`) + `bcryptjs` para passwords
- `express-validator` para validación de inputs

No hay suite de tests automatizados (`npm test` es un placeholder).

## Requisitos

- Node.js
- Una instancia de MongoDB (local o Atlas)

## Configuración

Crear un archivo `config.ts` en la raíz del proyecto (está en `.gitignore`,
no se versiona) con esta forma:

```ts
require('dotenv').config()

export const config = {
    serverport: Number(process.env.PORT) || 3000,
    db: process.env.DB_CNN || '<tu connection string de Mongo>',
    SECRETORPRIVATEKEY: process.env.SECRETORPRIVATEKEY || '<tu secreto JWT>'
}
```

Variables de entorno usadas (vía `.env` o configuradas en el entorno de
despliegue):

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DB_CNN` | Connection string de MongoDB | fallback hardcodeado en `config.ts` |
| `SECRETORPRIVATEKEY` | Secreto para firmar/verificar JWT | fallback hardcodeado en `config.ts` |

> El fallback hardcodeado existe para que el proyecto levante aunque falten
> las variables de entorno, pero en cualquier entorno real (local o
> desplegado) conviene definir `DB_CNN` y `SECRETORPRIVATEKEY` explícitamente.

## Correr en local

No hay script `dev`/`build` en `package.json`, se corre directo:

```bash
# correr el código TypeScript directamente (más rápido para desarrollo)
npx ts-node index.ts

# o compilar a cuentas/ (según outDir de tsconfig.json) y correr lo compilado
npx tsc
node cuentas/index.js
```

El servidor queda escuchando en `http://localhost:3000` por defecto.

## Estructura del proyecto

```
index.ts                     Entry point: wiring de Express, Mongo y rutas
clases/server.ts             Clase Server (Express app + listen)
db/conectar-db.ts            Conexión a MongoDB
rutas/                       Routers de Express por recurso
  auth.ts                    /auth  (login, renew)
  usuario.ts                 /usuario (create, edit, delete, listar)
  t-debito.ts                /debito
  t-creditoNacional.ts       /credito
  otros-gastos.ts            /otros-gastos
helpers/
  crear-ledger-router.ts     Factory compartido por debito/credito/otros-gastos
  generar-jwt.ts             Firma de JWT
  db-validators.ts           Validadores custom de express-validator
middelwares/
  validar-jwt.ts             Autenticación (header appToken)
  validar-propietario.ts     Autorización: dueño del registro
  validar-campos.ts          Corta con 400 si falló algún check
models/                      Schemas de Mongoose
interfaces/                  Tipos/DTOs compartidos
cuentas/                     Output compilado (TRACKEADO en git, ver abajo)
```

## Autenticación y autorización

- Login (`POST /auth/login`) devuelve un JWT (expira en 1h).
- Las rutas protegidas leen el token del header **`appToken`** (no
  `Authorization` ni `x-token`).
- Casi todas las rutas mutables están protegidas: todo `/debito`,
  `/credito`, `/otros-gastos`, y `/usuario/edit`, `GET /usuario`,
  `/usuario/delete`. Solo `/auth/login` y `/usuario/create` son públicas.
- Además de autenticación, `update`/`delete` de los ledgers y
  `usuario/edit`/`delete` verifican que el registro o usuario pertenezca
  al dueño del token (403 si no).

Ver `CLAUDE.md` para el detalle de implementación (qué middleware hace
qué, dónde viven los dos IDs de usuario, etc.).

## API

La colección de Postman `postman_collection.json` documenta cada ruta con
ejemplos de body/query contra `http://localhost:3000`. Su request `Login`
autocompleta las variables `token`, `uid` e `idUsuarioCreacion` que el
resto de los requests reutiliza.

Si estás integrando o actualizando un cliente frontend, revisar
`CAMBIOS-FRONTEND.md` para los cambios de contrato recientes (rutas que
ahora exigen `appToken`, respuestas 403 nuevas, etc.).

## Build y despliegue

`tsconfig.json` compila a `cuentas/` (`outDir`), y esa carpeta **sí está
trackeada en git** (no es un `.gitignore`d build artifact). Tanto
`vercel.json` como `Procfile` apuntan directo a `cuentas/index.js`: los
entornos de despliegue no compilan TypeScript por su cuenta.

Por lo tanto, después de cualquier cambio en los `.ts`:

```bash
npx tsc
```

y commitear los `.js`/`.d.ts` regenerados bajo `cuentas/` junto con el
código fuente — si no, el deploy sigue sirviendo la versión compilada
vieja.
