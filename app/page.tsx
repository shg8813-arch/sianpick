import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import {
  Layers,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-xs font-medium text-zinc-600 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-8 border border-zinc-100">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>디자인 스튜디오와 클라이언트를 위한 시안 전달 솔루션</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.15] max-w-5xl mx-auto">
          시안을 보고, 고르고,
          <br />
          <span className="text-zinc-950 underline decoration-zinc-200 underline-offset-8">
            수정하고, 확정하는
          </span>{' '}
          감각적인 방법
        </h1>

        <p className="mt-8 text-base sm:text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed font-normal">
          카카오톡과 이메일로 흩어지던 피드백을 한곳에 정돈하고,
          <br className="hidden sm:inline" />
          고객이 직접 대표 시안을 선택하며 작업창 방식의 피드백 기록과 체계적인 수정 차수 관리로
          완성도를 높이는 시각디자인 스튜디오 전문 전달 플랫폼입니다.
        </p>

        {/* CTA Button: 관리자 대시보드 바로가기만 포함 */}
        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="px-9 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm sm:text-base tracking-wide shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2.5 group"
          >
            <Building2 className="w-4 h-4 text-zinc-300" />
            <span>관리자 대시보드 바로가기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200/80 w-full">
        <div className="mb-12 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            SYSTEM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
            디자인 스튜디오를 위한 핵심 기능
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 3 Concepts Side-by-Side Presentation */}
          <div className="p-7 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between border border-zinc-100">
            <div>
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold mb-5 shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">시안 타일 배치 &amp; 대표 시안 선택</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                디자인 항목별 최대 3개의 시안이 나란히 배치되어 직관적으로 비교하고 상세 화면에서 대표 시안을 확정할 수 있습니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              CONCEPT SELECTION
            </div>
          </div>

          {/* Card 2: Inline Feedback & Token Management */}
          <div className="p-7 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between border border-zinc-100">
            <div>
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold mb-5 shadow-sm">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">작업창 방식 피드백 &amp; 토큰 시스템</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                피드백 등록 일시가 시간순으로 작업창에 기록되며, 항목별 토큰 부여 및 전체 통합 차감 방식으로 체계적으로 관리합니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              FEEDBACK &amp; TOKENS
            </div>
          </div>

          {/* Card 3: Revisions & Final Comparison */}
          <div className="p-7 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between border border-zinc-100">
            <div>
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold mb-5 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">수정 시안 업로드 &amp; 1차 시안 비교</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                고객 시안 선택 후 차수별 수정 시안 및 최종 시안(FINAL)을 등록하며, 1차 선택 시안과 좌우 대조 비교가 가능합니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              REVISIONS &amp; FINAL APPROVAL
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-100 bg-white py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-zinc-600">
            SIANPICK | STUDIO PRESENTATION PLATFORM
          </div>
          <div>© 2026 SIANPICK. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
}
