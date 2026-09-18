export interface BusinessUnit {
  id: string;
  name: string;
  headName: string;
  headTitle: string;
  video: string;
  enabled: boolean;
  /**
   * Icono glass opcional por unidad (PNG/WebP transparente), servido desde
   * `public/icons/units/`. Los assets definitivos se agregarán después —
   * cuando falta, la card renderiza un placeholder glass abstracto (ver
   * S1Menu.tsx → `.glass-unit-icon-placeholder`).
   */
  iconSrc?: string;
}
