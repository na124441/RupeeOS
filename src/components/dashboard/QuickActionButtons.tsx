import React from 'react';
import { ArrowRightLeft, Calculator, Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuickActionButtonsProps {
  onOpenExpense: () => void;
  onOpenIncome: () => void;
  onOpenEssential: () => void;
  onOpenMoveMoney: () => void;
  onOpenSimulator: () => void;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onOpenExpense,
  onOpenIncome,
  onOpenEssential,
  onOpenMoveMoney,
  onOpenSimulator,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        icon={<Plus size={15} strokeWidth={2.5} />}
        onClick={onOpenExpense}
      >
        Expense
      </Button>

      <Button
        variant="secondary"
        size="sm"
        icon={<TrendingUp size={15} className="text-[var(--accent-primary)]" />}
        onClick={onOpenIncome}
      >
        Income
      </Button>

      <Button
        variant="secondary"
        size="sm"
        icon={<Calculator size={15} className="text-cyan-400" />}
        onClick={onOpenSimulator}
      >
        What If?
      </Button>

      <Button
        variant="secondary"
        size="sm"
        icon={<ShoppingCart size={15} className="text-amber-400" />}
        onClick={onOpenEssential}
      >
        Essential
      </Button>

      <Button
        variant="secondary"
        size="sm"
        icon={<ArrowRightLeft size={15} className="text-purple-400" />}
        onClick={onOpenMoveMoney}
      >
        Move Money
      </Button>
    </div>
  );
};
