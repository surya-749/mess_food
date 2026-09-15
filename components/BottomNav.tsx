'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Utensils, Settings as SettingsIcon } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="max-w-3xl mx-auto flex justify-around">
        <Link 
          href="/" 
          className={`flex flex-col items-center py-3 px-6 w-full ${pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Utensils size={24} className="mb-1" />
          <span className="text-xs font-medium">Menu</span>
        </Link>
        
        <Link 
          href="/settings" 
          className={`flex flex-col items-center py-3 px-6 w-full ${pathname === '/settings' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <SettingsIcon size={24} className="mb-1" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
}
