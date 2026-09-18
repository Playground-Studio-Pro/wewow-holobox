# WeWow Holobox — Design System

## Status

**Visual direction: APPROVED / FROZEN.** This supersedes everything below marked historical.

- **Design Checkpoint 01** (variations A — Spatial Glass, B — Digital Sculpture, C — WeWow Spatial, in `public/design-checkpoint/`): rejected — read as "a traditional UI placed over a black background." Historical reference only.
- **Design Checkpoint 02** (variations D — WeWow Digital Vitrine, E — WeWow Information Field, in `public/design-checkpoint/`): explored (HUD-editorial / suspended particles / floating data-point language, with mouse parallax). Superseded before either was chosen — the user defined a more specific final direction instead. **Its HUD/particles/data and mouse-parallax language is now obsolete and contradicts the frozen constraints below.** Historical reference only.
- **Final approved direction** (this document, current version): Touch-first Glassmorphism. Not implemented yet — implementation is gated on explicit user go-ahead.

## Product context

WeWow Holobox is a physical, vertical, touchscreen installation (a "Holobox") running an offline interactive experience. It is NOT a website, dashboard, or SaaS product. The UI exists on a transparent visual channel, with a person/video visible behind it.

Core flow: `S0_IDLE` (logo, monumental, idle) → touch → `S1_MENU` (7 business units) → select → `T_UNIT_ENTER` (hero transition) → `S2_PERSON` (video of a business-unit Head) → auto-return → `S1_MENU`.

## FROZEN CONSTRAINT 1 — TRANSPARENT COMPOSITING PRINCIPLE

The UI exists on a transparent visual channel. The person/video behind the UI must stay visible through the visual system.

- Do NOT design a background.
- Do NOT create a black screen behind the UI.
- Do NOT create a box/panel that fills the whole viewport.
- Black = absence of content / transparency in the pipeline — not a surface to decorate.
- Keep the human subject as the hero, especially in S2.

## FROZEN CONSTRAINT 2 — TOUCH-FIRST / TOUCH-ONLY INTERACTION MODEL

The final experience is NOT designed for mouse. None of the following exist in production:

- hover
- mouse parallax
- cursor interaction
- states that depend on pointer hover
- selection animations before touch (no anticipating selection, no proximity-based movement, no CTA highlight before touch)

Mouse is used only during development, to simulate touch/click — never as a production interaction mechanism.

**Before touch**, only extremely subtle ambient motion may exist: natural movement of the video/person, minimal optical "breathing" of the glass, very slow ambient motion if it helps the Holobox feel alive.

**TOUCH = TRIGGER.** All deliberate interaction starts with touch:

```
touch down → glass compression → yellow energy/highlight → selected state → transition
```

Touch targets must be large, clear, and comfortable for a vertical physical screen.

## FROZEN CONSTRAINT 3 — VISUAL LANGUAGE: GLASSMORPHISM (FINAL)

**This replaces every prior visual direction** — the original "deep black environment" spec and Checkpoint 02's HUD/particles/data-vitrine language are both obsolete.

**GLASSMORPHISM. Nothing else.**

Material:

- transparent glass
- frosted blur
- translucent white
- soft white highlights
- extremely subtle optical borders
- rounded corners
- diffuse shadows/reflections
- a sense of suspended glass

Color:

- **WHITE** = glass / typography / optical highlights
- **WEWOW YELLOW** (approx. `#F5A623`–`#FFA733`, sampled from the logo) = the ONLY brand energy/accent — light behind the glass, selected state, subtle glow, edge highlight, small graphic details, touch-triggered transition
- **NO blue. NO other accent colors.**

Explicitly NOT:

- HUD
- sci-fi graphics
- random/decorative data
- unnecessary particles
- dashboard aesthetic
- website / SaaS / tablet-menu look
- mouse parallax or hover (see Constraint 2)

## FROZEN CONSTRAINT 4 — HUMAN PRESENCE: FROSTED → TOUCH → CLEAR

**S1:** person/video behind the menu → blurred → subdued → natural video movement (no hover/anticipation design, per Constraint 2).

**Touch on CTA:** glass responds → yellow appears → other elements disappear → glass opens/fades → blur over the person decreases.

**S2:** person fully revealed → **CLEAR** → minimal glass UI around them.

**On return (T_RETURN):** CLEAR → FROSTED (reverse process).

## Confirmed content (do not invent beyond this)

- Welcome copy: **"BIENVENIDOS"** + **"Conoce a las unidades de negocio que forman parte de nuestra organización."**
- 7 business units total. Only one is client-confirmed: **"WEWOW AT WORK!"** (Head: Carlos Landa, Title: "Head WeWow At Work!"). The other 6 use clearly-temporary demo names (e.g. "UNIDAD 02" style placeholders) — never invent real-sounding business names for them.
- Brand asset: `public/branding/wewow-logo.png` — wordmark "We" (amber/orange) + "Wow!" (white), transparent background.
- Real video asset: `public/videos/wewow-at-work-carlos-landa.mp4` (not yet alpha-keyed).

## Typography

- Large, clean, premium sans typeface. Headline type should feel deliberate/branded.
- Big type-scale contrast: monumental sizes for S0 logo/S1 title, restrained smaller sizes for supporting copy and unit labels.
- Generous letter-spacing on all-caps labels to read as premium, not web-default.

## Space & depth

- Generous negative space, large visually-free zones (Constraint 1 — hard requirement, not aesthetic preference).
- Depth expressed through glass layering (frosted blur intensity, scale, subtle shadow) — not through particles or HUD data layers (those are obsolete, see Checkpoint 02 status above).
- Large touch targets (Holobox is touched at arm's length, vertical orientation).

## S1 — business units as glass touch targets

Suspended glass surfaces (frosted, translucent white, thin optical border) — not opaque cards, not a plain equal grid. Selected/touched state reads through yellow glow + glass compression, per Constraint 2's touch sequence. No hover/pre-touch differentiation of any kind.

## S2 — target composition (design intent; not implemented yet)

```
             WEWOW

       UI / INFORMATION
     ╱                 ╲

          PERSONA
       FULL BODY VIDEO

   DATA              DATA

        UI / LIGHT
```

The person/video dominates the center — fully CLEAR (Constraint 4). The "UI/INFORMATION" and "DATA" blocks are minimal glass chips/labels (unit name, head name, head title) — never a HUD data grid, never a card enclosing the person.

## Explicit "must avoid" list

- Plain equal-size 7-card grid (dashboard tile look)
- Large opaque panels / solid black surfaces used as decorative backgrounds
- Filling the viewport with UI, or a "screen within the screen"
- Dashboard aesthetic (stat tiles, sidebar nav, breadcrumbs)
- Generic website UI (navbar, hero + CTA button, footer)
- HUD editorial layout, suspended particles, floating data points (Checkpoint 02 language — obsolete)
- Sci-fi cliché HUD / Iron Man-style interface / walls of random numbers
- Mobile-app aesthetics (bottom tab bar, hamburger menu, list-style settings rows)
- Enclosing the S2 person in a card/frame/box
- Hover states, mouse parallax, proximity-based movement, pre-touch CTA highlighting
- Blue or any accent color other than WeWow yellow

## Motion/interaction principles

- Touch is the only trigger (Constraint 2) — nothing anticipates selection.
- Touch sequence: touch down → glass compression → yellow energy/highlight → selected state → transition.
- White/yellow = the light system; black = transparency, not decoration.
- FROSTED → TOUCH → CLEAR governs S1 → S2; reverses on return.
- The person/video is always the dominant visual element once reached — S1's UI opens space for that moment rather than competing with it.
