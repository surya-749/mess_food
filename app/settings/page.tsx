'use client';

import { useSettings } from '../../components/SettingsContext';
import { SlidersHorizontal, Flame, Dumbbell, Leaf, Save, Check, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: '#fdf8f3' }}>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-orange-100/60"
        style={{ background: 'rgba(253,248,243,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg,#f97316,#dc2626)' }}>
            <SlidersHorizontal size={18} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-stone-900">Settings</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8 space-y-6">

        {/* ── Profile ── */}
        <section className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-stone-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-base shadow-inner"
              style={{ background: 'linear-gradient(135deg,#f97316,#dc2626)' }}>
              {/* initials placeholder */}
              JD
            </div>
            <div>
              <p className="font-black text-stone-900">My Profile</p>
              <p className="text-xs text-stone-400 font-medium">VIT Men's Hostel, Chennai</p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            {[
              { id: 'name',   label: 'Name',          placeholder: 'John Doe'         },
              { id: 'hostel', label: 'Hostel & Room',  placeholder: 'Block A, Room 302'},
            ].map(({ id, label, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">{label}</label>
                <input
                  id={id}
                  type="text"
                  defaultValue={placeholder}
                  className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 bg-stone-50 hover:bg-white focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-semibold text-stone-800 text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Nutrition Goals ── */}
        <section className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-100">
            <p className="font-black text-stone-900">Nutrition Goals</p>
            <p className="text-xs text-stone-400 font-medium mt-0.5">Set your daily targets</p>
          </div>
          <div className="p-6 space-y-5">
            {[
              { id: 'cal',  label: 'Calories',  unit: 'kcal', Icon: Flame,    color: 'text-orange-500', val: local.calorieGoal, key: 'calorieGoal' as const },
              { id: 'prot', label: 'Protein',   unit: 'g',    Icon: Dumbbell, color: 'text-teal-600',   val: local.proteinGoal, key: 'proteinGoal' as const },
            ].map(({ id, label, unit, Icon, color, val, key }) => (
              <div key={id}>
                <label htmlFor={id} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 mb-2">
                  <Icon size={14} className={color} strokeWidth={2.5} />
                  {label} ({unit})
                </label>
                <div className="relative">
                  <input
                    id={id}
                    type="number"
                    value={val}
                    onChange={e => setLocal({ ...local, [key]: Number(e.target.value) })}
                    className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3.5 pr-16 bg-stone-50 hover:bg-white focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all font-black text-stone-900 text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Dietary Preferences ── */}
        <section className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-100">
            <p className="font-black text-stone-900">Dietary Preferences</p>
            <p className="text-xs text-stone-400 font-medium mt-0.5">Manage what you see</p>
          </div>
          <div className="p-4">
            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all
              ${local.vegOnly ? 'border-green-400 bg-green-50' : 'border-stone-100 hover:border-stone-200 bg-stone-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                  ${local.vegOnly ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
                  <Leaf size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-stone-900 text-sm">Vegetarian Only</p>
                  <p className="text-[11px] text-stone-400 font-medium">Hides non-veg items from menus</p>
                </div>
              </div>
              {/* Toggle */}
              <div className="relative flex-none ml-4">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={local.vegOnly}
                  onChange={e => setLocal({ ...local, vegOnly: e.target.checked })}
                  aria-label="Toggle Vegetarian Only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors duration-300 shadow-inner
                  ${local.vegOnly ? 'bg-green-500' : 'bg-stone-200'}`} />
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300
                  ${local.vegOnly ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>
        </section>

        {/* ── About ── */}
        <section className="bg-white rounded-3xl border border-stone-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
              style={{ background: 'linear-gradient(135deg,#f97316,#dc2626)' }}>
              <UtensilsCrossed size={18} strokeWidth={2.5} className="text-white" />
            </div>
            <div>
              <p className="font-black text-stone-900 text-sm">MessMate</p>
              <p className="text-[11px] text-stone-400 font-medium">VIT Chennai · Sep 2026</p>
            </div>
          </div>
        </section>

        {/* ── Save ── */}
        <button
          onClick={handleSave}
          aria-live="polite"
          className={`w-full py-4 rounded-3xl font-black text-white text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5
            ${saved ? 'bg-green-500 shadow-green-400/30' : 'shadow-orange-400/30 hover:opacity-90'}`}
          style={!saved ? { background: 'linear-gradient(135deg,#f97316,#dc2626)' } : {}}>
          {saved ? <><Check size={18} strokeWidth={3} /> Saved!</> : <><Save size={18} strokeWidth={2.5} /> Save Settings</>}
        </button>

        <div className="h-4" />
      </main>
    </div>
  );
}
