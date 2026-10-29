import { NextRequest, NextResponse } from 'next/server';
import { getServerProjects, saveServerProject } from '@/lib/server/storage';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    const projects = await getServerProjects();
    if (companyId) {
      return NextResponse.json({
        success: true,
        projects: projects.filter((p) => p.companyId === companyId),
      });
    }

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Batch sync from client localStorage
    if (body.action === 'sync') {
      const localProjects: Project[] = body.projects || [];
      const currentProjects = await getServerProjects();
      const currentMap = new Map(currentProjects.map((p) => [p.id, p]));

      for (const lp of localProjects) {
        if (!currentMap.has(lp.id)) {
          await saveServerProject(lp);
        } else {
          // If local project was modified more recently, update it
          const existing = currentMap.get(lp.id)!;
          const localTime = new Date(lp.updatedAt || lp.createdAt).getTime();
          const serverTime = new Date(existing.updatedAt || existing.createdAt).getTime();
          if (localTime > serverTime) {
            await saveServerProject(lp);
          }
        }
      }

      const merged = await getServerProjects();
      return NextResponse.json({ success: true, projects: merged });
    }

    // Single project create or update
    const project: Project = body.project || body;
    if (!project || !project.id) {
      return NextResponse.json({ success: false, error: '유효한 프로젝트 데이터가 필요합니다.' }, { status: 400 });
    }

    const saved = await saveServerProject(project);
    return NextResponse.json({ success: true, project: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
