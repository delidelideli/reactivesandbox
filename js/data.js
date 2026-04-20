const INGREDIENTS = [
  { id: "i1", name: "Nightshade", type: "ingredient", stats: { potency: 8, toxicity: 5 }, description: "A dark berry with potent properties." },
  { id: "i2", name: "Silverleaf", type: "ingredient", stats: { potency: 4, toxicity: 1 }, description: "A shimmering leaf known for healing." },
  { id: "i3", name: "Embercap", type: "ingredient", stats: { potency: 6, toxicity: 2 }, description: "A mushroom that glows faintly red." },
  { id: "i4", name: "Frostroot", type: "ingredient", stats: { potency: 5, toxicity: 0 }, description: "A cold root that chills to the touch." },
  { id: "i5", name: "Voidmoss", type: "ingredient", stats: { potency: 9, toxicity: 8 }, description: "Grows only in places of great darkness." },
  { id: "i6", name: "Sunpetal", type: "ingredient", stats: { potency: 3, toxicity: 0 }, description: "Warm and fragrant, used in light brews." }
];

const RECIPES = [
  { id: "p1", name: "Potion of Shadow", inputs: ["i1", "i5"], stats: { potency: 17, toxicity: 13 }, description: "A dangerous brew that shrouds the drinker in darkness." },
  { id: "p2", name: "Healing Draught", inputs: ["i2", "i6"], stats: { potency: 7, toxicity: 1 }, description: "A gentle remedy that mends wounds." },
  { id: "p3", name: "Fire Tincture", inputs: ["i3", "i6"], stats: { potency: 9, toxicity: 2 }, description: "Burns with inner warmth." },
  { id: "p4", name: "Frost Elixir", inputs: ["i4", "i2"], stats: { potency: 9, toxicity: 1 }, description: "Slows the blood and sharpens the mind." }
];
