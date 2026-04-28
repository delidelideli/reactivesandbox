import { useState, useRef, useEffect } from 'react'
import { MIN_BREW_INGREDIENTS } from '../data'

export default function CustomizeModal({ ingredients, recipes, statNames, maxSlots, onSave, onClose }) {
  const [ings, setIngs] = useState(ingredients.map(i => ({ ...i, stats: { ...i.stats } })))
  const [recs, setRecs] = useState(recipes.map(r => ({ ...r, stats: { ...r.stats }, inputs: [...r.inputs] })))
  const [ingCounter, setIngCounter] = useState(ings.length + 1)
  const [recCounter, setRecCounter] = useState(recs.length + 1)
  const [slotCount, setSlotCount]   = useState(maxSlots ?? 4)

  const [editIngId, setEditIngId] = useState(null)
  const [editRecId, setEditRecId] = useState(null)

  const [ingName,    setIngName]    = useState('')
  const [ingDesc,    setIngDesc]    = useState('')
  const [ingPotency, setIngPotency] = useState('')
  const [ingToxicity,setIngToxicity]= useState('')

  const [recName,    setRecName]    = useState('')
  const [recDesc,    setRecDesc]    = useState('')
  const [recPotency, setRecPotency] = useState('')
  const [recToxicity,setRecToxicity]= useState('')
  const [recSlots,   setRecSlots]   = useState(['', ''])

  const fileInputRef = useRef(null)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (editRecId) return
    setRecSlots(prev => {
      const trimmed = prev.slice(0, slotCount)
      while (trimmed.length < MIN_BREW_INGREDIENTS) trimmed.push('')
      return trimmed
    })
  }, [slotCount, editRecId])

  // ── Export / Import ──────────────────────────────────────────────

  function handleExport() {
    const exportRecs = recs.map(r => ({ ...r, discovered: false }))
    const blob = new Blob([JSON.stringify({ ingredients: ings, recipes: exportRecs, slotCount }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'workshop-data.json'; a.click()
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
        if (parsed.slotCount === 4 || parsed.slotCount === 8) setSlotCount(parsed.slotCount)
        cancelEditIng(); cancelEditRec()
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Ingredient CRUD ──────────────────────────────────────────────

  function buildIngStats() {
    const stats = {}
    const p = parseFloat(ingPotency), t = parseFloat(ingToxicity)
    if (!isNaN(p)) stats.potency  = Math.min(Math.max(p, 0), 10)
    if (!isNaN(t)) stats.toxicity = Math.min(Math.max(t, 0), 10)
    return stats
  }

  function addIngredient() {
    if (!ingName.trim()) return
    setIngs(prev => [...prev, { id: `ci${ingCounter}`, name: ingName.trim(), type: 'ingredient', description: ingDesc.trim(), stats: buildIngStats() }])
    setIngCounter(c => c + 1)
    clearIngForm()
  }

  function startEditIng(ing) {
    setEditIngId(ing.id)
    setIngName(ing.name)
    setIngDesc(ing.description || '')
    setIngPotency(ing.stats?.potency ?? '')
    setIngToxicity(ing.stats?.toxicity ?? '')
  }

  function saveEditIng() {
    if (!ingName.trim()) return
    setIngs(prev => prev.map(i => i.id === editIngId
      ? { ...i, name: ingName.trim(), description: ingDesc.trim(), stats: buildIngStats() }
      : i
    ))
    cancelEditIng()
  }

  function cancelEditIng() {
    setEditIngId(null)
    clearIngForm()
  }

  function clearIngForm() {
    setIngName(''); setIngDesc(''); setIngPotency(''); setIngToxicity('')
  }

  function removeIngredient(idx) {
    const removed = ings[idx]
    const affected = recs.filter(r => r.inputs.includes(removed.id))
    if (affected.length > 0) {
      const names = affected.map(r => r.name).join(', ')
      if (!window.confirm(`Removing "${removed.name}" will also delete ${affected.length} recipe${affected.length > 1 ? 's' : ''}: ${names}. Continue?`)) return
    }
    if (editIngId === removed.id) cancelEditIng()
    setIngs(prev => prev.filter((_, i) => i !== idx))
    setRecs(prev => prev.filter(r => !r.inputs.includes(removed.id)))
  }

  // ── Recipe CRUD ──────────────────────────────────────────────────

  function buildRecStats() {
    const stats = {}
    const p = parseFloat(recPotency), t = parseFloat(recToxicity)
    if (!isNaN(p)) stats.potency  = Math.min(Math.max(p, 0), 10)
    if (!isNaN(t)) stats.toxicity = Math.min(Math.max(t, 0), 10)
    return stats
  }

  function updateSlot(i, val) {
    setRecSlots(prev => prev.map((s, idx) => idx === i ? val : s))
  }

  function addSlot() {
    if (recSlots.length >= slotCount) return
    setRecSlots(prev => [...prev, ''])
  }

  function removeSlot() {
    if (recSlots.length <= MIN_BREW_INGREDIENTS) return
    setRecSlots(prev => prev.slice(0, -1))
  }

  function addRecipe() {
    const filled = recSlots.filter(s => s !== '')
    if (!recName.trim() || filled.length < MIN_BREW_INGREDIENTS) return
    if (new Set(filled).size !== filled.length) return
    setRecs(prev => [...prev, { id: `cr${recCounter}`, name: recName.trim(), type: 'potion', description: recDesc.trim(), stats: buildRecStats(), inputs: filled, discovered: false }])
    setRecCounter(c => c + 1)
    clearRecForm()
  }

  function startEditRec(rec) {
    setEditRecId(rec.id)
    setRecName(rec.name)
    setRecDesc(rec.description || '')
    setRecPotency(rec.stats?.potency ?? '')
    setRecToxicity(rec.stats?.toxicity ?? '')
    const slots = rec.inputs.slice(0, slotCount)
    while (slots.length < MIN_BREW_INGREDIENTS) slots.push('')
    setRecSlots(slots)
  }

  function saveEditRec() {
    const filled = recSlots.filter(s => s !== '')
    if (!recName.trim() || filled.length < MIN_BREW_INGREDIENTS) return
    if (new Set(filled).size !== filled.length) return
    setRecs(prev => prev.map(r => r.id === editRecId
      ? { ...r, name: recName.trim(), description: recDesc.trim(), stats: buildRecStats(), inputs: filled }
      : r
    ))
    cancelEditRec()
  }

  function cancelEditRec() {
    setEditRecId(null)
    clearRecForm()
  }

  function clearRecForm() {
    setRecName(''); setRecDesc(''); setRecPotency(''); setRecToxicity(''); setRecSlots(['', ''])
  }

  function removeRecipe(idx) {
    if (editRecId === recs[idx].id) cancelEditRec()
    setRecs(prev => prev.filter((_, i) => i !== idx))
  }

  const canSubmitRec = recName.trim() && recSlots.filter(s => s !== '').length >= MIN_BREW_INGREDIENTS

  return (
    <div id="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div id="modal">
        <div className="modal-header">
          <div>
            <h2>Customize Your Interface</h2>
            <p>Add, edit, or remove ingredients and recipes. Click <strong>Save Changes</strong> when done.</p>
          </div>
          <div className="modal-warning">
            ⚠ Changes are not saved permanently.<br />Use <strong>Export</strong> to save your data as a file.
          </div>
        </div>

        <hr />

        <div className="customize-global-row">
          <span className="customize-global-label">Cauldron Slots</span>
          <div className="customize-slot-toggle">
            <button className={slotCount === 4 ? 'slot-toggle-btn slot-toggle-btn--active' : 'slot-toggle-btn'} onClick={() => setSlotCount(4)}>4</button>
            <button className={slotCount === 8 ? 'slot-toggle-btn slot-toggle-btn--active' : 'slot-toggle-btn'} onClick={() => setSlotCount(8)}>8</button>
          </div>
        </div>

        <div id="customize-columns">

          {/* ── INGREDIENTS ── */}
          <div className="customize-col">
            <h3>{editIngId ? 'Edit Ingredient' : 'Ingredients'}</h3>
            <div className="customize-form">
              <input value={ingName}     onChange={e => setIngName(e.target.value)}     placeholder="Name" />
              <input value={ingDesc}     onChange={e => setIngDesc(e.target.value)}     placeholder="Description" />
              <div className="customize-stat-inputs">
                <input type="number" min="0" max="10" step="0.1" value={ingPotency}   onChange={e => setIngPotency(e.target.value)}   placeholder={statNames?.potency  ?? 'Potency'}  />
                <input type="number" min="0" max="10" step="0.1" value={ingToxicity}  onChange={e => setIngToxicity(e.target.value)}  placeholder={statNames?.toxicity ?? 'Toxicity'} />
              </div>
              <div className="customize-form-actions">
                <button onClick={editIngId ? saveEditIng : addIngredient} disabled={!ingName.trim()}>
                  {editIngId ? 'Update Ingredient' : 'Add Ingredient'}
                </button>
                {editIngId && <button className="customize-cancel-btn" onClick={cancelEditIng}>Cancel</button>}
              </div>
            </div>
            <ul className="customize-list">
              {ings.length === 0
                ? <li><em>No ingredients yet.</em></li>
                : ings.map((ing, idx) => (
                    <li key={ing.id} className={editIngId === ing.id ? 'customize-item--editing' : ''}>
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
                      <div className="customize-item-btns">
                        <button onClick={() => startEditIng(ing)}>Edit</button>
                        <button onClick={() => removeIngredient(idx)}>Remove</button>
                      </div>
                    </li>
                  ))
              }
            </ul>
          </div>

          <div className="customize-col-divider" />

          {/* ── RECIPES ── */}
          <div className="customize-col">
            <h3>{editRecId ? 'Edit Recipe' : 'Recipes'}</h3>
            <div className="customize-form">
              <input value={recName} onChange={e => setRecName(e.target.value)} placeholder="Output name" />
              <input value={recDesc} onChange={e => setRecDesc(e.target.value)} placeholder="Description" />
              <div className="customize-stat-inputs">
                <input type="number" min="0" max="10" step="0.1" value={recPotency}   onChange={e => setRecPotency(e.target.value)}   placeholder={statNames?.potency  ?? 'Potency'}  />
                <input type="number" min="0" max="10" step="0.1" value={recToxicity}  onChange={e => setRecToxicity(e.target.value)}  placeholder={statNames?.toxicity ?? 'Toxicity'} />
              </div>
              <div className="customize-slots">
                {recSlots.map((val, i) => (
                  <select key={i} value={val} onChange={e => updateSlot(i, e.target.value)}>
                    <option value="">— Ingredient {i + 1} —</option>
                    {ings.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                  </select>
                ))}
                <div className="customize-slot-btns">
                  {recSlots.length < slotCount && <button onClick={addSlot}>+ Slot</button>}
                  {recSlots.length > MIN_BREW_INGREDIENTS && <button onClick={removeSlot}>− Slot</button>}
                </div>
              </div>
              <p className="customize-hint">Min {MIN_BREW_INGREDIENTS} ingredients, max {slotCount}. No duplicates.</p>
              <div className="customize-form-actions">
                <button onClick={editRecId ? saveEditRec : addRecipe} disabled={!canSubmitRec}>
                  {editRecId ? 'Update Recipe' : 'Add Recipe'}
                </button>
                {editRecId && <button className="customize-cancel-btn" onClick={cancelEditRec}>Cancel</button>}
              </div>
            </div>
            <ul className="customize-list">
              {recs.length === 0
                ? <li><em>No recipes yet.</em></li>
                : recs.map((rec, idx) => {
                    const names = rec.inputs.map(id => ings.find(i => i.id === id)?.name ?? '(removed)')
                    return (
                      <li key={rec.id} className={editRecId === rec.id ? 'customize-item--editing' : ''}>
                        <span>{rec.name} = {names.join(' + ')}</span>
                        <div className="customize-item-btns">
                          <button onClick={() => startEditRec(rec)}>Edit</button>
                          <button onClick={() => removeRecipe(idx)}>Remove</button>
                        </div>
                      </li>
                    )
                  })
              }
            </ul>
          </div>

        </div>

        <hr />

        <div className="modal-actions">
          <button onClick={() => onSave(ings, recs, slotCount)} disabled={ings.length === 0}>Save Changes</button>
          <button onClick={handleExport}>Export</button>
          <button onClick={() => fileInputRef.current.click()}>Import</button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
