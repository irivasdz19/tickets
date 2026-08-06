# 0002. Uso de JWT para Autenticación Stateless

- **Estado**: Aceptada
- **Fecha**: 2026-08-06
- **Decisores**: Ignacio Rivas D. y equipo de desarrollo

## Contexto y problema

Para el módulo 6, necesitamos proteger las rutas de escritura de la API (`POST`, `PATCH`, `DELETE` en `/tickets`). El sistema necesita distinguir entre un usuario normal y un administrador. Necesitamos un mecanismo para autenticar cada petición HTTP sin afectar severamente el rendimiento de la base de datos o la memoria del servidor.

## Opciones consideradas

- **Sesiones en memoria / cookies (express-session)** — Mantiene el estado en el servidor. Fácil de implementar, pero difícil de escalar si tuviéramos múltiples instancias de la API, y propenso a problemas de CORS con clientes externos.
- **JSON Web Tokens (JWT)** — Un token firmado digitalmente que contiene el ID y el rol del usuario. Es _stateless_ (sin estado), por lo que el servidor no necesita consultar la base de datos ni guardar la sesión en memoria para verificar quién es el usuario.

## Decisión

Elegimos **JSON Web Tokens (JWT)** porque nos permite construir una API REST verdaderamente _stateless_. El token se envía vía _Header_ (`Authorization: Bearer`), lo que facilita enormemente realizar pruebas de integración (Jest/Supertest) y consumir la API desde herramientas como Postman o futuros clientes móviles.

## Consecuencias

**Positivas:**

- Alivia la carga de la base de datos; la verificación de permisos se hace matemáticamente comprobando la firma del token en el middleware.
- Escala horizontalmente sin necesidad de configurar un almacén de sesiones compartidas (como Redis).

**Negativas / costos:**

- Un JWT no se puede "destruir" o invalidar explícitamente en el servidor antes de que caduque.
- _Mitigación:_ Se configuró un tiempo de expiración (TTL) muy corto, de 1 hora, para reducir la ventana de exposición en caso de robo del token.
