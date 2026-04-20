# AI Actions Log

This file tracks every task requested during this project. Update it at the end of each session.

---

## Session 1 (2026-04-20)

1. Read the design document "Reactive sandbox design intent.md" and confirmed understanding of the project concept.
2. Built a bare-bones proof-of-concept of the Alchemist's Workshop with four panels: Satchel, Grimoire, Cauldron, and Output. Includes a JSON data layer (data.js) with 6 ingredients and 4 recipes, and reactive JS logic connecting all panels.
3. Updated the Grimoire to split into two halves: item detail view on the left, and a static recipe book on the right showing all known potions and their ingredient combinations.
4. Created this AI_Actions.md log file and set up a memory note to continue logging in future sessions.
5. Added a "Customize" button (top-right) that opens a modal allowing users to wipe the current data and define their own ingredients and recipes. Implemented in js/customize.js — users can add named ingredients with custom stats, pair them into recipes, and click Apply to replace all data and reset the interface.
13. Updated README.md using the READMEEXAMPLE.md structure, populated with project-specific content. Left Records of Resistance, Five Question Reflection, and Images section blank for Connor to fill in. Deleted READMEEXAMPLE.md.

12. Updated DesignDoc.md with finalized decisions: IM Fell English font, mid-tone grassy green background, glow system expanded to all panels with a distinct color for Grimoire panels, Cauldron visual deferred, failure state is message only, leaf particles are abstract CSS shapes for v1.

11. Read PreAIDesignDoc.pdf, gave design feedback, created DesignDoc.md as a living collaborative design document combining Connor's spec with implementation notes. Deleted PreAIDesignDoc.pdf. Recommended "uncial" as the Google Fonts search term for the handwritten script font.

10. Migrated the project from vanilla JS to React + Vite. All state lifted to App.jsx and passed down as props. Four panel components (Satchel, Grimoire, Cauldron, Output) and two modal components (CustomizeModal, SettingsModal) created in src/components/. Added GitHub Actions deploy workflow that builds with Vite and publishes to gh-pages branch on every push to main. Removed old js/ and css/ directories.

9. Read the course companion doc (Document.pdf) and identified a spec gap: the Satchel (Browser) was not reacting to Cauldron (Controller) actions, violating the Browser→Detail→Controller reactive requirement. Fixed by adding ingredient counts to shared state — each ingredient starts with 3 uses, decrements when added to the Cauldron, and the Satchel re-renders to reflect remaining counts (including disabling depleted ingredients). Clear refunds counts back to inventory. Deleted Document.pdf after reading per user instruction.

8. Added Import and Export placeholder buttons to the Customize modal actions row — no functionality yet, stubbed for future implementation.

7. Added a "Settings" button (placeholder) next to Customize in the header. Opens a design modal with disabled controls for colors, font, and layout — stubbed out for future implementation.

6. Refined the Customize modal — it now pre-loads the current active data when opened so it feels like an editor rather than a replacer. Renamed "Apply & Wipe" to "Save Changes" and updated the description text to match.
