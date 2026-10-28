'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, Sparkles, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = () => {
    toast.success('디자이너 계정으로 로그인되었습니다.');
    router.push('/dashboard');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    if (!isSupabaseConfigured) {
      toast.success(`${email} 계정으로 로그인되었습니다.`);
      router.push('/dashboard');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('로그인에 성공했습니다.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FBFBFA] px-4 sm:px-6 lg:px-8">
      {/* Brand logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-zinc-900">시안픽</span>
        </Link>
        <p className="text-xs text-zinc-400 tracking-wider uppercase">
          STUDIO DESIGN PRESENTATION
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow-[0_6px_30px_rgba(0,0,0,0.05)]">
        <div className="mb-6">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
            AUTHENTICATION
          </span>
          <h2 className="text-xl font-bold text-zinc-900 mt-0.5">디자이너 로그인</h2>
          <p className="text-xs text-zinc-500 mt-1">
            프로젝트 관리 및 시안 등록을 위해 로그인하세요.
          </p>
        </div>

        {/* Quick Access Banner */}
        <div className="mb-6 p-4 bg-zinc-50 space-y-3 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
            <Sparkles className="w-4 h-4 text-zinc-700" />
            <span>스튜디오 관리자 즉시 시작</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            별도의 회원가입 없이 브라우저 저장소를 통해 즉시 프로젝트 관리 및 시안 등록을 시작할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>대시보드로 즉시 시작하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Traditional Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-xs font-bold text-zinc-900 mb-1.5">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="designer@studio.kr"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-950 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-zinc-900 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-950 focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-white hover:bg-zinc-100 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider border-2 border-zinc-950 shadow-[3px_3px_0px_0px_#18181B] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '이메일로 로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="font-mono text-xs font-bold text-zinc-500 hover:text-black">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
