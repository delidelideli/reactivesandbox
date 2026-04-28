function readStatRgb(varName, fallback) {
  const hex = (getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback).replace('#', '')
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  return `${parseInt(full.slice(0,2),16)},${parseInt(full.slice(2,4),16)},${parseInt(full.slice(4,6),16)}`
}

function statBloom(k, v) {
  const varName  = k === 'potency' ? '--stat-potency-color' : k === 'toxicity' ? '--stat-toxicity-color' : null
  const fallback = k === 'potency' ? '#c49a2a' : '#a060c8'
  if (!varName) return {}
  const color = readStatRgb(varName, fallback)
  const inner = (0.3 + (v / 10) * 0.55).toFixed(2)
  const outer = ((v / 10) * 0.28).toFixed(2)
  return { filter: `drop-shadow(0 0 ${(2 + v * 0.5).toFixed(1)}px rgba(${color},${inner})) drop-shadow(0 0 ${(v * 1.8).toFixed(1)}px rgba(${color},${outer}))` }
}

export default function PotionGrimoire({ selectedPotion, statNames, labels, ingredients }) {
  return (
    <section id="potion-grimoire">
      <h2>{labels?.potionGrimoire || 'Potion Grimoire'}</h2>
      <div id="potion-grimoire-content">
        {selectedPotion ? (
          <>
            <h3>{selectedPotion.name}</h3>
            <p>{selectedPotion.description}</p>
            <ul>
              {Object.entries(selectedPotion.stats).map(([k, v]) => (
                <li key={k}>
                  <span
                    className={k === 'potency' ? 'stat-potency' : k === 'toxicity' ? 'stat-toxicity' : ''}
                    style={statBloom(k, v)}
                  >
                    {(statNames?.[k] ?? k.charAt(0).toUpperCase() + k.slice(1))} {v}/10
                  </span>
                </li>
              ))}
            </ul>
            {selectedPotion.inputs && ingredients && (
              <>
                <p style={{ marginTop: '0.5rem' }}><strong>Made from:</strong></p>
                <ul>
                  {selectedPotion.inputs.map(id => {
                    const ing = ingredients?.find(i => i.id === id)
                    return <li key={id}>{ing?.name ?? id}</li>
                  })}
                </ul>
              </>
            )}
          </>
        ) : (
          <div className="grimoire-idle">
            <span className="grimoire-idle-glyph">✦</span>
            <p className="grimoire-idle-text">Brew a potion and select it from the Output to examine its properties.</p>
          </div>
        )}
      </div>
    </section>
  )
}
