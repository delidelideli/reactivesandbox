import { useState } from 'react'

function parseStats(str) {
  const stats = {}
  str.split(',').forEach(pair => {
    const [k, v] = pair.split(':').map(s => s.trim())
    if (k && v !== undefined) stats[k] = isNaN(v) ? v : Number(v)
  })
  return stats
}

export default function CustomizeModal({ ingredients, recipes, onSave, onClose }) {
  const [ings, setIngs] = useState(ingredients.map(i => ({ ...i, stats: { ...i.stats } })))
  const [recs, setRecs] = useState(recipes.map(r => ({ ...r, stats: { ...r.stats }, inputs: [...r.inputs] })))
  const [ingCounter, setIngCounter] = useState(ings.length + 1)
  const [recCounter, setRecCounter] = useState(recs.length + 1)

  const [ingName, setIngName] = useState('')
  const [ingDesc, setIngDesc] = useState('')
  const [ingStats, setIngStats] = useState('')
  const [recName, setRecName] = useState('')
  const [recDesc, setRecDesc] = useState('')
  const [recStats, setRecStats] = useState('')
  const [recIng1, setRecIng1] = useState('')
  const [recIng2, setRecIng2] = useState('')

  function addIngredient() {
    if (!ingName.trim()) return
    const newIng = {
      id: `ci${ingCounter}`,
      name: ingName.trim(),
      type: 'ingredient',
      description: ingDesc.trim(),
      stats: ingStats.trim() ? parseStats(ingStats) : {}
    }
    setIngs(prev => [...prev, newIng])
    setIngCounter(c => c + 1)
    setIngName(''); setIngDesc(''); setIngStats('')
  }

  function removeIngredient(idx) {
    const removed = ings[idx]
    setIngs(prev => prev.filter((_, i) => i !== idx))
    setRecs(prev => prev.filter(r => !r.inputs.includes(removed.id)))
  }

  function addRecipe() {
    if (!recName.trim() || !recIng1 || !recIng2 || recIng1 === recIng2) return
    const newRec = {
      id: `cr${recCounter}`,
      name: recName.trim(),
      type: 'potion',
      description: recDesc.trim(),
      stats: recStats.trim() ? parseStats(recStats) : {},
      inputs: [recIng1, recIng2]
    }
    setRecs(prev => [...prev, newRec])
    setRecCounter(c => c + 1)
    setRecName(''); setRecDesc(''); setRecStats(''); setRecIng1(''); setRecIng2('')
  }

  function removeRecipe(idx) {
    setRecs(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div id="modal-overlay">
      <div id="modal">
        <h2>Customize Your Interface</h2>
        <p>Add or remove ingredients and recipes. Click <strong>Save Changes</strong> when done.</p>

        <hr />

        <h3>Add Ingredient</h3>
        <div className="form-row">
          <input value={ingName} onChange={e => setIngName(e.target.value)} placeholder="Name" />
          <input value={ingDesc} onChange={e => setIngDesc(e.target.value)} placeholder="Description" />
          <input value={ingStats} onChange={e => setIngStats(e.target.value)} placeholder="Stats (e.g. power:5, speed:3)" />
          <button onClick={addIngredient}>Add</button>
        </div>
        <ul id="custom-ing-list">
          {ings.length === 0
            ? <li><em>No ingredients yet.</em></li>
            : ings.map((ing, idx) => (
                <li key={ing.id}>
                  {ing.name} — {ing.description} [{Object.entries(ing.stats).map(([k,v]) => `${k}:${v}`).join(', ')}]
                  <button onClick={() => removeIngredient(idx)}>Remove</button>
                </li>
              ))
          }
        </ul>

        <hr />

        <h3>Add Recipe</h3>
        <div className="form-row">
          <input value={recName} onChange={e => setRecName(e.target.value)} placeholder="Output name" />
          <input value={recDesc} onChange={e => setRecDesc(e.target.value)} placeholder="Description" />
          <input value={recStats} onChange={e => setRecStats(e.target.value)} placeholder="Stats (e.g. power:10)" />
          <select value={recIng1} onChange={e => setRecIng1(e.target.value)}>
            <option value="">-- Ingredient 1 --</option>
            {ings.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <select value={recIng2} onChange={e => setRecIng2(e.target.value)}>
            <option value="">-- Ingredient 2 --</option>
            {ings.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <button onClick={addRecipe}>Add</button>
        </div>
        <ul id="custom-rec-list">
          {recs.length === 0
            ? <li><em>No recipes yet.</em></li>
            : recs.map((rec, idx) => {
                const names = rec.inputs.map(id => ings.find(i => i.id === id)?.name ?? '(removed)')
                return (
                  <li key={rec.id}>
                    {rec.name} = {names.join(' + ')}
                    <button onClick={() => removeRecipe(idx)}>Remove</button>
                  </li>
                )
              })
          }
        </ul>

        <hr />

        <div className="modal-actions">
          <button onClick={() => ings.length > 0 && onSave(ings, recs)}>Save Changes</button>
          <button>Export</button>
          <button>Import</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
