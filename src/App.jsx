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
  if (filled.length === 0) return 'none'

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

  const [ingredients, setIngredients]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('custom-ingredients')) || INGREDIENTS }
    catch { return INGREDIENTS }
  })
  const [recipes, setRecipes]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem('custom-recipes')) || RECIPES }
    catch { return RECIPES }
  })
  const [counts, setCounts]                     = useState(() => {
    try { return buildCounts(JSON.parse(localStorage.getItem('custom-ingredients')) || INGREDIENTS) }
    catch { return buildCounts(INGREDIENTS) }
  })
  const [cauldron, setCauldron]                 = useState(buildCauldron)
  const [brewed, setBrewed]                     = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [hoveredIngredient, setHoveredIngredient]   = useState(null)
  const [selectedPotion, setSelectedPotion]     = useState(null)
  const [hoveredPotion, setHoveredPotion]       = useState(null)
  const [brewMessage, setBrewMessage]           = useState('')
  const [brewResult, setBrewResult]             = useState(null)
  const [brewHistory, setBrewHistory]           = useState([])
  const [statNames, setStatNames]               = useState(() => {
    try { return JSON.parse(localStorage.getItem('stat-names')) || { potency: 'Potency', toxicity: 'Toxicity' } }
    catch { return { potency: 'Potency', toxicity: 'Toxicity' } }
  })
  const [labels, setLabels]                     = useState(() => {
    try { return JSON.parse(localStorage.getItem('ui-labels')) || {} }
    catch { return {} }
  })
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
      setBrewHistory(h => [{ outcome: 'failure', text: 'The essences resisted.' }, ...h].slice(0, 4))
      return
    }
    setBrewed(prev => [...prev, match])
    setRecipes(prev => {
      const next = prev.map(r => r.id === match.id ? { ...r, discovered: true } : r)
      localStorage.setItem('custom-recipes', JSON.stringify(next))
      return next
    })
    setCauldron(buildCauldron())
    setBrewMessage(`${match.name} has been drawn forth!`)
    triggerBrewResult('success')
    setBrewHistory(h => [{ outcome: 'success', text: match.name }, ...h].slice(0, 4))
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
    localStorage.setItem('custom-ingredients', JSON.stringify(newIngredients))
    localStorage.setItem('custom-recipes', JSON.stringify(newRecipes))
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
        <div id="header-stars" aria-hidden="true">
          <span style={{left:'4%',   top:'25%', width:'2px',   height:'2px',   animationDuration:'3.1s, 11s',  animationDelay:'0s',   '--dx': '3px',  '--dy': '-4px'}} />
          <span style={{left:'9%',   top:'68%', width:'1.5px', height:'1.5px', animationDuration:'4.4s, 13s',  animationDelay:'1.2s', '--dx': '-4px', '--dy': '3px'}}  />
          <span style={{left:'16%',  top:'38%', width:'1px',   height:'1px',   animationDuration:'2.7s, 9s',   animationDelay:'0.5s', '--dx': '4px',  '--dy': '2px'}}  />
          <span style={{left:'23%',  top:'72%', width:'2px',   height:'2px',   animationDuration:'3.8s, 14s',  animationDelay:'2.1s', '--dx': '-3px', '--dy': '-3px'}} />
          <span style={{left:'31%',  top:'20%', width:'1.5px', height:'1.5px', animationDuration:'5.0s, 10s',  animationDelay:'0.8s', '--dx': '5px',  '--dy': '-2px'}} />
          <span style={{left:'42%',  top:'55%', width:'1px',   height:'1px',   animationDuration:'3.3s, 12s',  animationDelay:'3.0s', '--dx': '-2px', '--dy': '4px'}}  />
          <span style={{left:'58%',  top:'30%', width:'1px',   height:'1px',   animationDuration:'4.1s, 8s',   animationDelay:'1.7s', '--dx': '3px',  '--dy': '3px'}}  />
          <span style={{left:'67%',  top:'75%', width:'2px',   height:'2px',   animationDuration:'2.9s, 15s',  animationDelay:'0.3s', '--dx': '-4px', '--dy': '-2px'}} />
          <span style={{left:'75%',  top:'22%', width:'1.5px', height:'1.5px', animationDuration:'4.7s, 11s',  animationDelay:'2.5s', '--dx': '2px',  '--dy': '-5px'}} />
          <span style={{left:'83%',  top:'62%', width:'1px',   height:'1px',   animationDuration:'3.6s, 9s',   animationDelay:'1.0s', '--dx': '-3px', '--dy': '3px'}}  />
          <span style={{left:'89%',  top:'35%', width:'2px',   height:'2px',   animationDuration:'5.2s, 13s',  animationDelay:'0.6s', '--dx': '4px',  '--dy': '-3px'}} />
          <span style={{left:'95%',  top:'70%', width:'1.5px', height:'1.5px', animationDuration:'3.0s, 10s',  animationDelay:'2.8s', '--dx': '-2px', '--dy': '-4px'}} />
        </div>
        <div id="header-spacer" />
        <h1>{labels.siteTitle || "Alchemist's Workshop"}</h1>
        <div id="header-btns">
          <button onClick={() => setShowCustomize(true)}>Customize</button>
          <button onClick={() => setShowSettings(true)}>Theme Settings</button>
        </div>
      </header>

      <main>
        <div id="layout">
          <Satchel
            ingredients={ingredients}
            counts={counts}
            labels={labels}
            onHover={setHoveredIngredient}
            onPin={setSelectedIngredient}
            onAddToCauldron={addToCauldron}
          />
          <IngredientGrimoire
            selectedIngredient={hoveredIngredient ?? selectedIngredient}
            ingredients={ingredients}
            recipes={recipes}
            statNames={statNames}
            labels={labels}
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
            brewHistory={brewHistory}
            statNames={statNames}
            labels={labels}
            onBrew={brew}
            onClear={clearCauldron}
            onRemoveFromCauldron={removeFromCauldron}
          />
          <Output
            brewed={brewed}
            labels={labels}
            onHover={setHoveredPotion}
            onPin={setSelectedPotion}
          />
          <PotionGrimoire
            selectedPotion={hoveredPotion ?? selectedPotion}
            statNames={statNames}
            labels={labels}
          />
        </div>
      </main>

      {showCustomize && (
        <CustomizeModal
          ingredients={ingredients}
          recipes={recipes}
          statNames={statNames}
          onSave={applyCustomData}
          onClose={() => setShowCustomize(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          statNames={statNames}
          onStatNamesChange={names => {
            setStatNames(names)
            localStorage.setItem('stat-names', JSON.stringify(names))
          }}
          labels={labels}
          onLabelsChange={next => {
            setLabels(next)
            localStorage.setItem('ui-labels', JSON.stringify(next))
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  )
}
