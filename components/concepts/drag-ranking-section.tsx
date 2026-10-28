'use client';

import React, { useState, useEffect } from 'react';
import { Concept, DesignItem, PinComment } from '@/types';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Maximize2,
  MessageSquare,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface DragRankingSectionProps {
  item: DesignItem;
  concepts: Concept[];
  currentCandidateId?: string;
  onConfirmRanking: (orderedConceptIds: string[], topCandidateId: string) => Promise<void>;
  onOpenViewer: (concept: Concept) => void;
  comments: PinComment[];
}

export function DragRankingSection({
  item,
  concepts,
  currentCandidateId,
  onConfirmRanking,
  onOpenViewer,
  comments,
}: DragRankingSectionProps) {
  const [orderedList, setOrderedList] = useState<Concept[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (concepts.length === 0) return;

    const sorted = [...concepts];
    if (currentCandidateId) {
      const candIdx = sorted.findIndex((c) => c.id === currentCandidateId);
      if (candIdx > -1) {
        const [cand] = sorted.splice(candIdx, 1);
        sorted.unshift(cand);
      }
    } else {
      sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    }
    setOrderedList(sorted);
  }, [concepts, currentCandidateId]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    if (e.dataTransfer.setData) {
      e.dataTransfer.setData('text/plain', index.toString());
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragLeave = () => {};

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...orderedList];
    const [movedItem] = updated.splice(draggedIdx, 1);
    updated.splice(dropIndex, 0, movedItem);

    setOrderedList(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
    toast.info(`시안 순서가 변경되었습니다. 1순위: ${updated[0].title}`);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Move up / down helper
  const moveItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= orderedList.length) return;
    const updated = [...orderedList];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderedList(updated);
    toast.info(`시안 순서가 변경되었습니다. 1순위: ${updated[0].title}`);
  };

  // Confirm order and lock 1st preference
  const handleConfirm = async () => {
    if (orderedList.length === 0) return;
    const topConcept = orderedList[0];
    setIsSubmitting(true);
    try {
      const orderedIds = orderedList.map((c) => c.id);
      await onConfirmRanking(orderedIds, topConcept.id);
      toast.success(`[${item.name}] 1순위 "${topConcept.title}" 시안이 최종 후보로 확정되었습니다.`);
    } catch {
      toast.error('시안 순서 확정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderedList.length === 0) {
    return null;
  }

  const topConcept = orderedList[0];
  const isTopCandidateConfirmed = topConcept.id === currentCandidateId;

  return (
    <div className="bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.035)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 uppercase">
              선호도 순위 지정
            </span>
            <span className="text-xs text-zinc-400">
              | {item.name} 시안 드래그앤드롭
            </span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
            {item.name} 시안 순서 선택 및 확정
          </h3>
          <p className="text-xs text-zinc-500">
            카드를 드래그하거나 화살표를 눌러 1순위, 2순위, 3순위를 지정한 후 <strong>[1순위 시안으로 확정]</strong>을 눌러주세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-zinc-50 text-xs text-zinc-600 font-medium flex items-center gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>총 {orderedList.length}개 시안</span>
          </div>
        </div>
      </div>

      {/* Draggable Cards Stack */}
      <div className="mt-5 space-y-3">
        {orderedList.map((concept, idx) => {
          const isRank1 = idx === 0;
          const isDragging = draggedIdx === idx;
          const isOver = dragOverIdx === idx;
          const commentCount = comments.filter((c) => c.conceptId === concept.id).length;

          return (
            <div
              key={concept.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 transition-all ${
                isDragging
                  ? 'opacity-40 bg-zinc-100 scale-[0.99]'
                  : isOver
                  ? 'bg-blue-50/60 shadow-[0_4px_20px_rgba(37,99,235,0.1)]'
                  : isRank1
                  ? 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                  : 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]'
              }`}
            >
              {/* Left Grip Handle + Rank Badge */}
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  title="드래그하여 순서 변경"
                  className="cursor-grab active:cursor-grabbing p-1.5 text-zinc-300 group-hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                {/* Rank Badge */}
                <div
                  className={`w-12 sm:w-14 h-11 flex flex-col items-center justify-center font-mono ${
                    isRank1
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : idx === 1
                      ? 'bg-zinc-100 text-zinc-700'
                      : 'bg-zinc-50 text-zinc-500'
                  }`}
                >
                  <span className="text-[9px] tracking-wider uppercase font-medium">RANK</span>
                  <span className="text-sm leading-none font-bold">{idx + 1}순위</span>
                </div>

                {/* Thumbnail */}
                <div
                  onClick={() => onOpenViewer(concept)}
                  className="relative w-20 sm:w-24 h-16 sm:h-18 bg-zinc-50 shrink-0 cursor-pointer overflow-hidden group/thumb shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <img
                    src={concept.thumbnailUrl}
                    alt={concept.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                      {concept.title || `시안 ${concept.displayOrder || idx + 1}`}
                    </h4>
                    {isRank1 && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        대표 후보 선정안
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1 max-w-xl">
                    {concept.description || concept.designConcept}
                  </p>
                  {concept.colorFontDescription && (
                    <span className="text-[11px] text-zinc-400 block truncate">
                      {concept.colorFontDescription}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Action Tools: Up/Down buttons + View + Comments */}
              <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
                {commentCount > 0 && (
                  <div className="px-2 py-1 bg-zinc-50 text-[11px] font-medium text-zinc-600 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-blue-600" />
                    <span>{commentCount}</span>
                  </div>
                )}

                {/* Up / Down accessible movement buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, idx - 1)}
                    disabled={idx === 0}
                    title="위로 이동"
                    className="p-1.5 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-20 text-zinc-700 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(idx, idx + 1)}
                    disabled={idx === orderedList.length - 1}
                    title="아래로 이동"
                    className="p-1.5 bg-zinc-50 hover:bg-zinc-100 disabled:opacity-20 text-zinc-700 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inspect Button */}
                <button
                  type="button"
                  onClick={() => onOpenViewer(concept)}
                  className="px-2.5 py-1.5 text-xs text-zinc-600 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100 transition-colors whitespace-nowrap font-medium"
                >
                  상세보기
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Bottom Footer */}
      <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-zinc-500">
          현재 1순위: <strong className="text-zinc-900 font-bold">{topConcept.title}</strong>
          {isTopCandidateConfirmed ? (
            <span className="text-emerald-700 font-medium ml-2">(대표 후보로 등록됨)</span>
          ) : (
            <span className="text-amber-700 font-medium ml-2">(순서 확정 대기 중)</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className={`px-6 py-2.5 font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
            isTopCandidateConfirmed
              ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {isTopCandidateConfirmed
              ? `[1순위: ${topConcept.title}] 후보 확정 완료 (재저장)`
              : `[1순위: ${topConcept.title}] 시안으로 최종 확정하기`}
          </span>
        </button>
      </div>
    </div>
  );
}
