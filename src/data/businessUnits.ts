import type { BusinessUnit } from "../types";

/**
 * Videos reales por unidad — RE-EVALUACIÓN de assets (ver ENGINE_TASKS.md).
 * El cliente reemplazó la entrega anterior (carpetas por unidad) por una
 * entrega plana: 7 archivos directamente en `public/videos/`, cada uno
 * con el nombre del head y la unidad codificados en el filename. Esta es
 * la fuente de verdad ACTUAL — no se conservó ninguna referencia a la
 * estructura de carpetas anterior (ya no existe en el filesystem).
 *
 * Mapeo por archivo (verificado por inspección directa de
 * `public/videos/` en esta re-evaluación):
 *
 * - "CARLOS LANDA_WEWORK.mp4" → WeWow At Work! / Carlos Landa
 *   (esto RESUELVE una discrepancia anterior: la entrega previa tenía un
 *   archivo "CARLOS LARA-.mp4"; este nuevo archivo confirma "LANDA" como
 *   la ortografía correcta — ya no existe el archivo "LARA" en disco).
 * - "MAURICIO URIBE_ CONSULTING!.mp4" → Consulting / Mauricio Uribe
 * - "_MAURICIO URIBE_ CULTURE!.mp4" → Culture & Transformation / Mauricio
 *   Uribe (el filename dice solo "CULTURE", no contradice el nombre
 *   completo ya confirmado antes — se interpreta como abreviación, no
 *   como un nombre de unidad distinto).
 * - "GERARDO CHAVEZ LEARNING!.mp4" → Learning / Gerardo Chavez
 * - "SANDRA MICHELSEN_ OUTPLACEMENT!.mp4" → Outplacement / Sandra Michelsen
 * - "MARIABELEN CARABAÑO_TALENT ATTRACTION!.mp4" → Talent Attraction /
 *   Mariabelen Carabaño (corrección de ortografía respecto a la entrega
 *   anterior, que decía "Maribel Carbaño" — se usa el nombre del archivo
 *   actual como fuente de verdad).
 * - "JORGE ROSAS_ HIRING!.mp4" → **ver nota de ambigüedad abajo**.
 *
 * AMBIGÜEDAD REPORTADA (no adivinada — ver PROJECT_CONTEXT.md):
 * la entrega anterior tenía a Jorge Rosas como head de "Coaching &
 * Mentoring". Este archivo nuevo lo etiqueta como "HIRING", una unidad
 * que NO existía antes con ese nombre. Por eliminación (es el único
 * archivo/persona restante para la única unidad restante sin video), se
 * asume que es la MISMA unidad renombrada — pero el nombre "Hiring" viene
 * ÚNICAMENTE del filename, nunca fue confirmado explícitamente por el
 * cliente como el nuevo nombre oficial de esa unidad. Pendiente de
 * confirmación.
 */
export const businessUnits: BusinessUnit[] = [
  {
    id: "wewow-at-work",
    name: "WeWow At Work!",
    headName: "Carlos Landa",
    headTitle: "Head WeWow At Work!",
    video: "/videos/CARLOS LANDA_WEWORK.mp4",
    enabled: true,
  },
  {
    id: "consulting",
    name: "Consulting",
    headName: "Mauricio Uribe",
    headTitle: "Head Consulting",
    video: "/videos/MAURICIO URIBE_ CONSULTING!.mp4",
    enabled: true,
  },
  {
    id: "culture-transformation",
    name: "Culture & Transformation",
    headName: "Mauricio Uribe",
    headTitle: "Head Culture & Transformation",
    video: "/videos/_MAURICIO URIBE_ CULTURE!.mp4",
    enabled: true,
  },
  {
    id: "hiring",
    name: "Hiring",
    headName: "Jorge Rosas",
    headTitle: "Head Hiring",
    video: "/videos/JORGE ROSAS_ HIRING!.mp4",
    enabled: true,
  },
  {
    id: "learning",
    name: "Learning",
    headName: "Gerardo Chavez",
    headTitle: "Head Learning",
    video: "/videos/GERARDO CHAVEZ LEARNING!.mp4",
    enabled: true,
  },
  {
    id: "outplacement",
    name: "Outplacement",
    headName: "Sandra Michelsen",
    headTitle: "Head Outplacement",
    video: "/videos/SANDRA MICHELSEN_ OUTPLACEMENT!.mp4",
    enabled: true,
  },
  {
    id: "talent-attraction",
    name: "Talent Attraction",
    headName: "Mariabelen Carabaño",
    headTitle: "Head Talent Attraction",
    video: "/videos/MARIABELEN CARABAÑO_TALENT ATTRACTION!.mp4",
    enabled: true,
  },
];
