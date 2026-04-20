import { useState } from 'react'
import { INGREDIENTS, RECIPES, buildCounts, buildCauldron, MIN_BREW_INGREDIENTS } from './data'
import Satchel from './components/Satchel'
import IngredientGrimoire from './components/IngredientGrimoire'
import PotionGrimoire from './components/PotionGrimoire'
import Cauldron from './components/Cauldron'
import Output from './components/Output'
import CustomizeModal from './components/CustomizeModal'
import SettingsModal from './components/SettingsModal'

export default function App() {
  const [ingredients, setIngredients]           = useState(INGREDIENTS)
  const [recipes, setRecipes]                   = useState(RECIPES)
  const [counts, setCounts]                     = useState(() => buildCounts(INGREDIENTS))
  const [cauldron, setCauldron]                 = useState(buildCauldron)
  const [brewed, setBrewed]                     = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [selectedPotion, setSelectedPotion]     = useState(null)
  const [brewMessage, setBrewMessage]           = useState('')
  const [showCustomize, setShowCustomize]       = useState(false)
  const [showSettings, setShowSettings]         = useState(false)

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
    const filled = cauldron.filter(id => id !== null)
    if (filled.length < MIN_BREW_INGREDIENTS) {
      setBrewMessage(`Need at least ${MIN_BREW_INGREDIENTS} ingredients to brew.`)
      return
    }
    const sortedFilled = [...filled].sort()
    const match = recipes.find(r => {
      const sortedInputs = [...r.inputs].sort()
      return (
        sortedInputs.length === sortedFilled.length &&
        sortedInputs.every((id, i) => id === sortedFilled[i])
      )
    })
    if (!match) {
      setBrewMessage('No known recipe for these ingredients.')
      return
    }
    setBrewed(prev => [...prev, match])
    setRecipes(prev => prev.map(r => r.id === match.id ? { ...r, discovered: true } : r))
    setCauldron(buildCauldron())
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
    setCauldron(buildCauldron())
    setBrewMessage('')
  }

  function applyCustomData(newIngredients, newRecipes) {
    setIngredients(newIngredients)
    setRecipes(newRecipes)
    setCounts(buildCounts(newIngredients))
    setCauldron(buildCauldron())
    setBrewed([])
    setSelectedIngredient(null)
    setSelectedPotion(null)
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
            onSelect={setSelectedIngredient}
            onAddToCauldron={addToCauldron}
          />
          <IngredientGrimoire
            selectedIngredient={selectedIngredient}
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
            onSelect={setSelectedPotion}
          />
          <PotionGrimoire
            selectedPotion={selectedPotion}
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
