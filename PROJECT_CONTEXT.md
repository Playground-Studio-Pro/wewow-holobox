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
- Botón discreto "← MENÚ PRINCIPAL" visible durante todo el video, en posición fija; al presionarlo el video se detiene y regresa de inmediato a la portada.
- La misma estructura (selección → identidad de unidad → video del Head → cierre → regreso automático) se replica para las 7 unidades.
- Comportamiento en inactividad: si el Holobox permanece sin interacción ~30–45 segundos, se activa una animación que invita a participar ("DESCUBRE NUESTRAS UNIDADES DE NEGOCIO" / "TOCA UNA OPCIÓN PARA COMENZAR"), luego vuelve a mostrar los 7 botones.

No inventar requerimientos adicionales del cliente.

## Current prototype decisions

- S0 será sólo logo inicialmente.
- S1 tendrá 7 opciones.
- nombres demo permitidos inicialmente.
- todas las opciones pueden abrir el mismo video.
- transiciones inicialmente mediante UI/motion.
- videos de transición finales se decidirán después de prueba física.
- un único PersonExperience reutilizable.
- funcionamiento local/offline.
- touch + mouse.
- fullscreen.
- target 60 FPS.

## Existing assets

Logo:
`public/branding/wewow-logo.png`

Video:
`public/videos/wewow-at-work-carlos-landa.mp4`

Client brief:
`GUIÓN DE CONTENIDO INTERACTIVO – HOLOBOX.pdf`

## Confirmed content

Unit:
WEWOW AT WORK!

Person:
Carlos Landa

Title:
Head WeWow At Work!

## Repository state

- Git initialized
- main branch
- initial commit exists
- Git LFS configured for MP4
- application not scaffolded yet
- no frontend dependencies installed yet

## Immediate next task

TASK 001 — Project Foundation

## Important constraint

El build debe poder instalarse mañana en otra computadora conectada al Holobox.

Por eso:

- reproducible setup
- local assets
- offline operation
- simple deployment

son prioritarios.
