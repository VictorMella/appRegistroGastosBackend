# Cambios de API que requieren actualizar el frontend

Resumen de lo que cambió en el backend (rama `update-proyect`) y que rompe el
contrato actual con el cliente. Los ejemplos de request/response actualizados
están en `postman_collection.json`.

## 1. Nuevas rutas que ahora exigen el header `appToken`

Antes eran públicas. Ahora, si no se envía el header o el token es inválido,
responden **401**.

| Método | Ruta |
|---|---|
| POST | `/debito/crear-registro` |
| GET  | `/debito` |
| GET  | `/debito/anio` |
| POST | `/debito/update` |
| POST | `/debito/delete` |
| POST | `/credito/crear-registro` |
| GET  | `/credito` |
| GET  | `/credito/anio` |
| POST | `/credito/update` |
| POST | `/credito/delete` |
| POST | `/otros-gastos/crear-registro` |
| GET  | `/otros-gastos` |
| GET  | `/otros-gastos/anio` |
| POST | `/otros-gastos/update` |
| POST | `/otros-gastos/delete` |
| POST | `/usuario/edit` |
| GET  | `/usuario` |

El header es **`appToken`**, no `Authorization` ni `x-token`:

```
appToken: <token devuelto por /auth/login o /auth/renew>
```

Si el cliente ya guarda el token de login en algún lado (localStorage,
store, etc.), el cambio es: agregar ese header a todas las llamadas de la
tabla de arriba, no solo a las que ya lo tenían (`/auth/renew`,
`/usuario/delete`).

## 2. Nueva respuesta `403` por falta de propiedad del registro

`update` y `delete` de `/debito`, `/credito`, `/otros-gastos`, y
`/usuario/edit` / `/usuario/delete`, ahora verifican que el registro o
usuario pertenezca al dueño del token. Si no coincide, responden:

```json
{
  "ok": false,
  "mensaje": "No tiene permisos sobre este registro"
}
```
(o `"No tiene permisos para editar/eliminar este usuario"` en los de
`/usuario`)

con status **403**. El frontend debería manejar este caso igual que un
error de autorización (por ejemplo, mostrando un mensaje genérico o
forzando un re-login si se sospecha token de otra sesión).

## 3. Ruta de actualización de crédito cambió de forma

Antes: `POST /credito/update/:id` (el `:id` de la URL en realidad no se
usaba, el backend tomaba el `_id` del body).

Ahora: `POST /credito/update` (sin parámetro de ruta). El body sigue
siendo el mismo (incluye `_id`).

## 4. Mensaje de login unificado

`POST /auth/login` ya no distingue entre "no existe un usuario asociado a
ese correo" y "la contraseña no es correcta". Ambos casos devuelven ahora:

```json
{
  "ok": false,
  "mensaje": "Correo o contraseña incorrectos"
}
```

Si el frontend mostraba esos mensajes específicos al usuario, hay que
actualizarlos a este genérico.

## 5. Sin cambios de contrato (no requieren ajuste en frontend)

- Forma de las respuestas exitosas (`ok`, `mensaje`, `data`) de los
  listados paginados, `GET /anio`, creación y edición: igual que antes.
- `config.ts` (credenciales de Mongo/JWT): se revirtió a su estado
  original, no afecta al cliente.
