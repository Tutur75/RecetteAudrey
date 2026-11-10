export * from './categories';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  category?: string; // One of INGREDIENT_CATEGORIES or legacy
}

export interface Recipe {
  id: string;
  title: string;
  season: Season; // Primary season for backwards compatibility
  seasons?: Season[]; // Multiple seasons (e.g. ['autumn', 'winter'])
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: string | number; // Freeform text or number (e.g. "4 pers.", "4 à 6", "8 parts")
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  notes: string;
  imageUrl: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pretty-formats servings for display (e.g., "4" -> "4 pers.", "4,25 Pers" -> "4,25 Pers").
 */
export function formatServings(servings?: string | number): string {
  if (servings === undefined || servings === null || servings === '') return '4,25 Pers';
  const str = String(servings).trim();
  if (/^\d+$/.test(str)) {
    return `${str} pers.`;
  }
  return str;
}

/**
 * Extracts a numeric portion baseline for calculations (ratio scaling, supporting decimals like 4.25 or 4,25).
 */
export function parseBaseServings(raw?: string | number): number {
  if (typeof raw === 'number' && !isNaN(raw) && raw > 0) return raw;
  if (!raw) return 4.25;
  const match = String(raw).match(/\d+([.,]\d+)?/);
  if (match) {
    const val = parseFloat(match[0].replace(',', '.'));
    if (!isNaN(val) && val > 0) return val;
  }
  return 4.25;
}

/**
 * Returns all assigned seasons for a recipe (falls back to recipe.season).
 */
export function getRecipeSeasons(recipe: { season: Season; seasons?: Season[] }): Season[] {
  if (recipe.seasons && recipe.seasons.length > 0) {
    return recipe.seasons;
  }
  return [recipe.season];
}

/**
 * Checks if a recipe matches a target season.
 */
export function recipeMatchesSeason(
  recipe: { season: Season; seasons?: Season[] },
  targetSeason: Season
): boolean {
  if (recipe.seasons && recipe.seasons.length > 0) {
    return recipe.seasons.includes(targetSeason);
  }
  return recipe.season === targetSeason;
}

export type MealSlot = 'lunch' | 'dinner';

export interface DayPlan {
  lunchRecipeId?: string | null;
  dinnerRecipeId?: string | null;
  lunchCustomText?: string | null;
  dinnerCustomText?: string | null;
  lunchIsLeftover?: boolean;
  dinnerIsLeftover?: boolean;
  lunchNotes?: string;
  dinnerNotes?: string;
}

export interface WeekPlan {
  id: string; // e.g. "week-1", "week-2"
  weekIndex: 1 | 2;
  title: string;
  startDate?: string;
  days: {
    monday: DayPlan;
    tuesday: DayPlan;
    wednesday: DayPlan;
    thursday: DayPlan;
    friday: DayPlan;
    saturday: DayPlan;
    sunday: DayPlan;
  };
  notes?: string;
  updatedAt: string;
}

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
