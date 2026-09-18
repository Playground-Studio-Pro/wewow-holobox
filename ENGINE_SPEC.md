# WEWOW HOLOBOX EXPERIENCE — ENGINE SPEC

## Product

Experiencia interactiva touch para WeWow ejecutándose localmente en un Holobox vertical.

La experiencia permite explorar las unidades de negocio y conocer al Head/director correspondiente mediante video.

## Runtime requirements

- Local/offline operation
- Vertical Holobox display
- Transparent touch display
- Touch-first / touch-only in production (ver TOUCH-FIRST INTERACTION MODEL) — mouse se usa únicamente durante desarrollo para simular touch/click, nunca como input de producción
- Fullscreen
- 60 FPS target
- Local video playback
- No visible browser/video controls

## HOLOBOX MASTER CANVAS — PORTRAIT 9:16

**Constraint fundamental y permanente — el display físico del Holobox es vertical 9:16.**

```
aspect-ratio: 9 / 16
orientation: portrait
```

Toda la experiencia (S0, S1, S2) se diseña **nativamente** para este canvas vertical — no es una web responsive convencional:

- La UI debe conservar siempre la composición vertical 9:16 del Holobox.
- Puede escalar proporcionalmente para desarrollo y para diferentes resoluciones físicas, pero NO debe reorganizarse como desktop/tablet/mobile responsive (sin breakpoints que cambien radicalmente el layout).
- video/persona = composición vertical dentro del Holobox.
- glass UI = diseñada alrededor del cuerpo humano en formato vertical.
- touch targets = pensados para pantalla física vertical.
- mantener safe areas consistentes entre S0/S1/S2.
- En development, si el browser no es 9:16, la experiencia se muestra centrada dentro de un stage 9:16 escalado proporcionalmente (letterbox), nunca reorganizada.
- El canal sigue siendo transparente (ver TRANSPARENT COMPOSITING PRINCIPLE): el stage 9:16 NO introduce un fondo negro artificial — negro sigue siendo ausencia/transparencia, no una superficie nueva que decorar. La persona/video está detrás del glass dentro de este mismo canvas vertical.

## TRANSPARENT COMPOSITING PRINCIPLE

**Constraint fundamental del producto — aplica a todo el diseño visual, en todos los estados, no solo a S2.**

La UI existe sobre un canal visual transparente. El video/persona existe detrás de la interfaz y debe seguir siendo visible a través del sistema visual en todo momento que la composición lo permita.

- NO diseñar un background.
- NO crear una pantalla negra detrás de la UI.
- NO crear una caja/panel que ocupe todo el viewport.
- Negro representa ausencia de contenido / transparencia visual dentro del pipeline del Holobox — no es una superficie a decorar.
- mantener al sujeto humano como hero visual, especialmente en S2.

## TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL

**Constraint fundamental — la experiencia final NO está diseñada para mouse.**

NO existe en producción:

- hover
- mouse parallax
- cursor interaction
- estados que dependan de pointer hover
- animaciones de selección antes del touch (no anticipar selección, no mover botones por proximidad, no activar highlights de CTA antes del touch)

El mouse puede utilizarse únicamente durante desarrollo, para simular un touch/click — nunca como mecanismo de interacción de producción.

**Antes del touch**, solo puede existir *ambient motion* extremadamente sutil:

- movimiento natural del video/persona
- respiración óptica mínima del glass
- movimiento ambiental muy lento si ayuda a que el Holobox se sienta vivo

**TOUCH = TRIGGER.** Toda interacción deliberada comienza con touch. Al tocar una unidad:

```
touch down → glass compression → yellow energy/highlight → selected state → transición
```

Los touch targets deben ser grandes, claros y cómodos para una pantalla física vertical.

## State model

El modelo inicial es:

```
S0_IDLE
  ↓ touch
S1_MENU
  ↓ select unit
T_UNIT_ENTER
  ↓
S2_PERSON
  ↓ video end OR menu button
T_RETURN
  ↓
S1_MENU
```

### S0_IDLE

Versión inicial:

- logo WeWow suspendido sobre el canal transparente (sin background diseñado — ver TRANSPARENT COMPOSITING PRINCIPLE)
- ambient motion extremadamente sutil únicamente (ver TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL) — sin hover, sin anticipar selección
- touch anywhere to enter

NO desarrollar todavía attract animation compleja.

Eso será una iteración futura.

### S1_MENU

Mostrar:

BIENVENIDOS

"Conoce a las unidades de negocio que forman parte de nuestra organización."

7 unidades de negocio.

La UI debe ser data-driven.

Para el primer build pueden utilizarse nombres demo.

La unidad confirmada por el cliente es:

Unit: WEWOW AT WORK!

Head: Carlos Landa

Title: Head WeWow At Work!

### T_UNIT_ENTER

Transición entre menú y persona.

Primera implementación:

motion/UI en tiempo real.

Comportamiento (bajo TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL — touch es el único trigger, nada se anticipa antes del touch):

```
touch down → glass compression → yellow energy/highlight → selected state → transición
```

1. touch feedback inmediato (glass compression + amarillo)
2. selected unit reacts
3. demás elementos desaparecen/receden
4. interfaz abre espacio
5. transición hacia Person Experience

Bajo TRANSPARENT COMPOSITING PRINCIPLE + HUMAN PRESENCE (FROSTED → TOUCH → CLEAR), esto debe sentirse como una **transformación del mismo espacio**, no como un cambio de página: el glass del menú responde al touch, el amarillo aparece, los demás elementos desaparecen, el glass se abre/desvanece y el blur sobre la persona disminuye hasta revelarla.

NO producir todavía transition videos definitivos.

La prueba física en Holobox determinará qué animaciones deberán producirse posteriormente.

### S2_PERSON

**S2 = VIDEO / PERSON EXPERIENCE. Y nada más.** (Re-evaluación aprobada — reemplaza toda descripción anterior de S2 con identity card/chips y botón de regreso.)

Un único `PersonExperience` reutilizable — pero ya no es un componente de pantalla propio: `PersonPresence` (la capa de video persistente, ver `src/layout/PersonPresence.tsx`) ES la totalidad de S2. No existe ningún componente `S2Person` ni overlay adicional.

Debe recibir data de la unidad seleccionada (el video correspondiente).

**Eliminado por completo de S2** (no ocultar con opacity — no se renderiza):

- identity card / glass name card
- unit label
- nombre de la persona
- título / "Head..."
- línea amarilla asociada a la identity card
- cualquier UI de identidad sobre el video
- botón MENÚ PRINCIPAL
- back button
- cualquier control manual de regreso

S2 = estado **CLEAR** del modelo FROSTED → TOUCH → CLEAR (ver HUMAN PRESENCE abajo): la persona queda completamente revelada. **El video es el hero absoluto — nada se superpone**: no logo nuevo, no progress bar, no controls, no close button, no HUD decorativo, no glass nuevo, no partículas sobre el rostro/persona.

La transición desde S1 puede conservar el lenguaje visual actual (FROSTED → CLEAR, blur/contraste bajando en paralelo con la secuencia de touch de S1).

NO crear S2A/S2B/S2C como componentes separados.

Son instancias/data diferentes del mismo estado S2_PERSON — cada unidad simplemente cambia qué video reproduce `PersonPresence`, nunca un componente distinto.

## HUMAN PRESENCE — FROSTED → TOUCH → CLEAR

Concepto central de interacción visual, aplica across S1/T_UNIT_ENTER/S2:

**S1:** persona/video detrás del menú → blurred → subdued → movimiento natural del video (sin diseño de hover/anticipación, ver TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL). Ver también PERSON HIDDEN (TASK 007): en reposo (sin touch) la persona está completamente invisible, no solo blurred.

**Touch en CTA:** glass responde → amarillo aparece → demás elementos desaparecen → glass se abre/desvanece → blur de la persona disminuye.

**S2:** persona completamente revelada → CLEAR → **sin ninguna UI alrededor** (ver S2_PERSON arriba — ya no hay "mínima UI glass", no hay UI en absoluto).

**Al volver (T_RETURN):** CLEAR → FROSTED (proceso inverso) — automático, disparado por el fin natural del video, nunca por una acción manual del usuario.

## Video behavior

El video:

- autoplay al entrar en S2
- sin controles
- se reproduce localmente
- debe cargar limpio desde el principio al cambiar de unidad (`video.load()` + reset de `currentTime`, ver `PersonPresence.tsx`) — nunca debe permanecer el frame/estado del video anterior
- **al terminar (evento real `video.onEnded`, nunca un timer que estime duración) regresa automáticamente al menú — esta es la ÚNICA forma de salir de S2.**

No existe botón de regreso manual. El regreso es 100% automático y depende del final natural del video.

## Green screen / alpha

El material original fue grabado en green screen.

Objetivo final:

video profesionalmente keyeado con alpha para integrar a la persona orgánicamente en el Holobox.

NO implementar chroma key complejo en tiempo real.

VideoStage debe permitir sustituir fácilmente el video actual por un asset con alpha posteriormente.

## Content model

Definir conceptualmente una estructura similar a:

BusinessUnit:

- id
- name
- headName
- headTitle
- video
- enabled

Las 7 opciones se generan desde data/config.

## VISUAL LANGUAGE — GLASSMORPHISM (FINAL, aprobado)

**Esto reemplaza toda dirección visual anterior** (deep-black-environment de la spec original, y el "WeWow Digital Vitrine / Spatial Information Environment" con HUD editorial/partículas/datos del Design Checkpoint 02 — ambos quedan obsoletos y solo como referencia histórica en `public/design-checkpoint/`).

**GLASSMORPHISM. Nada más.**

Material:

- glass transparente
- frosted blur
- blanco translúcido
- highlights blancos suaves
- bordes ópticos extremadamente sutiles
- rounded corners
- sombras/reflejos difusos
- sensación de vidrio suspendido

Color:

- **WHITE** = glass / typography / optical highlights
- **WEWOW YELLOW** = única energía/acento de marca — luz detrás del vidrio, selected state, glow sutil, edge highlight, pequeños detalles gráficos, transición activada por touch
- **NO blue.** NO otros colores de acento.

Explícitamente NO:

- HUD
- sci-fi graphics
- random/decorative data
- partículas innecesarias
- dashboard aesthetic
- mouse parallax / hover (ver TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL)

Principios:

- composición sobre transparencia (ver TRANSPARENT COMPOSITING PRINCIPLE)
- touch-first (ver TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL)
- premium typography
- generous spacing, grandes zonas visualmente libres
- large touch targets
- ambient motion extremadamente sutil únicamente antes del touch — nada anticipa la selección

La persona/video domina S2 — la UI la envuelve y complementa, no la encierra en una card.

La UI acompaña, no compite.
