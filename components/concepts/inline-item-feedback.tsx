'use client';

import React, { useState } from 'react';
import { DesignItem, Concept, PinComment } from '@/types';
import { MessageSquare, Send, CheckCircle2, Clock, Loader2, Coins, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface InlineItemFeedbackProps {
  item: DesignItem;
  selectedConcept: Concept | null;
  comments: PinComment[];
  tokensRemaining?: number;
  tokensTotal?: number;
  onAddComment: (data: {
    conceptId: string;
    content: string;
    authorName: string;
    authorType: 'designer' | 'client';
  }) => Promise<void>;
}

function formatExactDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString;
  }
}

export function InlineItemFeedback({
  item,
  selectedConcept,
  comments,
  tokensRemaining = 20,
  tokensTotal = 20,
  onAddComment,
}: InlineItemFeedbackProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter comments for this item and sort chronologically (earliest to latest)
  const itemComments = comments
    .filter((c) => c.itemId === item.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const hasTokens = tokensRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('피드백 내용을 입력해주세요.');
      return;
    }

    if (!selectedConcept) {
      toast.error('먼저 상단에서 선호하시는 시안을 선택해주세요.');
      return;
    }

    if (!hasTokens) {
      toast.error('피드백 토큰이 모두 소진되었습니다. 추가 문의는 디자이너에게 연락해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment({
        conceptId: selectedConcept.id,
        content: content.trim(),
        authorName: '고객',
        authorType: 'client',
      });
      setContent('');
      toast.success(`[${item.name}] 피드백이 등록되었습니다. (피드백 토큰 1개 차감)`);
    } catch {
      toast.error('피드백 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-7 shadow-[0_12px_45px_rgba(0,0,0,0.035)] transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400 uppercase block mb-0.5">
            CLIENT WORK LOG FEEDBACK
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
            {item.name} 작업 피드백 기록
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Token Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 text-zinc-800 text-xs font-medium shadow-sm">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            <span>
              피드백 토큰: <strong>{tokensRemaining}</strong> / {tokensTotal}개
            </span>
          </div>

          {selectedConcept ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 text-white text-xs font-medium shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>선택 시안: <strong>{selectedConcept.title}</strong></span>
            </span>
          ) : (
            <span className="text-xs text-zinc-400">
              상단에서 시안을 선택 후 피드백을 작성하세요.
            </span>
          )}
        </div>
      </div>

      {/* Chronological Work Log (작업창 느낌의 피드백 나열) */}
      <div className="mt-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-zinc-900 text-white text-[11px] font-semibold shadow-sm">
              피드백 기록
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              ({itemComments.length}건)
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            시간순 자동 정렬
          </span>
        </div>

        {itemComments.length === 0 ? (
          <div className="p-6 bg-zinc-50/60 text-center text-xs text-zinc-400 font-mono">
            등록된 이전 피드백이 없습니다. 하단 입력창을 통해 첫 번째 피드백을 등록해주세요.
          </div>
        ) : (
          <div className="space-y-2.5 font-sans">
            {itemComments.map((comment, idx) => (
              <div
                key={comment.id}
                className="p-4 sm:p-5 bg-zinc-50/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-2 transition-all hover:bg-zinc-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    {comment.status === 'resolved' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 shadow-sm inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        디자이너 확인 완료
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{formatExactDateTime(comment.createdAt)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap pl-6 sm:pl-7 border-l-2 border-zinc-200">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Feedback Input Form placed directly below the work-log list */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100">
        {!selectedConcept ? (
          <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 space-y-1">
            <span className="font-bold text-zinc-900 block">시안 선택 후 피드백 작성 가능</span>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              피드백은 특정 시안에 귀속되어 기록됩니다. 상단에서 [{item.name}] 시안을 클릭하여 상세 화면에서 <strong>[이 시안을 대표 시안으로 선택하기]</strong>를 완료하신 후 피드백을 작성해주세요.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-zinc-900 tracking-wider">
                [0{selectedConcept.displayOrder || 1}] 피드백 작성
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                잔여 토큰 {tokensRemaining}개
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!hasTokens}
              placeholder={
                !hasTokens
                  ? '부여된 피드백 토큰이 모두 소진되었습니다. 추가 토큰은 디자이너에게 문의해주세요.'
                  : `선택하신 [0${selectedConcept.displayOrder || 1}]에 대한 피드백 내용을 자유롭게 적어주세요. (작성 시 일시와 함께 작업창에 순차 기록됩니다.)`
              }
              rows={3}
              className="w-full px-4 py-3 text-xs sm:text-sm bg-zinc-50/80 focus:bg-white focus:outline-none transition-colors resize-none leading-relaxed disabled:opacity-50"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-zinc-400">
                * 피드백 등록 시 현재 일시가 자동 기록되며 이전 피드백 하단에 작업창 형태로 순차 누적됩니다.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || !hasTokens}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white font-medium text-xs tracking-wide shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>피드백 등록</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
