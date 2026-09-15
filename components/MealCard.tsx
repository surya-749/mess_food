'use client';

import { MealMenu } from '../types/menu';
import { Check, Plus, Minus } from 'lucide-react';

const MEAL_COLORS: Record<string, { dot: string; header: string; badge: string }> = {
  Breakfast: { dot: 'bg-amber-400',   header: 'from-amber-50 to-orange-50',  badge: 'bg-amber-100 text-amber-700'  },
  Lunch:     { dot: 'bg-teal-500',    header: 'from-teal-50 to-emerald-50',  badge: 'bg-teal-100 text-teal-700'    },
  Snacks:    { dot: 'bg-rose-400',    header: 'from-rose-50 to-pink-50',     badge: 'bg-rose-100 text-rose-700'    },
  Dinner:    { dot: 'bg-indigo-500',  header: 'from-indigo-50 to-violet-50', badge: 'bg-indigo-100 text-indigo-700'},
};

const MEAL_TIMES: Record<string, string> = {
  Breakfast: '7:00 – 9:00 AM',
  Lunch:     '12:00 – 2:00 PM',
  Snacks:    '5:00 – 6:30 PM',
  Dinner:    '7:00 – 9:00 PM',
};

interface MealCardProps {
  meal: MealMenu;
  selections: Record<string, number>;
  onToggleItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export default function MealCard({ meal, selections, onToggleItem, onUpdateQuantity }: MealCardProps) {
  const colors = MEAL_COLORS[meal.type] ?? MEAL_COLORS.Dinner;
  const selectedCount = Object.values(selections).reduce((s, q) => s + (q > 0 ? 1 : 0), 0);

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-stone-200/60 overflow-hidden mb-5 transition-shadow hover:shadow-md">

      {/* Card Header */}
      <div className={`bg-gradient-to-r ${colors.header} px-5 py-4 flex items-center justify-between border-b border-stone-100`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-sm`} />
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight leading-none">{meal.type}</h3>
            <p className="text-[10px] font-bold text-stone-400 mt-0.5 uppercase tracking-wider">{MEAL_TIMES[meal.type]}</p>
          </div>
        </div>
        {selectedCount > 0 && (
          <span className={`text-xs font-black px-3 py-1 rounded-full ${colors.badge}`}>
            {selectedCount} picked
          </span>
        )}
      </div>

      {/* Items */}
      <div className="p-3 flex flex-col gap-2">
        {meal.items.map(item => {
          const qty = selections[item.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={item.id}
              className={`group flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-150
                ${isSelected
                  ? 'border-orange-300 bg-orange-50/40'
                  : 'border-transparent bg-stone-50 hover:bg-stone-100/70 hover:border-stone-200'}`}
            >
              {/* Veg/Non-veg indicator – Indian standard */}
              <div
                className={`flex-none w-4 h-4 rounded-sm border-2 flex items-center justify-center
                  ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}
                title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
                <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              </div>

              {/* Name + macros — clickable for normal items */}
              <button
                className="flex-1 text-left min-w-0"
                onClick={() => !item.allowMultiple && onToggleItem(item.id)}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${item.name}`}
              >
                <span className={`text-sm font-bold leading-tight block truncate ${isSelected ? 'text-orange-900' : 'text-stone-800'}`}>
                  {item.name}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.category && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 bg-stone-200/60 px-1.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  )}
                  {item.caloriesPer100g && (
                    <span className="text-[9px] font-black text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md">
                      {item.caloriesPer100g} kcal
                    </span>
                  )}
                  {item.proteinPer100g && (
                    <span className="text-[9px] font-black text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-md">
                      P {item.proteinPer100g}g
                    </span>
                  )}
                </div>
              </button>

              {/* Controls */}
              <div className="flex-none flex items-center">
                {item.allowMultiple ? (
                  <div className="flex items-center gap-0.5 bg-white border-2 border-stone-200 rounded-xl overflow-hidden shadow-sm h-10">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      disabled={qty === 0}
                      className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-50 disabled:opacity-30 transition-colors active:scale-90"
                      aria-label="Decrease">
                      <Minus size={15} strokeWidth={2.5} />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-stone-800" aria-live="polite">{qty}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors active:scale-90"
                      aria-label="Increase">
                      <Plus size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onToggleItem(item.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 shadow-sm
                      ${isSelected
                        ? 'text-white border-orange-500'
                        : 'border-stone-300 text-transparent group-hover:border-stone-400 bg-white'}`}
                    style={isSelected ? { background: 'linear-gradient(135deg,#f97316,#ea580c)' } : {}}
                    aria-label={isSelected ? `Deselect ${item.name}` : `Select ${item.name}`}>
                    <Check size={15} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
