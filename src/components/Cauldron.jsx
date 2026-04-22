import { MIN_BREW_INGREDIENTS } from '../data'

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five']

function getEssenceText(filled, total, min) {
  if (filled === 0) return 'Awaiting essences'
  const word = NUMBER_WORDS[filled] ?? filled
  if (filled >= min) return `${word.charAt(0).toUpperCase() + word.slice(1)} essences — ready`
  return `${word.charAt(0).toUpperCase() + word.slice(1)} of ${total} essences gathered`
}

export default function Cauldron({ cauldron, ingredients, brewMessage, brewResult, cauldronGlow, essenceStats, proximityHint, brewHistory, statNames, labels, onBrew, onClear, onRemoveFromCauldron }) {
  const filledCount = cauldron.filter(id => id !== null).length
  const brewReady = filledCount >= MIN_BREW_INGREDIENTS

  return (
    <section
      id="cauldron"
      className={brewResult ? `brew-${brewResult}` : ''}
      style={{ boxShadow: brewResult ? undefined : cauldronGlow }}
    >
      <h2>{labels?.cauldron || 'Cauldron'}</h2>

      <div id="cauldron-bowl" style={{ boxShadow: `inset 0 0 30px rgba(0,0,0,0.9), inset 0 4px 8px rgba(255,255,255,0.04), 0 6px 18px rgba(0,0,0,0.55), ${cauldronGlow}` }}>
        <svg id="cauldron-sigil" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

          {/* Outer rings + tick marks — slow CW */}
          <g className="sigil-group sigil-group--outer">
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(196,154,42,0.45)" strokeWidth="1"/>
            <circle cx="100" cy="100" r="83" fill="none" stroke="rgba(196,154,42,0.2)" strokeWidth="0.5"/>
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i * 15 * Math.PI) / 180
              return (
                <line key={i}
                  x1={100 + 87 * Math.cos(a)} y1={100 + 87 * Math.sin(a)}
                  x2={100 + 93 * Math.cos(a)} y2={100 + 93 * Math.sin(a)}
                  stroke="rgba(196,154,42,0.3)" strokeWidth="0.75"
                />
              )
            })}
          </g>

          {/* Inner orbit ring — faster CW */}
          <g className="sigil-group sigil-group--inner">
            <circle cx="100" cy="100" r="38" fill="none" stroke="rgba(106,64,128,0.35)" strokeWidth="1"/>
          </g>

          {/* The Flamel — static */}
          <g opacity="0.7" stroke="rgba(196,154,42,1)" fill="none">

            {/* Wings */}
            <path d="M 68,85 C 50,70 30,57 14,46"   strokeWidth="1.5"/>
            <path d="M 68,89 C 46,80 24,72 8,67"     strokeWidth="1.1"/>
            <path d="M 68,93 C 52,88 36,85 22,83"    strokeWidth="0.9"/>
            <path d="M 132,85 C 150,70 170,57 186,46" strokeWidth="1.5"/>
            <path d="M 132,89 C 154,80 176,72 192,67" strokeWidth="1.1"/>
            <path d="M 132,93 C 148,88 164,85 178,83" strokeWidth="0.9"/>

            {/* Crown — 3 points */}
            <path d="M 84,50 L 88,34 L 94,46 L 100,26 L 106,46 L 112,34 L 116,50" strokeWidth="1.4"/>

            {/* Cross */}
            <line x1="100" y1="44" x2="100" y2="156" stroke="rgba(196,154,42,1)" strokeWidth="2.5"/>
            <line x1="60"  y1="88" x2="140" y2="88"  stroke="rgba(196,154,42,1)" strokeWidth="2.5"/>

            {/* Serpent wound around cross */}
            <path d="M 100,48 C 120,57 120,73 100,83 C 80,93 80,109 100,119 C 120,129 120,143 100,153"
                  strokeWidth="1.8"/>

            {/* Snake head */}
            <polygon points="100,42 105,49 100,55 95,49" fill="rgba(196,154,42,0.85)" stroke="none"/>
            {/* Tongue */}
            <path d="M 98,42 L 95,36 M 102,42 L 105,36" strokeWidth="0.9"/>

            {/* Skull — cranium */}
            <ellipse cx="100" cy="163" rx="11" ry="10" strokeWidth="1.2"/>
            {/* Eye sockets */}
            <ellipse cx="95.5" cy="162" rx="3"   ry="3.5" fill="rgba(196,154,42,0.45)" stroke="none"/>
            <ellipse cx="104.5" cy="162" rx="3"  ry="3.5" fill="rgba(196,154,42,0.45)" stroke="none"/>
            {/* Nose */}
            <ellipse cx="100" cy="167.5" rx="1.5" ry="1" fill="rgba(196,154,42,0.3)" stroke="none"/>
            {/* Teeth */}
            <path d="M 92,171 L 94,174 L 96,171 L 98,174 L 100,171 L 102,174 L 104,171 L 106,174 L 108,171"
                  strokeWidth="0.8"/>
          </g>

        </svg>
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
          {labels?.brew || 'Brew'}
        </button>
        <button id="clear-btn" onClick={onClear} disabled={filledCount === 0}>{labels?.dispel || 'Dispel'}</button>
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
