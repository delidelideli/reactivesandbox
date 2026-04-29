import { useState, useEffect } from 'react'
import { INGREDIENTS, RECIPES, buildCounts, buildCauldron, MIN_BREW_INGREDIENTS } from './data'
import { DEFAULT_FLAVOR } from './flavorDefaults'
import Satchel from './components/Satchel'
import IngredientGrimoire from './components/IngredientGrimoire'
import PotionGrimoire from './components/PotionGrimoire'
import Cauldron from './components/Cauldron'
import Output from './components/Output'
import CustomizeModal from './components/CustomizeModal'
import SettingsModal from './components/SettingsModal'


function computeEssenceStats(cauldron, ingredients) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return null
  const potency  = Math.min(filled.reduce((s, id) => s + (ingredients.find(x => x.id === id)?.stats?.potency  ?? 0), 0), 10)
  const toxicity = Math.min(filled.reduce((s, id) => s + (ingredients.find(x => x.id === id)?.stats?.toxicity ?? 0), 0), 10)
  return { potency: Math.round(potency * 10) / 10, toxicity: Math.round(toxicity * 10) / 10 }
}

function getProximityHint(cauldron, recipes, flavor) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return null
  const exactMatch   = recipes.some(r => {
    const s1 = [...filled].sort(), s2 = [...r.inputs].sort()
    return s1.length === s2.length && s1.every((id, i) => id === s2[i])
  })
  const partialMatch = recipes.some(r => filled.every(id => r.inputs.includes(id)) && filled.length < r.inputs.length)
  if (exactMatch)   return flavor.hintExact
  if (partialMatch) return flavor.hintPartial
  return flavor.hintNone
}

function readStatHex(varName, fallback) {
  const hex = (getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback).replace('#', '')
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  return `${parseInt(full.slice(0,2),16)},${parseInt(full.slice(2,4),16)},${parseInt(full.slice(4,6),16)}`
}

function computeCauldronGlow(cauldron, ingredients) {
  const filled = cauldron.filter(id => id !== null)
  if (filled.length === 0) return 'none'

  const avgPotency = Math.min(filled.reduce((s, id) => {
    return s + (ingredients.find(x => x.id === id)?.stats?.potency ?? 0)
  }, 0), 10) / 10

  const avgToxicity = Math.min(filled.reduce((s, id) => {
    return s + (ingredients.find(x => x.id === id)?.stats?.toxicity ?? 0)
  }, 0), 10) / 10

  const potencyRgb  = readStatHex('--stat-potency-color',  '#c49a2a')
  const toxicityRgb = readStatHex('--stat-toxicity-color', '#a060c8')
  const goldOpacity   = (avgPotency * 0.35).toFixed(2)
  const purpleOpacity = (avgToxicity * 0.35).toFixed(2)
  const whiteOpacity  = Math.max(0.06, ((1 - Math.max(avgPotency, avgToxicity)) * 0.18)).toFixed(2)

  const glows = [`0 0 20px 6px rgba(255,255,255,${whiteOpacity})`]
  if (avgPotency > 0.05)  glows.push(`0 0 30px 10px rgba(${potencyRgb},${goldOpacity})`)
  if (avgToxicity > 0.05) glows.push(`0 0 30px 10px rgba(${toxicityRgb},${purpleOpacity})`)

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
      const bodyClass = localStorage.getItem('workshop-body-class')
      if (bodyClass) document.body.classList.add(bodyClass)
      const effect = localStorage.getItem('workshop-header-effect')
      if (effect) document.querySelector('header')?.setAttribute('data-effect', effect)
    } catch {}
  }, [])

  const [ingredients, setIngredients]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('custom-ingredients')) || INGREDIENTS }
    catch { return INGREDIENTS }
  })
  const [recipes, setRecipes]                   = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('custom-recipes'))
      if (saved) return saved.map(r => ({ ...r, discovered: false }))
      return RECIPES
    }
    catch { return RECIPES }
  })
  const [counts, setCounts]                     = useState(() => {
    try { return buildCounts(JSON.parse(localStorage.getItem('custom-ingredients')) || INGREDIENTS) }
    catch { return buildCounts(INGREDIENTS) }
  })
  const [maxSlots, setMaxSlots]                 = useState(() => {
    try { return parseInt(localStorage.getItem('workshop-max-slots')) || 4 }
    catch { return 4 }
  })
  const [cauldron, setCauldron]                 = useState(() => {
    try { return buildCauldron(parseInt(localStorage.getItem('workshop-max-slots')) || 4) }
    catch { return buildCauldron(4) }
  })
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
  const [flavorText, setFlavorText]             = useState(() => {
    try { return { ...DEFAULT_FLAVOR, ...JSON.parse(localStorage.getItem('workshop-flavor-text')) } }
    catch { return { ...DEFAULT_FLAVOR } }
  })
  const [showCustomize, setShowCustomize]       = useState(false)
  const [showSettings, setShowSettings]         = useState(false)

  const cauldronGlow  = computeCauldronGlow(cauldron, ingredients)
  const essenceStats  = computeEssenceStats(cauldron, ingredients)
  const proximityHint = getProximityHint(cauldron, recipes, flavorText)

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
      setBrewMessage(flavorText.brewNotEnough)
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
      setBrewMessage(flavorText.brewFailure)
      triggerBrewResult('failure')
      setBrewHistory(h => [{ outcome: 'failure', text: flavorText.brewFailureLog }, ...h].slice(0, 4))
      return
    }
    const computedStats = {
      potency:  Math.min(match.inputs.reduce((s, id) => s + (ingredients.find(x => x.id === id)?.stats?.potency  ?? 0), 0), 10),
      toxicity: Math.min(match.inputs.reduce((s, id) => s + (ingredients.find(x => x.id === id)?.stats?.toxicity ?? 0), 0), 10),
    }
    setBrewed(prev => [...prev, { ...match, stats: computedStats }])
    setRecipes(prev => prev.map(r => r.id === match.id ? { ...r, discovered: true } : r))
    setCauldron(buildCauldron(maxSlots))
    setBrewMessage(flavorText.brewSuccess.replace('{name}', match.name))
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

  function restockCounts() {
    setCounts(buildCounts(ingredients))
  }

  function clearCauldron() {
    const returned = {}
    cauldron.forEach(id => { if (id) returned[id] = (returned[id] ?? 0) + 1 })
    setCounts(c => {
      const next = { ...c }
      Object.entries(returned).forEach(([id, n]) => { next[id] = (next[id] ?? 0) + n })
      return next
    })
    setCauldron(buildCauldron(maxSlots))
    setBrewMessage('')
  }

  function applyCustomData(newIngredients, newRecipes, newMaxSlots) {
    setIngredients(newIngredients)
    setRecipes(newRecipes)
    setMaxSlots(newMaxSlots)
    setCounts(buildCounts(newIngredients))
    setCauldron(buildCauldron(newMaxSlots))
    setBrewed([])
    setSelectedIngredient(null)
    setSelectedPotion(null)
    setBrewMessage('')
    setShowCustomize(false)
    localStorage.setItem('custom-ingredients', JSON.stringify(newIngredients))
    localStorage.setItem('custom-recipes', JSON.stringify(newRecipes))
    localStorage.setItem('workshop-max-slots', String(newMaxSlots))
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

      <header data-effect="stars">
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
            statNames={statNames}
            onHover={setHoveredIngredient}
            onPin={setSelectedIngredient}
            onAddToCauldron={addToCauldron}
            onRestock={restockCounts}
          />
          <IngredientGrimoire
            selectedIngredient={hoveredIngredient ?? selectedIngredient}
            ingredients={ingredients}
            recipes={recipes}
            statNames={statNames}
            labels={labels}
            flavorText={flavorText}
          />
          <Cauldron
            cauldron={cauldron}
            ingredients={ingredients}
            brewMessage={brewMessage}
            brewResult={brewResult}
            cauldronGlow={cauldronGlow}
            essenceStats={essenceStats}
            proximityHint={proximityHint}
            brewHistory={brewHistory}
            statNames={statNames}
            labels={labels}
            flavorText={flavorText}
            onBrew={brew}
            onClear={clearCauldron}
            onRemoveFromCauldron={removeFromCauldron}
          />
          <Output
            brewed={brewed}
            labels={labels}
            flavorText={flavorText}
            onHover={setHoveredPotion}
            onPin={setSelectedPotion}
          />
          <PotionGrimoire
            selectedPotion={hoveredPotion ?? selectedPotion}
            statNames={statNames}
            labels={labels}
            flavorText={flavorText}
            ingredients={ingredients}
          />
        </div>
      </main>

      {showCustomize && (
        <CustomizeModal
          ingredients={ingredients}
          recipes={recipes}
          statNames={statNames}
          maxSlots={maxSlots}
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
          flavorText={flavorText}
          onFlavorTextChange={next => {
            setFlavorText(next)
            localStorage.setItem('workshop-flavor-text', JSON.stringify(next))
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  )
}
