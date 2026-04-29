# AI Actions Log

This file tracks every task requested during this project. Update it at the end of each session.

---

## Session 18 (2026-04-29)

1. Replaced themed `graph TD` user flow diagram in README with a clean `classDiagram` showing data entities (Item, Combination, Result, AppState), their fields with types, and relationships — no theme-specific styling or alchemy language.

**Deferred suggestions from data structure analysis:**
- **Ambiguity to fix:** `Result` duplicates every field from `Combination` via `{ ...recipe, stats }` spread at brew time — no formal type relationship, just an object copy. If the recipe shape changes, `Result` silently drifts. Consider making this relationship explicit.
- **Small change before populating 10–20 records:** Add a `stats` sub-object to `Combination` in `data.json` (e.g. `{ potency: 0, toxicity: 0 }` as placeholder) so `Item`, `Combination`, and `Result` all share the same `stats` shape, rather than `Combination` being the only entity with no stats field at all.

---

## Session 17 (2026-04-29)

1. Updated Theme Settings warning text — replaced the "refreshing the page" warning with a more directive message: "Remember to Export Theme — it saves colors, labels, and flavor text. Reset to Default wipes all of them."
2. Added Flavor Text tab to Theme Settings — fourth tab alongside Theme, Header, and Labels. Two-column layout: left column covers Brew Outcomes (not enough, failure, success template with `{name}`, failure log entry) and Cauldron Counter (empty, gathering with `{count}`/`{total}`, ready with `{count}`); right column covers Proximity Hints (exact match, partial match, no match) and Idle Text (Ingredient Grimoire, Recipe Book, Output, Potion Grimoire). All 14 fields are text inputs with live preview on keystroke. Template placeholders displayed inline as styled `<code>` tags.
3. Created `src/flavorDefaults.js` — shared DEFAULT_FLAVOR constant with all 14 default strings, imported by both App.jsx (for state initialization) and SettingsModal.jsx (for reset and import merge).
4. Wired flavor text end-to-end — `flavorText` state in App.jsx (initialized from `{ ...DEFAULT_FLAVOR, ...localStorage }`) passed as props to Cauldron, IngredientGrimoire, PotionGrimoire, and Output. `getProximityHint()` and `brew()` in App.jsx now read from `flavorText` for proximity hints and all three brew outcome messages. `getEssenceText()` in Cauldron.jsx uses `{count}`/`{total}` template substitution from `flavorText`.
5. Flavor text included in theme export/import — `exportTheme()` adds `flavorText: flavor` to the JSON; `handleImport()` merges imported `flavorText` over DEFAULT_FLAVOR and calls `onFlavorTextChange`. `save()` resolves empty fields back to defaults before persisting to `localStorage('workshop-flavor-text')`. `reset()` restores DEFAULT_FLAVOR, calls `onFlavorTextChange`, and removes the localStorage key.
6. Updated Theme Settings warning to note background images are not included in export.
7. Updated Customize modal recipe hint text — now reads "max {slotCount} (up to 8 via toggle above). No duplicate ingredients."
8. Halved all ingredient stats so values accumulate meaningfully on the cauldron stat bars (e.g. Voidmoss 8/9 → 4/5, Deathbell 1/9 → 1/5). Changed `computeEssenceStats` and `computeCauldronGlow` in App.jsx from average to sum (capped at 10).
9. Removed `stats` field from all recipes in data.json — recipe stats are now computed at brew time in `brew()` as the sum of input ingredient stats (capped at 10) and attached to the brewed potion object. Ingredient stats are now the single source of truth; recipe stats no longer exist as a separate field.
10. Removed potency/toxicity inputs from Customize modal recipe form — `recPotency`, `recToxicity` state, `buildRecStats()`, and the two number inputs removed from CustomizeModal.jsx. Recipe import/init handlers cleaned up accordingly.
11. Added split gold→purple diagonal gradient border and new `card-glow-balanced` / `potion-hover-pulse-balanced` hover animations for equal-stat (balanced) cards — affects both ingredient cards in Satchel and potion cards in Output.
12. Added tutorial modal (`TutorialModal.jsx`) — six sections covering Satchel, Cauldron, Recipe Discovery, Output & Grimoires, Customize, and Theme Settings, written in the workshop's in-world register. Accessible via a `?` button in the header to the left of Customize. Closes on button click or backdrop click.

---

## Session 16 (2026-04-28)

1. Potion Grimoire now shows recipe inputs — when a brewed potion is selected or hovered, the Potion Grimoire displays a "Made from:" section listing the ingredient names that produced it. `ingredients` prop added to PotionGrimoire; uses `selectedPotion.inputs` (already on the recipe object) to look up names.
2. Satchel sort toggle added — a small cycle button sits next to the Restock button at the bottom of the Satchel panel. Clicking cycles: Sort → A–Z → Potency (high first) → Toxicity (high first) → back to Sort. Button dims when unsorted, brightens when active. Uses `statNames` prop so custom stat renames are reflected in the button label.
3. Panel h2 titles and site h1 bumped to font-weight 600 and h2 size increased from 1.1rem to 1.15rem — Cormorant Garamond is a light display face; semibold gives headers more presence without losing the refined feel.
4. Cauldron slot count made configurable in Customize modal — a 4/8 toggle above the columns lets users expand to 8 slots. `buildCauldron()` now accepts a slots argument; `maxSlots` state in App.jsx persists the setting to localStorage under `workshop-max-slots`. Recipe builder in Customize caps ingredient slots to the chosen count and updates its hint text accordingly.
5. Full codebase audit — fixed three bugs: (a) `.modal-actions` CSS change had inadvertently broken SettingsModal's left/right button grouping; fixed by reverting to `space-between` and adding `#modal .modal-actions { justify-content: center }` to target only the Customize modal. (b) `recSlots` in CustomizeModal was not trimmed when `slotCount` decreased from 8 to 4, allowing a recipe with more inputs than cauldron slots to be submitted; fixed with a `useEffect` that trims on `slotCount` change. (c) `NUMBER_WORDS` in Cauldron.jsx only covered 0–5; extended to cover 0–8 for 8-slot cauldron.
6. Fixed statBloom hardcoded colors in both grimoires — `statBloom()` in IngredientGrimoire and PotionGrimoire previously used hardcoded RGB values `232,180,34` and `199,125,255` that ignored Theme Settings stat color pickers. Both now read `--stat-potency-color` and `--stat-toxicity-color` from the live CSS variables at render time via a `readStatRgb()` helper, matching the pattern already used in Cauldron.jsx.
7. Labels added to Theme Settings export/import — `exportTheme()` now includes the Labels tab content (`labels` object) in the exported JSON. `handleImport()` restores labels via `onLabelsChange` when a theme file contains them. Previously, all panel/button renames were silently lost on theme import.
8. Edit mode added to Customize modal — each ingredient and recipe in the list now has an Edit button. Clicking it populates the form with that item's current values and switches the submit button to "Update". A Cancel button exits edit mode without changes. Editing an ingredient updates it in-place (ID preserved, no recipe cascades). If the item being edited is removed while in edit mode, the form clears automatically.
9. Slot count included in Customize data export/import — `workshop-data.json` now includes `slotCount` (4 or 8). On import, if `slotCount` is present and valid, the cauldron slots toggle is updated to match. Prevents 5–8 ingredient recipes from becoming unbreakable after a data round-trip to a default-slot session.
10. Data system audit — fixed three bugs: (a) `brew()` called `buildCauldron()` with no args after a successful brew, collapsing 8-slot cauldron back to 4 slots; fixed to `buildCauldron(maxSlots)`. (b) Same issue in `clearCauldron()` (Dispel button); same fix. (c) Theme Settings `reset()` cleared stat names but never touched `ui-labels`, so custom panel/button names survived a full reset; fixed by calling `onLabelsChange({})` in reset.
11. Fixed Theme Settings import not clearing background image — when importing a theme file that contains `background: null` (no background), the existing custom background was left in place. Fixed by checking `'background' in data` (not just truthiness) and calling `clearBg()` when the key is present but null.
12. Fixed Customize export leaking discovered recipe state — the exported `workshop-data.json` could contain `discovered: true` flags for potions found in the current session. Recipes in an exported file should always start undiscovered. Fixed by mapping `recs` to `{ ...r, discovered: false }` at export time so the file is always clean regardless of current session state.

---

## Session 15 (2026-04-27)

1. Theme Settings auto-saves on close — closing the modal via backdrop click, Done button, or Escape key now calls save() so settings are always persisted without requiring a manual Save click. Updated warning text to "Refreshing the page will lose unsaved changes" and subtitle to clarify closing saves to browser.
2. Reset to Default now requires confirmation — added window.confirm() before wiping all settings, preventing accidental loss of customization.
3. Browser panel click/hover separated — hover now also pins the Item Detail panel (so it shows the last-hovered item after mouse leaves), and click only adds to the cauldron. Previously clicking both pinned and added, making inspection costly.
4. Escape key closes both modals — added keydown listener to SettingsModal (saves on close) and CustomizeModal (closes without saving).
5. Removing an ingredient in Customize now warns about affected recipes — shows a confirm dialog listing which recipes will be deleted before proceeding.
6. Recipe stats in Customize changed from freeform text to number inputs — replaced the "potency:9, toxicity:2" text field with two labeled number inputs matching the ingredient form, making stat entry consistent and error-proof.
7. Save Changes button in Customize properly disabled when ingredient list is empty — previously the button appeared enabled but did nothing silently; now it is visually and functionally disabled.

---

## Session 14 (2026-04-27)

1. Simplified Features section in README — removed CSS implementation specifics, px values, and easing function details from all bullet points; kept each feature to a clear one-liner.
2. Capped AI Direction & Collaborative Guidance section to 10 entries — dropped entry #12 (Modal Layout) as the least illustrative, renumbered #11 as #10.
3. Rewrote Features section wording to use framework-neutral language — replaced brewing-specific terms (ingredients, recipes, Cauldron, Satchel, Grimoire, brewed) with general terms (items, combinations, Controller, Browser panel, Detail panels, executed) so the features describe the framework rather than the potion theme.
4. Rewrote User Flow Diagram — replaced all brewing-specific node labels and edges with generic framework terms (Main View, Controller, Browser Panel, Item/Output Detail panels, Execute, Reset, Discovery Log, Customize, Theme Settings). Added missing flows: hover-to-preview vs click-to-slot distinction, filled slot removal, Reset path, Theme Settings modal loop.
5. Changed site font to Cormorant Garamond — updated Google Fonts import in index.html to load both Cormorant Garamond and IM Fell English. Set Cormorant Garamond as the default `--font-family`. Added IM Fell English as a selectable option in the Theme Settings font picker (previously it was the default and not a separate option).
6. Made all major site surfaces customizable in Theme Settings — added Panel Background color picker and opacity slider to the Theme tab. Wired `body { background-color }` and `#bg-glow` to their existing CSS variables which were previously hardcoded. Fixed `#cauldron` background which had its own hardcoded rule overriding the opacity slider.
7. Added Header tab to Theme Settings — exposes: Accent Color (glow/title color), font size slider (capped at 2.4rem), Effect selector (Stars / Embers / Scanlines / None), Effect Color picker, Background Color picker, opacity slider, and height slider. Effect selector drives a `data-effect` attribute on the `<header>` element with CSS rules branching per effect type. Stars uses existing twinkle+drift animations; Embers uses `ember-rise` keyframe with particle color and shape; Scanlines hides particles and applies a moving repeating-gradient overlay; None hides the entire effect container. Effect choice persists via `workshop-header-effect` localStorage key.

---

## Session 13 (2026-04-26)

1. Added Cauldron Panel color picker to Theme Settings — exposed `--border-vessel-rgb` (previously defined in CSS but never settable) via a new "Cauldron Panel" picker in the Panel Borders section. Renamed the existing "Cauldron" picker to "Cauldron Accent" for clarity. Added the variable to DEFAULTS, all five theme presets with matching vessel colors (indigo, dragon-purple, blood-red, forest-green, slate), `borderVessel` state, `handleBorderVessel` handler, `pickTheme`, `handleImport`, and `reset`. Fixed `#cauldron h2` title `color` from hardcoded `#a07adf` to `rgb(var(--border-vessel-rgb))` so it updates live.

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
