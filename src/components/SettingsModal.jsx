export default function SettingsModal({ onClose }) {
  return (
    <div id="design-overlay">
      <div id="design-modal">
        <h2>Customize Look & Feel</h2>
        <p>Change the visual style of your interface. This section is coming soon.</p>

        <hr />

        <div className="design-section">
          <h3>Colors</h3>
          <div className="form-row">
            <label>Background <input type="color" disabled defaultValue="#ffffff" /></label>
            <label>Accent <input type="color" disabled defaultValue="#888888" /></label>
            <label>Text <input type="color" disabled defaultValue="#222222" /></label>
          </div>
        </div>

        <div className="design-section">
          <h3>Font</h3>
          <div className="form-row">
            <select disabled>
              <option>System Default</option>
              <option>Serif</option>
              <option>Monospace</option>
            </select>
          </div>
        </div>

        <div className="design-section">
          <h3>Layout</h3>
          <div className="form-row">
            <select disabled>
              <option>2x2 Grid</option>
              <option>Side by Side</option>
              <option>Stacked</option>
            </select>
          </div>
        </div>

        <hr />

        <div className="modal-actions">
          <button disabled>Apply (Coming Soon)</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
