# WEWOW HOLOBOX — PROJECT CONTEXT

## Current objective

Construir lo antes posible el primer prototipo funcional profesional de la experiencia WeWow y probarlo físicamente en el Holobox.

Este prototipo evolucionará hacia producción.

No es un mockup desechable.

## Client status

Proyecto vendido/aprobado.

Estamos en desarrollo.

## Current product flow

PORTADA (Logo + Bienvenidos + 7 Unidades de Negocio)
→
SELECCIONAR UNIDAD
→
Transición
→
VIDEO DEL DIRECTOR / HEAD
→
CIERRE
→
REGRESO AUTOMÁTICO AL MENÚ PRINCIPAL

## Confirmed client requirements

Según "GUIÓN DE CONTENIDO INTERACTIVO – HOLOBOX.pdf":

- Portada/menú principal con animación de entrada de marca (logo) y mensaje de bienvenida.
- Texto: "BIENVENIDOS" + "Conoce a las unidades de negocio que forman parte de nuestra organización."
- 7 botones, uno por Unidad de Negocio (`[ UNIDAD 01 ]` … `[ UNIDAD 07 ]` como placeholders genéricos en el guión).
- Selección touch de una unidad.
- Transición de selección: el botón se activa mediante un pulso de luz / expansión gráfica y el resto de los elementos del menú desaparecen.
- Tras seleccionar, aparece el nombre de la unidad (ej. "WEWOW AT WORK!") durante 2–3 segundos antes de iniciar el video automáticamente.
- Video del Head/director presentando brevemente la unidad.
- Cierre del video: transición gráfica con la identidad de la unidad, puede cerrar con una frase (ej. "WEWOW AT WORK!").
- Regreso automático al menú principal al finalizar el video, mostrando nuevamente las 7 unidades.
- ~~Botón discreto "← MENÚ PRINCIPAL" visible durante todo el video~~ — **eliminado por decisión aprobada posterior** (re-evaluación S2): S2 ya no tiene ningún botón de regreso manual, el regreso es 100% automático al terminar el video (ver constraint 4 abajo, actualizado).
- La misma estructura (selección → video del Head → regreso automático) se replica para las 7 unidades.
- Comportamiento en inactividad: si el Holobox permanece sin interacción ~30–45 segundos, se activa una animación que invita a participar ("DESCUBRE NUESTRAS UNIDADES DE NEGOCIO" / "TOCA UNA OPCIÓN PARA COMENZAR"), luego vuelve a mostrar los 7 botones.

No inventar requerimientos adicionales del cliente.

## Fundamental visual/interaction constraints — APROBADOS, CONGELADOS

Estos 4 constraints son permanentes y aplican a todo el producto (no solo a un estado). Detalle completo en `ENGINE_SPEC.md`.

1. **TRANSPARENT COMPOSITING PRINCIPLE** — la UI existe sobre un canal visual transparente. NO background diseñado, NO pantalla negra detrás de la UI, NO caja/panel que ocupe todo el viewport. El video/persona debe seguir siendo visible a través del sistema visual.
2. **TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL** — la experiencia final NO está diseñada para mouse. Sin hover, sin mouse parallax, sin anticipar selección, sin highlights de CTA antes del touch. Antes del touch solo existe ambient motion extremadamente sutil (video/persona, respiración óptica mínima del glass). TOUCH = TRIGGER: touch down → glass compression → yellow energy/highlight → selected state → transición. Mouse solo se usa durante desarrollo para simular touch/click.
3. **VISUAL LANGUAGE FINAL: GLASSMORPHISM** — glass transparente, frosted blur, blanco translúcido, highlights suaves, bordes ópticos sutiles, rounded corners, vidrio suspendido. Color: WHITE = glass/typography/highlights; WEWOW YELLOW = única energía/acento (glow, selected state, edge highlight, transición por touch). NO blue, NO otros acentos, NO HUD, NO sci-fi graphics, NO random data, NO partículas innecesarias, NO dashboard.
4. **HUMAN PRESENCE — FROSTED → TOUCH → CLEAR** — S1: persona/video detrás del menú, blurred/subdued, movimiento natural (actualizado en TASK 007: en reposo la persona está completamente INVISIBLE, no solo blurred — ver PERSON HIDDEN abajo). Touch en CTA: glass responde → amarillo aparece → demás elementos desaparecen → glass se abre/desvanece → blur de la persona disminuye. S2: persona completamente revelada (CLEAR), **sin ninguna UI alrededor** (actualizado — re-evaluación S2: ya no hay "mínima UI glass", el video es el hero absoluto sin overlay de ningún tipo). Al volver: CLEAR → FROSTED, automático al terminar el video — no existe botón de regreso manual.
5. **HOLOBOX MASTER CANVAS — PORTRAIT 9:16** — `aspect-ratio: 9 / 16`, `orientation: portrait`. Toda la experiencia (S0/S1/S2) se diseña nativamente para este canvas vertical, NO como web responsive. Puede escalar proporcionalmente para desarrollo/distintas resoluciones físicas, pero nunca reorganizarse (sin breakpoints que cambien el layout). En development, si el browser no es 9:16, la experiencia se muestra centrada dentro de un stage 9:16 escalado (letterbox). El stage NO introduce un fondo negro artificial — negro sigue siendo ausencia/transparencia (constraint 1), no una superficie nueva.

**Por qué:** Design Checkpoint 01 (A/B/C) se sintió "UI tradicional sobre fondo negro" — no comunicaba transparencia. Design Checkpoint 02 (D/E, dirección "Digital Vitrine/Information Field" con HUD editorial, partículas, datos flotantes y mouse parallax) fue explorado pero el usuario definió una dirección final más específica y distinta antes de elegir entre D y E: glassmorphism puro, touch-only, sin HUD ni partículas. Los constraints 1–5 de arriba son la dirección final aprobada y **reemplazan** cualquier lectura visual anterior (deep-black-environment original, y el lenguaje HUD/partículas/mouse-parallax de Checkpoint 02).

## Design checkpoint status

- **Checkpoint 01** (variaciones A — Spatial Glass, B — Digital Sculpture, C — WeWow Spatial): rechazado. Histórico en `public/design-checkpoint/`.
- **Checkpoint 02** (variaciones D — WeWow Digital Vitrine, E — WeWow Information Field): superado por la dirección final antes de elegir entre las dos — su lenguaje de HUD/partículas/datos flotantes y mouse parallax queda obsoleto (contradice el TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL y el VISUAL LANGUAGE FINAL). Histórico en `public/design-checkpoint/`.
- **Dirección visual final: APROBADA** (constraints 1–4 arriba). `ENGINE_TASKS.md` actualizado y TASK 002 (State Controller) implementado bajo estos constraints — ver Repository state.

## Current prototype decisions

- S0 será sólo logo inicialmente.
- S1 tendrá 7 opciones.
- nombres demo permitidos inicialmente.
- todas las opciones pueden abrir el mismo video.
- transiciones inicialmente mediante UI/motion.
- videos de transición finales se decidirán después de prueba física.
- un único PersonExperience reutilizable.
- funcionamiento local/offline.
- touch-first / touch-only en producción; mouse solo para simular touch durante desarrollo (ver constraints arriba — reemplaza la decisión anterior de "touch + mouse" como inputs de producción equivalentes).
- fullscreen.
- target 60 FPS.

## Existing assets

Logo:
`public/branding/wewow-logo.png`

**Videos reales por unidad — re-inventariados en esta pasada (RE-EVALUATION), el filesystem cambió otra vez.** La entrega anterior (carpetas por unidad, `public/videos/<UNIDAD>/archivo.mp4`) ya NO existe — el cliente la reemplazó por 7 archivos planos directamente en `public/videos/`. Este es el inventario verificado por inspección directa del filesystem (no se usó información histórica que contradijera esto):

- `public/videos/CARLOS LANDA_WEWORK.mp4`
- `public/videos/MAURICIO URIBE_ CONSULTING!.mp4`
- `public/videos/_MAURICIO URIBE_ CULTURE!.mp4`
- `public/videos/JORGE ROSAS_ HIRING!.mp4`
- `public/videos/GERARDO CHAVEZ LEARNING!.mp4`
- `public/videos/SANDRA MICHELSEN_ OUTPLACEMENT!.mp4`
- `public/videos/MARIABELEN CARABAÑO_TALENT ATTRACTION!.mp4`

Los 7 están conectados en `src/data/businessUnits.ts` (uno por unidad, sin ambigüedad de mapeo — cada archivo corresponde a exactamente una unidad). No quedó ningún video sin usar en esta entrega (a diferencia de la anterior, que tenía un archivo `WEWOW/JORGE ROSAS 3 MIN-.mp4` sin asignar — esa carpeta ya no existe).

Client brief:
`GUIÓN DE CONTENIDO INTERACTIVO – HOLOBOX.pdf`

## Confirmed content

Las 7 unidades de negocio tienen contenido real (nombre + head + video). Ver `src/data/businessUnits.ts` (fuente de verdad — actualizado en esta re-evaluación, ningún path del delivery anterior sigue vigente).

| Unidad | Head | Video |
|---|---|---|
| WeWow At Work! | Carlos Landa | CARLOS LANDA_WEWORK.mp4 |
| Consulting | Mauricio Uribe | MAURICIO URIBE_ CONSULTING!.mp4 |
| Culture & Transformation | Mauricio Uribe | _MAURICIO URIBE_ CULTURE!.mp4 |
| Hiring | Jorge Rosas | JORGE ROSAS_ HIRING!.mp4 |
| Learning | Gerardo Chavez | GERARDO CHAVEZ LEARNING!.mp4 |
| Outplacement | Sandra Michelsen | SANDRA MICHELSEN_ OUTPLACEMENT!.mp4 |
| Talent Attraction | Mariabelen Carabaño | MARIABELEN CARABAÑO_TALENT ATTRACTION!.mp4 |

**Dos correcciones de ortografía respecto a la entrega anterior**, aplicadas porque el filesystem actual contradice la información histórica (y se prioriza el filesystem actual, según instrucción explícita): "Carlos Landa" (el archivo ambiguo "CARLOS LARA-.mp4" de la entrega anterior ya no existe; el archivo actual confirma "LANDA"). "Mariabelen Carabaño" (antes "Maribel Carbaño" — el archivo actual usa esta ortografía).

**Ambigüedad reportada, sin resolver — nombre de unidad "Hiring":** la entrega anterior tenía a Jorge Rosas como head de "Coaching & Mentoring". El archivo actual lo etiqueta "HIRING", nombre que no existía antes. Por eliminación (único archivo/persona restante para la única unidad restante) se asumió que es la misma unidad renombrada, y se actualizó `name`/`id` en el código a "Hiring" — pero ese nombre viene solo del filename, nunca fue confirmado explícitamente por el cliente como el nuevo nombre oficial. **Pendiente de confirmación.**

**headTitle** sigue el patrón ya confirmado por el cliente para la unidad original ("Head WeWow At Work!") → "Head `<Nombre de unidad>`" — inferencia de patrón consistente, no contenido inventado.

**Orden de las unidades:** WeWow At Work! primera (confirmada), luego alfabético. No representa prioridad de negocio del cliente.

## Repository state

- Git initialized
- main branch
- remote `origin` conectado a GitHub (privado), `main` sincronizado
- Git LFS configurado para MP4
- Frontend scaffolded en la raíz del repo: Vite + React + TypeScript
- Dependencias instaladas: react, react-dom, motion (dependencies); vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom (devDependencies)
- `npm run dev` y `npm run build` verificados sin errores
- TASK 002 (State Controller) implementado: `src/state/useHoloboxController.ts` (5 estados, transiciones enter/selectUnit/returnToMenu), `src/types.ts` + `src/data/businessUnits.ts` (content model data-driven, 7 unidades), `src/App.tsx` reescrito para renderizar según el estado. Pantalla de diagnóstico de TASK 001 ya fue reemplazada.
- TASK 003 (S0 Logo) implementado: `src/screens/S0Idle.tsx` — logo suspendido, halo amarillo sutil, ambient motion (breathing/float), sin background diseñado, cero hover.
- TASK 004 (S1 Business Unit Menu) implementado: `src/screens/S1Menu.tsx` — glassmorphism (glass cards con backdrop-filter acotado por card, nunca fullscreen), persona/video de Carlos detrás del menú blurred/subdued (HUMAN PRESENCE: FROSTED), secuencia de touch local completa (glass compression → glow amarillo → cards se desvanecen → blur de la persona baja) antes de avisar al controller. Estilos glassmorphism traducidos manualmente a CSS propio desde una referencia técnica externa (glassmorphism SKILL.md) — sin adoptar Tailwind, sin copiar su diseño literal.
- Reducido `T_UNIT_ENTER_MS` del controller (500ms → 150ms) porque el peso visual de la transición ya lo lleva S1Menu antes del hand-off.
- **Corrección aplicada — Holobox master canvas 9:16**: se agregó `src/layout/HoloboxStage.tsx`, que envuelve toda la app en un canvas `aspect-ratio: 9/16` (letterbox, mismo negro que el resto — sin fondo artificial). Todas las medidas de `App.css` se convirtieron a container query units (cqw/cqh, `container-type: size` en `.holobox-canvas`) para escalar proporcionalmente con la resolución sin reorganizar el layout. Verificado con `getBoundingClientRect()`: ratio exacto 0.5625 en una ventana ancha de desarrollo.
- Flujo completo verificado en navegador (ya dentro del canvas 9:16): S0 (logo+halo) → S1 (glass cards + persona blurred detrás) → touch en unidad (secuencia FROSTED→TOUCH visible) → S2 (data correcta) → regreso a menú → selección de otra unidad → S2 con data distinta. Sin errores de consola. `npm run build` sin errores.
- **Feedback del usuario ("no me gusta nada, el video tiene que entrar mucho más suave, el UI apesta") + corrección aplicada:**
  - `src/layout/PersonPresence.tsx` (nuevo) — el video de la persona pasó de vivir dentro de S1Menu/S2Person (dos `<video>` distintos, con reinicio/corte al entrar a S2) a ser una única capa persistente montada en `App.tsx`, nunca desmontada entre S1↔S2. Confirmado con un marcador en `dataset` que sobrevive todo el ciclo. Blur/opacity ahora transicionan 1.6s/1.1s con easing premium, en vez del corte anterior.
  - `S1Menu.tsx` — composición de las 7 unidades pasó de columna uniforme a layout espacial (ancho/alineación distintos por unidad, WeWow At Work! más prominente).
  - `App.css` — glass cards con gradiente + highlight superior + sombra en capas + glow ámbar tenue siempre visible en reposo (antes 0, se sentía "plano"); tipografía con más contraste de peso/tracking.
  - Fix real encontrado en verificación (no ambiental): `video.play()` sin capturar su promesa producía un `AbortError` en consola cuando el browser interrumpe con `pause()` — corregido con `.catch(() => {})`.
- **Causa raíz confirmada de la limitación de verificación visual** (ya mencionada en rounds anteriores, ahora diagnosticada con evidencia directa): el tab del navegador automatizado que uso para verificar tiene `document.hidden === true` / `visibilityState: "hidden"` de forma persistente (confirmado vía `document.hidden`), incluso con `hasFocus() === true`. Chrome pausa `requestAnimationFrame` y la decodificación de `<video>` en tabs que considera no-visibles/no-compuestos a pantalla — por eso Motion nunca progresa visualmente y el video nunca avanza `currentTime`/`readyState` en este entorno, mientras que la lógica basada en `setTimeout` (la máquina de estados) sí avanza (heavily throttled pero no congelada). Esto NO es un bug de la app — la lógica de estados, data y estructura DOM se verificaron correctas end-to-end; lo único que no se puede juzgar aquí es el *feel* visual real del motion/blur/video. Recomendado: abrir `http://localhost:5183/` en una ventana de navegador normal y visible para evaluar el resultado final.

- **WeWow Visual Spec — Final (TASK 004/005/006 completas):** implementada la hero transition FROSTED → CLEAR de 9 pasos exacta (compresión <100ms, highlight amarillo, CTAs no seleccionados derivan hacia el perímetro, CTA seleccionado se abre/disuelve hacia arriba, blur+contraste de Carlos bajan en paralelo, header se desvanece, identidad mínima aparece con delay). `PersonPresence.tsx` ahora anima también `contrast()` (no solo blur/opacity). S2 tiene un chip de vidrio mínimo (`.s2-identity-glass`) y un botón de regreso con su propio chip discreto — nunca una card que encierre a la persona.
- **Referencia técnica usada solo por sus principios de material/motion** (nunca su estética): `vaporwave-glassomorphic-ui-designer` SKILL.md — se tomaron frosted translucent material, layered transparency, subtle borders, content visible behind glass, material hierarchy, immediate touch feedback, smooth reveal timing, 60fps performance (backdrop-filter acotado por objeto). Se ignoró explícitamente todo lo demás (vaporwave, colores rosa/azul/cian/púrpura/menta, Y2K, retro, SwiftUI/Metal, hover).
- **Regresión detectada y revertida — AnimatePresence genérico:** intenté envolver el switch de pantallas (`App.tsx`) en `<AnimatePresence>` como red de seguridad de crossfade entre todos los estados. Causó que el ciclo de regreso (S2→S1) se quedara atascado — al reciclar una `key` de estado ya usada antes, React reutiliza un nodo cuya animación de salida nunca resolvió (agravado por la limitación de `document.hidden` de arriba). **Revertido por completo**; no era necesario — `PersonPresence` (persistente) + la secuencia local de `S1Menu` ya garantizan la ausencia de "page cut" sin necesidad de esa capa extra. Verificado tras revertir: dos ciclos completos S0→S1→touch→S2→regreso→S1→touch(otra unidad)→S2 sin acumulación de pantallas, con datos correctos en cada paso, sin errores de consola de la app.
- **Verificación técnica de `backdrop-filter`:** `CSS.supports('backdrop-filter', 'blur(10px)')` → `true` en el Chrome usado; `getComputedStyle` sobre una `.glass-unit` confirma `backdropFilter: "blur(12.108px) saturate(1.15)"` efectivamente aplicado (el valor en cqw se resuelve correctamente a píxeles reales). No se detectó ninguna limitación técnica del navegador respecto a transparent compositing o backdrop-filter — la única limitación de esta sesión es la ya documentada arriba (`document.hidden` congelando la reproducción visual de las animaciones, no la funcionalidad).

- **TASK 007 — dirección visual final S1 (tech glass grid), en curso:** implementación directa sobre la app real, con nueva referencia visual aprobada. Cambios principales:
  - **PERSON HIDDEN en S1** — cambio de concepto respecto a la iteración anterior: Carlos ya NO se muestra blurred de fondo en el menú (era la dirección de TASK 004/005). Ahora la persona permanece 100% invisible (`opacity: 0`) durante S1 idle, y solo empieza a revelarse ("fades/reveals into the transparent stage") en el instante del touch, llegando a CLEAR total en S2. El canal sigue transparente — no se agregó ningún background/panel opaco para lograr esto, la persona simplemente no se muestra dentro de `PersonPresence` hasta el touch.
  - **Tech glass grid de 2 columnas**: reemplaza la composición espacial asimétrica anterior (columna única, cards con anchos/alineaciones dispersos). Ahora: logo+BIENVENIDOS arriba, grid 2×3 + 1 centrada (card 07) al centro, hint abajo. Cada card tiene número, línea de acento amarilla, slot de icono (preparado vía `BusinessUnit.iconSrc`, sin assets todavía — `public/icons/units/`), nombre, e indicador circular de navegación.
  - **Tipografía Avenir Next/Avenir** (system font, sin descargas) reemplaza el stack `system-ui` genérico anterior.
  - **Bug real encontrado y corregido durante verificación**: la primera versión del grid desbordaba verticalmente el canvas 9:16 (contenido más alto que el contenedor, quedaba contenido cortado por `overflow: hidden`) — causado por padding/gaps generosos + elementos de chrome (icon-slot, nav-circle) escalados en `cqw` en vez de tamaño fijo. Corregido ajustando el presupuesto vertical completo; verificado con `scrollHeight === clientHeight` (sin overflow) tras el fix.
  - Se preserva intacto: state controller, flujo S0→S1→S2→S1, `PersonPresence` (misma arquitectura, solo cambian los valores `TARGETS`), lógica de video, touch-only, HoloboxStage 9:16, auto-return, S2 funcional. No se tocó S0 (salvo lo estrictamente necesario) ni se rediseñó S2 a fondo, según instrucción explícita.
- **Tooling interno — Fullscreen fix + Design Controls** (antes de continuar con particles/motion polish, a pedido explícito del usuario):
  - Fix fullscreen: `.holobox-viewport`/`.holobox-canvas` pasaron de `vw`/`vh` a `dvw`/`dvh`; la fórmula existente ya convergía matemáticamente a fullscreen exacto (sin letterbox) cuando el viewport es 9:16 — se verificó el cálculo y el comportamiento del eje restrictivo en una ventana no-9:16, pero no se pudo forzar una ventana EXACTAMENTE 9:16 en el navegador automatizado (limitación de la herramienta, no de la app) — recomendable confirmación en navegador real/display físico.
  - Panel `DESIGN CONTROLS` dev-only (`src/dev/`): overlay fuera del canvas 9:16, tecla `D`, sliders/toggles para Glass/Cards/Layout/Yellow/Ambient Motion/Particles/Transition, Debug State (LIVE/S0/S1/S2 — override de renderizado, NO toca `useHoloboxController`), RESET DESIGN, COPY CONFIG.
  - Config central `src/config/designConfig.ts` (+ `debugState.ts`): store pub-sub sobre `useSyncExternalStore` nativo (sin dependencias nuevas). Defaults = diseño ya aprobado; CSS vars con fallback = mismo diseño cuando nunca se tocan (producción).
  - Sistema de partículas preparado (`AmbientParticles.tsx`), **apagado por defecto** — no forma parte del diseño aprobado todavía.
  - **Verificación de producción real**: `npm run build` + grep en `dist/` confirma CERO referencias a `DesignControls`/`dc-section` (tree-shaking correcto de la rama `import.meta.env.DEV`). `npm run preview` (servidor de producción real, no dev) confirma que la tecla D no hace nada y el flujo completo S0→S1→S2→S1 sigue funcionando sin errores.
  - Documentado en `DESIGN_SYSTEM.md` (nuevo archivo en la raíz).
- **Assets reales de las 7 unidades entregados por el cliente** (entrega #1, luego reemplazada — ver siguiente entrada): carpetas por unidad en `public/videos/`, ya no existen en disco.
- **RE-EVALUATION / CLEANUP — S2 simplificado + assets re-inventariados (entrega #2 de video, reemplaza la #1):**
  - **S2 = video/person experience puro.** Eliminado por completo (no con opacity): `src/screens/S2Person.tsx` (borrado), y en `App.css` todo el CSS exclusivo de S2 (`.screen-s2`, `.s2-back`, `.s2-identity-glass`, `.s2-unit-name`, `.s2-head-name`, `.s2-head-title`). `App.tsx` ya no importa `S2Person`; el case `S2_PERSON` retorna `null` — `PersonPresence` (siempre montado) ya muestra el video en CLEAR sin ningún overlay. Sin identity card, sin nombre/título flotante, sin botón de regreso manual.
  - **Auto-return reutilizado, no reinventado**: `PersonPresence.handleEnded` (ya existente) sigue siendo la única fuente de verdad — el evento real `video.onEnded` dispara `returnToMenu`. No se agregó ningún timer.
  - **Reset de video reforzado**: nuevo `useEffect` en `PersonPresence.tsx`, keyed en `unit?.video`, que llama `video.load()` explícitamente al cambiar de unidad (además del cambio implícito de `src`) — garantiza `currentTime = 0` y sin residuo del video anterior. Sin cache-busting (assets locales estáticos).
  - **Filesystem de video cambió otra vez**: la entrega de carpetas-por-unidad ya no existe; ahora son 7 archivos planos en `public/videos/` con head+unidad codificados en el filename. `src/data/businessUnits.ts` reescrito completo con los 7 paths actuales (ver tabla en "Confirmed content" arriba) — cero paths del delivery anterior sobreviven.
  - **Dos correcciones de ortografía** (filesystem actual como fuente de verdad): "Carlos Landa" confirmado (el archivo ambiguo "LARA" ya no existe), "Mariabelen Carabaño" (antes "Maribel Carbaño").
  - **Ambigüedad reportada, no adivinada**: unidad "Hiring" (antes "Coaching & Mentoring") — mapeada por eliminación (único archivo/persona restante), pero el nombre "Hiring" viene solo del filename, sin confirmación explícita del cliente.
  - **Design Controls**: se revisó si existían controles dedicados a "Identity Card" — no existían, nada que remover. Debug State `[S0][S1][S2]` preservado y verificado.
  - **Validado end-to-end las 7 unidades** en navegador real (dev y `npm run preview` producción): cada unidad carga su propio video desde 0, sin identity card, sin back button, `ended` real dispara auto-return, S1 queda listo para la siguiente selección, sin errores de consola. Fullscreen 9:16 verificado intacto (ratio 0.5625).
  - Documentación actualizada: `ENGINE_SPEC.md` (S2_PERSON, HUMAN PRESENCE, Video behavior reescritos), `ENGINE_TASKS.md` (TASK 006 marcado superseded, nueva entrada #16 en TASK 007), `DESIGN_SYSTEM.md` (sección Fullscreen/Design Controls revisada por consistencia).

## Immediate next task

TASK 007 sigue **IN PROGRESS** — dirección visual final de S1 implementada + tooling de Fullscreen/Design Controls + S2 simplificado a video/person puro + las 7 unidades con contenido y video real (segunda entrega de assets). Pendiente de: (1) revisión visual del usuario sobre esta limpieza de S2 y el fullscreen, (2) que el cliente confirme si "Hiring" es el nombre oficial correcto para esa unidad (antes "Coaching & Mentoring"). NO avanzar a otro task hasta esa revisión (instrucción explícita del usuario).

## Important constraint

El build debe poder instalarse mañana en otra computadora conectada al Holobox.

Por eso:

- reproducible setup
- local assets
- offline operation
- simple deployment

son prioritarios.
