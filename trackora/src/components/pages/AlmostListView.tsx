import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AlmostListItem, AlmostListCategory, AlmostListStatus, AlmostListFeeling } from '../../types';
import { CreateAlmostListModal } from '../modals/CreateAlmostListModal';
import { AlmostListRevisitModal } from '../modals/AlmostListRevisitModal';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  Heart,
  Compass,
  Palette,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  Frown,
  MinusCircle,
  History,
  TrendingUp,
  PieChart,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const CATEGORY_CONFIG: Record<AlmostListCategory, { label: string; icon: any; color: string; bg: string }> = {
  career: {
    label: 'Career',
    icon: Briefcase,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60',
  },
  relationship: {
    label: 'Relationship',
    icon: Heart,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60',
  },
  travel: {
    label: 'Travel',
    icon: Compass,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60',
  },
  creative: {
    label: 'Creative',
    icon: Palette,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60',
  },
  other: {
    label: 'Other',
    icon: Sparkles,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60',
  },
};

export const AlmostListView: React.FC = () => {
  const { almostList } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AlmostListItem | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to get status of an entry
  const getItemStatus = (item: AlmostListItem): AlmostListStatus => {
    if (item.reflections.length > 0) return 'resolved';
    if (todayStr >= item.revisitDate) return 'ready_to_revisit';
    return 'waiting';
  };

  // Filtered entries
  const filteredItems = useMemo(() => {
    return almostList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Status filter
      const status = getItemStatus(item);
      if (selectedStatus !== 'all' && status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.shortDescription.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [almostList, selectedCategory, selectedStatus, searchQuery, todayStr]);

  // Pattern Statistics
  const patterns = useMemo(() => {
    const total = almostList.length;
    let reliefCount = 0;
    let regretCount = 0;
    let neutralCount = 0;
    let totalReflections = 0;

    almostList.forEach((item) => {
      // Take the most recent reflection per item
      if (item.reflections.length > 0) {
        totalReflections++;
        const latest = item.reflections[item.reflections.length - 1];
        if (latest.feeling === 'still_relieved') reliefCount++;
        else if (latest.feeling === 'now_regret_it') regretCount++;
        else if (latest.feeling === 'neutral_now') neutralCount++;
      }
    });

    const reliefPct = totalReflections > 0 ? Math.round((reliefCount / totalReflections) * 100) : 0;
    const regretPct = totalReflections > 0 ? Math.round((regretCount / totalReflections) * 100) : 0;
    const neutralPct = totalReflections > 0 ? Math.round((neutralCount / totalReflections) * 100) : 0;

    const readyCount = almostList.filter((i) => getItemStatus(i) === 'ready_to_revisit').length;
    const waitingCount = almostList.filter((i) => getItemStatus(i) === 'waiting').length;
    const resolvedCount = almostList.filter((i) => getItemStatus(i) === 'resolved').length;

    return {
      total,
      reliefCount,
      regretCount,
      neutralCount,
      totalReflections,
      reliefPct,
      regretPct,
      neutralPct,
      readyCount,
      waitingCount,
      resolvedCount,
    };
  }, [almostList, todayStr]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Conscious Paths Not Taken
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Almost List
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A calm log for the jobs you turned down, trips you postponed, texts left unwritten, and risks deliberately declined. Revisit them after time has passed to see how your feelings settled.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-emerald-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Conscious Decision</span>
        </button>
      </div>

      {/* Patterns Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Reflective Patterns
              </h2>
              <p className="text-[11px] text-slate-400">
                Emotional trajectory across your consciously declined paths
              </p>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {patterns.totalReflections} of {patterns.total} decisions revisited
          </span>
        </div>

        {/* Pattern Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Still Relieved Stat */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <span>🌿</span> Still Relieved
              </span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base">
                {patterns.totalReflections > 0 ? `${patterns.reliefPct}%` : '—'}
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${patterns.reliefPct}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 mt-2">
              {patterns.reliefCount} decisions affirmed as healthy boundaries
            </p>
          </div>

          {/* Now Regret It Stat */}
          <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-800/40">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <span>🌧️</span> Now Regret It
              </span>
              <span className="font-extrabold text-rose-700 dark:text-rose-400 text-base">
                {patterns.totalReflections > 0 ? `${patterns.regretPct}%` : '—'}
              </span>
            </div>
            <div className="w-full bg-rose-200/60 dark:bg-rose-900/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${patterns.regretPct}%` }}
              />
            </div>
            <p className="text-[10px] text-rose-800/80 dark:text-rose-300/80 mt-2">
              {patterns.regretCount} decisions where hesitation held you back
            </p>
          </div>

          {/* Neutral / Revisit Readiness */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>⚖️</span> Neutral / At Peace
              </span>
              <span className="font-extrabold text-slate-700 dark:text-slate-300 text-base">
                {patterns.totalReflections > 0 ? `${patterns.neutralPct}%` : '—'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-slate-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${patterns.neutralPct}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
              {patterns.readyCount} ready to revisit • {patterns.waitingCount} still waiting
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 select-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            All Categories ({almostList.length})
          </button>

          {(Object.keys(CATEGORY_CONFIG) as AlmostListCategory[]).map((cat) => {
            const count = almostList.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {CATEGORY_CONFIG[cat].label} ({count})
              </button>
            );
          })}
        </div>

        {/* Status Filters & Search */}
        <div className="flex items-center gap-2">
          {/* Status Select */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === 'all'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('ready_to_revisit')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                selectedStatus === 'ready_to_revisit'
                  ? 'bg-amber-500 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span>Ready</span>
              {patterns.readyCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => setSelectedStatus('waiting')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === 'waiting'
                  ? 'bg-slate-700 text-white font-bold dark:bg-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Waiting
            </button>
            <button
              onClick={() => setSelectedStatus('resolved')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === 'resolved'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Search */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decisions..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {/* Decision Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No decisions match this view
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No entries found for "${searchQuery}". Clear your search to see all decisions.`
              : 'Try selecting a different category or status filter, or log a new conscious choice.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const catConfig = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.other;
            const CatIcon = catConfig.icon;
            const status = getItemStatus(item);
            const isReady = status === 'ready_to_revisit';
            const isResolved = status === 'resolved';
            const latestReflection = item.reflections[item.reflections.length - 1];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none relative ${
                  isReady
                    ? 'bg-amber-50/30 dark:bg-amber-950/15 border-amber-300/80 dark:border-amber-800/60 shadow-sm hover:shadow-md ring-1 ring-amber-400/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-soft-lg hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div>
                  {/* Card Header: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${catConfig.bg} ${catConfig.color}`}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{catConfig.label}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isReady && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 animate-pulse">
                          Ready to revisit
                        </span>
                      )}
                      {status === 'waiting' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                          Waiting
                        </span>
                      )}
                      {isResolved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>

                  {item.shortDescription && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  )}
                </div>

                {/* Card Footer: Dates & Feelings Summary */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.dateLogged}</span>
                    </span>

                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Revisit: {item.revisitDate}</span>
                    </span>
                  </div>

                  {/* Latest Reflection Pill or Revisit Prompt */}
                  <div>
                    {latestReflection ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                        <span>
                          {latestReflection.feeling === 'still_relieved' && '🌿 Relieved'}
                          {latestReflection.feeling === 'now_regret_it' && '🌧️ Regret it'}
                          {latestReflection.feeling === 'neutral_now' && '⚖️ Neutral'}
                        </span>
                        {item.reflections.length > 1 && (
                          <span className="text-[10px] text-slate-400">
                            (+{item.reflections.length - 1})
                          </span>
                        )}
                      </span>
                    ) : isReady ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline">
                        <span>Revisit now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Unrevisited</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      <CreateAlmostListModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Revisit & Details Modal */}
      <AlmostListRevisitModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};
