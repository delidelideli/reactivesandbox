import { MIN_BREW_INGREDIENTS } from '../data'

export default function Cauldron({ cauldron, ingredients, brewMessage, onBrew, onClear }) {
  const filledCount = cauldron.filter(id => id !== null).length

  return (
    <section id="cauldron">
      <h2>Cauldron</h2>
      <div id="cauldron-slots">
        {cauldron.map((id, i) => {
          const item = id ? ingredients.find(x => x.id === id) : null
          return (
            <div key={i} className={`slot ${item ? 'slot--filled' : ''}`}>
              <span>{item ? item.name : `Slot ${i + 1}`}</span>
            </div>
          )
        })}
      </div>
      <p id="cauldron-count">{filledCount} / {cauldron.length} ingredients — min {MIN_BREW_INGREDIENTS} to brew</p>
      <button onClick={onBrew} disabled={filledCount < MIN_BREW_INGREDIENTS}>Brew</button>
      <button onClick={onClear} disabled={filledCount === 0}>Clear</button>
      {brewMessage && <p id="brew-message">{brewMessage}</p>}
    </section>
  )
}
