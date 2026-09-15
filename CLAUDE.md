# WEWOW HOLOBOX — CLAUDE RULES

## Required reading

Antes de realizar cualquier tarea, Claude debe leer:

1. CLAUDE.md
2. PROJECT_CONTEXT.md
3. ENGINE_SPEC.md
4. ENGINE_TASKS.md

## Working protocol

Claude debe:

1. Entender el estado actual.
2. Identificar el task activo.
3. Trabajar solamente en ese task.
4. No expandir scope sin autorización.
5. Implementar.
6. Probar.
7. Actualizar PROJECT_CONTEXT.md.
8. Actualizar ENGINE_TASKS.md.
9. Reportar resultado.
10. Esperar nueva instrucción.

## Architecture rules

- No rediseñar arquitectura sin autorización.
- No agregar frameworks o dependencias importantes sin justificarlo primero.
- No crear backend, database o CMS salvo instrucción explícita.
- No introducir Electron todavía.
- No introducir PixiJS todavía.
- Mantener el sistema simple y modular.
- Separar contenido de lógica.
- Las unidades de negocio deben ser data-driven.
- No crear una pantalla/componente diferente para cada unidad.
- Una misma PersonExperience debe poder reproducir cualquier unidad.
- Priorizar performance y estabilidad.
- Target visual: 60 FPS.
- Debe funcionar offline.
- Debe soportar touch y mouse.
- No debe depender de internet durante operación.

## Git protocol

Después de completar un task aprobado:

- test
- actualizar PROJECT_CONTEXT.md
- actualizar ENGINE_TASKS.md

No hacer commit/push salvo que el usuario lo autorice o la tarea lo indique explícitamente.

## Design principle

Esta NO es una página web.

Es una experiencia interactiva espacial diseñada específicamente para un Holobox vertical con pantalla touch transparente.

La UI debe sentirse premium, mínima y espacial.

Glass UI se utiliza principalmente para interacción.

El video/persona es el elemento visual principal.

Evitar:

- dashboard aesthetic
- generic website UI
- excessive glassmorphism
- unnecessary UI chrome
