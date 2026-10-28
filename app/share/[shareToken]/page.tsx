'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Project, Concept, PinComment, Selection, DesignItem } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import { STUDIO_ATELIER_LOGO_SVG } from '@/lib/demo/sample-data';
import { ClientDesignItemView } from '@/components/concepts/client-design-item-view';
import { ImageViewerModal } from '@/components/shared/image-viewer-modal';
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { FinalApprovalModal } from '@/components/revisions/final-approval-modal';
import { VersionComparisonModal } from '@/components/shared/version-comparison-modal';
import { getProjectStatusLabel } from '@/lib/utils/format';
import {
  Layers,
  Trophy,
  Lock,
  FileText,
  Coins,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ClientSharePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state by design item
  const [selectedItemFilter, setSelectedItemFilter] = useState<string>('all');

  // Viewer Modal State (scoped to the clicked design item concepts)
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerConcepts, setViewerConcepts] = useState<Concept[]>([]);
  const [viewerInitialIdx, setViewerInitialIdx] = useState(0);

  // Modals state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [comparisonConcept, setComparisonConcept] = useState<Concept | null>(null);

  // Cancel Selection Confirmation State
  const [cancelTarget, setCancelTarget] = useState<{
    item: DesignItem;
    concept: Concept;
    hasAdminChecked: boolean;
    uncheckedCount: number;
  } | null>(null);

  const [studioLogo, setStudioLogo] = useState<string | null>(null);
  const [studioLogoHeight, setStudioLogoHeight] = useState<number>(36);

  // Load project
  const loadProject = async () => {
    try {
      setIsLoading(true);
      const repo = getProjectRepository();
      const [proj, profile] = await Promise.all([
        repo.getProjectByShareToken(shareToken),
        repo.getStudioProfile(),
      ]);

      if (!proj) {
        setError('유효하지 않거나 만료된 공유 링크입니다.');
        return;
      }
      setProject(proj);
      setStudioLogo(profile?.logoUrl || proj.companyLogoUrl || STUDIO_ATELIER_LOGO_SVG);
      setStudioLogoHeight(profile?.logoHeight || proj.companyLogoHeight || 36);
    } catch {
      setError('프로젝트 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [shareToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
        <div className="text-center space-y-3 p-8 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)]">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            시안 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA] px-4">
        <div className="max-w-md w-full bg-white p-8 shadow-[0_12px_45px_rgba(0,0,0,0.04)] text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">접근할 수 없는 링크입니다</h2>
          <p className="text-xs text-zinc-500">{error || '프로젝트를 찾을 수 없습니다.'}</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-zinc-900 text-white text-xs font-medium shadow-sm hover:bg-zinc-800 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const designItems = project.designItems || [];
  const concepts = (project.concepts || []).filter((c) => c.isPublic);
  const comments = project.comments || [];
  const selections = project.selections || [];
  const statusInfo = getProjectStatusLabel(project.status);
  const defaultTokens = (designItems.length || 1) * 5;
  const tokensTotal = project.feedbackTokensTotal ?? defaultTokens;
  const tokensUsed = project.feedbackTokensUsed ?? (comments.filter((c) => c.authorType === 'client').length || 0);
  const remainingTokens = Math.max(0, tokensTotal - tokensUsed);
  const isApproved = project.status === 'approved';
  const isProjectWorldcupEnabled = project.worldcupEnabled === true;

  // Selection for a concept (invoked from detail view)
  const handleToggleSelect = async (conceptId: string) => {
    try {
      const repo = getProjectRepository();
      const c = concepts.find((x) => x.id === conceptId);
      await repo.updateSelection(project.id, conceptId, 'candidate', undefined, c?.itemId);
      await loadProject();
    } catch {
      toast.error('시안 선택 중 오류가 발생했습니다.');
    }
  };

  // Open detail viewer scoped to an item's concepts
  const handleOpenViewer = (itemConcepts: Concept[], initialIndex: number) => {
    setViewerConcepts(itemConcepts);
    setViewerInitialIdx(initialIndex);
    setIsViewerOpen(true);
  };

  // Trigger Cancel Selection confirmation
  const handleRequestCancelSelection = (item: DesignItem, candidateConcept: Concept) => {
    const itemConceptIds = concepts.filter((c) => c.itemId === item.id).map((c) => c.id);
    const itemFeedbacks = comments.filter(
      (c) =>
        (c.itemId === item.id || itemConceptIds.includes(c.conceptId)) &&
        c.authorType === 'client'
    );
    const hasAdminChecked = itemFeedbacks.some((c) => c.status === 'resolved');
    const uncheckedCount = itemFeedbacks.filter((c) => c.status !== 'resolved').length;

    setCancelTarget({
      item,
      concept: candidateConcept,
      hasAdminChecked,
      uncheckedCount,
    });
  };

  // Confirm Cancel Selection with Token Recovery Logic
  const handleConfirmCancelSelection = async () => {
    if (!cancelTarget || !project) return;
    try {
      const repo = getProjectRepository();
      const res = await repo.cancelItemSelection(project.id, cancelTarget.item.id);
      await loadProject();

      if (res.refundedTokens > 0) {
        toast.success(
          `시안 선택이 취소되었습니다. 미확인 피드백 ${res.refundedTokens}건이 취소되고 피드백 토큰 ${res.refundedTokens}개가 자동 복구되었습니다.`
        );
      } else if (res.hasAdminChecked) {
        toast.info('시안 선택이 취소되었습니다. (확인 완료된 피드백이 있어 토큰은 유지됩니다.)');
      } else {
        toast.success('시안 선택이 취소되었습니다. 전체 시안 목록으로 원상복구되었습니다.');
      }
    } catch {
      toast.error('선택 취소 처리 중 오류가 발생했습니다.');
    } finally {
      setCancelTarget(null);
    }
  };

  // Add Comment (Inline Feedback)
  const handleAddComment = async (data: {
    conceptId: string;
    content: string;
    positionX?: number;
    positionY?: number;
    authorName: string;
    authorType: 'designer' | 'client';
  }) => {
    const repo = getProjectRepository();
    const c = concepts.find((x) => x.id === data.conceptId);
    await repo.addComment({
      projectId: project.id,
      conceptId: data.conceptId,
      itemId: c?.itemId,
      authorName: data.authorName,
      authorType: data.authorType,
      content: data.content,
      positionX: data.positionX,
      positionY: data.positionY,
      status: 'open',
    });
    await loadProject();
  };

  // Final Project Sign-off Approval
  const handleConfirmFinalApprove = async () => {
    const repo = getProjectRepository();
    await repo.approveFinalProject(project.id);
    await loadProject();
  };

  const displayedItems = selectedItemFilter === 'all'
    ? designItems
    : designItems.filter((item) => item.id === selectedItemFilter);

  const selectedItemsCount = selections.length;

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="min-h-screen flex flex-col bg-[#FBFBFA] pb-24 select-none">
      {/* Client Header */}
      <header
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.03)] border-b border-zinc-100 transition-all"
        style={{ minHeight: `${Math.max(64, studioLogoHeight + 20)}px` }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 sm:py-2.5 transition-all"
          style={{ minHeight: `${Math.max(64, studioLogoHeight + 20)}px` }}
        >
          {/* Design Studio Company Logo Slot (시안 제공 디자인 업체 로고) */}
          <div className="flex items-center transition-all" style={{ height: `${studioLogoHeight}px` }}>
            {(studioLogo || project.companyLogoUrl) ? (
              <div className="max-w-[280px] flex items-center transition-all" style={{ height: `${studioLogoHeight}px` }}>
                <img
                  src={studioLogo || project.companyLogoUrl}
                  alt="디자인 업체 로고"
                  className="w-auto object-contain transition-all"
                  style={{ height: `${studioLogoHeight}px`, maxHeight: `${studioLogoHeight}px` }}
                />
              </div>
            ) : (
              <div className="h-8 px-3.5 bg-zinc-50 border border-dashed border-zinc-200 text-xs font-semibold text-zinc-400 flex items-center justify-center tracking-wider">
                디자인 업체 로고 미등록
              </div>
            )}
          </div>

          {/* Right Status Badge only (견적서확인, 최종후보요약 버튼 삭제됨) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-800 shadow-sm">
              {statusInfo.label}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
        {/* Project Client Greeting & Revision Meter Banner */}
        <div className="bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)] p-6 sm:p-9 border border-zinc-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {project.companyName && (
                  <span className="text-[11.3px] font-semibold text-white bg-black px-2.5 py-0.5 rounded-md shadow-sm">
                    {project.companyName}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            {/* 피드백 토큰 잔여표시는 최종후보 상단에 알맞게 배치 */}
            <div className="flex-shrink-0 flex flex-col items-stretch sm:items-end gap-2.5 w-full sm:w-auto">
              {/* Token Counter positioned directly above Final Candidate button */}
              <div className="bg-zinc-50/90 border border-zinc-200/80 px-4 py-2 flex items-center justify-between sm:justify-end gap-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Coins className="w-3.5 h-3.5 text-zinc-800" />
                  <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                    피드백 잔여 토큰
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xl font-bold text-zinc-900">{remainingTokens}</span>
                  <span className="text-xs text-zinc-400">/ {tokensTotal}개</span>
                </div>
              </div>

              {/* Action Buttons: Estimate & Final Candidates */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/share/${shareToken}/estimate`}
                  className="w-1/2 sm:w-auto px-4 py-3 bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-xs tracking-wide shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-zinc-200/80 transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-600" />
                  <span>견적서 확인</span>
                </Link>

                <Link
                  href={`/share/${shareToken}/summary`}
                  className="w-1/2 sm:w-auto px-5 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold text-xs tracking-wide shadow-sm border border-zinc-300/80 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>선택시안 ({selectedItemsCount}/{designItems.length})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Design Item Filter Tabs */}
        {designItems.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedItemFilter('all')}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedItemFilter === 'all'
                  ? 'bg-zinc-200 text-zinc-900 font-bold border border-zinc-300 shadow-sm'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-[0_2px_8px_rgba(0,0,0,0.025)] border border-zinc-200/60'
              }`}
            >
              <span>전체 시안 ({concepts.length})</span>
            </button>

            {designItems.map((item) => {
              const count = concepts.filter((c) => c.itemId === item.id).length;
              const hasCandidate = selections.some((s) => s.itemId === item.id);
              const isCurrent = selectedItemFilter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemFilter(item.id)}
                  className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-zinc-200 text-zinc-900 font-bold border border-zinc-300 shadow-sm'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 shadow-[0_2px_8px_rgba(0,0,0,0.025)] border border-zinc-200/60'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 ${isCurrent ? 'bg-zinc-300 text-zinc-900 font-bold' : 'bg-zinc-100 text-zinc-600'}`}>
                    {count}
                  </span>
                  {hasCandidate && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="후보 선택 완료" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Section: Design Items Presentation */}
        <div className="space-y-20 sm:space-y-12">
          {displayedItems.map((item, itemIdx) => (
            <ClientDesignItemView
              key={item.id}
              item={item}
              itemIndex={itemIdx}
              concepts={concepts}
              selections={selections}
              comments={comments}
              remainingTokens={remainingTokens}
              tokensTotal={tokensTotal}
              canRunWorldcup={isProjectWorldcupEnabled && item.worldcupEnabled === true}
              shareToken={shareToken}
              onOpenViewer={handleOpenViewer}
              onRequestCancelSelection={handleRequestCancelSelection}
              onAddComment={handleAddComment}
            />
          ))}
        </div>

        {/* Section: Action Banner */}
        {!isApproved && (
          <div className="bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)] p-6 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-100">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-zinc-900">
                시안 검토 및 피드백 작성을 완료하셨나요?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500">
                항목별로 선택하신 대표 시안들을 모아서 한눈에 확인하거나 프로젝트 최종 승인을 진행할 수 있습니다.
              </p>
            </div>

            {/* 최하단 견적서 확인 및 잔여토큰 버튼 삭제, 선택시안 버튼만 유지 */}
            <div className="flex items-center justify-center sm:justify-end w-full md:w-auto">
              <Link
                href={`/share/${shareToken}/summary`}
                className="w-full sm:w-auto px-7 py-3.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold text-xs tracking-wide shadow-sm border border-zinc-300/80 transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>선택시안</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Floating Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 p-3.5 sm:hidden flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 font-mono">
            잔여 토큰 <strong>{remainingTokens}개</strong>
          </span>
          <span className="text-xs font-bold text-zinc-900">
            {selectedItemsCount > 0 ? `${selectedItemsCount}개 시안 선택됨` : '시안 미선택'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/share/${shareToken}/summary`}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-bold border border-zinc-300 text-xs shadow-sm"
          >
            선택시안
          </Link>
        </div>
      </div>

      {/* Concept Detail Viewer Modal (Detail view with mobile slide and selection) */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        concepts={viewerConcepts}
        initialConceptIndex={viewerInitialIdx}
        selections={selections}
        onToggleSelect={handleToggleSelect}
        isClientView={true}
      />

      {/* Confirmation Modal for Selection Cancellation with Token Recovery Logic */}
      {cancelTarget && (
        <ConfirmationModal
          isOpen={Boolean(cancelTarget)}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancelSelection}
          title={
            cancelTarget.hasAdminChecked
              ? '시안 선택 취소 안내 (토큰 복구 불가)'
              : cancelTarget.uncheckedCount > 0
              ? '시안 선택 취소 및 토큰 자동 복구'
              : '시안 선택 취소'
          }
          description={
            cancelTarget.hasAdminChecked
              ? `[${cancelTarget.item.name}]에 등록된 피드백 중 디자이너(관리자)가 이미 확인 완료한 피드백이 있어 피드백 토큰은 복구되지 않습니다.\n\n정말 시안 선택을 취소하고 다시 전체 시안 목록으로 원상복구하시겠습니까?`
              : cancelTarget.uncheckedCount > 0
              ? `[${cancelTarget.item.name}]에 등록하신 피드백 ${cancelTarget.uncheckedCount}건은 아직 디자이너가 확인하지 않은 상태이므로 자동 취소되며, 사용된 피드백 토큰 ${cancelTarget.uncheckedCount}개가 즉시 자동 복구됩니다.\n\n정말 시안 선택을 취소하시겠습니까?`
              : `[${cancelTarget.item.name}]의 시안 선택을 취소하고 전체 시안 목록으로 원상복구하시겠습니까?`
          }
          confirmText={
            cancelTarget.hasAdminChecked
              ? '선택 취소 진행'
              : cancelTarget.uncheckedCount > 0
              ? `선택 취소 (${cancelTarget.uncheckedCount}개 토큰 복구)`
              : '선택 취소'
          }
          cancelText="돌아가기"
          isDestructive={cancelTarget.hasAdminChecked}
        />
      )}

      {/* Final Project Sign-off Approval Modal */}
      <FinalApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        selectedConcept={concepts.find((c) => selections.some((s) => s.conceptId === c.id)) || null}
        onConfirmApprove={handleConfirmFinalApprove}
      />

      {/* Version Comparison Modal */}
      {comparisonConcept && (
        <VersionComparisonModal
          isOpen={Boolean(comparisonConcept)}
          onClose={() => setComparisonConcept(null)}
          concept={comparisonConcept}
        />
      )}
    </div>
  );
}
