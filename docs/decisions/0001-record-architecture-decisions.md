# 0001. Registrar las decisiones de arquitectura

- **Estado**: Aceptada
- **Fecha**: 2026-08-06
- **Decisores**: Ignacio Rivas D. y equipo de desarrollo

## Contexto y problema

A medida que el proyecto crece a través de los diferentes módulos del curso (M3 al M9), tomamos decisiones arquitectónicas importantes: frameworks, bases de datos, estrategias de testing y despliegue. Sin un registro escrito, el contexto de por qué se tomó una decisión se pierde, lo que genera dudas a futuro ("¿Por qué usamos Mongoose en lugar del driver nativo de Mongo?").

Necesitamos una forma ligera y estándar de documentar estas elecciones.

## Opciones consideradas

- **Confluence / Wiki externa** — Requiere mantener una plataforma separada del código.
- **Comentarios en el código** — Se pierden si el código se refactoriza y no ofrecen una visión global.
- **Architecture Decision Records (ADRs) en Markdown** — Documentos de texto plano versionados junto con el repositorio.

## Decisión

Elegimos **Architecture Decision Records (ADRs) en Markdown** porque mantienen la documentación junto al código, evolucionan con el historial de Git y son fáciles de leer desde GitHub/GitLab.

## Consecuencias

**Positivas:**

- Historial inmutable y claro de las decisiones técnicas.
- Facilita el _onboarding_ de cualquier persona que revise el repositorio (ej. entrevistas o revisión del curso).

**Negativas / costos:**

- Requiere disciplina del equipo para escribir un documento cada vez que se toma una decisión importante, en lugar de simplemente programar.
