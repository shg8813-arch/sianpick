'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, LayoutDashboard, MessageSquare, LogIn, LogOut, User, Sparkles } from 'lucide-react';
import { authService } from '@/lib/auth/auth-service';
import { UserProfile } from '@/types';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { toast } from 'sonner';

export function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.success('로그아웃되었습니다.');
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.03)] border-b border-zinc-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:bg-zinc-800 transition-colors">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-zinc-900 flex items-center gap-2">
                  시안픽
                  <span className="font-mono text-[10px] font-medium tracking-wider px-1.5 py-0.2 bg-zinc-100 text-zinc-600">
                    STUDIO
                  </span>
                </span>
              </div>
            </Link>

            {/* Anchor Links for Main Page */}
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-zinc-500">
              <Link href="/#workflow" className="hover:text-zinc-900 transition-colors">
                진행 프로세스
              </Link>
              <Link href="/#features" className="hover:text-zinc-900 transition-colors">
                핵심 기능
              </Link>
              <Link href="/#faq" className="hover:text-zinc-900 transition-colors">
                자주 묻는 질문
              </Link>
            </nav>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Feedback Button */}
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition-all rounded-sm"
              title="사이트 사용 의견 및 피드백 보내기"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">의견 보내기</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-800 text-[11px] font-medium rounded-sm">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span className="font-bold">{currentUser.studioName || currentUser.name}</span>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 px-3.5 py-2 shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>대시보드</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-500" />
                  <span>로그인</span>
                </Link>

                <Link
                  href="/login?tab=register"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 px-3.5 py-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                  <span>무료 시작</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Feedback Modal */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
