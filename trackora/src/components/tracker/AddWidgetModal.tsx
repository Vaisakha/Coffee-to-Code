import React from 'react';
import { X, Droplets, Monitor, Flame, Moon, Coffee, HeartPulse, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();

  if (!isOpen) return null;

  const availableWidgets = [
    {
      id: 'water-hydration',
      title: 'Water Hydration Tracker',
      desc: 'Log daily water intake with 8-glass visual indicator.',
      icon: Droplets,
      color: 'text-sky-500 bg-sky-50',
    },
    {
      id: 'screen-time',
      title: 'Screen Time & Digital Detox',
      desc: 'Monitor phone and computer hours with threshold alerts.',
      icon: Monitor,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      id: 'calorie-counter',
      title: 'Nutritional Fuel & Calorie Log',
      desc: 'Track daily meals and mindful eating check-ins.',
      icon: Flame,
      color: 'text-orange-500 bg-orange-50',
    },
    {
      id: 'caffeine-curfew',
      title: 'Caffeine Curfew Countdown',
      desc: 'Alert when to stop caffeine for optimal deep sleep.',
      icon: Coffee,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'recovery-score',
      title: 'HRV & Nervous System Recovery',
      desc: 'Daily autonomic readiness gauge and stress balance.',
      icon: HeartPulse,
      color: 'text-rose-500 bg-rose-50',
    },
  ];

  const handleAdd = (name: string) => {
    addToast('Widget Added to Sidebar', `"${name}" will now appear in your routine.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add New Widget</h3>
            <p className="text-xs text-slate-400">Customize your consistency dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Widgets List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {availableWidgets.map((w) => {
            const Icon = w.icon;
            return (
              <div
                key={w.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${w.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{w.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{w.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(w.title)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0 shadow-xs"
                >
                  Add
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
