import { Clock, RotateCcw, Search, SlidersHorizontal, Tag, X } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  maxPrepTime: number | null; // in minutes, null = any
  onMaxPrepTimeChange: (time: number | null) => void;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  availableTags: string[];
  tagCounts?: Record<string, number>;
  onOpenTagManager?: () => void;
  totalResults: number;
  onResetFilters: () => void;
}

const PREP_TIME_PRESETS = [
  { label: 'Tous les temps', value: null },
  { label: '⚡ Rapide (< 15 min)', value: 15 },
  { label: '⏱️ Moins de 30 min', value: 30 },
  { label: '⏱️ Moins de 45 min', value: 45 },
  { label: '🥘 Moins d’1 heure', value: 60 }
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  maxPrepTime,
  onMaxPrepTimeChange,
  selectedTags,
  onToggleTag,
  availableTags,
  tagCounts = {},
  onOpenTagManager,
  totalResults,
  onResetFilters
}) => {
  const hasActiveFilters = searchQuery.trim().length > 0 || maxPrepTime !== null || selectedTags.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Search Input & Reset row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un plat, un ingrédient, une note secrète..."
            className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-stone-900 placeholder:text-stone-400 text-sm bg-stone-50/50 hover:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live count & reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm">
          <span className="text-stone-700 font-medium">
            <strong className="text-stone-900 font-semibold">{totalResults}</strong>{' '}
            {totalResults > 1 ? 'recettes trouvées' : 'recette trouvée'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-rose-700 bg-stone-100 hover:bg-rose-50 border border-stone-200/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter rows: Preparation Time & Tags */}
      <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row md:items-center gap-4">
        {/* Preparation Time Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-700" />
            Temps de prépa :
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PREP_TIME_PRESETS.map((preset) => {
              const isSelected = maxPrepTime === preset.value;
              return (
                <button
                  key={preset.label}
                  onClick={() => onMaxPrepTimeChange(preset.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-700 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 border border-stone-200/60'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tags Filter row */}
      {availableTags.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-stone-700" />
              Tags :
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                const count = tagCounts[tag] || 0;
                return (
                  <button
                    key={tag}
                    onClick={() => onToggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/20'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                    }`}
                    title={`Filtrer par #${tag} (${count} recette${count > 1 ? 's' : ''})`}
                  >
                    <span>#{tag}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-amber-700 text-amber-100' : 'bg-stone-200/80 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                    {isSelected && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {onOpenTagManager && (
            <button
              type="button"
              onClick={onOpenTagManager}
              className="text-[11px] text-stone-700 hover:text-amber-800 font-medium flex items-center gap-1 hover:underline cursor-pointer shrink-0 self-start sm:self-auto"
              title="Gérer les tags et nettoyer ceux non utilisés"
            >
              <span>⚙️ Gérer les tags</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
