import json
import random

def generate_id(prefix):
    return f"{prefix}-{random.randint(1000,9999)}"

# Helper to estimate macros based on common Indian foods (approximate per 100g)
MACRO_DB = {
    "rice": {"cal": 130, "p": 2.7, "c": 28, "f": 0.3, "serving": 200},
    "roti": {"cal": 297, "p": 9, "c": 46, "f": 8, "serving": 100},
    "phulka": {"cal": 297, "p": 9, "c": 46, "f": 8, "serving": 100},
    "chapathi": {"cal": 297, "p": 9, "c": 46, "f": 8, "serving": 100},
    "poori": {"cal": 320, "p": 7, "c": 38, "f": 15, "serving": 100},
    "dal": {"cal": 116, "p": 6, "c": 20, "f": 2, "serving": 200},
    "chicken": {"cal": 165, "p": 15, "c": 3, "f": 9, "serving": 200},
    "egg": {"cal": 155, "p": 13, "c": 1.1, "f": 11, "serving": 100}, # 2 eggs approx 100g
    "paneer": {"cal": 265, "p": 14, "c": 3, "f": 22, "serving": 150},
    "biryani": {"cal": 180, "p": 8, "c": 22, "f": 6, "serving": 250},
    "idli": {"cal": 58, "p": 1.6, "c": 12, "f": 0.1, "serving": 200},
    "dosa": {"cal": 168, "p": 3.9, "c": 29, "f": 3.7, "serving": 150},
    "sambar": {"cal": 75, "p": 3, "c": 10, "f": 2, "serving": 200},
    "chutney": {"cal": 120, "p": 2, "c": 4, "f": 11, "serving": 50},
    "milk": {"cal": 42, "p": 3.4, "c": 5, "f": 1, "serving": 250},
    "tea": {"cal": 2, "p": 0, "c": 0.5, "f": 0, "serving": 150},
    "coffee": {"cal": 2, "p": 0, "c": 0.5, "f": 0, "serving": 150},
    "default": {"cal": 150, "p": 5, "c": 20, "f": 5, "serving": 150}
}

def guess_macros(name):
    name_lower = name.lower()
    for key, macros in MACRO_DB.items():
        if key in name_lower:
            return macros
    return MACRO_DB["default"]

def create_item(name, category="Main"):
    name_lower = name.lower()
    is_veg = not any(word in name_lower for word in ["chicken", "egg", "mutton", "fish", "omelette", "bhurji"])
    macros = guess_macros(name)
    
    return {
        "id": generate_id(name.replace(" ", "-").lower()),
        "name": name.strip(),
        "category": category,
        "isVeg": is_veg,
        "caloriesPer100g": macros["cal"],
        "proteinPer100g": macros["p"],
        "carbsPer100g": macros["c"],
        "fatPer100g": macros["f"],
        "defaultServingSizeGrams": macros["serving"]
    }

# Parsed from images
week1_3_data = {
    "Sunday": {
        "Breakfast": ["Poori", "Aloo bhaji", "Semiya upma", "Coconut Chutney", "Egg Bhurji", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal tadka", "White Rice", "Rasam", "Papad", "Onion Raitha", "Chicken Biryani", "Chicken Salan", "Banana", "Lemon Juice"],
        "Snacks": ["Pani Poori", "Tea", "Coffee", "Milk"],
        "Dinner": ["Chapathi", "Chana masala", "Rawa Khicdi", "White Rice", "Sambar", "Rasam", "Cabbage beans Poriyal", "Butter Milk"]
    },
    "Monday": {
        "Breakfast": ["Paav Bhaji", "Uthapam", "Sambar", "Coconut Chutney", "Boiled Egg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Ajawin", "White Rice", "Tomato Rice", "Sambar", "Rasam", "Curd", "Veg. Tawa Fry", "Watermelon"],
        "Snacks": ["Veg Cutlet", "Sauce", "Tea", "Coffee", "Milk"],
        "Dinner": ["Phulka", "Chettinadu Egg Masala", "Uthapam", "Chutney", "Sambar", "Rice", "Rasam", "Ice Cream"]
    },
    "Tuesday": {
        "Breakfast": ["Mixed Veg Paratha", "Curd", "Pickle", "Semiya Khichdi", "Coconut Chutney", "Sambar", "Masala Omelette", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Thadka", "White Rice", "Rasam", "Cabbage Poriyal", "Butter Milk", "Bisibilla Huliyana", "Potato Chips", "Mushroom Peas Masala", "Muskmelon"],
        "Snacks": ["Tea Cake/Pasta", "Coffee", "Milk"],
        "Dinner": ["Phulka", "Veg. Manchurian", "Dal", "Egg Fried Rice", "White rice", "Raddish sambar", "carrot poriyal", "Rasam", "Chocolate milkshake"]
    },
    "Wednesday": {
        "Breakfast": ["Thin Masala Dosa", "Namkin Poha", "Sambar", "Tomato Chutney", "Boiled Egg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "White Rice", "Ghee Rice", "Sambar", "Rasam", "Papad", "Pepper Chicken", "Poriyal", "Banana", "Lemon Juice"],
        "Snacks": ["Veg Puff / Veg Sandwich", "Sauce", "Tea", "Coffee", "Milk"],
        "Dinner": ["Chapathi", "Peas Soya gravy", "Veg Pulao", "Andhra Dhal", "Vazhaikai poriyal", "Rasam", "Vegetable Rava kitchadi", "Coconut Chutney", "Curd"]
    },
    "Thursday": {
        "Breakfast": ["Podi Dosa", "Rawa Khicdi", "Sambar", "Chutney", "Egg Bhurji (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Harar Dal", "White Rice", "Sambar", "Rasam", "Veg. Biryani", "Raitha", "Poriyal", "Paneer Shahi Masala", "Muskmelon"],
        "Snacks": ["Banana Bajji", "Coconut Chutney", "Tea", "Coffee", "Milk"],
        "Dinner": ["Poori", "White channa masala", "Jeera Rice", "White Rice", "Rasam", "Snake Guard Poriyl", "Sambar", "Lassi"]
    },
    "Friday": {
        "Breakfast": ["Paneer Paratha", "Curd", "Kitchadi", "Mint Chutney", "Sambar", "BoiledEgg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Rajasthani", "White Rice", "Veg. Pulao", "Rasam", "Butter Milk", "Papad", "Tandoori chicken", "Plain Gravy", "watermelon", "Lemon Juice"],
        "Snacks": ["Veg Samosa", "Imly Sauce", "Coffee", "Milk"],
        "Dinner": ["Phulka", "Dal makhani", "French Fries", "White Rice", "Idly", "Raddish Sambar", "Carrot Poriyal", "Rasam", "STRAWBERRY /CHOCOLATE MILKSHAKE"]
    },
    "Saturday": {
        "Breakfast": ["Idly", "Sambar", "Kara Chutney", "Semiya Kitchdi", "Masala Omelette", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "White Rice", "Lemon Rice", "Rasam", "Kadi Pakoda", "Papad", "Kara Kozhambu", "Keerai Kootu", "Banana", "Butter Milk"],
        "Snacks": ["Masala Vada", "Chutney", "Tea", "Coffee", "Milk"],
        "Dinner": ["Pulka", "Aloo Capasicum", "Egg Fried Rice", "Millet dosa", "Sambar", "Chutney", "White Rice", "Rasam", "Buttermilk", "Poriyal", "Mysore Pak"]
    }
}

week2_4_data = {
    "Sunday": {
        "Breakfast": ["Gobi Paratha", "Curd", "Pickle", "Pongal", "Vada", "Chutney", "Sambar", "Coconut Chutney", "Omelette", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Harar Dal", "White Rice", "Rasam", "Fryums", "Onion Raitha", "Chicken Biryani", "Chicken Salan", "Banana"],
        "Snacks": ["Dahi Papdi Chat/ Channa Chat", "Tea", "Coffee", "Milk"],
        "Dinner": ["Chapathi", "Arhar dal fry", "Soyabeen Aloo gravy", "Rawa Khicdi", "White Rice", "Chutney", "Rasam", "Poriyal", "Curd"]
    },
    "Monday": {
        "Breakfast": ["Poori", "Aloo Masala", "Semiya Upma", "Chutney", "Masala Omelette", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Fry", "White Rice", "Tomato Rice", "Sambar", "Rasam", "Curd", "Onion Rings", "Mix Veg. Gravy", "Bottle Guard Poriyal", "Papaya"],
        "Snacks": ["Masala Peanuts", "Tea", "Coffee", "Milk"],
        "Dinner": ["Phulka", "Mughalai egg curry", "Uthapam", "Chutney", "Sambar", "Rice", "Rasam", "Ice Cream"]
    },
    "Tuesday": {
        "Breakfast": ["Idly", "Podi and Oil", "Mix Veg. rawa Khicdi", "Sambar", "Chutney", "Boiled Egg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Thadka", "White Rice", "Rasam", "Curd", "Potato Chips", "Bisibilla Bath", "Aloo Green Matar Gravy", "Watermelon"],
        "Snacks": ["Sweetcorn", "Tea", "Coffee", "Milk"],
        "Dinner": ["Phulka", "Veg. Manchurian", "Dal", "Egg Fried Rice", "White rice", "Raddish sambar", "carrot poriyal", "Rasam", "Chocolate milkshake"]
    },
    "Wednesday": {
        "Breakfast": ["Thin Dosa", "Namkin Poha", "Sambar", "Corriander Chutney", "Scrambeled Egg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "White Rice", "Veg. Pulao", "Sambar", "Rasam", "Butter Chicken", "Butter Milk", "Fryums", "Aloo Gobi", "Banana"],
        "Snacks": ["Veg Puffs / Veg Sandwich", "Sauce", "Tea", "Coffee", "Milk"],
        "Dinner": ["Chapathi", "Rajma gravy", "White Rice", "Andhra Dhal", "Vazhaikai poriyal", "Rasam", "Sambar", "Vegetable Rava kitchadi", "Coconut Chutney", "Curd"]
    },
    "Thursday": {
        "Breakfast": ["Paneer Paratha", "Curd", "Pongal", "Vada Sambar", "Coconuut chutney", "Egg Bhurji", "BBJ", "Tea", "Coffee", "Milk", "Pickle"],
        "Lunch": ["Phulka", "Dal Masala", "White Rice", "Veg Biryani", "Sambar", "Rasam", "Raitha", "Onion Rings", "Aloo Jeera", "Mutter Paneer", "Musk Melon"],
        "Snacks": ["Banana bhaji", "Chutney", "Tea", "Coffee", "Milk"],
        "Dinner": ["Puri", "Chole masala", "Jeera Rice", "White Rice", "Rasam", "Poriyl", "Cold Badam Milk"]
    },
    "Friday": {
        "Breakfast": ["Kal Dosa", "Vada", "Sambar", "Onion Chutney", "Boiled Egg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Lasoni", "White Rice", "Ghee Rice", "Rasam", "Wheel Chips", "Chicken 65+", "Plain Gravy/Chicken Tikka Masala", "Poriyal", "Water Melon", "Lemon Juice"],
        "Snacks": ["Tea Cake/ Pasta", "Tea", "Coffee", "Milk"],
        "Dinner": ["Chapathi", "Chana Dal", "Kadi Pakoda", "White Rice", "Rasam", "Mix Veg Poriyal", "Idly", "Podi", "Oil", "Mint chutney", "Sambar", "Parupu payasam"]
    },
    "Saturday": {
        "Breakfast": ["Aloo Paratha", "Curd", "Pickle", "Vegetable Uppuma", "Chutney", "Boiled Egg (2 Nos)", "BBJ", "Tea", "Coffee", "Milk"],
        "Lunch": ["Phulka", "Dal Maharani", "White Rice", "Pudina Rice", "Rasam", "Karakozembu", "Dahi vada", "Mix veg Poriyal", "Fryums", "Papaya"],
        "Snacks": ["Onion Samosa", "Tea", "Coffee", "Milk"],
        "Dinner": ["Pulka", "Gobi Chilli", "Millet Idli", "Sambar", "Chutney", "Egg Fried Rice", "White Rice", "Rasam", "pooriyal", "Bread halwa"]
    }
}

days_order = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

def generate_schedule(week_type, data):
    days_arr = []
    for day in days_order:
        meals = []
        for meal_type, items in data[day].items():
            meal_items = []
            for item_name in items:
                # Basic categorization based on keywords
                category = "Sides"
                name_l = item_name.lower()
                if "rice" in name_l or "biryani" in name_l or "pulao" in name_l or "bath" in name_l or "khicdi" in name_l or "pongal" in name_l:
                    category = "Rice"
                elif "phulka" in name_l or "roti" in name_l or "chapathi" in name_l or "poori" in name_l or "paratha" in name_l or "dosa" in name_l or "idly" in name_l or "idli" in name_l:
                    category = "Breads"
                elif "dal" in name_l or "dhal" in name_l or "sambar" in name_l or "rasam" in name_l or "kadi" in name_l:
                    category = "Dal"
                elif "chicken" in name_l or "paneer" in name_l or "egg" in name_l or "masala" in name_l or "gravy" in name_l or "curry" in name_l or "bhaji" in name_l or "channa" in name_l or "rajma" in name_l:
                    category = "Main"
                elif "milk" in name_l or "tea" in name_l or "coffee" in name_l or "juice" in name_l:
                    category = "Drinks"
                elif "ice cream" in name_l or "halwa" in name_l or "payasam" in name_l or "pak" in name_l:
                    category = "Dessert"
                
                meal_items.append(create_item(item_name, category))
            
            meals.append({
                "type": meal_type,
                "items": meal_items
            })
        
        days_arr.append({
            "day": day,
            "meals": meals
        })
    return {
        "weekType": week_type,
        "days": days_arr
    }

w1 = generate_schedule("Week1_3", week1_3_data)
w2 = generate_schedule("Week2_4", week2_4_data)

ts_content = f"""import {{ DailyMenu, DayOfWeek, MenuItem, WeeklySchedule, MealMenu }} from '../types/menu';

export const week1_3_Schedule: WeeklySchedule = {json.dumps(w1, indent=2)};

export const week2_4_Schedule: WeeklySchedule = {json.dumps(w2, indent=2)};

export const getWeekOfMonth = (date: Date): number => {{
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + (firstDay === 0 ? 7 : firstDay) - 1) / 7);
}};

export const getMenuForDate = (date: Date): DailyMenu => {{
  const weekNum = getWeekOfMonth(date);
  const dayIndex = date.getDay(); 
  
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[dayIndex];

  const isWeek1_3 = weekNum === 1 || weekNum === 3;
  const schedule = isWeek1_3 ? week1_3_Schedule : week2_4_Schedule;

  const baseMenu = schedule.days.find(d => d.day === dayName) || schedule.days[0];

  // Dynamically add "Purchased Egg" to all meals except Snacks
  const mealsWithEgg: MealMenu[] = baseMenu.meals.map(meal => {{
    if (meal.type !== 'Snacks') {{
      return {{
        ...meal,
        items: [
          ...meal.items,
          {{
            id: `addon-egg-buy-${{meal.type.toLowerCase()}}`, 
            name: 'Extra Boiled Egg (Buy)',
            category: 'Extras',
            isVeg: false,
            caloriesPer100g: 155,
            proteinPer100g: 13,
            carbsPer100g: 1.1,
            fatPer100g: 11,
            defaultServingSizeGrams: 50,
            allowMultiple: true,
          }}
        ]
      }};
    }}
    return meal;
  }});

  return {{
    ...baseMenu,
    meals: mealsWithEgg
  }};
}};
"""

with open("c:/surya/mess_food/lib/mock-data.ts", "w") as f:
    f.write(ts_content)

print("Successfully wrote mock-data.ts")
