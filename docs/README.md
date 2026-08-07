# Documentación de API Tickets

Mapa de la documentación del proyecto. Empieza por aquí para saber qué documento
responde cada pregunta.

| Documento                                                      | Pregunta que responde             | Cuándo leerlo                   |
| -------------------------------------------------------------- | --------------------------------- | ------------------------------- |
| [`architecture/architecture.md`](architecture/architecture.md) | ¿Cómo está construido el sistema? | Al entender el panorama general |
| [`architecture/stack.md`](architecture/stack.md)               | ¿Con qué tecnologías y versiones? | Al configurar el entorno        |
| [`architecture/database.md`](architecture/database.md)         | ¿Qué entidades y relaciones hay?  | Al trabajar con datos           |
| [`architecture/auth.md`](architecture/auth.md)                 | ¿Cómo se entra y qué se permite?  | Al tocar autenticación/permisos |
| [`architecture/api.md`](architecture/api.md)                   | ¿Qué endpoints expone?            | Al integrar o consumir la API   |
| [`decisions/`](decisions/README.md)                            | ¿Por qué tomamos cada decisión?   | Antes de re-debatir algo        |

## Cómo mantener esta documentación

- Actualiza la línea **"Última actualización"** al editar un documento.
- Registra las decisiones relevantes como [ADRs](decisions/README.md).
- Mantén este índice al día si agregas o quitas documentos.
