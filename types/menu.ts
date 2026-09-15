export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export type DayOfWeek = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category?: string; 
  isVeg: boolean;
  // Nutrition per 100g
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  
  // Serving info
  defaultServingSizeGrams?: number;
  
  // For purchasing extras like "n number of eggs"
  allowMultiple?: boolean;
}

export interface MealMenu {
  type: MealType;
  items: MenuItem[];
}

export interface DailyMenu {
  day: DayOfWeek;
  meals: MealMenu[];
}

export type WeekMenuType = 'Week1_3' | 'Week2_4';

export interface WeeklySchedule {
  weekType: WeekMenuType;
  days: DailyMenu[];
}
