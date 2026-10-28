'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/modal';
import { Concept } from '@/types';
import { CheckCircle2, Trophy, Loader2, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDateTimeKR } from '@/lib/utils/format';
import { toast } from 'sonner';

interface FinalApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConcept: Concept | null;
  onConfirmApprove: (conceptId: string) => Promise<void>;
}

export function FinalApprovalModal({
  isOpen,
  onClose,
  selectedConcept,
  onConfirmApprove,
}: FinalApprovalModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);

  if (!selectedConcept) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="시안 미선택" maxWidth="sm">
        <div className="py-6 text-center text-zinc-600 text-sm">
          최종 승인할 시안을 먼저 선택해주세요.
        </div>
      </Modal>
    );
  }

  const handleApprove = async () => {
    if (!isChecked) {
      toast.error('확인 체크박스를 체크해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmApprove(selectedConcept.id);

      const now = new Date().toISOString();
      setApprovedAt(now);
      setIsApproved(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success('프로젝트 최종 승인이 성공적으로 완료되었습니다.');
    } catch {
      toast.error('최종 승인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setIsApproved(false);
    setIsChecked(false);
    onClose();
    window.location.reload();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isApproved ? handleFinish : onClose}
      maxWidth={isApproved ? 'md' : 'lg'}
    >
      {isApproved ? (
        <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              프로젝트 완료 (최종 승인)
            </span>
            <h3 className="text-2xl font-bold text-zinc-900 mt-2">
              최종 시안 승인이 확정되었습니다!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              승인 일시: {formatDateTimeKR(approvedAt)}
            </p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-left flex items-center gap-4">
            <img
              src={selectedConcept.thumbnailUrl}
              alt={selectedConcept.title}
              className="w-20 h-20 rounded-xl object-contain bg-white border border-zinc-200 shadow-sm"
            />
            <div>
              <span className="text-[11px] font-semibold text-emerald-600">최종 확정 시안</span>
              <h4 className="font-bold text-zinc-900 text-sm mt-0.5">{selectedConcept.title}</h4>
              <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                {selectedConcept.description || selectedConcept.designConcept}
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            디자이너가 최종 인쇄 및 원본 배포용 파일(AI, PDF, SVG, PNG 등) 패키징을 준비할 예정입니다.
          </p>

          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-95"
          >
            확인 및 돌아가기
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              Final Concept Sign-off
            </div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
              디자인 시안 최종 승인
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              선택하신 시안을 본 프로젝트의 최종 납품 디자인으로 확정합니다.
            </p>
          </div>

          {/* Selected concept preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <img
              src={selectedConcept.thumbnailUrl}
              alt={selectedConcept.title}
              className="w-24 h-24 rounded-lg object-contain bg-white border border-zinc-200 shadow-sm"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-blue-600">선택된 대표 시안</span>
              <h4 className="font-bold text-zinc-900 text-base">{selectedConcept.title}</h4>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {selectedConcept.description || selectedConcept.designConcept}
              </p>
            </div>
          </div>

          {/* Warning notice */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>안내:</strong> 최종 승인 이후에는 추가적인 일반 디자인 수정 요청이 제한되며,
              디자이너에게 최종 원본 제작 단계로 전달됩니다. 변경 사항이 남아있는지 꼼꼼히 확인해주세요.
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-100/70 transition-colors">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-semibold text-zinc-800 select-none">
              선택한 시안과 내용을 충분히 확인하였으며, 최종 시안으로 확정 승인합니다.
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={!isChecked || isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  승인 처리 중...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  최종 승인 완료
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
