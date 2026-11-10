import { AlertCircle, Check, Search, Sparkles, Tag, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

interface TagManagerModalProps {
  availableTags: string[];
  tagCounts: Record<string, number>;
  onDeleteTagGlobally: (tag: string) => Promise<void>;
  onClose: () => void;
}

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  availableTags,
  tagCounts,
  onDeleteTagGlobally,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const [tagToConfirmDelete, setTagToConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTags = availableTags.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleConfirmDelete = async (tag: string) => {
    try {
      setIsDeleting(true);
      await onDeleteTagGlobally(tag);
      setTagToConfirmDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Gestion des tags du carnet
              </h2>
              <p className="text-xs text-stone-700">
                {availableTags.length} tag{availableTags.length > 1 ? 's' : ''} actif{availableTags.length > 1 ? 's' : ''} dans vos recettes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Auto-Cleanup Callout */}
        <div className="p-4 sm:p-5 bg-amber-50/70 border-b border-amber-200/60">
          <div className="flex items-start gap-2.5 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Nettoyage automatique strict :</p>
              <p className="text-amber-800/90 mt-0.5 text-[11px] leading-relaxed">
                Les tags affichés ici sont uniquement ceux actuellement associés à au moins une recette de votre carnet. Dès qu&apos;un tag n&apos;est plus utilisé par aucune recette, il disparaît immédiatement et automatiquement de tous les filtres et sélections.
              </p>
            </div>
          </div>
        </div>

        {/* Search bar inside modal */}
        <div className="p-4 border-b border-stone-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer parmi les tags existants..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-stone-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tags List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2">
          {filteredTags.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs">
              Aucun tag ne correspond à votre recherche.
            </div>
          ) : (
            filteredTags.map((tag) => {
              const count = tagCounts[tag] || 0;
              const isConfirming = tagToConfirmDelete === tag;

              return (
                <div
                  key={tag}
                  className="flex items-center justify-between p-3 rounded-2xl border border-stone-200/90 hover:border-stone-300 bg-white hover:bg-stone-50/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-stone-800 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                      #{tag}
                    </span>
                    <span className="text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full font-mono">
                      {count} recette{count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div>
                    {isConfirming ? (
                      <div className="flex items-center gap-2 animate-in fade-in duration-150">
                        <span className="text-[11px] text-rose-600 font-medium hidden sm:inline">
                          Supprimer de {count} recette{count > 1 ? 's' : ''} ?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(tag)}
                          disabled={isDeleting}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-colors shadow-2xs"
                        >
                          Oui, supprimer
                        </button>
                        <button
                          type="button"
                          onClick={() => setTagToConfirmDelete(null)}
                          disabled={isDeleting}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTagToConfirmDelete(tag)}
                        className="text-stone-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        title={`Supprimer #${tag} de toutes les recettes`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Retirer partout</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/60 flex items-center justify-between">
          <p className="text-[11px] text-stone-700">
            Astuce : vous pouvez aussi retirer un tag directement dans l&apos;édition d&apos;une recette.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
