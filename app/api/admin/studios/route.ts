import { NextRequest, NextResponse } from 'next/server';
import { getServerUsers, saveServerUsers, getServerProjects, logServerError } from '@/lib/server/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [users, projects] = await Promise.all([
      getServerUsers(),
      getServerProjects(),
    ]);

    // Compute project counts for each studio
    const studioList = users.map((u) => {
      const userProjects = projects.filter(
        (p) =>
          p.ownerId === u.id ||
          (p.companyName && u.studioName && p.companyName.toLowerCase().includes(u.studioName.toLowerCase())) ||
          (u.email && u.email.includes('knit') && p.shareToken === 'share-2vsh74rp')
      );

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        studioName: u.studioName || `${u.name} 스튜디오`,
        role: u.role,
        status: u.status || 'active',
        createdAt: u.createdAt,
        projectCount: userProjects.length,
      };
    });

    return NextResponse.json({ success: true, studios: studioList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, role, studioName, name } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: '스튜디오 ID가 필요합니다.' }, { status: 400 });
    }

    const users = await getServerUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: '해당 스튜디오 계정을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (status) users[idx].status = status;
    if (role) users[idx].role = role;
    if (studioName) users[idx].studioName = studioName;
    if (name) users[idx].name = name;

    await saveServerUsers(users);

    await logServerError({
      type: 'system',
      severity: 'info',
      message: `관리자 계정 수정: ${users[idx].email} (상태: ${users[idx].status})`,
      source: '/api/admin/studios',
    });

    return NextResponse.json({ success: true, studio: users[idx] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: '삭제할 스튜디오 ID가 필요합니다.' }, { status: 400 });
    }

    const users = await getServerUsers();
    const target = users.find((u) => u.id === id);
    if (target?.role === 'admin') {
      return NextResponse.json({ success: false, error: '최고 관리자 계정은 삭제할 수 없습니다.' }, { status: 403 });
    }

    const filtered = users.filter((u) => u.id !== id);
    await saveServerUsers(filtered);

    await logServerError({
      type: 'system',
      severity: 'warning',
      message: `스튜디오 계정 영구 삭제: ${target?.email || id}`,
      source: '/api/admin/studios',
    });

    return NextResponse.json({ success: true, message: '스튜디오 계정이 삭제되었습니다.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
