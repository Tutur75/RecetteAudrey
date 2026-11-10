export const INGREDIENT_CATEGORIES = [
  'Fruits & Légumes',
  'Pain & Pâtisserie',
  'Laiterie & Fromage',
  'Viande & Poisson',
  'Ingrédients & Épices',
  'Pâtes Riz & Produits secs',
  'Conserves & Plats préparés',
  'Surgelés',
  'Snacks & Gouters',
  'Boissons',
  'Alcools & Bières'
] as const;

export type IngredientCategory = typeof INGREDIENT_CATEGORIES[number];

export interface CategoryMetadata {
  label: IngredientCategory;
  emoji: string;
  badgeClass: string;
}

export const CATEGORY_METADATA: Record<IngredientCategory, CategoryMetadata> = {
  'Fruits & Légumes': {
    label: 'Fruits & Légumes',
    emoji: '🥦',
    badgeClass: 'text-emerald-800 bg-emerald-50 border-emerald-200'
  },
  'Pain & Pâtisserie': {
    label: 'Pain & Pâtisserie',
    emoji: '🥖',
    badgeClass: 'text-amber-900 bg-amber-50 border-amber-200'
  },
  'Laiterie & Fromage': {
    label: 'Laiterie & Fromage',
    emoji: '🧀',
    badgeClass: 'text-yellow-900 bg-yellow-50 border-yellow-200'
  },
  'Viande & Poisson': {
    label: 'Viande & Poisson',
    emoji: '🥩',
    badgeClass: 'text-rose-900 bg-rose-50 border-rose-200'
  },
  'Ingrédients & Épices': {
    label: 'Ingrédients & Épices',
    emoji: '🧂',
    badgeClass: 'text-orange-900 bg-orange-50 border-orange-200'
  },
  'Pâtes Riz & Produits secs': {
    label: 'Pâtes Riz & Produits secs',
    emoji: '🌾',
    badgeClass: 'text-amber-800 bg-stone-100 border-stone-200'
  },
  'Conserves & Plats préparés': {
    label: 'Conserves & Plats préparés',
    emoji: '🥫',
    badgeClass: 'text-stone-800 bg-stone-100 border-stone-300'
  },
  'Surgelés': {
    label: 'Surgelés',
    emoji: '🧊',
    badgeClass: 'text-cyan-900 bg-cyan-50 border-cyan-200'
  },
  'Snacks & Gouters': {
    label: 'Snacks & Gouters',
    emoji: '🍪',
    badgeClass: 'text-pink-900 bg-pink-50 border-pink-200'
  },
  'Boissons': {
    label: 'Boissons',
    emoji: '🧃',
    badgeClass: 'text-blue-900 bg-blue-50 border-blue-200'
  },
  'Alcools & Bières': {
    label: 'Alcools & Bières',
    emoji: '🍷',
    badgeClass: 'text-purple-900 bg-purple-50 border-purple-200'
  }
};

/**
 * Normalizes any category string (including legacy values like "Légumes", "Frais", "Boucherie")
 * into one of the 11 official categories.
 */
export function normalizeIngredientCategory(
  rawCategory?: string | null,
  ingredientName?: string
): IngredientCategory {
  if (rawCategory && INGREDIENT_CATEGORIES.includes(rawCategory as IngredientCategory)) {
    return rawCategory as IngredientCategory;
  }

  const catLower = (rawCategory || '').toLowerCase().trim();
  const nameLower = (ingredientName || '').toLowerCase().trim();

  // Explicit mappings from legacy categories
  if (catLower.includes('légume') || catLower.includes('fruit')) {
    return 'Fruits & Légumes';
  }

  if (catLower.includes('boucherie') || catLower.includes('viande') || catLower.includes('poisson') || catLower.includes('poissonnerie')) {
    return 'Viande & Poisson';
  }

  if (catLower.includes('pain') || catLower.includes('boulangerie') || catLower.includes('pâtisserie')) {
    return 'Pain & Pâtisserie';
  }

  if (catLower.includes('surgelé') || catLower.includes('glace')) {
    return 'Surgelés';
  }

  if (catLower.includes('boisson') && !catLower.includes('alcool')) {
    return 'Boissons';
  }

  if (catLower.includes('alcool') || catLower.includes('bière') || catLower.includes('vin')) {
    return 'Alcools & Bières';
  }

  if (catLower.includes('snack') || catLower.includes('gouter') || catLower.includes('biscuit')) {
    return 'Snacks & Gouters';
  }

  if (catLower.includes('conserve')) {
    return 'Conserves & Plats préparés';
  }

  if (
    catLower.includes('céréale') ||
    catLower.includes('sec') ||
    catLower.includes('pâtes') ||
    catLower.includes('pates') ||
    catLower.includes('riz')
  ) {
    return 'Pâtes Riz & Produits secs';
  }

  // Check legacy 'Frais' or detect dairy products by name
  if (
    catLower === 'frais' ||
    nameLower.includes('beurre') ||
    nameLower.includes('crème') ||
    nameLower.includes('lait') ||
    nameLower.includes('fromage') ||
    nameLower.includes('reblochon') ||
    nameLower.includes('comté') ||
    nameLower.includes('gruyère') ||
    nameLower.includes('parmesan') ||
    nameLower.includes('mozzarella') ||
    nameLower.includes('chèvre') ||
    nameLower.includes('ricotta') ||
    nameLower.includes('yaourt') ||
    nameLower.includes('oeuf') ||
    nameLower.includes('œuf')
  ) {
    return 'Laiterie & Fromage';
  }

  // Check alcohol by name (e.g., vin blanc, cidre)
  if (
    nameLower.includes('vin blanc') ||
    nameLower.includes('vin rouge') ||
    nameLower.includes('bière') ||
    nameLower.includes('cidre') ||
    nameLower.includes('rhum') ||
    nameLower.includes('cognac')
  ) {
    return 'Alcools & Bières';
  }

  // Check bread by name
  if (
    nameLower.includes('pain') ||
    nameLower.includes('baguette') ||
    nameLower.includes('brioche') ||
    nameLower.includes('tranche de pain')
  ) {
    return 'Pain & Pâtisserie';
  }

  // Check dry products / pasta / rice / cereals by name
  if (
    nameLower.includes('riz') ||
    nameLower.includes('pâtes') ||
    nameLower.includes('pates') ||
    nameLower.includes('spaghetti') ||
    nameLower.includes('tagliatelle') ||
    nameLower.includes('penne') ||
    nameLower.includes('coquillette') ||
    nameLower.includes('lasagne') ||
    nameLower.includes('farine') ||
    nameLower.includes('semoule') ||
    nameLower.includes('quinoa') ||
    nameLower.includes('lentille') ||
    nameLower.includes('flocons')
  ) {
    return 'Pâtes Riz & Produits secs';
  }

  // Check canned products by name
  if (
    nameLower.includes('conserve') ||
    nameLower.includes('en boîte') ||
    nameLower.includes('pulpe de tomate') ||
    nameLower.includes('tomates concassées') ||
    nameLower.includes('pois chiches cuits')
  ) {
    return 'Conserves & Plats préparés';
  }

  // Default to ingredients & spices
  return 'Ingrédients & Épices';
}
