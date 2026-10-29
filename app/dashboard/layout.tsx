'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth/auth-service';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      toast.error('관리자 로그인이 필요한 페이지입니다.');
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
      router.replace(redirectUrl);
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
        <div className="text-center space-y-3 p-8 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)] border border-zinc-100">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            관리자 권한 확인 중...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
