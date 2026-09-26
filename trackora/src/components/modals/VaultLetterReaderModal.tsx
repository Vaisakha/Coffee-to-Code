import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UnsentDraft, VaultFeelingResponse } from '../../types';
import {
  Lock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
  History,
  ShieldCheck,
  HelpCircle,
  XCircle
} from 'lucide-react';

interface VaultLetterReaderModalProps {
  draft: UnsentDraft | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VaultLetterReaderModal: React.FC<VaultLetterReaderModalProps> = ({
  draft,
  isOpen,
  onClose,
}) => {
  const { addVaultReflection, deleteUnsentDraft } = useApp();

  if (!draft) return null;

  const nowEpoch = new Date().getTime();
  const isResurfaced = new Date(draft.resurfacingDate).getTime() <= nowEpoch;
  const dateFormatted = new Date(draft.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleResponse = (response: VaultFeelingResponse) => {
    addVaultReflection(draft.id, response);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to discard this letter from your Vault?')) {
      deleteUnsentDraft(draft.id);
      onClose();
    }
  };

  const getResponseBadge = (response: VaultFeelingResponse) => {
    switch (response) {
      case 'yes':
        return {
          label: 'Yes, still feels true',
          icon: CheckCircle2,
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
        };
      case 'no':
        return {
          label: 'No, does not feel true anymore',
          icon: XCircle,
          bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        };
      case 'complicated':
        return {
          label: "It's complicated",
          icon: HelpCircle,
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
        };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={draft.recipient}
      subtitle={`Penned on ${dateFormatted} • Vault Archive`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Permanent Lock Status Ribbon */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Locked in Vault</span>
            <span className="text-[11px] text-slate-400">• Reread Only</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Cannot be edited or sent</span>
          </div>
        </div>

        {/* Letter Body Parchment Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FCFAF6] dark:bg-[#111927] border border-[#EBE6DD] dark:border-slate-800 shadow-inner">
          <div className="mb-4 pb-3 border-b border-[#E8E2D6] dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
              {draft.title}
            </h3>
            <span className="text-[11px] text-slate-400 font-serif italic">
              {draft.recipient}
            </span>
          </div>

          <div className="font-serif text-sm sm:text-base leading-relaxed sm:leading-loose text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-text">
            {draft.content}
          </div>
        </div>

        {/* Resurfaced Question Section */}
        {isResurfaced ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                This letter has resurfaced: Does this still feel true?
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When words sit in darkness and return to the light, their truth often changes. How does this read to you now?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleResponse('yes')}
                className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
              >
                <span className="text-lg">✨</span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Yes
                  </p>
                  <p className="text-[10px] text-slate-400">Still feels true</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleResponse('no')}
                className="p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
              >
                <span className="text-lg">🍃</span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    No
                  </p>
                  <p className="text-[10px] text-slate-400">Outgrown this feeling</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleResponse('complicated')}
                className="p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
              >
                <span className="text-lg">🌊</span>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    It's complicated
                  </p>
                  <p className="text-[10px] text-slate-400">Layered emotions</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            <Lock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
            <span>This letter is resting in the vault. It will resurface unprompted at its appointed time.</span>
          </div>
        )}

        {/* Past Responses Log */}
        {draft.reflections.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Resurfacing Check-in History ({draft.reflections.length})</span>
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              {draft.reflections.slice().reverse().map((r) => {
                const badge = getResponseBadge(r.response);
                const Icon = badge.icon;
                const timeStr = new Date(r.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard Letter</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Return to Vault
          </button>
        </div>
      </div>
    </Modal>
  );
};
