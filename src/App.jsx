import { useState } from 'react'
import { INGREDIENTS, RECIPES, buildCounts } from './data'
import Satchel from './components/Satchel'
import Grimoire from './components/Grimoire'
import Cauldron from './components/Cauldron'
import Output from './components/Output'
import CustomizeModal from './components/CustomizeModal'
import SettingsModal from './components/SettingsModal'

export default function App() {
  const [ingredients, setIngredients] = useState(INGREDIENTS)
  const [recipes, setRecipes] = useState(RECIPES)
  const [counts, setCounts] = useState(() => buildCounts(INGREDIENTS))
  const [cauldron, setCauldron] = useState([null, null])
  const [brewed, setBrewed] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [brewMessage, setBrewMessage] = useState('')
  const [showCustomize, setShowCustomize] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  function addToCauldron(id) {
    const empty = cauldron.indexOf(null)
    if (empty === -1) return
    if ((counts[id] ?? 0) === 0) return
    const next = [...cauldron]
    next[empty] = id
    setCauldron(next)
    setCounts(c => ({ ...c, [id]: c[id] - 1 }))
  }

  function brew() {
    const [a, b] = cauldron
    if (!a || !b) { setBrewMessage('Need 2 ingredients to brew.'); return }
    const match = recipes.find(r =>
      (r.inputs[0] === a && r.inputs[1] === b) ||
      (r.inputs[0] === b && r.inputs[1] === a)
    )
    if (!match) { setBrewMessage('No known recipe for these ingredients.'); return }
    setBrewed(prev => [...prev, match])
    setCauldron([null, null])
    setBrewMessage(`Brewed: ${match.name}!`)
  }

  function clearCauldron() {
    const returned = {}
    cauldron.forEach(id => { if (id) returned[id] = (returned[id] ?? 0) + 1 })
    setCounts(c => {
      const next = { ...c }
      Object.entries(returned).forEach(([id, n]) => { next[id] = (next[id] ?? 0) + n })
      return next
    })
    setCauldron([null, null])
    setBrewMessage('')
  }

  function applyCustomData(newIngredients, newRecipes) {
    setIngredients(newIngredients)
    setRecipes(newRecipes)
    setCounts(buildCounts(newIngredients))
    setCauldron([null, null])
    setBrewed([])
    setSelectedItem(null)
    setBrewMessage('')
    setShowCustomize(false)
  }

  return (
    <>
      <header>
        <h1>Alchemist's Workshop</h1>
        <div id="header-btns">
          <button onClick={() => setShowCustomize(true)}>Customize</button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
        </div>
      </header>

      <main>
        <div id="layout">
          <Satchel
            ingredients={ingredients}
            counts={counts}
            onSelect={setSelectedItem}
            onAddToCauldron={addToCauldron}
          />
          <Grimoire
            selectedItem={selectedItem}
            ingredients={ingredients}
            recipes={recipes}
          />
          <Cauldron
            cauldron={cauldron}
            ingredients={ingredients}
            brewMessage={brewMessage}
            onBrew={brew}
            onClear={clearCauldron}
          />
          <Output
            brewed={brewed}
            onSelect={setSelectedItem}
          />
        </div>
      </main>

      {showCustomize && (
        <CustomizeModal
          ingredients={ingredients}
          recipes={recipes}
          onSave={applyCustomData}
          onClose={() => setShowCustomize(false)}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}
