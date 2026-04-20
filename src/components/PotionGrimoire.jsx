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
                <li key={k}>{k}: {v}/10</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Select a brewed potion to view details.</p>
        )}
      </div>
    </section>
  )
}
