# WEWOW ENGINE TASKS

## MILESTONE 01 — FUNCTIONAL HOLOBOX PROTOTYPE

Objetivo:

Construir una vertical slice profesional para probar físicamente en el Holobox.

### TASK 001 — Project Foundation

Status: NEXT

- scaffold frontend
- definir estructura mínima
- configurar development/build
- comprobar assets existentes
- comprobar video playback
- comprobar logo
- mantener instalación reproducible

Acceptance:
App inicia localmente sin errores.

### TASK 002 — State Controller

Status: BLOCKED BY 001

Implementar:

- S0_IDLE
- S1_MENU
- T_UNIT_ENTER
- S2_PERSON
- T_RETURN

Acceptance:
Puede recorrerse el flujo completo.

### TASK 003 — S0 Logo

Status: BLOCKED BY 002

- fondo
- logo WeWow
- touch/click
- entrada a S1

No crear attract animation avanzada.

### TASK 004 — S1 Business Unit Menu

Status: BLOCKED BY 002

- bienvenida
- 7 unidades
- data-driven
- nombres demo permitidos
- touch targets
- primera versión de glass UI

### TASK 005 — Menu → Person Transition

Status: BLOCKED BY 004

- touch feedback
- selected unit response
- menu recedes
- reveal Person Experience
- motion smooth

### TASK 006 — Person Experience

Status: BLOCKED BY 005

- reproducir video real
- mostrar Carlos Landa
- Head WeWow At Work!
- video hero
- menú principal
- auto-return on video end

Todas las unidades pueden usar temporalmente el mismo video.

### TASK 007 — Holobox Visual Polish

Status: BLOCKED BY 006

Evaluar:

- UI scale
- typography
- glass visibility
- touch targets
- video/person scale
- transition timing
- depth
- composition

### TASK 008 — Deployment Test

Status: BLOCKED BY 007

- production build
- fresh-machine installation procedure
- fullscreen test
- offline test
- local asset test
- document exact launch procedure

## Milestone complete when:

Otra computadora puede instalar y ejecutar la experiencia completa:

S0 → S1 → select unit → S2 → return S1

sin depender de la máquina de desarrollo.
