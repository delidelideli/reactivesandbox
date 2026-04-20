# Alchemist's Workshop — Collaborative Design Document

**Status:** Living Document — updated as design decisions are made  
**Authors:** Connor (Art Director) + Claude (Technical Implementation)  
**Based on:** PreAIDesignDoc (Pre-AI Engagement Specification, Final Desktop Master)

---

## 1. Mood & Visual Identity

**Direction:** "Forgotten Verdure / Arcane Industrial"  
A balance of ancient nature and structured alchemy. The interface must feel like a physical in-world tool — something that exists inside the game world, not a digital menu overlaid on top of it. Think a craftsman's workbench pulled from a forgotten forest workshop.

**Reference point:** Skyrim's alchemy table — tactile, weighted, grounded in a world.

**Rules:**
- Desktop only. No mobile responsiveness. Layout is locked to a wide aspect ratio.
- Reject any result that looks "flat and boring" — every surface should have material weight.
- Background must feel alive, not static.

---

## 2. Color Palette

| Role | Value / Description |
|------|-------------------|
| Background | Deep Magical Forest Green — slow-glow pulse animation |
| Panel surfaces | Weathered birch wood (CSS gradient approximation for v1, real texture later) |
| Grimoire surface | Aged parchment (CSS gradient approximation for v1, real texture later) |
| Accent / Interactive | Muted Gold |
| Toxicity accent | Purple Radiance |
| Standard text | Parchment Beige |
| Potency text | Golden Glow — intensity scales with value |
| Toxicity text | Purple Radiance — intensity scales with value |
| Panel opacity | 1.0 — background must not peek through panels |

**Implementation note (Claude):** Birch and parchment will be CSS `linear-gradient` / `radial-gradient` approximations for v1. Real texture image files to be swapped in a later pass once sourced.

---

## 3. Typography

| Level | Font Style | Used For |
|-------|-----------|----------|
| H1 / Item names | Elegant Handwritten Script (Uncial style) | Item names, potion names |
| H2 / Stat labels | Same font, bold weight | POTENCY, TOXICITY labels |
| Body | Same font, regular | Ingredient lore, brewing instructions |

**Font direction:** Search "uncial" on Google Fonts. Leading candidate: **Uncial Antiqua**. Alternatives: **Cinzel** (more refined/arcane), **IM Fell English** (old printed book). Final font TBD by Connor.

**Stat display format:**
- Potency renders as `Potency X/10` — Golden Glow that grows bolder with higher values
- Toxicity renders as `Toxicity X/10` — Purple Radiance that intensifies with higher values

---

## 4. Layout — The Workshop Stage

**Structure:** Fixed 3-column "Tabletop" layout (not the current 2×2 grid)

| Column | Contents |
|--------|----------|
| Left (50/50 split) | Satchel (top) / Ingredient Grimoire (bottom) |
| Center | Cauldron (full height) |
| Right (50/50 split) | Output Panel (top) / Potion Grimoire (bottom) |

**Implementation note (Claude):** This is a structural change from the current build — the single Grimoire panel splits into two separate React components (IngredientGrimoire and PotionGrimoire). Selecting an ingredient updates the left; selecting a brewed potion updates the right. Both still read from the same shared state in App.jsx — no data duplication.

**Panel rules:**
- Fixed size — panels do not expand or collapse
- Active panel receives a subtle glow to indicate current interaction focus
- All panels use Muted Golden Glow box-shadow

---

## 5. Interactive Behavior

### Satchel Item Hover
- A border glow appears and rotates around the perimeter of the item card
- Internal Muted Gold Glow intensifies on hover

### Brewing — The Magical Click
- Transition: `0.8s cubic-bezier(0.22, 1, 0.36, 1)` — slow, fluid, weighty
- **Success:** Cauldron emits a Golden Flash; Output panel populates with the result
- **Failure:** Cauldron emits Purple Sputtering Smoke; Output shows "Sludge" or remains empty

**Implementation note (Claude):** Success/failure feedback ties directly to the potency/toxicity stat system. Future enhancement discussed: potency drives effect intensity, toxicity drives brew color. CSS-driven for v1 (keyframe animations + class toggling); canvas/particle effects possible in a later pass.

### Background
- Slow rhythmic "mystical glow" pulse animation on the forest green background
- CSS-animated leaf particles drifting across the screen to simulate forest breeze

---

## 6. Data Model (Current)

```json
{
  "selectedIngredient": null,
  "selectedPotion": null,
  "ingredients": [...],
  "recipes": [...],
  "counts": { "id": 3 },
  "cauldron": [null, null],
  "brewed": []
}
```

Stats are currently raw numbers (max ~10). Will display as X/10 in the UI.

---

## 7. Open Decisions

| Decision | Status |
|----------|--------|
| Final font selection | Pending — Connor to pick from Google Fonts |
| Birch / parchment texture images | Deferred — CSS gradients for v1 |
| Leaf particle implementation | Pending |
| Canvas vs CSS for brewing effects | Pending — CSS for v1 |
| Customize / Settings modal visual style | Pending |

---

## Revision History

| Date | Change |
|------|--------|
| 2026-04-20 | Document created from PreAIDesignDoc + technical notes added |
