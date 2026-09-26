import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { VaultRecipientType } from '../../types';
import { Lock, Heart, Users, Feather, Sparkles, User, AlertCircle, Shield } from 'lucide-react';

interface CreateVaultDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECIPIENT_TYPES: { id: VaultRecipientType; label: string; icon: any; placeholder: string; helper: string }[] = [
  { id: 'ex', label: 'An Ex', icon: Heart, placeholder: 'To Chloe / To my former partner', helper: 'Words left unsaid after love ended' },
  { id: 'estranged_friend', label: 'Estranged Friend', icon: Users, placeholder: 'To an old friend / To Maya', helper: 'For a bond that drifted or fractured' },
  { id: 'passed_away', label: 'Someone Passed Away', icon: Feather, placeholder: 'To Marcus / To Grandfather', helper: 'Speaking to someone you carry in memory' },
  { id: 'younger_self', label: 'Younger Self', icon: User, placeholder: 'To myself at 18 / To my younger self', helper: 'Compassion and forgiveness for who you were' },
  { id: 'future_self', label: 'Future Self', icon: Sparkles, placeholder: 'To myself in 5 years', helper: 'Hopes, promises, or reminders for who you want to be' },
  { id: 'other', label: 'Other', icon: Shield, placeholder: 'To someone unnamed', helper: 'Anyone who needs your unexpressed thoughts' },
];

export const CreateVaultDraftModal: React.FC<CreateVaultDraftModalProps> = ({ isOpen, onClose }) => {
  const { createUnsentDraft } = useApp();

  const [recipientType, setRecipientType] = useState<VaultRecipientType>('estranged_friend');
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const activeTypeConfig = RECIPIENT_TYPES.find((t) => t.id === recipientType) || RECIPIENT_TYPES[0];

  const handleClose = () => {
    setRecipientType('estranged_friend');
    setRecipient('');
    setTitle('');
    setContent('');
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please provide a title or subject for this letter.';
    }
    if (!content.trim()) {
      newErrors.content = 'Write what you need to express before sealing the letter.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createUnsentDraft({
      recipient: recipient.trim() || activeTypeConfig.placeholder,
      recipientType,
      title: title.trim(),
      content: content.trim(),
    });

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Write an Unsent Letter"
      subtitle="Words written only for release. Preserved, locked, and never sent."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Solemn Reassurance Notice */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">
              Permanent Vault Sealing Notice
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Once saved, this letter is strictly <strong>reread only</strong>. There is no editing, no exporting, and no sending. A hidden resurfacing date (1–12 months out) will be randomly generated without showing it in advance.
            </p>
          </div>
        </div>

        {/* Recipient Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Who is this letter for?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {RECIPIENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = recipientType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setRecipientType(type.id);
                    if (!recipient) setRecipient('');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold truncate">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipient Designation & Subject Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Addressed To
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={activeTypeConfig.placeholder}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Title or Subject *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g., What I couldn't say then / The quiet closure"
              className={`w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>
        </div>

        {/* Content / Letter Body */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Letter Body *</span>
            <span className="text-[10px] text-slate-400 font-normal lowercase">
              Write freely. This will never leave your device.
            </span>
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
            }}
            rows={7}
            placeholder="Dear...&#10;&#10;Write with honesty. Say what needs to be said, unedited and unperformed. Once sealed, you will release the burden of having to send it."
            className={`w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-850 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-serif leading-relaxed resize-none ${
              errors.content
                ? 'border-rose-400 bg-rose-50/20'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.content && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.content}</span>
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Hidden resurfacing date (1–12 mo) generated automatically</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Seal into Vault</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
