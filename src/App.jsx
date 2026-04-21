import { useState, useEffect } from 'react'
import { INGREDIENTS, RECIPES, buildCounts, buildCauldron, MIN_BREW_INGREDIENTS } from './data'
import Satchel from './components/Satchel'
import IngredientGrimoire from './components/IngredientGrimoire'
import PotionGrimoire from './components/PotionGrimoire'
import Cauldron from './components/Cauldron'
import Output from './components/Output'
import CustomizeModal from './components/CustomizeModal'
import SettingsModal from './components/SettingsModal'

function computeLiquidColor(cauldron, ingredients) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return 'rgba(20,15,8,0.5)'

  const avgPotency = filled.reduce((s, id) =>
    s + (ingredients.find(x => x.id === id)?.stats?.potency ?? 0), 0) / filled.length / 10
  const avgToxicity = filled.reduce((s, id) =>
    s + (ingredients.find(x => x.id === id)?.stats?.toxicity ?? 0), 0) / filled.length / 10

  const r = Math.round(25 + 130 * avgPotency * (1 - avgToxicity * 0.4) + 70  * avgToxicity * (1 - avgPotency * 0.4))
  const g = Math.round(18 + 82  * avgPotency * (1 - avgToxicity * 0.4) + 4   * avgToxicity * (1 - avgPotency * 0.4))
  const b = Math.round(10 + 5   * avgPotency * (1 - avgToxicity * 0.4) + 130 * avgToxicity * (1 - avgPotency * 0.4))
  const a = Math.min(0.6 + filled.length * 0.08, 0.88)

  return `rgba(${r},${g},${b},${a})`
}

function computeEssenceStats(cauldron, ingredients) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return null
  const potency  = filled.reduce((s, id) => s + (ingredients.find(x => x.id === id)?.stats?.potency  ?? 0), 0) / filled.length
  const toxicity = filled.reduce((s, id) => s + (ingredients.find(x => x.id === id)?.stats?.toxicity ?? 0), 0) / filled.length
  return { potency: Math.round(potency * 10) / 10, toxicity: Math.round(toxicity * 10) / 10 }
}

function getProximityHint(cauldron, recipes) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return null
  const exactMatch   = recipes.some(r => {
    const s1 = [...filled].sort(), s2 = [...r.inputs].sort()
    return s1.length === s2.length && s1.every((id, i) => id === s2[i])
  })
  const partialMatch = recipes.some(r => filled.every(id => r.inputs.includes(id)) && filled.length < r.inputs.length)
  if (exactMatch)   return 'A formula takes hold.'
  if (partialMatch) return 'Something stirs in the confluence...'
  return 'The essences resist each other\'s presence.'
}

function computeCauldronGlow(cauldron, ingredients) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return '0 0 22px 8px rgba(255,255,255,0.2)'

  const avgPotency = filled.reduce((s, id) => {
    return s + (ingredients.find(x => x.id === id)?.stats?.potency ?? 0)
  }, 0) / filled.length / 10

  const avgToxicity = filled.reduce((s, id) => {
    return s + (ingredients.find(x => x.id === id)?.stats?.toxicity ?? 0)
  }, 0) / filled.length / 10

  const goldOpacity   = (avgPotency * 0.35).toFixed(2)
  const purpleOpacity = (avgToxicity * 0.35).toFixed(2)
  const whiteOpacity  = Math.max(0.06, ((1 - Math.max(avgPotency, avgToxicity)) * 0.18)).toFixed(2)

  const glows = [`0 0 20px 6px rgba(255,255,255,${whiteOpacity})`]
  if (avgPotency > 0.05)  glows.push(`0 0 30px 10px rgba(201,162,39,${goldOpacity})`)
  if (avgToxicity > 0.05) glows.push(`0 0 30px 10px rgba(139,68,184,${purpleOpacity})`)

  return glows.join(', ')
}

export default function App() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('workshop-settings')
      if (saved) {
        Object.entries(JSON.parse(saved)).forEach(([k, v]) => {
          document.documentElement.style.setProperty(k, v)
        })
      }
    } catch {}
  }, [])

  const [ingredients, setIngredients]           = useState(INGREDIENTS)
  const [recipes, setRecipes]                   = useState(RECIPES)
  const [counts, setCounts]                     = useState(() => buildCounts(INGREDIENTS))
  const [cauldron, setCauldron]                 = useState(buildCauldron)
  const [brewed, setBrewed]                     = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [hoveredIngredient, setHoveredIngredient]   = useState(null)
  const [selectedPotion, setSelectedPotion]     = useState(null)
  const [hoveredPotion, setHoveredPotion]       = useState(null)
  const [brewMessage, setBrewMessage]           = useState('')
  const [brewResult, setBrewResult]             = useState(null)
  const [showCustomize, setShowCustomize]       = useState(false)
  const [showSettings, setShowSettings]         = useState(false)

  const cauldronGlow  = computeCauldronGlow(cauldron, ingredients)
  const liquidColor   = computeLiquidColor(cauldron, ingredients)
  const essenceStats  = computeEssenceStats(cauldron, ingredients)
  const proximityHint = getProximityHint(cauldron, recipes)

  function addToCauldron(id) {
    const empty = cauldron.indexOf(null)
    if (empty === -1) return
    if ((counts[id] ?? 0) === 0) return
    const next = [...cauldron]
    next[empty] = id
    setCauldron(next)
    setCounts(c => ({ ...c, [id]: c[id] - 1 }))
  }

  function triggerBrewResult(result) {
    setBrewResult(result)
    setTimeout(() => setBrewResult(null), 1000)
  }

  function brew() {
    const filled = cauldron.filter(id => id !== null)
    if (filled.length < MIN_BREW_INGREDIENTS) {
      setBrewMessage('More essences are required.')
      triggerBrewResult('failure')
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
      setBrewMessage('The essences resist each other — no formula takes hold.')
      triggerBrewResult('failure')
      return
    }
    setBrewed(prev => [...prev, match])
    setRecipes(prev => prev.map(r => r.id === match.id ? { ...r, discovered: true } : r))
    setCauldron(buildCauldron())
    setBrewMessage(`${match.name} has been drawn forth!`)
    triggerBrewResult('success')
  }

  function removeFromCauldron(index) {
    const id = cauldron[index]
    if (!id) return
    const next = [...cauldron]
    next[index] = null
    setCauldron(next)
    setCounts(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
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
      <div id="bg-glow" aria-hidden="true" />
      <div id="arcane-bg-orbs" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
      </div>
      <div id="arcane-sparkles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
      </div>

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
            onHover={setHoveredIngredient}
            onPin={setSelectedIngredient}
            onAddToCauldron={addToCauldron}
          />
          <IngredientGrimoire
            selectedIngredient={hoveredIngredient ?? selectedIngredient}
            ingredients={ingredients}
            recipes={recipes}
          />
          <Cauldron
            cauldron={cauldron}
            ingredients={ingredients}
            brewMessage={brewMessage}
            brewResult={brewResult}
            cauldronGlow={cauldronGlow}
            liquidColor={liquidColor}
            essenceStats={essenceStats}
            proximityHint={proximityHint}
            onBrew={brew}
            onClear={clearCauldron}
            onRemoveFromCauldron={removeFromCauldron}
          />
          <Output
            brewed={brewed}
            onHover={setHoveredPotion}
            onPin={setSelectedPotion}
          />
          <PotionGrimoire
            selectedPotion={hoveredPotion ?? selectedPotion}
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
