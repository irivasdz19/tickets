# Referencia de API

> Endpoints, autenticación y convenciones de la API de **API Tickets**.
> Documentación interactiva: Colección ubicada en `postman/API-Tickets.postman_collection.json`
>
> **Última actualización**: 2026-08-06

## Convenciones generales

- **URL base**: `http://localhost:3000` (desarrollo local) o dominio de producción configurado vía variables de entorno.
- **Versionado**: Actualmente la API no implementa prefijos de versión (p. ej. `/v1`), las rutas se acceden desde la raíz.
- **Formato**: JSON (`Content-Type: application/json`).
- **Fechas**: Formato ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) autogeneradas por Mongoose (`createdAt`, `updatedAt`).

## Autenticación de la API

- **Esquema**: JSON Web Token (JWT).
- **Header**: `Authorization: Bearer <token>`
- **Caducidad**: Los tokens expiran en 1 hora.
- Ver [`auth.md`](auth.md) para el detalle del flujo y roles.

## Manejo de errores

Formato de error estándar de la aplicación:

```json
{
  "error": "Mensaje legible explicando el motivo del error"
}
```

| Código HTTP | Significado        | Aplicación en el proyecto                                                 |
| ----------- | ------------------ | ------------------------------------------------------------------------- |
| 200 / 201   | Éxito              | Operación completada / Recurso creado                                     |
| 204         | Sin contenido      | Recurso eliminado correctamente                                           |
| 400         | Solicitud inválida | Recurso eliminado correctamente                                           |
| 401         | No autenticado     | Token faltante, inválido, expirado o credenciales incorrectas en login    |
| 403         | No autorizado      | Token válido, pero el rol del usuario no tiene permisos (ej. no es admin) |
| 404         | No encontrado      | El ID del recurso no existe en la base de datos o ruta inexistente        |
| 409         | Conflicto          | Intentar registrar un email que ya existe                                 |
| 500         | Error interno      | Falla en el servidor o caída de la base de datos                          |

## Paginación, filtrado y ordenamiento

- **Paginación**: `?page=1&per_page=20` (o cursor: `?cursor=...`).
- **Filtrado**: `?filtro[campo]=valor`.
- **Ordenamiento**: `?sort=-created_at`.

## Endpoints

### Autenticación

```http
POST   /auth/registro      # Registrar nuevo usuario (Público, nace con rol "usuario")
POST   /auth/login         # Iniciar sesión (Devuelve JWT)
GET    /auth/yo            # Obtener perfil (Requiere Token)
```

### Tickets

```http
GET    /tickets            # Listar tickets paginados y filtrados (Público)
GET    /tickets/:id        # Obtener un ticket por ID (Público)
POST   /tickets            # Crear ticket (Requiere Token)
PATCH  /tickets/:id        # Actualizar estado/prioridad (Requiere Token)
DELETE /tickets/:id        # Eliminar ticket (Requiere Token + Rol "admin")
```

**Ejemplo — crear un ticket:**

```http
POST /tickets
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUz...

{
  "titulo": "Impresora sin red",
  "prioridad": "alta"
}
```

**Respuesta:**

```json
{
  "titulo": "Impresora sin red",
  "estado": "abierto",
  "prioridad": "alta",
  "_id": "60d5ec49e4b023...1a",
  "createdAt": "2026-08-06T15:30:00.000Z",
  "updatedAt": "2026-08-06T15:30:00.000Z"
}
```

## Tiempo Real (WebSockets)

- Protocolo: Socket.IO (ws:// o wss://).
- Comportamiento: La API emite notificaciones a los clientes conectados cada vez que ocurre una operación de escritura importante (creación, actualización o eliminación de un ticket).
- Implementación: Revisar src/server.js (o el manejador de sockets) para los eventos emitidos.

## Seguridad Adicional

- Las rutas de la API implementan cabeceras de seguridad mediante Helmet.
- Soporte para peticiones cross-origin mediante CORS debidamente configurado.
