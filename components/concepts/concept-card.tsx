'use client';

import React, { useState } from 'react';
import { Concept, Selection } from '@/types';
import {
  CheckCircle2,
  ZoomIn,
  MessageSquare,
  Sparkles,
  GitBranch,
  Trash2,
  Edit,
  Eye,
  Check,
} from 'lucide-react';

interface ConceptCardProps {
  concept: Concept;
  commentCount: number;
  selection?: Selection;
  onOpenViewer: () => void;
  onToggleSelect?: () => void;
  onOpenComparison?: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ConceptCard({
  concept,
  commentCount,
  selection,
  onOpenViewer,
  onToggleSelect,
  onOpenComparison,
  isAdmin = false,
  onEdit,
  onDelete,
}: ConceptCardProps) {
  const isSelected = Boolean(selection);
  const isFinalApproved = selection?.isFinal || false;
  const versions = concept.versions || [];
  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;

  return (
    <div
      className={`group relative bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)] hover:shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isFinalApproved
          ? 'ring-2 ring-emerald-500/50'
          : isSelected
          ? 'ring-2 ring-blue-600/60 shadow-[0_16px_50px_rgba(37,99,235,0.08)]'
          : ''
      }`}
    >
      <div>
        {/* Top Header Section inside card: Folio & Badges */}
        <div className="p-6 sm:p-7 pb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400 uppercase block">
              CONCEPT {String(concept.displayOrder).padStart(2, '0')}
            </span>
            {concept.title && (
              <h3
                onClick={onOpenViewer}
                className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight cursor-pointer hover:text-blue-600 transition-colors"
              >
                {concept.title}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isSelected && (
              <span className="px-2.5 py-1 bg-zinc-900 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3 text-emerald-400" />
                선택됨
              </span>
            )}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 shadow-sm ${
                latestVersion && latestVersion.versionNumber > 1
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {latestVersion && latestVersion.versionNumber > 1
                ? `${latestVersion.versionNumber}차 수정본`
                : '1차 시안'}
            </span>
            {commentCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-50 text-[11px] font-medium text-zinc-500">
                <MessageSquare className="w-3 h-3 text-blue-500" />
                {commentCount}
              </span>
            )}
            {isAdmin && (
              <div className="flex items-center gap-1 text-zinc-300 ml-1">
                {onEdit && (
                  <button onClick={onEdit} className="p-1 hover:text-zinc-700">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button onClick={onDelete} className="p-1 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hero Artwork Image Showcase */}
        <div
          onClick={onOpenViewer}
          className="relative aspect-[16/10] bg-zinc-50/70 cursor-pointer overflow-hidden group/img mx-6 sm:mx-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
        >
          <img
            src={concept.thumbnailUrl}
            alt={concept.title || `CONCEPT ${concept.displayOrder}`}
            className="w-full h-full object-contain p-4 group-hover/img:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-white/95 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
              시안 크게 보기
            </span>
          </div>
        </div>

        {/* Narrative & Specifications */}
        <div className="p-6 sm:p-7 pt-5 space-y-3">
          {concept.description && (
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-light line-clamp-3">
              {concept.description}
            </p>
          )}

          {concept.colorFontDescription && (
            <div className="pt-2 text-[11px] text-zinc-400 font-mono tracking-wide line-clamp-1 border-t border-zinc-100">
              {concept.colorFontDescription}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Area */}
      <div className="px-6 sm:px-7 pb-6 pt-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenViewer}
            className="text-xs text-zinc-500 hover:text-zinc-900 font-medium py-1.5 flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            상세 보기
          </button>

          {versions.length > 1 && onOpenComparison && (
            <button
              type="button"
              onClick={onOpenComparison}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 py-1 px-2 bg-blue-50/80 hover:bg-blue-100 flex items-center gap-1 transition-colors shadow-sm"
              title="수정 전 시안과 현재 시안 비교"
            >
              <GitBranch className="w-3.5 h-3.5" />
              이전시안 함께 보기
            </button>
          )}
        </div>

        {onToggleSelect && (
          <button
            type="button"
            onClick={onToggleSelect}
            className={`px-5 py-2.5 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-zinc-900 text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)]'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSelected ? '선택 완료됨' : '이 시안 선택하기'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
