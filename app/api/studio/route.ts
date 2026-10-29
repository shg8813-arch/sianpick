import { NextRequest, NextResponse } from 'next/server';
import { getServerStudioProfile, saveServerStudioProfile } from '@/lib/server/storage';
import { StudioProfile } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await getServerStudioProfile();
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await getServerStudioProfile();
    const updated: StudioProfile = {
      ...current,
      ...body,
    };

    await saveServerStudioProfile(updated);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
