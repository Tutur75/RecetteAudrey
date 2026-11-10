import { CalendarPlus, ChefHat, Clock, Edit3, Flame, Heart, Lightbulb, Sparkles, Users } from 'lucide-react';
import React from 'react';
import { SEASONS } from '../lib/seasons';
import { formatServings, getRecipeSeasons, Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onAddToPlan?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onView,
  onEdit,
  onAddToPlan
}) => {
  const seasons = getRecipeSeasons(recipe);

  const difficultyColors = {
    Facile: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Moyen: 'bg-amber-100 text-amber-800 border-amber-200',
    Difficile: 'bg-rose-100 text-rose-800 border-rose-200'
  }[recipe.difficulty || 'Facile'];

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/90 hover:border-orange-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* High Definition Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Graceful fallback image if user uploaded invalid URL
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Season Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1 flex-wrap max-w-[70%]">
          {seasons.map((s) => {
            const seasonInfo = SEASONS[s] || SEASONS.autumn;
            return (
              <span
                key={s}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 text-stone-900 shadow-sm backdrop-blur-xs"
              >
                <span>{seasonInfo.emoji}</span>
                <span>{seasonInfo.label}</span>
              </span>
            );
          })}
        </div>

        {/* Difficulty Badge (Top Right) */}
        <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs backdrop-blur-xs ${difficultyColors}`}>
          {recipe.difficulty}
        </div>

        {/* Quick prep & cook time overlay at bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium drop-shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Prépa: {recipe.prepTime} min</span>
            </span>
            {recipe.cookTime > 0 && (
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Cuisson: {recipe.cookTime} min</span>
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
            <Users className="w-3.5 h-3.5 text-stone-200" />
            <span>{formatServings(recipe.servings)}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onView(recipe)}
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-orange-700 transition-colors line-clamp-2 cursor-pointer"
          >
            {recipe.title}
          </h3>

          {/* Audrey's Personal Notes snippet */}
          {recipe.notes && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="line-clamp-2 italic">
                {recipe.notes}
              </p>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                >
                  #{tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="text-[11px] text-stone-600 font-medium">
                  +{recipe.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* View recipe button */}
          <button
            onClick={() => onView(recipe)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Voir recette ({recipe.ingredients.length} ingr.)</span>
          </button>

          {/* Quick add to meal plan */}
          {onAddToPlan && (
            <button
              onClick={() => onAddToPlan(recipe)}
              title="Ajouter au planning des menus"
              className="p-2 rounded-xl text-stone-600 hover:text-orange-700 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 transition-colors cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
            </button>
          )}

          {/* Edit button */}
          <button
            onClick={() => onEdit(recipe)}
            title="Modifier tous les champs et photo"
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
