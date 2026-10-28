'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Sparkles, LayoutDashboard, Share2, RotateCcw } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getProjectRepository } from '@/lib/repositories';
import { toast } from 'sonner';

export function Navbar() {
  const pathname = usePathname();
  const isClientView = pathname.startsWith('/share');

  const handleResetDemo = async () => {
    if (confirm('데모 데이터를 런오브더밀 3개 시안 기본 상태로 리셋하시겠습니까?')) {
      const repo = getProjectRepository();
      await repo.resetDemoData();
      toast.success('데모 데이터가 런오브더밀 3개 시안 구성으로 복원되었습니다.');
      window.location.reload();
    }
  };

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

          {/* Mode Indicator badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-zinc-50 text-zinc-600 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <Sparkles className="w-3 h-3 text-zinc-500" />
            <span>{isSupabaseConfigured ? 'Supabase 연동' : '데모 모드'}</span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2.5">
          {!isClientView && (
            <button
              onClick={handleResetDemo}
              title="초기 샘플 데이터로 리셋"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 px-2.5 py-1.5 hover:bg-zinc-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              데모 리셋
            </button>
          )}

          <Link
            href="/share/runofthemill-sample-2026"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-1.5 bg-white hover:bg-zinc-50 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            고객 화면 체험
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            관리자 대시보드
          </Link>
        </div>
      </div>
    </header>
  );
}
