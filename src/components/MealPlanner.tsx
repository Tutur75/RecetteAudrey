import {
  ArrowLeftRight,
  Calendar,
  ChefHat,
  Columns,
  GripVertical,
  Moon,
  Pencil,
  Plus,
  Repeat,
  RotateCcw,
  Search,
  ShoppingCart,
  Sun,
  UtensilsCrossed,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { INITIAL_MEAL_PLANS } from '../data/seedRecipes';
import { getUpcomingWeekDates } from '../lib/dates';
import { DayKey, formatServings, Recipe, recipeMatchesSeason, Season, WeekPlan } from '../types/recipe';
import { ShoppingListModal } from './ShoppingListModal';

interface MealPlannerProps {
  mealPlans: WeekPlan[];
  recipes: Recipe[];
  onSavePlan: (plan: WeekPlan) => Promise<void>;
  onViewRecipe: (recipe: Recipe) => void;
}

const DAYS_OF_WEEK: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' }
];

const CUSTOM_MEAL_PRESETS = [
  { label: '🥡 Restes de la veille', text: 'Restes de la veille' },
  { label: '🛵 Livraison / À emporter', text: 'Livraison / À emporter' },
  { label: '🍽️ Repas extérieur / Restaurant', text: 'Repas extérieur' },
  { label: '🥪 Sur le pouce / Sandwich', text: 'Sur le pouce / Sandwich' },
  { label: '🍕 Soirée Pizza', text: 'Soirée Pizza' },
  { label: '🥖 Brunch / Buffet', text: 'Brunch' }
];

interface DragSource {
  weekIndex: 1 | 2;
  day: DayKey;
  slot: 'lunch' | 'dinner';
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  mealPlans,
  recipes,
  onSavePlan,
  onViewRecipe
}) => {
  // Navigation: selected single week or 14-day overview
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<1 | 2>(1);
  const [viewMode, setViewMode] = useState<'single' | 'both'>('single');
  const [showShoppingList, setShowShoppingList] = useState(false);

  // Guarantee strictly distinct week 1 and week 2 objects
  const planWeek1: WeekPlan =
    mealPlans.find((p) => p.weekIndex === 1 || p.id === 'week-1') ||
    (INITIAL_MEAL_PLANS[0] as WeekPlan);

  const planWeek2: WeekPlan =
    mealPlans.find((p) => p.weekIndex === 2 || p.id === 'week-2') ||
    (INITIAL_MEAL_PLANS[1] as WeekPlan);

  // Computed calendar dates for the 2 upcoming weeks (excluding current week in progress)
  const datesWeek1 = getUpcomingWeekDates(1);
  const datesWeek2 = getUpcomingWeekDates(2);

  // Recipe picker modal state
  const [pickerSlot, setPickerSlot] = useState<{
    weekIndex: 1 | 2;
    day: DayKey;
    slot: 'lunch' | 'dinner';
  } | null>(null);

  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerSeason, setPickerSeason] = useState<Season | 'all'>('all');

  // Custom text input modal state (livraison, restes, etc.)
  const [customTextSlot, setCustomTextSlot] = useState<{
    weekIndex: 1 | 2;
    day: DayKey;
    slot: 'lunch' | 'dinner';
  } | null>(null);
  const [customInputText, setCustomInputText] = useState('');

  // Drag and drop state
  const [draggedSource, setDraggedSource] = useState<DragSource | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    weekIndex: 1 | 2;
    day: DayKey;
    slot: 'lunch' | 'dinner';
  } | null>(null);

  // Quick move dialog state
  const [moveDialogSource, setMoveDialogSource] = useState<DragSource | null>(null);

  // Quick map of recipes
  const recipeMap = new Map<string, Recipe>();
  recipes.forEach((r) => recipeMap.set(r.id, r));

  // Get plan for a specific week index
  const getPlanByWeek = (weekIndex: 1 | 2): WeekPlan => {
    return weekIndex === 1 ? planWeek1 : planWeek2;
  };

  // Helper to find the previous evening's dinner for a given day in a given week
  const getPreviousEveningDinner = (
    weekIndex: 1 | 2,
    dayKey: DayKey
  ): { recipeId?: string | null; customText?: string | null; fromDayLabel: string } => {
    const plan = getPlanByWeek(weekIndex);
    const dayIndex = DAYS_OF_WEEK.findIndex((d) => d.key === dayKey);

    if (dayIndex > 0) {
      const prevDayKey = DAYS_OF_WEEK[dayIndex - 1].key;
      const prevDayData = plan.days[prevDayKey] || {};
      return {
        recipeId: prevDayData.dinnerRecipeId,
        customText: prevDayData.dinnerCustomText,
        fromDayLabel: DAYS_OF_WEEK[dayIndex - 1].label
      };
    } else {
      // Monday lunch: check Sunday dinner of previous week (if week 2, look at week 1 Sunday)
      const prevPlan = weekIndex === 2 ? planWeek1 : planWeek2;
      const sundayData = prevPlan?.days.sunday || {};
      return {
        recipeId: sundayData.dinnerRecipeId,
        customText: sundayData.dinnerCustomText,
        fromDayLabel: weekIndex === 2 ? 'Dimanche soir (Semaine prochaine +1)' : 'Dimanche soir'
      };
    }
  };

  // Force / Copy previous evening's dinner to lunch (les restes) for a specific week
  const handleCopyPrevDinnerToLunch = async (weekIndex: 1 | 2, dayKey: DayKey) => {
    const prev = getPreviousEveningDinner(weekIndex, dayKey);
    if (!prev.recipeId && !prev.customText) {
      alert(`Aucun plat n'a été planifié pour le dîner de la veille (${prev.fromDayLabel}).`);
      return;
    }

    const currentPlan = getPlanByWeek(weekIndex);
    const currentDay = currentPlan.days[dayKey] || {};
    const updatedDay = {
      ...currentDay,
      lunchRecipeId: prev.recipeId || null,
      lunchCustomText: prev.recipeId ? null : prev.customText || null,
      lunchIsLeftover: true
    };

    const updatedPlan: WeekPlan = {
      ...currentPlan,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      days: {
        ...currentPlan.days,
        [dayKey]: updatedDay
      },
      updatedAt: new Date().toISOString()
    };

    await onSavePlan(updatedPlan);
  };

  // Global action: force ALL lunches in the specified week to be leftovers of previous dinner
  const handleForceAllLunchesAsLeftovers = async (weekIndex: 1 | 2) => {
    const currentPlan = getPlanByWeek(weekIndex);
    const confirmed = window.confirm(
      `Voulez-vous reporter automatiquement le dîner de la veille sur chaque déjeuner du midi pour la ${currentPlan.title} ?`
    );
    if (!confirmed) return;

    const newDays = { ...currentPlan.days };
    DAYS_OF_WEEK.forEach((d) => {
      const prev = getPreviousEveningDinner(weekIndex, d.key);
      if (prev.recipeId || prev.customText) {
        newDays[d.key] = {
          ...(newDays[d.key] || {}),
          lunchRecipeId: prev.recipeId || null,
          lunchCustomText: prev.recipeId ? null : prev.customText || null,
          lunchIsLeftover: true
        };
      }
    });

    const updatedPlan: WeekPlan = {
      ...currentPlan,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      days: newDays,
      updatedAt: new Date().toISOString()
    };

    await onSavePlan(updatedPlan);
  };

  // Change slot recipe from picker
  const handleAssignRecipe = async (recipeId: string | null) => {
    if (!pickerSlot) return;
    const { weekIndex, day, slot } = pickerSlot;
    const currentPlan = getPlanByWeek(weekIndex);

    const currentDay = currentPlan.days[day] || {};
    const updatedDay = {
      ...currentDay,
      [slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId']: recipeId,
      [slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText']: null,
      [slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover']: false
    };

    const updatedPlan: WeekPlan = {
      ...currentPlan,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      days: {
        ...currentPlan.days,
        [day]: updatedDay
      },
      updatedAt: new Date().toISOString()
    };

    await onSavePlan(updatedPlan);
    setPickerSlot(null);
  };

  // Assign custom text (livraison, restes, restaurant, etc.)
  const handleAssignCustomText = async (text: string) => {
    if (!customTextSlot) return;
    const { weekIndex, day, slot } = customTextSlot;
    const currentPlan = getPlanByWeek(weekIndex);

    const currentDay = currentPlan.days[day] || {};
    const updatedDay = {
      ...currentDay,
      [slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId']: null,
      [slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText']: text.trim(),
      [slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover']: text.toLowerCase().includes('reste')
    };

    const updatedPlan: WeekPlan = {
      ...currentPlan,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      days: {
        ...currentPlan.days,
        [day]: updatedDay
      },
      updatedAt: new Date().toISOString()
    };

    await onSavePlan(updatedPlan);
    setCustomTextSlot(null);
    setCustomInputText('');
  };

  // Remove dish or custom text directly from card
  const handleRemoveRecipe = async (weekIndex: 1 | 2, day: DayKey, slot: 'lunch' | 'dinner') => {
    const currentPlan = getPlanByWeek(weekIndex);
    const currentDay = currentPlan.days[day] || {};
    const updatedDay = {
      ...currentDay,
      [slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId']: null,
      [slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText']: null,
      [slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover']: false
    };

    const updatedPlan: WeekPlan = {
      ...currentPlan,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      days: {
        ...currentPlan.days,
        [day]: updatedDay
      },
      updatedAt: new Date().toISOString()
    };

    await onSavePlan(updatedPlan);
  };

  // Move or Swap meal between source and destination slots (supports cross-week if in 14-day view)
  const handleMoveOrSwapMeal = async (
    source: DragSource,
    destination: { weekIndex: 1 | 2; day: DayKey; slot: 'lunch' | 'dinner' }
  ) => {
    if (
      source.weekIndex === destination.weekIndex &&
      source.day === destination.day &&
      source.slot === destination.slot
    ) {
      return;
    }

    if (source.weekIndex === destination.weekIndex) {
      // Intra-week move
      const plan = getPlanByWeek(source.weekIndex);
      const sourceDayData = { ...(plan.days[source.day] || {}) };
      const destDayData =
        source.day === destination.day ? sourceDayData : { ...(plan.days[destination.day] || {}) };

      const srcRecipeField = source.slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId';
      const srcCustomField = source.slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText';
      const srcLeftoverField = source.slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover';

      const dstRecipeField = destination.slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId';
      const dstCustomField = destination.slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText';
      const dstLeftoverField = destination.slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover';

      const srcRecipeVal = sourceDayData[srcRecipeField];
      const srcCustomVal = sourceDayData[srcCustomField];
      const srcLeftoverVal = sourceDayData[srcLeftoverField];

      sourceDayData[srcRecipeField] = destDayData[dstRecipeField] || null;
      sourceDayData[srcCustomField] = destDayData[dstCustomField] || null;
      sourceDayData[srcLeftoverField] = destDayData[dstLeftoverField] || false;

      destDayData[dstRecipeField] = srcRecipeVal || null;
      destDayData[dstCustomField] = srcCustomVal || null;
      destDayData[dstLeftoverField] = srcLeftoverVal || false;

      const updatedPlan: WeekPlan = {
        ...plan,
        id: source.weekIndex === 1 ? 'week-1' : 'week-2',
        weekIndex: source.weekIndex,
        days: {
          ...plan.days,
          [source.day]: sourceDayData,
          [destination.day]: destDayData
        },
        updatedAt: new Date().toISOString()
      };

      await onSavePlan(updatedPlan);
    } else {
      // Cross-week move: swap between Week 1 and Week 2
      const srcPlan = getPlanByWeek(source.weekIndex);
      const dstPlan = getPlanByWeek(destination.weekIndex);

      const sourceDayData = { ...(srcPlan.days[source.day] || {}) };
      const destDayData = { ...(dstPlan.days[destination.day] || {}) };

      const srcRecipeField = source.slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId';
      const srcCustomField = source.slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText';
      const srcLeftoverField = source.slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover';

      const dstRecipeField = destination.slot === 'lunch' ? 'lunchRecipeId' : 'dinnerRecipeId';
      const dstCustomField = destination.slot === 'lunch' ? 'lunchCustomText' : 'dinnerCustomText';
      const dstLeftoverField = destination.slot === 'lunch' ? 'lunchIsLeftover' : 'dinnerIsLeftover';

      const srcRecipeVal = sourceDayData[srcRecipeField];
      const srcCustomVal = sourceDayData[srcCustomField];
      const srcLeftoverVal = sourceDayData[srcLeftoverField];

      sourceDayData[srcRecipeField] = destDayData[dstRecipeField] || null;
      sourceDayData[srcCustomField] = destDayData[dstCustomField] || null;
      sourceDayData[srcLeftoverField] = destDayData[dstLeftoverField] || false;

      destDayData[dstRecipeField] = srcRecipeVal || null;
      destDayData[dstCustomField] = srcCustomVal || null;
      destDayData[dstLeftoverField] = srcLeftoverVal || false;

      const updatedSrcPlan: WeekPlan = {
        ...srcPlan,
        id: source.weekIndex === 1 ? 'week-1' : 'week-2',
        weekIndex: source.weekIndex,
        days: { ...srcPlan.days, [source.day]: sourceDayData },
        updatedAt: new Date().toISOString()
      };

      const updatedDstPlan: WeekPlan = {
        ...dstPlan,
        id: destination.weekIndex === 1 ? 'week-1' : 'week-2',
        weekIndex: destination.weekIndex,
        days: { ...dstPlan.days, [destination.day]: destDayData },
        updatedAt: new Date().toISOString()
      };

      await onSavePlan(updatedSrcPlan);
      await onSavePlan(updatedDstPlan);
    }

    setDraggedSource(null);
    setDragOverTarget(null);
    setMoveDialogSource(null);
  };

  // Drag handlers
  const onDragStart = (e: React.DragEvent, weekIndex: 1 | 2, day: DayKey, slot: 'lunch' | 'dinner') => {
    const source: DragSource = { weekIndex, day, slot };
    setDraggedSource(source);
    e.dataTransfer.setData('text/plain', JSON.stringify(source));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, weekIndex: 1 | 2, day: DayKey, slot: 'lunch' | 'dinner') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (
      !dragOverTarget ||
      dragOverTarget.weekIndex !== weekIndex ||
      dragOverTarget.day !== day ||
      dragOverTarget.slot !== slot
    ) {
      setDragOverTarget({ weekIndex, day, slot });
    }
  };

  const onDragLeave = () => {
    setDragOverTarget(null);
  };

  const onDrop = async (e: React.DragEvent, weekIndex: 1 | 2, day: DayKey, slot: 'lunch' | 'dinner') => {
    e.preventDefault();
    setDragOverTarget(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const source: DragSource = JSON.parse(dataStr);
        await handleMoveOrSwapMeal(source, { weekIndex, day, slot });
      } else if (draggedSource) {
        await handleMoveOrSwapMeal(draggedSource, { weekIndex, day, slot });
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
    setDraggedSource(null);
  };

  // Clear specific week
  const handleClearWeek = async (weekIndex: 1 | 2) => {
    const target = getPlanByWeek(weekIndex);
    if (!window.confirm(`Voulez-vous réinitialiser tous les menus de la ${target.title} ?`)) return;

    const clearedDays: WeekPlan['days'] = {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {}
    };

    const updatedPlan: WeekPlan = {
      ...target,
      id: weekIndex === 1 ? 'week-1' : 'week-2',
      weekIndex,
      days: clearedDays,
      updatedAt: new Date().toISOString()
    };

    await onSavePlan(updatedPlan);
  };

  // Filtered recipes for picker modal
  const filteredPickerRecipes = recipes.filter((r) => {
    const matchesSeason = pickerSeason === 'all' || recipeMatchesSeason(r, pickerSeason);
    const matchesQuery =
      !pickerSearch.trim() ||
      r.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      r.tags?.some((t) => t.toLowerCase().includes(pickerSearch.toLowerCase()));
    return matchesSeason && matchesQuery;
  });

  // Render a 7-day grid for a given week plan
  const renderWeekDaysGrid = (plan: WeekPlan) => {
    const datesInfo = plan.weekIndex === 1 ? datesWeek1 : datesWeek2;
    const weekDisplayTitle =
      plan.weekIndex === 1 ? 'Semaine prochaine (+1)' : 'Semaine suivante (+2)';

    return (
      <div className="space-y-4">
        {/* Week Sub-Header & Local Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/90 px-4 py-3 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                plan.weekIndex === 1 ? 'bg-orange-500 ring-4 ring-orange-100' : 'bg-amber-500 ring-4 ring-amber-100'
              }`}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {weekDisplayTitle}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-white border border-stone-200 text-stone-700 shadow-2xs">
                  {datesInfo.formattedRange}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Planning anticipé des repas (semaine à venir distincte)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleForceAllLunchesAsLeftovers(plan.weekIndex)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-amber-50 text-amber-900 border border-stone-200 transition-colors cursor-pointer"
              title="Reporter automatiquement les dîners en restes pour chaque midi"
            >
              <Repeat className="w-3.5 h-3.5 text-amber-600" />
              <span>Midis = Restes</span>
            </button>
            <button
              onClick={() => handleClearWeek(plan.weekIndex)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-white border border-transparent hover:border-stone-200 transition-colors cursor-pointer"
              title="Vider cette semaine"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
          {DAYS_OF_WEEK.map((day) => {
            const dayPlan = plan.days[day.key] || {};
            const lunchRecipe = dayPlan.lunchRecipeId ? recipeMap.get(dayPlan.lunchRecipeId) : null;
            const dinnerRecipe = dayPlan.dinnerRecipeId ? recipeMap.get(dayPlan.dinnerRecipeId) : null;

            const hasLunch = !!lunchRecipe || !!dayPlan.lunchCustomText;
            const hasDinner = !!dinnerRecipe || !!dayPlan.dinnerCustomText;

            const isLunchDragOver =
              dragOverTarget?.weekIndex === plan.weekIndex &&
              dragOverTarget?.day === day.key &&
              dragOverTarget?.slot === 'lunch';

            const isDinnerDragOver =
              dragOverTarget?.weekIndex === plan.weekIndex &&
              dragOverTarget?.day === day.key &&
              dragOverTarget?.slot === 'dinner';

            const prevDinnerInfo = getPreviousEveningDinner(plan.weekIndex, day.key);
            const hasPrevDinner = !!prevDinnerInfo.recipeId || !!prevDinnerInfo.customText;

            return (
              <div
                key={day.key}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                {/* Centered Day Header (centered day name + calendar date) */}
                <div className="py-2 px-2 bg-stone-50/90 border-b border-stone-100 text-center">
                  <h4 className="font-bold text-stone-900 text-sm tracking-wide uppercase">
                    {day.label}
                  </h4>
                  <span className="text-[11px] font-semibold text-stone-500 block leading-tight">
                    {datesInfo.dayDates[day.key]}
                  </span>
                </div>

                {/* Day Slots: Midi & Soir */}
                <div className="p-2.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  {/* --- LUNCH (MIDI) --- */}
                  <div
                    onDragOver={(e) => onDragOver(e, plan.weekIndex, day.key, 'lunch')}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, plan.weekIndex, day.key, 'lunch')}
                    className={`space-y-1.5 p-1 rounded-xl transition-all ${
                      isLunchDragOver
                        ? 'bg-orange-100/70 ring-2 ring-orange-500 ring-dashed scale-[1.02]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-amber-700">
                        <Sun className="w-3.5 h-3.5" />
                        Midi
                      </span>
                      {hasLunch ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setMoveDialogSource({
                                weekIndex: plan.weekIndex,
                                day: day.key,
                                slot: 'lunch'
                              })
                            }
                            className="text-stone-400 hover:text-stone-700 p-0.5 rounded-sm"
                            title="Déplacer vers un autre jour"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveRecipe(plan.weekIndex, day.key, 'lunch')}
                            className="text-stone-400 hover:text-rose-600 p-0.5 rounded-sm"
                            title="Retirer ce plat"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        hasPrevDinner && (
                          <button
                            onClick={() => handleCopyPrevDinnerToLunch(plan.weekIndex, day.key)}
                            className="text-[10px] lowercase font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 transition-colors cursor-pointer"
                            title={`Reprendre le dîner du ${prevDinnerInfo.fromDayLabel}`}
                          >
                            <Repeat className="w-2.5 h-2.5" />
                            <span>Restes</span>
                          </button>
                        )
                      )}
                    </div>

                    {/* Lunch Display: Photo above title, servings count, no prep time */}
                    {lunchRecipe ? (
                      <div
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, plan.weekIndex, day.key, 'lunch')}
                        className="group relative rounded-xl border border-stone-200 p-2 bg-stone-50/80 hover:bg-stone-100/90 hover:border-orange-300 transition-all cursor-grab active:cursor-grabbing shadow-2xs"
                      >
                        {/* Photo on top */}
                        <div className="relative w-full h-22 rounded-lg overflow-hidden bg-stone-200 mb-1.5">
                          <img
                            src={lunchRecipe.imageUrl}
                            alt={lunchRecipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-1 left-1 flex items-center gap-1">
                            {dayPlan.lunchIsLeftover && (
                              <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                                🥘 Restes
                              </span>
                            )}
                          </div>
                          <div className="absolute top-1 right-1 bg-black/40 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Full recipe title without truncation */}
                        <p
                          onClick={() => onViewRecipe(lunchRecipe)}
                          className="text-xs font-semibold text-stone-900 hover:text-orange-700 cursor-pointer leading-snug break-words text-left"
                        >
                          {lunchRecipe.title}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mt-1 pt-1 border-t border-stone-200/60">
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            <span>{formatServings(lunchRecipe.servings)}</span>
                          </span>
                        </div>
                      </div>
                    ) : dayPlan.lunchCustomText ? (
                      /* Custom text block */
                      <div
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, plan.weekIndex, day.key, 'lunch')}
                        className="group relative rounded-xl border border-amber-300 bg-amber-50/90 p-2.5 hover:bg-amber-100/80 transition-all cursor-grab active:cursor-grabbing shadow-2xs text-left"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            {dayPlan.lunchIsLeftover ? '🥘 Restes' : '📌 Libre'}
                          </span>
                          <GripVertical className="w-3 h-3 text-amber-500 opacity-60 group-hover:opacity-100" />
                        </div>
                        <p className="text-xs font-bold text-amber-950 leading-snug break-words">
                          {dayPlan.lunchCustomText}
                        </p>
                      </div>
                    ) : (
                      /* Empty slot */
                      <div className="space-y-1">
                        <button
                          onClick={() =>
                            setPickerSlot({
                              weekIndex: plan.weekIndex,
                              day: day.key,
                              slot: 'lunch'
                            })
                          }
                          className="w-full py-1.5 px-1.5 rounded-xl border border-dashed border-stone-300 hover:border-orange-400 text-stone-600 hover:text-orange-700 bg-stone-50/50 hover:bg-orange-50/40 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Recette</span>
                        </button>
                        <button
                          onClick={() =>
                            setCustomTextSlot({
                              weekIndex: plan.weekIndex,
                              day: day.key,
                              slot: 'lunch'
                            })
                          }
                          className="w-full py-1 px-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-[10px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-stone-400" />
                          <span>Restes / Ext...</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* --- DINNER (SOIR) --- */}
                  <div
                    onDragOver={(e) => onDragOver(e, plan.weekIndex, day.key, 'dinner')}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(e, plan.weekIndex, day.key, 'dinner')}
                    className={`space-y-1.5 pt-2 border-t border-stone-100 p-1 rounded-xl transition-all ${
                      isDinnerDragOver
                        ? 'bg-orange-100/70 ring-2 ring-orange-500 ring-dashed scale-[1.02]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-indigo-700">
                        <Moon className="w-3.5 h-3.5" />
                        Soir
                      </span>
                      {hasDinner && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setMoveDialogSource({
                                weekIndex: plan.weekIndex,
                                day: day.key,
                                slot: 'dinner'
                              })
                            }
                            className="text-stone-400 hover:text-stone-700 p-0.5 rounded-sm"
                            title="Déplacer vers un autre jour"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveRecipe(plan.weekIndex, day.key, 'dinner')}
                            className="text-stone-400 hover:text-rose-600 p-0.5 rounded-sm"
                            title="Retirer ce plat"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {dinnerRecipe ? (
                      <div
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, plan.weekIndex, day.key, 'dinner')}
                        className="group relative rounded-xl border border-stone-200 p-2 bg-stone-50/80 hover:bg-stone-100/90 hover:border-orange-300 transition-all cursor-grab active:cursor-grabbing shadow-2xs"
                      >
                        {/* Photo on top */}
                        <div className="relative w-full h-22 rounded-lg overflow-hidden bg-stone-200 mb-1.5">
                          <img
                            src={dinnerRecipe.imageUrl}
                            alt={dinnerRecipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-1 right-1 bg-black/40 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Full recipe title */}
                        <p
                          onClick={() => onViewRecipe(dinnerRecipe)}
                          className="text-xs font-semibold text-stone-900 hover:text-orange-700 cursor-pointer leading-snug break-words text-left"
                        >
                          {dinnerRecipe.title}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mt-1 pt-1 border-t border-stone-200/60">
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            <span>{formatServings(dinnerRecipe.servings)}</span>
                          </span>
                        </div>
                      </div>
                    ) : dayPlan.dinnerCustomText ? (
                      /* Custom text block */
                      <div
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, plan.weekIndex, day.key, 'dinner')}
                        className="group relative rounded-xl border border-indigo-200 bg-indigo-50/80 p-2.5 hover:bg-indigo-100/80 transition-all cursor-grab active:cursor-grabbing shadow-2xs text-left"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                            📌 Soirée libre
                          </span>
                          <GripVertical className="w-3 h-3 text-indigo-500 opacity-60 group-hover:opacity-100" />
                        </div>
                        <p className="text-xs font-bold text-indigo-950 leading-snug break-words">
                          {dayPlan.dinnerCustomText}
                        </p>
                      </div>
                    ) : (
                      /* Empty slot */
                      <div className="space-y-1">
                        <button
                          onClick={() =>
                            setPickerSlot({
                              weekIndex: plan.weekIndex,
                              day: day.key,
                              slot: 'dinner'
                            })
                          }
                          className="w-full py-1.5 px-1.5 rounded-xl border border-dashed border-stone-300 hover:border-orange-400 text-stone-600 hover:text-orange-700 bg-stone-50/50 hover:bg-orange-50/40 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Recette</span>
                        </button>
                        <button
                          onClick={() =>
                            setCustomTextSlot({
                              weekIndex: plan.weekIndex,
                              day: day.key,
                              slot: 'dinner'
                            })
                          }
                          className="w-full py-1 px-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-[10px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-stone-400" />
                          <span>Livraison / Restes...</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes for this specific week */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
            Notes &amp; organisation pour la {plan.title}
          </label>
          <textarea
            rows={2}
            value={plan.notes || ''}
            onChange={(e) => {
              const updated = {
                ...plan,
                id: plan.weekIndex === 1 ? 'week-1' : 'week-2',
                weekIndex: plan.weekIndex,
                notes: e.target.value,
                updatedAt: new Date().toISOString()
              };
              onSavePlan(updated);
            }}
            placeholder={`Notes personnelles pour la ${plan.title}...`}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Planner Controls */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Week Selector: Semaine 1 vs Semaine 2 vs Vue 14 jours */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex p-1 rounded-2xl bg-stone-100 border border-stone-200/80 flex-wrap gap-1">
            <button
              onClick={() => {
                setSelectedWeekIndex(1);
                setViewMode('single');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                viewMode === 'single' && selectedWeekIndex === 1
                  ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-orange-600" />
              <div className="text-left">
                <span>Semaine prochaine (+1)</span>
                <span className="hidden sm:inline-block ml-1.5 text-[11px] font-normal text-stone-500">
                  ({datesWeek1.formattedRange})
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedWeekIndex(2);
                setViewMode('single');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                viewMode === 'single' && selectedWeekIndex === 2
                  ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <div className="text-left">
                <span>Semaine suivante (+2)</span>
                <span className="hidden sm:inline-block ml-1.5 text-[11px] font-normal text-stone-500">
                  ({datesWeek2.formattedRange})
                </span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Affiche les 2 semaines complètes à venir sur une même page"
            >
              <Columns className="w-4 h-4 text-emerald-600" />
              <span>Vue 14 jours (2 semaines à venir)</span>
            </button>
          </div>
        </div>

        {/* Global Action: Shopping list for Week 1, Week 2, or both */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setShowShoppingList(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Liste de courses</span>
          </button>
        </div>
      </div>

      {/* Main Planning Content: Either active week or both weeks distinctly stacked */}
      {viewMode === 'both' ? (
        <div className="space-y-10">
          {/* Week 1 Section */}
          <div className="space-y-4 p-5 rounded-3xl bg-white border border-orange-200/80 shadow-xs">
            <div className="flex items-center justify-between border-b border-orange-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-600" />
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Semaine prochaine (+1) — {datesWeek1.formattedRange}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-900">
                Semaine +1
              </span>
            </div>
            {renderWeekDaysGrid(planWeek1)}
          </div>

          {/* Week 2 Section */}
          <div className="space-y-4 p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-600" />
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Semaine suivante (+2) — {datesWeek2.formattedRange}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                Semaine +2
              </span>
            </div>
            {renderWeekDaysGrid(planWeek2)}
          </div>
        </div>
      ) : (
        /* Single Week View */
        <div className="space-y-4">
          {selectedWeekIndex === 1
            ? renderWeekDaysGrid(planWeek1)
            : renderWeekDaysGrid(planWeek2)}
        </div>
      )}

      {/* Modal: Custom Text / Event Input (Livraison, Restes, Extérieur, etc.) */}
      {customTextSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Ajouter un repas libre
                </h3>
                <p className="text-xs text-stone-600">
                  Semaine {customTextSlot.weekIndex} • Pour le{' '}
                  {customTextSlot.slot === 'lunch' ? 'Midi' : 'Soir'} du{' '}
                  <span className="font-semibold text-stone-900">
                    {DAYS_OF_WEEK.find((d) => d.key === customTextSlot.day)?.label}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setCustomTextSlot(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Suggestions rapides :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CUSTOM_MEAL_PRESETS.map((p) => (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => handleAssignCustomText(p.text)}
                    className="p-2.5 text-left rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50 text-xs font-medium text-stone-800 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free text input */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Ou saisie personnalisée :
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInputText.trim()) {
                      e.preventDefault();
                      handleAssignCustomText(customInputText);
                    }
                  }}
                  placeholder="Ex: Dîner chez Thomas, Pique-nique..."
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900"
                />
                <button
                  type="button"
                  disabled={!customInputText.trim()}
                  onClick={() => handleAssignCustomText(customInputText)}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  Valider
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCustomTextSlot(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Move Dialog (Target selector) */}
      {moveDialogSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Déplacer ou échanger ce repas
                </h3>
                <p className="text-xs text-stone-600">
                  Depuis la Semaine {moveDialogSource.weekIndex} •{' '}
                  <span className="font-semibold text-stone-900">
                    {DAYS_OF_WEEK.find((d) => d.key === moveDialogSource.day)?.label} (
                    {moveDialogSource.slot === 'lunch' ? 'Midi' : 'Soir'})
                  </span>
                </p>
              </div>
              <button
                onClick={() => setMoveDialogSource(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Choisissez le créneau de destination dans la Semaine {moveDialogSource.weekIndex} :
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d.key} className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      handleMoveOrSwapMeal(moveDialogSource, {
                        weekIndex: moveDialogSource.weekIndex,
                        day: d.key,
                        slot: 'lunch'
                      })
                    }
                    className="p-2 text-left rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50 text-xs font-medium text-stone-800 transition-colors"
                  >
                    ☀️ {d.label} (Midi)
                  </button>
                  <button
                    onClick={() =>
                      handleMoveOrSwapMeal(moveDialogSource, {
                        weekIndex: moveDialogSource.weekIndex,
                        day: d.key,
                        slot: 'dinner'
                      })
                    }
                    className="p-2 text-left rounded-xl border border-stone-200 hover:border-indigo-500 hover:bg-indigo-50 text-xs font-medium text-stone-800 transition-colors"
                  >
                    🌙 {d.label} (Soir)
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setMoveDialogSource(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Picker Modal */}
      {pickerSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[88vh] flex flex-col">
            {/* Picker Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Choisir une recette pour la Semaine {pickerSlot.weekIndex} •{' '}
                  <span className="text-orange-700 capitalize">
                    {pickerSlot.slot === 'lunch' ? 'déjeuner' : 'dîner'}
                  </span>{' '}
                  du {DAYS_OF_WEEK.find((d) => d.key === pickerSlot.day)?.label}
                </h3>
                <p className="text-xs text-stone-600">
                  Sélectionnez parmi les recettes de votre carnet
                </p>
              </div>
              <button
                onClick={() => setPickerSlot(null)}
                className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Picker Filters */}
            <div className="p-4 border-b border-stone-200 space-y-3 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Rechercher par titre ou tag..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-900"
                />
              </div>

              {/* Season tabs in picker */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setPickerSeason('all')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    pickerSeason === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Toutes les saisons
                </button>
                {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map((sKey) => {
                  const sLabel = {
                    spring: '🌸 Printemps',
                    summer: '☀️ Été',
                    autumn: '🍂 Automne',
                    winter: '❄️ Hiver'
                  }[sKey];
                  return (
                    <button
                      key={sKey}
                      onClick={() => setPickerSeason(sKey)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 ${
                        pickerSeason === sKey
                          ? 'bg-orange-700 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      <span>{sLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipe List */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-2.5 flex-1 divide-y divide-stone-100">
              {filteredPickerRecipes.length === 0 ? (
                <div className="py-12 text-center text-stone-600">
                  <UtensilsCrossed className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="text-sm font-medium">Aucune recette trouvée avec ces critères.</p>
                </div>
              ) : (
                filteredPickerRecipes.map((r) => (
                  <div
                    key={r.id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group hover:bg-stone-50 p-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm">
                          {r.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                          <span>👥 {formatServings(r.servings)}</span>
                          <span>•</span>
                          <span>⏱️ {r.prepTime} min</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssignRecipe(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                    >
                      Choisir
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <ShoppingListModal
          plans={[planWeek1, planWeek2]}
          recipes={recipes}
          onClose={() => setShowShoppingList(false)}
        />
      )}
    </div>
  );
};
