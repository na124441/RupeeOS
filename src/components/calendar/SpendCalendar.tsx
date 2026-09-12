import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupee } from '../../utils/currency';
import { getDaysInMonth } from '../../utils/dates';
import { CategoryIcon } from '../common/CategoryIcon';
import { Calendar, TrendingDown } from 'lucide-react';
import { Transaction } from '../../types';
import { Card } from '../ui/Card';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const SpendCalendar: React.FC = () => {
  const { activeMonth, plan, transactions } = useFinance();
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return activeMonth === currentMonth ? now.getDate() : 1;
  });

  const daysTotal = getDaysInMonth(activeMonth);
  const [yearStr, monthStr] = activeMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  const firstDayObj = new Date(year, monthIndex, 1);
  const startDayOffset = (firstDayObj.getDay() + 6) % 7; // Monday = 0

  const dailySpendMap: Record<number, number> = {};
  const dailyTransactionsMap: Record<number, Transaction[]> = {};

  const monthExpenses = transactions.filter((t) => t.date.startsWith(activeMonth));

  for (const t of monthExpenses) {
    const day = parseInt(t.date.split('-')[2], 10);
    if (!dailyTransactionsMap[day]) {
      dailyTransactionsMap[day] = [];
    }
    dailyTransactionsMap[day].push(t);

    if (t.type === 'expense') {
      dailySpendMap[day] = (dailySpendMap[day] || 0) + t.amount;
    }
  }

  const getHeatmapClass = (day: number, amount: number) => {
    if (!amount || amount === 0)
      return 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] bg-[var(--bg-surface)] text-[var(--text-muted)]';
    if (amount <= 200)
      return 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:border-emerald-400';
    if (amount <= 500)
      return 'border-amber-500/30 bg-amber-950/25 text-amber-300 hover:border-amber-400';
    return 'border-rose-500/30 bg-rose-950/30 text-rose-300 hover:border-rose-400';
  };

  const selectedDayTransactions = selectedDay ? dailyTransactionsMap[selectedDay] || [] : [];
  const selectedDaySpend = selectedDay ? dailySpendMap[selectedDay] || 0 : 0;

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
          Calendar Heatmap
        </span>
        <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5 mt-0.5">
          <Calendar size={24} className="text-[var(--accent-primary)]" />
          <span>Spending Calendar & Day Inspector</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Visual monthly spending heatmap. Click on any date to inspect transactions recorded on that day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Calendar Grid */}
        <Card variant="surface" className="lg:col-span-8 p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
              {plan.monthName}
            </h3>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-950/50 border border-emerald-500/40" /> &le;₹200
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-950/50 border border-amber-500/40" /> &le;₹500
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-950/50 border border-rose-500/40" /> &gt;₹500
              </span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[var(--text-muted)] pb-1">
            {weekdays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="h-16 rounded-2xl bg-[var(--bg-app)]/30 border border-transparent" />
            ))}

            {Array.from({ length: daysTotal }).map((_, idx) => {
              const day = idx + 1;
              const spend = dailySpendMap[day] || 0;
              const isSelected = selectedDay === day;
              const heatClass = getHeatmapClass(day, spend);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-16 p-2 rounded-2xl border transition-all duration-150 text-left flex flex-col justify-between relative group ${heatClass} ${
                    isSelected
                      ? 'ring-2 ring-[var(--accent-primary)] scale-105 z-10 shadow-[var(--shadow-md)]'
                      : ''
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {day}
                  </span>

                  {spend > 0 && (
                    <span className="text-[10px] font-mono font-bold truncate tabular-nums">
                      {formatRupee(spend)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right: Selected Day Inspector */}
        <Card variant="surface" className="lg:col-span-4 p-6 space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">
              Inspector
            </span>
            <h3 className="text-base font-bold text-[var(--text-primary)] mt-0.5">
              {selectedDay ? `${selectedDay} ${plan.monthName}` : 'Select a date'}
            </h3>
            <div className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1.5 font-mono">
              <TrendingDown size={14} className="text-amber-500" />
              <span>Total spend: </span>
              <strong className="text-[var(--text-primary)] text-sm tabular-nums">
                <AnimatedNumber value={selectedDaySpend} />
              </strong>
            </div>
          </div>

          {/* Transactions on selected day */}
          <div className="space-y-2 pt-2">
            {selectedDayTransactions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
                No transactions recorded on this day.
              </div>
            ) : (
              selectedDayTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon categoryId={tx.categoryId} size={15} showBg={true} />
                    <div>
                      <h5 className="text-xs font-semibold text-[var(--text-primary)]">{tx.note || tx.categoryId}</h5>
                      {tx.merchant && (
                        <span className="text-[10px] text-[var(--text-muted)]">{tx.merchant}</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold tabular-nums ${
                      tx.type === 'income' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatRupee(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
