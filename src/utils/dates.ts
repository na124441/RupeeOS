export function getCurrentDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthName(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function getDaysInMonth(monthKey: string): number {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-based, passing month as 1-based to day 0 gets last day of month
  return new Date(year, month, 0).getDate();
}

export function getDaysRemainingInMonth(monthKey: string, currentDateStr: string = getCurrentDateStr()): number {
  const daysTotal = getDaysInMonth(monthKey);
  const currentMonth = getCurrentMonthKey();

  if (monthKey < currentMonth) {
    return 0; // Past month
  }
  if (monthKey > currentMonth) {
    return daysTotal; // Future month
  }

  // Current month
  const currentDay = parseInt(currentDateStr.split('-')[2], 10);
  const remaining = daysTotal - currentDay;
  return Math.max(1, remaining); // At least 1 day remaining (today inclusive/fraction)
}

export function getDaysElapsedInMonth(monthKey: string, currentDateStr: string = getCurrentDateStr()): number {
  const daysTotal = getDaysInMonth(monthKey);
  const currentMonth = getCurrentMonthKey();

  if (monthKey < currentMonth) {
    return daysTotal;
  }
  if (monthKey > currentMonth) {
    return 0;
  }

  const currentDay = parseInt(currentDateStr.split('-')[2], 10);
  return Math.min(daysTotal, Math.max(1, currentDay));
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function getRelativeDayDescription(dueDay: number): string {
  const today = new Date().getDate();
  const diff = dueDay - today;

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1 && diff <= 7) return `In ${diff} days`;
  if (diff < 0) return `Paid for this month`;
  return `On ${dueDay}th`;
}
