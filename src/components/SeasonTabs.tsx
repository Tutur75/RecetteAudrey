import { Calendar, Plus, Salad, Sparkles, UtensilsCrossed } from 'lucide-react';
import React from 'react';
import { getCurrentSeason, SeasonalProduct, SEASONS } from '../lib/seasons';
import { Recipe, recipeMatchesSeason, Season } from '../types/recipe';

const ProduceIllustration: React.FC<{ item: SeasonalProduct }> = ({ item }) => {
  switch (item.illustration) {
    case 'carrot':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path d="M15 4c1-1.5 2.8-2 4-1.5-.2 1.3-1 2.7-2.4 3.4M14 5.5c-.5-1.8.2-3.4 1.3-4.2.7 1.2.6 2.8-.2 4.1M16.5 6.5c1.5-.6 3.2-.2 4 .8-1.2.8-2.8.9-4.2.3" fill="none" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.5 6.5c2 2 2 5-.5 7.5l-7.5 6.8c-.9.8-2.2-.5-1.4-1.4L11.8 12c2.5-2.5 1.2-4 2.7-5.5Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M11 12.5l1.8 1.8M8.8 15l1.4 1.4" stroke="#fed7aa" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'turnip':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path d="M12 6c-1.5-2-3.5-3-5-2.5.4 1.5 1.8 2.6 3.5 3M12 6c0-2.2 1.2-3.8 2.6-4.3.7 1.4.2 3.1-1.1 4.3M12 6c1.8-1.5 3.8-1.8 5-1-.6 1.3-2.2 2-3.8 1.8" fill="none" stroke="#16a34a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7c3.8 0 6.5 2.5 6.5 5.8 0 3.7-3.4 6.2-6.5 8.5-3.1-2.3-6.5-4.8-6.5-8.5C5.5 9.5 8.2 7 12 7Z" fill="#fafaf9" stroke="#a8a29e" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M6.2 11.4C6.8 8.7 9.1 7 12 7s5.2 1.7 5.8 4.4c-1.8.9-3.8 1.2-5.8 1.2s-4-.3-5.8-1.2Z" fill="#a855f7" opacity="0.85" />
        </svg>
      );
    case 'parsnip':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path d="M12 5.5c-1.4-1.8-3.2-2.6-4.5-2.2.3 1.4 1.5 2.4 3 2.7M12 5.5c.1-2 1.2-3.4 2.4-3.8.6 1.3.1 2.8-1.1 3.8M12 5.5c1.6-1.3 3.4-1.6 4.5-.8-.5 1.1-2 1.8-3.4 1.6" fill="none" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 7.5c0-1.3 1.8-2 4-2s4 .7 4 2c0 2.5-1.7 5.5-2.6 8.5-.6 2-1 4.2-1.4 5.5-.4-1.3-.8-3.5-1.4-5.5C9.7 13 8 10 8 7.5Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M10.2 10h2.5M10.8 13.5h2" stroke="#eab308" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'broccoli':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
          <path d="M10.5 13v6.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V13" fill="#86efac" stroke="#15803d" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8.5 13.5c-2 0-3.5-1.5-3.5-3.4 0-1.5 1-2.8 2.4-3.2C7.8 4.7 9.7 3 12 3s4.2 1.7 4.6 3.9c1.4.4 2.4 1.7 2.4 3.2 0 1.9-1.5 3.4-3.5 3.4H8.5Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="9.5" cy="8.5" r="1.1" fill="#4ade80" />
          <circle cx="13.5" cy="7.5" r="1.2" fill="#4ade80" />
          <circle cx="14.8" cy="10.2" r="0.9" fill="#4ade80" />
        </svg>
      );
    default:
      return <span className="text-sm leading-none">{item.emoji}</span>;
  }
};

interface SeasonTabsProps {
  activeTab: Season | 'all' | 'sides' | 'planner';
  onSelectTab: (tab: Season | 'all' | 'sides' | 'planner') => void;
  recipes: Recipe[];
  onNewSide?: () => void;
}

export const SeasonTabs: React.FC<SeasonTabsProps> = ({
  activeTab,
  onSelectTab,
  recipes,
  onNewSide
}) => {
  const currentSeasonKey = getCurrentSeason();
  const seasonKeys: Season[] = ['spring', 'summer', 'autumn', 'winter'];

  const mainRecipes = recipes.filter((r) => !r.isSide);
  const sideRecipes = recipes.filter((r) => !!r.isSide);

  // Calculate count per season (including multi-season recipes, excluding sides)
  const countBySeason = seasonKeys.reduce((acc, season) => {
    acc[season] = mainRecipes.filter((r) => recipeMatchesSeason(r, season)).length;
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
            {mainRecipes.length}
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

      {/* Accompagnements Space Tab (below the season blocks) */}
      <div className="flex items-center gap-2 pt-2.5 pb-2 border-b border-stone-200">
        <button
          onClick={() => onSelectTab('sides')}
          className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
            activeTab === 'sides'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25'
              : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 border border-emerald-200'
          }`}
          title="Espace Accompagnements & ingrédients simples"
        >
          <Salad className={`w-4 h-4 ${activeTab === 'sides' ? 'text-emerald-200' : 'text-emerald-600'}`} />
          <span className="font-serif font-semibold tracking-wide">Accompagnements</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
              activeTab === 'sides'
                ? 'bg-emerald-800 text-emerald-100'
                : 'bg-emerald-200/80 text-emerald-900'
            }`}
          >
            {sideRecipes.length}
          </span>
        </button>
      </div>

      {/* Context Banner: 'all', 'sides', or specific active season */}
      {activeTab === 'sides' ? (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/50 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="text-3xl">🥗</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Espace Accompagnements
                </h3>
                <span className="text-xs text-emerald-900 font-medium bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {sideRecipes.length} accompagnement{sideRecipes.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[12px] text-stone-700 mt-0.5">
                Recettes simples du quotidien (riz, pâtes, légumes, grillades...) à associer à vos repas dans le planning.
              </p>
            </div>
          </div>

          {onNewSide && (
            <button
              type="button"
              onClick={onNewSide}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all cursor-pointer shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvel accompagnement</span>
            </button>
          )}
        </div>
      ) : activeTab === 'all' ? (
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-stone-50 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="text-3xl">🍲</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                  Toutes les recettes
                </h3>
                <span className="text-xs text-stone-700 font-medium bg-stone-200/70 px-2 py-0.5 rounded-full">
                  {mainRecipes.length} recettes au carnet
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

          {/* Seasonal Produce tags (principaux ingrédients de saison avec illustration) */}
          <div className="flex flex-col gap-1.5 lg:items-end">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Produits du moment ({SEASONS[activeTab].produce.length} de saison) :</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap lg:justify-end">
              {SEASONS[activeTab].produce.map((item) => (
                <span
                  key={item.name}
                  className="text-xs px-2.5 py-1 rounded-full bg-white text-stone-800 border border-stone-200/90 shadow-2xs font-medium inline-flex items-center gap-1.5 hover:border-stone-300 transition-colors"
                >
                  <ProduceIllustration item={item} />
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
