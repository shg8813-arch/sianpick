import { NextRequest, NextResponse } from 'next/server';
import { getServerUsers, saveServerUsers, logServerError } from '@/lib/server/storage';
import { StoredUserAccount } from '@/lib/auth/auth-service';
import { UserProfile } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await getServerUsers();
    // Return safe user accounts without exposing plain passwords
    const safeUsers: UserProfile[] = users.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const users = await getServerUsers();

    if (action === 'login') {
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      const user = users.find((u) => u && u.email && u.email.toLowerCase() === email);
      if (!user) {
        await logServerError({
          type: 'auth',
          severity: 'warning',
          message: `로그인 실패: 등록되지 않은 이메일 (${email})`,
          source: '/api/auth',
        });
        return NextResponse.json(
          { success: false, error: '등록되지 않은 이메일 주소입니다.' },
          { status: 401 }
        );
      }

      if (user.status === 'suspended') {
        return NextResponse.json(
          { success: false, error: '관리자에 의해 일시 정지된 계정입니다. 관리자에게 문의하세요.' },
          { status: 403 }
        );
      }

      if (user.passwordHash && user.passwordHash !== password) {
        await logServerError({
          type: 'auth',
          severity: 'warning',
          message: `로그인 실패: 비밀번호 불일치 (${email})`,
          source: '/api/auth',
        });
        return NextResponse.json(
          { success: false, error: '비밀번호가 일치하지 않습니다.' },
          { status: 401 }
        );
      }

      const { passwordHash, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });
    }

    // 아이디 / 비밀번호 찾기 (이메일 조회)
    if (action === 'find_account') {
      const email = (body.email || '').trim().toLowerCase();
      if (!email) {
        return NextResponse.json({ success: false, error: '이메일을 입력해주세요.' }, { status: 400 });
      }

      const user = users.find((u) => u && u.email && u.email.toLowerCase() === email);
      if (!user) {
        return NextResponse.json(
          { success: false, error: '해당 이메일로 등록된 스튜디오 계정을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        account: {
          email: user.email,
          name: user.name,
          studioName: user.studioName,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // 비밀번호 재설정
    if (action === 'reset_password') {
      const email = (body.email || '').trim().toLowerCase();
      const newPassword = body.newPassword || '';

      if (!email || !newPassword || newPassword.length < 4) {
        return NextResponse.json(
          { success: false, error: '유효한 이메일과 4자 이상의 새 비밀번호를 입력해주세요.' },
          { status: 400 }
        );
      }

      const userIndex = users.findIndex((u) => u && u.email && u.email.toLowerCase() === email);
      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, error: '해당 이메일의 계정을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      users[userIndex].passwordHash = newPassword;
      await saveServerUsers(users);

      await logServerError({
        type: 'auth',
        severity: 'info',
        message: `비밀번호 재설정 완료: ${email}`,
        source: '/api/auth',
      });

      return NextResponse.json({
        success: true,
        message: '비밀번호가 성공적으로 재설정되었습니다. 새 비밀번호로 로그인해주세요.',
      });
    }

    if (action === 'register') {
      const email = (body.email || '').trim().toLowerCase();
      const name = (body.name || '').trim();
      const studioName = (body.studioName || `${name} 디자인 스튜디오`).trim();
      const password = body.password || '';

      if (!email) {
        return NextResponse.json({ success: false, error: '이메일을 입력해주세요.' }, { status: 400 });
      }
      if (!name) {
        return NextResponse.json({ success: false, error: '이름을 입력해주세요.' }, { status: 400 });
      }

      const exists = users.find((u) => u && u.email && u.email.toLowerCase() === email);
      if (exists) {
        return NextResponse.json(
          { success: false, error: '이미 등록된 이메일 주소입니다. 로그인해주세요.' },
          { status: 409 }
        );
      }

      const newUser: StoredUserAccount = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email,
        name,
        studioName,
        role: 'designer',
        status: 'active',
        createdAt: new Date().toISOString(),
        passwordHash: password,
      };

      users.push(newUser);
      await saveServerUsers(users);

      const { passwordHash, ...safeUser } = newUser;
      return NextResponse.json({ success: true, user: safeUser });
    }

    if (action === 'sync') {
      const localUsers: StoredUserAccount[] = body.users || [];
      let updated = false;

      for (const lu of localUsers) {
        if (lu && lu.email && !users.some((u) => u && u.email && u.email.toLowerCase() === lu.email.toLowerCase())) {
          users.push(lu);
          updated = true;
        }
      }

      if (updated) {
        await saveServerUsers(users);
      }

      const safeUsers: UserProfile[] = users.map(({ passwordHash, ...rest }) => rest);
      return NextResponse.json({ success: true, users: safeUsers });
    }

    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
