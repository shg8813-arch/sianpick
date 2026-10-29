'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@sianpick.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('관리자 이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '관리자 인증에 실패했습니다.');
      }

      localStorage.setItem('sianpick_admin_session', JSON.stringify(data.admin));
      toast.success('플랫폼 최고 관리자로 인증되었습니다.');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || '관리자 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="w-full max-w-md">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>스튜디오 일반 로그인 화면으로 돌아가기</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 shadow-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
            <div className="w-10 h-10 bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">플랫폼 최고 관리자 인증</h1>
              <p className="text-xs text-zinc-400">시스템 모니터링 및 전체 스튜디오 계정 관리 전용</p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                관리자 아이디 (이메일)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sianpick.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                관리자 마스터 비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="관리자 비밀번호를 입력하세요"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                기본 최고 관리자 비밀번호: admin1234
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{isLoading ? '인증 확인 중...' : '관리자 보안 로그인'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
