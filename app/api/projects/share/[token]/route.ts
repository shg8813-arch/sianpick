import { NextRequest, NextResponse } from 'next/server';
import { getServerProjectByShareToken } from '@/lib/server/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const project = await getServerProjectByShareToken(params.token);
    if (!project) {
      return NextResponse.json({ success: false, error: '유효하지 않거나 만료된 공유 링크입니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
