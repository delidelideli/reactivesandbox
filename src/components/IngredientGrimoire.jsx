function getDominant(stats) {
  if (stats.potency > stats.toxicity) return 'potent'
  if (stats.toxicity > stats.potency) return 'toxic'
  return 'balanced'
}

function readStatRgb(varName, fallback) {
  const hex = (getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback).replace('#', '')
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  return `${parseInt(full.slice(0,2),16)},${parseInt(full.slice(2,4),16)},${parseInt(full.slice(4,6),16)}`
}

function statBloom(k, v) {
  const varName  = k === 'potency' ? '--stat-potency-color' : k === 'toxicity' ? '--stat-toxicity-color' : null
  const fallback = k === 'potency' ? '#c49a2a' : '#a060c8'
  if (!varName) return {}
  const color = readStatRgb(varName, fallback)
  const inner = (0.3 + (v / 10) * 0.55).toFixed(2)
  const outer = ((v / 10) * 0.28).toFixed(2)
  return { filter: `drop-shadow(0 0 ${(2 + v * 0.5).toFixed(1)}px rgba(${color},${inner})) drop-shadow(0 0 ${(v * 1.8).toFixed(1)}px rgba(${color},${outer}))` }
}

export default function IngredientGrimoire({ selectedIngredient, ingredients, recipes, statNames, labels, flavorText }) {
  const discoveredRecipes = recipes.filter(r => r.discovered)

  return (
    <section id="ingredient-grimoire">
      <h2>{labels?.ingredientGrimoire || 'Ingredient Grimoire'}</h2>
      <div id="grimoire-inner">

        <div id="grimoire-content">
          {selectedIngredient ? (
            <>
              <h3 className={getDominant(selectedIngredient.stats) === 'toxic' ? 'stat-toxicity' : 'stat-potency'}>{selectedIngredient.name}</h3>
              <p>{selectedIngredient.description}</p>
              <ul>
                {Object.entries(selectedIngredient.stats).map(([k, v]) => (
                  <li key={k}>
                    <span
                      className={k === 'potency' ? 'stat-potency' : k === 'toxicity' ? 'stat-toxicity' : ''}
                      style={statBloom(k, v)}
                    >
                      {(statNames?.[k] ?? k.charAt(0).toUpperCase() + k.slice(1))} {v}/10
                    </span>
                  </li>
                ))}
              </ul>
              {(() => {
                const allCombos = recipes.filter(r => r.inputs.includes(selectedIngredient.id))
                if (allCombos.length === 0) return null
                const discovered = allCombos.filter(r => r.discovered)
                const hiddenCount = allCombos.length - discovered.length
                return (
                  <>
                    <p style={{ marginTop: '0.5rem' }}><strong>Used in:</strong></p>
                    <ul>
                      {discovered.map(r => <li key={r.id}>{r.name}</li>)}
                      {hiddenCount > 0 && Array.from({ length: hiddenCount }).map((_, i) => (
                        <li key={`hidden-${i}`} className="recipe-hidden">???</li>
                      ))}
                    </ul>
                  </>
                )
              })()}
            </>
          ) : (
            <div className="grimoire-idle">
              <span className="grimoire-idle-glyph">⚗</span>
              <p className="grimoire-idle-text">{flavorText?.idleIngredient}</p>
            </div>
          )}
        </div>

        <div id="grimoire-recipes">
          <h3>Recipe Book <span className="recipe-book-count">{discoveredRecipes.length} / {recipes.length}</span></h3>
          {discoveredRecipes.length === 0 ? (
            <div className="grimoire-idle grimoire-idle--small">
              <span className="grimoire-idle-glyph grimoire-idle-glyph--small">✦</span>
              <p className="grimoire-idle-text">{flavorText?.idleRecipeBook}</p>
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
