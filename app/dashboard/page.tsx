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
import { compressImage } from '@/lib/utils/image-compression';
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
  MessageSquare,
  Star,
  User,
  LogOut,
  Copy,
  Check,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/auth/auth-service';
import { feedbackService } from '@/lib/feedback/feedback-service';
import { UserFeedback, UserProfile } from '@/types';
import { FeedbackModal } from '@/components/feedback/feedback-modal';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'projects' | 'companies' | 'studio' | 'feedback'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Studio Profile & Logo State (Moved from project settings / estimate page)
  const [studioProfile, setStudioProfile] = useState<StudioProfile | null>(null);
  const [studioName, setStudioName] = useState('');
  const [studioLogoUrl, setStudioLogoUrl] = useState('');
  const [studioLogoHeight, setStudioLogoHeight] = useState<number>(36);
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
  const [isRecovering, setIsRecovering] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      const loadedFeedbacks = feedbackService.getFeedbacks();
      setFeedbacks(loadedFeedbacks);

      const repo = getProjectRepository();
      // Auto recover local data if needed
      const rec = await repo.recoverLocalData();
      const activeUser = authService.getCurrentUser();
      if (activeUser) {
        setCurrentUser(activeUser);
      }
      const [projList, compList, profile] = await Promise.all([
        repo.getProjects(),
        repo.getCompanies(),
        repo.getStudioProfile(),
      ]);
      setProjects(projList);
      setCompanies(compList);
      setStudioProfile(profile);
      if (profile) {
        setStudioName(profile.studioName || (activeUser?.studioName || ''));
        setStudioLogoUrl(profile.logoUrl || '');
        setStudioLogoHeight(profile.logoHeight || 36);
        setStudioRepresentative(profile.representative || (activeUser?.name || ''));
        setStudioRegistrationNumber(profile.registrationNumber || '');
        setStudioContact(profile.contact || '');
        setStudioEmail(profile.email || (activeUser?.email || ''));
        setStudioAddress(profile.address || '');
        setStudioBankAccount(profile.bankAccount || '');
      }
    } catch {
      toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRecover = async () => {
    try {
      setIsRecovering(true);
      const repo = getProjectRepository();
      const res = await repo.recoverLocalData();
      await loadData();
      if (res.recoveredStudioName || res.recoveredProjectsCount > 0 || res.recoveredCompaniesCount > 0) {
        toast.success(
          `${res.recoveredStudioName ? `[${res.recoveredStudioName}] ` : ''}데이터 복구 완료 (프로젝트 ${res.recoveredProjectsCount}건, 업체 ${res.recoveredCompaniesCount}건 동기화)`
        );
      } else {
        toast.success('모든 데이터가 서버와 최신 상태로 동기화되었습니다.');
      }
    } catch {
      toast.error('동기화 처리 중 오류가 발생했습니다.');
    } finally {
      setIsRecovering(false);
    }
  };

  const handleToggleFeedbackStatus = (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'reviewed' ? 'new' : 'reviewed';
    feedbackService.updateStatus(id, nextStatus);
    setFeedbacks(feedbackService.getFeedbacks());
    toast.success(nextStatus === 'reviewed' ? '확인 완료 처리되었습니다.' : '신규 상태로 전환되었습니다.');
  };

  const handleDeleteFeedback = (id: string) => {
    feedbackService.deleteFeedback(id);
    setFeedbacks(feedbackService.getFeedbacks());
    toast.success('피드백이 삭제되었습니다.');
  };

  const handleCopyFeedbacksJson = () => {
    navigator.clipboard.writeText(JSON.stringify(feedbacks, null, 2));
    toast.success('전체 피드백 데이터가 클립보드에 JSON 형식으로 복사되었습니다.');
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
        logoHeight: studioLogoHeight,
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
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    try {
      const compressed = await compressImage(file, 800, 800, 0.85);
      setStudioLogoUrl(compressed);
      toast.success('로고 이미지가 등록되었습니다. 저장을 눌러 완료하세요.');
    } catch {
      toast.error('로고 이미지 처리 중 오류가 발생했습니다.');
    } finally {
      if (e.target) e.target.value = '';
    }
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                DESIGN STUDIO MANAGEMENT
              </span>
              {currentUser && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-sm">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span>{currentUser.studioName || currentUser.name} ({currentUser.email})</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
              디자이너 대시보드
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              업체를 등록하고, 등록된 업체 안에서 프로젝트와 디자인 항목을 관리하세요.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleManualRecover}
              disabled={isRecovering}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white text-zinc-700 text-xs sm:text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.035)] hover:bg-zinc-50 border border-zinc-200 transition-all disabled:opacity-50"
              title="브라우저 로컬에 저장된 이전 프로젝트 및 업체를 서버와 동기화"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${isRecovering ? 'animate-spin' : ''}`} />
              <span>데이터 복구/동기화</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white text-zinc-700 text-xs sm:text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.035)] hover:bg-zinc-50 border border-zinc-200 transition-all"
              title="사이트 개선 및 기능 요청 피드백 보내기"
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>피드백 남기기</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingCompany(null);
                setIsCompanyModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-zinc-800 text-xs sm:text-sm font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.035)] hover:bg-zinc-50 border border-zinc-200 transition-all"
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
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setViewMode('projects')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              viewMode === 'projects'
                ? 'bg-zinc-200 text-zinc-900 shadow-sm font-bold border border-zinc-300'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>프로젝트 목록 ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('companies')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              viewMode === 'companies'
                ? 'bg-zinc-200 text-zinc-900 shadow-sm font-bold border border-zinc-300'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>등록된 업체 관리 ({companies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('studio')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              viewMode === 'studio'
                ? 'bg-zinc-200 text-zinc-900 shadow-sm font-bold border border-zinc-300'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>스튜디오 및 공급자 설정</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('feedback')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              viewMode === 'feedback'
                ? 'bg-zinc-200 text-zinc-900 shadow-sm font-bold border border-zinc-300'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>수신 피드백함 ({feedbacks.length})</span>
          </button>
        </div>

        {/* Stats Metrics (Only on Projects and Companies view) */}
        {viewMode !== 'studio' && viewMode !== 'feedback' && <StatsCards projects={projects} />}

        {/* Search & Filter Bar (Only on Projects and Companies view) */}
        {viewMode !== 'studio' && viewMode !== 'feedback' && (
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
                        ? 'bg-zinc-200 text-zinc-900 shadow-sm font-bold border border-zinc-300'
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
                  <div
                    className="px-4 py-2 bg-white border border-zinc-200 flex items-center justify-center min-w-[200px] max-w-[280px] shrink-0 transition-all"
                    style={{ minHeight: `${Math.max(68, studioLogoHeight + 20)}px` }}
                  >
                    {studioLogoUrl ? (
                      <img
                        src={studioLogoUrl}
                        alt="스튜디오 로고"
                        style={{ height: `${studioLogoHeight}px`, maxHeight: `${studioLogoHeight}px` }}
                        className="max-w-[240px] object-contain transition-all"
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

                {/* Logo Size Control Slider & Presets */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <span>내 업체 로고 표시 크기 조절 (고객 공유 화면 상단 바)</span>
                      </label>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        설정하신 로고 크기에 맞춰 고객 화면 상단 바 배경 레이아웃의 높이도 자동으로 알맞게 확장됩니다.
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white border border-zinc-200 text-zinc-900 rounded">
                      {studioLogoHeight}px
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-zinc-400 font-mono">20px</span>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      step={2}
                      value={studioLogoHeight}
                      onChange={(e) => setStudioLogoHeight(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                    <span className="text-[11px] text-zinc-400 font-mono">100px</span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-zinc-400 mr-1">빠른 크기 선택:</span>
                    {[
                      { label: '소형 (28px)', size: 28 },
                      { label: '기본 (36px)', size: 36 },
                      { label: '중형 (48px)', size: 48 },
                      { label: '대형 (64px)', size: 64 },
                      { label: '특대 (80px)', size: 80 },
                    ].map((preset) => (
                      <button
                        key={preset.size}
                        type="button"
                        onClick={() => setStudioLogoHeight(preset.size)}
                        className={`text-xs px-2.5 py-1 transition-colors ${
                          studioLogoHeight === preset.size
                            ? 'bg-zinc-900 text-white font-bold'
                            : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
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

        {/* Feedback Inbox Panel */}
        {viewMode === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.035)] border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold block">
                  CUSTOMER FEEDBACK INBOX
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 mt-0.5">
                  디자이너 고객 피드백 수신함
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  사이트를 방문한 예비 고객 디자이너들이 남긴 기능 제안, 사용 후기, 버그 제보를 모아서 확인합니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyFeedbacksJson}
                  className="px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-600" />
                  <span>JSON 복사</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  <span>직접 피드백 추가</span>
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-zinc-100 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">TOTAL</span>
                <span className="text-xs font-semibold text-zinc-700">전체 접수 피드백</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">{feedbacks.length}건</p>
              </div>
              <div className="p-5 bg-white border border-zinc-100 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">RATING</span>
                <span className="text-xs font-semibold text-zinc-700">평균 만족도</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
                  {feedbacks.length > 0
                    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                    : '5.0'} / 5.0
                </p>
              </div>
              <div className="p-5 bg-white border border-zinc-100 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">FEATURE</span>
                <span className="text-xs font-semibold text-zinc-700">기능 제안</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
                  {feedbacks.filter((f) => f.category === 'feature').length}건
                </p>
              </div>
              <div className="p-5 bg-white border border-zinc-100 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest block">UNREVIEWED</span>
                <span className="text-xs font-semibold text-zinc-700">미확인 신규 피드백</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
                  {feedbacks.filter((f) => f.status === 'new').length}건
                </p>
              </div>
            </div>

            {/* Feedback List */}
            {feedbacks.length === 0 ? (
              <div className="p-16 text-center bg-white border border-zinc-100 shadow-sm space-y-3">
                <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="text-base font-bold text-zinc-800">아직 수신된 피드백이 없습니다</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  메인 화면과 대시보드 상단의 [피드백 남기기]를 통해 예비 고객 디자이너의 의견을 접수받을 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-6 bg-white border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-sm ${
                            fb.category === 'feature'
                              ? 'bg-blue-100 text-blue-800'
                              : fb.category === 'bug'
                              ? 'bg-rose-100 text-rose-800'
                              : fb.category === 'review'
                              ? 'bg-emerald-100 text-emerald-800'
                              : fb.category === 'improvement'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-zinc-100 text-zinc-800'
                          }`}
                        >
                          {fb.category === 'feature'
                            ? '기능 제안'
                            : fb.category === 'bug'
                            ? '버그 제보'
                            : fb.category === 'review'
                            ? '응원 및 후기'
                            : fb.category === 'improvement'
                            ? '사용성 개선'
                            : '기타 문의'}
                        </span>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= fb.rating
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'fill-zinc-100 text-zinc-200'
                              }`}
                            />
                          ))}
                        </div>

                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 ${
                            fb.status === 'reviewed'
                              ? 'bg-zinc-200 text-zinc-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {fb.status === 'reviewed' ? '확인 완료' : '신규 접수'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span>{new Date(fb.createdAt).toLocaleString('ko-KR')}</span>
                      </div>
                    </div>

                    {/* Author info */}
                    <div className="flex items-center gap-3 text-xs text-zinc-600 flex-wrap">
                      <div className="flex items-center gap-1 font-semibold text-zinc-900">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{fb.authorName}</span>
                        {fb.studioName && (
                          <span className="text-zinc-500 font-normal">({fb.studioName})</span>
                        )}
                      </div>

                      <a
                        href={`mailto:${fb.authorEmail}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline font-mono"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{fb.authorEmail}</span>
                      </a>
                    </div>

                    {/* Content */}
                    <p className="text-xs sm:text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed bg-zinc-50 p-4 border border-zinc-100">
                      {fb.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleToggleFeedbackStatus(fb.id, fb.status)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 transition-colors"
                      >
                        {fb.status === 'reviewed' ? '신규 상태로 전환' : '확인 완료 표시'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-rose-50 border border-zinc-200 text-rose-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setFeedbacks(feedbackService.getFeedbacks());
        }}
      />
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
