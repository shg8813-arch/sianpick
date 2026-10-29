'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Layers,
  Lock,
  Mail,
  Shield,
  HelpCircle,
  X,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { authService } from '@/lib/auth/auth-service';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

function StudioLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Find Account & Reset Password Modal State
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [findEmail, setFindEmail] = useState('');
  const [foundAccount, setFoundAccount] = useState<{
    email: string;
    name: string;
    studioName: string;
    createdAt: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sign In Handler
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('스튜디오 이메일 아이디를 입력해주세요.');
      return;
    }
    if (!password) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      const user = await authService.login({ email, password });
      toast.success(`${user.studioName || user.name || user.email} 로그인되었습니다.`);
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error(err.message || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Find Account Handler
  const handleFindAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!findEmail.trim()) {
      toast.error('조회할 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      setIsFinding(true);
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'find_account', email: findEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '해당 이메일로 등록된 스튜디오 계정을 찾을 수 없습니다.');
      }

      setFoundAccount(data.account);
      toast.success('등록된 스튜디오 계정이 확인되었습니다. 새 비밀번호를 설정할 수 있습니다.');
    } catch (err: any) {
      toast.error(err.message);
      setFoundAccount(null);
    } finally {
      setIsFinding(false);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      toast.error('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      setIsResetting(true);
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: foundAccount?.email || findEmail.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '비밀번호 재설정에 실패했습니다.');
      }

      toast.success('비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해주세요.');
      setEmail(foundAccount?.email || findEmail.trim());
      setPassword(newPassword);
      setIsFindModalOpen(false);
      setFoundAccount(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FBFBFA] px-4 py-12 sm:px-6 lg:px-8">
      {/* Brand Logo & Back to Home */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-zinc-900">시안픽</span>
        </Link>
        <p className="text-xs text-zinc-400 tracking-wider uppercase">
          STUDIO DESIGN PRESENTATION PLATFORM
        </p>
      </div>

      {/* Main Studio Login Card */}
      <div className="w-full max-w-md bg-white shadow-[0_6px_30px_rgba(0,0,0,0.05)] border border-zinc-200/80 overflow-hidden">
        <div className="p-8 space-y-6">
          <div>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
              STUDIO SIGN IN
            </span>
            <h1 className="text-xl font-bold text-zinc-900 mt-0.5">스튜디오 로그인</h1>
            <p className="text-xs text-zinc-500 mt-1">
              등록된 스튜디오 계정의 이메일과 비밀번호를 입력해주세요.
            </p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                스튜디오 이메일 (아이디)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="studio@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-900">
                  비밀번호
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFindEmail(email);
                    setFoundAccount(null);
                    setIsFindModalOpen(true);
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
                >
                  아이디 / 비밀번호 찾기
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-sm transition-all"
            >
              {isLoading ? '로그인 확인 중...' : '스튜디오 로그인'}
            </button>
          </form>

          {/* Bottom Divider & Platform Admin Link */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
            <span>시안픽 플랫폼 서비스</span>
            <Link
              href="/admin/login"
              className="hover:text-zinc-800 transition-colors flex items-center gap-1 font-medium"
            >
              <Shield className="w-3 h-3 text-zinc-400" />
              <span>사이트 전체 관리자</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Find ID & Password Modal */}
      {isFindModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-zinc-800" />
                <h3 className="text-sm font-bold text-zinc-900">
                  스튜디오 계정 및 비밀번호 찾기
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsFindModalOpen(false);
                  setFoundAccount(null);
                }}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!foundAccount ? (
              /* Step 1: Query Account by Email */
              <form onSubmit={handleFindAccount} className="space-y-4">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  스튜디오 등록 시 사용하신 이메일 주소를 입력하시면 계정 등록 여부를 확인하고 비밀번호를 즉시 재설정할 수 있습니다.
                </p>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    등록 이메일 주소
                  </label>
                  <input
                    type="email"
                    required
                    value={findEmail}
                    onChange={(e) => setFindEmail(e.target.value)}
                    placeholder="example@studio.com"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFindModalOpen(false)}
                    className="px-3 py-2 text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isFinding}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {isFinding ? '계정 조회 중...' : '계정 확인'}
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Reset Password for Found Account */
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>확인된 스튜디오 계정 정보</span>
                  </div>
                  <div className="text-zinc-600 space-y-0.5 text-[11px]">
                    <p>스튜디오명: {foundAccount.studioName}</p>
                    <p>담당 디자이너: {foundAccount.name}</p>
                    <p>이메일 아이디: {foundAccount.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    새 비밀번호 (4자 이상)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새로운 비밀번호 입력"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새로운 비밀번호 다시 입력"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setFoundAccount(null)}
                    className="px-3 py-2 text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    다시 조회
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {isResetting ? '재설정 중...' : '비밀번호 재설정 완료'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin" />
        </div>
      }
    >
      <StudioLoginForm />
    </Suspense>
  );
}
