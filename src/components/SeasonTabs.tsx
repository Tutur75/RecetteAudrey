import { Calendar, ChevronRight, Sparkles, UtensilsCrossed } from 'lucide-react';
import React from 'react';
import { getCurrentSeason, SEASONS } from '../lib/seasons';
import { Recipe, recipeMatchesSeason, Season } from '../types/recipe';

interface SeasonTabsProps {
  activeTab: Season | 'all' | 'planner';
  onSelectTab: (tab: Season | 'all' | 'planner') => void;
  recipes: Recipe[];
}

export const SeasonTabs: React.FC<SeasonTabsProps> = ({
  activeTab,
  onSelectTab,
  recipes
}) => {
  const currentSeasonKey = getCurrentSeason();
  const seasonKeys: Season[] = ['spring', 'summer', 'autumn', 'winter'];

  // Calculate count per season (including multi-season recipes)
  const countBySeason = seasonKeys.reduce((acc, season) => {
    acc[season] = recipes.filter((r) => recipeMatchesSeason(r, season)).length;
    return acc;
  }, {} as Record<Season, number>);

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {/* Bouton TOUTES compact pour la liste complète */}
        <button
          onClick={() => onSelectTab('all')}
          className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-stone-900 text-white shadow-sm ring-2 ring-stone-800'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/90'
          }`}
          title="Afficher la liste complète de toutes les recettes (toutes saisons confondues)"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
          <span className="tracking-wide text-[11px] font-bold">
            TOUTES
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
              activeTab === 'all'
                ? 'bg-stone-800 text-stone-200'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {recipes.length}
          </span>
        </button>

        {seasonKeys.map((seasonKey) => {
          const season = SEASONS[seasonKey];
          const isCurrent = seasonKey === currentSeasonKey;
          const isSelected = activeTab === seasonKey;
          const count = countBySeason[seasonKey] || 0;

          return (
            <button
              key={seasonKey}
              onClick={() => onSelectTab(seasonKey)}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-md shadow-stone-900/15'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/90'
              }`}
            >
              {/* Season Emoji */}
              <span className="text-base leading-none">{season.emoji}</span>

              {/* Label */}
              <span className="font-serif font-semibold tracking-wide">
                {season.label}
              </span>

              {/* Count badge */}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                  isSelected
                    ? 'bg-stone-800 text-stone-200'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {count}
              </span>

              {/* Current Season Glow / Surbrillance Indicator */}
              {isCurrent && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 shadow-xs'
                      : 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/30 animate-pulse'
                  }`}
                  title="C'est la saison actuelle !"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  En cours
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="h-6 w-px bg-stone-300 mx-1 hidden sm:block shrink-0" />

        {/* 2-Week Planner Tab (agrandi et mis en valeur) */}
        <button
          onClick={() => onSelectTab('planner')}
          className={`relative flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'planner'
              ? 'bg-orange-700 text-white shadow-lg shadow-orange-700/30 ring-2 ring-orange-600/40'
              : 'bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 shadow-xs'
          }`}
        >
          <Calendar className="w-5 h-5 text-orange-600 shrink-0" />
          <span className="font-serif font-bold tracking-wide">Planning des Menus</span>
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
              activeTab === 'planner'
                ? 'bg-orange-800 text-orange-100'
                : 'bg-orange-200 text-orange-950'
            }`}
          >
            2 semaines
          </span>
        </button>
      </div>

      {/* Context Banner: either 'all' or specific active season */}
      {activeTab === 'all' ? (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-stone-50 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="text-3xl">🍲</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                  Toutes les recettes
                </h3>
                <span className="text-xs text-stone-700 font-medium bg-stone-200/70 px-2 py-0.5 rounded-full">
                  {recipes.length} recettes au carnet
                </span>
                <span className="text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  Collection complète
                </span>
              </div>
              <p className="text-[12px] text-stone-700 mt-0.5">
                Vue globale de toutes vos recettes du Printemps, de l&apos;Été, de l&apos;Automne et de l&apos;Hiver.
              </p>
            </div>
          </div>

          {/* Quick counts breakdown for the 4 seasons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider mr-1 hidden lg:inline">
              Par saison :
            </span>
            {seasonKeys.map((sk) => {
              const s = SEASONS[sk];
              const cnt = countBySeason[sk] || 0;
              const isCurrent = sk === currentSeasonKey;
              return (
                <button
                  key={sk}
                  onClick={() => onSelectTab(sk)}
                  className={`text-xs px-2.5 py-1 rounded-full border shadow-2xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                  title={`Filtrer uniquement sur ${s.label}`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label} : <strong>{cnt}</strong></span>
                </button>
              );
            })}
          </div>
        </div>
      ) : activeTab !== 'planner' ? (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-stone-50 border border-stone-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 shrink-0">
            <div className="text-3xl sm:text-4xl">{SEASONS[activeTab].emoji}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {SEASONS[activeTab].label}
                </h3>
                <span className="text-xs text-stone-700 font-medium bg-stone-200/70 px-2 py-0.5 rounded-full">
                  {SEASONS[activeTab].dates}
                </span>
                {activeTab === currentSeasonKey && (
                  <span className="text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    Saison en cours
                  </span>
                )}
              </div>
              <p className="text-[12px] text-stone-700 mt-0.5 max-w-xl">
                {SEASONS[activeTab].description}
              </p>
            </div>
          </div>

          {/* Seasonal Produce tags (10 principaux ingrédients de saison avec logo) */}
          <div className="flex flex-col gap-1.5 lg:items-end">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Produits du moment (10 de saison) :</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap lg:justify-end">
              {SEASONS[activeTab].produce.map((item) => (
                <span
                  key={item.name}
                  className="text-xs px-2.5 py-1 rounded-full bg-white text-stone-800 border border-stone-200/90 shadow-2xs font-medium inline-flex items-center gap-1.5 hover:border-stone-300 transition-colors"
                >
                  <span className="text-sm leading-none">{item.emoji}</span>
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
