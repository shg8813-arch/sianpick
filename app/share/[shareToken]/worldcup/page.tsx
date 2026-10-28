'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WorldcupGame } from '@/components/worldcup/worldcup-game';
import { Project } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import { Layers, ArrowLeft, Trophy } from 'lucide-react';
import { toast } from 'sonner';

function WorldcupContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const shareToken = params.shareToken as string;
  const initialItemId = searchParams.get('itemId') || undefined;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const repo = getProjectRepository();
        const data = await repo.getProjectByShareToken(shareToken);
        if (!data) {
          toast.error('유효하지 않은 프로젝트 링크입니다.');
          return;
        }
        setProject(data);

        await repo.logActivity(data.id, 'worldcup_start', '고객이 시안 월드컵을 시작했습니다.');
      } catch {
        toast.error('프로젝트 정보를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [shareToken]);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] text-zinc-400 text-sm">
        시안 월드컵 대진을 준비하고 있습니다...
      </div>
    );
  }

  const handleSaveCandidate = async (conceptId: string, itemId?: string) => {
    const repo = getProjectRepository();
    await repo.saveWorldcupResult(project.id, conceptId, project.clientName || '고객', itemId);
    await repo.updateSelection(project.id, conceptId, 'candidate', '시안 월드컵 최종 우승', itemId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-[#FAF9F5]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href={`/share/${shareToken}`}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>시안 목록으로 나가기</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-zinc-900">
              시안픽 — 시안 월드컵
            </span>
          </div>

          <Link
            href={`/share/${shareToken}/summary`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>선택시안</span> 모아보기
          </Link>
        </div>
      </header>

      {/* World Cup Tournament Arena */}
      <main className="flex-1">
        <WorldcupGame
          projectId={project.id}
          shareToken={shareToken}
          concepts={project.concepts || []}
          designItems={project.designItems || []}
          initialItemId={initialItemId}
          onSaveCandidate={handleSaveCandidate}
        />
      </main>
    </div>
  );
}

export default function WorldcupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">월드컵을 준비 중입니다...</div>}>
      <WorldcupContent />
    </Suspense>
  );
}
