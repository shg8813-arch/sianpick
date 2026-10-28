'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectCard } from '@/components/dashboard/project-card';
import { CompanyFormModal } from '@/components/dashboard/company-form-modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { Project, Company, StudioProfile } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import { STUDIO_ATELIER_LOGO_SVG } from '@/lib/demo/sample-data';
import {
  Plus,
  Search,
  Building2,
  FolderGit2,
  Mail,
  Phone,
  Edit,
  Trash2,
  Settings,
  UploadCloud,
  Save,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'projects' | 'companies' | 'studio'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Studio Profile & Logo State (Moved from project settings / estimate page)
  const [studioProfile, setStudioProfile] = useState<StudioProfile | null>(null);
  const [studioName, setStudioName] = useState('');
  const [studioLogoUrl, setStudioLogoUrl] = useState('');
  const [studioRepresentative, setStudioRepresentative] = useState('');
  const [studioRegistrationNumber, setStudioRegistrationNumber] = useState('');
  const [studioContact, setStudioContact] = useState('');
  const [studioEmail, setStudioEmail] = useState('');
  const [studioAddress, setStudioAddress] = useState('');
  const [studioBankAccount, setStudioBankAccount] = useState('');
  const [isSavingStudio, setIsSavingStudio] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Modals state
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const repo = getProjectRepository();
      const [projList, compList, profile] = await Promise.all([
        repo.getProjects(),
        repo.getCompanies(),
        repo.getStudioProfile(),
      ]);
      setProjects(projList);
      setCompanies(compList);
      setStudioProfile(profile);
      if (profile) {
        setStudioName(profile.studioName || '');
        setStudioLogoUrl(profile.logoUrl || '');
        setStudioRepresentative(profile.representative || '');
        setStudioRegistrationNumber(profile.registrationNumber || '');
        setStudioContact(profile.contact || '');
        setStudioEmail(profile.email || '');
        setStudioAddress(profile.address || '');
        setStudioBankAccount(profile.bankAccount || '');
      }
    } catch {
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'studio') {
        setViewMode('studio');
      }
    }
    loadData();
  }, []);

  // Save Studio Profile & Logo
  const handleSaveStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioName.trim()) {
      toast.error('스튜디오/상호명을 입력해주세요.');
      return;
    }
    try {
      setIsSavingStudio(true);
      const repo = getProjectRepository();
      const updated = await repo.updateStudioProfile({
        studioName: studioName.trim(),
        logoUrl: studioLogoUrl.trim() || undefined,
        representative: studioRepresentative.trim(),
        registrationNumber: studioRegistrationNumber.trim() || undefined,
        contact: studioContact.trim() || undefined,
        email: studioEmail.trim() || undefined,
        address: studioAddress.trim() || undefined,
        bankAccount: studioBankAccount.trim() || undefined,
      });
      setStudioProfile(updated);
      await loadData();
      toast.success('스튜디오 로고 및 견적 공급자 정보가 저장되었습니다.');
    } catch {
      toast.error('스튜디오 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingStudio(false);
    }
  };

  // Logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setStudioLogoUrl(event.target.result as string);
        toast.success('로고 이미지가 등록되었습니다. 저장을 눌러 완료하세요.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save company (Create or update)
  const handleSaveCompany = async (companyData: any) => {
    const repo = getProjectRepository();
    if (editingCompany) {
      await repo.updateCompany(editingCompany.id, companyData);
    } else {
      await repo.createCompany(companyData);
    }
    await loadData();
    setEditingCompany(null);
  };

  // Delete project
  const handleDeleteProjectConfirm = async () => {
    if (!deletingProjectId) return;
    try {
      const repo = getProjectRepository();
      await repo.deleteProject(deletingProjectId);
      toast.success('프로젝트가 삭제되었습니다.');
      await loadData();
    } catch {
      toast.error('프로젝트 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Delete company
  const handleDeleteCompanyConfirm = async () => {
    if (!deletingCompanyId) return;
    try {
      const repo = getProjectRepository();
      await repo.deleteCompany(deletingCompanyId);
      toast.success('업체가 삭제되었습니다.');
      await loadData();
    } catch {
      toast.error('업체 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingCompanyId(null);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.companyName && p.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter companies
  const filteredCompanies = companies.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              DESIGN STUDIO MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
              디자이너 대시보드
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              업체를 등록하고, 등록된 업체 안에서 프로젝트와 디자인 항목을 관리하세요.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setEditingCompany(null);
                setIsCompanyModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-zinc-800 text-xs sm:text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.035)] hover:bg-zinc-50 transition-all"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              새 업체 등록
            </button>

            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all"
            >
              <Plus className="w-4 h-4" />
              새 프로젝트 생성
            </Link>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
          <button
            type="button"
            onClick={() => setViewMode('projects')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'projects'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>프로젝트 목록 ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('companies')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'companies'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>등록된 업체 관리 ({companies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('studio')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'studio'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>스튜디오 및 공급자 설정</span>
          </button>
        </div>

        {/* Stats Metrics (Only on Projects and Companies view) */}
        {viewMode !== 'studio' && <StatsCards projects={projects} />}

        {/* Search & Filter Bar (Only on Projects and Companies view) */}
        {viewMode !== 'studio' && (
          <div className="bg-white p-4 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  viewMode === 'projects'
                    ? '프로젝트명, 업체명, 고객명 검색...'
                    : '업체명 또는 담당자명 검색...'
                }
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-zinc-50/80 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {viewMode === 'projects' && (
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'draft', label: '초안' },
                  { id: 'in_review', label: '검토 중' },
                  { id: 'revising', label: '수정 중' },
                  { id: 'approved', label: '승인 완료' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedStatus(tab.id)}
                    className={`px-3 py-1.5 font-medium transition-all ${
                      selectedStatus === tab.id
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950 bg-zinc-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content View */}
        {isLoading ? (
          <div className="text-center py-20 text-xs text-zinc-400">
            데이터를 불러오는 중...
          </div>
        ) : viewMode === 'projects' ? (
          <div>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8 space-y-3">
                <p className="text-sm font-medium text-zinc-600">해당 조건의 프로젝트가 없습니다.</p>
                <Link
                  href="/dashboard/projects/new"
                  className="inline-block px-4 py-2 bg-zinc-900 text-white text-xs font-semibold shadow-sm"
                >
                  새 프로젝트 생성하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={(id) => setDeletingProjectId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : viewMode === 'companies' ? (
          <div>
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8 space-y-3">
                <p className="text-sm font-medium text-zinc-600">등록된 업체가 없습니다.</p>
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(true)}
                  className="inline-block px-4 py-2 bg-zinc-900 text-white text-xs font-semibold shadow-sm"
                >
                  첫 업체 등록하기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => {
                  const companyProjects = projects.filter((p) => p.companyId === company.id);

                  return (
                    <div
                      key={company.id}
                      className="bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.065)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 shadow-sm">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                                {company.name}
                              </h3>
                              <span className="text-[11px] text-zinc-400">
                                {company.contactPerson || '담당자 미지정'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-zinc-400">
                            <button
                              onClick={() => {
                                setEditingCompany(company);
                                setIsCompanyModalOpen(true);
                              }}
                              className="p-1 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                              title="업체 정보 수정"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingCompanyId(company.id)}
                              className="p-1 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="업체 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {company.memo && (
                          <p className="text-xs text-zinc-500 mb-4 line-clamp-2 leading-relaxed">
                            {company.memo}
                          </p>
                        )}

                        <div className="space-y-1.5 text-xs text-zinc-500 border-t border-zinc-100 pt-3">
                          {company.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{company.email}</span>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{company.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-100">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-zinc-500">진행 프로젝트</span>
                            <span className="font-bold text-zinc-900">
                              {companyProjects.length}개
                            </span>
                          </div>

                          {companyProjects.length > 0 ? (
                            <div className="space-y-1.5">
                              {companyProjects.map((cp) => (
                                <Link
                                  key={cp.id}
                                  href={`/dashboard/projects/${cp.id}`}
                                  className="block p-2 bg-zinc-50 text-xs font-medium text-zinc-700 truncate hover:bg-zinc-100 transition-colors"
                                >
                                  {cp.title}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-zinc-400">등록된 프로젝트가 없습니다.</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-zinc-100">
                        <Link
                          href={`/dashboard/projects/new?companyId=${company.id}`}
                          className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>이 업체로 새 프로젝트 생성</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Studio & Provider Settings View */
          <div className="bg-white p-6 sm:p-10 shadow-[0_12px_45px_rgba(0,0,0,0.035)] max-w-4xl mx-auto space-y-8">
            <div className="space-y-1 pb-4 border-b border-zinc-100">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400 uppercase block">
                STUDIO &amp; ESTIMATE PROVIDER SETTINGS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                디자인 스튜디오 로고 및 견적 공급자 정보 설정
              </h2>
              <p className="text-xs text-zinc-500">
                시안을 제공하는 디자인 업체의 공식 로고와 견적서에 자동 적용되는 공급자 기본 정보를 통합 관리합니다.
              </p>
            </div>

            <form onSubmit={handleSaveStudio} className="space-y-8">
              {/* Section 1: Logo Image */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    디자인 업체 공식 로고 (고객 공유 페이지 최상단 바 표시)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    등록 시 모든 고객 공유 페이지의 최상단 바에 시안을 제공하는 디자인 업체의 공식 로고로 자동 노출됩니다.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-zinc-50 border border-zinc-200">
                  <div className="h-16 px-4 bg-white border border-zinc-200 flex items-center justify-center min-w-[200px] shrink-0">
                    {studioLogoUrl ? (
                      <img
                        src={studioLogoUrl}
                        alt="스튜디오 로고"
                        className="h-9 max-w-[180px] object-contain"
                      />
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">로고 미등록</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                        <span>로고 이미지 파일 업로드</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStudioLogoUrl(STUDIO_ATELIER_LOGO_SVG);
                          toast.success('스튜디오 아틀리에 기본 로고가 적용되었습니다.');
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 transition-colors"
                      >
                        기본 프리셋 로고
                      </button>
                      {studioLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setStudioLogoUrl('')}
                          className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                        >
                          로고 삭제
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={studioLogoUrl}
                      onChange={(e) => setStudioLogoUrl(e.target.value)}
                      placeholder="로고 이미지 주소 직접 입력 (URL 또는 data:image/...)"
                      className="w-full px-3.5 py-2 text-xs border border-zinc-200 bg-white focus:outline-none focus:border-zinc-800"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Provider Information for Estimates */}
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    견적서 공급자 정보 (스튜디오 기본 정보)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    이곳에 입력하신 공급자 정보는 프로젝트별 견적서 작성 시 기본 공급자 내역으로 자동 연동됩니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      스튜디오 / 상호명 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="예: 스튜디오 아틀리에 (STUDIO ATELIER)"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      대표자 성명 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studioRepresentative}
                      onChange={(e) => setStudioRepresentative(e.target.value)}
                      placeholder="예: 이시안"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      사업자등록번호
                    </label>
                    <input
                      type="text"
                      value={studioRegistrationNumber}
                      onChange={(e) => setStudioRegistrationNumber(e.target.value)}
                      placeholder="예: 214-88-12345"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      스튜디오 연락처
                    </label>
                    <input
                      type="text"
                      value={studioContact}
                      onChange={(e) => setStudioContact(e.target.value)}
                      placeholder="예: 02-543-9801"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      대표 이메일
                    </label>
                    <input
                      type="email"
                      value={studioEmail}
                      onChange={(e) => setStudioEmail(e.target.value)}
                      placeholder="예: contact@studio-atelier.kr"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      사업장 소재지 (주소)
                    </label>
                    <input
                      type="text"
                      value={studioAddress}
                      onChange={(e) => setStudioAddress(e.target.value)}
                      placeholder="예: 서울특별시 용산구 한남대로 20길 14, 3층"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      입금 계좌번호
                    </label>
                    <input
                      type="text"
                      value={studioBankAccount}
                      onChange={(e) => setStudioBankAccount(e.target.value)}
                      placeholder="예: 기업은행 010-5439-8012 (예금주: 스튜디오 아틀리에)"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSavingStudio}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSavingStudio ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>스튜디오 정보 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Modals */}
      <CompanyFormModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleSaveCompany}
        initialData={editingCompany}
      />

      <ConfirmationModal
        isOpen={Boolean(deletingProjectId)}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleDeleteProjectConfirm}
        title="프로젝트 삭제"
        description="이 프로젝트를 삭제하시겠습니까? 등록된 모든 시안과 피드백 데이터가 함께 삭제됩니다."
      />

      <ConfirmationModal
        isOpen={Boolean(deletingCompanyId)}
        onClose={() => setDeletingCompanyId(null)}
        onConfirm={handleDeleteCompanyConfirm}
        title="업체 삭제"
        description="이 업체를 삭제하시겠습니까? 연결된 프로젝트 정보에 영향을 줄 수 있습니다."
      />
    </div>
  );
}
