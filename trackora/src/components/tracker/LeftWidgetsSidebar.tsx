import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  BookOpen,
  Footprints,
  Sparkles,
  Volume2,
  Zap,
  Moon,
  Sun,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type TrackerMode = 'Work mode' | 'Focus mode' | 'Rest mode' | 'Weekend mode';

const MODE_CONFIGS = {
  'Work mode': {
    name: 'Work mode' as TrackerMode,
    icon: Briefcase,
    color: 'text-slate-800',
    buttonClass: 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800',
    badgeClass: 'bg-slate-100 text-slate-700',
    desc: 'Deep work & productivity sprints',
    defaultSeconds: 900, // 15 mins
    trackIndex: 0,
    heading: 'Plan your day. Build better habits.',
  },
  'Focus mode': {
    name: 'Focus mode' as TrackerMode,
    icon: Zap,
    color: 'text-purple-600',
    buttonClass: 'bg-purple-50/80 hover:bg-purple-100/70 border-purple-200/90 text-purple-900',
    badgeClass: 'bg-purple-100 text-purple-700',
    desc: '25-min Pomodoro & flow state',
    defaultSeconds: 1500, // 25 mins
    trackIndex: 1, // Binaural focus
    heading: 'Hyper-focus session activated',
  },
  'Rest mode': {
    name: 'Rest mode' as TrackerMode,
    icon: Moon,
    color: 'text-emerald-600',
    buttonClass: 'bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200/90 text-emerald-900',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    desc: 'Daily routine & mindful reset',
    defaultSeconds: 600, // 10 mins
    trackIndex: 2, // Nordic forest rain
    heading: 'Stay consistent. One day at a time.',
  },
  'Weekend mode': {
    name: 'Weekend mode' as TrackerMode,
    icon: Sun,
    color: 'text-amber-600',
    buttonClass: 'bg-amber-50/80 hover:bg-amber-100/70 border-amber-200/90 text-amber-900',
    badgeClass: 'bg-amber-100 text-amber-700',
    desc: 'Recharge & habit balance',
    defaultSeconds: 1200, // 20 mins
    trackIndex: 0,
    heading: 'Recharge, explore and unwind',
  },
} as const;

interface LeftWidgetsSidebarProps {
  onOpenAddWidget?: () => void;
}

export const LeftWidgetsSidebar: React.FC<LeftWidgetsSidebarProps> = ({ onOpenAddWidget }) => {
  const { addToast } = useApp();

  // Mode Dropdown State
  const [currentMode, setCurrentMode] = useState<TrackerMode>('Rest mode');
  const [isModeOpen, setIsModeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModeOpen(false);
      }
    };
    if (isModeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModeOpen]);

  // Reading Tracker State
  const [pagesRead, setPagesRead] = useState(120);
  const totalPages = 200;

  // Music Player State
  const tracks = [
    { title: 'Deep work Music', artist: 'H7G group band' },
    { title: 'Binaural Focus 40Hz', artist: 'Alpha Waves Lab' },
    { title: 'Nordic Forest Rain', artist: 'Calm Soundscapes' },
  ];
  const [trackIndex, setTrackIndex] = useState(2); // starts with Nordic Forest Rain for Rest mode
  const [isPlaying, setIsPlaying] = useState(false);

  // Quiet Time Timer State
  const initialSeconds = 600;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      addToast('🔔 Quiet Time Complete!', 'Mindful focus session achieved.', 'achievement');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, addToast]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    if (timeLeft === 0) setTimeLeft(MODE_CONFIGS[currentMode].defaultSeconds);
    setIsTimerRunning(!isTimerRunning);
  };

  const handleCancelTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(MODE_CONFIGS[currentMode].defaultSeconds);
    addToast('Timer Reset', 'Quiet time reset.', 'info');
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      addToast('Now Playing', `${tracks[trackIndex].title} — ${tracks[trackIndex].artist}`, 'info');
    }
  };

  const handleNextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSelectMode = (mode: TrackerMode) => {
    const config = MODE_CONFIGS[mode];
    setCurrentMode(mode);
    setIsModeOpen(false);
    setIsTimerRunning(false);
    setTimeLeft(config.defaultSeconds);
    setTrackIndex(config.trackIndex);
    addToast(
      `Switched to ${mode}`,
      `${config.desc} • Timer set to ${Math.round(config.defaultSeconds / 60)} mins`,
      'info'
    );
  };

  const handleIncrementReading = () => {
    if (pagesRead < totalPages) {
      const next = Math.min(totalPages, pagesRead + 10);
      setPagesRead(next);
      addToast('Reading Progress Logged', `+10 pages read! (${next}/${totalPages})`, 'success');
    }
  };

  const currentConfig = MODE_CONFIGS[currentMode];
  const ActiveModeIcon = currentConfig.icon;

  return (
    <div className="w-full lg:w-[340px] xl:w-[370px] shrink-0 flex flex-col gap-4">
      {/* Top macOS Traffic Dots & Header */}
      <div className="pt-1">
        {/* Traffic Light Dots */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-xs cursor-pointer hover:opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-xs cursor-pointer hover:opacity-80" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-xs cursor-pointer hover:opacity-80" />
        </div>

        {/* Greeting & Mode Dropdown Row */}
        <div className="flex items-start justify-between gap-3 relative">
          <div>
            <p className="text-xs font-semibold text-slate-400">Hi Alex 👋</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mt-0.5">
              {currentConfig.heading}
            </h1>
          </div>

          {/* Upgraded Mode Pill Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsModeOpen(!isModeOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs transition-all duration-200 ${currentConfig.buttonClass}`}
              title="Change active routine mode"
            >
              <ActiveModeIcon className={`w-3.5 h-3.5 ${currentConfig.color}`} />
              <span>{currentMode}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isModeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Rich Glassmorphic Popover Menu */}
            {isModeOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in">
                <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Routine Mode
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    4 Presets
                  </span>
                </div>

                <div className="space-y-1">
                  {(Object.keys(MODE_CONFIGS) as TrackerMode[]).map((modeKey) => {
                    const item = MODE_CONFIGS[modeKey];
                    const Icon = item.icon;
                    const isSelected = currentMode === modeKey;

                    return (
                      <button
                        key={modeKey}
                        onClick={() => handleSelectMode(modeKey)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left ${
                          isSelected
                            ? 'bg-slate-100/90 shadow-2xs font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.badgeClass}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Auto-syncs timer & music</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 1: Two Mini Photo Cards (Reading & Distance) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Reading */}
        <div
          onClick={handleIncrementReading}
          className="group relative h-44 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 bg-[#0C1926] p-3.5 flex flex-col justify-between text-white select-none"
          title="Click to log reading progress"
        >
          {/* Background image & gradient overlay */}
          <img
            src="/images/reading_book.jpg"
            alt="Reading Book"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1926] via-[#0C1926]/40 to-transparent" />

          {/* Top Label */}
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-200 tracking-wide">Reading</span>
          </div>

          {/* Bottom Metric */}
          <div className="relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight">{pagesRead}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">/ {totalPages} pages</p>

            {/* Subtle mini progress bar */}
            <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(pagesRead / totalPages) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Running Distance */}
        <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-slate-800 p-3.5 flex flex-col justify-between text-white select-none">
          <img
            src="/images/runner_trail.jpg"
            alt="Running Distance"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

          {/* GPS Polyline SVG overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" fill="none">
            <path
              d="M 25 70 C 40 45, 60 50, 50 25 C 45 15, 65 20, 75 35"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeDasharray="3 3"
              strokeLinecap="round"
              className="opacity-90"
            />
          </svg>

          {/* Date Label */}
          <div className="relative z-10">
            <span className="text-[10px] font-semibold text-slate-200/90 tracking-wide">
              Sun, 12 Mar 2026
            </span>
          </div>

          {/* Distance Metric */}
          <div className="relative z-10">
            <p className="text-xl font-black tracking-tight">12.08 Km</p>
            <p className="text-[11px] text-slate-300 font-medium">Distance</p>
          </div>
        </div>
      </div>

      {/* Card 3: Deep Work Music Player */}
      <div className="relative h-28 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-emerald-900 to-slate-900 p-4 flex items-center justify-between text-white">
        {/* Background meadow scenery */}
        <img
          src="/images/music_field.jpg"
          alt="Music Scenery"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-transparent" />

        {/* Track Info & Controls */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight drop-shadow-sm">
              {tracks[trackIndex].title}
            </h3>
            <p className="text-[11px] text-white/80 font-medium">
              {tracks[trackIndex].artist}
            </p>
          </div>

          {/* Mini Playback Controls */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handlePrevTrack}
              className="p-1 text-white/80 hover:text-white transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-3.5 h-3.5 fill-white/80" />
            </button>
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-full bg-white text-slate-900 hover:scale-105 transition-all shadow-sm"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-slate-900" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5" />
              )}
            </button>
            <button
              onClick={handleNextTrack}
              className="p-1 text-white/80 hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5 fill-white/80" />
            </button>
          </div>
        </div>

        {/* Vinyl Record Illustration */}
        <div className="relative z-10 -mr-6">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-black p-1 shadow-2xl flex items-center justify-center border-2 border-slate-700/60 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            {/* Vinyl grooves */}
            <div className="w-full h-full rounded-full border border-slate-700/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-slate-700/30 flex items-center justify-center">
                {/* Center Record Label (Sky Blue) */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Quiet Time Timer Card */}
      <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-sky-600 p-4 flex flex-col justify-between text-white text-center">
        {/* Fluffy blue sky background */}
        <img
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80"
          alt="Quiet Blue Sky"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[1px]" />

        {/* Title */}
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-wider text-white/95 drop-shadow-sm">
            Quiet Time
          </p>
        </div>

        {/* Large Digital Clock */}
        <div className="relative z-10 py-1">
          <span className="text-3xl sm:text-4xl font-black tracking-widest text-white drop-shadow-md font-mono">
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCancelTimer}
            className="py-2 px-3 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 transition-all shadow-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleStartTimer}
            className="py-2 px-3 rounded-full text-xs font-bold bg-[#1C2833] hover:bg-[#15202B] text-white transition-all shadow-sm"
          >
            {isTimerRunning ? 'Pause' : 'Start Session'}
          </button>
        </div>
      </div>

      {/* Row 5: Two Mini Cards (Girl Photo & Motivational Quote) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Photo Card */}
        <div className="relative h-36 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-slate-200">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80"
            alt="Elena"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Motivational Editorial Quote Card */}
        <div className="relative h-36 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-[#FBF9F5] border border-[#EFECE6] p-3 flex flex-col justify-center items-center text-center select-none">
          <div className="relative">
            <p className="font-serif text-slate-800 text-xs sm:text-[13px] leading-snug font-medium italic">
              The smallest<br />
              steps are still
            </p>
            {/* Word "progress." with hand-drawn teal oval loop */}
            <div className="relative inline-block mt-0.5">
              <span className="font-serif text-slate-900 text-sm sm:text-base font-semibold italic">
                progress.
              </span>
              <svg
                className="absolute -inset-x-2 -inset-y-1 w-[calc(100%+16px)] h-[calc(100%+8px)] pointer-events-none"
                viewBox="0 0 100 40"
                fill="none"
              >
                <ellipse
                  cx="50"
                  cy="20"
                  rx="45"
                  ry="16"
                  stroke="#14B8A6"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  transform="rotate(-2 50 20)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button: + Add New Widget */}
      <button
        onClick={onOpenAddWidget}
        className="w-full py-3 px-4 rounded-2xl bg-[#22332C] hover:bg-[#1A2822] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add New Widget</span>
      </button>
    </div>
  );
};
