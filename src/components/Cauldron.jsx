export default function Cauldron({ cauldron, ingredients, brewMessage, onBrew, onClear }) {
  return (
    <section id="cauldron">
      <h2>Cauldron</h2>
      <div id="cauldron-slots">
        {cauldron.map((id, i) => {
          const item = id ? ingredients.find(x => x.id === id) : null
          return (
            <div key={i} className="slot">
              <span>Slot {i + 1}: {item ? item.name : 'Empty'}</span>
            </div>
          )
        })}
      </div>
      <button onClick={onBrew}>Brew</button>
      <button onClick={onClear}>Clear</button>
      {brewMessage && <p id="brew-message">{brewMessage}</p>}
    </section>
  )
}
