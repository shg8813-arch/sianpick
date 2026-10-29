import { NextRequest, NextResponse } from 'next/server';
import { getServerCompanies, saveServerCompanies } from '@/lib/server/storage';
import { Company } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const companies = await getServerCompanies();
    return NextResponse.json({ success: true, companies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'sync') {
      const localCompanies: Company[] = body.companies || [];
      const current = await getServerCompanies();

      for (const lc of localCompanies) {
        if (!lc || !lc.id || !lc.name) continue;
        if (!current.some((c) => c.id === lc.id || c.name === lc.name)) {
          current.push(lc);
        }
      }

      await saveServerCompanies(current);
      return NextResponse.json({ success: true, companies: current });
    }

    const company: Company = body.company || body;
    const current = await getServerCompanies();
    const idx = current.findIndex((c) => c.id === company.id);

    if (idx >= 0) {
      current[idx] = company;
    } else {
      current.push(company);
    }

    await saveServerCompanies(current);
    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: '삭제할 업체 ID가 필요합니다.' }, { status: 400 });
    }

    const current = await getServerCompanies();
    const filtered = current.filter((c) => c.id !== id);
    await saveServerCompanies(filtered);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
