'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { FeedbackModal } from '@/components/feedback/feedback-modal';
import { FeedbackFloatingButton } from '@/components/feedback/feedback-floating-button';
import {
  Layers,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Building2,
  CheckCircle2,
  Coins,
  FileText,
  Sliders,
  Eye,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Laptop,
  Check,
  X,
  Mail,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const faqs = [
    {
      q: '시안을 확인하는 고객(클라이언트)도 회원가입을 해야 하나요?',
      a: '전혀 필요하지 않습니다. 디자이너가 프로젝트를 생성하면 전용 보안 공유 링크(URL)가 발급되며, 고객은 별도의 로그인이나 앱 설치 없이 링크를 통해 즉시 시안을 확인하고 대표 시안 선택 및 피드백 작성을 진행할 수 있습니다.',
    },
    {
      q: '피드백 잔여 토큰 시스템은 어떻게 동작하나요?',
      a: '끝없는 무제한 수정 요청으로 인한 디자이너의 피로도를 방지하기 위한 스마트 관리 시스템입니다. 디자인 항목당 기본 5개의 토큰(디자이너가 자유롭게 조절 가능)이 부여되며, 고객이 코멘트를 등록할 때마다 1개씩 차감되어 계획적이고 신중한 피드백을 유도합니다.',
    },
    {
      q: '내 디자인 스튜디오의 로고와 브랜딩을 적용할 수 있나요?',
      a: '네, 가능합니다. 관리자 대시보드 스튜디오 프로필에서 로고 이미지를 업로드하고 원하는 높이(20px~100px)를 설정하면, 고객이 접속하는 상단 바에 내 스튜디오 로고가 단독으로 노출되며 배경 레이아웃도 로고 크기에 맞춰 알맞게 자동 확장됩니다.',
    },
    {
      q: '공식 디자인 견적서 발행 기능은 무엇인가요?',
      a: '프로젝트별 디자인 품목, 공급가액, 부가세, 발행일 및 유효기간을 입력하면 시각디자인 스튜디오 규격의 공식 견적서가 자동 생성됩니다. 고객 공유 화면에서 바로 열람하거나 인쇄 및 PDF 저장이 가능합니다.',
    },
    {
      q: '수정 시안과 1차 시안을 어떻게 비교하나요?',
      a: '고객이 선택한 대표 시안을 바탕으로 차수별 수정 시안(1차 수정본, 2차 수정본 등)을 업로드할 수 있으며, 전용 대조 모달에서 1차 시안과 최신 수정본을 좌우로 나란히 놓고 픽셀 단위로 비교 검토할 수 있습니다.',
    },
    {
      q: '예비 고객 디자이너를 위해 무료로 제공되나요?',
      a: '네, 현재 시안픽을 도입하고자 하시는 예비 고객 디자이너분들의 실제 사용 경험과 피드백을 청취하기 위해 모든 핵심 기능을 무료로 제공하고 있습니다. 언제든지 편하게 사용해보시고 의견을 남겨주세요.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-xs font-semibold text-zinc-700 shadow-[0_2px_12px_rgba(0,0,0,0.035)] mb-8 border border-zinc-200/80">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>시각디자인 스튜디오와 클라이언트를 위한 전문 시안 전달 솔루션</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.3] sm:leading-[1.34] md:leading-[1.38] max-w-5xl mx-auto">
          시안을 보고, 고르고,
          <br />
          수정하고, 확정하는 감각적인 방법
        </h1>

        <p className="mt-8 text-base sm:text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed font-normal">
          카카오톡과 이메일로 흩어지던 시안 파일과 피드백을 한곳에 정돈하세요.
          <br className="hidden sm:inline" />
          항목별 3개 시안 나란히 비교, 작업창 방식의 실시간 피드백 기록, 계획적인 수정 토큰 관리,
          견적서 연동 및 공식 승인서까지 원스톱으로 지원합니다.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
          <Link
            href="/login?tab=register"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm tracking-wide shadow-[0_6px_24px_rgba(0,0,0,0.14)] transition-all flex items-center justify-center gap-2 group"
          >
            <span>무료로 지금 시작하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/share/urbanforest-sample-2026"
            target="_blank"
            className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-sm tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-zinc-500" />
            <span>고객 전달 화면 체험하기</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full sm:w-auto px-6 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 border border-zinc-200"
          >
            <MessageSquare className="w-4 h-4 text-zinc-600" />
            <span>서비스 의견 보내기</span>
          </button>
        </div>

        {/* Sample Direct Previews */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
          <span className="text-[11px] font-medium text-zinc-400">분야별 샘플 체험:</span>
          <Link
            href="/share/urbanforest-sample-2026"
            target="_blank"
            className="hover:text-zinc-900 underline underline-offset-4 decoration-zinc-300 transition-colors"
          >
            브랜드 아이덴티티 &amp; 패키지
          </Link>
          <span className="text-zinc-300">·</span>
          <Link
            href="/share/tattoo-noir-sample"
            target="_blank"
            className="hover:text-zinc-900 underline underline-offset-4 decoration-zinc-400 transition-colors font-medium text-zinc-800 bg-zinc-100/80 px-2 py-0.5 rounded-sm"
          >
            타투이스트 커스텀 도안 &amp; 신체 목업
          </Link>
        </div>

        {/* Value Prop Chips */}
        <div className="mt-14 pt-10 border-t border-zinc-200/60 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 bg-white border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">01 DISPLAY</span>
            <span className="text-xs font-bold text-zinc-800 mt-1 block">3개 시안 나란히 비교</span>
          </div>
          <div className="p-3.5 bg-white border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">02 FEEDBACK</span>
            <span className="text-xs font-bold text-zinc-800 mt-1 block">작업창 실시간 피드백</span>
          </div>
          <div className="p-3.5 bg-white border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">03 CONTROL</span>
            <span className="text-xs font-bold text-zinc-800 mt-1 block">계획적 수정 토큰 관리</span>
          </div>
          <div className="p-3.5 bg-white border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">04 BRANDING</span>
            <span className="text-xs font-bold text-zinc-800 mt-1 block">스튜디오 로고 커스텀</span>
          </div>
        </div>
      </section>

      {/* Comparison Section: Before vs With Sianpick */}
      <section className="py-20 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              WHY SIANPICK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
              디자이너의 소중한 시간을 낭비하던 시안 전달 문제를 해결합니다
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-3 leading-relaxed">
              더 이상 카톡 대화방에서 시안 파일이 만료되거나 모호한 텍스트 피드백으로 고통받지 마세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before / Traditional */}
            <div className="p-8 bg-zinc-50 border border-zinc-200/80 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  기존의 시안 전달 방식
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold">
                  비효율 &amp; 피로도 누적
                </span>
              </div>
              <ul className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>카카오톡 및 메일로 낱장 전달되어 다른 대화에 묻히고 다운로드 기간 만료</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>&apos;글자 조금만 키워주세요&apos; 등 불명확한 텍스트 요청으로 인한 반복된 헛수정</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>약정 횟수 없는 무제한 수정 요구로 프로젝트 일정 지연 및 수익성 악화</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>수정본 전달 후에도 1차 시안과 무엇이 달라졌는지 고객이 인지하지 못해 재번복</span>
                </li>
              </ul>
            </div>

            {/* After / Sianpick */}
            <div className="p-8 bg-zinc-900 text-white shadow-xl space-y-5 border border-zinc-800">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  시안픽 전달 프로세스
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  완벽한 정돈 &amp; 전문성
                </span>
              </div>
              <ul className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>디자인 항목별 최대 3개 시안을 나란히 배치하여 고객이 즉시 대표 시안 확정</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>선택 시안 하단 작업창에서 일시별로 누적 기록되는 체계적인 피드백 관리</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>사전 합의된 피드백 잔여 토큰 차감 방식으로 계획적이고 정돈된 피드백 수렴</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1차 선택 시안과 수정 시안의 좌우 1:1 대조 비교 및 원클릭 공식 최종 승인서 발행</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section id="workflow" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            SIMPLE 3-STEP PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
            단 3단계로 완성되는 직관적인 시안 전달 흐름
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-3 leading-relaxed">
            복잡한 도구 설정 없이 누구나 1분 만에 프로젝트를 생성하고 고객에게 시안을 전달할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-8 bg-white border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.035)] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="w-9 h-9 bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                01
              </span>
              <h3 className="text-lg font-bold text-zinc-900">시안 등록 &amp; 스튜디오 브랜딩</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                로고, 리플렛, 패키지 등 디자인 품목별로 3개 시안을 업로드하고 내 스튜디오 공식 로고를 상단에 배치합니다.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
              PROJECT SETUP
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.035)] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="w-9 h-9 bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                02
              </span>
              <h3 className="text-lg font-bold text-zinc-900">고객 전용 보안 링크 전달</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                고객은 로그인 없이 보안 링크로 접속하여 3개 시안을 비교 검토하고, 항목별 작업창에 정확한 수정 피드백을 기록합니다.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
              CLIENT REVIEW &amp; SELECTION
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.035)] flex flex-col justify-between">
            <div className="space-y-4">
              <span className="w-9 h-9 bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                03
              </span>
              <h3 className="text-lg font-bold text-zinc-900">수정본 대조 &amp; 최종 승인</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                차수별 수정 시안을 업로드해 1차 시안과 대조 확인하고, 디자인 최종 승인서 및 공식 견적서를 확정합니다.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
              REVISION &amp; FINAL APPROVAL
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="py-24 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              CORE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
              디자인 스튜디오를 위해 특화된 6가지 핵심 기능
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 bg-[#FBFBFA] border border-zinc-200/80 space-y-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">3개 시안 병렬 배치 &amp; 대표 시안 선택</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                디자인 항목별 최대 3개의 시안이 나란히 배치되어 고객이 직관적으로 비교하고 가장 마음에 드는 대표 시안을 확정합니다.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 bg-[#FBFBFA] border border-zinc-200/80 space-y-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">작업창 방식 피드백 &amp; 시간순 기록</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                선택하신 시안별 전용 작업창에서 피드백을 작성합니다. 등록 일시가 초 단위까지 시간순으로 기록되어 누락 없이 수정 요구를 관리합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 bg-[#FBFBFA] border border-zinc-200/80 space-y-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">피드백 잔여 토큰 스마트 제어</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                프로젝트 항목당 부여된 피드백 토큰을 실시간으로 차감하여, 고객이 수정 요구사항을 한 번에 정돈해 제출하도록 유도합니다.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 bg-[#FBFBFA] border border-zinc-200/80 space-y-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <Sliders className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">스튜디오 로고 커스텀 &amp; 레이아웃 확장</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                내 스튜디오 공식 로고를 등록하고 크기를 조절하면 상단 바 배경 레이아웃이 로고 높이에 맞춰 자동으로 확장됩니다.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 bg-[#FBFBFA] border border-zinc-200/80 space-y-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">공식 디자인 견적서 자동 생성</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                공급자 정보, 공급가액, 부가세, 견적 유효기간을 입력하면 규격화된 공식 견적서가 발행되며 인쇄 및 PDF 저장을 지원합니다.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 bg-[#FBFBFA] border border-zinc-200/80 space-y-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <Laptop className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">1:1 대조 비교 &amp; 반응형 뷰어</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                1차 시안과 차수별 수정본의 좌우 분할 대조 모달과 모바일/태블릿 터치 슬라이드 뷰어로 언제 어디서나 깔끔하게 검토합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prospective Designer FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
            예비 고객 디자이너 자주 묻는 질문
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            시안픽 도입 및 활용에 대해 궁금하신 점을 확인해보세요.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors"
                >
                  <span className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-zinc-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-[#FBFBFA]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Designer Feedback Window Banner */}
      <section className="py-16 bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-mono tracking-wider border border-zinc-700">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>COMMUNITY FEEDBACK CHANNEL</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            디자이너 여러분의 소중한 피드백으로 완성됩니다
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            시안픽을 직접 사용해보시면서 필요하신 추가 기능이나 아쉬운 점, UI 개선 아이디어가 있으시다면
            언제든 알려주세요. 여러분의 의견이 가장 빠르게 기능으로 구현됩니다.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-zinc-700" />
              <span>서비스 의견 및 기능 제안 남기기</span>
            </button>

            <a
              href="mailto:sianpick.team@gmail.com"
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>직접 이메일 문의하기</span>
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center w-full">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            지금 바로 나만의 첫 번째 시안 프로젝트를 시작하세요
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            별도의 복잡한 절차 없이 30초 만에 계정을 생성하고, 고객에게 전달할 시안 공간을 완성해보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login?tab=register"
              className="w-full sm:w-auto px-9 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm tracking-wide shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>무료 계정 생성하기</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-sm border border-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-zinc-500" />
              <span>관리자 대시보드 바로가기</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <span>시안픽</span>
              <span className="font-mono text-[10px] text-zinc-400 font-normal">STUDIO PLATFORM</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              시각디자인 스튜디오를 위한 프리미엄 시안 전달 및 수정 차수 관리 솔루션
            </p>
          </div>

          <div className="flex items-center gap-5 font-medium text-zinc-600">
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="hover:text-zinc-900 transition-colors"
            >
              피드백 보내기
            </button>
            <a
              href="mailto:sianpick.team@gmail.com"
              className="hover:text-zinc-900 transition-colors"
            >
              제휴 및 문의
            </a>
            <Link href="/login" className="hover:text-zinc-900 transition-colors">
              디자이너 로그인
            </Link>
          </div>

          <div className="text-[11px] text-zinc-400 font-mono">
            © 2026 SIANPICK. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* Modals & Floating Action */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <FeedbackFloatingButton />
    </div>
  );
}
