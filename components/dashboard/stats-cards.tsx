'use client';

import { Project } from '@/types';
import { FolderGit2, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

interface StatsCardsProps {
  projects: Project[];
}

export function StatsCards({ projects }: StatsCardsProps) {
  const total = projects.length;
  const inReview = projects.filter((p) => p.status === 'in_review').length;
  const revising = projects.filter((p) => p.status === 'revising').length;
  const approved = projects.filter((p) => p.status === 'approved').length;

  const stats = [
    {
      title: '전체 프로젝트',
      value: total,
      icon: FolderGit2,
      code: 'TOTAL',
    },
    {
      title: '고객 검토 중',
      value: inReview,
      icon: Clock,
      code: 'IN REVIEW',
    },
    {
      title: '수정 진행 중',
      value: revising,
      icon: RefreshCw,
      code: 'REVISING',
    },
    {
      title: '최종 승인 완료',
      value: approved,
      icon: CheckCircle2,
      code: 'APPROVED',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.035)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">
                {item.code}
              </span>
              <span className="text-xs font-semibold text-zinc-700 tracking-tight">
                {item.title}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
                {item.value}
              </p>
            </div>
            <div className="w-10 h-10 bg-zinc-50 text-zinc-700 flex items-center justify-center shadow-sm">
              <Icon className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
