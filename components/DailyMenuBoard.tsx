'use client';

import { DailyMenu } from '../types/menu';
import MealCard from './MealCard';

interface DailyMenuBoardProps {
  menu: DailyMenu;
  selections: Record<string, Record<string, number>>;
  onToggleItem: (mealType: string, itemId: string) => void;
  onUpdateQuantity: (mealType: string, itemId: string, delta: number) => void;
}

export default function DailyMenuBoard({ menu, selections, onToggleItem, onUpdateQuantity }: DailyMenuBoardProps) {
  return (
    <div className="space-y-6">
      {menu.meals.map((meal) => (
        <MealCard
          key={meal.type}
          meal={meal}
          selections={selections[meal.type] || {}}
          onToggleItem={(itemId) => onToggleItem(meal.type, itemId)}
          onUpdateQuantity={(itemId, delta) => onUpdateQuantity(meal.type, itemId, delta)}
        />
      ))}
      
      {menu.meals.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500">No menu available for this day.</p>
        </div>
      )}
    </div>
  );
}
