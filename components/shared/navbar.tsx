'use client';

import Link from 'next/link';
import { Layers, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.03)] border-b border-zinc-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:bg-zinc-800 transition-colors">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-zinc-900 flex items-center gap-2">
                시안픽
                <span className="font-mono text-[10px] font-medium tracking-wider px-1.5 py-0.5 bg-zinc-100 text-zinc-600">
                  STUDIO
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            관리자 대시보드
          </Link>
        </div>
      </div>
    </header>
  );
}
