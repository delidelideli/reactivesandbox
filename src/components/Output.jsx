export default function Output({ brewed, onSelect }) {
  return (
    <section id="output">
      <h2>Output</h2>
      <div id="output-grid">
        {brewed.length === 0
          ? <p>No potions brewed yet.</p>
          : brewed.map((potion, i) => (
              <button key={`${potion.id}-${i}`} onClick={() => onSelect(potion)}>
                {potion.name}
              </button>
            ))
        }
      </div>
    </section>
  )
}
