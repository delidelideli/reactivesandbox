export default function Grimoire({ selectedItem, ingredients, recipes }) {
  return (
    <section id="grimoire">
      <h2>Grimoire</h2>
      <div id="grimoire-inner">
        <div id="grimoire-content">
          {selectedItem ? (
            <>
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
              <ul>
                {Object.entries(selectedItem.stats).map(([k, v]) => (
                  <li key={k}>{k}: {v}</li>
                ))}
              </ul>
              {selectedItem.type === 'ingredient' && (() => {
                const combos = recipes.filter(r => r.inputs.includes(selectedItem.id))
                return combos.length > 0 ? (
                  <>
                    <p><strong>Used in:</strong></p>
                    <ul>{combos.map(r => <li key={r.id}>{r.name}</li>)}</ul>
                  </>
                ) : null
              })()}
            </>
          ) : (
            <p>Select an item to view details.</p>
          )}
        </div>

        <div id="grimoire-recipes">
          <h3>Recipe Book</h3>
          {recipes.map(r => {
            const names = r.inputs.map(id => ingredients.find(i => i.id === id)?.name ?? id)
            return (
              <div key={r.id} className="recipe-entry">
                <strong>{r.name}</strong><br />{names.join(' + ')}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
