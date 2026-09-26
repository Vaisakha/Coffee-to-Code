import React from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  Zap,
  Snowflake,
  Activity,
  Flame,
  ShieldCheck,
  Heart,
  Cpu,
  Layers,
  Code
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const pillars = [
    {
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
      title: 'Atomic Consistency',
      desc: 'Small daily actions compound into life-changing momentum. Tracking micro-routines removes friction and builds lasting neural pathways.',
    },
    {
      icon: Snowflake,
      color: 'text-sky-600 bg-sky-50',
      title: 'Streak Freeze Vault',
      desc: 'Consistency is about resilience, not perfection. Equip freeze shields to protect your active streaks during travels, rest days, or busy schedules.',
    },
    {
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
      title: 'Gamified XP & Levels',
      desc: 'Earn experience points for completing habits, logging daily wins, and sticking to routines. Level up from Novice Builder to Legend of Habits.',
    },
    {
      icon: Flame,
      color: 'text-orange-600 bg-orange-50',
      title: 'Calorie & Macro Fuel Meter',
      desc: 'Balance daily caloric intake against athletic expenditures. Monitor protein, carbohydrate, and healthy fat distribution for peak energy.',
    },
    {
      icon: Activity,
      color: 'text-teal-600 bg-teal-50',
      title: 'Physical Biometrics & BMI',
      desc: 'Calculate real-time Body Mass Index, Basal Metabolic Rate (BMR), target weight progression, resting heart rate, and personalized hydration goals.',
    },
    {
      icon: Heart,
      color: 'text-rose-600 bg-rose-50',
      title: 'Circadian & Vitals Balance',
      desc: 'Track sleep cycles (deep vs total sleep), cortisol stress levels, and post-meditation heart rate to maintain nervous system recovery.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-lg">
        {/* Ambient Blur circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-emerald-100 border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trackora Daily Consistency Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Build better days, one mindful habit at a time.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mt-3 font-normal">
            Trackora blends behavioral psychology, circadian neuroscience, and gamification to help you sustain daily focus, recovery, and holistic wellness.
          </p>
        </div>
      </div>

      {/* Feature Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${pillar.color}`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technology & Architecture Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Local-First Reactive Architecture</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Built with React 18, TypeScript, Vite & Tailwind CSS. Zero external telemetry, instant offline persistence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
            v2.4.0 Stable
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Production Ready
          </span>
        </div>
      </div>
    </div>
  );
};
