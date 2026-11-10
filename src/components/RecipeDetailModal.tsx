import {
  CalendarPlus,
  Check,
  ChefHat,
  Clock,
  Edit3,
  Flame,
  Lightbulb,
  Minus,
  Plus,
  Printer,
  Share2,
  Users,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { SEASONS } from '../lib/seasons';
import {
  CATEGORY_METADATA,
  formatServings,
  getRecipeSeasons,
  normalizeIngredientCategory,
  parseBaseServings,
  Recipe
} from '../types/recipe';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onAddToPlan?: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onEdit,
  onAddToPlan
}) => {
  if (!recipe) return null;

  const baseServings = parseBaseServings(recipe.servings);
  const [currentServings, setCurrentServings] = useState<number>(baseServings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const seasonInfo = SEASONS[recipe.season] || SEASONS.autumn;
  const ratio = currentServings / baseServings;

  // Scaled amount calculation helper
  const formatScaledAmount = (rawAmount: string) => {
    const num = parseFloat(rawAmount.replace(',', '.'));
    if (isNaN(num)) return rawAmount;
    const scaled = num * ratio;
    // Pretty round to 1 decimal if needed
    return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1).replace('.0', '');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handlePrint}
            title="Imprimer cette recette"
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md backdrop-blur-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(recipe)}
            title="Modifier la recette"
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-orange-700 shadow-md backdrop-blur-xs transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 shadow-md backdrop-blur-xs transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Header Image with Season Badge */}
          <div className="relative h-64 sm:h-80 w-full bg-stone-100">
            <img
              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80'}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              {/* Season Pills */}
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                {getRecipeSeasons(recipe).map((s) => {
                  const sInfo = SEASONS[s] || SEASONS.autumn;
                  return (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-stone-900 shadow-md"
                    >
                      <span>{sInfo.emoji}</span>
                      <span>Recette de {sInfo.label}</span>
                    </span>
                  );
                })}
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                {recipe.title}
              </h2>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-3">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white border border-white/30 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-200 border-b border-stone-200 bg-stone-50/70 py-4 px-6 text-center text-stone-800">
            <div>
              <span className="text-xs text-stone-700 uppercase tracking-wider block font-medium">Préparation</span>
              <span className="text-base font-semibold text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-orange-600" />
                {recipe.prepTime} min
              </span>
            </div>
            <div>
              <span className="text-xs text-stone-700 uppercase tracking-wider block font-medium">Cuisson</span>
              <span className="text-base font-semibold text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-4 h-4 text-amber-600" />
                {recipe.cookTime || 0} min
              </span>
            </div>
            <div>
              <span className="text-xs text-stone-700 uppercase tracking-wider block font-medium">Difficulté</span>
              <span className="text-base font-semibold text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                <ChefHat className="w-4 h-4 text-emerald-600" />
                {recipe.difficulty}
              </span>
            </div>
            <div>
              <span className="text-xs text-stone-700 uppercase tracking-wider block font-medium">Portions</span>
              {/* Interactive Portions Scaler */}
              <div className="inline-flex items-center gap-2 mt-0.5 bg-white px-2 py-0.5 rounded-lg border border-stone-200 shadow-2xs">
                <button
                  onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                  className="text-stone-500 hover:text-stone-800 p-0.5"
                  title="Diminuer les portions"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-stone-900 text-sm">
                  {currentServings === baseServings
                    ? formatServings(recipe.servings)
                    : `${currentServings} pers.`}
                </span>
                <button
                  onClick={() => setCurrentServings((s) => Math.min(20, s + 1))}
                  className="text-stone-500 hover:text-stone-800 p-0.5"
                  title="Augmenter les portions"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Audrey's Secret Note */}
          {recipe.notes && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-amber-950 text-sm">
                  Le carnet &amp; conseils d&apos;Audrey
                </h4>
                <p className="text-sm text-amber-900/90 mt-0.5 leading-relaxed">
                  {recipe.notes}
                </p>
              </div>
            </div>
          )}

          {/* Content: Ingredients & Instructions */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Ingredients Column (5 cols) */}
            <div className="md:col-span-5 bg-stone-50/80 p-5 rounded-2xl border border-stone-200/90">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>Ingrédients</span>
                  <span className="text-xs font-normal text-stone-700">
                    ({recipe.ingredients.length})
                  </span>
                </h3>
                <span className="text-xs text-stone-700 italic">
                  Pour {currentServings} pers.
                </span>
              </div>

              <p className="text-[11px] text-stone-600 mb-3">
                Cochez les ingrédients au fur et à mesure de votre préparation :
              </p>

              <ul className="space-y-2.5">
                {recipe.ingredients.map((ing) => {
                  const isChecked = !!checkedIngredients[ing.id];
                  const scaledAmount = formatScaledAmount(ing.amount);
                  const normCat = normalizeIngredientCategory(ing.category, ing.name);
                  const catMeta = CATEGORY_METADATA[normCat];

                  return (
                    <li
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl text-sm cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50 text-stone-400 line-through'
                          : 'hover:bg-white text-stone-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium">{ing.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium border border-stone-200/80">
                            {catMeta.emoji} {normCat}
                          </span>
                        </div>
                        <span className="text-stone-700 shrink-0 font-mono text-xs">
                          {scaledAmount} {ing.unit}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Instructions Column (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-200 flex items-center gap-2">
                <span>Étapes de préparation</span>
                <span className="text-xs font-normal text-stone-700">
                  ({recipe.instructions.length} étapes)
                </span>
              </h3>

              <ol className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 group">
                    <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-800 font-bold text-xs flex items-center justify-center shrink-0 border border-orange-200 mt-0.5 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-base text-stone-800 leading-relaxed flex-1 pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              {/* Action Buttons in Modal Bottom */}
              <div className="pt-6 border-t border-stone-200 flex items-center justify-between gap-3 flex-wrap">
                {onAddToPlan && (
                  <button
                    onClick={() => {
                      onAddToPlan(recipe);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-800 bg-orange-100 hover:bg-orange-200 transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Ajouter aux menus de la semaine</span>
                  </button>
                )}

                <button
                  onClick={() => onEdit(recipe)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white ml-auto transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modifier la recette</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
