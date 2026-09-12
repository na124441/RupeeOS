import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, Info, ShieldAlert, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { ActiveTab } from '../layout/Sidebar';

interface AlertsBannerProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ onNavigateTab }) => {
  const { alerts } = useFinance();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  if (activeAlerts.length === 0) return null;

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-rose-950/30 border-rose-500/30 text-rose-200',
          icon: <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-0.5" />,
          action: 'text-rose-300 hover:text-rose-100',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/30 border-amber-500/30 text-amber-200',
          icon: <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />,
          action: 'text-amber-300 hover:text-amber-100',
        };
      case 'success':
        return {
          bg: 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200',
          icon: <CheckCircle2 size={18} className="text-[var(--accent-primary)] shrink-0 mt-0.5" />,
          action: 'text-[var(--accent-primary)] hover:text-emerald-300',
        };
      default:
        return {
          bg: 'bg-blue-950/30 border-blue-500/30 text-blue-200',
          icon: <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />,
          action: 'text-blue-300 hover:text-blue-100',
        };
    }
  };

  return (
    <div className="space-y-2">
      {activeAlerts.slice(0, 3).map((alert) => {
        const style = getAlertStyle(alert.type);
        return (
          <div
            key={alert.id}
            onClick={() => alert.actionTab && onNavigateTab(alert.actionTab as ActiveTab)}
            className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border ${style.bg} ${
              alert.actionTab ? 'cursor-pointer hover:bg-opacity-80 transition-all' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {style.icon}
              <div>
                <h4 className="text-xs font-bold">{alert.title}</h4>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {alert.actionTab && (
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${style.action}`}>
                  View <ChevronRight size={14} />
                </span>
              )}
              <button
                onClick={(e) => handleDismiss(alert.id, e)}
                className="p-1 rounded-lg hover:bg-black/20 text-slate-400 hover:text-slate-200"
                aria-label="Dismiss alert"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
