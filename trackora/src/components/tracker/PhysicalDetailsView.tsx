import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  Scale,
  Ruler,
  TrendingDown,
  Edit3,
  Check,
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PhysicalDetailsView: React.FC = () => {
  const { physicalDetails, updatePhysicalDetails } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [height, setHeight] = useState(physicalDetails.heightCm);
  const [weight, setWeight] = useState(physicalDetails.weightKg);
  const [targetWeight, setTargetWeight] = useState(physicalDetails.targetWeightKg);
  const [age, setAge] = useState(physicalDetails.age);
  const [bodyFat, setBodyFat] = useState(physicalDetails.bodyFatPercentage || 19.5);
  const [restingHr, setRestingHr] = useState(physicalDetails.restingHeartRate || 62);
  const [bloodPressure, setBloodPressure] = useState(physicalDetails.bloodPressure || '118/78');

  // BMI Calculation
  const heightM = physicalDetails.heightCm / 100;
  const bmi = Number((physicalDetails.weightKg / (heightM * heightM)).toFixed(1));

  const getBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmiValue <= 24.9) return { label: 'Normal / Healthy Range', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmiValue <= 29.9) return { label: 'Overweight', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { label: 'Obese', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const bmiCat = getBmiCategory(bmi);

  // BMR (Basal Metabolic Rate - Mifflin-St Jeor formula for women):
  // 10*weight + 6.25*height - 5*age - 161
  const bmr = Math.round(
    10 * physicalDetails.weightKg + 6.25 * physicalDetails.heightCm - 5 * physicalDetails.age - 161
  );

  // TDEE (Moderate activity x1.55)
  const tdee = Math.round(bmr * 1.55);

  // Daily Water Goal
  const waterLiters = (physicalDetails.weightKg * 0.035).toFixed(1);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePhysicalDetails({
      heightCm: Number(height),
      weightKg: Number(weight),
      targetWeightKg: Number(targetWeight),
      age: Number(age),
      bodyFatPercentage: Number(bodyFat),
      restingHeartRate: Number(restingHr),
      bloodPressure,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-sky-500/10 p-6 rounded-3xl border border-teal-200/60 dark:border-teal-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Physical Details & Biometrics
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Personal body composition, metabolic markers, and vitality metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C2833] hover:bg-[#15202B] text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 stroke-[2]" />
          <span>{isEditing ? 'Cancel Editing' : 'Update Metrics'}</span>
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Update Body Measurements</h3>
            <span className="text-[11px] text-slate-400">All metrics recalculate dynamically</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(Number(e.target.value))}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Resting HR (bpm)</label>
              <input
                type="number"
                value={restingHr}
                onChange={(e) => setRestingHr(Number(e.target.value))}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Blood Pressure</label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="118/78"
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Main Biometrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Weight */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Weight</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {physicalDetails.weightKg}
            </span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Target: {physicalDetails.targetWeightKg} kg ({(physicalDetails.weightKg - physicalDetails.targetWeightKg).toFixed(1)} kg to goal)
          </p>
        </div>

        {/* Height */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Height</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {physicalDetails.heightCm}
            </span>
            <span className="text-xs font-bold text-slate-400">cm</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            5 feet 8 inches
          </p>
        </div>

        {/* Body Mass Index (BMI) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">BMI Index</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {bmi}
            </span>
            <span className="text-xs font-bold text-slate-400">kg/m²</span>
          </div>
          <div className="mt-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${bmiCat.color}`}>
              {bmiCat.label}
            </span>
          </div>
        </div>

        {/* Body Fat Percentage */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Body Fat</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {physicalDetails.bodyFatPercentage || 19.5}%
            </span>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            Athletic / Fitness Range
          </p>
        </div>
      </div>

      {/* Secondary Metabolic & Vitality Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Resting Heart Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Resting Heart Rate</h4>
              <p className="text-[11px] text-slate-400">Cardiovascular efficiency</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {physicalDetails.restingHeartRate || 62}
            </span>
            <span className="text-xs font-bold text-slate-400">Bpm</span>
          </div>

          <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl font-semibold border border-emerald-100">
            ✓ Top 15% cardiovascular recovery
          </p>
        </div>

        {/* Basal Metabolic Rate (BMR) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Metabolic Burn (BMR)</h4>
              <p className="text-[11px] text-slate-400">Calories burned at rest</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {bmr.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">kcal/day</span>
          </div>

          <p className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl font-semibold border border-amber-100">
            TDEE Active Burn: ~{tdee.toLocaleString()} kcal
          </p>
        </div>

        {/* Hydration Requirement */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-sky-500 fill-sky-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Optimal Hydration</h4>
              <p className="text-[11px] text-slate-400">Calculated based on body weight</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {waterLiters}
            </span>
            <span className="text-xs font-bold text-slate-400">Liters / Day</span>
          </div>

          <p className="text-[11px] text-sky-800 bg-sky-50 px-2.5 py-1 rounded-xl font-semibold border border-sky-100">
            ~8-10 glasses fresh water
          </p>
        </div>
      </div>
    </div>
  );
};
