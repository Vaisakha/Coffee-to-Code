import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UnsentDraft, VaultRecipientType, VaultFeelingResponse } from '../../types';
import { CreateVaultDraftModal } from '../modals/CreateVaultDraftModal';
import { VaultLetterReaderModal } from '../modals/VaultLetterReaderModal';
import {
  Lock,
  Plus,
  Search,
  Sparkles,
  Heart,
  Users,
  Feather,
  User,
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  PieChart,
  Eye,
  KeyRound
} from 'lucide-react';

const RECIPIENT_TYPE_MAP: Record<VaultRecipientType, { label: string; icon: any; color: string; bg: string }> = {
  ex: {
    label: 'An Ex',
    icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60',
  },
  estranged_friend: {
    label: 'Estranged Friend',
    icon: Users,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
  },
  passed_away: {
    label: 'Passed Away',
    icon: Feather,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60',
  },
  younger_self: {
    label: 'Younger Self',
    icon: User,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800/60',
  },
  future_self: {
    label: 'Future Self',
    icon: Sparkles,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/60',
  },
  other: {
    label: 'Other',
    icon: Shield,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
  },
};

export const VaultView: React.FC = () => {
  const { unsentDrafts, addVaultReflection, triggerTestResurface } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<UnsentDraft | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const nowEpoch = new Date().getTime();

  // Helper: check if a letter has resurfaced
  const isResurfaced = (draft: UnsentDraft) => {
    return new Date(draft.resurfacingDate).getTime() <= nowEpoch;
  };

  // Find resurfaced letters to show unprompted at the top of the vault view
  const resurfacedLetters = useMemo(() => {
    return unsentDrafts.filter(isResurfaced);
  }, [unsentDrafts, nowEpoch]);

  // Primary resurfaced letter to feature at the top (prefer one without reflections or most recent)
  const primaryResurfaced = useMemo(() => {
    if (resurfacedLetters.length === 0) return null;
    const unanswered = resurfacedLetters.find((d) => d.reflections.length === 0);
    return unanswered || resurfacedLetters[0];
  }, [resurfacedLetters]);

  // Filtered drafts
  const filteredDrafts = useMemo(() => {
    return unsentDrafts.filter((draft) => {
      if (selectedType !== 'all' && draft.recipientType !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = draft.title.toLowerCase().includes(q);
        const matchesRecipient = draft.recipient.toLowerCase().includes(q);
        const matchesContent = draft.content.toLowerCase().includes(q);
        if (!matchesTitle && !matchesRecipient && !matchesContent) return false;
      }
      return true;
    });
  }, [unsentDrafts, selectedType, searchQuery]);

  // Patterns calculation
  const patterns = useMemo(() => {
    const total = unsentDrafts.length;
    if (total === 0) {
      return {
        avgMonthsToResurface: 0,
        totalReflections: 0,
        yesCount: 0,
        noCount: 0,
        complicatedCount: 0,
        yesPct: 0,
        noPct: 0,
        complicatedPct: 0,
        resurfacedCount: 0,
        restingCount: 0,
      };
    }

    // Average time-to-resurface in months across letters
    let totalMonthsDiff = 0;
    unsentDrafts.forEach((d) => {
      const created = new Date(d.createdAt).getTime();
      const resurface = new Date(d.resurfacingDate).getTime();
      const diffDays = Math.max(1, (resurface - created) / (1000 * 60 * 60 * 24));
      const diffMonths = diffDays / 30.4;
      totalMonthsDiff += diffMonths;
    });

    const avgMonthsToResurface = parseFloat((totalMonthsDiff / total).toFixed(1));

    let yesCount = 0;
    let noCount = 0;
    let complicatedCount = 0;
    let totalReflections = 0;

    unsentDrafts.forEach((d) => {
      if (d.reflections.length > 0) {
        totalReflections++;
        const latest = d.reflections[d.reflections.length - 1];
        if (latest.response === 'yes') yesCount++;
        else if (latest.response === 'no') noCount++;
        else if (latest.response === 'complicated') complicatedCount++;
      }
    });

    const yesPct = totalReflections > 0 ? Math.round((yesCount / totalReflections) * 100) : 0;
    const noPct = totalReflections > 0 ? Math.round((noCount / totalReflections) * 100) : 0;
    const complicatedPct = totalReflections > 0 ? Math.round((complicatedCount / totalReflections) * 100) : 0;

    const resurfacedCount = unsentDrafts.filter(isResurfaced).length;
    const restingCount = total - resurfacedCount;

    return {
      avgMonthsToResurface,
      totalReflections,
      yesCount,
      noCount,
      complicatedCount,
      yesPct,
      noPct,
      complicatedPct,
      resurfacedCount,
      restingCount,
    };
  }, [unsentDrafts, nowEpoch]);

  const handleHeroReflection = (draftId: string, response: VaultFeelingResponse) => {
    addVaultReflection(draftId, response);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>Unsent Drafts Vault • Reread Only</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Unsent Drafts Vault
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Write what cannot be said — to an ex, an estranged friend, someone who passed away, or your younger self. Once sealed, drafts are permanently locked against sending, editing, or exporting, resurfacing quietly without warning.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write Unsent Letter</span>
        </button>
      </div>

      {/* UNPROMPTED RESURFACED LETTER (Shown unprompted at the top of the vault view) */}
      {primaryResurfaced && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/90 via-emerald-50/60 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border-2 border-emerald-500/40 dark:border-emerald-700/60 shadow-soft-lg p-6 sm:p-7 animate-fade-in">
          {/* Background watermark badge */}
          <div className="absolute top-3 right-4 opacity-10 pointer-events-none">
            <Lock className="w-28 h-28 text-emerald-900 dark:text-emerald-300" />
          </div>

          <div className="relative z-10 space-y-4">
            {/* Top Alert Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500 text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  A Letter Has Resurfaced
                </span>
                <span className="text-[11px] text-slate-400">• Unprompted Vault Return</span>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Penned {new Date(primaryResurfaced.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Letter Content Excerpt */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-emerald-200/60 dark:border-slate-800 shadow-sm">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {primaryResurfaced.title}
                </h3>
                <span className="text-xs font-serif italic text-slate-400">
                  {primaryResurfaced.recipient}
                </span>
              </div>
              <p className="font-serif text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed sm:leading-loose whitespace-pre-wrap line-clamp-4">
                {primaryResurfaced.content}
              </p>

              <button
                onClick={() => setSelectedDraft(primaryResurfaced)}
                className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read full letter in sanctuary</span>
              </button>
            </div>

            {/* The Unprompted Question: "Does this still feel true?" */}
            <div className="pt-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Does this still feel true?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your words have rested in the dark. How does the passage of time meet this feeling today?
                  </p>
                </div>

                {primaryResurfaced.reflections.length > 0 && (
                  <span className="text-[10px] text-slate-400 bg-white/80 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    Checked in {primaryResurfaced.reflections.length} {primaryResurfaced.reflections.length === 1 ? 'time' : 'times'}
                  </span>
                )}
              </div>

              {/* Three Options: Yes / No / It's complicated */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleHeroReflection(primaryResurfaced.id, 'yes')}
                  className="p-3 rounded-xl border border-emerald-300/80 dark:border-emerald-800/80 bg-white/95 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-all text-left flex items-center gap-3 shadow-2xs group"
                >
                  <span className="text-xl">✨</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      Yes
                    </p>
                    <p className="text-[10px] text-slate-400">Still feels true today</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroReflection(primaryResurfaced.id, 'no')}
                  className="p-3 rounded-xl border border-rose-300/80 dark:border-rose-800/80 bg-white/95 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all text-left flex items-center gap-3 shadow-2xs group"
                >
                  <span className="text-xl">🍃</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-300">
                      No
                    </p>
                    <p className="text-[10px] text-slate-400">Outgrown this sentiment</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleHeroReflection(primaryResurfaced.id, 'complicated')}
                  className="p-3 rounded-xl border border-amber-300/80 dark:border-amber-800/80 bg-white/95 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-all text-left flex items-center gap-3 shadow-2xs group"
                >
                  <span className="text-xl">🌊</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      It's complicated
                    </p>
                    <p className="text-[10px] text-slate-400">Layered and evolving</p>
                  </div>
                </button>
              </div>

              {/* Show most recent answer if recorded */}
              {primaryResurfaced.reflections.length > 0 && (
                <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    Last recorded:{' '}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {primaryResurfaced.reflections[primaryResurfaced.reflections.length - 1].response.toUpperCase()}
                    </strong>{' '}
                    on{' '}
                    {new Date(
                      primaryResurfaced.reflections[primaryResurfaced.reflections.length - 1].timestamp
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patterns Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Vault Patterns
              </h2>
              <p className="text-[11px] text-slate-400">
                Temporal metrics and emotional permanence of unsent letters
              </p>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {patterns.resurfacedCount} resurfaced • {patterns.restingCount} resting
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Average time-to-resurface */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Avg Time-to-Resurface
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                {patterns.avgMonthsToResurface > 0 ? `${patterns.avgMonthsToResurface} mo` : '—'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Hidden random intervals between 1 and 12 months allow emotions to settle in quiet stillness.
            </p>
          </div>

          {/* Truth Persistence Rate (% Still True) */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <span>✨</span> Still Feels True
              </span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base">
                {patterns.totalReflections > 0 ? `${patterns.yesPct}%` : '—'}
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${patterns.yesPct}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 mt-2">
              {patterns.yesCount} of {patterns.totalReflections} check-ins confirmed lasting truth
            </p>
          </div>

          {/* Outgrown or Complicated */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>🌊</span> Outgrown or Complicated
              </span>
              <span className="font-extrabold text-slate-700 dark:text-slate-300 text-base">
                {patterns.totalReflections > 0
                  ? `${patterns.noPct + patterns.complicatedPct}%`
                  : '—'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${patterns.noPct + patterns.complicatedPct}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {patterns.noCount} released • {patterns.complicatedCount} complex emotions
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Recipient Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 select-none">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            All Addressees ({unsentDrafts.length})
          </button>

          {(Object.keys(RECIPIENT_TYPE_MAP) as VaultRecipientType[]).map((type) => {
            const count = unsentDrafts.filter((d) => d.recipientType === type).length;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {RECIPIENT_TYPE_MAP[type].label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letters..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Grid of Vault Drafts */}
      {filteredDrafts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <Lock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No letters match this filter
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No unsent drafts found for "${searchQuery}".`
              : 'Write your first unsent letter. It will rest here safely, locked and unperformed.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrafts.map((draft) => {
            const typeConfig = RECIPIENT_TYPE_MAP[draft.recipientType] || RECIPIENT_TYPE_MAP.other;
            const TypeIcon = typeConfig.icon;
            const resurfaced = isResurfaced(draft);
            const dateFormatted = new Date(draft.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={draft.id}
                onClick={() => setSelectedDraft(draft)}
                className={`group p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none relative ${
                  resurfaced
                    ? 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-300/70 dark:border-amber-800/50 shadow-sm hover:shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div>
                  {/* Top Bar: Recipient Type Badge & Lock Icon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${typeConfig.bg} ${typeConfig.color}`}
                    >
                      <TypeIcon className="w-3.5 h-3.5" />
                      <span>{typeConfig.label}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {resurfaced ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 animate-pulse">
                          Resurfaced
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          title="Resting in vault until hidden date"
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Resting</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Addressed To & Title */}
                  <p className="text-[11px] font-serif italic text-slate-400 line-clamp-1">
                    {draft.recipient}
                  </p>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug font-serif mt-0.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {draft.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-serif text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {draft.content}
                  </p>
                </div>

                {/* Footer: Date & Testing Control */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{dateFormatted}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {!resurfaced && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerTestResurface(draft.id);
                        }}
                        className="text-[10px] text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium hover:underline"
                        title="Simulate resurfacing for test review"
                      >
                        Simulate Resurface
                      </button>
                    )}

                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <Eye className="w-3 h-3" />
                      <span>Reread</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      <CreateVaultDraftModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Reader Modal */}
      <VaultLetterReaderModal
        draft={selectedDraft}
        isOpen={Boolean(selectedDraft)}
        onClose={() => setSelectedDraft(null)}
      />
    </div>
  );
};
