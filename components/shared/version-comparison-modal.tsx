'use client';

import React, { useState } from 'react';
import { Modal } from './modal';
import { Concept } from '@/types';
import { ArrowLeftRight, Calendar, Sparkles } from 'lucide-react';
import { formatDateKR } from '@/lib/utils/format';

interface VersionComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: Concept;
}

export function VersionComparisonModal({
  isOpen,
  onClose,
  concept,
}: VersionComparisonModalProps) {
  const versions = concept.versions || [];
  const [leftVerIdx, setLeftVerIdx] = useState(0);
  const [rightVerIdx, setRightVerIdx] = useState(Math.max(0, versions.length - 1));

  if (versions.length < 2) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="버전 비교" maxWidth="md">
        <div className="py-8 text-center text-zinc-500 text-sm">
          현재 등록된 버전이 1개뿐이어서 이전 버전 비교가 불가능합니다.
          <br />
          새로운 수정본이 등록되면 이전 버전과 비교할 수 있습니다.
        </div>
      </Modal>
    );
  }

  const leftVer = versions[leftVerIdx];
  const rightVer = versions[rightVerIdx];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${concept.title} — 버전 좌우 비교`}
      description="수정 전 버전과 현재 버전을 나란히 비교하여 변경점을 확인해보세요."
      maxWidth="6xl"
    >
      <div className="space-y-6">
        {/* Version selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              비교 대상 1 (좌측)
            </label>
            <select
              value={leftVerIdx}
              onChange={(e) => setLeftVerIdx(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 text-sm font-medium text-zinc-800"
            >
              {versions.map((v, i) => (
                <option key={v.id} value={i}>
                  v{v.versionNumber} ({formatDateKR(v.createdAt)}) — {v.changeSummary || '수정본'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              비교 대상 2 (우측)
            </label>
            <select
              value={rightVerIdx}
              onChange={(e) => setRightVerIdx(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-300 text-sm font-medium text-zinc-800"
            >
              {versions.map((v, i) => (
                <option key={v.id} value={i}>
                  v{v.versionNumber} ({formatDateKR(v.createdAt)}) — {v.changeSummary || '수정본'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side by side image display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left card */}
          <div className="flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
            <div className="p-3 bg-zinc-100/80 border-b border-zinc-200 flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900">v{leftVer.versionNumber}</span>
              <span className="text-zinc-500">{leftVer.changeSummary || '버전 내용'}</span>
            </div>
            <div className="p-3 flex items-center justify-center bg-zinc-50 min-h-[300px]">
              <img
                src={leftVer.imageUrl}
                alt={`v${leftVer.versionNumber}`}
                className="max-h-[360px] object-contain rounded shadow"
              />
            </div>
            <div className="p-3 text-xs text-zinc-500 border-t border-zinc-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>등록일: {formatDateKR(leftVer.createdAt)}</span>
            </div>
          </div>

          {/* Right card */}
          <div className="flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm ring-2 ring-blue-500/20">
            <div className="p-3 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                v{rightVer.versionNumber}
              </span>
              <span className="text-blue-700 font-medium">{rightVer.changeSummary || '수정본'}</span>
            </div>
            <div className="p-3 flex items-center justify-center bg-zinc-50 min-h-[300px]">
              <img
                src={rightVer.imageUrl}
                alt={`v${rightVer.versionNumber}`}
                className="max-h-[360px] object-contain rounded shadow"
              />
            </div>
            <div className="p-3 text-xs text-zinc-500 border-t border-zinc-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>등록일: {formatDateKR(rightVer.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
