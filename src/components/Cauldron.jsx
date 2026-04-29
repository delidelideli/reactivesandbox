import { MIN_BREW_INGREDIENTS } from '../data'

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

function readStatRgb(varName, fallback) {
  const hex = (getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback).replace('#', '')
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  return { r: parseInt(full.slice(0,2),16), g: parseInt(full.slice(2,4),16), b: parseInt(full.slice(4,6),16) }
}

function computeSigilStyle(essenceStats) {
  const p = readStatRgb('--stat-potency-color',  '#c49a2a')
  const t = readStatRgb('--stat-toxicity-color', '#a060c8')
  if (!essenceStats) return { color: `rgb(${t.r},${t.g},${t.b})`, filter: 'brightness(1)' }
  const diff   = essenceStats.potency - essenceStats.toxicity
  const mix    = Math.min(1, Math.max(0, diff) / 5)
  const r      = Math.round(t.r + (p.r - t.r) * mix)
  const g      = Math.round(t.g + (p.g - t.g) * mix)
  const b      = Math.round(t.b + (p.b - t.b) * mix)
  const bright = (1 + (Math.abs(diff) / 10) * 0.9).toFixed(2)
  return { color: `rgb(${r},${g},${b})`, filter: `brightness(${bright})` }
}

function getEssenceText(filled, total, min, flavor) {
  if (filled === 0) return flavor.counterEmpty
  const word = NUMBER_WORDS[filled] ?? String(filled)
  const cap = word.charAt(0).toUpperCase() + word.slice(1)
  if (filled >= min) return flavor.counterReady.replace('{count}', cap)
  return flavor.counterGathering.replace('{count}', cap).replace('{total}', total)
}

export default function Cauldron({ cauldron, ingredients, brewMessage, brewResult, cauldronGlow, essenceStats, proximityHint, brewHistory, statNames, labels, flavorText, onBrew, onClear, onRemoveFromCauldron }) {
  const filledCount = cauldron.filter(id => id !== null).length
  const brewReady = filledCount >= MIN_BREW_INGREDIENTS

  return (
    <section
      id="cauldron"
      className={brewResult ? `brew-${brewResult}` : ''}
      style={{ boxShadow: brewResult ? undefined : cauldronGlow }}
    >
      <h2>{labels?.cauldron || 'Cauldron'}</h2>

      <div id="cauldron-bowl" style={{ boxShadow: `inset 0 0 30px rgba(0,0,0,0.9), inset 0 4px 8px rgba(255,255,255,0.04), 0 6px 18px rgba(0,0,0,0.55)${cauldronGlow !== 'none' ? `, ${cauldronGlow}` : ''}` }}>
        <svg id="cauldron-sigil" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
          style={computeSigilStyle(essenceStats)}>

          <defs>
            <filter id="circle-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer rings + tick marks — slow CW */}
          <g className="sigil-group sigil-group--outer" filter="url(#circle-glow)">
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="83" fill="none" stroke="currentColor" strokeOpacity="0.4"  strokeWidth="0.75"/>
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i * 15 * Math.PI) / 180
              return (
                <line key={i}
                  x1={100 + 87 * Math.cos(a)} y1={100 + 87 * Math.sin(a)}
                  x2={100 + 93 * Math.cos(a)} y2={100 + 93 * Math.sin(a)}
                  stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.2"
                />
              )
            })}
          </g>

          {/* Inner magic circle — faster CW */}
          <g className="sigil-group sigil-group--inner" filter="url(#circle-glow)">
            <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeOpacity="0.4"  strokeWidth="0.75"/>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45 * Math.PI) / 180
              return (
                <line key={i}
                  x1={100 + 38 * Math.cos(a)} y1={100 + 38 * Math.sin(a)}
                  x2={100 + 43 * Math.cos(a)} y2={100 + 43 * Math.sin(a)}
                  stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.2"
                />
              )
            })}
            <circle cx="100" cy="100" r="4" fill="currentColor" fillOpacity="0.8" stroke="none"/>
            <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1"/>
          </g>

        </svg>
      </div>

      <div id="cauldron-slots" style={cauldron.length > 4 ? { gridTemplateColumns: 'repeat(4, 1fr)', width: 'min(280px, 95%)' } : undefined}>
        {cauldron.map((id, i) => {
          const item = id ? ingredients.find(x => x.id === id) : null
          const dominant = item ? ((item.stats?.potency ?? 0) >= (item.stats?.toxicity ?? 0) ? 'potent' : 'toxic') : null
          return (
            <div
              key={i}
              className={`slot ${item ? `slot--filled slot--removable slot--${dominant}` : ''}`}
              onClick={item ? () => onRemoveFromCauldron(i) : undefined}
              title={item ? `Remove ${item.name}` : undefined}
            >
              {item ? item.name : null}
            </div>
          )
        })}
      </div>

      <p id="cauldron-count">{getEssenceText(filledCount, cauldron.length, MIN_BREW_INGREDIENTS, flavorText)}</p>

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
