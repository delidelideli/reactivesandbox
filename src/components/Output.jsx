function getDominant(stats) {
  if (stats.potency > stats.toxicity) return 'potent'
  if (stats.toxicity > stats.potency) return 'toxic'
  return 'balanced'
}

export default function Output({ brewed, labels, onHover, onPin }) {
  return (
    <section id="output">
      <h2>{labels?.output || 'Output'}</h2>
      {brewed.length === 0 ? (
        <div className="grimoire-idle">
          <span className="grimoire-idle-glyph">◈</span>
          <p className="grimoire-idle-text">Brewed potions will appear here.</p>
        </div>
      ) : (
        <div id="output-grid" onMouseLeave={() => onHover(null)}>
          {brewed.map((potion, i) => {
            const dominant = getDominant(potion.stats)
            return (
              <button
                key={`${potion.id}-${i}`}
                className={`potion-card card--${dominant}`}
                onMouseEnter={() => onHover(potion)}
                onClick={() => onPin(potion)}
              >
                <span className="card-name">{potion.name}</span>
                <div className="card-dots">
                  <span className={`dot ${(potion.stats?.potency ?? 0) > 0 ? 'dot--filled dot--potent' : 'dot--empty'}`} />
                  <span className={`dot ${(potion.stats?.toxicity ?? 0) > 0 ? 'dot--filled dot--toxic' : 'dot--empty'}`} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
