/**
 * Utility to calculate calendar dates for the 2 upcoming future weeks:
 * - Semaine prochaine (+1)
 * - Semaine suivante (+2)
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
  const currentDayOfWeek = now.getDay(); // 0 = Dimanche, 1 = Lundi, ...

  // Distance until next Monday (strictly next week)
  const daysUntilNextMonday = ((1 - currentDayOfWeek + 7) % 7) || 7;

  // Week 1 (+1) starts next Monday. Week 2 (+2) starts 7 days later.
  const weekStartOffset = daysUntilNextMonday + (weekIndex === 2 ? 7 : 0);

  const monday = new Date(now);
  monday.setDate(now.getDate() + weekStartOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayDates: Record<string, string> = {};

  dayKeys.forEach((key, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    dayDates[key] = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  });

  const rangeFormat = `Du ${monday.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })} au ${sunday.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })}`;

  return {
    startDate: monday,
    endDate: sunday,
    formattedRange: rangeFormat,
    dayDates
  };
}
