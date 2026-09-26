import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { AlmostListItem, AlmostListFeeling } from '../../types';
import {
  HeartHandshake,
  Frown,
  MinusCircle,
  Calendar,
  Clock,
  Sparkles,
  History,
  Trash2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AlmostListRevisitModalProps {
  item: AlmostListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlmostListRevisitModal: React.FC<AlmostListRevisitModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { addAlmostListReflection, deleteAlmostListItem, triggerTestRevisit } = useApp();

  const [selectedFeeling, setSelectedFeeling] = useState<AlmostListFeeling | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const isReadyToRevisit = todayStr >= item.revisitDate;
  const hasReflections = item.reflections.length > 0;

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeling) return;

    setIsSubmitting(true);
    addAlmostListReflection(item.id, selectedFeeling, reflectionNote);
    setSelectedFeeling(null);
    setReflectionNote('');
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (window.confirm('Remove this decision from your Almost List?')) {
      deleteAlmostListItem(item.id);
      onClose();
    }
  };

  const getFeelingBadge = (feeling: AlmostListFeeling) => {
    switch (feeling) {
      case 'still_relieved':
        return {
          label: 'Still relieved',
          icon: HeartHandshake,
          bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/60',
        };
      case 'now_regret_it':
        return {
          label: 'Now regret it',
          icon: Frown,
          bg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300/60 dark:border-rose-700/60',
        };
      case 'neutral_now':
        return {
          label: 'Neutral now',
          icon: MinusCircle,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-700/60',
        };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.title}
      subtitle={`Logged on ${item.dateLogged} • Category: ${item.category.toUpperCase()}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Description Section */}
        {item.shortDescription && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Original Thought
            </p>
            {item.shortDescription}
          </div>
        )}

        {/* Status / Timing Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-850">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Revisit Scheduled:{' '}
              <strong className="text-slate-900 dark:text-white">{item.revisitDate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isReadyToRevisit ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300/60 animate-pulse">
                Ready to revisit
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Waiting
                </span>
                <button
                  type="button"
                  onClick={() => triggerTestRevisit(item.id)}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  title="Move revisit date to past to test prompt"
                >
                  Test Revisit Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Question: "Do you still feel the same?" */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Do you still feel the same?
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            With some distance from the moment, how does this conscious boundary feel to you today?
          </p>

          <form onSubmit={handleSaveReflection} className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Still Relieved */}
              <button
                type="button"
                onClick={() => setSelectedFeeling('still_relieved')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  selectedFeeling === 'still_relieved'
                    ? 'border-emerald-600 bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-lg">🌿</span>
                <div>
                  <p className="text-xs font-bold leading-tight">Still relieved</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Peace with the choice</p>
                </div>
              </button>

              {/* Option 2: Now Regret It */}
              <button
                type="button"
                onClick={() => setSelectedFeeling('now_regret_it')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  selectedFeeling === 'now_regret_it'
                    ? 'border-rose-500 bg-rose-100/80 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-lg">🌧️</span>
                <div>
                  <p className="text-xs font-bold leading-tight">Now regret it</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Wish I had taken it</p>
                </div>
              </button>

              {/* Option 3: Neutral Now */}
              <button
                type="button"
                onClick={() => setSelectedFeeling('neutral_now')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  selectedFeeling === 'neutral_now'
                    ? 'border-slate-500 bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-slate-400/30 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-lg">⚖️</span>
                <div>
                  <p className="text-xs font-bold leading-tight">Neutral now</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Neither relief nor regret</p>
                </div>
              </button>
            </div>

            {/* Optional note */}
            {selectedFeeling && (
              <div className="pt-2 animate-fade-in space-y-2">
                <input
                  type="text"
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Optional quiet note: What brought this perspective?"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <span>Record Feeling</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* History of Feelings Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Feelings History ({item.reflections.length})
            </span>
          </div>

          {item.reflections.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No feelings recorded yet. When the revisit time arrives, select an option above to begin your reflection timeline.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {item.reflections
                .slice()
                .reverse()
                .map((ref, idx) => {
                  const badge = getFeelingBadge(ref.feeling);
                  const Icon = badge.icon;
                  const dateStr = new Date(ref.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  return (
                    <div
                      key={ref.id || idx}
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {dateStr}
                          </span>
                        </div>
                        {ref.note && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-0.5">
                            "{ref.note}"
                          </p>
                        )}
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard Entry</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
