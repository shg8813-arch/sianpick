import { NextRequest, NextResponse } from 'next/server';
import { getServerUsers, logServerError } from '@/lib/server/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    const users = await getServerUsers();
    const adminUser = users.find(
      (u) =>
        (u.role === 'admin' || u.email === 'admin@sianpick.com') &&
        u.email.toLowerCase() === email
    );

    if (!adminUser) {
      await logServerError({
        type: 'auth',
        severity: 'warning',
        message: `관리자 로그인 접근 차단: 비인가 이메일 (${email})`,
        source: '/api/admin/auth',
      });
      return NextResponse.json(
        { success: false, error: '최고 관리자 권한을 가진 계정이 아닙니다.' },
        { status: 403 }
      );
    }

    if (adminUser.passwordHash && adminUser.passwordHash !== password) {
      await logServerError({
        type: 'auth',
        severity: 'warning',
        message: `관리자 로그인 비밀번호 오류 (${email})`,
        source: '/api/admin/auth',
      });
      return NextResponse.json(
        { success: false, error: '관리자 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    await logServerError({
      type: 'auth',
      severity: 'info',
      message: `플랫폼 총괄 관리자 로그인 성공 (${email})`,
      source: '/api/admin/auth',
    });

    const { passwordHash, ...safeAdmin } = adminUser;
    return NextResponse.json({ success: true, admin: safeAdmin });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
