# Alchemist's Workshop — Collaborative Design Document

**Status:** Living Document — updated as design decisions are made  
**Authors:** Connor (Art Director) + Claude (Technical Implementation)  
**Based on:** PreAIDesignDoc (Pre-AI Engagement Specification, Final Desktop Master)

---

## 1. Mood & Visual Identity

**Direction:** "Forgotten Verdure / Arcane Industrial"  
A balance of ancient nature and structured alchemy. The interface must feel like a physical in-world tool — something that exists inside the game world, not a digital menu overlaid on top of it. Think a craftsman's workbench pulled from a forgotten forest workshop. The UI is laid out as if on grass in a forest clearing.

**Reference point:** Skyrim's alchemy table — tactile, weighted, grounded in a world.

**Rules:**
- Desktop only. No mobile responsiveness. Layout is locked to a wide aspect ratio.
- Reject any result that looks "flat and boring" — every surface should have material weight.
- Background must feel alive, not static.

---

## 2. Color Palette

| Role | Value / Description |
|------|-------------------|
| Background | Mid-tone grassy green — like the UI is laid on a forest floor. Slow-glow pulse animation. |
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

| Level | Font | Used For |
|-------|------|----------|
| H1 / Item names | IM Fell English | Item names, potion names |
| H2 / Stat labels | IM Fell English, bold | POTENCY, TOXICITY labels |
| Body | IM Fell English, regular | Ingredient lore, brewing instructions |

**Font decision:** IM Fell English. Chosen for its aged, handmade quality that reads as magical without being overtly fantasy — fits the diegetic "real in-world object" direction. More legible at small sizes than Uncial Antiqua.

**Stat display format:**
- Potency renders as `Potency X/10` — Golden Glow that grows bolder with higher values
- Toxicity renders as `Toxicity X/10` — Purple Radiance that intensifies with higher values

---

## 4. Layout — The Workshop Stage

**Structure:** Fixed 3-column "Tabletop" layout

| Column | Contents |
|--------|----------|
| Left (50/50 split) | Satchel (top) / Ingredient Grimoire (bottom) |
| Center | Cauldron (full height) |
| Right (50/50 split) | Output Panel (top) / Potion Grimoire (bottom) |

**Implementation note (Claude):** This is a structural change from the current build — the single Grimoire panel splits into two separate React components (IngredientGrimoire and PotionGrimoire). Selecting an ingredient updates the left; selecting a brewed potion updates the right. Both still read from the same shared state in App.jsx — no data duplication.

**Panel rules:**
- Fixed size — panels do not expand or collapse
- Active panel receives a subtle glow to indicate current interaction focus
- All panels use a panel-specific glow color (see Interactive Behavior)

---

## 5. Interactive Behavior

### Panel Glow System
- **Satchel & Output panels:** Share the same Muted Gold rotating border glow — these are the two interactive/action panels
- **Ingredient Grimoire & Potion Grimoire panels:** Share the same Arcane Blue glow — these are the two reading/detail panels. Distinct from Muted Gold to signal "read" vs "interact."
- All panels have a Muted Golden Glow box-shadow at rest to simulate magical enchantment

### Item Hover (All interactive panels)
- A border glow appears and rotates around the perimeter of the item card
- Internal glow intensifies on hover
- Grimoire panels use their own distinct glow color

### Cauldron
- Visual representation of a cauldron — CSS/text-based for v1
- Whether to use an illustration or image asset is deferred to a later design pass
- **Glow behavior (reactive):**
  - Base state (empty): Soft white glow
  - As ingredients are added, glow shifts based on the combined stats of slotted ingredients:
    - High potency → shifts toward Muted Gold (matching potency text color)
    - High toxicity → shifts toward Purple Radiance (matching toxicity text color)
    - High both → blends Gold and Purple
  - Glow intensity scales with the stat values, not a binary on/off

### Brewing — The Magical Click
- Transition: `0.8s cubic-bezier(0.22, 1, 0.36, 1)` — slow, fluid, weighty
- **Success:** Cauldron emits a Golden Flash; Output panel populates with the result
- **Failure:** Cauldron emits Purple Sputtering Smoke; failure message displayed — no sludge item produced

**Implementation note (Claude):** Success/failure feedback ties directly to the potency/toxicity stat system. Future enhancement: potency drives effect intensity, toxicity drives brew color. CSS-driven for v1 (keyframe animations + class toggling); canvas/particle effects possible in a later pass.

### Background Animation
- Slow rhythmic "mystical glow" pulse on the forest green background
- CSS-animated abstract leaf-shaped particles drift across the screen simulating a forest breeze — abstract shapes for v1, illustrated leaf assets possible in a later pass

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
| Grimoire glow color | Decided — Arcane Blue. Distinct from the Muted Gold of Satchel/Output; signals "read" vs "interact" |
| Birch / parchment texture images | Deferred — CSS gradients for v1 |
| Leaf particle shape/images | Deferred — abstract CSS shapes for v1 |
| Canvas vs CSS for brewing effects | Decided — CSS for v1, canvas later |
| Cauldron illustration / image asset | Deferred — CSS placeholder for v1 |
| Customize / Settings modal visual style | Pending |

---

## Revision History

| Date | Change |
|------|--------|
| 2026-04-20 | Document created from PreAIDesignDoc + technical notes added |
| 2026-04-20 | Font decided: IM Fell English. Background color decided: mid-tone grassy green. Cauldron visual deferred. Glow system expanded to all panels with Grimoire distinction. Failure state = message only, no sludge item. Leaf particles = abstract CSS shapes for v1. |
