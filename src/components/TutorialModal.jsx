export default function TutorialModal({ onClose }) {
  return (
    <div id="design-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="tutorial-modal">
        <div className="modal-header">
          <div>
            <h2>How the Workshop Operates</h2>
            <p>A brief guide to the five panels and their connections.</p>
          </div>
        </div>
        <hr />

        <div id="tutorial-body">
          <div className="tutorial-section">
            <h3>Satchel</h3>
            <p>Your ingredient store. <strong>Hover</strong> an ingredient to inspect its properties in the Ingredient Grimoire. <strong>Click</strong> to slot it into the Cauldron. Each ingredient has three uses — the dots track what remains. Restock refills them all.</p>
          </div>

          <div className="tutorial-section">
            <h3>Cauldron</h3>
            <p>Fill two or more slots and click <strong>Brew</strong>. The stat bars show the combined essence of everything slotted — watch them build as you add ingredients. The hint below the bars tells you whether the essences are converging on a known formula. Click a filled slot to return that ingredient to the Satchel.</p>
          </div>

          <div className="tutorial-section">
            <h3>Recipe Discovery</h3>
            <p>Combinations are hidden until successfully brewed. The <strong>Recipe Book</strong> inside the Ingredient Grimoire fills as you discover them — it is a living record, not a pre-filled reference. Experiment freely; failed brews cost nothing but ingredients.</p>
          </div>

          <div className="tutorial-section">
            <h3>Output &amp; Grimoires</h3>
            <p>Brewed potions appear in the <strong>Output</strong> panel. Hover a potion to preview it in the Potion Grimoire; click to pin the selection. The same hover-to-inspect, click-to-pin logic applies in the Satchel and the Ingredient Grimoire.</p>
          </div>

          <div className="tutorial-section">
            <h3>Customize</h3>
            <p>Define your own ingredients, recipes, and outputs — no code required. The workshop adapts to any domain. Export your data as a JSON file to keep it between sessions.</p>
          </div>

          <div className="tutorial-section">
            <h3>Theme Settings</h3>
            <p>Change colors, fonts, panel labels, animated header effects, and every piece of flavor text on the site. Export your theme to carry it across sessions or share it.</p>
          </div>
        </div>

        <hr />
        <div className="modal-actions">
          <div className="modal-actions-right">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
