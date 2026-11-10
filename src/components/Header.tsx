import { Calendar, CookingPot, Database, Sparkles, Utensils } from 'lucide-react';
import React from 'react';
import { getCurrentSeason, SEASONS } from '../lib/seasons';

interface HeaderProps {
  onNewRecipe: () => void;
  onOpenPlanner: () => void;
  activeTab: string;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewRecipe,
  onOpenPlanner,
  activeTab,
  isOnline
}) => {
  const currentSeasonKey = getCurrentSeason();
  const currentSeason = SEASONS[currentSeasonKey];

  return (
    <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-orange-500/20 ring-4 ring-orange-50"
              title="Carnet de Recettes d'Audrey"
            >
              <CookingPot className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Carnet de Recettes d&apos;Audrey
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100/80 text-amber-900 border border-amber-200/60">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  4 Saisons
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 flex items-center gap-2 mt-0.5">
                <span>Inspirations culinaires &amp; planification hebdomadaire</span>
                <span className="hidden sm:inline text-stone-500">•</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-stone-700">
                  <span className="text-sm">{currentSeason.emoji}</span>
                  <span>{currentSeason.label} en cours</span>
                </span>
              </p>
            </div>
          </div>

          {/* Actions & Status */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Save status */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-800 border-emerald-200"
              title="Sauvegarde automatique active dans votre navigateur et dans le cloud sans aucun compte requis"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sauvegarde active (Sans compte)</span>
            </div>

            {/* Meal planner button */}
            <button
              onClick={onOpenPlanner}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all shadow-xs ${
                activeTab === 'planner'
                  ? 'bg-orange-700 text-white shadow-orange-600/30'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Planning 2 semaines à venir</span>
            </button>

            {/* Add recipe button */}
            <button
              onClick={onNewRecipe}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md shadow-orange-600/25 transition-all transform active:scale-95"
            >
              <Utensils className="w-4 h-4" />
              <span>+ Nouvelle recette</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
