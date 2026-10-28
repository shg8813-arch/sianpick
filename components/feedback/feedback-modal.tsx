'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send, CheckCircle2, Mail } from 'lucide-react';
import { feedbackService } from '@/lib/feedback/feedback-service';
import { authService } from '@/lib/auth/auth-service';
import { FeedbackCategory } from '@/types';
import { toast } from 'sonner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { key: FeedbackCategory; label: string; desc: string }[] = [
  { key: 'feature', label: '기능 제안', desc: '새로 필요한 기능이 있으신가요?' },
  { key: 'improvement', label: '사용성 개선', desc: 'UI나 사용 중 불편한 점' },
  { key: 'bug', label: '버그 제보', desc: '정상 작동하지 않는 오류' },
  { key: 'review', label: '응원 및 후기', desc: '서비스 사용 소감 및 칭찬' },
  { key: 'other', label: '기타 문의', desc: '협업 및 기타 질문' },
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState<FeedbackCategory>('feature');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studioName, setStudioName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const user = authService.getCurrentUser();
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setStudioName(user.studioName || '');
      }
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('의견 내용을 입력해주세요.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('답변 및 확인을 위한 올바른 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await feedbackService.submitFeedback({
        category,
        rating,
        authorName: name.trim() || '디자이너',
        authorEmail: email.trim(),
        studioName: studioName.trim() || undefined,
        content: content.trim(),
      });
      setIsSuccess(true);
      toast.success('소중한 피드백이 정상 접수되었습니다. 감사합니다.');
      setTimeout(() => {
        setIsSuccess(false);
        setContent('');
        onClose();
      }, 1800);
    } catch (err: any) {
      toast.error(err.message || '피드백 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-zinc-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block">
              SIANPICK USER FEEDBACK
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-zinc-300" />
              <span>디자이너 의견 및 피드백 창구</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              시안픽은 디자이너 분들의 목소리를 바탕으로 매주 발전하고 있습니다. 필요하신 기능, 버그,
              개선점 등 어떤 의견이든 자유롭게 전해주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900">피드백이 전송되었습니다</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              보내주신 의견은 시안픽 개발팀에 즉시 전달되며, 서비스 기능 개선에 신속하게 반영하겠습니다.
              함께해주셔서 감사합니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-2">
                피드백 유형
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2.5 text-left border transition-all ${
                      category === cat.key
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{cat.label}</div>
                    <div
                      className={`text-[10px] truncate mt-0.5 ${
                        category === cat.key ? 'text-zinc-300' : 'text-zinc-400'
                      }`}
                    >
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-900">
                  전반적인 서비스 만족도
                </label>
                <span className="text-xs font-mono font-bold text-zinc-600">
                  {rating} / 5점
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 text-zinc-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating !== null ? star <= hoverRating : star <= rating)
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-zinc-100 text-zinc-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* User Info (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  성함 / 닉네임
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 김디자이너"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  답변 수신용 이메일 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="designer@studio.com"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                스튜디오 상호명 (선택)
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="예: 스튜디오 아틀리에"
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
              />
            </div>

            {/* Feedback Content */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                피드백 상세 내용 <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="시안 전달 과정에서 필요했던 기능, 버그 발생 상황, 또는 개선되었으면 하는 의견을 상세히 적어주세요."
                className="w-full p-3 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800 leading-relaxed resize-none"
              />
            </div>

            {/* Direct Contact Notice */}
            <div className="p-3 bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-500 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>직접 이메일 문의:</span>
              </div>
              <a
                href="mailto:sianpick.team@gmail.com"
                className="font-mono text-zinc-800 font-semibold underline underline-offset-2 hover:text-black"
              >
                sianpick.team@gmail.com
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors"
              >
                닫기
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>{isSubmitting ? '전송 중...' : '피드백 보내기'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
