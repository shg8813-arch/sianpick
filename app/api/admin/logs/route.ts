import { NextResponse } from 'next/server';
import { getServerErrorLogs, getServerProjects, getServerUsers } from '@/lib/server/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [logs, projects, users] = await Promise.all([
      getServerErrorLogs(),
      getServerProjects(),
      getServerUsers(),
    ]);

    const stats = {
      totalStudios: users.filter((u) => u.role !== 'admin').length,
      totalProjects: projects.length,
      activeShareLinks: projects.filter((p) => p.shareToken).length,
      errorCount: logs.filter((l) => l.severity === 'error' || l.severity === 'warning').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
