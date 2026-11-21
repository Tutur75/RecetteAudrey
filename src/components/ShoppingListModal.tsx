import { ArrowDownAZ, CheckSquare, Copy, Layers, Search, ShoppingCart, Square, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  CATEGORY_METADATA,
  getSlotRecipeIds,
  INGREDIENT_CATEGORIES,
  IngredientCategory,
  normalizeIngredientCategory,
  Recipe,
  WeekPlan
} from '../types/recipe';

interface ShoppingListModalProps {
  plans: WeekPlan[];
  initialWeekIndex?: 1 | 2 | 'all';
  recipes: Recipe[];
  onClose: () => void;
}

interface IngredientSource {
  recipeTitle: string;
  amount: string;
  unit: string;
  occurrences: number;
}

interface ConsolidatedItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: IngredientCategory;
  recipesCount: number;
  sources: IngredientSource[];
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  plans,
  recipes,
  onClose
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<IngredientCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'category' | 'alpha'>('category');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const recipeMap = useMemo(() => {
    const map = new Map<string, Recipe>();
    recipes.forEach((r) => map.set(r.id, r));
    return map;
  }, [recipes]);

  // Aggregate all assigned recipes across BOTH weeks (14 days, up to 4 recipes per slot) into 1 single global list
  const plannedRecipes = useMemo(() => {
    const list: Recipe[] = [];
    plans.forEach((plan) => {
      Object.values(plan.days).forEach((day) => {
        // If lunch is marked as leftover of previous night, do not double-count ingredients
        if (!day.lunchIsLeftover) {
          getSlotRecipeIds(day, 'lunch').forEach((rid) => {
            if (recipeMap.has(rid)) {
              list.push(recipeMap.get(rid)!);
            }
          });
        }
        getSlotRecipeIds(day, 'dinner').forEach((rid) => {
          if (recipeMap.has(rid)) {
            list.push(recipeMap.get(rid)!);
          }
        });
      });
    });
    return list;
  }, [plans, recipeMap]);

  // Group and consolidate ingredients by the 11 standardized Bring categories & sort alphabetically
  const categorizedItems = useMemo(() => {
    const consolidatedMap = new Map<string, ConsolidatedItem>();

    plannedRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const normCategory = normalizeIngredientCategory(ing.category, ing.name);
        const key = `${ing.name.toLowerCase().trim()}_${(ing.unit || '').toLowerCase().trim()}_${normCategory}`;
        const existing = consolidatedMap.get(key);
        const numAmount = parseFloat(ing.amount.replace(',', '.'));

        if (existing) {
          if (!isNaN(numAmount)) {
            const currentNum = parseFloat(existing.amount.replace(',', '.'));
            const newTotal = (isNaN(currentNum) ? 0 : currentNum) + numAmount;
            existing.amount = Number.isInteger(newTotal)
              ? newTotal.toString()
              : newTotal.toFixed(1).replace('.0', '');
          }
          existing.recipesCount += 1;
          const existingSource = existing.sources.find(
            (s) => s.recipeTitle === recipe.title && s.amount === ing.amount && s.unit === (ing.unit || '')
          );
          if (existingSource) {
            existingSource.occurrences += 1;
          } else {
            existing.sources.push({
              recipeTitle: recipe.title,
              amount: ing.amount,
              unit: ing.unit || '',
              occurrences: 1
            });
          }
        } else {
          consolidatedMap.set(key, {
            id: key,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit || '',
            category: normCategory,
            recipesCount: 1,
            sources: [
              {
                recipeTitle: recipe.title,
                amount: ing.amount,
                unit: ing.unit || '',
                occurrences: 1
              }
            ]
          });
        }
      });
    });

    const allItems = Array.from(consolidatedMap.values());
    const grouped = {} as Record<IngredientCategory, ConsolidatedItem[]>;

    INGREDIENT_CATEGORIES.forEach((cat) => {
      grouped[cat] = allItems
        .filter((i) => i.category === cat)
        .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    });

    return grouped;
  }, [plannedRecipes]);

  // Total list of all consolidated ingredients sorted alphabetically
  const allItemsList = useMemo(() => {
    return Object.values(categorizedItems)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
  }, [categorizedItems]);

  // Flat alphabetical filtered list (respects both searchQuery and selectedCategoryFilter)
  const filteredAllAlphaItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allItemsList.filter((item) => {
      if (selectedCategoryFilter !== 'all' && item.category !== selectedCategoryFilter) {
        return false;
      }
      if (q && !item.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [allItemsList, searchQuery, selectedCategoryFilter]);

  // Filter items by search query
  const filteredCategorizedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categorizedItems;

    const filtered = {} as Record<IngredientCategory, ConsolidatedItem[]>;
    INGREDIENT_CATEGORIES.forEach((cat) => {
      const items = categorizedItems[cat] || [];
      filtered[cat] = items.filter((item) => item.name.toLowerCase().includes(q));
    });
    return filtered;
  }, [categorizedItems, searchQuery]);

  // Count of items matching search
  const totalFilteredCount = useMemo(() => {
    return Object.values(filteredCategorizedItems).flat().length;
  }, [filteredCategorizedItems]);

  const activeCategoriesWithItems = useMemo(() => {
    return INGREDIENT_CATEGORIES.filter((cat) => (filteredCategorizedItems[cat] || []).length > 0);
  }, [filteredCategorizedItems]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Format list specifically for BRING! with categories
  const handleCopyForBring = () => {
    let text = '';
    INGREDIENT_CATEGORIES.forEach((category) => {
      const items = categorizedItems[category] || [];
      if (items.length > 0) {
        text += `[${category}]\n`;
        items.forEach((item) => {
          const qty = item.unit ? `${item.amount} ${item.unit}`.trim() : item.amount;
          text += `${item.name} (${qty})\n`;
        });
        text += `\n`;
      }
    });

    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2800);
  };

  const totalIngredientsCount = allItemsList.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header (Global 2-week List) */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Liste de courses globale (2 semaines)
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
                  14 jours
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {plannedRecipes.length} repas planifiés • {totalIngredientsCount} ingrédients consolidés
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Bring Copy Toolbar */}
        <div className="p-4 bg-white border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Module */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Vérifier un ingrédient (ex: beurre, carotte, riz...)"
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-300 bg-stone-50/70 focus:bg-white text-xs text-stone-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                title="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Toolbar: View toggle, Progression & Bring Copy Button */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            {/* View Mode Toggle: By Category (sorted A-Z) vs Global A-Z */}
            <div className="inline-flex rounded-xl bg-stone-100 p-0.5 border border-stone-200/80">
              <button
                type="button"
                onClick={() => setViewMode('category')}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'category'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Afficher par rayon (triés A–Z dans chaque rayon)"
              >
                <Layers className="w-3 h-3" />
                <span>Rayons</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('alpha')}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  viewMode === 'alpha'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Tout afficher par ordre alphabétique (idéal pour repérer les doublons)"
              >
                <ArrowDownAZ className="w-3.5 h-3.5" />
                <span>A–Z</span>
              </button>
            </div>

            <span className="text-xs text-stone-600 font-medium whitespace-nowrap">
              <strong>{checkedCount}</strong> / {totalIngredientsCount} cochés
            </span>

            {/* BRING Format Copy Button */}
            <button
              onClick={handleCopyForBring}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
              title="Copier avec les catégories [Catégorie] pour coller dans Bring!"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copié pour Bring !' : 'Copier pour Bring'}</span>
            </button>
          </div>
        </div>

        {/* Search Results Summary (when searching) */}
        {searchQuery.trim() && (
          <div className="px-6 py-2 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
            <span>
              Résultats pour « <strong>{searchQuery.trim()}</strong> » :{' '}
              <strong className="text-amber-900">{totalFilteredCount}</strong> ingrédient{totalFilteredCount > 1 ? 's' : ''} trouvé{totalFilteredCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              Voir toute la liste
            </button>
          </div>
        )}

        {/* Department Quick Filter */}
        {activeCategoriesWithItems.length > 1 && (
          <div className="px-6 py-2 bg-stone-50 border-b border-stone-200 overflow-x-auto scrollbar-none flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              Tous les rayons ({activeCategoriesWithItems.length})
            </button>
            {activeCategoriesWithItems.map((cat) => {
              const meta = CATEGORY_METADATA[cat];
              const count = (filteredCategorizedItems[cat] || []).length;
              const isSelected = selectedCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <span>{meta.emoji}</span>
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Ingredients Content by Category */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {totalIngredientsCount === 0 ? (
            <div className="py-12 text-center text-stone-600">
              <ShoppingCart className="w-12 h-12 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-semibold text-stone-800">
                Aucun plat planifié sur les 2 prochaines semaines.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Ajoutez des recettes aux jours de la Semaine 1 et Semaine 2 pour générer la liste.
              </p>
            </div>
          ) : totalFilteredCount === 0 ? (
            <div className="py-12 text-center text-stone-600">
              <Search className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-semibold text-stone-800">
                L&apos;ingrédient « {searchQuery} » n&apos;est pas présent dans la liste.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Aucun repas planifié pour les 2 semaines ne nécessite cet ingrédient.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : viewMode === 'alpha' ? (
            filteredAllAlphaItems.length === 0 ? (
              <div className="py-10 text-center text-stone-600 text-sm">
                Aucun ingrédient dans cette sélection.
              </div>
            ) : (
              <div className="space-y-2 bg-stone-50/60 p-4 rounded-2xl border border-stone-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="w-4 h-4 text-orange-700" />
                    <h4 className="font-bold text-sm text-stone-900 tracking-wide">
                      Liste alphabétique globale (A → Z)
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold border bg-white text-stone-700 border-stone-200">
                      {filteredAllAlphaItems.length} articles
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 hidden sm:inline">
                    Survolez un ingrédient pour voir sa recette d&apos;origine
                  </span>
                </div>

                <ul className="divide-y divide-stone-200/60 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
                  {filteredAllAlphaItems.map((item, idx) => {
                    const isChecked = !!checkedItems[item.id];
                    const meta = CATEGORY_METADATA[item.category];
                    const isHovered = hoveredItemId === `alpha-${item.id}`;
                    const tooltipText = item.sources
                      .map((s) => {
                        const qty = [s.amount, s.unit].filter(Boolean).join(' ');
                        const times = s.occurrences > 1 ? ` ×${s.occurrences}` : '';
                        return `${s.recipeTitle}${times}${qty ? ` (${qty})` : ''}`;
                      })
                      .join(' • ');

                    return (
                      <li
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        onMouseEnter={() => setHoveredItemId(`alpha-${item.id}`)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        title={`Recette(s) : ${tooltipText}`}
                        className={`relative first:rounded-t-xl last:rounded-b-xl flex items-center justify-between gap-2 py-2.5 px-3 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/60 text-stone-400 line-through'
                            : 'hover:bg-amber-50/50 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400 shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">{item.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/70 shrink-0 hidden sm:inline-flex items-center gap-1">
                            <span>{meta.emoji}</span>
                            <span className="truncate max-w-[120px]">{item.category}</span>
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md shrink-0">
                          {item.amount} {item.unit}
                        </span>

                        {/* Hover Provenance Tooltip */}
                        {isHovered && item.sources.length > 0 && (
                          <div
                            className={`pointer-events-none absolute left-9 z-30 max-w-xs sm:max-w-sm rounded-xl bg-stone-900 text-white px-3 py-2 shadow-xl border border-stone-700 text-xs ${
                              idx === 0 ? 'top-full mt-1' : 'bottom-full mb-1'
                            }`}
                          >
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
                              Provient de :
                            </div>
                            <ul className="space-y-0.5">
                              {item.sources.map((src, sIdx) => (
                                <li key={sIdx} className="flex items-center justify-between gap-3">
                                  <span className="font-medium text-stone-100">
                                    • {src.recipeTitle}
                                    {src.occurrences > 1 ? ` (×${src.occurrences})` : ''}
                                  </span>
                                  {(src.amount || src.unit) && (
                                    <span className="text-[11px] font-mono text-stone-300 shrink-0">
                                      {src.amount} {src.unit}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          ) : (
            INGREDIENT_CATEGORIES.map((catName) => {
              if (selectedCategoryFilter !== 'all' && selectedCategoryFilter !== catName) return null;
              const items = filteredCategorizedItems[catName] || [];
              if (items.length === 0) return null;
              const meta = CATEGORY_METADATA[catName];
              const checkedInCat = items.filter((i) => checkedItems[i.id]).length;

              return (
                <div key={catName} className="space-y-2 bg-stone-50/60 p-4 rounded-2xl border border-stone-200/80">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl leading-none">{meta.emoji}</span>
                      <h4 className="font-bold text-sm text-stone-900 tracking-wide">
                        {catName}
                      </h4>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${meta.badgeClass}`}>
                        {items.length} {items.length > 1 ? 'articles' : 'article'}
                      </span>
                    </div>
                    {checkedInCat > 0 && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {checkedInCat}/{items.length} pris
                      </span>
                    )}
                  </div>

                  <ul className="divide-y divide-stone-200/60 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
                    {items.map((item, idx) => {
                      const isChecked = !!checkedItems[item.id];
                      const isHovered = hoveredItemId === `cat-${item.id}`;
                      const tooltipText = item.sources
                        .map((s) => {
                          const qty = [s.amount, s.unit].filter(Boolean).join(' ');
                          const times = s.occurrences > 1 ? ` ×${s.occurrences}` : '';
                          return `${s.recipeTitle}${times}${qty ? ` (${qty})` : ''}`;
                        })
                        .join(' • ');

                      return (
                        <li
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          onMouseEnter={() => setHoveredItemId(`cat-${item.id}`)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          title={`Recette(s) : ${tooltipText}`}
                          className={`relative first:rounded-t-xl last:rounded-b-xl flex items-center justify-between py-2.5 px-3 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-emerald-50/60 text-stone-400 line-through'
                              : 'hover:bg-amber-50/50 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-stone-400 shrink-0" />
                            )}
                            <span className="text-sm font-medium truncate">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md shrink-0">
                            {item.amount} {item.unit}
                          </span>

                          {/* Hover Provenance Tooltip */}
                          {isHovered && item.sources.length > 0 && (
                            <div
                              className={`pointer-events-none absolute left-9 z-30 max-w-xs sm:max-w-sm rounded-xl bg-stone-900 text-white px-3 py-2 shadow-xl border border-stone-700 text-xs ${
                                idx === 0 ? 'top-full mt-1' : 'bottom-full mb-1'
                              }`}
                            >
                              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
                                Provient de :
                              </div>
                              <ul className="space-y-0.5">
                                {item.sources.map((src, sIdx) => (
                                  <li key={sIdx} className="flex items-center justify-between gap-3">
                                    <span className="font-medium text-stone-100">
                                      • {src.recipeTitle}
                                      {src.occurrences > 1 ? ` (×${src.occurrences})` : ''}
                                    </span>
                                    {(src.amount || src.unit) && (
                                      <span className="text-[11px] font-mono text-stone-300 shrink-0">
                                        {src.amount} {src.unit}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between gap-3 text-xs text-stone-500">
          <span>Tri alphabétique A–Z • Survolez un ingrédient pour voir la recette source</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
