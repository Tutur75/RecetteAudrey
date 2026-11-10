import {
  AlertCircle,
  Camera,
  Check,
  ChevronDown,
  ImageIcon,
  Link,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SEASONS } from '../lib/seasons';
import { optimizeImageFile } from '../lib/storage';
import {
  CATEGORY_METADATA,
  INGREDIENT_CATEGORIES,
  Ingredient,
  normalizeIngredientCategory,
  Recipe,
  Season
} from '../types/recipe';

interface RecipeFormModalProps {
  recipe?: Recipe | null; // null for new recipe
  initialSeason?: Season;
  existingTags?: string[];
  onSave: (recipe: Recipe) => Promise<void>;
  onDelete?: (recipeId: string) => Promise<void>;
  onClose: () => void;
}

const CURATED_FOOD_PHOTOS = [
  { label: 'Risotto asperges', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Velouté potimarron', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Bœuf bourguignon', url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Ratatouille', url: 'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Saumon croustillant', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tarte aux fraises', url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tarte Tatin', url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gratin dauphinois', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Brochettes grillées', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Salade fraîcheur', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a88?auto=format&fit=crop&w=1200&q=80' }
];

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  recipe,
  initialSeason = 'autumn',
  existingTags = [],
  onSave,
  onDelete,
  onClose
}) => {
  const isEditing = !!recipe;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(recipe?.title || '');
  
  // Multi-season state
  const initialSeasons: Season[] = recipe?.seasons?.length
    ? recipe.seasons
    : recipe?.season
    ? [recipe.season]
    : [initialSeason];
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(initialSeasons);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const seasonDropdownRef = useRef<HTMLDivElement>(null);

  // Close season dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (seasonDropdownRef.current && !seasonDropdownRef.current.contains(event.target as Node)) {
        setIsSeasonDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSeason = (s: Season) => {
    if (selectedSeasons.includes(s)) {
      if (selectedSeasons.length === 1) {
        setErrorMsg('La recette doit être associée à au moins une saison.');
        return;
      }
      setSelectedSeasons(selectedSeasons.filter((item) => item !== s));
    } else {
      setSelectedSeasons([...selectedSeasons, s]);
    }
    setErrorMsg(null);
  };

  const [prepTime, setPrepTime] = useState<number>(recipe?.prepTime || 20);
  const [cookTime, setCookTime] = useState<number>(recipe?.cookTime || 0);
  const [servings, setServings] = useState<string>(
    recipe?.servings !== undefined && recipe?.servings !== null ? String(recipe.servings) : '4,25 Pers'
  );
  const [difficulty, setDifficulty] = useState<'Facile' | 'Moyen' | 'Difficile'>(recipe?.difficulty || 'Facile');
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl || CURATED_FOOD_PHOTOS[0].url);
  const [notes, setNotes] = useState(recipe?.notes || '');
  
  // Tags state & dynamic pool derived strictly from recipes in the notebook
  const [tags, setTags] = useState<string[]>(() => {
    if (!recipe?.tags) return [];
    return Array.from(new Set(recipe.tags.map((t) => t.trim().replace(/^#/, '')).filter(Boolean)));
  });
  const [newTagInput, setNewTagInput] = useState('');
  const [sessionCreatedTags, setSessionCreatedTags] = useState<string[]>([]);

  // Only tags that are actively present in other recipes in the notebook (or added in this session and still selected)
  const existingNotebookTags = useMemo(() => {
    const set = new Set<string>();
    (existingTags || []).forEach((t) => {
      const clean = t.trim().replace(/^#/, '');
      if (clean) set.add(clean);
    });
    sessionCreatedTags.forEach((t) => {
      if (tags.includes(t)) {
        set.add(t);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [existingTags, sessionCreatedTags, tags]);

  // Tags available to add that are not already attached to this recipe
  const tagsAvailableToAdd = useMemo(() => {
    return existingNotebookTags.filter((t) => !tags.includes(t));
  }, [existingNotebookTags, tags]);

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients?.length
      ? recipe.ingredients.map((ing) => ({
          ...ing,
          category: normalizeIngredientCategory(ing.category, ing.name)
        }))
      : [
          { id: '1', name: 'Beurre demi-sel', amount: '30', unit: 'g', category: 'Laiterie & Fromage' },
          { id: '2', name: 'Échalotes', amount: '2', unit: 'pièces', category: 'Fruits & Légumes' }
        ]
  );

  const [instructions, setInstructions] = useState<string[]>(
    recipe?.instructions?.length
      ? recipe.instructions
      : ['Préparer tous les ingrédients et tailler les légumes.', 'Faire cuire à feu doux dans une cocotte.']
  );

  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez sélectionner un fichier image valide.');
      return;
    }

    try {
      setIsCompressingPhoto(true);
      setErrorMsg(null);
      const optimized = await optimizeImageFile(file);
      setImageUrl(optimized);
    } catch (err) {
      console.error(err);
      setErrorMsg('Impossible de traiter cette image.');
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  // Ingredient handlers
  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        amount: '1',
        unit: 'pièce',
        category: 'Fruits & Légumes'
      }
    ]);
  };

  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // Instruction step handlers
  const handleAddStep = () => {
    setInstructions((prev) => [...prev, '']);
  };

  const handleUpdateStep = (index: number, text: string) => {
    setInstructions((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  const handleRemoveStep = (index: number) => {
    setInstructions((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Tag handlers
  const handleAddCustomTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (!trimmed) return;

    if (!sessionCreatedTags.includes(trimmed)) {
      setSessionCreatedTags((prev) => [...prev, trimmed]);
    }

    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }

    setNewTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
    setSessionCreatedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const addTag = (tagToAdd: string) => {
    if (!tags.includes(tagToAdd)) {
      setTags((prev) => [...prev, tagToAdd]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Veuillez donner un titre à la recette.');
      return;
    }

    if (selectedSeasons.length === 0) {
      setErrorMsg('Veuillez sélectionner au moins une saison pour cette recette.');
      return;
    }

    const filteredIngredients = ingredients.filter((i) => i.name.trim().length > 0);
    if (filteredIngredients.length === 0) {
      setErrorMsg('Veuillez ajouter au moins un ingrédient.');
      return;
    }

    const filteredSteps = instructions.filter((s) => s.trim().length > 0);
    if (filteredSteps.length === 0) {
      setErrorMsg('Veuillez ajouter au moins une étape de préparation.');
      return;
    }

    // Automatically clean up tags (trim, deduplicate, strip #)
    const cleanedTags = Array.from(
      new Set(
        tags
          .map((t) => t.trim().replace(/^#/, ''))
          .filter((t) => t.length > 0)
      )
    );

    try {
      setIsSaving(true);
      setErrorMsg(null);

      const payload: Recipe = {
        id: recipe?.id || `rec-${Date.now()}`,
        title: title.trim(),
        season: selectedSeasons[0] || 'autumn',
        seasons: selectedSeasons,
        prepTime: Number(prepTime) || 15,
        cookTime: Number(cookTime) || 0,
        servings: servings.trim() || '4,25 Pers',
        difficulty,
        tags: cleanedTags,
        ingredients: filteredIngredients,
        instructions: filteredSteps,
        notes: notes.trim(),
        imageUrl: imageUrl || CURATED_FOOD_PHOTOS[0].url,
        rating: recipe?.rating || 5,
        createdAt: recipe?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de l’enregistrement de la recette.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {isEditing ? 'Modifier la recette' : 'Créer une nouvelle recette'}
            </h2>
            <p className="text-xs text-stone-700">
              Édition complète : ingrédients, saisons, astuces d&apos;Audrey et photo HD
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-7">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Season */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Titre de la recette *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Velouté onctueux de butternut et noisettes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-stone-900 font-medium text-base"
              />
            </div>

            <div className="md:col-span-4 relative" ref={seasonDropdownRef}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
                <span>Saisons associées *</span>
                <span className="text-[11px] font-normal text-amber-700 lowercase">
                  ({selectedSeasons.length} sélectionnée{selectedSeasons.length > 1 ? 's' : ''})
                </span>
              </label>

              {/* Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-xl border border-stone-300 hover:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-stone-900 bg-white flex items-center justify-between gap-2 text-left transition-colors cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-1.5 flex-wrap flex-1">
                  {selectedSeasons.length === 0 ? (
                    <span className="text-stone-400 text-sm">Choisir les saisons...</span>
                  ) : (
                    selectedSeasons.map((s) => {
                      const sInfo = SEASONS[s];
                      return (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/90 font-medium"
                        >
                          <span>{sInfo.emoji}</span>
                          <span>{sInfo.label}</span>
                        </span>
                      );
                    })
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isSeasonDropdownOpen ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>

              {/* Multi-Season Dropdown Menu */}
              {isSeasonDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-100 flex items-center justify-between">
                    <span>Cochez les saisons (choix multiples)</span>
                    <span className="text-[10px] font-normal text-stone-700 lowercase">min. 1</span>
                  </div>

                  {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map((seasonKey) => {
                    const seasonInfo = SEASONS[seasonKey];
                    const isChecked = selectedSeasons.includes(seasonKey);

                    return (
                      <button
                        type="button"
                        key={seasonKey}
                        onClick={() => toggleSeason(seasonKey)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
                          isChecked
                            ? 'bg-amber-50/90 text-amber-950 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg leading-none">{seasonInfo.emoji}</span>
                          <span>{seasonInfo.label}</span>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-orange-600 border-orange-600 text-white shadow-2xs'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}

                  <div className="pt-1.5 px-2 text-[10px] text-stone-700 border-t border-stone-100 flex items-center justify-between">
                    <span>Ex: Automne + Hiver</span>
                    <button
                      type="button"
                      onClick={() => setIsSeasonDropdownOpen(false)}
                      className="text-orange-700 font-semibold hover:underline"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Management Section */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-orange-600" />
                Photo haute définition du plat
              </label>
              <button
                type="button"
                onClick={() => setShowGallery(!showGallery)}
                className="text-xs font-medium text-orange-700 hover:text-orange-800 underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showGallery ? 'Masquer la galerie' : 'Choisir dans la galerie culinaire HD'}
              </button>
            </div>

            {/* Photo preview and actions */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300 shadow-xs">
                {imageUrl ? (
                  <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs mt-1">Aucune photo</span>
                  </div>
                )}
                {isCompressingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-medium">
                    Optimisation...
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 w-full">
                {/* File upload button */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressingPhoto}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-2xs transition-colors"
                  >
                    <Upload className="w-4 h-4 text-orange-600" />
                    <span>Importer une photo depuis l’ordinateur / mobile</span>
                  </button>
                  <p className="text-[11px] text-stone-700 mt-1">
                    Format JPG, PNG, WebP. L’image est automatiquement optimisée en haute définition.
                  </p>
                </div>

                {/* Direct image URL input */}
                <div>
                  <div className="flex items-center gap-2">
                    <Link className="w-3.5 h-3.5 text-stone-600" />
                    <span className="text-xs text-stone-700 font-medium">Ou URL d’image web :</span>
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Curated Gallery Picker Drawer */}
            {showGallery && (
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Galerie de photos gastronomiques sélectionnées :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {CURATED_FOOD_PHOTOS.map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => {
                        setImageUrl(item.url);
                        setShowGallery(false);
                      }}
                      className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all group ${
                        imageUrl === item.url ? 'border-orange-600 ring-2 ring-orange-500/30' : 'border-transparent hover:border-stone-400'
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metrics: Prep time, cook time, servings, difficulty */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Préparation (min)
              </label>
              <input
                type="number"
                min="0"
                max="360"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Cuisson (min)
              </label>
              <input
                type="number"
                min="0"
                max="720"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Portions (champ libre)
              </label>
              <input
                type="text"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="Ex: 4,25 Pers, 4 à 6, 8 parts, 12 biscuits..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-white placeholder:font-normal placeholder:text-stone-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Difficulté
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-white"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Ingrédients ({ingredients.length}) *
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un ingrédient</span>
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={ing.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nom (ex: Asperges vertes)"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                    className="flex-3 px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Qté (ex: 250)"
                    value={ing.amount}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'amount', e.target.value)}
                    className="w-20 px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Unité (g, botte...)"
                    value={ing.unit || ''}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                    className="w-24 px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                  <select
                    value={normalizeIngredientCategory(ing.category, ing.name)}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'category', e.target.value)}
                    className="w-40 sm:w-48 px-2.5 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 font-medium shrink-0"
                    title="Catégorie d'ingrédient pour la liste de courses"
                  >
                    {INGREDIENT_CATEGORIES.map((cat) => {
                      const meta = CATEGORY_METADATA[cat];
                      return (
                        <option key={cat} value={cat}>
                          {meta.emoji} {cat}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Étapes de préparation ({instructions.length}) *
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une étape</span>
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 mt-2">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={step}
                    onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    placeholder={`Étape ${idx + 1}...`}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audrey's Personal Notes & Wine pairing */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Astuces et notes personnelles d&apos;Audrey
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Astuce d'Audrey : Ajouter une pincée de piment d'Espelette en fin de cuisson. Idéal avec un verre de Crozes-Hermitage."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
            />
          </div>

          {/* Tags Section */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <span>Tags et mots-clés</span>
                <span className="text-[11px] font-normal text-amber-800 lowercase">
                  ({tags.length} associé{tags.length > 1 ? 's' : ''})
                </span>
              </label>
              {tags.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setTags([]);
                    setSessionCreatedTags([]);
                  }}
                  className="text-[11px] text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Tout retirer de cette recette
                </button>
              )}
            </div>

            {/* Active Selected Tags Chips */}
            <div>
              <span className="text-[11px] font-medium text-stone-600 block mb-1.5">
                Tags associés à cette recette :
              </span>
              {tags.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-1">
                  Aucun tag pour cette recette. Cliquez sur un tag du carnet ci-dessous ou créez-en un nouveau.
                </p>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold bg-amber-600 text-white shadow-xs"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        title={`Retirer #${tag}`}
                        className="w-4 h-4 rounded-full hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer text-amber-100 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Other Existing Notebook Tags to pick from */}
            {tagsAvailableToAdd.length > 0 && (
              <div className="pt-2 border-t border-stone-200/70">
                <span className="text-[11px] font-medium text-stone-600 block mb-2">
                  Tags existants dans votre carnet ({tagsAvailableToAdd.length}) — cliquez pour ajouter :
                </span>
                <div className="flex items-center gap-2 flex-wrap max-h-36 overflow-y-auto pr-1">
                  {tagsAvailableToAdd.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="text-xs px-3 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1 bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-stone-400" />
                      <span>#{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Tag Input */}
            <div className="pt-2 border-t border-stone-200/70">
              <span className="text-[11px] font-medium text-stone-600 block mb-1.5">
                Créer un nouveau tag :
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  placeholder="Ex: Anti-gaspi, Batch cooking, Sans lactose..."
                  className="flex-1 max-w-sm px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter ce tag</span>
                </button>
              </div>

              {/* Automatic Cleanup Explanation Note */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 flex items-start gap-2">
                <span className="text-sm">✨</span>
                <p>
                  <strong>Nettoyage automatique :</strong> Les tags sont strictement synchronisés avec vos recettes. Dès qu&apos;un tag n&apos;est plus utilisé par aucune recette, il disparaît automatiquement du carnet et des filtres de recherche.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions (Save, Delete, Cancel) */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between gap-3">
            {isEditing && onDelete && (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 font-medium">Confirmer ?</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await onDelete(recipe.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                    >
                      Oui, supprimer définitivement
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer cette recette</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-600/25 transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la recette'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
