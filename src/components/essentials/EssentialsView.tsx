import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { EssentialItem, ShoppingProvider } from '../../types';
import { SHOPPING_PROVIDERS } from '../../services/shoppingService';
import { formatRupee } from '../../utils/currency';
import { ExternalLink, Plus, RefreshCw, ShoppingCart, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { EmptyState } from '../ui/EmptyState';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export const EssentialsView: React.FC = () => {
  const {
    activeMonth,
    plan,
    essentials,
    templates,
    addEssential,
    toggleEssential,
    deleteEssential,
    populateFromTemplates,
    addTemplate,
    deleteTemplate,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'checklist' | 'templates'>('checklist');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new essential
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('kg');
  const [estimatedCost, setEstimatedCost] = useState('150');
  const [provider, setProvider] = useState<ShoppingProvider>('blinkit');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  // Month essentials
  const monthEssentials = essentials.filter((e) => e.monthKey === activeMonth);

  const totalEstimated = monthEssentials.reduce((sum, e) => sum + e.estimatedCost, 0);
  const purchasedItems = monthEssentials.filter((e) => e.isPurchased);
  const totalPurchased = purchasedItems.reduce(
    (sum, e) => sum + (e.actualCost || e.estimatedCost),
    0
  );
  const totalRemaining = monthEssentials
    .filter((e) => !e.isPurchased)
    .reduce((sum, e) => sum + e.estimatedCost, 0);

  const completedCount = purchasedItems.length;
  const totalCount = monthEssentials.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateEssential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cost = parseFloat(estimatedCost) || 0;
    addEssential({
      name: name.trim(),
      quantity: quantity.trim() || '1',
      unit: unit.trim() || 'units',
      estimatedCost: cost,
      isPurchased: false,
      preferredProvider: provider,
      categoryId: 'essentials',
    });

    if (saveAsTemplate) {
      addTemplate({
        name: name.trim(),
        defaultQuantity: quantity.trim() || '1',
        defaultUnit: unit.trim() || 'units',
        estimatedCost: cost,
        preferredProvider: provider,
        categoryId: 'essentials',
      });
    }

    setName('');
    setEstimatedCost('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Subtabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            Essential Commitments
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5">
            <ShoppingCart size={24} className="text-amber-400" />
            <span>Monthly Essentials & Quick Commerce</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Hybrid financial planner + grocery checklist with direct launch links to Blinkit, Zepto, Instamart & Amazon.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Subtab toggle */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-app)] rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-[var(--accent-primary)] text-slate-950 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {plan.monthName.split(' ')[0]} Checklist
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-[var(--accent-primary)] text-slate-950 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Recurring Templates ({templates.length})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} strokeWidth={2.5} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Essential
          </Button>
        </div>
      </div>

      {activeTab === 'checklist' ? (
        <>
          {/* Summary Progress Hero Card */}
          <Card variant="surface" className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
                  Progress
                </span>
                <div className="text-lg font-black text-[var(--text-primary)] mt-0.5">
                  {completedCount} of {totalCount} completed ({completionPercentage}%)
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[var(--text-muted)]">Estimated: </span>
                  <span className="text-[var(--text-primary)] font-bold">{formatRupee(totalEstimated)}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Purchased: </span>
                  <span className="text-[var(--accent-primary)] font-bold">{formatRupee(totalPurchased)}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Reserved: </span>
                  <span className="text-amber-400 font-bold">{formatRupee(totalRemaining)}</span>
                </div>
              </div>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full bg-[var(--bg-app)] rounded-full h-2.5 overflow-hidden p-0.5 border border-[var(--border-subtle)]">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </Card>

          {/* Quick populate button if list is empty */}
          {monthEssentials.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart size={22} />}
              title="No essentials planned yet"
              description={`Add grocery staples or populate directly from recurring templates for ${plan.monthName}.`}
              actionLabel={templates.length > 0 ? `Populate from Templates (${templates.length} items)` : '+ Add Item'}
              onAction={templates.length > 0 ? populateFromTemplates : () => setIsAddModalOpen(true)}
            />
          ) : (
            /* Essentials Checklist Cards */
            <div className="space-y-2.5">
              {monthEssentials.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    item.isPurchased
                      ? 'bg-[var(--bg-app)]/60 border-[var(--border-subtle)] opacity-75'
                      : 'bg-[var(--bg-surface)] border-[var(--border-app)] hover:border-[var(--border-hover)] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Left: Checkbox + Name + Quantity */}
                    <div className="flex items-center gap-3.5">
                      <Checkbox
                        id={`ess-check-${item.id}`}
                        checked={item.isPurchased}
                        onChange={() => toggleEssential(item.id, item.estimatedCost, true)}
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-semibold transition-all duration-200 ${
                              item.isPurchased
                                ? 'line-through text-[var(--text-muted)]'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {item.name}
                          </h4>
                          <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono font-bold text-[var(--text-secondary)] tabular-nums">
                            {formatRupee(item.actualCost || item.estimatedCost)}
                          </span>
                          {item.isPurchased && (
                            <span className="text-[10px] text-[var(--accent-primary)] font-medium">
                              ✓ Auto-logged to expenses
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Commerce Deep Links */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] hidden sm:inline">
                        Shop:
                      </span>

                      {/* Blinkit */}
                      <a
                        href={SHOPPING_PROVIDERS.blinkit.generateUrl(item.name)}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all min-h-[32px] ${
                          item.preferredProvider === 'blinkit'
                            ? SHOPPING_PROVIDERS.blinkit.bgClass + ' ' + SHOPPING_PROVIDERS.blinkit.borderClass + ' font-bold'
                            : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                        title={`Search ${item.name} on Blinkit`}
                      >
                        <span>Blinkit</span>
                        <ExternalLink size={11} />
                      </a>

                      {/* Zepto */}
                      <a
                        href={SHOPPING_PROVIDERS.zepto.generateUrl(item.name)}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all min-h-[32px] ${
                          item.preferredProvider === 'zepto'
                            ? SHOPPING_PROVIDERS.zepto.bgClass + ' ' + SHOPPING_PROVIDERS.zepto.borderClass + ' font-bold'
                            : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                        title={`Search ${item.name} on Zepto`}
                      >
                        <span>Zepto</span>
                        <ExternalLink size={11} />
                      </a>

                      {/* Instamart */}
                      <a
                        href={SHOPPING_PROVIDERS.instamart.generateUrl(item.name)}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all min-h-[32px] ${
                          item.preferredProvider === 'instamart'
                            ? SHOPPING_PROVIDERS.instamart.bgClass + ' ' + SHOPPING_PROVIDERS.instamart.borderClass + ' font-bold'
                            : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                        title={`Search ${item.name} on Instamart`}
                      >
                        <span>Instamart</span>
                        <ExternalLink size={11} />
                      </a>

                      {/* Amazon */}
                      <a
                        href={SHOPPING_PROVIDERS.amazon.generateUrl(item.name)}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all min-h-[32px] ${
                          item.preferredProvider === 'amazon'
                            ? SHOPPING_PROVIDERS.amazon.bgClass + ' ' + SHOPPING_PROVIDERS.amazon.borderClass + ' font-bold'
                            : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                        }`}
                        title={`Search ${item.name} on Amazon`}
                      >
                        <span>Amazon</span>
                        <ExternalLink size={11} />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => deleteEssential(item.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                        title="Delete item"
                        aria-label="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Recurring Templates Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-[var(--text-muted)]">
              Recurring templates automatically pre-populate each new month with standard grocery staples and quantities.
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={populateFromTemplates}
            >
              Apply to {plan.monthName.split(' ')[0]}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((tmpl) => (
              <Card key={tmpl.id} variant="surface" className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">{tmpl.name}</h4>
                    <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded">
                      {tmpl.defaultQuantity} {tmpl.defaultUnit}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[var(--text-secondary)] mt-1">
                    Est: {formatRupee(tmpl.estimatedCost)} • via {tmpl.preferredProvider}
                  </div>
                </div>
                <button
                  onClick={() => deleteTemplate(tmpl.id)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="Delete template"
                >
                  <Trash2 size={14} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Essential Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Monthly Essential"
        subtitle={`Add a planned grocery or household staple for ${plan.monthName}`}
      >
        <form onSubmit={handleCreateEssential} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Milk, Oats, Paneer, Toiletries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Quantity</label>
              <input
                type="text"
                placeholder="e.g. 1, 7.5, 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Unit</label>
              <input
                type="text"
                placeholder="e.g. kg, L, g, packs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Estimated Cost (₹)</label>
              <input
                type="number"
                placeholder="150"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Preferred Store</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ShoppingProvider)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-app)] border border-[var(--border-app)] focus:border-[var(--accent-primary)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none"
              >
                <option value="blinkit">Blinkit</option>
                <option value="zepto">Zepto</option>
                <option value="instamart">Swiggy Instamart</option>
                <option value="amazon">Amazon Fresh</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="saveTemplate"
              checked={saveAsTemplate}
              onChange={(e) => setSaveAsTemplate(e.target.checked)}
              className="rounded bg-[var(--bg-app)] border-[var(--border-app)] text-[var(--accent-primary)]"
            />
            <label htmlFor="saveTemplate" className="text-xs text-[var(--text-secondary)] cursor-pointer">
              Also save as a recurring template for upcoming months
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Essential
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
