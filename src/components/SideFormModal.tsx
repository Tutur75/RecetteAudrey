import {
  AlertCircle,
  Camera,
  Check,
  Link,
  Plus,
  Trash2,
  Upload,
  Utensils,
  X
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { optimizeImageFile } from '../lib/storage';
import {
  CATEGORY_METADATA,
  DEFAULT_RECIPE_IMAGE,
  getRecipeImageUrl,
  INGREDIENT_CATEGORIES,
  INGREDIENT_UNITS,
  Ingredient,
  isDefaultRecipeImage,
  normalizeIngredientCategory,
  Recipe
} from '../types/recipe';

interface SideFormModalProps {
  side?: Recipe | null; // null for new accompaniment
  isDuplicate?: boolean;
  onSave: (side: Recipe) => Promise<void>;
  onDelete?: (sideId: string) => Promise<void>;
  onClose: () => void;
}

export const SideFormModal: React.FC<SideFormModalProps> = ({
  side,
  isDuplicate = false,
  onSave,
  onDelete,
  onClose
}) => {
  const isEditing = !!side && !isDuplicate;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(
    side ? (isDuplicate ? `${side.title} (copie)` : side.title) : ''
  );
  const [prepTime, setPrepTime] = useState<number>(side?.prepTime ?? 5);
  const [cookTime, setCookTime] = useState<number>(side?.cookTime ?? 10);
  const [servings, setServings] = useState<string>(
    side?.servings !== undefined && side?.servings !== null ? String(side.servings) : '4,25 Pers'
  );
  const [imageUrl, setImageUrl] = useState(side?.imageUrl || DEFAULT_RECIPE_IMAGE);
  const [notes, setNotes] = useState(side?.notes || '');

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    side?.ingredients?.length
      ? side.ingredients.map((ing, idx) => ({
          ...ing,
          id: isDuplicate ? `${Date.now()}-${idx}` : ing.id,
          category: normalizeIngredientCategory(ing.category, ing.name)
        }))
      : []
  );

  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        name: '',
        amount: '1',
        unit: 'G',
        category: 'Pâtes Riz & Produits secs'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Veuillez donner un nom à cet accompagnement.');
      return;
    }

    const filteredIngredients = ingredients.filter((i) => i.name.trim().length > 0);

    try {
      setIsSaving(true);
      setErrorMsg(null);

      const payload: Recipe = {
        id: isEditing && side ? side.id : `side-${Date.now()}`,
        title: title.trim(),
        season: 'autumn',
        seasons: ['spring', 'summer', 'autumn', 'winter'],
        prepTime: Math.max(0, Number(prepTime) || 0),
        cookTime: Math.max(0, Number(cookTime) || 0),
        servings: servings.trim() || '4,25 Pers',
        difficulty: 'Facile',
        tags: [],
        ingredients: filteredIngredients,
        instructions: [],
        notes: notes.trim(),
        imageUrl: imageUrl.trim() || DEFAULT_RECIPE_IMAGE,
        isSide: true,
        rating: side?.rating || 5,
        createdAt: isEditing && side ? side.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur lors de l’enregistrement de l’accompagnement.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-emerald-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                {isDuplicate
                  ? 'Dupliquer l’accompagnement'
                  : isEditing
                  ? 'Modifier l’accompagnement'
                  : 'Nouvel accompagnement'}
              </h2>
              <p className="text-xs text-stone-600">
                Fiche simplifiée : ingrédient(s), portions, note rapide et photo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Nom de l&apos;accompagnement *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Riz, Frites Maison, Haricot Vert, Saumon frais..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 text-stone-900 font-medium text-base"
            />
          </div>

          {/* Photo Section */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                Photo (facultatif)
              </label>
              {!isDefaultRecipeImage(imageUrl) && (
                <button
                  type="button"
                  onClick={() => setImageUrl(DEFAULT_RECIPE_IMAGE)}
                  className="text-xs font-medium text-stone-600 hover:text-rose-600 underline cursor-pointer"
                >
                  Remettre la photo par défaut
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-300 shadow-xs">
                <img
                  src={getRecipeImageUrl(imageUrl)}
                  alt="Aperçu"
                  className={`w-full h-full ${
                    isDefaultRecipeImage(imageUrl) ? 'object-contain p-2.5 bg-white' : 'object-cover'
                  }`}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.includes('nophoto_20bdedd4.jpg')) {
                      img.src = DEFAULT_RECIPE_IMAGE;
                    }
                  }}
                />
                {isCompressingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-medium">
                    Optimisation...
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2.5 w-full">
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
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Importer une photo</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Link className="w-3 h-3 text-stone-500" />
                    <span className="text-[11px] text-stone-600 font-medium">Ou URL d’image web :</span>
                  </div>
                  <input
                    type="text"
                    value={isDefaultRecipeImage(imageUrl) ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Portions & Times */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Portions
              </label>
              <input
                type="text"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="4,25 Pers"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Prépa (min)
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
          </div>

          {/* Simple Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-200">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Ingrédients pour les courses ({ingredients.length})
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un ingrédient</span>
              </button>
            </div>

            {ingredients.length === 0 ? (
              <div className="p-4 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
                <p className="text-xs text-stone-600">
                  Aucun ingrédient ajouté. Ajoutez l&apos;ingrédient principal pour qu&apos;il apparaisse automatiquement dans votre liste de courses.
                </p>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-emerald-500 text-xs font-semibold text-emerald-700 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un ingrédient</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {ingredients.map((ing) => (
                  <div key={ing.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ingrédient (ex: Riz)"
                      value={ing.name}
                      onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                      className="flex-1 min-w-[140px] px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Qté"
                      value={ing.amount}
                      onChange={(e) => handleUpdateIngredient(ing.id, 'amount', e.target.value)}
                      className="w-20 px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                    <select
                      value={ing.unit || ''}
                      onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                      className="w-24 px-2 py-2 rounded-xl border border-stone-300 text-sm bg-white text-stone-900 font-medium shrink-0"
                    >
                      <option value="">Unité...</option>
                      {ing.unit &&
                        !(INGREDIENT_UNITS as readonly string[]).includes(ing.unit) && (
                          <option value={ing.unit}>{ing.unit}</option>
                        )}
                      {INGREDIENT_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <select
                      value={normalizeIngredientCategory(ing.category, ing.name)}
                      onChange={(e) => handleUpdateIngredient(ing.id, 'category', e.target.value)}
                      className="w-40 px-2 py-2 rounded-xl border border-stone-300 text-xs bg-white text-stone-800 font-medium shrink-0"
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
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Note rapide / Cuisson (facultatif)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: 10 min à l'eau bouillante salée..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-5 border-t border-stone-200 flex items-center justify-between gap-3">
            {isEditing && onDelete && side && (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 font-medium">Confirmer ?</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await onDelete(side.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                    >
                      Oui, supprimer
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1.5 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
