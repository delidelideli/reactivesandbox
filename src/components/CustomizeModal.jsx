import { useState, useRef } from 'react'
import { MAX_CAULDRON_SLOTS, MIN_BREW_INGREDIENTS } from '../data'

function parseStats(str) {
  const stats = {}
  str.split(',').forEach(pair => {
    const [k, v] = pair.split(':').map(s => s.trim())
    if (k && v !== undefined) {
      const num = Number(v)
      stats[k] = isNaN(num) ? v : Math.min(num, 10)
    }
  })
  return stats
}

export default function CustomizeModal({ ingredients, recipes, statNames, onSave, onClose }) {
  const [ings, setIngs] = useState(ingredients.map(i => ({ ...i, stats: { ...i.stats } })))
  const [recs, setRecs] = useState(recipes.map(r => ({ ...r, stats: { ...r.stats }, inputs: [...r.inputs] })))
  const [ingCounter, setIngCounter] = useState(ings.length + 1)
  const [recCounter, setRecCounter] = useState(recs.length + 1)

  const [ingName, setIngName]         = useState('')
  const [ingDesc, setIngDesc]         = useState('')
  const [ingPotency, setIngPotency]   = useState('')
  const [ingToxicity, setIngToxicity] = useState('')

  const [recName, setRecName] = useState('')
  const [recDesc, setRecDesc] = useState('')
  const [recStats, setRecStats] = useState('')
  const [recSlots, setRecSlots] = useState(['', ''])
  const fileInputRef = useRef(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify({ ingredients: ings, recipes: recs }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workshop-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const parsed = JSON.parse(evt.target.result)
        if (!Array.isArray(parsed.ingredients) || !Array.isArray(parsed.recipes)) return
        setIngs(parsed.ingredients.map(i => ({ ...i, stats: { ...i.stats } })))
        setRecs(parsed.recipes.map(r => ({ ...r, stats: { ...r.stats }, inputs: [...r.inputs] })))
        setIngCounter(parsed.ingredients.length + 1)
        setRecCounter(parsed.recipes.length + 1)
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function addIngredient() {
    if (!ingName.trim()) return
    const stats = {}
    const p = parseFloat(ingPotency)
    const t = parseFloat(ingToxicity)
    if (!isNaN(p)) stats.potency  = Math.min(Math.max(p, 0), 10)
    if (!isNaN(t)) stats.toxicity = Math.min(Math.max(t, 0), 10)
    setIngs(prev => [...prev, {
      id: `ci${ingCounter}`,
      name: ingName.trim(),
      type: 'ingredient',
      description: ingDesc.trim(),
      stats
    }])
    setIngCounter(c => c + 1)
    setIngName(''); setIngDesc(''); setIngPotency(''); setIngToxicity('')
  }

  function removeIngredient(idx) {
    const removed = ings[idx]
    setIngs(prev => prev.filter((_, i) => i !== idx))
    setRecs(prev => prev.filter(r => !r.inputs.includes(removed.id)))
  }

  function updateSlot(i, val) {
    setRecSlots(prev => prev.map((s, idx) => idx === i ? val : s))
  }

  function addSlot() {
    if (recSlots.length >= MAX_CAULDRON_SLOTS) return
    setRecSlots(prev => [...prev, ''])
  }

  function removeSlot() {
    if (recSlots.length <= MIN_BREW_INGREDIENTS) return
    setRecSlots(prev => prev.slice(0, -1))
  }

  function addRecipe() {
    const filled = recSlots.filter(s => s !== '')
    if (!recName.trim() || filled.length < MIN_BREW_INGREDIENTS) return
    const unique = new Set(filled)
    if (unique.size !== filled.length) return
    setRecs(prev => [...prev, {
      id: `cr${recCounter}`,
      name: recName.trim(),
      type: 'potion',
      description: recDesc.trim(),
      stats: recStats.trim() ? parseStats(recStats) : {},
      inputs: filled,
      discovered: false
    }])
    setRecCounter(c => c + 1)
    setRecName(''); setRecDesc(''); setRecStats(''); setRecSlots(['', ''])
  }

  function removeRecipe(idx) {
    setRecs(prev => prev.filter((_, i) => i !== idx))
  }

  const canAddRecipe = recName.trim() && recSlots.filter(s => s !== '').length >= MIN_BREW_INGREDIENTS

  return (
    <div id="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="modal">
        <h2>Customize Your Interface</h2>
        <p>Add or remove ingredients and recipes. Click <strong>Save Changes</strong> when done.</p>

        <hr />

        <div id="customize-columns">

          <div className="customize-col">
            <h3>Ingredients</h3>
            <div className="customize-form">
              <input value={ingName}  onChange={e => setIngName(e.target.value)}  placeholder="Name" />
              <input value={ingDesc}  onChange={e => setIngDesc(e.target.value)}  placeholder="Description" />
              <div className="customize-stat-inputs">
                <input type="number" min="0" max="10" step="0.1" value={ingPotency}  onChange={e => setIngPotency(e.target.value)}  placeholder={statNames?.potency  ?? 'Potency'}  />
                <input type="number" min="0" max="10" step="0.1" value={ingToxicity} onChange={e => setIngToxicity(e.target.value)} placeholder={statNames?.toxicity ?? 'Toxicity'} />
              </div>
              <button onClick={addIngredient} disabled={!ingName.trim()}>Add Ingredient</button>
            </div>
            <ul className="customize-list">
              {ings.length === 0
                ? <li><em>No ingredients yet.</em></li>
                : ings.map((ing, idx) => (
                    <li key={ing.id}>
                      <span className="customize-item-info">
                        <span className="customize-item-name">{ing.name}</span>
                        {ing.description && <span className="customize-item-desc"> — {ing.description}</span>}
                      </span>
                      <span className="customize-item-stats">
                        {Object.entries(ing.stats).map(([k, v], si) => {
                          const label = statNames?.[k] ?? k.charAt(0).toUpperCase() + k.slice(1)
                          const cls = k === 'potency' ? 'badge--potent' : k === 'toxicity' ? 'badge--toxic' : si === 0 ? 'badge--potent' : 'badge--toxic'
                          return <span key={k} className={`customize-stat-badge ${cls}`}>{label}: {v}</span>
                        })}
                      </span>
                      <button onClick={() => removeIngredient(idx)}>Remove</button>
                    </li>
                  ))
              }
            </ul>
          </div>

          <div className="customize-col-divider" />

          <div className="customize-col">
            <h3>Recipes</h3>
            <div className="customize-form">
              <input value={recName}  onChange={e => setRecName(e.target.value)}  placeholder="Output name" />
              <input value={recDesc}  onChange={e => setRecDesc(e.target.value)}  placeholder="Description" />
              <input value={recStats} onChange={e => setRecStats(e.target.value)} placeholder="Stats e.g. potency:9, toxicity:2" />
              <div className="customize-slots">
                {recSlots.map((val, i) => (
                  <select key={i} value={val} onChange={e => updateSlot(i, e.target.value)}>
                    <option value="">— Ingredient {i + 1} —</option>
                    {ings.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                  </select>
                ))}
                <div className="customize-slot-btns">
                  {recSlots.length < MAX_CAULDRON_SLOTS && <button onClick={addSlot}>+ Slot</button>}
                  {recSlots.length > MIN_BREW_INGREDIENTS && <button onClick={removeSlot}>− Slot</button>}
                </div>
              </div>
              <p className="customize-hint">Min {MIN_BREW_INGREDIENTS} ingredients, max {MAX_CAULDRON_SLOTS}. No duplicates.</p>
              <button onClick={addRecipe} disabled={!canAddRecipe}>Add Recipe</button>
            </div>
            <ul className="customize-list">
              {recs.length === 0
                ? <li><em>No recipes yet.</em></li>
                : recs.map((rec, idx) => {
                    const names = rec.inputs.map(id => ings.find(i => i.id === id)?.name ?? '(removed)')
                    return (
                      <li key={rec.id}>
                        <span>{rec.name} = {names.join(' + ')}</span>
                        <button onClick={() => removeRecipe(idx)}>Remove</button>
                      </li>
                    )
                  })
              }
            </ul>
          </div>

        </div>

        <hr />

        <div className="modal-actions">
          <button onClick={() => ings.length > 0 && onSave(ings, recs)}>Save Changes</button>
          <button onClick={handleExport}>Export</button>
          <button onClick={() => fileInputRef.current.click()}>Import</button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
