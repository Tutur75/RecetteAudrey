import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChefHat,
  Filter,
  Plus,
  RotateCcw,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { MealPlanner } from './components/MealPlanner';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeFormModal } from './components/RecipeFormModal';
import { SearchBar } from './components/SearchBar';
import { SeasonTabs } from './components/SeasonTabs';
import { TagManagerModal } from './components/TagManagerModal';
import { getCurrentSeason, SEASONS } from './lib/seasons';
import {
  deleteRecipe,
  saveMealPlan,
  saveRecipe,
  subscribeToMealPlans,
  subscribeToRecipes
} from './lib/storage';
import { Recipe, recipeMatchesSeason, Season, WeekPlan } from './types/recipe';

export default function App() {
  const currentSeasonKey = getCurrentSeason();

  // Navigation state: default to current season (Automne in November)
  const [activeTab, setActiveTab] = useState<Season | 'all' | 'planner'>(currentSeasonKey);

  // Data state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<WeekPlan[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Modals state
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null | 'new'>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  // Quick Add to Plan modal
  const [quickAddToPlanRecipe, setQuickAddToPlanRecipe] = useState<Recipe | null>(null);
  const [quickAddWeek, setQuickAddWeek] = useState<1 | 2>(1);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Subscribe to Firestore / Local Storage
  useEffect(() => {
    const unsubRecipes = subscribeToRecipes((updatedRecipes, online) => {
      setRecipes(updatedRecipes);
      setIsOnline(online);
      setIsLoading(false);
    });

    const unsubPlans = subscribeToMealPlans((updatedPlans) => {
      setMealPlans(updatedPlans);
    });

    return () => {
      unsubRecipes();
      unsubPlans();
    };
  }, []);

  // Compute available tags strictly from all recipes currently saved (auto-purges unused tags)
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach((r) => {
      r.tags?.forEach((t) => {
        const cleaned = t.trim().replace(/^#/, '');
        if (cleaned) tagSet.add(cleaned);
      });
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [recipes]);

  // Compute recipe counts per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach((r) => {
      const seen = new Set<string>();
      r.tags?.forEach((t) => {
        const cleaned = t.trim().replace(/^#/, '');
        if (cleaned && !seen.has(cleaned)) {
          seen.add(cleaned);
          counts[cleaned] = (counts[cleaned] || 0) + 1;
        }
      });
    });
    return counts;
  }, [recipes]);

  // Delete a tag from all recipes in the notebook (which auto-purges it completely)
  const handleDeleteTagGlobally = async (tagToDelete: string) => {
    const cleanTag = tagToDelete.trim().replace(/^#/, '');
    const affected = recipes.filter((r) =>
      r.tags?.some((t) => t.trim().replace(/^#/, '') === cleanTag)
    );

    if (affected.length === 0) return;

    for (const r of affected) {
      const updatedTags = (r.tags || []).filter(
        (t) => t.trim().replace(/^#/, '') !== cleanTag
      );
      await saveRecipe({ ...r, tags: updatedTags });
    }

    setRecipes((prev) =>
      prev.map((r) => {
        if (!r.tags?.some((t) => t.trim().replace(/^#/, '') === cleanTag)) return r;
        return {
          ...r,
          tags: (r.tags || []).filter((t) => t.trim().replace(/^#/, '') !== cleanTag)
        };
      })
    );

    setSelectedTags((prev) => prev.filter((t) => t !== cleanTag));
    showToast(`Tag #${cleanTag} supprimé de ${affected.length} recette${affected.length > 1 ? 's' : ''}.`);
  };

  // Automatically remove any tag filter that is no longer present in any recipe
  useEffect(() => {
    setSelectedTags((prev) => prev.filter((t) => availableTags.includes(t)));
  }, [availableTags]);

  // Toggle a tag filter
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setMaxPrepTime(null);
    setSelectedTags([]);
  };

  // Filter recipes based on active season, search query, prep time, tags
  const filteredRecipes = useMemo(() => {
    if (activeTab === 'planner') return [];

    return recipes.filter((r) => {
      // 1. Season filter (skip if 'all' is selected)
      if (activeTab !== 'all' && !recipeMatchesSeason(r, activeTab)) return false;

      // 2. Prep time filter
      if (maxPrepTime !== null && r.prepTime > maxPrepTime) return false;

      // 3. Tags filter (must include all selected tags)
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((st) => r.tags?.includes(st));
        if (!hasAllTags) return false;
      }

      // 4. Text search in title, ingredients, notes, tags
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = r.title.toLowerCase().includes(q);
        const inNotes = r.notes?.toLowerCase().includes(q) || false;
        const inTags = r.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        const inIngredients = r.ingredients?.some((ing) =>
          ing.name.toLowerCase().includes(q)
        ) || false;

        if (!inTitle && !inNotes && !inTags && !inIngredients) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, activeTab, searchQuery, maxPrepTime, selectedTags]);

  // Handle Save Recipe
  const handleSaveRecipe = async (saved: Recipe) => {
    await saveRecipe(saved);
    showToast(
      editingRecipe === 'new'
        ? `Recette "${saved.title}" ajoutée au carnet !`
        : `Recette "${saved.title}" mise à jour !`
    );
    setEditingRecipe(null);
    if (viewingRecipe?.id === saved.id) {
      setViewingRecipe(saved);
    }
  };

  // Handle Delete Recipe (Permanent deletion)
  const handleDeleteRecipe = async (recipeId: string) => {
    // 1. Immediately remove from active state so it disappears from the list with zero lag
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    setEditingRecipe(null);
    setViewingRecipe(null);

    // 2. Perform permanent deletion in storage + Firestore + clean from meal plans
    await deleteRecipe(recipeId);
    showToast('Recette définitivement supprimée du carnet.');
  };

  // Handle Save Meal Plan
  const handleSaveMealPlan = async (plan: WeekPlan) => {
    setMealPlans((prev) => {
      const p1 = plan.weekIndex === 1 ? plan : (prev.find((p) => p.weekIndex === 1) || plan);
      const p2 = plan.weekIndex === 2 ? plan : (prev.find((p) => p.weekIndex === 2) || plan);
      return [p1, p2];
    });
    await saveMealPlan(plan);
    showToast(`Planning de la ${plan.title} enregistré !`);
  };

  // Quick assign recipe to plan
  const handleQuickAssignToPlan = async (
    recipe: Recipe,
    weekIndex: 1 | 2,
    dayKey: string,
    slot: 'lunch' | 'dinner'
  ) => {
    const p1 = mealPlans.find((p) => p.weekIndex === 1) || mealPlans[0];
    const p2 = mealPlans.find((p) => p.weekIndex === 2) || mealPlans[1] || mealPlans[0];
    const targetPlan = weekIndex === 1 ? p1 : p2;
    if (!targetPlan) return;

    const currentDay = (targetPlan.days as any)[dayKey] || {};
    const updatedDay = {
      ...currentDay,
      [slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId']: recipe.id,
      [slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText']: null
    };

    const updatedPlan: WeekPlan = {
      ...targetPlan,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      title: weekIndex === 1 ? 'Semaine prochaine (+1)' : 'Semaine suivante (+2)',
      days: {
        ...targetPlan.days,
        [dayKey]: updatedDay
      },
      updatedAt: new Date().toISOString()
    };

    await handleSaveMealPlan(updatedPlan);
    setQuickAddToPlanRecipe(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-orange-200 selection:text-orange-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900 text-white text-sm font-medium shadow-2xl border border-stone-800 animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onNewRecipe={() => setEditingRecipe('new')}
        onOpenPlanner={() => setActiveTab('planner')}
        activeTab={activeTab}
        isOnline={isOnline}
      />



      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Season & Planner Tabs */}
        <SeasonTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          recipes={recipes}
        />

        {/* Tab Content: Season View vs Meal Planner */}
        {activeTab === 'planner' ? (
          <MealPlanner
            mealPlans={mealPlans}
            recipes={recipes}
            onSavePlan={handleSaveMealPlan}
            onViewRecipe={(r) => setViewingRecipe(r)}
          />
        ) : (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              maxPrepTime={maxPrepTime}
              onMaxPrepTimeChange={setMaxPrepTime}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              availableTags={availableTags}
              tagCounts={tagCounts}
              onOpenTagManager={() => setIsTagManagerOpen(true)}
              totalResults={filteredRecipes.length}
              onResetFilters={handleResetFilters}
            />

            {/* Recipe Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-96 rounded-2xl bg-white border border-stone-200 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onView={(r) => setViewingRecipe(r)}
                    onEdit={(r) => setEditingRecipe(r)}
                    onAddToPlan={(r) => setQuickAddToPlanRecipe(r)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="py-16 text-center bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Aucune recette trouvée
                  </h3>
                  <p className="text-sm text-stone-700 max-w-md mx-auto mt-1">
                    Essayez d&apos;élargir vos filtres de recherche ou ajoutez une nouvelle recette
                    {activeTab === 'all' ? ' au carnet !' : ` de ${SEASONS[activeTab].label} au carnet !`}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser les filtres</span>
                  </button>
                  <button
                    onClick={() => setEditingRecipe('new')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer une recette</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span className="font-serif font-bold text-stone-900">
              Carnet de Recettes d&apos;Audrey
            </span>
            <span>• Les 4 Saisons</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Base Firebase &amp; Stockage local</span>
            <span>•</span>
            <span>Menus 2 semaines synchronisés</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {viewingRecipe && (
        <RecipeDetailModal
          recipe={viewingRecipe}
          onClose={() => setViewingRecipe(null)}
          onEdit={(r) => {
            setViewingRecipe(null);
            setEditingRecipe(r);
          }}
          onAddToPlan={(r) => setQuickAddToPlanRecipe(r)}
        />
      )}

      {/* Edit / New Recipe Form Modal */}
      {editingRecipe && (
        <RecipeFormModal
          recipe={editingRecipe === 'new' ? null : editingRecipe}
          initialSeason={activeTab === 'planner' || activeTab === 'all' ? currentSeasonKey : activeTab}
          existingTags={
            editingRecipe === 'new'
              ? availableTags
              : Array.from(
                  new Set(
                    recipes
                      .filter((r) => r.id !== editingRecipe.id)
                      .flatMap((r) => r.tags || [])
                      .map((t) => t.trim().replace(/^#/, ''))
                      .filter(Boolean)
                  )
                ).sort((a, b) => a.localeCompare(b, 'fr'))
          }
          onSave={handleSaveRecipe}
          onDelete={handleDeleteRecipe}
          onClose={() => setEditingRecipe(null)}
        />
      )}

      {/* Quick Add To Plan Picker Dialog (Only empty days) */}
      {quickAddToPlanRecipe && (() => {
        const PLAN_DAYS = [
          { key: 'monday', label: 'Lundi' },
          { key: 'tuesday', label: 'Mardi' },
          { key: 'wednesday', label: 'Mercredi' },
          { key: 'thursday', label: 'Jeudi' },
          { key: 'friday', label: 'Vendredi' },
          { key: 'saturday', label: 'Samedi' },
          { key: 'sunday', label: 'Dimanche' }
        ];

        const targetPlan =
          mealPlans.find((p) => p.weekIndex === quickAddWeek) ||
          mealPlans[0] || { days: {} };

        // Collect only slots that do not have a recipe yet
        const emptySlots: {
          dayKey: string;
          dayLabel: string;
          slot: 'lunch' | 'dinner';
          slotLabel: string;
          icon: string;
        }[] = [];

        PLAN_DAYS.forEach((d) => {
          const dayData = (targetPlan.days as any)?.[d.key] || {};
          if (!dayData.lunchRecipeId) {
            emptySlots.push({
              dayKey: d.key,
              dayLabel: d.label,
              slot: 'lunch',
              slotLabel: 'Midi (Déjeuner)',
              icon: '☀️'
            });
          }
          if (!dayData.dinnerRecipeId) {
            emptySlots.push({
              dayKey: d.key,
              dayLabel: d.label,
              slot: 'dinner',
              slotLabel: 'Soir (Dîner)',
              icon: '🌙'
            });
          }
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={quickAddToPlanRecipe.imageUrl}
                  alt={quickAddToPlanRecipe.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider block">
                    Ajouter au planning
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm line-clamp-1">
                    {quickAddToPlanRecipe.title}
                  </h4>
                </div>
              </div>

              {/* Week switcher for upcoming 2 weeks */}
              <div className="flex p-1 rounded-xl bg-stone-100 border border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setQuickAddWeek(1)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    quickAddWeek === 1
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Semaine prochaine (+1)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddWeek(2)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    quickAddWeek === 2
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Semaine suivante (+2)
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Créneaux libres pour la {quickAddWeek === 1 ? 'Semaine prochaine (+1)' : 'Semaine suivante (+2)'} :</span>
                <span className="font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                  {emptySlots.length} disponible{emptySlots.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* List of empty slots ONLY */}
              <div className="max-h-60 overflow-y-auto space-y-2 text-xs pr-1">
                {emptySlots.length === 0 ? (
                  <div className="p-4 text-center rounded-2xl bg-stone-50 border border-stone-200 text-stone-600">
                    <p className="font-semibold text-stone-800">
                      Tous les repas de la {quickAddWeek === 1 ? 'Semaine prochaine (+1)' : 'Semaine suivante (+2)'} sont déjà complétés !
                    </p>
                    <p className="mt-1 text-[11px]">
                      Basculez sur la {quickAddWeek === 1 ? 'Semaine suivante (+2)' : 'Semaine prochaine (+1)'} ci-dessus pour planifier ce plat.
                    </p>
                  </div>
                ) : (
                  emptySlots.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleQuickAssignToPlan(
                          quickAddToPlanRecipe,
                          quickAddWeek,
                          item.dayKey,
                          item.slot
                        )
                      }
                      className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50 font-medium text-stone-800 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>
                          <strong className="font-semibold">{item.dayLabel}</strong> — {item.slotLabel}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        Libre +
                      </span>
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddToPlanRecipe(null);
                    setActiveTab('planner');
                  }}
                  className="text-xs font-semibold text-orange-700 hover:underline"
                >
                  Ouvrir le planning complet
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddToPlanRecipe(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tag Manager Modal */}
      {isTagManagerOpen && (
        <TagManagerModal
          availableTags={availableTags}
          tagCounts={tagCounts}
          onDeleteTagGlobally={handleDeleteTagGlobally}
          onClose={() => setIsTagManagerOpen(false)}
        />
      )}
    </div>
  );
}
