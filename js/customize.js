const custom = {
  ingredients: [],
  recipes: []
};

let ingIdCounter = 1;
let recIdCounter = 1;

function parseStats(str) {
  const stats = {};
  str.split(",").forEach(pair => {
    const [k, v] = pair.split(":").map(s => s.trim());
    if (k && v !== undefined) stats[k] = isNaN(v) ? v : Number(v);
  });
  return stats;
}

function refreshIngredientSelects() {
  [document.getElementById("rec-ing1"), document.getElementById("rec-ing2")].forEach(sel => {
    const current = sel.value;
    sel.innerHTML = `<option value="">-- Pick ingredient --</option>` +
      custom.ingredients.map(i => `<option value="${i.id}">${i.name}</option>`).join("");
    sel.value = current;
  });
}

function renderCustomIngList() {
  const list = document.getElementById("custom-ing-list");
  list.innerHTML = custom.ingredients.length === 0
    ? "<li><em>No ingredients yet.</em></li>"
    : custom.ingredients.map((ing, idx) =>
        `<li>${ing.name} — ${ing.description} [${Object.entries(ing.stats).map(([k,v])=>`${k}:${v}`).join(", ")}]
         <button data-idx="${idx}" class="remove-ing">Remove</button></li>`
      ).join("");
  list.querySelectorAll(".remove-ing").forEach(btn => {
    btn.addEventListener("click", () => {
      custom.ingredients.splice(Number(btn.dataset.idx), 1);
      renderCustomIngList();
      renderCustomRecList();
      refreshIngredientSelects();
    });
  });
}

function renderCustomRecList() {
  const list = document.getElementById("custom-rec-list");
  list.innerHTML = custom.recipes.length === 0
    ? "<li><em>No recipes yet.</em></li>"
    : custom.recipes.map((rec, idx) => {
        const names = rec.inputs.map(id => {
          const ing = custom.ingredients.find(i => i.id === id);
          return ing ? ing.name : "(removed)";
        });
        return `<li>${rec.name} = ${names.join(" + ")}
          <button data-idx="${idx}" class="remove-rec">Remove</button></li>`;
      }).join("");
  list.querySelectorAll(".remove-rec").forEach(btn => {
    btn.addEventListener("click", () => {
      custom.recipes.splice(Number(btn.dataset.idx), 1);
      renderCustomRecList();
    });
  });
}

// Load current active data into the editor when opening
document.getElementById("customize-btn").addEventListener("click", () => {
  custom.ingredients = INGREDIENTS.map(i => ({ ...i, stats: { ...i.stats } }));
  custom.recipes = RECIPES.map(r => ({ ...r, stats: { ...r.stats }, inputs: [...r.inputs] }));
  ingIdCounter = custom.ingredients.length + 1;
  recIdCounter = custom.recipes.length + 1;
  renderCustomIngList();
  renderCustomRecList();
  refreshIngredientSelects();
  document.getElementById("modal-overlay").classList.remove("hidden");
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  document.getElementById("modal-overlay").classList.add("hidden");
});

document.getElementById("add-ing-btn").addEventListener("click", () => {
  const name = document.getElementById("ing-name").value.trim();
  const desc = document.getElementById("ing-desc").value.trim();
  const statsStr = document.getElementById("ing-stats").value.trim();
  if (!name) return;
  custom.ingredients.push({
    id: `ci${ingIdCounter++}`,
    name,
    type: "ingredient",
    description: desc || "",
    stats: statsStr ? parseStats(statsStr) : {}
  });
  document.getElementById("ing-name").value = "";
  document.getElementById("ing-desc").value = "";
  document.getElementById("ing-stats").value = "";
  renderCustomIngList();
  refreshIngredientSelects();
});

document.getElementById("add-rec-btn").addEventListener("click", () => {
  const name = document.getElementById("rec-name").value.trim();
  const desc = document.getElementById("rec-desc").value.trim();
  const statsStr = document.getElementById("rec-stats").value.trim();
  const ing1 = document.getElementById("rec-ing1").value;
  const ing2 = document.getElementById("rec-ing2").value;
  if (!name || !ing1 || !ing2 || ing1 === ing2) return;
  custom.recipes.push({
    id: `cr${recIdCounter++}`,
    name,
    type: "potion",
    description: desc || "",
    stats: statsStr ? parseStats(statsStr) : {},
    inputs: [ing1, ing2]
  });
  document.getElementById("rec-name").value = "";
  document.getElementById("rec-desc").value = "";
  document.getElementById("rec-stats").value = "";
  renderCustomRecList();
});

document.getElementById("apply-btn").addEventListener("click", () => {
  if (custom.ingredients.length === 0) return;
  INGREDIENTS.length = 0;
  custom.ingredients.forEach(i => INGREDIENTS.push(i));
  RECIPES.length = 0;
  custom.recipes.forEach(r => RECIPES.push(r));
  state.cauldron = [null, null];
  state.brewed = [];
  renderSatchel();
  renderCauldron();
  renderOutput();
  renderRecipeBook();
  document.getElementById("grimoire-content").innerHTML = "<p>Select an item to view details.</p>";
  setBrewMessage("");
  document.getElementById("modal-overlay").classList.add("hidden");
});
