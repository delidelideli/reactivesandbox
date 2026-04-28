import { useState } from 'react'

const SORT_CYCLE = [null, 'name', 'potency', 'toxicity']

function getDominant(stats) {
  if (stats.potency > stats.toxicity) return 'potent'
  if (stats.toxicity > stats.potency) return 'toxic'
  return 'balanced'
}

export default function Satchel({ ingredients, counts, labels, statNames, onHover, onPin, onAddToCauldron, onRestock }) {
  const [sortBy, setSortBy] = useState(null)
  const allFull = ingredients.every(i => (counts[i.id] ?? 0) >= 3)

  function cycleSort() {
    setSortBy(prev => {
      const i = SORT_CYCLE.indexOf(prev)
      return SORT_CYCLE[(i + 1) % SORT_CYCLE.length]
    })
  }

  const sortLabel = sortBy === null
    ? 'Sort'
    : sortBy === 'name'
    ? 'A–Z'
    : sortBy === 'potency'
    ? (statNames?.potency ?? 'Potency')
    : (statNames?.toxicity ?? 'Toxicity')

  const sorted = sortBy === null ? ingredients : [...ingredients].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'potency') return (b.stats.potency ?? 0) - (a.stats.potency ?? 0)
    return (b.stats.toxicity ?? 0) - (a.stats.toxicity ?? 0)
  })

  return (
    <section id="satchel">
      <h2>{labels?.satchel || 'Satchel'}</h2>
      <div id="satchel-grid" onMouseLeave={() => onHover(null)}>
        {sorted.map(item => {
          const count = counts[item.id] ?? 0
          const dominant = getDominant(item.stats)
          return (
            <button
              key={item.id}
              className={`ingredient-btn card--${dominant}`}
              disabled={count === 0}
              onMouseEnter={() => { onHover(item); onPin(item) }}
              onClick={() => onAddToCauldron(item.id)}
            >
              <span className="card-name">{item.name}</span>
              <div className="card-dots">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i < count ? `dot--filled dot--${dominant}` : 'dot--empty'}`}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
      <div id="satchel-footer">
        <button id="restock-btn" onClick={onRestock} disabled={allFull}>Restock</button>
        <button
          className={`sort-cycle-btn${sortBy ? ' sort-cycle-btn--active' : ''}`}
          onClick={cycleSort}
          title="Cycle sort order"
        >{sortLabel}</button>
      </div>
    </section>
  )
}
