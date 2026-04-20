const state = {
  cauldron: [null, null],      // up to 2 ingredient IDs
  brewed: []                   // list of brewed potion objects
};

function renderSatchel() {
  const grid = document.getElementById("satchel-grid");
  grid.innerHTML = "";
  INGREDIENTS.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.name;
    btn.dataset.id = item.id;
    btn.addEventListener("click", () => {
      selectItem(item);
      addToCauldron(item.id);
    });
    grid.appendChild(btn);
  });
}

function renderOutput() {
  const grid = document.getElementById("output-grid");
  grid.innerHTML = "";
  if (state.brewed.length === 0) {
    grid.innerHTML = "<p>No potions brewed yet.</p>";
    return;
  }
  state.brewed.forEach(potion => {
    const btn = document.createElement("button");
    btn.textContent = potion.name;
    btn.dataset.id = potion.id;
    btn.addEventListener("click", () => selectItem(potion));
    grid.appendChild(btn);
  });
}

function selectItem(item) {
  const content = document.getElementById("grimoire-content");
  const statsHtml = Object.entries(item.stats)
    .map(([k, v]) => `<li>${k}: ${v}</li>`)
    .join("");

  let recipesHtml = "";
  if (item.type === "ingredient") {
    const combos = RECIPES.filter(r => r.inputs.includes(item.id));
    if (combos.length) {
      recipesHtml = "<p><strong>Used in:</strong></p><ul>" +
        combos.map(r => `<li>${r.name}</li>`).join("") + "</ul>";
    }
  }

  content.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <ul>${statsHtml}</ul>
    ${recipesHtml}
  `;
}

function addToCauldron(id) {
  const empty = state.cauldron.indexOf(null);
  if (empty === -1) return; // both slots full
  state.cauldron[empty] = id;
  renderCauldron();
}

function renderCauldron() {
  state.cauldron.forEach((id, i) => {
    const slot = document.getElementById(`slot-${i + 1}`);
    const item = id ? INGREDIENTS.find(x => x.id === id) : null;
    slot.querySelector("span").textContent = `Slot ${i + 1}: ${item ? item.name : "Empty"}`;
  });
}

function brew() {
  const [a, b] = state.cauldron;
  if (!a || !b) {
    setBrewMessage("Need 2 ingredients to brew.");
    return;
  }
  const match = RECIPES.find(r =>
    (r.inputs[0] === a && r.inputs[1] === b) ||
    (r.inputs[0] === b && r.inputs[1] === a)
  );
  if (!match) {
    setBrewMessage("No known recipe for these ingredients.");
    return;
  }
  state.brewed.push(match);
  state.cauldron = [null, null];
  renderCauldron();
  renderOutput();
  setBrewMessage(`Brewed: ${match.name}!`);
}

function clearCauldron() {
  state.cauldron = [null, null];
  renderCauldron();
  setBrewMessage("");
}

function setBrewMessage(msg) {
  document.getElementById("brew-message").textContent = msg;
}

function renderRecipeBook() {
  const list = document.getElementById("recipe-list");
  list.innerHTML = RECIPES.map(r => {
    const names = r.inputs.map(id => INGREDIENTS.find(i => i.id === id).name);
    return `<div class="recipe-entry"><strong>${r.name}</strong><br>${names.join(" + ")}</div>`;
  }).join("");
}

document.getElementById("brew-btn").addEventListener("click", brew);
document.getElementById("clear-btn").addEventListener("click", clearCauldron);

renderSatchel();
renderCauldron();
renderOutput();
renderRecipeBook();
