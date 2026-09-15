# WEWOW HOLOBOX EXPERIENCE — ENGINE SPEC

## Product

Experiencia interactiva touch para WeWow ejecutándose localmente en un Holobox vertical.

La experiencia permite explorar las unidades de negocio y conocer al Head/director correspondiente mediante video.

## Runtime requirements

- Local/offline operation
- Vertical Holobox display
- Transparent touch display
- Mouse support during development
- Fullscreen
- 60 FPS target
- Local video playback
- No visible browser/video controls

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

- fondo/ambiente visual
- logo WeWow
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

Comportamiento:

1. touch feedback inmediato
2. selected unit reacts
3. demás elementos desaparecen/receden
4. interfaz abre espacio
5. transición hacia Person Experience

NO producir todavía transition videos definitivos.

La prueba física en Holobox determinará qué animaciones deberán producirse posteriormente.

### S2_PERSON

Un único PersonExperience reutilizable.

Debe recibir data de la unidad seleccionada.

Debe mostrar:

- video
- unit name
- head name
- head title
- botón MENÚ PRINCIPAL

Durante el primer build TODAS las unidades pueden reproducir:

`public/videos/wewow-at-work-carlos-landa.mp4`

Esto es intencional.

Estamos construyendo primero una vertical slice completa para evaluar la experiencia físicamente.

Cuando existan los assets finales:

- Unit A → Video A
- Unit B → Video B
- Unit C → Video C
- etc.

NO crear S2A/S2B/S2C como componentes separados.

Son instancias/data diferentes del mismo estado S2_PERSON.

## Video behavior

El video:

- autoplay al entrar en S2
- sin controles
- se reproduce localmente
- debe poder detenerse
- debe resetearse al regresar al menú
- al terminar debe regresar automáticamente al menú

El botón:

← MENÚ PRINCIPAL

debe permanecer accesible durante el video.

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

## Visual direction

Premium spatial glass interface.

Referencia conceptual:

premium museum installation
+
spatial computing UI
+
corporate holographic experience

Principios:

- deep black environment
- subtle glass
- restrained transparency
- thin borders
- controlled highlights
- depth
- premium typography
- generous spacing
- large touch targets
- subtle ambient motion

La persona/video domina S2.

La UI acompaña, no compite.
