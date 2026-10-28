'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { ConceptCard } from '@/components/concepts/concept-card';
import { ConceptFormModal } from '@/components/concepts/concept-form-modal';
import { ImageViewerModal } from '@/components/shared/image-viewer-modal';
import { VersionComparisonModal } from '@/components/shared/version-comparison-modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { Project, Concept, PinComment, RevisionStatus, ProjectStatus, DesignItem } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import {
  formatDateKR,
  formatDateTimeKR,
  getProjectStatusLabel,
  getRevisionStatusLabel,
} from '@/lib/utils/format';
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Plus,
  Layers,
  MessageSquare,
  RefreshCw,
  GitBranch,
  Activity,
  Settings as SettingsIcon,
  CheckCircle2,
  Calendar,
  User,
  Sparkles,
  Trophy,
  Upload,
  Check,
  Clock,
  Trash2,
  Tag,
  Building2,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  FileText,
  Coins,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProjectEstimateEditor } from '@/components/projects/project-estimate-editor';

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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'concepts' | 'estimate' | 'comments' | 'revisions' | 'versions' | 'activity' | 'settings'
  >('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Design Item Reorder Drag-and-Drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  // Design Item Creation state (직접 작성, 자동화 버튼 금지)
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemWorldcup, setNewItemWorldcup] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Modals
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [targetItemIdForConcept, setTargetItemIdForConcept] = useState<string | undefined>(undefined);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerConceptIdx, setViewerConceptIdx] = useState(0);
  const [comparisonConcept, setComparisonConcept] = useState<Concept | null>(null);
  const [deletingConceptId, setDeletingConceptId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // New version modal for concept (수정 및 최종 시안 업로드)
  const [versionTargetConcept, setVersionTargetConcept] = useState<Concept | null>(null);
  const [newVersionSummary, setNewVersionSummary] = useState('');
  const [newVersionImageUrl, setNewVersionImageUrl] = useState('');
  const [isFinalVersionUpload, setIsFinalVersionUpload] = useState(false);
  const [isConfirmingSelections, setIsConfirmingSelections] = useState(false);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const repo = getProjectRepository();
      const data = await repo.getProjectById(projectId);
      if (!data) {
        toast.error('프로젝트를 찾을 수 없습니다.');
        router.push('/dashboard');
        return;
      }
      setProject(data);
    } catch {
      toast.error('프로젝트 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
          프로젝트 정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  const designItems = project.designItems || [];
  const concepts = project.concepts || [];
  const comments = project.comments || [];
  const revisions = project.revisionRequests || [];
  const selections = project.selections || [];
  const logs = project.activityLogs || [];

  const isAllItemsSelected =
    designItems.length > 0 &&
    designItems.every((item) => selections.some((s) => s.itemId === item.id));
  const isSelectionConfirmed = Boolean(
    project.selectionConfirmedByAdmin || project.revisionPhaseActive
  );

  const statusInfo = getProjectStatusLabel(project.status);
  const remainingRevisions = Math.max(0, project.maxRevisionCount - project.usedRevisionCount);

  // Copy client share link
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${project.shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('고객 전용 공유 링크가 복사되었습니다.');
  };

  // Add Design Item (직접 입력 생성)
  const handleAddDesignItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast.error('디자인 항목명을 직접 입력해주세요.');
      return;
    }

    try {
      setIsAddingItem(true);
      const repo = getProjectRepository();
      await repo.addDesignItem(project.id, {
        name: newItemName.trim(),
        description: newItemDesc.trim() || undefined,
        worldcupEnabled: newItemWorldcup,
      });
      toast.success(`디자인 항목 "${newItemName.trim()}"이 생성되었습니다.`);
      setNewItemName('');
      setNewItemDesc('');
      setNewItemWorldcup(false);
      await loadProject();
    } catch {
      toast.error('디자인 항목 생성 중 오류가 발생했습니다.');
    } finally {
      setIsAddingItem(false);
    }
  };

  // Toggle Worldcup for a Design Item
  const handleToggleItemWorldcup = async (item: DesignItem) => {
    try {
      const repo = getProjectRepository();
      const updatedStatus = item.worldcupEnabled === false ? true : false;
      await repo.updateDesignItem(project.id, item.id, {
        worldcupEnabled: updatedStatus,
      });
      toast.success(`[${item.name}] 월드컵 기능이 ${updatedStatus ? '활성화' : '비활성화'}되었습니다.`);
      await loadProject();
    } catch {
      toast.error('항목 설정 변경 중 오류가 발생했습니다.');
    }
  };

  // Delete Design Item
  const handleDeleteItemConfirm = async () => {
    if (!deletingItemId) return;
    try {
      const repo = getProjectRepository();
      await repo.deleteDesignItem(project.id, deletingItemId);
      toast.success('디자인 항목이 삭제되었습니다.');
      await loadProject();
    } catch {
      toast.error('디자인 항목 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingItemId(null);
    }
  };

  // Add / Edit Concept handler
  const handleSaveConcept = async (conceptData: any) => {
    const repo = getProjectRepository();
    if (editingConcept) {
      await repo.updateConcept(project.id, editingConcept.id, conceptData);
    } else {
      await repo.addConcept(project.id, conceptData);
    }
    await loadProject();
    setEditingConcept(null);
    setTargetItemIdForConcept(undefined);
  };

  // Reorder Design Items via Drag and Drop
  const handleDropItem = async (targetItemId: string) => {
    if (!draggedItemId || draggedItemId === targetItemId || !project?.designItems) return;
    const currentItems = [...project.designItems];
    const fromIndex = currentItems.findIndex((it) => it.id === draggedItemId);
    const toIndex = currentItems.findIndex((it) => it.id === targetItemId);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = currentItems.splice(fromIndex, 1);
    currentItems.splice(toIndex, 0, moved);

    const newIds = currentItems.map((it) => it.id);
    setProject({
      ...project,
      designItems: currentItems.map((it, idx) => ({ ...it, displayOrder: idx + 1 })),
    });
    setDraggedItemId(null);
    setDragOverItemId(null);

    try {
      const repo = getProjectRepository();
      await repo.reorderDesignItems(project.id, newIds);
      toast.success('디자인 항목 순서가 성공적으로 변경되었습니다.');
      await loadProject();
    } catch {
      toast.error('디자인 항목 순서 변경 중 오류가 발생했습니다.');
    }
  };

  // Delete Concept
  const handleDeleteConcept = async () => {
    if (!deletingConceptId) return;
    const repo = getProjectRepository();
    await repo.deleteConcept(project.id, deletingConceptId);
    toast.success('시안이 삭제되었습니다.');
    await loadProject();
    setDeletingConceptId(null);
  };

  // Change Project Status
  const handleChangeProjectStatus = async (newStatus: ProjectStatus) => {
    const repo = getProjectRepository();
    await repo.updateProject(project.id, { status: newStatus });
    toast.success('프로젝트 상태가 변경되었습니다.');
    await loadProject();
  };

  // Add Feedback Tokens
  const handleAddTokens = async (amount = 5) => {
    try {
      const repo = getProjectRepository();
      const newTotal = await repo.addFeedbackTokens(project.id, amount);
      setProject({ ...project, feedbackTokensTotal: newTotal });
      toast.success(`피드백 토큰이 ${amount}개 추가되었습니다. (총 ${newTotal}개)`);
      await loadProject();
    } catch {
      toast.error('토큰 추가 중 오류가 발생했습니다.');
    }
  };

  // Add Revision Count
  const handleAddRevisions = async (amount = 3) => {
    try {
      const repo = getProjectRepository();
      const newMax = await repo.addRevisionCount(project.id, amount);
      setProject({ ...project, maxRevisionCount: newMax });
      toast.success(`수정 횟수가 ${amount}회 추가되었습니다. (총 ${newMax}회)`);
      await loadProject();
    } catch {
      toast.error('수정 횟수 추가 중 오류가 발생했습니다.');
    }
  };

  // Toggle feedback comment status (Admin check button)
  const handleToggleFeedbackStatus = async (commentId: string, currentStatus: 'open' | 'resolved') => {
    try {
      const nextStatus = currentStatus === 'resolved' ? 'open' : 'resolved';
      const repo = getProjectRepository();
      await repo.updateCommentStatus(project.id, commentId, nextStatus);
      toast.success(nextStatus === 'resolved' ? '피드백을 확인 완료 처리했습니다.' : '피드백을 미확인 상태로 변경했습니다.');
      await loadProject();
    } catch {
      toast.error('상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 고객 시안 선택 확인 및 수정/최종 시안 업로드 활성화 처리
  const handleConfirmSelections = async () => {
    if (!project) return;
    try {
      setIsConfirmingSelections(true);
      const repo = getProjectRepository();
      await repo.updateProject(project.id, {
        selectionConfirmedByAdmin: true,
        revisionPhaseActive: true,
        status: 'revising',
      });
      await repo.logActivity(
        project.id,
        'revision_status_change',
        '관리자가 고객의 전체 시안 선택을 확인하고 수정 및 최종 시안 업로드를 활성화했습니다.'
      );
      toast.success('고객 시안 선택이 확인되었습니다. 각 항목별 수정 및 최종 시안 업로드가 활성화되었습니다.');
      await loadProject();
    } catch {
      toast.error('시안 선택 확인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsConfirmingSelections(false);
    }
  };

  // Submit new concept version (수정 시안 또는 최종 시안 등록)
  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionTargetConcept || !newVersionImageUrl) return;

    try {
      const repo = getProjectRepository();
      await repo.addConceptVersion(project.id, versionTargetConcept.id, {
        imageUrl: newVersionImageUrl,
        changeSummary:
          newVersionSummary ||
          (isFinalVersionUpload ? '최종 확정 시안 납품본' : `v${(versionTargetConcept.versions?.length || 1) + 1} 수정본`),
        isFinal: isFinalVersionUpload,
      });

      if (isFinalVersionUpload) {
        toast.success(`"${versionTargetConcept.title}"의 최종 확정 시안이 등록되었습니다.`);
      } else {
        toast.success(`"${versionTargetConcept.title}"의 새 수정본이 등록되었습니다.`);
      }

      setVersionTargetConcept(null);
      setNewVersionSummary('');
      setNewVersionImageUrl('');
      setIsFinalVersionUpload(false);
      await loadProject();
    } catch {
      toast.error('새 버전 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Breadcrumb back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="w-4 h-4" />
          대시보드로 돌아가기
        </Link>

        {/* Project Header Banner */}
        <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 ${statusInfo.bg} ${statusInfo.color} shadow-sm`}
                >
                  {statusInfo.label}
                </span>

                {project.companyName && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-800 shadow-sm">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    {project.companyName}
                  </span>
                )}

                <select
                  value={project.status}
                  onChange={(e) => handleChangeProjectStatus(e.target.value as ProjectStatus)}
                  className="text-xs bg-zinc-50 border border-zinc-200 px-2 py-1 font-semibold text-zinc-700"
                >
                  <option value="draft">초안 작성</option>
                  <option value="in_review">고객 검토 중</option>
                  <option value="revising">수정 진행 중</option>
                  <option value="approved">최종 승인 완료</option>
                </select>

                <div className="flex items-center gap-1 text-xs text-zinc-500 ml-2">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>담당: <strong>{project.clientName}</strong></span>
                </div>

                <div className="flex items-center gap-1 text-xs text-zinc-500 ml-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>마감: <strong>{formatDateKR(project.dueDate)}</strong></span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                {project.title}
              </h1>

              {project.description && (
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('estimate')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-700" />
                견적서 관리
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                공유 링크 복사
              </button>

              <Link
                href={`/share/${project.shareToken}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                고객 화면 미리보기
              </Link>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 text-xs">
            <div className="p-3 bg-zinc-50/80">
              <span className="text-zinc-500">디자인 항목 &amp; 시안</span>
              <p className="text-lg font-bold text-zinc-900 mt-0.5">
                {designItems.length}항목 / {concepts.length}시안
              </p>
            </div>

            <div className="p-3 bg-zinc-50/80">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">피드백 토큰 (항목당 5개)</span>
                <button
                  type="button"
                  onClick={() => handleAddTokens(5)}
                  className="text-[10px] px-1.5 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded shadow-sm transition-colors"
                  title="관리자 권한으로 피드백 토큰 5개 추가"
                >
                  +5개 추가
                </button>
              </div>
              <p className="text-lg font-bold text-zinc-900 mt-0.5 font-mono">
                잔여 {Math.max(0, (project.feedbackTokensTotal ?? (designItems.length * 5 || 15)) - (project.feedbackTokensUsed ?? 0))} / {project.feedbackTokensTotal ?? (designItems.length * 5 || 15)}개
              </p>
            </div>

            <div className="p-3 bg-zinc-50/80">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">수정 허용 횟수 (항목당 3회)</span>
                <button
                  type="button"
                  onClick={() => handleAddRevisions(3)}
                  className="text-[10px] px-1.5 py-0.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold rounded shadow-sm transition-colors"
                  title="관리자 권한으로 수정 횟수 3회 추가"
                >
                  +3회 추가
                </button>
              </div>
              <p className="text-lg font-bold text-zinc-900 mt-0.5 font-mono">
                총 {project.maxRevisionCount ?? (designItems.length * 3 || 9)}회 허용
              </p>
            </div>

            <div className="p-3 bg-zinc-50/80">
              <span className="text-zinc-500">고객 선택 후보</span>
              <p className="text-lg font-bold text-zinc-900 mt-0.5">{selections.length}개</p>
            </div>
          </div>
        </div>

        {/* Banner: Client Selections Ready for Confirmation */}
        {isAllItemsSelected && !isSelectionConfirmed && (
          <div className="bg-zinc-900 text-white p-6 sm:p-7 rounded-2xl shadow-lg border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  모든 시안 선택 완료됨
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  전체 {designItems.length}개 디자인 항목 매칭 완료
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                고객의 시안 선택이 모두 완료되었습니다. 확인 후 수정 및 최종 시안 업로드를 시작하세요.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                확인 버튼을 누르면 프로젝트 상태가 수정 단계로 전환되며 각 항목별 수정 및 최종 확정 시안(FINAL) 업로드 기능이 활성화됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirmSelections}
              disabled={isConfirmingSelections}
              className="px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>고객 시안 선택 확인 (수정 및 최종 시안 단계로 전환)</span>
            </button>
          </div>
        )}

        {/* Banner: Revision / Final Phase Active */}
        {isSelectionConfirmed && (
          <div className="bg-blue-900/90 text-white p-4 sm:p-5 rounded-2xl border border-blue-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  수정 및 최종 시안 업로드 단계 활성화됨
                </h4>
                <p className="text-xs text-blue-200">
                  각 디자인 항목의 선택된 대표 시안에 대해 차수별 수정 시안 및 최종 확정 시안(FINAL)을 업로드할 수 있습니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('concepts')}
              className="px-4 py-2 bg-white text-blue-950 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors shrink-0"
            >
              항목별 시안 업로드 바로가기
            </button>
          </div>
        )}

        {/* Navigation Tabs (수정요청 탭은 피드백으로 대체되어 삭제됨) */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-zinc-100 pb-2">
          {[
            { id: 'overview', label: '개요', icon: Sparkles },
            { id: 'concepts', label: `디자인 항목 & 시안 (${designItems.length}항목 / ${concepts.length}시안)`, icon: Layers },
            { id: 'estimate', label: '견적서 관리', icon: FileText },
            { id: 'comments', label: `고객 피드백 (${comments.length})`, icon: MessageSquare },
            { id: 'versions', label: '버전 기록', icon: GitBranch },
            { id: 'activity', label: `고객 활동 (${logs.length})`, icon: Activity },
            { id: 'settings', label: '설정', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Design Items summary */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-900">디자인 항목별 시안 구성</h3>
                  <button
                    onClick={() => setActiveTab('concepts')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    항목 및 시안 관리 바로가기
                  </button>
                </div>

                <div className="space-y-4">
                  {designItems.map((item) => {
                    const itemConcepts = concepts.filter((c) => c.itemId === item.id);
                    return (
                      <div key={item.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-900">{item.name}</span>
                            <span className="text-xs text-zinc-400">({itemConcepts.length}개 시안)</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.worldcupEnabled !== false
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-zinc-200 text-zinc-600'
                              }`}
                            >
                              {item.worldcupEnabled !== false ? '월드컵 활성' : '월드컵 미사용'}
                            </span>
                          </div>
                          {item.description && (
                            <span className="text-xs text-zinc-500">{item.description}</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {itemConcepts.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => {
                                const idx = concepts.findIndex((x) => x.id === c.id);
                                setViewerConceptIdx(idx >= 0 ? idx : 0);
                                setIsViewerOpen(true);
                              }}
                              className="group cursor-pointer bg-white rounded-xl p-2 border border-zinc-200 hover:border-blue-500 transition-colors shadow-sm"
                            >
                              <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center mb-1 bg-zinc-100">
                                <img
                                  src={c.thumbnailUrl}
                                  alt={c.title}
                                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <h5 className="text-[11px] font-bold text-zinc-900 line-clamp-1">{c.title}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Latest Revisions */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-900">수정 요청 내역</h3>
                  <button
                    onClick={() => setActiveTab('revisions')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    수정 요청 관리 바로가기
                  </button>
                </div>

                {revisions.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-6 text-center">
                    아직 접수된 수정 요청이 없습니다.
                  </p>
                ) : (
                  revisions.map((rev) => {
                    const revStatus = getRevisionStatusLabel(rev.status);
                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900">
                            제{rev.revisionNumber}차 수정 요청서
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${revStatus.bg} ${revStatus.color}`}
                          >
                            {revStatus.label}
                          </span>
                        </div>
                        <p className="text-zinc-600 whitespace-pre-line leading-relaxed">
                          {rev.content}
                        </p>
                        <span className="text-[11px] text-zinc-400 block">
                          제출일: {formatDateTimeKR(rev.submittedAt)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right sidebar: Client selections & Actions */}
            <div className="space-y-6">
              {/* Selections box */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-zinc-900 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  고객의 항목별 최종 선택 시안
                </h3>

                {selections.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-4 text-center">
                    고객이 아직 시안을 선택하지 않았습니다.
                  </p>
                ) : (
                  selections.map((sel) => {
                    const selConcept = concepts.find((c) => c.id === sel.conceptId);
                    const selItem = designItems.find((d) => d.id === sel.itemId);

                    return (
                      <div
                        key={sel.id}
                        className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs flex items-center gap-3"
                      >
                        {selConcept && (
                          <img
                            src={selConcept.thumbnailUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-contain bg-white border border-blue-200"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-1">
                            {selItem && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">
                                {selItem.name}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-blue-700 uppercase">
                              {sel.selectionType === 'worldcup_winner'
                                ? '월드컵 우승'
                                : sel.selectionType === 'final'
                                ? '최종 확정'
                                : '선호 후보'}
                            </span>
                          </div>
                          <h4 className="font-bold text-zinc-900 mt-0.5">
                            {selConcept?.title || '선택 시안'}
                          </h4>
                          {sel.reason && <p className="text-zinc-600 text-[11px] mt-0.5">{sel.reason}</p>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Revision & Token limit booster */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-zinc-900">토큰 및 수정 횟수 관리</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  디자인 항목별 기본 부여(항목당 5토큰, 3회 수정) 외에 추가 부여가 필요한 경우 사용합니다.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddTokens(5)}
                    className="py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-blue-700 transition-colors"
                  >
                    피드백 토큰 +5개
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddRevisions(3)}
                    className="py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors"
                  >
                    수정 횟수 +3회
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DESIGN ITEMS & CONCEPTS */}
        {activeTab === 'concepts' && (
          <div className="space-y-8">
            {/* Create Design Item Form (직접 작성, 별도 자동화버튼 생성 금지, 월드컵 선택 옵션 포함) */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  새 디자인 항목 직접 생성
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  프로젝트에서 진행할 구체적인 디자인 품목(예: 메뉴판, 컵홀더, 로고, 간판 등)을 직접
                  입력하여 생성하세요. 시안 월드컵 진행 여부도 항목별로 선택할 수 있습니다.
                </p>
              </div>

              <form onSubmit={handleAddDesignItem} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="디자인 항목명 직접 입력 (예: 로고, 컵홀더, 메뉴판, 패키지 등)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      placeholder="항목 설명 (선택: 규격, 인쇄 방식 등)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={newItemWorldcup}
                      onChange={(e) => setNewItemWorldcup(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300"
                    />
                    <span>이 디자인 항목에 시안 월드컵 비교 기능 활성화</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isAddingItem || !newItemName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    항목 생성
                  </button>
                </div>
              </form>
            </div>

            {/* Design Items and their Concepts */}
            <div className="space-y-8">
              {designItems.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                    <GripVertical className="w-4 h-4 text-zinc-400" />
                    <span>디자인 항목 카드를 드래그앤드롭하여 순서를 자유롭게 변경할 수 있습니다.</span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    총 {designItems.length}개 항목
                  </span>
                </div>
              )}

              {designItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8 space-y-3">
                  <Tag className="w-10 h-10 text-zinc-300 mx-auto" />
                  <h4 className="font-bold text-zinc-800 text-base">등록된 디자인 항목이 없습니다</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    위 입력창에 디자인 항목명을 직접 입력하여 생성해주세요.
                  </p>
                </div>
              ) : (
                designItems.map((item, index) => {
                  const itemConcepts = concepts.filter((c) => c.itemId === item.id);
                  const itemFeedbacks = comments
                    .filter(
                      (c) =>
                        c.itemId === item.id ||
                        (!c.itemId && itemConcepts.some((ic) => ic.id === c.conceptId))
                    )
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                  const isWorldcupOn = item.worldcupEnabled !== false;
                  const isBeingDragged = draggedItemId === item.id;
                  const isOver = dragOverItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                        setDraggedItemId(item.id);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverItemId !== item.id) setDragOverItemId(item.id);
                      }}
                      onDragLeave={() => {
                        if (dragOverItemId === item.id) setDragOverItemId(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropItem(item.id);
                      }}
                      onDragEnd={() => {
                        setDraggedItemId(null);
                        setDragOverItemId(null);
                      }}
                      className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 transition-all duration-200 ${
                        isBeingDragged ? 'opacity-40 scale-[0.98]' : 'opacity-100'
                      } ${
                        isOver
                          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/10'
                          : 'border-zinc-200/90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Drag handle */}
                          <div
                            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-700 cursor-grab active:cursor-grabbing hover:bg-zinc-100 rounded-lg transition-colors shrink-0"
                            title="클릭 후 드래그하여 순서 변경"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-zinc-400">
                                0{index + 1}
                              </span>
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                디자인 항목
                              </span>
                              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                                {item.name}
                              </h3>
                              <span className="text-xs text-zinc-400 font-semibold">
                                ({itemConcepts.length}개 시안)
                              </span>

                              {/* World Cup Toggle Pill */}
                              <button
                                type="button"
                                onClick={() => handleToggleItemWorldcup(item)}
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors flex items-center gap-1 ${
                                  isWorldcupOn
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                }`}
                                title="클릭하여 월드컵 기능 켜기/끄기"
                              >
                                <Trophy className="w-3 h-3 text-amber-600" />
                                <span>{isWorldcupOn ? '월드컵 활성' : '월드컵 꺼짐'}</span>
                              </button>
                            </div>
                            {item.description && (
                              <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetItemIdForConcept(item.id);
                              setEditingConcept(null);
                              setIsConceptModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            이 항목에 시안 추가
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingItemId(item.id)}
                            className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="항목 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item-level Revision & Final Concept Action Bar */}
                      {(() => {
                        const itemSelection = selections.find((s) => s.itemId === item.id);
                        const selectedConcept = itemSelection
                          ? concepts.find((c) => c.id === itemSelection.conceptId)
                          : null;

                        if (isSelectionConfirmed) {
                          if (selectedConcept) {
                            return (
                              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={selectedConcept.thumbnailUrl}
                                    alt=""
                                    className="w-12 h-12 rounded-xl object-contain bg-white border border-blue-200 shrink-0"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                                        선택된 대표 시안
                                      </span>
                                      <span className="text-xs font-bold text-zinc-900">
                                        0{selectedConcept.displayOrder || 1}
                                      </span>
                                      <span className="text-xs text-blue-800 font-mono">
                                        ({selectedConcept.versions?.length || 1}차 버전)
                                      </span>
                                    </div>
                                    <p className="text-xs text-zinc-600 mt-0.5">
                                      이 대표 시안에 대해 차수별 수정 시안을 업로드하거나 최종 확정 시안(FINAL)을 업로드하세요.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVersionTargetConcept(selectedConcept);
                                      setNewVersionImageUrl(selectedConcept.thumbnailUrl);
                                      setIsFinalVersionUpload(false);
                                      setNewVersionSummary(`제${(selectedConcept.versions?.length || 1) + 1}차 수정 시안`);
                                    }}
                                    className="flex-1 md:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                  >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>수정 시안 업로드</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVersionTargetConcept(selectedConcept);
                                      setNewVersionImageUrl(selectedConcept.thumbnailUrl);
                                      setIsFinalVersionUpload(true);
                                      setNewVersionSummary('최종 확정 시안 납품본');
                                    }}
                                    className="flex-1 md:flex-initial px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span>최종 시안 업로드</span>
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>고객이 아직 이 항목의 대표 시안을 선택하지 않았습니다.</span>
                            </div>
                          );
                        }

                        return (
                          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              {isAllItemsSelected
                                ? '고객이 모든 시안을 선택했습니다. 상단의 [고객 시안 선택 확인] 버튼을 누르면 항목별 수정 및 최종 시안 업로드가 활성화됩니다.'
                                : '고객의 전체 시안 선택 완료 및 관리자 확인 후 항목별 수정 및 최종 시안 업로드가 활성화됩니다.'}
                            </span>
                            {isAllItemsSelected && (
                              <button
                                type="button"
                                onClick={handleConfirmSelections}
                                disabled={isConfirmingSelections}
                                className="px-3 py-1 bg-zinc-900 text-white font-bold text-xs rounded-lg hover:bg-zinc-800 shrink-0 transition-colors"
                              >
                                선택 확인 및 활성화
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      {/* Concepts Grid for this item */}
                      {itemConcepts.length === 0 ? (
                        <div className="text-center py-8 text-zinc-400 text-xs">
                          이 항목에 등록된 시안이 없습니다. 위의 &apos;시안 추가&apos; 버튼을 눌러 시안을 등록하세요.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {itemConcepts.map((concept) => {
                            const isConceptSelected = selections.some(
                              (s) => s.itemId === item.id && s.conceptId === concept.id
                            );

                            return (
                              <div key={concept.id} className="flex flex-col gap-2">
                                <ConceptCard
                                  concept={concept}
                                  commentCount={comments.filter((c) => c.conceptId === concept.id).length}
                                  selection={selections.find((s) => s.conceptId === concept.id)}
                                  isAdmin
                                  onOpenViewer={() => {
                                    const idx = concepts.findIndex((x) => x.id === concept.id);
                                    setViewerConceptIdx(idx >= 0 ? idx : 0);
                                    setIsViewerOpen(true);
                                  }}
                                  onOpenComparison={() => setComparisonConcept(concept)}
                                  onEdit={() => {
                                    setEditingConcept(concept);
                                    setIsConceptModalOpen(true);
                                  }}
                                  onDelete={() => setDeletingConceptId(concept.id)}
                                />

                                {isSelectionConfirmed && isConceptSelected ? (
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVersionTargetConcept(concept);
                                        setNewVersionImageUrl(concept.thumbnailUrl);
                                        setIsFinalVersionUpload(false);
                                        setNewVersionSummary(`제${(concept.versions?.length || 1) + 1}차 수정 시안`);
                                      }}
                                      className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                      수정 시안
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVersionTargetConcept(concept);
                                        setNewVersionImageUrl(concept.thumbnailUrl);
                                        setIsFinalVersionUpload(true);
                                        setNewVersionSummary('최종 확정 시안 납품본');
                                      }}
                                      className="py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                    >
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                      최종 시안
                                    </button>
                                  </div>
                                ) : (
                                  <div className="py-2 px-3 bg-zinc-50 rounded-xl text-[11px] text-zinc-400 text-center border border-zinc-100">
                                    {isConceptSelected
                                      ? '시안 선택 확인 후 업로드 활성화'
                                      : '대표 시안 선택 대기'}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {/* Customer Feedback Section for this Design Item */}
                      <div className="mt-8 pt-6 border-t border-zinc-100 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded">
                              고객 피드백 기록
                            </span>
                            <span className="text-xs text-zinc-500 font-mono">
                              ({itemFeedbacks.length}건 접수)
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400">
                            체크 버튼을 눌러 확인 여부를 표시할 수 있습니다.
                          </span>
                        </div>

                        {itemFeedbacks.length === 0 ? (
                          <div className="py-6 px-4 bg-zinc-50/50 rounded-2xl text-center text-xs text-zinc-400 border border-zinc-100">
                            이 항목에 접수된 고객 피드백이 아직 없습니다.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {itemFeedbacks.map((fb, fIdx) => {
                              const isResolved = fb.status === 'resolved';
                              const targetConcept = concepts.find((c) => c.id === fb.conceptId);

                              return (
                                <div
                                  key={fb.id}
                                  className={`p-4 rounded-2xl border transition-all ${
                                    isResolved
                                      ? 'bg-zinc-50/60 border-zinc-200/60 opacity-80'
                                      : 'bg-white border-zinc-200 shadow-sm'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                                        #{fIdx + 1}
                                      </span>
                                      {targetConcept && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                          {targetConcept.title}
                                        </span>
                                      )}
                                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                                        <Clock className="w-3 h-3 text-zinc-300" />
                                        <span>{formatDateTimeKR(fb.createdAt)}</span>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleFeedbackStatus(fb.id, fb.status)}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        isResolved
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                          : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{isResolved ? '디자이너 확인 완료' : '피드백 확인 체크'}</span>
                                    </button>
                                  </div>

                                  <p className="text-xs sm:text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed pl-1">
                                    {fb.content}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB: ESTIMATE (견적서 관리) */}
        {activeTab === 'estimate' && (
          <ProjectEstimateEditor
            projectId={project.id}
            shareToken={project.shareToken}
            initialEstimate={project.estimate}
            projectTitle={project.title}
            companyName={project.companyName}
            clientName={project.clientName}
            clientEmail={project.clientEmail}
            onSaved={(savedEstimate) => {
              setProject({
                ...project,
                estimate: savedEstimate,
              });
            }}
          />
        )}

        {/* TAB 3: COMMENTS */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">고객 피드백 &amp; 핀 코멘트</h2>
              <p className="text-xs text-zinc-500 mt-1">
                시안 이미지 위 지정된 핀 코멘트와 피드백 목록입니다. 해결된 항목은 상태를 변경하세요.
              </p>
            </div>

            {comments.length === 0 ? (
              <p className="text-xs text-zinc-400 py-12 text-center">
                아직 등록된 코멘트가 없습니다.
              </p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {comments.map((comment) => {
                  const targetConcept = concepts.find((c) => c.id === comment.conceptId);
                  const isResolved = comment.status === 'resolved';

                  return (
                    <div
                      key={comment.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-900">
                            {comment.authorName}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            ({comment.authorType === 'client' ? '고객' : '디자이너'})
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                            {targetConcept?.title || '시안'}
                          </span>
                          {typeof comment.positionX === 'number' && (
                            <span className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-mono">
                              핀 좌표 ({comment.positionX.toFixed(0)}%, {comment.positionY?.toFixed(0)}%)
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                        <span className="text-[11px] text-zinc-400 block">
                          작성일시: {formatDateTimeKR(comment.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFeedbackStatus(comment.id, comment.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            isResolved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isResolved ? '디자이너 확인 완료' : '피드백 확인 체크'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VERSIONS */}
        {activeTab === 'versions' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">시안별 버전 이력 관리</h2>
              <p className="text-xs text-zinc-500 mt-1">
                각 시안의 v1(초안)부터 최신 수정본까지 히스토리를 확인하고 버전을 비교합니다.
              </p>
            </div>

            <div className="space-y-6">
              {concepts.map((concept) => {
                const vList = concept.versions || [];
                return (
                  <div
                    key={concept.id}
                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-zinc-900">{concept.title}</h3>
                      {vList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setComparisonConcept(concept)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-indigo-700 hover:bg-zinc-50 transition-colors"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          버전 좌우 비교
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {vList.map((ver) => (
                        <div
                          key={ver.id}
                          className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs font-bold mb-2">
                              <span className="text-blue-600">v{ver.versionNumber}</span>
                              <span className="text-zinc-400 font-normal">
                                {formatDateKR(ver.createdAt)}
                              </span>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-50 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                              <img
                                src={ver.imageUrl}
                                alt={`v${ver.versionNumber}`}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-600 line-clamp-2">
                            {ver.changeSummary || '수정본'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY LOGS */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">고객 활동 타임라인</h2>
              <p className="text-xs text-zinc-500 mt-1">
                고객이 공유 링크에 접속하여 시안을 열람, 선택, 월드컵 진행, 코멘트 등을 수행한 활동
                기록입니다.
              </p>
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-zinc-400 py-12 text-center">
                기록된 활동 로그가 없습니다.
              </p>
            ) : (
              <div className="relative pl-6 border-l-2 border-zinc-200 space-y-6 ml-2">
                {logs.map((log) => (
                  <div key={log.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-400">
                          {formatDateTimeKR(log.createdAt)}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 uppercase">
                          {log.activityType}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">프로젝트 설정</h2>
              <p className="text-xs text-zinc-500 mt-1">
                프로젝트 기본 정보 및 정책을 변경할 수 있습니다.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-800 block">
                    디자인 업체 로고 및 견적 공급자 정보
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    스튜디오 로고와 견적서 공급자 정보는 관리자 대시보드 메인에서 통합 관리됩니다.
                  </p>
                </div>
                <Link
                  href="/dashboard?tab=studio"
                  className="px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 transition-colors shrink-0 shadow-sm"
                >
                  대시보드에서 설정
                </Link>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">프로젝트명</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">최대 수정 횟수</label>
                <input
                  type="number"
                  value={project.maxRevisionCount}
                  onChange={(e) =>
                    setProject({ ...project, maxRevisionCount: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">검토 마감일</label>
                <input
                  type="date"
                  value={project.dueDate || ''}
                  onChange={(e) => setProject({ ...project, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={project.worldcupEnabled !== false}
                    onChange={(e) => setProject({ ...project, worldcupEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300"
                  />
                  <span className="text-xs font-semibold text-zinc-700">
                    프로젝트 전체 시안 월드컵 기능 허용 (개별 항목 활성화 필요)
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const repo = getProjectRepository();
                  await repo.updateProject(project.id, {
                    title: project.title,
                    companyLogoUrl: project.companyLogoUrl,
                    maxRevisionCount: project.maxRevisionCount,
                    dueDate: project.dueDate,
                    worldcupEnabled: project.worldcupEnabled,
                  });
                  toast.success('설정이 저장되었습니다.');
                }}
                className="px-5 py-2.5 bg-zinc-900 text-white font-bold rounded-xl text-xs hover:bg-zinc-800 transition-colors"
              >
                설정 변경 사항 저장
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Concept Creation / Edit Modal */}
      <ConceptFormModal
        isOpen={isConceptModalOpen}
        onClose={() => {
          setIsConceptModalOpen(false);
          setEditingConcept(null);
          setTargetItemIdForConcept(undefined);
        }}
        designItems={designItems}
        preselectedItemId={targetItemIdForConcept}
        onSubmit={handleSaveConcept}
        initialData={editingConcept}
      />

      {/* Concept Detail & Pin Comments Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        concepts={concepts}
        initialConceptIndex={viewerConceptIdx}
        comments={comments}
        selections={selections}
        isClientView={false}
        onToggleSelect={async (conceptId) => {
          const repo = getProjectRepository();
          const c = concepts.find((x) => x.id === conceptId);
          await repo.updateSelection(project.id, conceptId, 'candidate', undefined, c?.itemId);
          await loadProject();
        }}
        onAddComment={async (commentData) => {
          const repo = getProjectRepository();
          await repo.addComment({
            projectId: project.id,
            conceptId: commentData.conceptId,
            authorName: commentData.authorName,
            authorType: commentData.authorType,
            content: commentData.content,
            positionX: commentData.positionX,
            positionY: commentData.positionY,
            status: 'open',
          });
          await loadProject();
        }}
        onResolveComment={async (commentId) => {
          const repo = getProjectRepository();
          await repo.updateCommentStatus(project.id, commentId, 'resolved');
          await loadProject();
        }}
      />

      {/* Version Comparison Modal */}
      {comparisonConcept && (
        <VersionComparisonModal
          isOpen={Boolean(comparisonConcept)}
          onClose={() => setComparisonConcept(null)}
          concept={comparisonConcept}
        />
      )}

      {/* Delete Concept Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingConceptId)}
        onClose={() => setDeletingConceptId(null)}
        onConfirm={handleDeleteConcept}
        title="시안 삭제"
        description="정말로 이 시안을 삭제하시겠습니까? 연결된 버전 및 코멘트가 함께 삭제됩니다."
        confirmText="삭제하기"
        isDestructive
      />

      {/* Delete Design Item Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingItemId)}
        onClose={() => setDeletingItemId(null)}
        onConfirm={handleDeleteItemConfirm}
        title="디자인 항목 삭제"
        description="이 디자인 항목을 삭제하시겠습니까? 해당 항목에 등록된 시안들도 함께 삭제됩니다."
        confirmText="삭제하기"
        isDestructive
      />

      {/* Add New Version Dialog (수정 시안 또는 최종 시안 업로드) */}
      {versionTargetConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {isFinalVersionUpload ? 'FINAL CONCEPT' : 'REVISION CONCEPT'}
                </span>
                <h3 className="font-bold text-base text-zinc-900 mt-0.5">
                  &quot;{versionTargetConcept.title}&quot; {isFinalVersionUpload ? '최종 시안 업로드' : '수정 시안 업로드'}
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  isFinalVersionUpload ? 'bg-zinc-900 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isFinalVersionUpload ? '최종 확정본' : `v${(versionTargetConcept.versions?.length || 1) + 1} 수정본`}
              </span>
            </div>

            {/* Mode switch buttons */}
            <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsFinalVersionUpload(false);
                  if (newVersionSummary === '최종 확정 시안 납품본') {
                    setNewVersionSummary(`제${(versionTargetConcept.versions?.length || 1) + 1}차 수정 시안`);
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  !isFinalVersionUpload
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                수정 시안 (차수별 수정본)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFinalVersionUpload(true);
                  if (!newVersionSummary || newVersionSummary.includes('차 수정')) {
                    setNewVersionSummary('최종 확정 시안 납품본');
                  }
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  isFinalVersionUpload
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                최종 시안 (FINAL 확정)
              </button>
            </div>

            <form onSubmit={handleAddVersion} className="space-y-4">
              {/* File upload or direct URL */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  시안 이미지 첨부 (파일 선택 또는 이미지 주소 입력)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setNewVersionImageUrl(ev.target.result as string);
                          toast.success('시안 이미지를 성공적으로 불러왔습니다.');
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full text-xs text-zinc-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-800 hover:file:bg-zinc-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={newVersionImageUrl}
                    onChange={(e) => setNewVersionImageUrl(e.target.value)}
                    placeholder="data:image/... 또는 https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 font-mono"
                  />
                </div>
              </div>

              {/* Preview if image available */}
              {newVersionImageUrl && (
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-center max-h-48 overflow-hidden">
                  <img
                    src={newVersionImageUrl}
                    alt="미리보기"
                    className="max-h-40 object-contain"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  {isFinalVersionUpload ? '최종 시안 전달 사항' : '수정 반영 요약 내용'}
                </label>
                <textarea
                  rows={2}
                  value={newVersionSummary}
                  onChange={(e) => setNewVersionSummary(e.target.value)}
                  placeholder={
                    isFinalVersionUpload
                      ? '예: 최종 확정안 인쇄 규격 및 컬러값 적용 완료'
                      : '예: 고객 요청에 따라 자간 및 심볼 곡률 보정'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => {
                    setVersionTargetConcept(null);
                    setIsFinalVersionUpload(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-xl text-xs font-bold shadow-sm transition-colors ${
                    isFinalVersionUpload
                      ? 'bg-zinc-900 hover:bg-zinc-800'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isFinalVersionUpload ? '최종 시안 등록하기' : '수정 시안 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
