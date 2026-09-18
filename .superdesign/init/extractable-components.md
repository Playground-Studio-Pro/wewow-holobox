# Extractable components

**None.** The codebase currently contains only the temporary diagnostic screen (`src/App.tsx`), which has no layout components (no NavBar/Sidebar/Header/Footer/App Shell) and no reusable basic components worth extracting (its one local sub-component, `StatusRow`, is throwaway diagnostic scaffolding, not a design-system primitive).

Component extraction (Step 2.5 of the Superdesign workflow) should be **skipped** for this design checkpoint. Once a direction is chosen from this checkpoint and implemented in TASK 003+ (S0 Logo, S1 Menu), this file should be regenerated to catalog the real reusable primitives that emerge (e.g. a business-unit touch-target component, a glass panel primitive, a back-to-menu button).
