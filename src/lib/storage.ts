import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  Unsubscribe
} from 'firebase/firestore';
import { INITIAL_MEAL_PLANS, INITIAL_RECIPES } from '../data/seedRecipes';
import { DayKey, Recipe, WeekPlan } from '../types/recipe';
import { db, testConnection } from './firebase';

const LOCAL_STORAGE_RECIPES_KEY = 'audrey_recipes_v1';
const LOCAL_STORAGE_PLANS_KEY = 'audrey_meal_plans_v1';
const LOCAL_STORAGE_DELETED_KEY = 'audrey_deleted_recipe_ids_v1';
const LOCAL_STORAGE_SEEDED_KEY = 'audrey_seeded_v1';

/**
 * Returns the set of permanently deleted recipe IDs to prevent any accidental re-seeding.
 */
export function getDeletedRecipeIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch {
    // Ignore
  }
  return new Set();
}

export function markRecipeAsDeleted(recipeId: string): void {
  try {
    const set = getDeletedRecipeIds();
    set.add(recipeId);
    localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Failed saving deleted recipe id:', err);
  }
}

export function unmarkRecipeAsDeleted(recipeId: string): void {
  try {
    const set = getDeletedRecipeIds();
    if (set.has(recipeId)) {
      set.delete(recipeId);
      localStorage.setItem(LOCAL_STORAGE_DELETED_KEY, JSON.stringify(Array.from(set)));
    }
  } catch {
    // Ignore
  }
}

/**
 * Ensures recipes have clean, trimmed, hashtag-stripped tags and sound properties.
 */
export function sanitizeRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.map((r) => ({
    ...r,
    servings: r.servings !== undefined && r.servings !== null ? r.servings : '4,25 Pers',
    tags: Array.isArray(r.tags)
      ? Array.from(
          new Set(
            r.tags
              .map((t) => String(t || '').trim().replace(/^#/, ''))
              .filter(Boolean)
          )
        )
      : []
  }));
}

/**
 * Image helper: compresses a chosen file to an optimized Base64 Data URL.
 * Scales down to max 1200px width/height and quality 0.82 to fit easily under local/cloud storage limits.
 */
export async function optimizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Erreur lors du décodage de l’image.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Load local storage recipes with permanent deletion enforcement
 */
export function getLocalRecipes(): Recipe[] {
  const deletedIds = getDeletedRecipeIds();
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_RECIPES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((r: any) => r && r.id && !deletedIds.has(r.id));
        return sanitizeRecipes(filtered);
      }
    }
  } catch (err) {
    console.warn('Failed reading localStorage recipes:', err);
  }

  // Initial first seed only if never seeded before
  const isSeeded = localStorage.getItem(LOCAL_STORAGE_SEEDED_KEY);
  if (!isSeeded) {
    localStorage.setItem(LOCAL_STORAGE_SEEDED_KEY, 'true');
    const initialClean = INITIAL_RECIPES.filter((r) => !deletedIds.has(r.id));
    saveLocalRecipes(initialClean);
    return initialClean;
  }

  return [];
}

export function saveLocalRecipes(recipes: Recipe[]) {
  try {
    const deletedIds = getDeletedRecipeIds();
    const cleanList = sanitizeRecipes(recipes.filter((r) => !deletedIds.has(r.id)));
    localStorage.setItem(LOCAL_STORAGE_RECIPES_KEY, JSON.stringify(cleanList));
  } catch (err) {
    console.warn('Failed writing localStorage recipes:', err);
  }
}

/**
 * Load local storage meal plans with fallback
 */
export function getLocalMealPlans(): WeekPlan[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PLANS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Guarantee BOTH week 1 and week 2 exist distinctly
        const week1 = parsed.find((p: any) => p.weekIndex === 1 || p.id === 'week-1');
        const week2 = parsed.find((p: any) => p.weekIndex === 2 || p.id === 'week-2');

        const finalWeek1: WeekPlan = week1
          ? {
              ...week1,
              id: 'week-1',
              weekIndex: 1,
              title:
                week1.title === 'Semaine 1 (En cours)' || !week1.title
                  ? 'Semaine prochaine (+1)'
                  : week1.title
            }
          : (INITIAL_MEAL_PLANS[0] as WeekPlan);

        const finalWeek2: WeekPlan = week2
          ? {
              ...week2,
              id: 'week-2',
              weekIndex: 2,
              title:
                week2.title === 'Semaine 2 (À venir)' || !week2.title
                  ? 'Semaine suivante (+2)'
                  : week2.title
            }
          : (INITIAL_MEAL_PLANS[1] as WeekPlan);

        return [finalWeek1, finalWeek2];
      }
    }
  } catch (err) {
    console.warn('Failed reading localStorage plans:', err);
  }
  return INITIAL_MEAL_PLANS as WeekPlan[];
}

export function saveLocalMealPlans(plans: WeekPlan[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLANS_KEY, JSON.stringify(plans));
  } catch (err) {
    console.warn('Failed writing localStorage plans:', err);
  }
}

/**
 * Seed Firestore with initial recipes if database is totally empty
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  const path = 'recipes';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      const deletedIds = getDeletedRecipeIds();
      for (const recipe of INITIAL_RECIPES) {
        if (!deletedIds.has(recipe.id)) {
          await setDoc(doc(db, 'recipes', recipe.id), recipe);
        }
      }
      for (const plan of INITIAL_MEAL_PLANS) {
        await setDoc(doc(db, 'mealPlans', plan.id), plan);
      }
    }
    // Never backfill deleted recipes if collection is not empty!
  } catch {
    // Cloud seeding skipped, local storage holds the full seed
  }
}

/**
 * Subscribe to Recipes: Always loads immediately from local persistent store.
 * Also synchronizes with Firestore in background when accessible.
 */
export function subscribeToRecipes(
  onUpdate: (recipes: Recipe[], isOnline: boolean) => void
): Unsubscribe {
  const path = 'recipes';

  // 1. Instant local render
  const localData = getLocalRecipes();
  onUpdate(localData, true);

  // Background connection check & cloud seed
  testConnection().then((connected) => {
    if (connected) {
      seedFirestoreIfEmpty();
    }
  });

  // 2. Safe Firestore listener
  let unsubscribe: Unsubscribe = () => {};
  try {
    unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const deletedIds = getDeletedRecipeIds();
          const cloudRecipes: Recipe[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Recipe;
            if (data && data.id && !deletedIds.has(data.id)) {
              cloudRecipes.push(data);
            }
          });
          const sanitized = sanitizeRecipes(cloudRecipes);
          saveLocalRecipes(sanitized);
          onUpdate(sanitized, true);
        }
      },
      () => {
        // Fallback to local storage
        onUpdate(getLocalRecipes(), true);
      }
    );
  } catch {
    // Local storage stays active
  }

  return unsubscribe;
}

/**
 * Save or Update a Recipe: Guarantees immediate local persistence.
 * Also syncs to Cloud Firestore in background without throwing errors if no account exists.
 */
export async function saveRecipe(recipe: Recipe): Promise<void> {
  unmarkRecipeAsDeleted(recipe.id);

  // 1. Immediately save to persistent local storage
  const localList = getLocalRecipes();
  const existingIdx = localList.findIndex((r) => r.id === recipe.id);
  let updatedList: Recipe[];
  if (existingIdx >= 0) {
    updatedList = [...localList];
    updatedList[existingIdx] = recipe;
  } else {
    updatedList = [recipe, ...localList];
  }
  saveLocalRecipes(updatedList);

  // 2. Sync to Firestore in background without blocking
  try {
    await setDoc(doc(db, 'recipes', recipe.id), recipe);
  } catch (err) {
    console.info('Sauvegarde locale validée (synchronisation cloud facultative):', err);
  }
}

/**
 * Delete a Recipe: Permanently deletes locally and from Firestore.
 * Removes from meal planner and prevents any resurrection.
 */
export async function deleteRecipe(recipeId: string): Promise<void> {
  // 1. Mark permanently deleted
  markRecipeAsDeleted(recipeId);

  // 2. Remove immediately from local recipes
  const localList = getLocalRecipes();
  const filtered = localList.filter((r) => r.id !== recipeId);
  saveLocalRecipes(filtered);

  // 3. Remove references from meal plans
  try {
    const plans = getLocalMealPlans();
    let plansModified = false;
    const updatedPlans = plans.map((p) => {
      let modified = false;
      const days = { ...p.days };
      (Object.keys(days) as DayKey[]).forEach((dayKey) => {
        const slot = days[dayKey];
        if (slot) {
          if (slot.lunchRecipeId === recipeId) {
            days[dayKey] = { ...slot, lunchRecipeId: null };
            modified = true;
          }
          if (slot.dinnerRecipeId === recipeId) {
            days[dayKey] = { ...slot, dinnerRecipeId: null };
            modified = true;
          }
        }
      });
      if (modified) plansModified = true;
      return { ...p, days };
    });

    if (plansModified) {
      saveLocalMealPlans(updatedPlans);
      for (const p of updatedPlans) {
        await setDoc(doc(db, 'mealPlans', p.id), p).catch(() => {});
      }
    }
  } catch {
    // Non-blocking
  }

  // 4. Background Firestore deletion
  try {
    await deleteDoc(doc(db, 'recipes', recipeId));
  } catch (err) {
    console.info('Suppression locale validée:', err);
  }
}

/**
 * Subscribe to Meal Plans (2 weeks)
 */
export function subscribeToMealPlans(
  onUpdate: (plans: WeekPlan[], isOnline: boolean) => void
): Unsubscribe {
  const path = 'mealPlans';

  // 1. Load local plans immediately
  const localPlans = getLocalMealPlans();
  onUpdate(localPlans, true);

  // 2. Background Firestore listener
  let unsubscribe: Unsubscribe = () => {};
  try {
    unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudPlans: WeekPlan[] = [];
          snapshot.forEach((docSnap) => {
            cloudPlans.push(docSnap.data() as WeekPlan);
          });
          cloudPlans.sort((a, b) => a.weekIndex - b.weekIndex);
          saveLocalMealPlans(cloudPlans);
          onUpdate(cloudPlans, true);
        }
      },
      () => {
        onUpdate(getLocalMealPlans(), true);
      }
    );
  } catch {
    // Local storage stays active
  }

  return unsubscribe;
}

/**
 * Save Meal Plan: Immediately persists locally, syncs to Firestore in background.
 */
export async function saveMealPlan(plan: WeekPlan): Promise<void> {
  const current = getLocalMealPlans();
  const targetId = plan.weekIndex === 1 ? 'week-1' : 'week-2';
  const normalizedPlan: WeekPlan = {
    ...plan,
    id: targetId,
    weekIndex: plan.weekIndex === 1 ? 1 : 2,
    title:
      plan.title === 'Semaine 1 (En cours)' || !plan.title
        ? plan.weekIndex === 1
          ? 'Semaine prochaine (+1)'
          : 'Semaine suivante (+2)'
        : plan.title === 'Semaine 2 (À venir)'
        ? 'Semaine suivante (+2)'
        : plan.title
  };

  const updated: WeekPlan[] = [
    normalizedPlan.weekIndex === 1 ? normalizedPlan : current[0],
    normalizedPlan.weekIndex === 2 ? normalizedPlan : current[1]
  ];

  saveLocalMealPlans(updated);

  // Background Firestore sync
  try {
    await setDoc(doc(db, 'mealPlans', normalizedPlan.id), normalizedPlan);
  } catch (err) {
    console.info('Planning sauvegardé localement:', err);
  }
}
