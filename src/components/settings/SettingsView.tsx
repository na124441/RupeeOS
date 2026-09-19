import React, { useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  exportEssentialsToCsv,
  exportToJson,
  exportTransactionsToCsv,
  parseJsonBackupFile,
} from '../../db/exportImport';
import {
  Check,
  Compass,
  Download,
  FileSpreadsheet,
  FileText,
  Lock,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const {
    plan,
    transactions,
    essentials,
    goals,
    subscriptions,
    resetToDemo,
    clearAllData,
    importBackup,
    setIsOnboardingOpen,
    setIsRolloverOpen,
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportFullJson = () => {
    exportToJson({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      plans: {
        [plan.monthKey]: plan,
      },
      transactions,
      essentials,
      goals,
      subscriptions,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const backup = await parseJsonBackupFile(file);
      importBackup(backup);
      alert('Backup restored successfully!');
    } catch (err) {
      alert('Failed to restore backup. Invalid file format.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
          Data Sovereignty
        </span>
        <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2.5 mt-0.5">
          <ShieldCheck size={24} className="text-[var(--accent-primary)]" />
          <span>Data Management, Privacy & Exports</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Zero analytics tracking, zero cloud lock-in. Your financial ledger lives strictly in private local storage.
        </p>
      </div>

      {/* Appearance & Themes Section */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Appearance & Visual Theme
          </h3>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Customize your visual experience. Both themes feature modern ambient lighting and rich fintech color schemes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Midnight Aurora (Lit Dark) */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              theme === 'dark'
                ? 'border-[var(--accent-primary)] bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg shadow-emerald-500/10'
                : 'border-[var(--border-app)] bg-[var(--bg-surface-elevated)]/60 hover:border-[var(--border-hover)]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Moon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Midnight Aurora</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">Lit Dark Mode</span>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-slate-950 flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Deep, luminous slate-indigo with glowing ambient backdrops, neon accents, and frosted glass cards.
            </p>
            <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-800">
              <span className="w-3 h-3 rounded-full bg-[#0c1222] border border-slate-700" />
              <span className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span className="w-3 h-3 rounded-full bg-[#06b6d4]" />
              <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
            </div>
          </div>

          {/* Radiant Sunlight (Light) */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              theme === 'light'
                ? 'border-[var(--accent-primary)] bg-gradient-to-br from-white to-slate-100 shadow-lg shadow-emerald-500/10'
                : 'border-[var(--border-app)] bg-[var(--bg-surface-elevated)]/60 hover:border-[var(--border-hover)]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                  <Sun size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Radiant Sunlight</h4>
                  <span className="text-[10px] text-amber-600 font-semibold">Sunlit Light Mode</span>
                </div>
              </div>
              {theme === 'light' && (
                <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Crisp pearl-slate background with vibrant cards, high-contrast typography, and colorful indicators.
            </p>
            <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-200">
              <span className="w-3 h-3 rounded-full bg-[#f4f7fb] border border-slate-300" />
              <span className="w-3 h-3 rounded-full bg-[#059669]" />
              <span className="w-3 h-3 rounded-full bg-[#0284c7]" />
              <span className="w-3 h-3 rounded-full bg-[#7c3aed]" />
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Guarantee Card */}
      <Card variant="surface" className="p-6 md:p-8 space-y-3 border-[var(--border-accent)]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[var(--accent-surface)] text-[var(--accent-primary)] border border-[var(--border-accent)] shadow-sm">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Local-First Architecture</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              All financial transactions, monthly allocations, and goals live strictly in your device's private storage. Zero external server telemetry or financial data scraping.
            </p>
          </div>
        </div>
      </Card>

      {/* Data Export & Backup Section */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Download size={18} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Export Your Financial Data
          </h3>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Download your complete financial records anytime in open, interoperable formats.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* JSON Full Backup */}
          <button
            onClick={handleExportFullJson}
            className="p-5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-left transition-all group hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2.5">
              <FileText size={20} className="text-[var(--accent-primary)]" />
              <span className="text-[10px] font-mono uppercase bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] px-2 py-0.5 rounded">
                .JSON
              </span>
            </div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
              Full System Backup
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Budgets, transactions, essentials & goals in one file.
            </p>
          </button>

          {/* Transactions CSV */}
          <button
            onClick={() => exportTransactionsToCsv(transactions)}
            className="p-5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-left transition-all group hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2.5">
              <FileSpreadsheet size={20} className="text-cyan-400" />
              <span className="text-[10px] font-mono uppercase bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] px-2 py-0.5 rounded">
                .CSV
              </span>
            </div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors">
              Transactions Ledger
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Direct import into Excel, Google Sheets, or Numbers.
            </p>
          </button>

          {/* Essentials CSV */}
          <button
            onClick={() => exportEssentialsToCsv(essentials)}
            className="p-5 rounded-2xl bg-[var(--bg-app)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] text-left transition-all group hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2.5">
              <FileSpreadsheet size={20} className="text-amber-400" />
              <span className="text-[10px] font-mono uppercase bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] px-2 py-0.5 rounded">
                .CSV
              </span>
            </div>
            <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-amber-300 transition-colors">
              Essentials Checklist
            </h4>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Shopping lists, estimated & actual costs.
            </p>
          </button>
        </div>
      </Card>

      {/* Import & Restore Section */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Upload size={18} className="text-purple-400" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Restore Backup
          </h3>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Migrate your RupeeOS data from another device or restore from a previously exported JSON backup.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <Button
          variant="secondary"
          size="md"
          icon={<Upload size={15} />}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload JSON Backup File
        </Button>
      </Card>

      {/* Guided Financial Wizards */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
          Guided Financial Wizards
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Revisit the first-time setup or manually trigger month-end surplus rollover.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<Compass size={15} className="text-[var(--accent-primary)]" />}
            onClick={() => setIsOnboardingOpen(true)}
          >
            Launch Onboarding Wizard
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<Sparkles size={15} className="text-amber-400" />}
            onClick={() => setIsRolloverOpen(true)}
          >
            Launch Month-End Rollover
          </Button>
        </div>
      </Card>

      {/* Demo Data & Danger Zone */}
      <Card variant="surface" className="p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
          Demo Dataset & Reset Controls
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<RotateCcw size={15} className="text-[var(--accent-primary)]" />}
            onClick={resetToDemo}
          >
            Load September 2026 Demo Data
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={<Trash2 size={15} />}
            onClick={() => {
              if (confirm('Are you sure you want to clear all data? Make sure you have exported a backup first.')) {
                clearAllData();
              }
            }}
          >
            Clear All Data
          </Button>
        </div>
      </Card>

      {/* About RupeeOS Brand Card */}
      <Card
        variant="surface"
        className="p-6 md:p-8 space-y-4 bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-surface-elevated)] to-[var(--accent-surface)]/20 border border-[var(--border-accent)] relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <BrandLogo size="lg" showText={true} showBadge={true} />
          </div>
          <div className="text-left sm:text-right text-xs text-[var(--text-muted)] font-mono">
            <div>v1.0.0 Pro • Local-First Edition</div>
            <div className="text-emerald-400 font-semibold mt-0.5">Zero Telemetry • 100% Private</div>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed relative z-10 pt-1 border-t border-[var(--border-subtle)]">
          Built for intentional spenders. Allocate your monthly money into conscious envelopes, protect your daily burn rate, and master your financial future.
        </p>
      </Card>
    </div>
  );
};
