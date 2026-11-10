import { Season } from '../types/recipe';

export interface SeasonalProduct {
  name: string;
  emoji: string;
}

export interface SeasonInfo {
  key: Season;
  label: string;
  emoji: string;
  dates: string;
  description: string;
  colorClass: string;
  bgLightClass: string;
  accentClass: string;
  gradient: string;
  borderClass: string;
  produce: SeasonalProduct[];
}

export const SEASONS: Record<Season, SeasonInfo> = {
  spring: {
    key: 'spring',
    label: 'Printemps',
    emoji: '🌸',
    dates: '21 mars — 20 juin',
    description: 'Fraîcheur, herbes aromatiques, petits pois, asperges et premières fraises.',
    colorClass: 'text-emerald-700',
    bgLightClass: 'bg-emerald-50/70',
    accentClass: 'bg-emerald-600 text-white',
    gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
    borderClass: 'border-emerald-200 hover:border-emerald-400',
    produce: [
      { name: 'Asperges', emoji: '🌱' },
      { name: 'Fraises Gariguette', emoji: '🍓' },
      { name: 'Petits pois', emoji: '🫛' },
      { name: 'Fèves fraîches', emoji: '🫘' },
      { name: 'Radis croquants', emoji: '🥗' },
      { name: 'Épinards frais', emoji: '🥬' },
      { name: 'Carottes fanes', emoji: '🥕' },
      { name: 'Artichauts', emoji: '🌿' },
      { name: 'Morilles', emoji: '🍄' },
      { name: 'Ciboulette & Menthe', emoji: '🌱' }
    ]
  },
  summer: {
    key: 'summer',
    label: 'Été',
    emoji: '☀️',
    dates: '21 juin — 22 septembre',
    description: 'Soleil, légumes gorgés de lumière, tomates anciennes, grillades et fruits juteux.',
    colorClass: 'text-amber-700',
    bgLightClass: 'bg-amber-50/70',
    accentClass: 'bg-amber-600 text-white',
    gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
    borderClass: 'border-amber-200 hover:border-amber-400',
    produce: [
      { name: 'Tomates anciennes', emoji: '🍅' },
      { name: 'Courgettes & fleurs', emoji: '🥒' },
      { name: 'Aubergines', emoji: '🍆' },
      { name: 'Poivrons doux', emoji: '🫑' },
      { name: 'Pêches & Nectarines', emoji: '🍑' },
      { name: 'Melon de Cavaillon', emoji: '🍈' },
      { name: 'Abricots', emoji: '🍊' },
      { name: 'Haricots verts', emoji: '🥬' },
      { name: 'Basilic frais', emoji: '🌿' },
      { name: 'Cerises', emoji: '🍒' }
    ]
  },
  autumn: {
    key: 'autumn',
    label: 'Automne',
    emoji: '🍂',
    dates: '23 septembre — 20 décembre',
    description: 'Chaleur réconfortante, champignons sauvages, courges, châtaignes et pommes au four.',
    colorClass: 'text-orange-800',
    bgLightClass: 'bg-orange-50/70',
    accentClass: 'bg-orange-700 text-white',
    gradient: 'from-orange-600/15 via-amber-600/10 to-transparent',
    borderClass: 'border-orange-200 hover:border-orange-400',
    produce: [
      { name: 'Potimarron & Butternut', emoji: '🎃' },
      { name: 'Cèpes & Bolets', emoji: '🍄' },
      { name: 'Châtaignes', emoji: '🌰' },
      { name: 'Pommes & Poires', emoji: '🍎' },
      { name: 'Noix de Grenoble', emoji: '🥜' },
      { name: 'Poireaux d\'automne', emoji: '🧅' },
      { name: 'Raisin frais', emoji: '🍇' },
      { name: 'Figues violettes', emoji: '🫐' },
      { name: 'Betteraves rôties', emoji: '🍠' },
      { name: 'Chou vert frisé', emoji: '🥬' }
    ]
  },
  winter: {
    key: 'winter',
    label: 'Hiver',
    emoji: '❄️',
    dates: '21 décembre — 20 mars',
    description: 'Mijotés généreux, gratins dorés, soupes fumantes et agrumes vitaminés.',
    colorClass: 'text-sky-800',
    bgLightClass: 'bg-sky-50/70',
    accentClass: 'bg-sky-700 text-white',
    gradient: 'from-sky-600/15 via-indigo-600/10 to-transparent',
    borderClass: 'border-sky-200 hover:border-sky-400',
    produce: [
      { name: 'Panais & Racines', emoji: '🥕' },
      { name: 'Choux & Bruxelles', emoji: '🥬' },
      { name: 'Clémentines de Corse', emoji: '🍊' },
      { name: 'Poireaux d\'hiver', emoji: '🧅' },
      { name: 'Courges d\'hiver', emoji: '🎃' },
      { name: 'Oranges & Citrons', emoji: '🍋' },
      { name: 'Endives croquantes', emoji: '🥗' },
      { name: 'Mâche nantaise', emoji: '🥬' },
      { name: 'Pommes de terre', emoji: '🥔' },
      { name: 'Truffes & Morilles', emoji: '🍄' }
    ]
  }
};

/**
 * Returns current season based on given date (default today).
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  const day = date.getDate();

  // Spring: March 21 (month 2, day 21) to June 20 (month 5, day 20)
  if ((month === 2 && day >= 21) || month === 3 || month === 4 || (month === 5 && day <= 20)) {
    return 'spring';
  }
  // Summer: June 21 (month 5, day 21) to September 22 (month 8, day 22)
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day <= 22)) {
    return 'summer';
  }
  // Autumn: September 23 (month 8, day 23) to December 20 (month 11, day 20)
  if ((month === 8 && day >= 23) || month === 9 || month === 10 || (month === 11 && day <= 20)) {
    return 'autumn';
  }
  // Winter: December 21 to March 20
  return 'winter';
}
