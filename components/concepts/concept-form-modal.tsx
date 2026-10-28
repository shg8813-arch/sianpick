'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/shared/modal';
import { Concept, DesignItem } from '@/types';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, Tag, Link as LinkIcon } from 'lucide-react';
import { generateBrandMockupSvg } from '@/lib/utils/svg-generator';
import { compressImage } from '@/lib/utils/image-compression';
import { toast } from 'sonner';

interface ConceptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  designItems?: DesignItem[];
  preselectedItemId?: string;
  onSubmit: (data: {
    itemId?: string;
    title: string;
    description?: string;
    designConcept?: string;
    colorFontDescription?: string;
    usageRecommendation?: string;
    thumbnailUrl: string;
    isPublic: boolean;
    linkEnabled?: boolean;
    linkTitle?: string;
    linkUrl?: string;
  }) => Promise<void>;
  initialData?: Concept | null;
}

export function ConceptFormModal({
  isOpen,
  onClose,
  designItems = [],
  preselectedItemId,
  onSubmit,
  initialData,
}: ConceptFormModalProps) {
  const [itemId, setItemId] = useState(
    initialData?.itemId || preselectedItemId || designItems[0]?.id || ''
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [designConcept, setDesignConcept] = useState(initialData?.designConcept || '');
  const [colorFontDescription, setColorFontDescription] = useState(
    initialData?.colorFontDescription || ''
  );
  const [usageRecommendation, setUsageRecommendation] = useState(
    initialData?.usageRecommendation || ''
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '');
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [linkEnabled, setLinkEnabled] = useState(initialData?.linkEnabled ?? false);
  const [linkTitle, setLinkTitle] = useState(initialData?.linkTitle || '');
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setItemId(initialData.itemId || '');
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDesignConcept(initialData.designConcept || '');
      setColorFontDescription(initialData.colorFontDescription || '');
      setUsageRecommendation(initialData.usageRecommendation || '');
      setThumbnailUrl(initialData.thumbnailUrl);
      setIsPublic(initialData.isPublic);
      setLinkEnabled(initialData.linkEnabled ?? false);
      setLinkTitle(initialData.linkTitle || '');
      setLinkUrl(initialData.linkUrl || '');
    } else {
      setItemId(preselectedItemId || designItems[0]?.id || '');
      setTitle('');
      setDescription('');
      setDesignConcept('');
      setColorFontDescription('');
      setUsageRecommendation('');
      setThumbnailUrl('');
      setIsPublic(true);
      setLinkEnabled(false);
      setLinkTitle('');
      setLinkUrl('');
    }
  }, [initialData, preselectedItemId, designItems, isOpen]);

  // Quick Preset Generator
  const handleGeneratePreset = (type: 'classic' | 'minimal' | 'vintage' | 'modern') => {
    const mockup = generateBrandMockupSvg(type, title || 'SAMPLE BRAND', 'VISUAL IDENTITY', {
      primary: '#1E293B',
      secondary: '#64748B',
      accent: '#3B82F6',
      bg: '#F8FAFC',
      text: '#0F172A',
    });
    setThumbnailUrl(mockup);
    toast.success('감각적인 디자인 샘플 프리셋 이미지가 생성되었습니다.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 1600, 1600, 0.82);
      setThumbnailUrl(compressed);
      toast.success('시안 이미지가 성공적으로 불러와졌습니다.');
    } catch {
      toast.error('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsCompressing(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailUrl) {
      toast.error('대표 이미지를 업로드하거나 프리셋을 생성해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const resolvedItemId = itemId || (designItems.length > 0 ? designItems[0].id : undefined);
      await onSubmit({
        itemId: resolvedItemId,
        title: title.trim(),
        description: description.trim(),
        designConcept: designConcept.trim(),
        colorFontDescription: colorFontDescription.trim(),
        usageRecommendation: usageRecommendation.trim(),
        thumbnailUrl,
        isPublic,
        linkEnabled,
        linkTitle: linkTitle.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
      });
      toast.success(initialData ? '시안이 수정되었습니다.' : '새 시안이 성공적으로 등록되었습니다.');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || '시안 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? '시안 정보 수정' : '새 디자인 시안 등록'}
      description="소속 디자인 항목을 지정하고 시안 이미지 및 세부 설명을 작성하세요."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Design Item selection */}
        {designItems.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              소속 디자인 항목 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white rounded-xl border border-zinc-200 font-semibold text-zinc-800 focus:outline-none focus:border-blue-500"
              >
                {designItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">
            시안 제목 <span className="text-[11px] font-normal text-zinc-400">(선택)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="시안 제목 입력 (선택 사항)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Image Upload & Preview */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">
            대표 시안 이미지 <span className="text-rose-500">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="w-full sm:w-44 h-32 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
              {isCompressing ? (
                <div className="text-center p-3 text-blue-600 flex flex-col items-center gap-1.5">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-[11px] font-semibold">이미지 최적화 중...</span>
                </div>
              ) : thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="text-center p-3 text-zinc-400">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-60" />
                  <span className="text-[11px]">미리보기</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isCompressing}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="w-full py-2.5 px-3 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    이미지 최적화 중...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    컴퓨터에서 이미지 파일 업로드
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="text-[11px] font-semibold text-zinc-400">또는 샘플 프리셋:</span>
                <button
                  type="button"
                  onClick={() => handleGeneratePreset('minimal')}
                  className="px-2 py-1 text-[11px] rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                >
                  미니멀
                </button>
                <button
                  type="button"
                  onClick={() => handleGeneratePreset('classic')}
                  className="px-2 py-1 text-[11px] rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                >
                  클래식
                </button>
                <button
                  type="button"
                  onClick={() => handleGeneratePreset('modern')}
                  className="px-2 py-1 text-[11px] rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                >
                  모던
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">시안 한 줄 요약 설명</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="시안의 전체적인 인상과 핵심 디자인 특징을 요약해주세요."
            className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Detailed Concept Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              디자인 콘셉트 &amp; 의도
            </label>
            <textarea
              rows={2}
              value={designConcept}
              onChange={(e) => setDesignConcept(e.target.value)}
              placeholder="조형적 의미와 시각적 은유를 설명합니다."
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              컬러 팔레트 &amp; 서체 설명
            </label>
            <textarea
              rows={2}
              value={colorFontDescription}
              onChange={(e) => setColorFontDescription(e.target.value)}
              placeholder="예: 팬톤 286C, 세리프 보도니 서체 활용"
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1">추천 활용 방식</label>
          <input
            type="text"
            value={usageRecommendation}
            onChange={(e) => setUsageRecommendation(e.target.value)}
            placeholder="예: 굿즈 패키지, 대형 옥외 간판, 모바일 앱 아이콘 최적화"
            className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Custom Concept Link Option (기본 비활성화) */}
        <div className="pt-3 border-t border-zinc-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="linkEnabled" className="text-xs font-bold text-zinc-800 cursor-pointer flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                <span>시안 외부 링크 연결 (프로토타입/외부 주소)</span>
              </label>
              <p className="text-[11px] text-zinc-400">
                활성화 시 고객 화면에 피그마 또는 웹사이트로 바로 연결되는 링크 버튼이 생성됩니다. (기본 비활성화)
              </p>
            </div>
            <input
              type="checkbox"
              id="linkEnabled"
              checked={linkEnabled}
              onChange={(e) => setLinkEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300"
            />
          </div>

          {linkEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  링크 제목
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="예: 피그마 프로토타입 확인하기"
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  링크 주소 (URL)
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://www.figma.com/..."
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300"
          />
          <label htmlFor="isPublic" className="text-xs font-semibold text-zinc-700 cursor-pointer">
            고객 공유 화면에 공개 표시하기
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                저장 중...
              </>
            ) : initialData ? (
              '수정 내용 저장'
            ) : (
              '시안 등록 완료'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
