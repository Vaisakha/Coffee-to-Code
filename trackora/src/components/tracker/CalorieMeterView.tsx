import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  PieChart,
  Apple,
  Dumbbell,
  Target,
  Sparkles,
  ChevronDown,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalorieMealItem } from '../../types';

export const CalorieMeterView: React.FC = () => {
  const { calorieData, addCalorieMeal, removeCalorieMeal, updateCalorieTargets } = useApp();

  // Add meal form state
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [fats, setFats] = useState<number | ''>('');
  const [mealType, setMealType] = useState<CalorieMealItem['mealType']>('lunch');

  // Quick preset foods
  const quickPresets = [
    { name: 'Oatmeal with Blueberries & Honey', cal: 320, p: 12, c: 54, f: 6, type: 'breakfast' as const },
    { name: 'Avocado Toast with Poached Egg', cal: 390, p: 16, c: 32, f: 22, type: 'breakfast' as const },
    { name: 'Grilled Chicken Salad with Olive Oil', cal: 480, p: 44, c: 18, f: 24, type: 'lunch' as const },
    { name: 'Protein Smoothie & Banana', cal: 280, p: 30, c: 35, f: 3, type: 'snack' as const },
    { name: 'Baked Salmon with Sweet Potato', cal: 580, p: 42, c: 45, f: 20, type: 'dinner' as const },
  ];

  // Computations
  const totalConsumed = calorieData.meals.reduce((sum, m) => sum + m.calories, 0);
  const burned = calorieData.burnedCalories;
  const netCalories = totalConsumed - burned;
  const remaining = calorieData.dailyTargetCalories - netCalories;
  const progressPct = Math.min(100, Math.round((totalConsumed / calorieData.dailyTargetCalories) * 100));

  const totalProtein = calorieData.meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const totalCarbs = calorieData.meals.reduce((sum, m) => sum + m.carbsGrams, 0);
  const totalFats = calorieData.meals.reduce((sum, m) => sum + m.fatsGrams, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !calories) return;

    addCalorieMeal({
      name: mealName.trim(),
      calories: Number(calories),
      proteinGrams: Number(protein) || 0,
      carbsGrams: Number(carbs) || 0,
      fatsGrams: Number(fats) || 0,
      mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setIsAddingMeal(false);
  };

  const handleAddPreset = (p: typeof quickPresets[0]) => {
    addCalorieMeal({
      name: p.name,
      calories: p.cal,
      proteinGrams: p.p,
      carbsGrams: p.c,
      fatsGrams: p.f,
      mealType: p.type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-rose-500/10 p-6 rounded-3xl border border-orange-200/60 dark:border-orange-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Flame className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Calorie & Macro Fuel Meter
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Target: {calorieData.dailyTargetCalories.toLocaleString()} kcal • Burned from cardio: {burned.toLocaleString()} kcal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingMeal(!isAddingMeal)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C2833] hover:bg-[#15202B] text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Meal / Food</span>
          </button>
        </div>
      </div>

      {/* Main Gauge & Macro Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Calorie Meter Gauge Card (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Daily Energy Balance
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
              {progressPct}% of Target
            </span>
          </div>

          {/* Meter Circular Display */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#F97316"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressPct) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {totalConsumed}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  Kcal Eaten
                </span>
              </div>
            </div>

            {/* Quick Metrics Columns */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="text-xs text-slate-500 font-medium">Daily Goal</span>
                <span className="text-xs font-bold text-slate-900">{calorieData.dailyTargetCalories} kcal</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="text-xs text-slate-500 font-medium">Burned (Cardio)</span>
                <span className="text-xs font-bold text-emerald-600">-{burned} kcal</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <span className="text-xs text-slate-500 font-medium">Net Calories</span>
                <span className="text-xs font-bold text-slate-900">{netCalories} kcal</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-4 pt-1 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">Remaining</span>
                <span className={`text-sm font-black ${remaining >= 0 ? 'text-orange-600' : 'text-rose-600'}`}>
                  {remaining} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Burned synced with 12.08 km running activity</span>
            <span className="text-emerald-600 font-bold">Optimal fuel zone</span>
          </div>
        </div>

        {/* Macronutrient Splits Card (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Macronutrient Targets
            </h3>
            <span className="text-xs text-slate-400 font-medium">Protein • Carbs • Fats</span>
          </div>

          <div className="space-y-4 my-2">
            {/* Protein */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Protein
                </span>
                <span className="text-slate-600">
                  {totalProtein}g / {calorieData.targetProteinGrams}g ({Math.min(100, Math.round((totalProtein / calorieData.targetProteinGrams) * 100))}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalProtein / calorieData.targetProteinGrams) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Carbohydrates
                </span>
                <span className="text-slate-600">
                  {totalCarbs}g / {calorieData.targetCarbsGrams}g ({Math.min(100, Math.round((totalCarbs / calorieData.targetCarbsGrams) * 100))}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalCarbs / calorieData.targetCarbsGrams) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  Healthy Fats
                </span>
                <span className="text-slate-600">
                  {totalFats}g / {calorieData.targetFatsGrams}g ({Math.min(100, Math.round((totalFats / calorieData.targetFatsGrams) * 100))}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalFats / calorieData.targetFatsGrams) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Macro Ratio Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Energy Distribution:</span>
              <span>40% Carbs • 30% Protein • 30% Fats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Form Modal / Inline Box */}
      {isAddingMeal && (
        <form onSubmit={handleAddSubmit} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900">Add Meal Entry</h4>
            <button
              type="button"
              onClick={() => setIsAddingMeal(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Food / Meal Name</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Avocado Toast & Poached Eggs"
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="420"
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="25"
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full mt-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-orange-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">Logging meals contributes to consistency score & awards +20 XP</span>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Add Entry
            </button>
          </div>
        </form>
      )}

      {/* Quick Preset Foods */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
          Quick-Log Smart Presets
        </h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {quickPresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleAddPreset(p)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200/80 text-left shrink-0 transition-all hover:scale-102"
            >
              <Apple className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">{p.name}</p>
                <p className="text-[10px] text-slate-400">
                  {p.cal} kcal • {p.p}g P • {p.c}g C
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Meals Log Table */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Today's Food Journal
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {calorieData.meals.length} Meals Logged
          </span>
        </div>

        <div className="space-y-2.5">
          {calorieData.meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs capitalize">
                  {meal.mealType[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{meal.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    <span className="capitalize">{meal.mealType}</span> • {meal.time} • {meal.proteinGrams}g Protein • {meal.carbsGrams}g Carbs • {meal.fatsGrams}g Fats
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-900">{meal.calories} kcal</span>
                <button
                  onClick={() => removeCalorieMeal(meal.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-opacity"
                  title="Remove entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
