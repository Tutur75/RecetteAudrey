import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChefHat,
  Filter,
  Plus,
  RotateCcw,
  Salad,
  Search,
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
import { SideFormModal } from './components/SideFormModal';
import { TagManagerModal } from './components/TagManagerModal';
import { getCurrentSeason, SEASONS } from './lib/seasons';
import {
  deleteRecipe,
  saveMealPlan,
  saveRecipe,
  subscribeToMealPlans,
  subscribeToRecipes
} from './lib/storage';
import { DEFAULT_RECIPE_IMAGE, getRecipeImageUrl, getSlotRecipeIds, isDefaultRecipeImage, MAX_RECIPES_PER_SLOT, Recipe, recipeMatchesSeason, Season, WeekPlan } from './types/recipe';

export default function App() {
  const currentSeasonKey = getCurrentSeason();

  // Navigation state: default to current season
  const [activeTab, setActiveTab] = useState<Season | 'all' | 'sides' | 'planner'>(currentSeasonKey);

  // Data state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<WeekPlan[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sideSearchQuery, setSideSearchQuery] = useState('');
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Modals state
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null | 'new'>(null);
  const [duplicatingRecipe, setDuplicatingRecipe] = useState<Recipe | null>(null);
  const [editingSide, setEditingSide] = useState<Recipe | null | 'new'>(null);
  const [duplicatingSide, setDuplicatingSide] = useState<Recipe | null>(null);
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

  // Separate main seasonal recipes from Accompagnements
  const mainRecipes = useMemo(() => recipes.filter((r) => !r.isSide), [recipes]);
  const sideRecipes = useMemo(() => recipes.filter((r) => !!r.isSide), [recipes]);

  // Compute available tags strictly from main recipes currently saved (auto-purges unused tags)
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    mainRecipes.forEach((r) => {
      r.tags?.forEach((t) => {
        const cleaned = t.trim().replace(/^#/, '');
        if (cleaned) tagSet.add(cleaned);
      });
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [mainRecipes]);

  // Compute recipe counts per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mainRecipes.forEach((r) => {
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
  }, [mainRecipes]);

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

  // Filter main recipes based on active season, search query, prep time, tags
  const filteredRecipes = useMemo(() => {
    if (activeTab === 'planner' || activeTab === 'sides') return [];

    return mainRecipes.filter((r) => {
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
  }, [mainRecipes, activeTab, searchQuery, maxPrepTime, selectedTags]);

  // Filter Accompagnements
  const filteredSides = useMemo(() => {
    if (activeTab !== 'sides') return [];
    const q = sideSearchQuery.toLowerCase().trim();
    if (!q) return sideRecipes;
    return sideRecipes.filter((r) => {
      const inTitle = r.title.toLowerCase().includes(q);
      const inNotes = r.notes?.toLowerCase().includes(q) || false;
      const inIngredients = r.ingredients?.some((ing) => ing.name.toLowerCase().includes(q)) || false;
      return inTitle || inNotes || inIngredients;
    });
  }, [sideRecipes, activeTab, sideSearchQuery]);

  // Handle Save Recipe or Side
  const handleSaveRecipe = async (saved: Recipe) => {
    await saveRecipe(saved);
    if (saved.isSide) {
      showToast(
        duplicatingSide
          ? `Accompagnement "${saved.title}" dupliqué !`
          : editingSide === 'new'
          ? `Accompagnement "${saved.title}" ajouté !`
          : `Accompagnement "${saved.title}" mis à jour !`
      );
    } else {
      showToast(
        duplicatingRecipe
          ? `Recette "${saved.title}" dupliquée au carnet !`
          : editingRecipe === 'new'
          ? `Recette "${saved.title}" ajoutée au carnet !`
          : `Recette "${saved.title}" mise à jour !`
      );
    }
    setEditingRecipe(null);
    setDuplicatingRecipe(null);
    setEditingSide(null);
    setDuplicatingSide(null);
    if (viewingRecipe?.id === saved.id) {
      setViewingRecipe(saved);
    }
  };

  // Handle Edit or Duplicate routing (regular recipe vs side)
  const handleEditItem = (item: Recipe) => {
    if (item.isSide) {
      setEditingSide(item);
    } else {
      setEditingRecipe(item);
    }
  };

  const handleDuplicateItem = (item: Recipe) => {
    if (item.isSide) {
      setDuplicatingSide(item);
    } else {
      setDuplicatingRecipe(item);
    }
  };

  // Handle Delete Recipe or Side (Permanent deletion)
  const handleDeleteRecipe = async (recipeId: string) => {
    // 1. Immediately remove from active state so it disappears from the list with zero lag
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    setEditingRecipe(null);
    setDuplicatingRecipe(null);
    setEditingSide(null);
    setDuplicatingSide(null);
    setViewingRecipe(null);

    // 2. Perform permanent deletion in storage + Firestore + clean from meal plans
    await deleteRecipe(recipeId);
    showToast('Élément définitivement supprimé du carnet.');
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
    const existingIds = getSlotRecipeIds(currentDay, slot);
    if (existingIds.length >= MAX_RECIPES_PER_SLOT) {
      showToast(`Maximum ${MAX_RECIPES_PER_SLOT} recettes par repas atteint.`);
      setQuickAddToPlanRecipe(null);
      return;
    }
    const nextIds = existingIds.includes(recipe.id) ? existingIds : [...existingIds, recipe.id];
    const updatedDay = {
      ...currentDay,
      [slot === 'lunch' ? 'lunchRecipeIds' : 'dinnerRecipeIds']: nextIds,
      [slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId']: nextIds[0] || null,
      [slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText']: null,
      [slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover']: false
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
        {/* Season, Accompagnements & Planner Tabs */}
        <SeasonTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          recipes={recipes}
          onNewSide={() => setEditingSide('new')}
        />

        {/* Tab Content: Planner vs Sides vs Recipes */}
        {activeTab === 'planner' ? (
          <MealPlanner
            mealPlans={mealPlans}
            recipes={recipes}
            onSavePlan={handleSaveMealPlan}
            onViewRecipe={(r) => setViewingRecipe(r)}
          />
        ) : activeTab === 'sides' ? (
          <div className="space-y-6">
            {/* Simple Search Bar for Accompagnements */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sideSearchQuery}
                  onChange={(e) => setSideSearchQuery(e.target.value)}
                  placeholder="Rechercher un accompagnement ou ingrédient (riz, frites, saumon...)"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm text-stone-900"
                />
              </div>
              <span className="text-xs font-medium text-stone-600 px-2 shrink-0">
                {filteredSides.length} élément{filteredSides.length > 1 ? 's' : ''}
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-80 rounded-2xl bg-white border border-stone-200 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredSides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSides.map((side) => (
                  <RecipeCard
                    key={side.id}
                    recipe={side}
                    onView={(r) => setViewingRecipe(r)}
                    onEdit={handleEditItem}
                    onDuplicate={handleDuplicateItem}
                    onAddToPlan={(r) => setQuickAddToPlanRecipe(r)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-14 text-center bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Salad className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Aucun accompagnement trouvé
                  </h3>
                  <p className="text-sm text-stone-600 max-w-md mx-auto mt-1">
                    Ajoutez facilement vos accompagnements simples (riz, pâtes, légumes, grillades...) avec photo et ingrédients.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-1">
                  {sideSearchQuery && (
                    <button
                      onClick={() => setSideSearchQuery('')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Réinitialiser</span>
                    </button>
                  )}
                  <button
                    onClick={() => setEditingSide('new')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouvel accompagnement</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
                    onEdit={handleEditItem}
                    onDuplicate={handleDuplicateItem}
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
            handleEditItem(r);
          }}
          onDuplicate={(r) => {
            setViewingRecipe(null);
            handleDuplicateItem(r);
          }}
          onAddToPlan={(r) => setQuickAddToPlanRecipe(r)}
        />
      )}

      {/* Edit / New / Duplicate Recipe Form Modal */}
      {(editingRecipe || duplicatingRecipe) && (
        <RecipeFormModal
          recipe={
            duplicatingRecipe
              ? duplicatingRecipe
              : editingRecipe === 'new'
              ? null
              : editingRecipe
          }
          isDuplicate={!!duplicatingRecipe}
          initialSeason={
            activeTab === 'planner' || activeTab === 'all' || activeTab === 'sides'
              ? currentSeasonKey
              : activeTab
          }
          existingTags={
            editingRecipe === 'new' || duplicatingRecipe
              ? availableTags
              : Array.from(
                  new Set(
                    mainRecipes
                      .filter((r) => r.id !== (editingRecipe as Recipe).id)
                      .flatMap((r) => r.tags || [])
                      .map((t) => t.trim().replace(/^#/, ''))
                      .filter(Boolean)
                  )
                ).sort((a, b) => a.localeCompare(b, 'fr'))
          }
          onSave={handleSaveRecipe}
          onDelete={handleDeleteRecipe}
          onClose={() => {
            setEditingRecipe(null);
            setDuplicatingRecipe(null);
          }}
        />
      )}

      {/* Edit / New / Duplicate Accompagnement Form Modal */}
      {(editingSide || duplicatingSide) && (
        <SideFormModal
          side={
            duplicatingSide
              ? duplicatingSide
              : editingSide === 'new'
              ? null
              : editingSide
          }
          isDuplicate={!!duplicatingSide}
          onSave={handleSaveRecipe}
          onDelete={handleDeleteRecipe}
          onClose={() => {
            setEditingSide(null);
            setDuplicatingSide(null);
          }}
        />
      )}

      {/* Quick Add To Plan Picker Dialog (Saturday to Friday, up to 4 recipes per slot) */}
      {quickAddToPlanRecipe && (() => {
        const PLAN_DAYS = [
          { key: 'saturday', label: 'Samedi' },
          { key: 'sunday', label: 'Dimanche' },
          { key: 'monday', label: 'Lundi' },
          { key: 'tuesday', label: 'Mardi' },
          { key: 'wednesday', label: 'Mercredi' },
          { key: 'thursday', label: 'Jeudi' },
          { key: 'friday', label: 'Vendredi' }
        ];

        const targetPlan =
          mealPlans.find((p) => p.weekIndex === quickAddWeek) ||
          mealPlans[0] || { days: {} };

        // Collect slots that still have room (< MAX_RECIPES_PER_SLOT and not custom text)
        const availableSlots: {
          dayKey: string;
          dayLabel: string;
          slot: 'lunch' | 'dinner';
          slotLabel: string;
          icon: string;
          currentCount: number;
          alreadyAdded: boolean;
        }[] = [];

        PLAN_DAYS.forEach((d) => {
          const dayData = (targetPlan.days as any)?.[d.key] || {};
          const lunchIds = getSlotRecipeIds(dayData, 'lunch');
          if (!dayData.lunchCustomText && lunchIds.length < MAX_RECIPES_PER_SLOT) {
            availableSlots.push({
              dayKey: d.key,
              dayLabel: d.label,
              slot: 'lunch',
              slotLabel: 'Midi (Déjeuner)',
              icon: '☀️',
              currentCount: lunchIds.length,
              alreadyAdded: lunchIds.includes(quickAddToPlanRecipe.id)
            });
          }
          const dinnerIds = getSlotRecipeIds(dayData, 'dinner');
          if (!dayData.dinnerCustomText && dinnerIds.length < MAX_RECIPES_PER_SLOT) {
            availableSlots.push({
              dayKey: d.key,
              dayLabel: d.label,
              slot: 'dinner',
              slotLabel: 'Soir (Dîner)',
              icon: '🌙',
              currentCount: dinnerIds.length,
              alreadyAdded: dinnerIds.includes(quickAddToPlanRecipe.id)
            });
          }
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={getRecipeImageUrl(quickAddToPlanRecipe.imageUrl)}
                  alt={quickAddToPlanRecipe.title}
                  className={`w-14 h-14 rounded-xl shrink-0 ${
                    isDefaultRecipeImage(quickAddToPlanRecipe.imageUrl)
                      ? 'object-contain bg-white p-1 border border-stone-200'
                      : 'object-cover'
                  }`}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.includes('nophoto_20bdedd4.jpg')) {
                      img.src = DEFAULT_RECIPE_IMAGE;
                      img.className = 'w-14 h-14 rounded-xl shrink-0 object-contain bg-white p-1 border border-stone-200';
                    }
                  }}
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
                <span>Créneaux ouverts ({quickAddWeek === 1 ? 'Semaine +1' : 'Semaine +2'}) :</span>
                <span className="font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                  {availableSlots.length} disponible{availableSlots.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* List of available slots (up to 4 recipes per slot) */}
              <div className="max-h-60 overflow-y-auto space-y-2 text-xs pr-1">
                {availableSlots.length === 0 ? (
                  <div className="p-4 text-center rounded-2xl bg-stone-50 border border-stone-200 text-stone-600">
                    <p className="font-semibold text-stone-800">
                      Tous les repas de la {quickAddWeek === 1 ? 'Semaine prochaine (+1)' : 'Semaine suivante (+2)'} sont complets !
                    </p>
                    <p className="mt-1 text-[11px]">
                      Basculez sur la {quickAddWeek === 1 ? 'Semaine suivante (+2)' : 'Semaine prochaine (+1)'} ci-dessus pour planifier ce plat.
                    </p>
                  </div>
                ) : (
                  availableSlots.map((item, idx) => (
                    <button
                      key={idx}
                      disabled={item.alreadyAdded}
                      onClick={() =>
                        handleQuickAssignToPlan(
                          quickAddToPlanRecipe,
                          quickAddWeek,
                          item.dayKey,
                          item.slot
                        )
                      }
                      className={`w-full text-left p-2.5 rounded-xl border font-medium transition-colors flex items-center justify-between group ${
                        item.alreadyAdded
                          ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                          : 'border-stone-200 hover:border-orange-500 hover:bg-orange-50 text-stone-800 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>
                          <strong className="font-semibold">{item.dayLabel}</strong> — {item.slotLabel}
                        </span>
                      </div>
                      {item.alreadyAdded ? (
                        <span className="text-[11px] font-semibold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-md">
                          Déjà ajoutée
                        </span>
                      ) : item.currentCount === 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          Libre +
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors">
                          {item.currentCount}/{MAX_RECIPES_PER_SLOT} • Ajouter +
                        </span>
                      )}
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
