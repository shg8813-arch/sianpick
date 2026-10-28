'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectEstimate, EstimateItem, StudioProfile } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Calculator,
  Building2,
  CreditCard,
  Calendar,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectEstimateEditorProps {
  projectId: string;
  shareToken: string;
  initialEstimate?: ProjectEstimate;
  projectTitle: string;
  companyName?: string;
  clientName: string;
  clientEmail?: string;
  onSaved?: (estimate: ProjectEstimate) => void;
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
}

export function ProjectEstimateEditor({
  projectId,
  shareToken,
  initialEstimate,
  projectTitle,
  companyName,
  clientName,
  clientEmail,
  onSaved,
}: ProjectEstimateEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialEstimate?.title || '디자인 용역 공급 견적서');
  const [estimateNumber, setEstimateNumber] = useState(
    initialEstimate?.estimateNumber ||
      `EST-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(
        Math.floor(Math.random() * 900) + 100
      )}`
  );
  const [issueDate, setIssueDate] = useState(
    initialEstimate?.issueDate || new Date().toISOString().slice(0, 10)
  );
  const [validUntilDate, setValidUntilDate] = useState(
    initialEstimate?.validUntilDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Provider
  const [senderName, setSenderName] = useState(
    initialEstimate?.senderName || '스튜디오 아틀리에 (STUDIO ATELIER)'
  );
  const [senderRepresentative, setSenderRepresentative] = useState(
    initialEstimate?.senderRepresentative || '이시안'
  );
  const [senderRegistrationNumber, setSenderRegistrationNumber] = useState(
    initialEstimate?.senderRegistrationNumber || '214-88-12345'
  );
  const [senderContact, setSenderContact] = useState(
    initialEstimate?.senderContact || '02-543-9801'
  );
  const [senderEmail, setSenderEmail] = useState(
    initialEstimate?.senderEmail || 'contact@studio-atelier.kr'
  );
  const [senderAddress, setSenderAddress] = useState(
    initialEstimate?.senderAddress || '서울특별시 용산구 한남대로 20길 14, 3층'
  );
  const [senderBankAccount, setSenderBankAccount] = useState(
    initialEstimate?.senderBankAccount || '기업은행 010-5439-8012 (예금주: 스튜디오 아틀리에)'
  );

  // Logo Attachment for Estimate Bottom
  const [senderLogoUrl, setSenderLogoUrl] = useState<string>(
    initialEstimate?.senderLogoUrl || ''
  );
  const [senderLogoHeight, setSenderLogoHeight] = useState<number>(
    initialEstimate?.senderLogoHeight || 42
  );
  const [studioProfileLogo, setStudioProfileLogo] = useState<string>('');
  const [studioProfileLogoHeight, setStudioProfileLogoHeight] = useState<number>(42);

  // Load global studio profile from dashboard
  useEffect(() => {
    const loadStudio = async () => {
      try {
        const repo = getProjectRepository();
        const profile = await repo.getStudioProfile();
        if (profile) {
          if (profile.logoUrl) {
            setStudioProfileLogo(profile.logoUrl);
            if (profile.logoHeight) setStudioProfileLogoHeight(profile.logoHeight);
          }
          if (initialEstimate?.senderLogoUrl === undefined && profile.logoUrl) {
            setSenderLogoUrl(profile.logoUrl);
            if (profile.logoHeight) setSenderLogoHeight(profile.logoHeight);
          }
          if (!initialEstimate?.senderName || initialEstimate.senderName.includes('스튜디오 아틀리에')) {
            setSenderName(profile.studioName || '');
          }
          if (!initialEstimate?.senderRepresentative || initialEstimate.senderRepresentative === '이시안') {
            setSenderRepresentative(profile.representative || '');
          }
          if (!initialEstimate?.senderRegistrationNumber || initialEstimate.senderRegistrationNumber === '214-88-12345') {
            setSenderRegistrationNumber(profile.registrationNumber || '');
          }
          if (!initialEstimate?.senderContact || initialEstimate.senderContact === '02-543-9801') {
            setSenderContact(profile.contact || '');
          }
          if (!initialEstimate?.senderEmail || initialEstimate.senderEmail === 'contact@studio-atelier.kr') {
            setSenderEmail(profile.email || '');
          }
          if (!initialEstimate?.senderAddress || initialEstimate.senderAddress.includes('한남대로')) {
            setSenderAddress(profile.address || '');
          }
          if (!initialEstimate?.senderBankAccount || initialEstimate.senderBankAccount.includes('기업은행')) {
            setSenderBankAccount(profile.bankAccount || '');
          }
        }
      } catch (err) {
        console.error('Failed to load studio profile', err);
      }
    };
    loadStudio();
  }, [initialEstimate]);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일(PNG, JPG, SVG 등)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSenderLogoUrl(event.target.result as string);
        toast.success('견적서 하단 로고가 첨부되었습니다.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Recipient
  const [receiverCompany, setReceiverCompany] = useState(
    initialEstimate?.receiverCompany || companyName || clientName
  );
  const [receiverRepresentative, setReceiverRepresentative] = useState(
    initialEstimate?.receiverRepresentative || clientName
  );
  const [receiverContact, setReceiverContact] = useState(initialEstimate?.receiverContact || '');
  const [receiverEmail, setReceiverEmail] = useState(
    initialEstimate?.receiverEmail || clientEmail || ''
  );

  // Line items (자유 직접 입력 리스트)
  const [items, setItems] = useState<EstimateItem[]>(
    initialEstimate?.items && initialEstimate.items.length > 0
      ? initialEstimate.items
      : [
          {
            id: `item-${Date.now()}-1`,
            name: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            amount: 0,
            note: '',
          },
        ]
  );

  const [vatRate, setVatRate] = useState<number>(initialEstimate?.vatRate ?? 10);
  const [termsAndNotes, setTermsAndNotes] = useState(
    initialEstimate?.termsAndNotes ||
      '1. 본 견적서는 발행일로부터 30일간 유효합니다.\n2. 계약금 50% 입금 확인 후 프로젝트 작업이 공식 착수됩니다.\n3. 피드백 토큰 20개가 기본 제공되며, 피드백 1회 작성 시 1개씩 순차 차감됩니다.\n4. 최종 시안 확정 승인 및 잔금 입금 완료 시 원본 인쇄 데이터가 제공됩니다.'
  );

  // Line item handlers
  const handleAddItem = () => {
    const newItem: EstimateItem = {
      id: `est-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      note: '',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error('최소 1개 이상의 견적 항목이 필요합니다.');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof EstimateItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(value) || 0 : item.quantity;
          const price = field === 'unitPrice' ? Number(value) || 0 : item.unitPrice;
          updated.amount = qty * price;
        }
        return updated;
      })
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const vatAmount = Math.round(subtotal * (vatRate / 100));
  const totalAmount = subtotal + vatAmount;

  // Save handler
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('견적서 제목을 입력해주세요.');
      return;
    }

    const hasEmptyItemName = items.some((it) => !it.name.trim());
    if (hasEmptyItemName) {
      toast.error('모든 품목의 항목명을 직접 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      const estimateToSave: ProjectEstimate = {
        id: initialEstimate?.id || `estimate-${projectId}-${Date.now()}`,
        projectId,
        title: title.trim(),
        estimateNumber: estimateNumber.trim(),
        issueDate,
        validUntilDate,
        senderName: senderName.trim(),
        senderRepresentative: senderRepresentative.trim(),
        senderRegistrationNumber: senderRegistrationNumber.trim(),
        senderContact: senderContact.trim(),
        senderEmail: senderEmail.trim(),
        senderAddress: senderAddress.trim(),
        senderBankAccount: senderBankAccount.trim(),
        senderLogoUrl: senderLogoUrl.trim() || undefined,
        senderLogoHeight: senderLogoUrl.trim() ? senderLogoHeight : undefined,
        receiverCompany: receiverCompany.trim(),
        receiverRepresentative: receiverRepresentative.trim(),
        receiverContact: receiverContact.trim(),
        receiverEmail: receiverEmail.trim(),
        items,
        subtotal,
        vatRate,
        vatAmount,
        totalAmount,
        termsAndNotes: termsAndNotes.trim(),
        createdAt: initialEstimate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const repo = getProjectRepository();
      const saved = await repo.updateProjectEstimate(projectId, estimateToSave);
      toast.success('견적서가 성공적으로 저장되었습니다.');
      if (onSaved) onSaved(saved);
    } catch {
      toast.error('견적서 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.035)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400 uppercase block mb-1">
            ESTIMATE MANAGEMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            프로젝트 견적서 작성 및 관리
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            항목명, 수량, 단가를 직접 자유롭게 입력하여 견적서를 구성할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/share/${shareToken}/estimate`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold shadow-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
            <span>고객 견적서 페이지 확인</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>견적서 저장하기</span>
          </button>
        </div>
      </div>

      {/* Estimate Document Form Sheet */}
      <div className="bg-white p-6 sm:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.035)] space-y-8">
        {/* Document Meta Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-6 border-b border-zinc-100">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              견적서 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 디자인 용역 공급 견적서"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-50/80 focus:bg-white focus:outline-none transition-colors font-bold text-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              견적 번호
            </label>
            <input
              type="text"
              value={estimateNumber}
              onChange={(e) => setEstimateNumber(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-50/80 focus:bg-white focus:outline-none transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              발행일자
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-50/80 focus:bg-white focus:outline-none transition-colors font-mono"
            />
          </div>
        </div>

        {/* Recipient & Provider Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recipient (공급받는 자) */}
          <div className="p-5 bg-zinc-50/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase block">
              공급받는 자 (고객 정보 직접 입력)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] text-zinc-400 mb-1">상호 / 업체명</label>
                <input
                  type="text"
                  value={receiverCompany}
                  onChange={(e) => setReceiverCompany(e.target.value)}
                  placeholder="예: 어반 포레스트"
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">대표자 / 담당자명</label>
                <input
                  type="text"
                  value={receiverRepresentative}
                  onChange={(e) => setReceiverRepresentative(e.target.value)}
                  placeholder="예: 김민준 대표"
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">연락처</label>
                <input
                  type="text"
                  value={receiverContact}
                  onChange={(e) => setReceiverContact(e.target.value)}
                  placeholder="예: 010-8421-5502"
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] text-zinc-400 mb-1">이메일</label>
                <input
                  type="email"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  placeholder="client@urbanforest.design"
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Provider (공급자 정보: 대시보드 메인 설정 연동) */}
          <div className="p-5 bg-zinc-50/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase block">
                공급자 (대시보드 메인 스튜디오 정보 연동)
              </span>
              <Link
                href="/dashboard?tab=studio"
                target="_blank"
                className="text-[11px] text-zinc-600 hover:text-zinc-900 underline font-medium"
              >
                대시보드에서 수정
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">스튜디오 / 상호명</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">대표자 성명</label>
                <input
                  type="text"
                  value={senderRepresentative}
                  onChange={(e) => setSenderRepresentative(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">사업자등록번호</label>
                <input
                  type="text"
                  value={senderRegistrationNumber}
                  onChange={(e) => setSenderRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">스튜디오 연락처</label>
                <input
                  type="text"
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] text-zinc-400 mb-1">사업장 주소</label>
                <input
                  type="text"
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] text-zinc-400 mb-1">입금 계좌</label>
                <input
                  type="text"
                  value={senderBankAccount}
                  onChange={(e) => setSenderBankAccount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 견적서 하단 로고 첨부 설정 (첨부 시 로고 표기, 미첨부 시 업체명만 단독 표기) */}
        <div className="p-5 bg-zinc-50/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-zinc-500" />
                견적서 하단 로고 첨부 설정
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                로고를 첨부하면 견적서 하단 서명 영역에 로고가 삽입되며, <strong>로고를 첨부하지 않을 경우 업체명 텍스트만 단독 표기</strong>됩니다.
              </p>
            </div>

            {senderLogoUrl && (
              <button
                type="button"
                onClick={() => {
                  setSenderLogoUrl('');
                  toast.success('로고 첨부가 해제되었습니다. 견적서 하단에 업체명만 표기됩니다.');
                }}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold underline self-start sm:self-auto shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>로고 첨부 해제 (업체명만 표기)</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <input
              type="file"
              id="estimate-bottom-logo"
              accept="image/*"
              onChange={handleLogoFileUpload}
              className="hidden"
            />
            <label
              htmlFor="estimate-bottom-logo"
              className="px-3.5 py-2 text-xs font-bold bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-zinc-600" />
              <span>{senderLogoUrl ? '로고 이미지 변경' : '로고 파일 첨부 (PNG/JPG/SVG)'}</span>
            </label>

            {studioProfileLogo && studioProfileLogo !== senderLogoUrl && (
              <button
                type="button"
                onClick={() => {
                  setSenderLogoUrl(studioProfileLogo);
                  if (studioProfileLogoHeight) setSenderLogoHeight(studioProfileLogoHeight);
                  toast.success('내 스튜디오 로고가 첨부되었습니다.');
                }}
                className="px-3.5 py-2 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition-colors"
              >
                내 스튜디오 로고 가져오기
              </button>
            )}

            {senderLogoUrl && (
              <div className="flex items-center gap-2 text-xs bg-white border border-zinc-200 px-3 py-1.5 shadow-sm ml-auto">
                <span className="text-[11px] text-zinc-500 font-medium">로고 높이:</span>
                <input
                  type="range"
                  min="24"
                  max="70"
                  value={senderLogoHeight}
                  onChange={(e) => setSenderLogoHeight(Number(e.target.value))}
                  className="w-24 accent-zinc-900 cursor-pointer"
                />
                <span className="font-mono text-zinc-700 text-xs w-9 text-right font-bold">{senderLogoHeight}px</span>
              </div>
            )}
          </div>

          {/* 하단 실시간 미리보기 박스 */}
          <div className="mt-2 p-5 bg-white border border-dashed border-zinc-200 text-center space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
              견적서 하단 최종 출력 실시간 미리보기
            </span>
            <p className="text-xs text-zinc-400">위와 같이 견적서를 제출합니다.</p>

            {senderLogoUrl ? (
              <div className="flex flex-col items-center justify-center pt-2">
                <img
                  src={senderLogoUrl}
                  alt={senderName}
                  style={{ height: `${senderLogoHeight}px` }}
                  className="max-w-[240px] object-contain mx-auto"
                />
                <div className="font-bold text-zinc-900 text-xs mt-2.5">
                  {senderName || '스튜디오명'} {senderRepresentative && `대표 ${senderRepresentative}`}
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <div className="font-bold text-zinc-900 text-sm">
                  {senderName || '스튜디오명'}
                </div>
                {senderRepresentative && (
                  <div className="text-xs text-zinc-500 mt-0.5">
                    대표 {senderRepresentative}
                  </div>
                )}
                <span className="inline-block mt-2 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-mono">
                  로고 미첨부 — 업체명 텍스트 단독 출력
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Freeform Line Items Table (자유 직접 입력 테이블) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                견적 품목 내역 (자유 직접 입력)
              </h3>
              <p className="text-[11px] text-zinc-400">
                원하시는 디자인 항목명과 수량, 단가를 직접 입력하시면 공급가액이 자동 계산됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>품목 행 추가</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-zinc-100">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  <th className="py-2.5 px-2 text-center w-10">NO</th>
                  <th className="py-2.5 px-3 w-48">품목명 (직접입력)</th>
                  <th className="py-2.5 px-3">규격 / 세부사양 (직접입력)</th>
                  <th className="py-2.5 px-2 text-center w-20">수량</th>
                  <th className="py-2.5 px-3 text-right w-28">단가 (원)</th>
                  <th className="py-2.5 px-3 text-right w-28">공급가액</th>
                  <th className="py-2.5 px-3 w-36">비고</th>
                  <th className="py-2.5 px-2 text-center w-12">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50">
                    <td className="py-2 px-2 text-center font-mono text-zinc-400">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                        placeholder="예: 로고 디자인 시스템"
                        className="w-full px-2 py-1 bg-zinc-50/80 focus:bg-white focus:outline-none font-medium text-zinc-900"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="세부 작업 내용 및 사양"
                        className="w-full px-2 py-1 bg-zinc-50/80 focus:bg-white focus:outline-none text-zinc-600"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 text-center bg-zinc-50/80 focus:bg-white focus:outline-none font-mono"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="1000"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                        className="w-full px-2 py-1 text-right bg-zinc-50/80 focus:bg-white focus:outline-none font-mono"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-zinc-800">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.note || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'note', e.target.value)}
                        placeholder="비고"
                        className="w-full px-2 py-1 bg-zinc-50/80 focus:bg-white focus:outline-none text-zinc-500"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-zinc-300 hover:text-rose-600 transition-colors"
                        title="행 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculation & Tax Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-zinc-100">
          <div className="w-full sm:w-1/2 space-y-2">
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              특약사항 및 견적 비고 (자유 직접 입력)
            </label>
            <textarea
              rows={4}
              value={termsAndNotes}
              onChange={(e) => setTermsAndNotes(e.target.value)}
              placeholder="견적 유효기간, 계약금 및 잔금 비율, 납품 파일 형식 등 안내사항을 자유롭게 작성하세요."
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-50/80 focus:bg-white focus:outline-none leading-relaxed resize-none font-mono"
            />
          </div>

          <div className="w-full sm:w-72 bg-zinc-50/70 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3 text-xs">
            <div className="flex justify-between items-center text-zinc-600">
              <span>공급가액 소계</span>
              <span className="font-mono font-bold text-zinc-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center text-zinc-600">
              <span className="flex items-center gap-1">
                <span>부가가치세 (VAT)</span>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                  className="w-10 px-1 py-0.5 text-center text-xs bg-white border border-zinc-200 font-mono"
                />
                <span>%</span>
              </span>
              <span className="font-mono text-zinc-800">{formatCurrency(vatAmount)}</span>
            </div>

            <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
              <span className="font-bold text-zinc-900">총 견적금액</span>
              <span className="font-mono font-extrabold text-base text-zinc-950">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>견적서 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
