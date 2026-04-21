import { MIN_BREW_INGREDIENTS } from '../data'

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five']

function getEssenceText(filled, total, min) {
  if (filled === 0) return 'Awaiting essences'
  const word = NUMBER_WORDS[filled] ?? filled
  if (filled >= min) return `${word.charAt(0).toUpperCase() + word.slice(1)} essences — ready`
  return `${word.charAt(0).toUpperCase() + word.slice(1)} of ${total} essences gathered`
}

export default function Cauldron({ cauldron, ingredients, brewMessage, brewResult, cauldronGlow, essenceStats, proximityHint, brewHistory, statNames, onBrew, onClear, onRemoveFromCauldron }) {
  const filledCount = cauldron.filter(id => id !== null).length
  const brewReady = filledCount >= MIN_BREW_INGREDIENTS

  return (
    <section
      id="cauldron"
      className={brewResult ? `brew-${brewResult}` : ''}
      style={{ boxShadow: brewResult ? undefined : cauldronGlow }}
    >
      <h2>Cauldron</h2>

      <div id="cauldron-bowl" style={{ boxShadow: `inset 0 0 30px rgba(0,0,0,0.9), inset 0 4px 8px rgba(255,255,255,0.04), 0 6px 18px rgba(0,0,0,0.55), ${cauldronGlow}` }}>
        <div id="cauldron-sigil">
          <div className="sigil-ring sigil-ring--outer" />
          <div className="sigil-ring sigil-ring--mid" />
          <div className="sigil-ring sigil-ring--inner" />
          <div className="sigil-center" />
        </div>
      </div>

      <div id="cauldron-slots">
        {cauldron.map((id, i) => {
          const item = id ? ingredients.find(x => x.id === id) : null
          return (
            <div
              key={i}
              className={`slot ${item ? 'slot--filled slot--removable' : ''}`}
              onClick={item ? () => onRemoveFromCauldron(i) : undefined}
              title={item ? `Remove ${item.name}` : undefined}
            >
              {item ? item.name : null}
            </div>
          )
        })}
      </div>

      <p id="cauldron-count">{getEssenceText(filledCount, cauldron.length, MIN_BREW_INGREDIENTS)}</p>

      <div id="cauldron-actions">
        <button
          id="brew-btn"
          className={brewReady ? 'brew-btn--ready' : ''}
          onClick={onBrew}
          disabled={!brewReady}
        >
          Brew
        </button>
        <button id="clear-btn" onClick={onClear} disabled={filledCount === 0}>Dispel</button>
      </div>

      {brewMessage && <p id="brew-message">{brewMessage}</p>}

      {(() => { const stats = essenceStats || { potency: 0, toxicity: 0 }; return (
        <div id="essence-readout">
          <div className="essence-bar">
            <span className="essence-label">{statNames?.potency ?? 'Potency'}</span>
            <div className="essence-track">
              <div className="essence-fill essence-fill--potency" style={{ width: `${stats.potency * 10}%` }} />
            </div>
            <span className="essence-value">{stats.potency.toFixed(1)}</span>
          </div>
          <div className="essence-bar">
            <span className="essence-label">{statNames?.toxicity ?? 'Toxicity'}</span>
            <div className="essence-track">
              <div className="essence-fill essence-fill--toxicity" style={{ width: `${stats.toxicity * 10}%` }} />
            </div>
            <span className="essence-value">{stats.toxicity.toFixed(1)}</span>
          </div>
          {proximityHint && <p className="proximity-hint">{proximityHint}</p>}
        </div>
      ); })()}

      {brewHistory.length > 0 && (
        <div id="brew-history">
          <p id="brew-history-label">Workshop Log</p>
          {brewHistory.map((entry, i) => (
            <div key={i} className={`brew-history-entry brew-history-entry--${entry.outcome}`}>
              <span className="brew-history-icon">{entry.outcome === 'success' ? '✦' : '✕'}</span>
              <span className="brew-history-text">{entry.text}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
