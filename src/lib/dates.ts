/**
 * Utility to calculate calendar dates for the 2 upcoming future weeks:
 * - Semaine prochaine (+1)
 * - Semaine suivante (+2)
 * Weeks run from Saturday (Samedi) to Friday (Vendredi).
 * Strictly excludes the current week in progress.
 */

export interface WeekDateInfo {
  startDate: Date;
  endDate: Date;
  formattedRange: string;
  dayDates: Record<string, string>;
}

export function getUpcomingWeekDates(weekIndex: 1 | 2): WeekDateInfo {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

  // Distance until next Saturday (strictly next week)
  const daysUntilNextSaturday = ((6 - currentDayOfWeek + 7) % 7) || 7;

  // Week 1 (+1) starts next Saturday. Week 2 (+2) starts 7 days later.
  const weekStartOffset = daysUntilNextSaturday + (weekIndex === 2 ? 7 : 0);

  const saturday = new Date(now);
  saturday.setDate(now.getDate() + weekStartOffset);
  saturday.setHours(0, 0, 0, 0);

  const friday = new Date(saturday);
  friday.setDate(saturday.getDate() + 6);

  const dayKeys = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayDates: Record<string, string> = {};

  dayKeys.forEach((key, idx) => {
    const d = new Date(saturday);
    d.setDate(saturday.getDate() + idx);
    dayDates[key] = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  });

  const rangeFormat = `Du ${saturday.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })} au ${friday.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })}`;

  return {
    startDate: saturday,
    endDate: friday,
    formattedRange: rangeFormat,
    dayDates
  };
}
