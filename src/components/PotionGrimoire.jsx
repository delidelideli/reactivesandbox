function statBloom(k, v) {
  const color = k === 'potency' ? '232,180,34' : k === 'toxicity' ? '199,125,255' : null
  if (!color) return {}
  const inner = (0.3 + (v / 10) * 0.55).toFixed(2)
  const outer = ((v / 10) * 0.28).toFixed(2)
  return { filter: `drop-shadow(0 0 ${(2 + v * 0.5).toFixed(1)}px rgba(${color},${inner})) drop-shadow(0 0 ${(v * 1.8).toFixed(1)}px rgba(${color},${outer}))` }
}

export default function PotionGrimoire({ selectedPotion }) {
  return (
    <section id="potion-grimoire">
      <h2>Potion Grimoire</h2>
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
                    {k.charAt(0).toUpperCase() + k.slice(1)} {v}/10
                  </span>
                </li>
              ))}
            </ul>
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
