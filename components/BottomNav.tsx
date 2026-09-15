'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Utensils, SlidersHorizontal } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/',         label: 'Menu',     Icon: Utensils          },
    { href: '/settings', label: 'Settings', Icon: SlidersHorizontal },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-stone-200/70"
      style={{ background: 'rgba(253,248,243,0.92)', backdropFilter: 'blur(14px)' }}
      aria-label="Bottom Navigation">
      <div className="max-w-2xl mx-auto flex safe-area-pb">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 py-3 gap-0.5 transition-all active:scale-90
                ${active ? 'text-orange-500' : 'text-stone-400 hover:text-stone-700'}`}>
              {/* indicator dot */}
              {active && (
                <span className="absolute bottom-[52px] w-1 h-1 rounded-full" style={{ background: '#f97316' }} />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] uppercase tracking-widest font-black ${active ? 'text-orange-500' : 'text-stone-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
