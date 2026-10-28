'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DesignItem, Concept, PinComment, Selection } from '@/types';
import { InlineItemFeedback } from './inline-item-feedback';
import { VersionComparisonModal } from '@/components/shared/version-comparison-modal';
import {
  Trophy,
  Check,
  Eye,
  RotateCcw,
  Palette,
  Compass,
  ExternalLink,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';

interface ClientDesignItemViewProps {
  item: DesignItem;
  itemIndex: number;
  concepts: Concept[];
  selections: Selection[];
  comments: PinComment[];
  remainingTokens: number;
  tokensTotal: number;
  canRunWorldcup: boolean;
  shareToken: string;
  onOpenViewer: (itemConcepts: Concept[], initialIndex: number) => void;
  onRequestCancelSelection: (item: DesignItem, candidateConcept: Concept) => void;
  onAddComment: (data: {
    conceptId: string;
    content: string;
    positionX?: number;
    positionY?: number;
    authorName: string;
    authorType: 'designer' | 'client';
  }) => Promise<void>;
}

export function ClientDesignItemView({
  item,
  itemIndex,
  concepts,
  selections,
  comments,
  remainingTokens,
  tokensTotal,
  canRunWorldcup,
  shareToken,
  onOpenViewer,
  onRequestCancelSelection,
  onAddComment,
}: ClientDesignItemViewProps) {
  const [viewTab, setViewTab] = useState<'latest' | 'v1' | 'compare'>('latest');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const itemConcepts = concepts.filter((c) => c.itemId === item.id);
  const itemCandidate = selections.find((s) => s.itemId === item.id);
  const candidateConcept = itemCandidate
    ? concepts.find((c) => c.id === itemCandidate.conceptId) || null
    : null;

  const versions = candidateConcept?.versions || [];
  const firstVersion = versions.length > 0 ? versions[0] : null;
  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
  const hasRevisions = versions.length > 1 || Boolean(latestVersion?.isFinal);

  return (
    <section className="space-y-4 pb-16 sm:pb-12 border-b-2 sm:border-b border-zinc-200/90 last:border-b-0">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-zinc-200/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400">
              {String(itemIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
              DESIGN ITEM
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              {item.name}
            </h2>
            {candidateConcept ? (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 shadow-sm inline-flex items-center gap-1 border border-emerald-100">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                선택된 시안: <strong>0{candidateConcept.displayOrder || 1}</strong>
              </span>
            ) : (
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5">
                시안 {itemConcepts.length}개 준비됨
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canRunWorldcup && (
            <Link
              href={`/share/${shareToken}/worldcup?itemId=${item.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-zinc-200 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{item.name} 시안 월드컵</span>
            </Link>
          )}
        </div>
      </div>

      {/* CASE 1: NO SELECTION YET -> 3 Side-by-side Tiles on both Desktop and Mobile */}
      {!candidateConcept ? (
        <div className="space-y-2.5">
          {itemConcepts.length === 0 ? (
            <div className="p-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center text-xs text-zinc-400">
              등록된 시안이 없습니다.
            </div>
          ) : (
            <>
              {/* 개별 1차시안 문구를 시안 위쪽 하나로 통일 */}
              <div className="flex items-center justify-between px-0.5 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-zinc-900 text-white text-[11px] font-bold shadow-sm">
                    1차 시안
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ({itemConcepts.length}개 후보 시안)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  시안 클릭 시 상세 화면으로 이동합니다
                </span>
              </div>

              {/* Side-by-Side 3-column Grid (Mobile & Desktop) */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
                {itemConcepts.map((concept, idx) => (
                  <div
                    key={concept.id}
                    onClick={() => onOpenViewer(itemConcepts, idx)}
                    className="group bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-zinc-100 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden pb-2.5 sm:pb-3.5"
                  >
                    <div>
                      {/* Concept Number in deep bold black font with increased size */}
                      <div className="p-2.5 sm:p-3.5 pb-2 flex items-center justify-between gap-1">
                        <h4 className="text-base sm:text-xl md:text-2xl font-[900] text-black tracking-tight group-hover:text-blue-600 transition-colors">
                          0{idx + 1}
                        </h4>
                        {concept.linkEnabled && concept.linkUrl && (
                          <a
                            href={concept.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded flex items-center gap-1 transition-colors shrink-0"
                            title={concept.linkTitle || '외부 링크'}
                          >
                            <ExternalLink className="w-3 h-3 text-blue-600" />
                            <span className="hidden md:inline">{concept.linkTitle || '링크'}</span>
                          </a>
                        )}
                      </div>

                      {/* Tile Artwork Image Box */}
                      <div className="relative aspect-square sm:aspect-[4/3] bg-zinc-50/70 overflow-hidden flex items-center justify-center p-2 sm:p-4 mx-2 sm:mx-3">
                        <img
                          src={concept.thumbnailUrl}
                          alt={`0${idx + 1}`}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informative Step Guide (Tightened spacing) */}
              <div className="p-3 sm:p-3.5 bg-white border border-dashed border-zinc-200 shadow-sm flex items-center gap-3 text-xs text-zinc-600">
                <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-800">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-zinc-900 text-[11px] sm:text-xs block">
                    시안 상세 확인 및 선택 안내
                  </span>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    시안을 클릭하여 상세 화면에서 확인하신 후 <strong>[이 시안을 대표 시안으로 선택하기]</strong>를 진행해주세요.
                    시안 선택 후 하단 피드백 작업창이 활성화됩니다.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Standby Feedback Box (Waiting for selection) */}
          <InlineItemFeedback
            item={item}
            selectedConcept={null}
            comments={comments}
            tokensRemaining={remainingTokens}
            tokensTotal={tokensTotal}
            onAddComment={onAddComment}
          />
        </div>
      ) : (
        /* CASE 2: CONCEPT IS SELECTED -> Clean Hero Selected Concept Only + Activated Feedback + Revisions/Final comparison */
        <div className="space-y-3.5">
          <div className="bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)] border border-zinc-100 transition-all overflow-hidden">
            {/* Selected Card Top Header */}
            <div className="p-4 sm:p-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 shadow-sm border border-emerald-100">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    선택된 대표 시안
                  </span>

                  {latestVersion?.isFinal ? (
                    <span className="px-2 py-0.5 bg-zinc-900 text-white text-[11px] font-bold shadow-sm">
                      최종 확정 시안 (FINAL)
                    </span>
                  ) : hasRevisions && latestVersion && latestVersion.versionNumber > 1 ? (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] font-bold shadow-sm">
                      제{latestVersion.versionNumber}차 수정 시안
                    </span>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-mono">
                      1차 시안
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3 flex-wrap pt-0.5">
                  <h3 className="text-2xl sm:text-3xl font-[900] text-black tracking-tight">
                    0{candidateConcept.displayOrder || 1}
                  </h3>

                  {/* Multi-version view switcher tabs when revisions exist */}
                  {hasRevisions && (
                    <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                      <button
                        type="button"
                        onClick={() => setViewTab('latest')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          viewTab === 'latest'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {latestVersion?.isFinal ? '최종 시안' : `수정 시안(v${latestVersion?.versionNumber})`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewTab('v1')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          viewTab === 'v1'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        1차 선택 시안
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewTab('compare')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          viewTab === 'compare'
                            ? 'bg-zinc-900 text-white shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        시안 비교 보기
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Comparison Modal, Detail, Link & Cancel Selection */}
              <div className="flex items-center gap-2 flex-wrap">
                {hasRevisions && (
                  <button
                    type="button"
                    onClick={() => setIsCompareModalOpen(true)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>선택시안 비교</span>
                  </button>
                )}

                {candidateConcept.linkEnabled && candidateConcept.linkUrl && (
                  <a
                    href={candidateConcept.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm border border-zinc-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>{candidateConcept.linkTitle || '시안 링크 바로가기'}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onOpenViewer([candidateConcept], 0)}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-600" />
                  <span>시안 크게보기</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRequestCancelSelection(item, candidateConcept)}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-zinc-600 text-xs font-semibold border border-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
                  title="선택을 취소하고 다시 전체 시안 목록으로 원상복구합니다"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>선택 취소</span>
                </button>
              </div>
            </div>

            {/* Selected Artwork Hero Showcase OR Side-by-Side Comparison */}
            {hasRevisions && viewTab === 'compare' ? (
              <div className="p-4 sm:p-6 bg-zinc-50/70 border-b border-zinc-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: 1st Selected Draft */}
                  <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-3 bg-zinc-100/90 border-b border-zinc-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900">1차 선택 시안 (v1)</span>
                      <span className="text-zinc-500 font-mono">초기 제안본</span>
                    </div>
                    <div
                      onClick={() => onOpenViewer([candidateConcept], 0)}
                      className="p-4 flex items-center justify-center min-h-[240px] sm:min-h-[280px] bg-zinc-50/50 cursor-pointer"
                    >
                      <img
                        src={firstVersion?.imageUrl || candidateConcept.thumbnailUrl}
                        alt="1차 선택 시안"
                        className="max-h-60 max-w-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Right: Latest Revised / Final Artwork */}
                  <div className="bg-white rounded-xl border border-blue-200 overflow-hidden shadow-sm ring-2 ring-blue-500/20 flex flex-col">
                    <div className="p-3 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        {latestVersion?.isFinal
                          ? '최종 확정 시안 (FINAL)'
                          : `제${latestVersion?.versionNumber}차 수정 시안`}
                      </span>
                      <span className="text-blue-700 font-medium">
                        {latestVersion?.changeSummary || '수정본'}
                      </span>
                    </div>
                    <div
                      onClick={() => onOpenViewer([candidateConcept], 0)}
                      className="p-4 flex items-center justify-center min-h-[240px] sm:min-h-[280px] bg-zinc-50/50 cursor-pointer"
                    >
                      <img
                        src={latestVersion?.imageUrl || candidateConcept.thumbnailUrl}
                        alt={latestVersion?.isFinal ? '최종 확정 시안' : '수정 시안'}
                        className="max-h-60 max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => onOpenViewer([candidateConcept], 0)}
                className="relative aspect-[16/9] sm:aspect-[21/9] max-h-64 sm:max-h-80 bg-zinc-50/60 p-4 sm:p-6 flex items-center justify-center cursor-pointer group overflow-hidden"
              >
                <img
                  src={
                    viewTab === 'v1'
                      ? firstVersion?.imageUrl || candidateConcept.thumbnailUrl
                      : latestVersion?.imageUrl || candidateConcept.thumbnailUrl
                  }
                  alt={`0${candidateConcept.displayOrder || 1}`}
                  className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-300"
                />

                {hasRevisions && viewTab === 'v1' && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-zinc-900/80 backdrop-blur-sm text-white text-[11px] font-semibold rounded shadow">
                    1차 선택 시안 확인 중
                  </div>
                )}
              </div>
            )}

            {/* Concept Description and Specifications */}
            <div className="p-4 sm:p-6 pt-3 space-y-2">
              {latestVersion?.changeSummary && hasRevisions && viewTab !== 'v1' && (
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-900">
                  <strong>수정 반영 사항:</strong> {latestVersion.changeSummary}
                </div>
              )}

              {candidateConcept.description && (
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light">
                  {candidateConcept.description}
                </p>
              )}

              {(candidateConcept.colorFontDescription || candidateConcept.usageRecommendation) && (
                <div className="pt-2.5 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-500">
                  {candidateConcept.colorFontDescription && (
                    <div className="flex items-start gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                      <span>{candidateConcept.colorFontDescription}</span>
                    </div>
                  )}
                  {candidateConcept.usageRecommendation && (
                    <div className="flex items-start gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                      <span>{candidateConcept.usageRecommendation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activated Inline Feedback Section directly beneath */}
          <InlineItemFeedback
            item={item}
            selectedConcept={candidateConcept}
            comments={comments}
            tokensRemaining={remainingTokens}
            tokensTotal={tokensTotal}
            onAddComment={onAddComment}
          />
        </div>
      )}

      {/* Version Comparison Modal */}
      {isCompareModalOpen && candidateConcept && (
        <VersionComparisonModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          concept={candidateConcept}
        />
      )}
    </section>
  );
}
