import { NextRequest, NextResponse } from 'next/server';
import { getServerProjectById, saveServerProject, deleteServerProject } from '@/lib/server/storage';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getServerProjectById(params.id);
    if (!project) {
      return NextResponse.json({ success: false, error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await getServerProjectById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    const updates = await req.json();
    const updated: Project = {
      ...existing,
      ...updates,
      id: existing.id, // prevent ID overwrite
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveServerProject(updated);
    return NextResponse.json({ success: true, project: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteServerProject(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
