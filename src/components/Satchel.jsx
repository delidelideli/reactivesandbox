function getDominant(stats) {
  if (stats.potency > stats.toxicity) return 'potent'
  if (stats.toxicity > stats.potency) return 'toxic'
  return 'balanced'
}

export default function Satchel({ ingredients, counts, onSelect, onAddToCauldron }) {
  return (
    <section id="satchel">
      <h2>Satchel</h2>
      <div id="satchel-grid">
        {ingredients.map(item => {
          const count = counts[item.id] ?? 0
          const dominant = getDominant(item.stats)
          return (
            <button
              key={item.id}
              className={`ingredient-btn card--${dominant}`}
              disabled={count === 0}
              onMouseEnter={() => onSelect(item)}
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
    </section>
  )
}
