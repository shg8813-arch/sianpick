'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { formatDateKR, getProjectStatusLabel } from '@/lib/utils/format';
import {
  Calendar,
  Layers,
  Copy,
  ExternalLink,
  ChevronRight,
  User,
  Trash2,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const statusInfo = getProjectStatusLabel(project.status);
  const remainingRevisions = Math.max(0, project.maxRevisionCount - project.usedRevisionCount);
  const conceptsCount = project.concepts?.length || 0;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/share/${project.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('고객 전용 공유 링크가 복사되었습니다!');
  };

  return (
    <div className="group bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.065)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 shadow-sm ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.label}
          </span>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-800">{project.clientName}</span>
          </div>
        </div>

        {/* Company tag */}
        {project.companyName && (
          <div className="mb-1.5">
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-zinc-400" />
              {project.companyName}
            </span>
          </div>
        )}

        {/* Title & Description */}
        <Link href={`/dashboard/projects/${project.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight leading-snug">
            {project.title}
          </h3>
        </Link>

        {project.description && (
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Project Key Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-100 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-600">
            <Layers className="w-4 h-4 text-zinc-400" />
            <span>등록 시안: <strong>{conceptsCount}개</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-600">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>마감: {formatDateKR(project.dueDate)}</span>
          </div>
        </div>

        {/* Feedback Token meter */}
        <div className="mt-3 bg-zinc-50/80 p-2.5 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">피드백 토큰</span>
          <span className="font-semibold text-zinc-800 font-mono">
            잔여 {Math.max(0, (project.feedbackTokensTotal ?? 20) - (project.feedbackTokensUsed ?? 0))} / {project.feedbackTokensTotal ?? 20}개
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyLink}
            title="고객 공유 링크 복사"
            className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 shadow-sm transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <Link
            href={`/share/${project.shareToken}`}
            title="고객 화면 미리보기"
            target="_blank"
            className="p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 shadow-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          </Link>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(project.id);
              }}
              title="프로젝트 삭제"
              className="p-1.5 hover:text-rose-600 hover:bg-rose-50 text-zinc-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Link
          href={`/dashboard/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-800 hover:text-black"
        >
          <span>프로젝트 관리</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
