export default function IngredientGrimoire({ selectedIngredient, ingredients, recipes }) {
  const discoveredRecipes = recipes.filter(r => r.discovered)

  return (
    <section id="ingredient-grimoire">
      <h2>Grimoire</h2>
      <div id="grimoire-inner">
        <div id="grimoire-content">
          {selectedIngredient ? (
            <>
              <h3>{selectedIngredient.name}</h3>
              <p>{selectedIngredient.description}</p>
              <ul>
                {Object.entries(selectedIngredient.stats).map(([k, v]) => (
                  <li key={k}>{k}: {v}/10</li>
                ))}
              </ul>
              {(() => {
                const combos = discoveredRecipes.filter(r => r.inputs.includes(selectedIngredient.id))
                return combos.length > 0 ? (
                  <>
                    <p><strong>Used in:</strong></p>
                    <ul>{combos.map(r => <li key={r.id}>{r.name}</li>)}</ul>
                  </>
                ) : null
              })()}
            </>
          ) : (
            <p>Select an ingredient to view details.</p>
          )}
        </div>

        <div id="grimoire-recipes">
          <h3>Recipe Book</h3>
          {discoveredRecipes.length === 0
            ? <p>No recipes discovered yet. Experiment in the Cauldron.</p>
            : discoveredRecipes.map(r => {
                const names = r.inputs.map(id => ingredients.find(i => i.id === id)?.name ?? id)
                return (
                  <div key={r.id} className="recipe-entry">
                    <strong>{r.name}</strong><br />{names.join(' + ')}
                  </div>
                )
              })
          }
        </div>
      </div>
    </section>
  )
}
