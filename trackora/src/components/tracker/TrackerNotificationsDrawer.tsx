import React from 'react';
import { X, Check, Bell, Sparkles, Flame, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackerNotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-semibold text-emerald-600 hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-slate-50/60 border-slate-100 opacity-70'
                  : 'bg-white border-emerald-100 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
