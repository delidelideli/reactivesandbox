function statBloom(k, v) {
  const color = k === 'potency' ? '232,180,34' : k === 'toxicity' ? '199,125,255' : null
  if (!color) return {}
  const inner = (0.3 + (v / 10) * 0.55).toFixed(2)
  const outer = ((v / 10) * 0.28).toFixed(2)
  return { filter: `drop-shadow(0 0 ${(2 + v * 0.5).toFixed(1)}px rgba(${color},${inner})) drop-shadow(0 0 ${(v * 1.8).toFixed(1)}px rgba(${color},${outer}))` }
}

export default function IngredientGrimoire({ selectedIngredient, ingredients, recipes }) {
  const discoveredRecipes = recipes.filter(r => r.discovered)

  return (
    <section id="ingredient-grimoire">
      <h2>Ingredient Grimoire</h2>
      <div id="grimoire-inner">

        <div id="grimoire-content">
          {selectedIngredient ? (
            <>
              <h3>{selectedIngredient.name}</h3>
              <p>{selectedIngredient.description}</p>
              <ul>
                {Object.entries(selectedIngredient.stats).map(([k, v]) => (
                  <li key={k}>
                    <span
                      className={k === 'potency' ? 'stat-potency' : k === 'toxicity' ? 'stat-toxicity' : ''}
                      style={statBloom(k, v)}
                    >
                      {k.charAt(0).toUpperCase() + k.slice(1)} {v}/10
                    </span>
                  </li>
                ))}
              </ul>
              {(() => {
                const combos = discoveredRecipes.filter(r => r.inputs.includes(selectedIngredient.id))
                return combos.length > 0 ? (
                  <>
                    <p style={{ marginTop: '0.5rem' }}><strong>Used in:</strong></p>
                    <ul>{combos.map(r => <li key={r.id}>{r.name}</li>)}</ul>
                  </>
                ) : null
              })()}
            </>
          ) : (
            <div className="grimoire-idle">
              <span className="grimoire-idle-glyph">⚗</span>
              <p className="grimoire-idle-text">Select an ingredient from the Satchel to reveal its arcane properties.</p>
            </div>
          )}
        </div>

        <div id="grimoire-recipes">
          <h3>Recipe Book</h3>
          {discoveredRecipes.length === 0 ? (
            <div className="grimoire-idle grimoire-idle--small">
              <span className="grimoire-idle-glyph grimoire-idle-glyph--small">✦</span>
              <p className="grimoire-idle-text">No recipes discovered yet. Experiment in the Cauldron.</p>
            </div>
          ) : (
            discoveredRecipes.map(r => {
              const names = r.inputs.map(id => ingredients.find(i => i.id === id)?.name ?? id)
              return (
                <div key={r.id} className="recipe-entry">
                  <strong>{r.name}</strong><br />{names.join(' + ')}
                </div>
              )
            })
          )}
        </div>

      </div>
    </section>
  )
}
