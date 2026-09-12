import { EssentialItem, Goal, MonthlyPlan, Subscription, Transaction } from '../types';

export interface RupeeOSBackupData {
  version: string;
  exportedAt: string;
  plans: Record<string, MonthlyPlan>;
  transactions: Transaction[];
  essentials: EssentialItem[];
  goals: Goal[];
  subscriptions: Subscription[];
}

export function exportToJson(data: RupeeOSBackupData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rupeeos_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTransactionsToCsv(transactions: Transaction[]): void {
  const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Merchant', 'Note'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type,
    t.categoryId,
    t.amount.toString(),
    `"${(t.merchant || '').replace(/"/g, '""')}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rupeeos_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportEssentialsToCsv(essentials: EssentialItem[]): void {
  const headers = ['ID', 'Month', 'Item Name', 'Quantity', 'Unit', 'Estimated Cost', 'Actual Cost', 'Status', 'Provider'];
  const rows = essentials.map(e => [
    e.id,
    e.monthKey,
    `"${e.name.replace(/"/g, '""')}"`,
    e.quantity,
    e.unit,
    e.estimatedCost.toString(),
    (e.actualCost || '').toString(),
    e.isPurchased ? 'Purchased' : 'Pending',
    e.preferredProvider,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rupeeos_essentials_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseJsonBackupFile(file: File): Promise<RupeeOSBackupData> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
    throw new Error('Invalid RupeeOS backup format');
  }
  return parsed as RupeeOSBackupData;
}
