'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/shared/modal';
import { Company } from '@/types';
import { Building2, User, Phone, Mail, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    contactPerson: string;
    email?: string;
    phone?: string;
    memo?: string;
  }) => Promise<void>;
  initialData?: Company | null;
}

export function CompanyFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CompanyFormModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setContactPerson(initialData.contactPerson);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setMemo(initialData.memo || '');
    } else {
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setMemo('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('업체명을 입력해주세요.');
      return;
    }
    if (!contactPerson.trim()) {
      toast.error('담당자명을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        memo: memo.trim() || undefined,
      });
      toast.success(initialData ? '업체 정보가 수정되었습니다.' : '새 업체가 등록되었습니다.');
      onClose();
    } catch {
      toast.error('업체 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? '업체 정보 수정' : '새 클라이언트(업체) 등록'}
      description="프로젝트를 등록하기 전에 클라이언트 업체를 먼저 등록합니다."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">
            업체명 (상호/브랜드명) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 루미에르 커피 로스터스"
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">
            담당자명 (대표/실무자) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="예: 김고객 대표"
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">연락처</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">이메일</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.kr"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">업체 특이사항 / 메모</label>
          <textarea
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="업체 스타일 선호도, 계약 메모 등을 기재하세요."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {initialData ? '수정 완료' : '업체 등록 완료'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
