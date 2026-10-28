'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { FinalApprovalModal } from '@/components/revisions/final-approval-modal';
import { ImageViewerModal } from '@/components/shared/image-viewer-modal';
import { Project, Concept, DesignItem, Selection } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import { formatDateKR, getProjectStatusLabel } from '@/lib/utils/format';
import {
  Trophy,
  ArrowLeft,
  CheckCircle2,
  Send,
  Sparkles,
  Layers,
  Check,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ClientSummaryPage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFinalApprovalModalOpen, setIsFinalApprovalModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerConceptIdx, setViewerConceptIdx] = useState(0);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const repo = getProjectRepository();
      const data = await repo.getProjectByShareToken(shareToken);
      if (!data) {
        toast.error('프로젝트 정보를 찾을 수 없습니다.');
        return;
      }
      setProject(data);
    } catch {
      toast.error('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [shareToken]);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA] text-zinc-500 text-xs">
        <div className="p-8 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          요약 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  const designItems = project.designItems || [];
  const concepts = project.concepts || [];
  const selections = project.selections || [];
  const comments = project.comments || [];
  const remainingRevisions = Math.max(0, project.maxRevisionCount - project.usedRevisionCount);
  const isApproved = project.status === 'approved';

  // Group candidate concept per design item
  const itemCandidatePairs = designItems.map((item) => {
    const sel = selections.find((s) => s.itemId === item.id);
    const chosenConcept = sel ? concepts.find((c) => c.id === sel.conceptId) : null;
    return {
      item,
      selection: sel,
      concept: chosenConcept,
    };
  });

  const selectedCount = itemCandidatePairs.filter((p) => p.concept !== null && p.concept !== undefined).length;
  const isAllSelected = designItems.length > 0 && selectedCount === designItems.length;

  // Final approval
  const handleConfirmFinalApprove = async () => {
    const repo = getProjectRepository();
    await repo.approveFinalProject(project.id);
    await loadProject();
  };

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="min-h-screen flex flex-col bg-[#FBFBFA] pb-24 select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href={`/share/${shareToken}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 px-3 py-1.5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>시안 검토 목록으로 돌아가기</span>
          </Link>

          <Link
            href={`/share/${shareToken}/estimate`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-800 hover:text-zinc-950 px-3 py-1.5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all"
          >
            <span>견적서 확인</span>
          </Link>
        </div>

        {/* Banner */}
        <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11.3px] font-semibold text-white bg-black px-2.5 py-0.5 rounded-md shadow-sm">
                  {project.companyName || '고객사'}
                </span>
                <span className="text-xs text-zinc-500 font-normal">
                  {project.clientName} 고객님께서 선택하신 대표 시안들입니다.
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                디자인 항목별 선택시안
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
                각 디자인 항목(로고, 컵홀더, 메뉴판 등)에서 선택하신 대표 시안들을 확인하고,
                최종 확정 승인을 진행하세요.
              </p>
            </div>

            {/* Selection Status meter */}
            <div className="flex-shrink-0 bg-zinc-50/80 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  SELECTION STATUS
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-zinc-900">
                    {selectedCount} / {designItems.length}개 항목
                  </span>
                  <span className={`text-xs font-semibold ${isAllSelected ? 'text-emerald-700' : 'text-blue-700'}`}>
                    ({isAllSelected ? '전체 항목 선택 완료' : '일부 미선택'})
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-1">
                  남은 수정 횟수: <strong>{remainingRevisions}회</strong>
                </span>
              </div>

              {!isApproved && (
                <button
                  type="button"
                  onClick={() => setIsFinalApprovalModalOpen(true)}
                  disabled={selectedCount === 0}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-[0_4px_14px_rgba(16,185,129,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>선택 시안들 최종 승인</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Candidates Grid by Design Item */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">
              디자인 항목별 선택시안 리스트 ({designItems.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {itemCandidatePairs.map(({ item, selection, concept }) => {
              const isSelected = Boolean(concept);

              return (
                <div
                  key={item.id}
                  className={`bg-white flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'shadow-[0_12px_45px_rgba(0,0,0,0.045)]'
                      : 'shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-zinc-50/50'
                  }`}
                >
                  {/* Item Header */}
                  <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white">
                    <div>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        DESIGN ITEM
                      </span>
                      <h3 className="text-lg font-bold text-zinc-900 mt-0.5">{item.name}</h3>
                    </div>

                    {isSelected ? (
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 flex items-center gap-1 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        선택 완료
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 bg-zinc-100 text-zinc-500">
                        미선택
                      </span>
                    )}
                  </div>

                  {/* Body Image & Details */}
                  {concept ? (
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Concept Image */}
                        <div
                          onClick={() => {
                            const idx = concepts.findIndex((c) => c.id === concept.id);
                            setViewerConceptIdx(idx >= 0 ? idx : 0);
                            setIsViewerOpen(true);
                          }}
                          className="relative aspect-[16/10] bg-zinc-50 overflow-hidden cursor-pointer group mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                        >
                          <img
                            src={concept.thumbnailUrl}
                            alt={`0${concept.displayOrder || 1}`}
                            className="w-full h-full object-contain p-3 group-hover:scale-102 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          {selection?.selectionType === 'worldcup_winner' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 flex items-center gap-1">
                              <Trophy className="w-3 h-3 text-amber-600" />
                              월드컵 우승
                            </span>
                          )}
                          {(() => {
                            const versions = concept.versions || [];
                            const latestVer = versions[versions.length - 1];
                            if (latestVer?.isFinal) {
                              return (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-900 text-white">
                                  최종 확정 시안
                                </span>
                              );
                            }
                            if (latestVer && latestVer.versionNumber > 1) {
                              return (
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                                  수정 시안 v{latestVer.versionNumber}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {/* 시안 제목 삭제, 01 보조문구를 더 진한 블랙색상폰트로 변경하고 사이즈 확대 */}
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-2xl sm:text-3xl font-[900] text-black tracking-tight">
                            0{concept.displayOrder || 1}
                          </h4>
                          {concept.linkEnabled && concept.linkUrl && (
                            <a
                              href={concept.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                              <span>{concept.linkTitle || '외부 링크'}</span>
                            </a>
                          )}
                        </div>

                        {/* 후보요약 페이지에서는 시안 설명 삭제 */}

                        {selection?.reason && (
                          <div className="mt-3 p-2.5 bg-zinc-50 text-xs text-zinc-600">
                            <strong>선택 사유:</strong> {selection.reason}
                          </div>
                        )}
                      </div>

                      {/* Footer button */}
                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400">
                          {concept.colorFontDescription || '컬러/폰트 시스템'}
                        </span>
                        <Link
                          href={`/share/${shareToken}#item-${item.id}`}
                          className="text-xs font-semibold text-zinc-700 hover:text-zinc-950"
                        >
                          다른 시안으로 변경 →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-zinc-500">
                        아직 <strong>{item.name}</strong> 항목의 시안이 확정되지 않았습니다.
                      </p>
                      <Link
                        href={`/share/${shareToken}`}
                        className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium shadow-sm hover:bg-zinc-800 transition-colors"
                      >
                        시안 선택하러 가기
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Revision & Final Approval Actions */}
        <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-zinc-900">
              {isApproved ? '프로젝트가 최종 승인되었습니다' : '다음 단계는 무엇인가요?'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              {isApproved
                ? '디자이너가 최종 인쇄 및 원본 데이터 전달을 준비 중입니다.'
                : '선택하신 시안들을 바탕으로 종합 수정을 요청하거나, 지금 바로 프로젝트를 최종 승인할 수 있습니다.'}
            </p>
          </div>

          {!isApproved && (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link
                href={`/share/${shareToken}/estimate`}
                className="w-full sm:w-auto px-5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <span>견적서 확인</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsFinalApprovalModalOpen(true)}
                disabled={selectedCount === 0}
                className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs tracking-wide shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>최종 시안 확정 승인</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <FinalApprovalModal
        isOpen={isFinalApprovalModalOpen}
        onClose={() => setIsFinalApprovalModalOpen(false)}
        selectedConcept={itemCandidatePairs.find((p) => p.concept)?.concept || null}
        onConfirmApprove={handleConfirmFinalApprove}
      />

      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        concepts={concepts}
        initialConceptIndex={viewerConceptIdx}
        comments={comments}
        selections={selections}
        onToggleSelect={() => {}}
        onAddComment={async () => {}}
      />
    </div>
  );
}
