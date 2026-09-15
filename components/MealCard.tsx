'use client';

import { MealMenu, MenuItem } from '../types/menu';
import { Check, Plus, Minus } from 'lucide-react';

interface MealCardProps {
  meal: MealMenu;
  selections: Record<string, number>;
  onToggleItem: (itemId: string, maxQuantity?: number) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export default function MealCard({ meal, selections, onToggleItem, onUpdateQuantity }: MealCardProps) {
  const selectedCount = Object.keys(selections).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{meal.type}</h3>
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
          {selectedCount} items
        </span>
      </div>
      
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {meal.items.map((item) => {
            const quantity = selections[item.id] || 0;
            const isSelected = quantity > 0;
            
            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border transition-all text-left w-full gap-3
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
              >
                {/* Item Info (Clickable for standard items) */}
                <button 
                  className="flex-1 text-left" 
                  onClick={() => !item.allowMultiple && onToggleItem(item.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} title={item.isVeg ? 'Veg' : 'Non-Veg'} />
                    <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 items-center">
                    {item.category && (
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                    {item.caloriesPer100g && (
                      <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-medium">
                        {item.caloriesPer100g} kcal/100g
                      </span>
                    )}
                  </div>
                  {(item.proteinPer100g || item.carbsPer100g) && (
                    <div className="mt-1 text-[10px] text-gray-500 flex gap-2">
                      <span>P: {item.proteinPer100g}g</span>
                      <span>C: {item.carbsPer100g}g</span>
                      <span>F: {item.fatPer100g}g</span>
                    </div>
                  )}
                </button>
                
                {/* Controls */}
                <div className="flex items-center justify-end">
                  {item.allowMultiple ? (
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                        disabled={quantity === 0}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-800">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => onToggleItem(item.id)}
                      className={`flex items-center justify-center w-6 h-6 rounded-full border flex-shrink-0
                        ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-transparent'}`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
