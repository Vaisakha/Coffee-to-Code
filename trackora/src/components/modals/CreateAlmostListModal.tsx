import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { AlmostListCategory } from '../../types';
import { Briefcase, Heart, Compass, Palette, Sparkles, Calendar, Clock, AlertCircle } from 'lucide-react';

interface CreateAlmostListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: AlmostListCategory; label: string; icon: any; desc: string }[] = [
  { id: 'career', label: 'Career', icon: Briefcase, desc: 'A job, promotion, or venture declined' },
  { id: 'relationship', label: 'Relationship', icon: Heart, desc: 'A boundary set or unhelpful connection released' },
  { id: 'travel', label: 'Travel', icon: Compass, desc: 'A trip or relocation decided against' },
  { id: 'creative', label: 'Creative', icon: Palette, desc: 'A project or pursuit consciously held back' },
  { id: 'other', label: 'Other', icon: Sparkles, desc: 'Any conscious path intentionally not taken' },
];

export const CreateAlmostListModal: React.FC<CreateAlmostListModalProps> = ({ isOpen, onClose }) => {
  const { createAlmostListItem } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultRevisit = new Date();
  defaultRevisit.setMonth(defaultRevisit.getMonth() + 3);
  const defaultRevisitStr = defaultRevisit.toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState<AlmostListCategory>('career');
  const [dateLogged, setDateLogged] = useState(todayStr);
  const [revisitDate, setRevisitDate] = useState(defaultRevisitStr);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleClose = () => {
    setTitle('');
    setShortDescription('');
    setCategory('career');
    setDateLogged(todayStr);
    setRevisitDate(defaultRevisitStr);
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Please provide a title for this decision.' });
      return;
    }

    createAlmostListItem({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      category,
      dateLogged,
      revisitDate: revisitDate || defaultRevisitStr,
    });

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Log to Almost List"
      subtitle="A quiet space for decisions consciously made not to act"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Helper philosophy banner */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200/90 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Saying no is an act of clarity. Record what you decided against — a role not pursued, a trip postponed, or a message left unwritten. You'll check back in after time has done its work.
          </span>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            What did you consciously not do? *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({});
            }}
            placeholder="e.g., Turned down the relocation offer / Did not send the late text"
            className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
              errors.title
                ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30'
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

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Context & Reasoning
          </label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={3}
            placeholder="Why did you make this decision at the time? What mattered to you most in that moment?"
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
          />
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">{cat.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight line-clamp-1">
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date Logged</span>
            </label>
            <input
              type="date"
              value={dateLogged}
              onChange={(e) => setDateLogged(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Revisit Date</span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">(default 3 mo)</span>
            </label>
            <input
              type="date"
              value={revisitDate}
              onChange={(e) => setRevisitDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-emerald-500/25 transition-all"
          >
            Save to Almost List
          </button>
        </div>
      </form>
    </Modal>
  );
};
