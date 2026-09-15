'use client';

import { useState, useEffect } from 'react';
import { getMenuForDate, getWeekOfMonth } from '../lib/mock-data';
import DailyMenuBoard from '../components/DailyMenuBoard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, UtensilsCrossed, Check, Activity } from 'lucide-react';
import { DailyMenu, Macros } from '../types/menu';
import { useSettings } from '../components/SettingsContext';

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const { settings } = useSettings();
  
  // selections state: DateString -> MealType -> ItemId -> Quantity
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
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
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
      
      return {
        ...prev,
        [dateKey]: {
          ...daySelections,
          [mealType]: newMealSelections
        }
      };
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
      
      return {
        ...prev,
        [dateKey]: {
          ...daySelections,
          [mealType]: newMealSelections
        }
      };
    });
  };

  if (!menu) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentDaySelections = selections[dateKey] || {};
  
  // Calculate Macros
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalItemsCount = 0;

  menu.meals.forEach(meal => {
    const mealSelections = currentDaySelections[meal.type] || {};
    meal.items.forEach(item => {
      const qty = mealSelections[item.id] || 0;
      if (qty > 0) {
        totalItemsCount += qty;
        
        const servingMultiplier = ((item.defaultServingSizeGrams || 100) / 100) * qty;
        
        totalCalories += (item.caloriesPer100g || 0) * servingMultiplier;
        totalProtein += (item.proteinPer100g || 0) * servingMultiplier;
        totalCarbs += (item.carbsPer100g || 0) * servingMultiplier;
        totalFat += (item.fatPer100g || 0) * servingMultiplier;
      }
    });
  });

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-28">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <UtensilsCrossed size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Mess<span className="text-blue-600">Mate</span></h1>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Week {getWeekOfMonth(currentDate)}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        {/* Date Navigator */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-4 flex-1">
            <button 
              onClick={handlePrevDay}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{menu.day}</p>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 justify-center">
                <CalendarIcon size={18} className="text-blue-600" />
                {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h2>
            </div>
            
            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {!isToday && (
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors text-center"
            >
              Back to Today
            </button>
          )}
        </div>

        {/* Nutrition Summary Panel */}
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-md p-5 mb-8 text-white">
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <Activity size={18} />
            <h2 className="font-semibold">Daily Nutrition Summary</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm col-span-2 sm:col-span-1 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Calories</p>
                <p className="text-2xl font-bold">{Math.round(totalCalories)} <span className="text-sm font-medium opacity-75">/ {settings.calorieGoal}</span></p>
              </div>
              <div 
                className="absolute bottom-0 left-0 h-1 bg-green-400 transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(100, (totalCalories / settings.calorieGoal) * 100)}%` }} 
              />
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm col-span-2 sm:col-span-1 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Protein</p>
                <p className="text-2xl font-bold">{Math.round(totalProtein)}g <span className="text-sm font-medium opacity-75">/ {settings.proteinGoal}g</span></p>
              </div>
              <div 
                className="absolute bottom-0 left-0 h-1 bg-green-400 transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(100, (totalProtein / settings.proteinGoal) * 100)}%` }} 
              />
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Carbs</p>
              <p className="text-2xl font-bold">{Math.round(totalCarbs)} <span className="text-sm font-medium opacity-75">g</span></p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Fats</p>
              <p className="text-2xl font-bold">{Math.round(totalFat)} <span className="text-sm font-medium opacity-75">g</span></p>
            </div>
          </div>
        </div>

        {/* Menu Board */}
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-bold text-gray-800">Your Menu</h2>
          <div className="text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            Total qty: <span className="text-blue-600 font-bold">{totalItemsCount}</span>
          </div>
        </div>

        <DailyMenuBoard 
          menu={menu} 
          selections={currentDaySelections}
          onToggleItem={handleToggleItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
        
      </main>

      {/* Floating Action Button */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none z-20">
          <button className="bg-gray-900 text-white font-medium px-8 py-3.5 rounded-full shadow-xl hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95 pointer-events-auto flex items-center gap-2">
            <Check size={18} />
            Confirm {totalItemsCount} Selections
          </button>
        </div>
      )}
    </div>
  );
}
