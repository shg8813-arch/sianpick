'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { authService } from '@/lib/auth/auth-service';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  // Demo Login
  const handleDemoLogin = () => {
    authService.loginAsDemo();
    toast.success('데모 스튜디오 아틀리에 계정으로 로그인되었습니다.');
    router.push('/dashboard');
  };

  // Sign In
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
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
      toast.success(`${user.name || user.email} 디자이너님, 환영합니다.`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('이메일을 입력해주세요.');
      return;
    }
    if (!name.trim()) {
      toast.error('디자이너 이름을 입력해주세요.');
      return;
    }
    if (!password || password.length < 4) {
      toast.error('비밀번호는 최소 4자 이상 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              studioName,
            },
          },
        });
        if (error) throw error;
      }

      const newUser = await authService.register({
        email,
        password,
        name,
        studioName,
      });

      toast.success(`${newUser.studioName || newUser.name} 스튜디오 계정이 생성되었습니다.`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white shadow-[0_6px_30px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden">
        {/* Tab Switcher (그레이 배경 활성화 스타일 준수) */}
        <div className="grid grid-cols-2 border-b border-zinc-100 bg-zinc-50">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'login'
                ? 'bg-zinc-200 text-zinc-900 border-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 border-transparent'
            }`}
          >
            디자이너 로그인
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-3.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'register'
                ? 'bg-zinc-200 text-zinc-900 border-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 border-transparent'
            }`}
          >
            무료 계정 생성 (예비 고객)
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'login' ? (
            /* Login Form */
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                  SIGN IN
                </span>
                <h2 className="text-xl font-bold text-zinc-900 mt-0.5">스튜디오 로그인</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  생성하신 디자이너 계정으로 로그인하여 프로젝트를 관리하세요.
                </p>
              </div>

              {/* Quick Demo Access */}
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>체험용 샘플 계정으로 즉시 둘러보기</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-200 text-zinc-700 font-mono font-medium">
                    DEMO
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  가입 없이 준비된 샘플 시안 프로젝트와 관리자 대시보드를 바로 확인하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>체험용 대시보드로 즉시 시작</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-100" />
                <span className="flex-shrink mx-3 text-[11px] text-zinc-400 font-mono">또는 이메일 로그인</span>
                <div className="flex-grow border-t border-zinc-100" />
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="designer@studio.kr"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    비밀번호
                  </label>
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
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-sm transition-all"
                >
                  {isLoading ? '로그인 중...' : '디자이너 로그인'}
                </button>
              </form>
            </div>
          ) : (
            /* Register Form */
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                  FREE REGISTRATION
                </span>
                <h2 className="text-xl font-bold text-zinc-900 mt-0.5">예비 고객 디자이너 등록</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  나만의 스튜디오 워크스페이스를 생성하고 시안을 고객에게 전달해보세요.
                </p>
              </div>

              {/* Free Benefits Notice */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>예비 고객 무료 혜택</span>
                </div>
                <div className="text-[11px] text-zinc-500 leading-relaxed">
                  - 개별 독립 워크스페이스 및 프로젝트 무제한 생성
                  <br />
                  - 스튜디오 공식 로고 커스텀 및 견적서 연동
                  <br />
                  - 고객 전용 보안 공유 링크 및 핀포인트 피드백 수렴
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    디자이너 성함 / 닉네임 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="예: 김디자이너"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    스튜디오 / 업체 상호명 (선택)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="예: 스튜디오 아틀리에 (미입력시 성함으로 자동생성)"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    이메일 주소 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="designer@studio.kr"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-900 mb-1.5">
                    비밀번호 설정 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="최소 4자 이상 입력"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>{isLoading ? '계정 생성 중...' : '무료 디자이너 계정 생성 및 시작'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center text-xs text-zinc-400 flex items-center justify-between">
          <Link href="/" className="hover:text-zinc-700 transition-colors">
            홈으로 돌아가기
          </Link>
          <a
            href="mailto:sianpick.team@gmail.com"
            className="hover:text-zinc-700 transition-colors"
          >
            고객센터 문의
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
