'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/modal';
import { PinComment } from '@/types';
import { AlertCircle, Send, CheckCircle2, Loader2, Sparkles, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxRevisionCount: number;
  usedRevisionCount: number;
  comments: PinComment[];
  onSubmitRevision: (content: string) => Promise<void>;
}

export function RevisionModal({
  isOpen,
  onClose,
  maxRevisionCount,
  usedRevisionCount,
  comments,
  onSubmitRevision,
}: RevisionModalProps) {
  const remaining = Math.max(0, maxRevisionCount - usedRevisionCount);
  const openComments = comments.filter((c) => c.status === 'open');

  // Prepopulate with open comments list if available
  const defaultSummary = openComments.length > 0
    ? openComments.map((c, i) => `${i + 1}. ${c.content}`).join('\n')
    : '';

  const [content, setContent] = useState(defaultSummary);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync default content when comments change
  React.useEffect(() => {
    if (openComments.length > 0 && !content) {
      setContent(openComments.map((c, i) => `${i + 1}. ${c.content}`).join('\n'));
    }
  }, [openComments.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('수정 요청 상세 내용을 작성해주세요.');
      return;
    }
    if (remaining <= 0) {
      toast.error('기본 수정 횟수를 모두 사용하셨습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitRevision(content.trim());
      toast.success('수정 요청서가 성공적으로 전달되었습니다!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || '수정 요청 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="수정 요청서 제출"
      description="남겨주신 코멘트들을 종합하여 디자이너에게 1회의 정식 수정 요청을 접수합니다."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Revision Count Meter */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              수정 횟수 안내
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-zinc-900">
                {usedRevisionCount} / {maxRevisionCount}회 사용
              </span>
              <span className="text-xs text-zinc-500">
                (남은 횟수: <strong className="text-blue-600 font-bold">{remaining}회</strong>)
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              요청 1건당 1회 차감
            </span>
          </div>
        </div>

        {remaining <= 0 ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <h4 className="font-bold text-rose-900 text-sm">
              기본 제공된 수정 횟수({maxRevisionCount}회)를 모두 사용했습니다.
            </h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              추가 수정을 원하시는 경우 디자이너와 협의 후 추가 작업(견적 조율)으로 진행하실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => {
                toast.info('디자이너에게 추가 수정 문의 메시지가 전송되었습니다.');
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              추가 수정 문의하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-700">
                  수정 요청 항목 종합 (현재 작성된 코멘트 {openComments.length}개)
                </label>
                {openComments.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setContent(openComments.map((c, i) => `${i + 1}. ${c.content}`).join('\n'))
                    }
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    코멘트 내용 다시 불러오기
                  </button>
                )}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="1. 시안 B의 심볼 색상을 조금 더 차분하게 변경&#10;2. 영문 서체 크기를 10% 축소..."
                rows={6}
                required
                className="w-full p-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>안내:</strong> 개별 핀 코멘트 작성은 횟수가 차감되지 않으며, 지금 이 버튼을 눌러
                요청서를 제출하실 때에만 정식으로 <strong>수정 횟수 1회가 차감</strong>됩니다.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
              >
                닫기
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    제출 처리 중...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    수정 요청 제출하기 (1회 차감)
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
