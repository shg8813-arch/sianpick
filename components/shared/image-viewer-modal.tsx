'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Concept, PinComment, Selection } from '@/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Check,
  Palette,
  Compass,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
  initialConceptIndex?: number;
  comments?: PinComment[];
  selections: Selection[];
  onToggleSelect: (conceptId: string) => void;
  onAddComment?: (data: {
    conceptId: string;
    content: string;
    positionX?: number;
    positionY?: number;
    authorName: string;
    authorType: 'designer' | 'client';
  }) => Promise<void>;
  onResolveComment?: (commentId: string) => Promise<void>;
  isClientView?: boolean;
}

export function ImageViewerModal({
  isOpen,
  onClose,
  concepts,
  initialConceptIndex = 0,
  comments = [],
  selections,
  onToggleSelect,
  onResolveComment,
  isClientView = true,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialConceptIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number | null>(null);

  // Touch gesture state for mobile slide
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialConceptIndex);
      setZoomLevel(1);
      setSelectedVersionIdx(null);
    }
  }, [initialConceptIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, concepts.length]);

  if (!isOpen || concepts.length === 0) return null;

  const currentConcept = concepts[currentIndex] || concepts[0];
  const versions = currentConcept.versions || [];
  const currentImageUrl =
    selectedVersionIdx !== null && versions[selectedVersionIdx]
      ? versions[selectedVersionIdx].imageUrl
      : currentConcept.thumbnailUrl;

  const isSelected = selections.some((s) => s.conceptId === currentConcept.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : concepts.length - 1));
    setZoomLevel(1);
    setSelectedVersionIdx(null);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < concepts.length - 1 ? prev + 1 : 0));
    setZoomLevel(1);
    setSelectedVersionIdx(null);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      // Swiped left -> next concept
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> previous concept
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleSelectCurrentConcept = () => {
    onToggleSelect(currentConcept.id);
    if (!isSelected) {
      toast.success(`"0${currentIndex + 1}"이(가) 대표 시안으로 선택되었습니다.`);
    } else {
      toast.info('시안 선택이 유지됩니다.');
    }
    // Automatically close viewer to return smoothly to first screen where feedback is activated
    onClose();
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`fixed inset-0 z-50 flex items-center justify-center select-none ${
        isFullScreen ? 'p-0 bg-black' : 'p-2 sm:p-4 bg-black/85 backdrop-blur-md'
      }`}
    >
      <div
        className={`relative w-full h-full ${
          isFullScreen ? 'rounded-none' : 'max-w-7xl max-h-[96vh] rounded-2xl'
        } bg-[#18181B] text-white flex flex-col md:flex-row overflow-hidden shadow-2xl border border-zinc-800`}
      >
        {/* Main Canvas Area */}
        <div
          className="flex-1 flex flex-col h-[55vh] md:h-full relative overflow-hidden bg-zinc-950"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar on Image */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2">
              <span className="text-base sm:text-lg font-[900] px-3.5 py-1 rounded-full bg-white text-black shadow-md tracking-tight">
                0{currentIndex + 1}
              </span>
              <span className="text-xs text-zinc-300 font-medium px-2.5 py-0.5 rounded-full bg-black/60 border border-zinc-700">
                {currentIndex + 1} / {concepts.length}
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
              {/* Zoom Controls */}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                title="축소"
                className="p-1.5 rounded-lg bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                title="확대"
                className="p-1.5 rounded-lg bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                title="전체화면"
                className="p-1.5 rounded-lg bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 transition-colors hidden sm:block"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="닫기"
                className="p-1.5 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Display Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 relative select-none">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="relative max-w-full max-h-full flex items-center justify-center"
            >
              <img
                src={currentImageUrl}
                alt={`0${currentIndex + 1}`}
                className="max-h-[50vh] md:max-h-[74vh] max-w-full object-contain rounded-lg shadow-2xl pointer-events-none"
              />
            </div>
          </div>

          {/* Left / Right Arrow navigation (Desktop & Tablet) */}
          {concepts.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all backdrop-blur-sm z-20 shadow-lg"
                title="이전 시안 (키보드 좌측 방향키)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all backdrop-blur-sm z-20 shadow-lg"
                title="다음 시안 (키보드 우측 방향키)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile slide swipe helper indicator & Dots */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
            {/* Version Switcher if multiple versions */}
            {versions.length > 1 && (
              <div className="pointer-events-auto flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700 mb-1">
                <span className="text-[11px] text-zinc-400 mr-1">버전:</span>
                {versions.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVersionIdx(i)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                      (selectedVersionIdx === null && i === versions.length - 1) ||
                      selectedVersionIdx === i
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    v{v.versionNumber}
                  </button>
                ))}
              </div>
            )}

            {/* Slide Dots on Mobile */}
            {concepts.length > 1 && (
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-zinc-800">
                {concepts.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${
                      idx === currentIndex ? 'bg-white w-4' : 'bg-zinc-600'
                    }`}
                    title={`시안 ${idx + 1}`}
                  />
                ))}
                <span className="text-[10px] text-zinc-400 ml-1.5 sm:hidden">
                  좌우 슬라이드로 이동
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info & Selection Drawer */}
        <div className="w-full md:w-96 flex-shrink-0 bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col h-[45vh] md:h-full overflow-hidden">
          {/* Concept Header & Details */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  {currentIndex + 1} OF {concepts.length}
                </span>
                <h3 className="text-3xl sm:text-4xl font-[900] text-white mt-1 tracking-tight">
                  0{currentIndex + 1}
                </h3>
              </div>

              {isSelected && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1 shadow-sm shrink-0">
                  <Check className="w-3.5 h-3.5" />
                  선택됨
                </span>
              )}
            </div>

            {currentConcept.description && (
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentConcept.description}
              </p>
            )}

            {/* Custom External Link if configured */}
            {currentConcept.linkEnabled && currentConcept.linkUrl && (
              <a
                href={currentConcept.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-zinc-700 shadow-sm"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>{currentConcept.linkTitle || '시안 외부 링크 바로가기'}</span>
              </a>
            )}

            {/* Design Specifications */}
            <div className="space-y-2.5 text-xs bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
              {currentConcept.colorFontDescription && (
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Palette className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
                      컬러 &amp; 서체 컨셉
                    </span>
                    <span>{currentConcept.colorFontDescription}</span>
                  </div>
                </div>
              )}

              {currentConcept.usageRecommendation && (
                <div className="flex items-start gap-2.5 text-zinc-300 pt-2 border-t border-zinc-800/80">
                  <Compass className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
                      활용 가이드
                    </span>
                    <span>{currentConcept.usageRecommendation}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/70 text-[11px] text-zinc-400 leading-relaxed">
              상세 화면에서 시안을 확인한 후 아래 버튼을 눌러 선택해주세요. 선택이 확정되면 첫 화면에서 상세 피드백 작성란이 활성화됩니다.
            </div>
          </div>

          {/* Bottom Action Area: Selection Button Only (피드백 작성기능 삭제됨) */}
          <div className="p-4 sm:p-5 bg-zinc-950/90 border-t border-zinc-800 flex-shrink-0 space-y-2">
            <button
              type="button"
              onClick={handleSelectCurrentConcept}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                isSelected
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-white hover:bg-zinc-100 text-zinc-900'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>선택된 대표 시안 (확인 완료)</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-zinc-900" />
                  <span>이 시안을 대표 시안으로 선택하기</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-zinc-400 hover:text-white transition-colors"
            >
              닫고 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
