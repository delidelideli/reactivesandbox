import data from './data.json';

export const INGREDIENTS = data.ingredients;
export const RECIPES = data.recipes;

export const MAX_CAULDRON_SLOTS = 4;
export const MIN_BREW_INGREDIENTS = 2;

export function buildCounts(ingredients) {
  return Object.fromEntries(ingredients.map(i => [i.id, 3]));
}

export function buildCauldron(slots = MAX_CAULDRON_SLOTS) {
  return Array(slots).fill(null);
}
