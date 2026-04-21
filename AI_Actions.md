# AI Actions Log

This file tracks every task requested during this project. Update it at the end of each session.

---

## Session 3 (2026-04-21)

1. Read tester.txt (Gemini-generated visual improvement directive) and evaluated each suggestion against the existing codebase — identified what was already done, what conflicted with the current palette, and what was genuinely worth adding.
2. Implemented chromatic aberration on brew failure: `brew-chromatic` keyframe alternates red/cyan `drop-shadow` offsets on the cauldron panel during `brew-failure`, decaying over 0.65s alongside the existing purple smoke animation.
3. Implemented stats bloom: `statBloom()` helper in IngredientGrimoire and PotionGrimoire computes a two-layer `filter: drop-shadow` scaled to the raw stat value (0–10). Higher stat = wider, more opaque bloom bleeding onto surrounding content.
4. Fixed recipe book idle text centering: `.grimoire-idle--small` changed from `justify-content: flex-start` to `center`.
5. Improved ingredient card dot visibility: darkened filled dot colors to `#b85c00` (potent), `#5c1a8a` (toxic), `#6b5200` (balanced) to contrast against the beige card background. Empty dot border brightened.
6. Added live essence readout to cauldron: two animated stat bars (Potency gold / Toxicity purple) appear when any ingredient is slotted, sized proportionally to the averaged stat values and transitioning with the standard `cubic-bezier(0.22, 1, 0.36, 1)`.
7. Added proximity hint flavor text below the essence readout: "A formula takes hold." / "Something stirs in the confluence..." / "The essences resist each other's presence." — driven by recipe subset matching, no spoilers on undiscovered recipes.
8. Made cauldron slots individually removable: clicking a filled slot returns that ingredient to the Satchel. Hover state shifts slot border to red to signal the destructive action.
9. Changed Ingredient Grimoire to update on hover rather than click — hover previews the ingredient detail; click still adds to Cauldron. Separates the two actions completely.
10. Added hover-preview + click-to-pin behavior for Potion Grimoire: hovering an Output card previews the potion detail; mousing off the grid reverts to the pinned selection; clicking locks it. Implemented via `hoveredPotion ?? selectedPotion` in App.jsx.
11. Extended hover-preview + click-to-pin to the Ingredient Grimoire: hovering a Satchel card previews the ingredient; mousing off the grid clears it back to idle; clicking pins it (and also adds to cauldron). Implemented via `hoveredIngredient ?? selectedIngredient` in App.jsx.
12. Set documentation-after-every-prompt rule: AI_Actions.md and README are now updated after each task, not just at session end.

---

## Session 2 (2026-04-21)

1. Full visual design overhaul: complete rewrite of index.css with arcane midnight-blue palette, dark walnut panel backgrounds, IM Fell English typography, and a 3-column CSS Grid tabletop layout (`satchel / cauldron / output` over `ingredient-grimoire / cauldron / potion-grimoire`).
2. Added atmospheric background system: large blurred CSS orbs (`#arcane-bg-orbs`, 12 spans with `filter: blur`) behind panels, sharp sparkle points (`#arcane-sparkles`, 8 spans with `sparkle-pulse`), and a breathing radial `#bg-glow` using CSS custom properties.
3. Implemented reactive cauldron glow: `computeCauldronGlow()` in App.jsx averages potency/toxicity of slotted ingredients and returns a layered `box-shadow` string (white base + gold/purple additive glows).
4. Added cauldron sigil: three concentric rings with `sigil-cw`/`sigil-ccw` CSS animations at different speeds (28s/18s/10s) inside `#cauldron-bowl`.
5. Implemented corner flourishes on all panels via `section::before` with 8 gradient segments (gold for wood panels, blue for grimoires).
6. Added ingredient/potion card system: `.ingredient-btn` uses directional `card-glow-gold`/`card-glow-purple` rotate animations; `.potion-card` uses omnidirectional `potion-hover-pulse`. Each card shows name + dot indicators.
7. Changed cauldron slot display to 64px circles with `◈` CSS `::before` placeholder when empty, 2×2 grid layout.
8. Rewrote `h2` title plates as symmetric flex lines (`::before`/`::after` gradient fade on each side).
9. Styled brew button as a wax-seal style element with `✦` flanking marks, double border via `outline + outline-offset`, press-down `:active` state, and `brew-ready-pulse` animation when ready.
10. Implemented functional Settings modal: 4 theme presets (Arcane, Crimson, Verdant, Void), live color pickers, font selector, spacing slider. All settings write to CSS custom properties via `setProperty` and persist to `localStorage`.
11. Added `brewResult` state with `triggerBrewResult()` + 1000ms timeout for CSS class-based animation on cauldron: `brew-success` → `brew-golden-flash`, `brew-failure` → `brew-purple-smoke`.
12. Added grimoire idle states: `.grimoire-idle` with breathing glyph animation across all four grimoire/output panels.
13. Added `getEssenceText()` flavor function to Cauldron.jsx with word-number system; renamed "Clear" to "Dispel".
14. Rewrote all three brew messages to world-language flavor text: "More essences are required." / "The essences resist each other — no formula takes hold." / "[Name] has been drawn forth!"
15. Fixed Output and PotionGrimoire idle text centering: moved Output's idle state outside `#output-grid` so it's a direct section child; added `min-height: 0` to sections to allow flex children to fill allocated grid space.

---

## Session 1 (2026-04-20)

1. Read the design document "Reactive sandbox design intent.md" and confirmed understanding of the project concept.
2. Built a bare-bones proof-of-concept of the Alchemist's Workshop with four panels: Satchel, Grimoire, Cauldron, and Output. Includes a JSON data layer (data.js) with 6 ingredients and 4 recipes, and reactive JS logic connecting all panels.
3. Updated the Grimoire to split into two halves: item detail view on the left, and a static recipe book on the right showing all known potions and their ingredient combinations.
4. Created this AI_Actions.md log file and set up a memory note to continue logging in future sessions.
5. Added a "Customize" button (top-right) that opens a modal allowing users to wipe the current data and define their own ingredients and recipes. Implemented in js/customize.js — users can add named ingredients with custom stats, pair them into recipes, and click Apply to replace all data and reset the interface.
15. Updated CustomizeModal to match new data parameters: recipe slots are now dynamic (2–4, matching MAX_CAULDRON_SLOTS/MIN_BREW_INGREDIENTS), stat values are clamped to 10 on input, duplicate ingredient validation added.

14. Data layer overhaul before visual pass: capped all potion stats at 10, added `discovered: false` to all recipes, added 3-ingredient demo recipe (Venom of the Void), exported MAX_CAULDRON_SLOTS/MIN_BREW_INGREDIENTS constants, rebuilt brew logic for order-independent N-ingredient matching, split selectedItem into selectedIngredient + selectedPotion, split Grimoire into IngredientGrimoire and PotionGrimoire components, Cauldron now shows 4 slots with min-2 enforcement, Recipe Book shows only discovered recipes.

13. Updated README.md using the READMEEXAMPLE.md structure, populated with project-specific content. Left Records of Resistance, Five Question Reflection, and Images section blank for Connor to fill in. Deleted READMEEXAMPLE.md.

12. Updated DesignDoc.md with finalized decisions: IM Fell English font, mid-tone grassy green background, glow system expanded to all panels with a distinct color for Grimoire panels, Cauldron visual deferred, failure state is message only, leaf particles are abstract CSS shapes for v1.

11. Read PreAIDesignDoc.pdf, gave design feedback, created DesignDoc.md as a living collaborative design document combining Connor's spec with implementation notes. Deleted PreAIDesignDoc.pdf. Recommended "uncial" as the Google Fonts search term for the handwritten script font.

10. Migrated the project from vanilla JS to React + Vite. All state lifted to App.jsx and passed down as props. Four panel components (Satchel, Grimoire, Cauldron, Output) and two modal components (CustomizeModal, SettingsModal) created in src/components/. Added GitHub Actions deploy workflow that builds with Vite and publishes to gh-pages branch on every push to main. Removed old js/ and css/ directories.

9. Read the course companion doc (Document.pdf) and identified a spec gap: the Satchel (Browser) was not reacting to Cauldron (Controller) actions, violating the Browser→Detail→Controller reactive requirement. Fixed by adding ingredient counts to shared state — each ingredient starts with 3 uses, decrements when added to the Cauldron, and the Satchel re-renders to reflect remaining counts (including disabling depleted ingredients). Clear refunds counts back to inventory. Deleted Document.pdf after reading per user instruction.

8. Added Import and Export placeholder buttons to the Customize modal actions row — no functionality yet, stubbed for future implementation.

7. Added a "Settings" button (placeholder) next to Customize in the header. Opens a design modal with disabled controls for colors, font, and layout — stubbed out for future implementation.

6. Refined the Customize modal — it now pre-loads the current active data when opened so it feels like an editor rather than a replacer. Renamed "Apply & Wipe" to "Save Changes" and updated the description text to match.
