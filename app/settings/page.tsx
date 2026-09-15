'use client';

import { useSettings } from '../../components/SettingsContext';
import { Settings as SettingsIcon, Save, Leaf, Flame, Dumbbell } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-28">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <SettingsIcon size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">JD</span>
            My Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                defaultValue="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel & Room</label>
              <input 
                type="text" 
                defaultValue="Block A, Room 302"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Nutrition Goals */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Nutrition Goals</h2>
          
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Flame size={16} className="text-orange-500" /> Daily Calories Goal (kcal)
              </label>
              <input 
                type="number" 
                value={localSettings.calorieGoal}
                onChange={(e) => setLocalSettings({...localSettings, calorieGoal: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Dumbbell size={16} className="text-blue-500" /> Daily Protein Goal (g)
              </label>
              <input 
                type="number" 
                value={localSettings.proteinGoal}
                onChange={(e) => setLocalSettings({...localSettings, proteinGoal: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Dietary Preferences</h2>
          
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <Leaf size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Vegetarian Only</p>
                <p className="text-xs text-gray-500">Hide all non-veg items from the menu</p>
              </div>
            </div>
            <div className="relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={localSettings.vegOnly}
                onChange={(e) => setLocalSettings({...localSettings, vegOnly: e.target.checked})}
              />
              <div className={`w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.vegOnly ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          {showSaved ? (
            <>Saved Successfully!</>
          ) : (
            <>
              <Save size={18} /> Save Settings
            </>
          )}
        </button>
        
      </main>
    </div>
  );
}
