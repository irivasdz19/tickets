# Stack Tecnológico

> Fuente de verdad de las tecnologías y versiones del proyecto.
> **Última actualización**: 2026-08-06

## Backend

| Categoría     | Tecnología   | Versión  | Por qué                                                                                             |
| ------------- | ------------ | -------- | --------------------------------------------------------------------------------------------------- |
| Runtime       | Node.js      | >=26.5.0 | Estándar asíncrono de alto rendimiento, requerido por el curso.                                     |
| Framework     | Express.js   | ^5.2.1   | Minimalista, robusto y la versión 5 soporta promesas (async/await) nativamente sin librerías extra. |
| ORM / ODM     | Mongoose     | ^9.8.0   | Facilita el modelado de datos para MongoDB, con validaciones estrictas y soporte de esquemas.       |
| Autenticación | jsonwebtoken | ^9.0.3   | Estándar seguro para autenticación _stateless_ (sin estado) vía APIs.                               |
| Seguridad     | bcrypt       | ^6.0.0   | Hasheo seguro de contraseñas con salts automáticos integrados.                                      |
| Tiempo Real   | Socket.io    | ^4.8.3   | Abstracción confiable sobre WebSockets para emitir eventos (creación/actualización de tickets).     |

## Base de Datos

| Categoría | Tecnología | Versión       | Por qué                                                           |
| --------- | ---------- | ------------- | ----------------------------------------------------------------- |
| Principal | MongoDB    | Atlas / >=5.0 | Base de datos NoSQL flexible, ideal para esquemas dinámicos (M4). |

_(Nota: Caché y Colas de mensajería no aplican para el alcance de esta iteración de la API)._

## DevOps & Herramientas

| Categoría    | Tecnología                                            |
| ------------ | ----------------------------------------------------- |
| CI/CD        | GitHub Actions (Workflows de Integración y Calidad)   |
| Contenedores | Docker                                                |
| Orquestación | Docker Compose (Para levantar API + BD local)         |
| Bundler      | Webpack (^5.108.4) + Babel (^8.0.1)                   |
| Testing      | Jest (^30.4.2) + Supertest (^7.2.2) (con ESM Modules) |

## Servicios externos

| Servicio      | Uso                                                                              | Credenciales necesarias |
| ------------- | -------------------------------------------------------------------------------- | ----------------------- |
| MongoDB Atlas | Alojamiento de la base de datos en la nube para entornos compartidos/producción. | `MONGODB_URI`           |

## Justificación de elecciones

| Tecnología elegida                       | Alternativa descartada                               | Razón                                                                                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JWT (JSON Web Tokens)**                | Sesiones con Cookies (`express-session`)             | Mantener la API 100% _stateless_ (sin estado en el servidor) para facilitar la escalabilidad y el consumo desde cualquier cliente (React, Postman, Móvil).                       |
| **Jest + Supertest (con BD en memoria)** | Tests mockeados (Sin BD real)                        | Realizar pruebas de integración que toquen la base de datos de prueba (`.env.test`) asegura que los modelos de Mongoose, middlewares y base de datos funcionen en conjunto (M9). |
| **Webpack + Babel**                      | Ejecutar los archivos de `src/` directamente en prod | Generar un bundle de producción (`dist/server.bundle.js`) minimizado, limpio y compatible, reduciendo fricciones en el despliegue del contenedor de Docker.                      |

## Versiones mínimas soportadas

- Node.js >= 26.5.0
- MongoDB >= 5.0 (Local o Atlas)
- npm >= 10.0.0
