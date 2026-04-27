# AI Actions Log

This file tracks every task requested during this project. Update it at the end of each session.

---

## Session 12 (2026-04-26)

3. Brew button and cauldron slots now react to color settings — brew button border, outline, and brew-ready-pulse glow use `--border-cauldron-rgb` (follows theme preset, no more hardcoded gold). Dispel button border follows the same var. Filled ingredient slots now get a `slot--potent` or `slot--toxic` class based on the ingredient's dominant stat; the border and inset glow shift to `--stat-potency-color` or `--stat-toxicity-color` so each slot visually identifies the ingredient inside it.

1. Fixed stat color pickers not affecting visual elements throughout the UI, and extended color reactivity into the cauldron section: `computeSigilStyle()` now reads `--stat-potency-color` and `--stat-toxicity-color` from live CSS vars and interpolates the magical circle color between the user's chosen colors (instead of hardcoded gold/purple RGB values). `computeCauldronGlow()` does the same for the bowl's outer glow. Cauldron ingredient slots now use `--border-cauldron-rgb` instead of hardcoded gold so they follow the cauldron panel color per theme.
2. Fixed stat color pickers not affecting visual elements — `--stat-potency-color` and `--stat-toxicity-color` were only wired to grimoire text via `.stat-potency` / `.stat-toxicity`. All other potency/toxicity indicators used hardcoded `rgba()` values. Updated: essence bar fills and glows in the cauldron readout, card border colors and box-shadow glows, ingredient/potion dot fills and glows, `card-glow-gold`/`card-glow-purple`/`potion-hover-pulse`/`potion-hover-pulse-purple` keyframe animations, and Customize modal stat badge backgrounds/borders (using `color-mix()` to preserve the tinted-background look reactively).

---

## Session 11 (2026-04-26)

1. Removed `#cauldron-liquid` overlay entirely (redundant with sigil color change). Replaced `computeSigilColor` with `computeSigilStyle` which now returns both `color` (gold/purple based on potency vs toxicity balance) and `filter: brightness(X)` — brightness scales from 1.0 (balanced) to 1.9 (10-point stat difference) via `1 + (Math.abs(diff) / 10) * 0.9`. Both properties transition at `0.55s ease` via `#cauldron-sigil`. Cleaned up `computeLiquidColor` function, `liquidColor` state, and `liquidColor` prop from App.jsx and Cauldron.jsx.
2. Fixed `save()` in SettingsModal.jsx — was manually building a 9-var object from React state, missing all derived CSS vars (`--accent-gold-light`, `--grimoire-glow`, `--bg-glow-color`, etc.). Now reads all DEFAULTS keys from the live DOM via `readVar()`, then overlays the active theme if one is set. Same pattern as `exportTheme()`.
3. Fixed `handleImport()` in SettingsModal.jsx — imported theme files that included a Skyrim (or any body-class) theme would apply CSS vars correctly but never apply or clear the body class. Added a `data.bodyClass` check that removes all known body classes then applies the imported one if present.

---

## Session 10 (2026-04-26)

1. Added Restock button to Satchel panel — resets all ingredient counts to 3. Disabled when all counts are full; subtle styling (0.45 opacity at rest, opaque on hover) so it doesn't compete with the ingredient grid. Wired via `onRestock` prop from App.jsx `restockCounts()`.
2. Added recipe discovery counter to Recipe Book header — shows `X / Y` (e.g. `3 / 12`) inline with the heading. Styled smaller and dimmed so it reads as metadata, not a title.
3. Fixed Workshop Log opacity fade — previous CSS used `:not(:first-child)` which matched ALL entries (since the label `<p>` is actually the first child, not an entry), making the newest entry render at 0.65 instead of 1.0. Replaced with explicit `nth-child(3/4/5)` rules giving a proper 1.0 → 0.72 → 0.48 → 0.28 staircase.
4. Deduplicated Output panel — repeated brews of the same potion now show a single card with a `×N` count badge (absolute-positioned top-right). Deduplication happens at render time in Output.jsx; App.jsx state is unchanged.
5. Fixed cauldron slot text overflow — added `word-break: break-word; overflow: hidden` to `.slot--filled` so long ingredient names (Ashwood Bark, Crimson Spore) wrap cleanly inside the 64px circle.
6. Added `???` hints for undiscovered recipes in the Ingredient Grimoire "Used in" section — shows recipe names for discovered combos and a `???` placeholder for each undiscovered combo that uses the selected ingredient. Encourages experimentation without spoiling.

---

## Session 9 (2026-04-26)

1. Changed grimoire body text color to `var(--accent-blue-light)` in both `#grimoire-content` and `#potion-grimoire-content` — description text, "Used in:" labels, and potion names now match the blue used in the Recipe Book rather than inheriting the default warm beige. Stat values remain gold/purple via their own class overrides.
2. Fixed idle text color on ingredient and potion grimoire panels: "Select an ingredient..." and "Brew a potion..." now use `rgba(136,173,192,0.45)` (blue) matching the Recipe Book idle text, instead of the default gold.
6. Added 3 toxic ingredients to data.json (i13 Wraithcap pot:2/tox:8, i14 Bileroot pot:3/tox:7, i15 Deathbell pot:1/tox:9) — balances ingredient roster from 7 potent / 5 toxic to 7 potent / 8 toxic (15 total). Added 3 new recipes: Murk of the Wraith (i13+i10, 2-ingredient), Bitter Venom (i14+i1, 2-ingredient), Plague Tincture (i15+i14+i12, 3-ingredient). Validated all IDs cross-reference correctly with no duplicate combos.
3. Wired up `liquidColor` prop in Cauldron.jsx — was computed in App.jsx and passed as a prop but never consumed. Added `#cauldron-liquid` div inside the cauldron bowl that fills with the reactive color (blends gold/purple based on slotted ingredient stats). Added CSS with `inset: 10px`, `border-radius: 50%`, `transition: background 0.55s ease`, `z-index: 0`; bumped sigil to `z-index: 1`.
4. Fixed Skyrim theme body class not persisting across page refreshes — `SettingsModal.save()` now writes the active body class to `localStorage('workshop-body-class')`, and `App.jsx useEffect` restores it on load. Also clears it on Reset to Default.
5. Fixed potion output card dots — replaced hardcoded 2-dot display (always potent+toxic) with dynamic dots: potent dot fills only if `potency > 0`, toxic dot fills only if `toxicity > 0`. Accurately reflects each potion's stat profile on the card.

---

## Session 8 (2026-04-22)

1. Confirmed previous session had stopped after updating AI_Actions.md without committing — pushed all pending changes to GitHub.
2. Migrated ingredient and recipe data out of `src/data.js` into a dedicated `src/data.json` file. `data.js` now imports from the JSON and re-exports everything so no other files needed to change. Project now has a true JSON data layer.
3. Implemented Export in Customize modal: serializes current ingredients and recipes to a `workshop-data.json` file and triggers a browser download.
4. Implemented Import in Customize modal: opens a file picker, reads the selected `.json`, validates structure, and loads the data into the modal's ingredient and recipe lists.
5. Added a persistent export warning to the top-right of the Customize modal header — gold-tinted notice reminding users that changes are session-only and to Export if they want to save their data.
6. Renamed the "Settings" header button to "Theme Settings" for clarity. Updated the modal h2 title to match.
7. Added the same export warning to the Theme Settings modal header — reminds users to Export Theme if they want changes saved permanently.
8. Fixed warning box layout in both modals: switched to `align-items: center`, `text-align: left`, and `white-space: nowrap` so the warning renders as a clean single block without awkward wrapping.
9. Added twinkling star field to the site header — 12 small white dots (1–2px) scattered across the header at fixed positions, each with an independent `star-twinkle` keyframe animation (varying durations 2.7s–5.2s, staggered delays) that pulses opacity to simulate a night sky.
10. Added slow drift movement to header stars — each star has a `star-drift` keyframe using per-star CSS custom properties (`--dx`, `--dy`) so every star floats in a unique direction (3–5px) over 8–15s with `alternate` easing, running alongside the twinkle independently.
11. Added Labels tab to Theme Settings modal — tabbed layout (Theme / Labels) replaces single-column header. Labels tab exposes 8 rename fields: Site Title, Satchel, Cauldron, Output, Ingredient Grimoire, Potion Grimoire, Brew, and Dispel. Changes apply live and persist to localStorage. All components updated to read from `labels` prop with fallback to defaults.
12. Persisted custom ingredient and recipe data across page refreshes — `ingredients` and `recipes` state now initialise from `localStorage` if saved data exists, falling back to `data.json` defaults. Custom data is saved on every Customize modal save, and discovered recipe flags are saved immediately on successful brew.
13. Recipe discovery state intentionally resets on refresh — recipes load from localStorage with all `discovered` flags forced to `false`, so the Recipe Book starts empty each session. Custom recipe definitions still persist; only the discovery progress resets.
14. Fixed ingredient name color in the Ingredient Grimoire — toxic ingredients now display their name in purple (`stat-toxicity`) instead of gold. Potent and balanced ingredients remain gold. Color is derived from the same `getDominant()` logic used by the Satchel cards.
15. Fixed cauldron glow persisting after brewing — `cauldron-bowl` was concatenating `'none'` into a comma-separated `box-shadow` list (invalid CSS), preventing the glow from clearing. Now conditionally omits the glow when the cauldron is empty.
16. Reduced brew success and failure glow intensity — `brew-golden-flash` peak opacity reduced from 0.85 to 0.40 and spread from 60px/100px to 35px/55px; `brew-purple-smoke` peak from 0.75 to 0.35 and spread from 50px/80px to 30px/50px.
17. Updated Skyrim theme: panels changed from fully opaque solid gradients to semi-transparent `rgba` backgrounds (`rgba(12,10,7,0.82)` for action panels, `rgba(8,11,14,0.84)` for grimoires) so the wallpaper bleeds through. Palette updated to true Skyrim amber (`#c8960a`), cold steel blue (`#5a7a90`), and dragon purple (`#7a3878`).
18. Fixed Skyrim theme transparency — the `body.theme-skyrim` override was replacing `background-image` with a solid gradient, hiding the wallpaper entirely. Removed the override so the base wallpaper shows through the semi-transparent panels as intended.
19. Made Skyrim theme visually distinct from the default — action panels changed to warm dark amber tint (`rgba(22,16,8,0.86)`) with iron-brown borders; grimoire panels changed to cold blue-steel tint (`rgba(8,13,18,0.87)`); CSS vars pushed further: brighter amber (`#d4950a`/`#f0b020`), cold steel blue (`#4a6878`), stronger dragon purple (`#703068`), lighter text (`#e0d8c8`).
20. Fixed Satchel and Output hover glow color — was hardcoded blue (`rgba(106,143,168,...)`) matching the grimoire panels, contradicting the gold/blue action-vs-reading distinction. Changed to `rgba(var(--border-cauldron-rgb),...)` so the hover glow matches the gold title and border of those panels, and automatically adapts per theme.
21. Fixed Satchel and Output border and corner accents color — `border-color`, inset shadow, and `::before` corner ornaments all used `--border-panels-rgb` (blue). Updated all three to use `--border-cauldron-rgb` (gold) so the full panel framing is consistent with the gold color language used for action panels.
22. Gave the Cauldron panel a distinct deep indigo-violet identity — added `--border-vessel-rgb: 105,50,185` CSS variable and overrode `#cauldron` border, inset shadow, corner accents (`::before`), and `h2` title color/glow to use it. Color is intentionally darker and more blue-leaning than toxicity's bright lavender (`199,125,255`) so the two purples read as clearly different.
23. Recolored the cauldron sigil SVG to match the vessel purple — all gold `rgba(196,154,42,...)` values in the Flamel symbol (outer rings, tick marks, inner orbit ring, cross, serpent, snake head, eye sockets, nose, teeth) replaced with `rgba(105,50,185,...)` so the symbol matches the panel's new indigo-violet identity.
24. Replaced the Flamel SVG paths in the cauldron bowl with a single centered ⚗ alchemical glyph — cleaner and more legible than the hand-drawn paths. Kept the outer rotating rings and inner orbit ring. Added an SVG `feGaussianBlur` filter for a soft purple glow around the glyph.
25. Replaced the ⚗ glyph with a more pronounced inner magic circle as the cauldron focal point — double concentric rings, 8 tick marks, and a center dot with a small halo ring, all glowing via SVG blur filter. The inner group still rotates faster than the outer rings.
26. Made the outer ring more pronounced to match — increased stroke width from 1/0.5 to 1.5/0.75, raised opacity on the ring and tick marks, and applied the same SVG glow filter as the inner circle.

---

## Session 7 (2026-04-22)

1. Centered the header title and increased font size from 1.4rem to 1.7rem. Title uses `position: absolute; left: 50%; transform: translateX(-50%)` for true centering regardless of button width. Added `#header-spacer` flex div to balance the layout.
2. Redesigned ingredient and potion card colors: background changed from light parchment (`#d8c890`→`#b89c60` gradient) to dark warm brown (`#2a2018`→`#1e1510`), text color inverted from near-black to parchment `#e8d5a3`, dot colors brightened to remain visible against the darker surface.
3. Fixed top-row card clipping on hover: added `padding-top: 4px` to `#satchel-grid` and `#output-grid` so the `translateY(-2px)` hover lift isn't cut off by the grid's `overflow-y: auto` boundary.
4. Refactored potion card hover animation rules to match the ingredient card pattern — removed `animation` from the base `.potion-card:hover` rule and added explicit per-type rules for potent, balanced, and toxic cards.
5. Fixed toxic (purple-bordered) cards turning gold on hover — root cause: global `button:hover:not(:disabled)` rule sets `border-color: var(--accent-gold)` with element-level specificity that beats class-only card rules. Fixed by excluding `.ingredient-btn` and `.potion-card` from that rule via `:not()`.
6. Changed corner flourishes on all panels from L-shaped linear-gradient brackets to quarter-circle radial-gradient arcs. Updated all five corner rule sets (base section, grimoire, satchel/output, Skyrim section, Skyrim grimoire).
7. Colored Ingredient Grimoire and Potion Grimoire panel titles steel-blue (`--accent-blue-light`) to distinguish reading panels from action panels (Satchel/Output which stay gold). Updated h2 `::before`/`::after` decorative lines to match.
8. Changed recipe book text, dividers, h3 title, and idle text to steel-blue. Changed grimoire idle glyphs (⚗, ✦) inside both grimoire panels to `--accent-blue`. Fixed `section h3` specificity overriding the inherited blue on the Recipe Book title.
9. Redesigned the cauldron sigil from simple rotating rings to an inline SVG Flamel: outer ring with 24 tick marks (rotates CW 28s), inner orbit ring (rotates CW 10s), and a static Flamel symbol — wings, 3-point crown, cross, serpent wound around the cross, snake head with tongue, and a skull with eye sockets, nose, and teeth.
10. Widened the Customize modal from 860px to 1100px so ingredient and recipe descriptions are no longer truncated. Removed CSS ellipsis/nowrap constraints on list item text so long names wrap naturally.
11. Split ingredient stat display in the Customize modal list from one combined box into two colored badge spans — gold for potency, purple for toxicity — using `statNames` for user-defined labels.
12. Split the ingredient stat input in the Customize modal form from a single free-text field into two side-by-side number inputs (0–10, step 0.1) labeled with the user's stat names. `addIngredient()` now builds the stats object directly from the numeric values rather than parsing a formatted string.

---

## Session 6 (2026-04-21)

1. Added missing CSS for new SettingsModal UI elements from the previous session's JSX rewrite: `.settings-stat-row`, `.settings-stat-name`, `.settings-bg-row`, `.settings-bg-label`, `.settings-upload-btn` — the modal was rendering unstyled without these rules.
2. Redesigned the Customize modal layout: side-by-side columns (Ingredients left, Recipes right) separated by a gold divider, with Save/Export/Import/Cancel pinned at the bottom. Modal widened to 860px. Eliminated the need to scroll to reach the recipe section.
3. Fixed scrollbar collision in Customize modal: added `padding-right: 10px` to `.customize-list` so Remove buttons don't sit flush against the scrollbar track.
4. Renamed the "Arcane (Original)" theme to "Magical & Mystical" and set its vars to match the current site default look (the active palette). This makes it the first and default theme in the preset list.
5. Redesigned the Settings modal layout: widened to 860px with a three-column layout (Theme Presets / Colors / Appearance & File) separated by gold dividers. Eliminated all scrolling from the settings panel.

---

## Session 5 (2026-04-21)

1. Added Skyrim theme preset to Settings modal — initially CSS variables only, which revealed that most visual appearance (panel backgrounds, orbs, borders) is hardcoded and not variable-driven. Preset looked nearly identical to Arcane.
2. Implemented body class system (`theme-skyrim` on `<body>`) to enable full structural theme overrides in CSS, not just color variable swaps.
3. Full visual overhaul of `index.css` to SkyUI/Skyrim aesthetic: Skyrim wallpaper as background, flat opaque dark panels (`#0e0c0a`) replacing wood gradients, arcane orbs and sparkles hidden, dark overlay replacing breathing bg-glow, all panel borders and corner flourishes updated to new palette.
4. Satchel and Output panels recoloured to match Grimoire steel-blue accent (separated from cauldron amber).
5. Cauldron glow removed — CSS fix alone did not work because `computeCauldronGlow()` in App.jsx applies an inline `boxShadow` style that overrides CSS. Fixed by returning `'none'` for empty cauldron state.
6. Made all panels semi-transparent (`rgba(14,12,10,0.82)`) so wallpaper bleeds through slightly.
7. Increased description text size in grimoire panels via direct `#grimoire-content > p` selector.
8. Fixed ingredient/potion card sizing: added `height: 66px` and `justify-content: space-between` so all cards are the same size and dots are always pinned to the bottom.
9. Added Workshop Log (brew history) to the Cauldron panel: last 4 brews, newest at top with fading opacity on older entries, gold for success / purple for failure. Session-only state in App.jsx, oldest entry drops off automatically.
10. Made essence readout (Potency/Toxicity bars) always visible — previously hidden when cauldron was empty. Now shows at 0 and fills as ingredients are slotted.
11. Increased Workshop Log font sizes and visibility (label `0.75rem`, entries `0.9rem`, raised opacity on failure text and older entries).

---

## Session 4 (2026-04-21)

1. Added 6 new ingredients: Moonbloom, Ashwood Bark, Stormcap, Crimson Spore, Dewglass, Thornvine (ids i7–i12) — each with distinct stats and flavour descriptions.
2. Added 4 new recipes: Moonwater Tonic (2-cost), Thunderclap Draft (2-cost), Blight of the Briar (3-cost), Grand Tempest (4-cost).
3. Rebalanced toxic dot coverage: adjusted Nightshade (potency 8→5, toxicity 5→8), Voidmoss (potency 9→8, toxicity 8→9), and Ashwood Bark (potency 4→3, toxicity 3→4) so that 5 of 12 ingredients render with purple dots instead of 2.

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
13. Attempted SVG `border-image` ornate frame system (double-line brackets, diamond medallions, tick marks) — rejected by designer, reverted to original gradient corner flourishes. Opened discussion on what a better UI direction looks like.

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
