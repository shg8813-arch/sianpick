'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { CompanyFormModal } from '@/components/dashboard/company-form-modal';
import { getProjectRepository } from '@/lib/repositories';
import { Company } from '@/types';
import { ArrowLeft, Loader2, Building2, Plus, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCompanyId = searchParams.get('companyId') || '';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxRevisionCount, setMaxRevisionCount] = useState(20);
  const [maxSelectionCount, setMaxSelectionCount] = useState(3);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(true);
  const [worldcupEnabled, setWorldcupEnabled] = useState(false);

  // Load companies
  const loadCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      const repo = getProjectRepository();
      const list = await repo.getCompanies();
      setCompanies(list);

      if (preselectedCompanyId) {
        const found = list.find((c) => c.id === preselectedCompanyId);
        if (found) {
          setSelectedCompanyId(found.id);
          setClientName(found.contactPerson);
          setClientEmail(found.email || '');
        }
      } else if (list.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(list[0].id);
        setClientName(list[0].contactPerson);
        setClientEmail(list[0].email || '');
      }
    } catch {
      toast.error('업체 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [preselectedCompanyId]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    const found = companies.find((c) => c.id === companyId);
    if (found) {
      setClientName(found.contactPerson);
      setClientEmail(found.email || '');
    }
  };

  const handleCreateCompany = async (data: any) => {
    const repo = getProjectRepository();
    const created = await repo.createCompany(data);
    await loadCompanies();
    setSelectedCompanyId(created.id);
    setClientName(created.contactPerson);
    setClientEmail(created.email || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) {
      toast.error('등록된 업체를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      toast.error('프로젝트명을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const repo = getProjectRepository();
      const created = await repo.createProject({
        companyId: selectedCompanyId,
        title: title.trim(),
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim() || undefined,
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        maxRevisionCount: Number(maxRevisionCount) || 3,
        maxSelectionCount: Number(maxSelectionCount) || 1,
        watermarkEnabled,
        downloadEnabled,
        worldcupEnabled,
      });

      toast.success('새 프로젝트가 성공적으로 생성되었습니다!');
      router.push(`/dashboard/projects/${created.id}`);
    } catch {
      toast.error('프로젝트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        대시보드로 돌아가기
      </Link>

      <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] p-6 sm:p-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            NEW PROJECT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
            새 디자인 프로젝트 등록
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            등록된 업체를 지정하고, 해당 업체에 소속된 디자인 프로젝트를 생성합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Registered Company */}
          <div className="space-y-4 bg-zinc-50 p-4 sm:p-5 rounded-2xl border border-zinc-200/90">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                소속 업체 선택 <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                새 업체 등록하기
              </button>
            </div>

            {isLoadingCompanies ? (
              <div className="text-xs text-zinc-400 py-2">업체 목록을 불러오는 중...</div>
            ) : companies.length === 0 ? (
              <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                등록된 업체가 없습니다. &apos;새 업체 등록하기&apos;를 먼저 진행해주세요.
              </div>
            ) : (
              <select
                value={selectedCompanyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-zinc-300 text-xs sm:text-sm font-semibold text-zinc-900 focus:outline-none focus:border-blue-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (담당: {c.contactPerson})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2: Project Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">
              프로젝트 기본 정보
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                프로젝트명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 2026 베이커리 브랜드 아이덴티티 리뉴얼"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  담당자 / 고객명
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  고객 이메일
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">프로젝트 설명</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="디자인 배경, 프로젝트 목표, 향후 생성할 디자인 항목(로고, 컵홀더 등)에 대한 안내를 기재합니다."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Step 3: Revision Policy */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-2">
              검토 및 수정 횟수 정책
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  검토 마감일
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  부여할 피드백 토큰 수 (개)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxRevisionCount}
                  onChange={(e) => setMaxRevisionCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="20"
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  고객이 피드백 1회 작성 시 토큰 1개씩 차감 (기본 20개)
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || companies.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  프로젝트 생성 후 디자인 항목 등록하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <CompanyFormModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={handleCreateCompany}
      />
    </main>
  );
}

export default function NewProjectPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">페이지를 준비 중입니다...</div>}>
        <NewProjectForm />
      </Suspense>
    </div>
  );
}
