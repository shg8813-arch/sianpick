'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Project, ProjectEstimate } from '@/types';
import { getProjectRepository } from '@/lib/repositories';
import { formatDateKR } from '@/lib/utils/format';
import {
  ArrowLeft,
  Printer,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
}

function numberToKorean(amount: number): string {
  if (amount === 0) return '영';
  const units = ['', '만', '억', '조'];
  const smallUnits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const posUnits = ['', '십', '백', '천'];

  let numStr = String(Math.floor(amount));
  let result = '';
  let unitIndex = 0;

  while (numStr.length > 0) {
    const chunk = numStr.slice(-4);
    numStr = numStr.slice(0, -4);
    let chunkResult = '';

    for (let i = 0; i < chunk.length; i++) {
      const digit = parseInt(chunk[chunk.length - 1 - i], 10);
      if (digit > 0) {
        chunkResult = (digit === 1 && i > 0 ? '' : smallUnits[digit]) + posUnits[i] + chunkResult;
      }
    }

    if (chunkResult) {
      result = chunkResult + units[unitIndex] + ' ' + result;
    }
    unitIndex++;
  }

  return result.trim();
}

export default function ClientEstimatePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const repo = getProjectRepository();
        const proj = await repo.getProjectByShareToken(shareToken);
        if (!proj) {
          setError('프로젝트를 찾을 수 없습니다.');
          return;
        }
        setProject(proj);
      } catch {
        setError('견적 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [shareToken]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
        <div className="text-center space-y-3 p-8 bg-white shadow-[0_12px_45px_rgba(0,0,0,0.035)]">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            견적서 데이터를 불러오는 중...
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
          <p className="text-xs text-zinc-500">{error || '견적서를 찾을 수 없습니다.'}</p>
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

  const estimate: ProjectEstimate | undefined = project.estimate;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-zinc-900 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {/* Top Floating Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/share/${shareToken}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-zinc-700 hover:text-zinc-950 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>시안 검토 공간으로 돌아가기</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium shadow-sm transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>견적서 인쇄 / PDF 저장</span>
        </button>
      </div>

      {/* Main Quotation Sheet */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-14 shadow-[0_12px_45px_rgba(0,0,0,0.035)] print:shadow-none print:p-8">
        {!estimate ? (
          <div className="text-center py-20 space-y-4">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-800">등록된 견적서가 없습니다</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              현재 프로젝트에 등록된 견적 내역이 없습니다. 디자이너가 견적서를 작성한 후 확인하실 수 있습니다.
            </p>
            <Link
              href={`/share/${shareToken}`}
              className="inline-block px-5 py-2.5 bg-zinc-900 text-white text-xs font-medium shadow-sm hover:bg-zinc-800 transition-colors"
            >
              시안 목록으로 이동
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Document Header */}
            <div className="border-b-2 border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase block mb-1">
                  OFFICIAL DESIGN PROPOSAL &amp; ESTIMATE
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                  {estimate.title || '견 적 서'}
                </h1>
              </div>

              <div className="text-left sm:text-right font-mono text-xs text-zinc-500 space-y-0.5">
                <div>견적번호: <strong>{estimate.estimateNumber}</strong></div>
                <div>발행일자: {estimate.issueDate}</div>
                {estimate.validUntilDate && (
                  <div>유효기간: {estimate.validUntilDate}까지</div>
                )}
              </div>
            </div>

            {/* Recipient & Provider Split Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
              {/* Recipient Info */}
              <div className="p-5 bg-zinc-50/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                  공급받는 자 (귀하)
                </span>
                <div>
                  <div className="text-base font-bold text-zinc-900">
                    {estimate.receiverCompany || project.companyName || project.clientName} 귀하
                  </div>
                  {estimate.receiverRepresentative && (
                    <div className="text-zinc-600 mt-1">
                      대표자: {estimate.receiverRepresentative}
                    </div>
                  )}
                  {estimate.receiverContact && (
                    <div className="text-zinc-600">
                      연락처: {estimate.receiverContact}
                    </div>
                  )}
                  {estimate.receiverEmail && (
                    <div className="text-zinc-600">
                      이메일: {estimate.receiverEmail}
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-500">
                  프로젝트명: <strong>{project.title}</strong>
                </div>
              </div>

              {/* Provider Info */}
              <div className="p-5 bg-zinc-50/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                  공급자 (스튜디오)
                </span>
                <div>
                  <div className="text-base font-bold text-zinc-900">
                    {estimate.senderName || '스튜디오 아틀리에 (STUDIO ATELIER)'}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-zinc-600">
                    {estimate.senderRepresentative && (
                      <div>대표자: {estimate.senderRepresentative}</div>
                    )}
                    {estimate.senderRegistrationNumber && (
                      <div>등록번호: {estimate.senderRegistrationNumber}</div>
                    )}
                    {estimate.senderContact && (
                      <div>연락처: {estimate.senderContact}</div>
                    )}
                    {estimate.senderEmail && (
                      <div>이메일: {estimate.senderEmail}</div>
                    )}
                  </div>
                  {estimate.senderAddress && (
                    <div className="text-zinc-500 mt-1">
                      사업장: {estimate.senderAddress}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-zinc-900 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-2 w-12 text-center">NO</th>
                    <th className="py-3 px-3">품목명 / 세부사양</th>
                    <th className="py-3 px-3 text-center w-16">수량</th>
                    <th className="py-3 px-3 text-right w-28">단가</th>
                    <th className="py-3 px-3 text-right w-28">공급가액</th>
                    <th className="py-3 px-3 w-40">비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {estimate.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50">
                      <td className="py-3.5 px-2 text-center font-mono text-zinc-400">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-zinc-900">{item.name}</div>
                        {item.description && (
                          <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-zinc-700">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-zinc-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-zinc-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-zinc-500 leading-relaxed">
                        {item.note || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Calculation Block */}
            <div className="flex justify-end pt-4">
              <div className="w-full sm:w-80 space-y-3 text-xs border-t border-zinc-200 pt-4">
                <div className="flex justify-between text-zinc-600 px-1">
                  <span>공급가액 합계</span>
                  <span className="font-mono font-medium">{formatCurrency(estimate.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 px-1">
                  <span>부가가치세 (VAT {estimate.vatRate}%)</span>
                  <span className="font-mono font-medium">{formatCurrency(estimate.vatAmount)}</span>
                </div>

                {/* 하단 견적금액 블랙바 형태 */}
                <div className="bg-zinc-900 text-white p-4 sm:p-5 shadow-sm flex justify-between items-center mt-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-mono">총 견적금액 (VAT 포함)</span>
                    <span className="text-xs font-semibold text-zinc-200">일금 {numberToKorean(estimate.totalAmount)} 원정</span>
                  </div>
                  <span className="font-mono font-extrabold text-xl text-white">
                    {formatCurrency(estimate.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Account & Payment terms */}
            {estimate.senderBankAccount && (
              <div className="p-5 bg-zinc-50/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                  <span>입금 및 결제 계좌 안내</span>
                </div>
                <p className="font-mono text-zinc-700 text-sm">
                  {estimate.senderBankAccount}
                </p>
              </div>
            )}

            {/* Terms and Notes */}
            {estimate.termsAndNotes && (
              <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs">
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                  TERMS &amp; CONDITIONS / 특약사항 및 비고
                </span>
                <div className="text-zinc-600 leading-relaxed whitespace-pre-wrap p-4 bg-zinc-50/50 font-mono text-[11px]">
                  {estimate.termsAndNotes}
                </div>
              </div>
            )}

            {/* Official Stamp & Sign Area */}
            {(() => {
              const attachedLogo = estimate.senderLogoUrl;
              const logoHeight = estimate.senderLogoHeight || 42;
              const providerName = estimate.senderName || '스튜디오 아틀리에 (STUDIO ATELIER)';
              return (
                <div className="pt-12 text-center text-xs text-zinc-500 space-y-3">
                  <p className="text-zinc-400">위와 같이 견적서를 제출합니다.</p>
                  
                  {attachedLogo ? (
                    <div className="flex flex-col items-center justify-center pt-2">
                      <img
                        src={attachedLogo}
                        alt={providerName}
                        style={{ height: `${logoHeight}px` }}
                        className="max-w-[260px] object-contain mx-auto"
                      />
                      <div className="font-bold text-zinc-900 text-sm mt-3 tracking-tight">
                        {providerName}
                        {estimate.senderRepresentative && ` 대표 ${estimate.senderRepresentative}`}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <div className="font-bold text-zinc-900 text-base tracking-tight">
                        {providerName}
                      </div>
                      {estimate.senderRepresentative && (
                        <div className="text-xs text-zinc-500 mt-1">
                          대표 {estimate.senderRepresentative}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
