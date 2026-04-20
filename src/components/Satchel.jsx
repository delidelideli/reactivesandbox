export default function Satchel({ ingredients, counts, onSelect, onAddToCauldron }) {
  return (
    <section id="satchel">
      <h2>Satchel</h2>
      <div id="satchel-grid">
        {ingredients.map(item => {
          const count = counts[item.id] ?? 0
          return (
            <button
              key={item.id}
              disabled={count === 0}
              onClick={() => { onSelect(item); onAddToCauldron(item.id) }}
            >
              {item.name} ({count})
            </button>
          )
        })}
      </div>
    </section>
  )
}
