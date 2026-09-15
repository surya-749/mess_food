'use client';

import { useState, useEffect } from 'react';
import { getMenuForDate, getWeekOfMonth } from '../lib/mock-data';
import DailyMenuBoard from '../components/DailyMenuBoard';
import { ChevronLeft, ChevronRight, CalendarDays, UtensilsCrossed, Check, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { DailyMenu } from '../types/menu';
import { useSettings } from '../components/SettingsContext';

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const { settings } = useSettings();
  
  const [selections, setSelections] = useState<Record<string, Record<string, Record<string, number>>>>({});
  const dateKey = currentDate.toDateString();

  useEffect(() => {
    let freshMenu = getMenuForDate(currentDate);
    if (settings.vegOnly) {
      freshMenu = {
        ...freshMenu,
        meals: freshMenu.meals.map(meal => ({
          ...meal,
          items: meal.items.filter(item => item.isVeg)
        }))
      };
    }
    setMenu(freshMenu);
  }, [currentDate, settings.vegOnly]);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToggleItem = (mealType: string, itemId: string) => {
    setSelections(prev => {
      const daySelections = prev[dateKey] || {};
      const mealSelections = daySelections[mealType] || {};
      const currentQty = mealSelections[itemId] || 0;
      const newMealSelections = { ...mealSelections };
      if (currentQty > 0) {
        delete newMealSelections[itemId];
      } else {
        newMealSelections[itemId] = 1;
      }
      return { ...prev, [dateKey]: { ...daySelections, [mealType]: newMealSelections } };
    });
  };

  const handleUpdateQuantity = (mealType: string, itemId: string, delta: number) => {
    setSelections(prev => {
      const daySelections = prev[dateKey] || {};
      const mealSelections = daySelections[mealType] || {};
      const currentQty = mealSelections[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const newMealSelections = { ...mealSelections };
      if (newQty === 0) {
        delete newMealSelections[itemId];
      } else {
        newMealSelections[itemId] = newQty;
      }
      return { ...prev, [dateKey]: { ...daySelections, [mealType]: newMealSelections } };
    });
  };

  if (!menu) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf8f3' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mx-auto mb-3" />
        <p className="text-stone-500 font-medium">Loading menu…</p>
      </div>
    </div>
  );

  const currentDaySelections = selections[dateKey] || {};

  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalItemsCount = 0;
  menu.meals.forEach(meal => {
    const mealSelections = currentDaySelections[meal.type] || {};
    meal.items.forEach(item => {
      const qty = mealSelections[item.id] || 0;
      if (qty > 0) {
        totalItemsCount += qty;
        const mult = ((item.defaultServingSizeGrams || 100) / 100) * qty;
        totalCalories += (item.caloriesPer100g || 0) * mult;
        totalProtein  += (item.proteinPer100g  || 0) * mult;
        totalCarbs    += (item.carbsPer100g    || 0) * mult;
        totalFat      += (item.fatPer100g      || 0) * mult;
      }
    });
  });

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const calPct   = Math.min(100, (totalCalories / settings.calorieGoal) * 100);
  const protPct  = Math.min(100, (totalProtein  / settings.proteinGoal) * 100);

  const macros = [
    { icon: Flame,    label: 'Calories', value: `${Math.round(totalCalories)}`, goal: `/ ${settings.calorieGoal}`,  pct: calPct,  color: 'from-orange-400 to-amber-400' },
    { icon: Beef,     label: 'Protein',  value: `${Math.round(totalProtein)}g`, goal: `/ ${settings.proteinGoal}g`, pct: protPct, color: 'from-teal-400 to-emerald-400' },
    { icon: Wheat,    label: 'Carbs',    value: `${Math.round(totalCarbs)}g`,   goal: null, pct: null, color: '' },
    { icon: Droplets, label: 'Fats',     value: `${Math.round(totalFat)}g`,     goal: null, pct: null, color: '' },
  ];

  return (
    <div className="min-h-screen pb-32" style={{ background: '#fdf8f3' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-orange-100/60"
        style={{ background: 'rgba(253,248,243,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg,#f97316,#dc2626)' }}>
              <UtensilsCrossed size={18} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-stone-900">
              Mess<span style={{ color: '#f97316' }}>Mate</span>
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full border"
            style={{ color: '#0d9488', background: '#f0fdfa', borderColor: '#99f6e4' }}>
            Week {getWeekOfMonth(currentDate)}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-6">

        {/* ── Date Picker ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200/60 overflow-hidden">
          <div className="flex items-center">
            <button onClick={handlePrevDay}
              className="flex-none p-5 text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-all active:scale-90"
              aria-label="Previous day">
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            <div className="flex-1 flex flex-col items-center py-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">{menu.day}</span>
              <div className="flex items-center gap-2">
                <CalendarDays size={17} strokeWidth={2.5} style={{ color: '#f97316' }} />
                <span className="text-base font-bold text-stone-800">
                  {currentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              {isToday && (
                <span className="mt-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{ color: '#f97316', background: '#fff7ed' }}>
                  Today
                </span>
              )}
            </div>

            <button onClick={handleNextDay}
              className="flex-none p-5 text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-all active:scale-90"
              aria-label="Next day">
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Week-strip */}
          <div className="border-t border-stone-100 px-4 py-2.5 flex justify-center gap-1.5 overflow-x-auto">
            {['S','M','T','W','T','F','S'].map((d, i) => {
              const dayDate = new Date(currentDate);
              const diff = i - currentDate.getDay();
              dayDate.setDate(currentDate.getDate() + diff);
              const isActive = dayDate.toDateString() === currentDate.toDateString();
              const isNow    = dayDate.toDateString() === new Date().toDateString();
              return (
                <button key={i}
                  onClick={() => { const nd = new Date(); nd.setDate(new Date().getDate() + (i - new Date().getDay())); setCurrentDate(nd); }}
                  className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90 min-w-[36px]
                    ${isActive ? 'text-white shadow-md' : isNow ? 'text-stone-700 bg-stone-100' : 'text-stone-400 hover:bg-stone-50'}`}
                  style={isActive ? { background: 'linear-gradient(135deg,#f97316,#ea580c)' } : {}}>
                  <span>{d}</span>
                  <span className="text-[9px] mt-0.5 opacity-70">{dayDate.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Nutrition Panel ── */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 flex items-center gap-2 border-b border-stone-100">
            <Flame size={16} strokeWidth={2.5} style={{ color: '#f97316' }} />
            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Daily Nutrition</p>
          </div>

          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {macros.map(({ icon: Icon, label, value, goal, pct, color }) => (
              <div key={label} className="relative overflow-hidden rounded-2xl border border-stone-100 bg-stone-50 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={13} className="text-stone-400" strokeWidth={2.5} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{label}</p>
                </div>
                <p className="text-2xl font-black text-stone-900 tracking-tight leading-none">
                  {value}
                  {goal && <span className="text-xs font-medium text-stone-400 ml-1">{goal}</span>}
                </p>
                {pct !== null && (
                  <div className="mt-3 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                      style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Menu Header ── */}
        <div className="flex items-center justify-between px-1 pt-2">
          <h2 className="text-xl font-black text-stone-900 tracking-tight">Today's Menu</h2>
          {totalItemsCount > 0 && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border"
              style={{ color: '#0d9488', background: '#f0fdfa', borderColor: '#99f6e4' }}>
              {totalItemsCount} selected
            </span>
          )}
        </div>

        {/* ── Menu Board ── */}
        <DailyMenuBoard
          menu={menu}
          selections={currentDaySelections}
          onToggleItem={handleToggleItem}
          onUpdateQuantity={handleUpdateQuantity}
        />

      </main>

      {/* ── Confirm FAB ── */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-24 inset-x-0 flex justify-center px-4 pointer-events-none z-40">
          <button
            className="pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full text-white font-black text-sm shadow-2xl active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg,#f97316,#dc2626)', boxShadow: '0 8px 32px rgba(249,115,22,0.4)' }}>
            <Check size={18} strokeWidth={3} />
            Confirm {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
          </button>
        </div>
      )}
    </div>
  );
}
