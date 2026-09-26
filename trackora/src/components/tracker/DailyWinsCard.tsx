import React, { useState } from 'react';
import { Trophy, Plus, Sparkles, Check, Trash2, Award, Flame, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DailyWinsCard: React.FC = () => {
  const { dailyWins, addDailyWin, removeDailyWin } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [winTitle, setWinTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌟');

  const emojis = ['🌟', '🧘', '🏃', '📖', '💧', '🥗', '⚡', '🎯'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!winTitle.trim()) return;
    addDailyWin(winTitle.trim(), 'personal', 35, selectedEmoji);
    setWinTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Daily Wins</h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {dailyWins.length} Logged Today
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F2D27] hover:bg-[#16211C] text-white text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Log Win</span>
        </button>
      </div>

      {/* Inline Add Win Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500">Pick Icon:</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {emojis.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                    selectedEmoji === emoji ? 'bg-amber-100 scale-110 shadow-xs ring-1 ring-amber-400' : 'hover:bg-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={winTitle}
              onChange={(e) => setWinTitle(e.target.value)}
              placeholder="What victory did you achieve today? (e.g. 5km walk)"
              className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-amber-400 text-slate-800"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-2 rounded-xl text-slate-400 hover:text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Wins List */}
      <div className="space-y-2 flex-1">
        {dailyWins.length === 0 ? (
          <div className="py-6 text-center text-slate-400">
            <p className="text-xs">No daily wins logged yet today.</p>
            <p className="text-[11px] mt-0.5">Every small effort counts toward your consistency!</p>
          </div>
        ) : (
          dailyWins.map((win) => (
            <div
              key={win.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100/90 transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg shrink-0">{win.icon || '🌟'}</span>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{win.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{win.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                  <span>+{win.xpEarned} XP</span>
                </span>
                <button
                  onClick={() => removeDailyWin(win.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-opacity"
                  title="Remove win"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Motivational footer banner */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Consistency compound effect</span>
        </span>
        <span className="font-bold text-slate-700">
          +{dailyWins.reduce((sum, w) => sum + w.xpEarned, 0)} XP Earned Today
        </span>
      </div>
    </div>
  );
};
