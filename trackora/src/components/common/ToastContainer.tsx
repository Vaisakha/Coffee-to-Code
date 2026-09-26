import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Trophy, Flame, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'achievement':
              return <Trophy className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />;
            case 'fire':
              return <Flame className="w-5 h-5 text-orange-500 shrink-0 animate-pulse" />;
            case 'warning':
              return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            case 'info':
              return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
            default:
              return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'achievement':
              return 'border-amber-400/50 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 shadow-amber-500/10';
            case 'fire':
              return 'border-orange-400/50 bg-orange-50/90 dark:bg-orange-950/40 text-orange-900 dark:text-orange-100 shadow-orange-500/10';
            case 'warning':
              return 'border-rose-400/50 bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 shadow-rose-500/10';
            case 'info':
              return 'border-sky-400/50 bg-sky-50/90 dark:bg-sky-950/40 text-sky-900 dark:text-sky-100 shadow-sky-500/10';
            default:
              return 'border-emerald-400/50 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-emerald-500/10';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 animate-fade-in ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-xs opacity-90 mt-0.5 leading-snug line-clamp-2">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
