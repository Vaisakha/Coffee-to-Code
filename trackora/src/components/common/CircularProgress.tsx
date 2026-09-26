import React from 'react';

interface CircularProgressProps {
  value: number; // 0 - 100
  size?: number; // diameter in px
  strokeWidth?: number;
  gradientId?: string;
  startColor?: string;
  endColor?: string;
  label?: string;
  subLabel?: string;
  showValueText?: boolean;
  valueSuffix?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 140,
  strokeWidth = 12,
  gradientId = 'circleGradient',
  startColor = '#10b981',
  endColor = '#06b6d4',
  label,
  subLabel,
  showValueText = true,
  valueSuffix = '%',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center flex-col select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 transition-all duration-700 ease-out"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800 transition-colors"
          fill="transparent"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          fill="transparent"
        />
      </svg>

      {/* Inner Label Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {showValueText && (
          <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-baseline justify-center">
            {clampedValue}
            {valueSuffix && <span className="text-sm font-medium text-slate-400 ml-0.5">{valueSuffix}</span>}
          </div>
        )}
        {label && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        )}
        {subLabel && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};
