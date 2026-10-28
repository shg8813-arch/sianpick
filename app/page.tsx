import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import {
  Layers,
  Sparkles,
  Trophy,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Building2,
  ArrowUpDown,
  GripVertical,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-xs font-medium text-zinc-600 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-8">
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
          카카오톡과 이메일로 흩어지던 피드백은 이제 그만.
          <br className="hidden sm:inline" />
          고객이 직접 <strong className="text-zinc-800 font-semibold">&apos;드래그앤드롭&apos;</strong>으로 선호 순위를 매겨 시안을 확정하고,
          정교한 핀 코멘트와 체계적인 수정 횟수 관리로 완성하는 미니멀 디자인 플랫폼입니다.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/share/runofthemill-sample-2026"
            className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all flex items-center justify-center gap-2 group"
          >
            <span>런오브더밀 고객 화면 체험 (3개 시안)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-sm tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-zinc-500" />
            <span>디자이너 관리자 대시보드</span>
          </Link>
        </div>

        {/* Hero Visual Showcase Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto bg-white p-4 sm:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.05)]">
          <div className="bg-zinc-900 p-6 sm:p-8 text-white text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
              <div>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest">
                  FEATURED CLIENT PROJECT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  런오브더밀 브랜드 아이덴티티 리뉴얼
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 font-medium">
                  수정 횟수: 1/3회 (잔여 2회)
                </span>
                <span className="px-3 py-1 bg-white text-zinc-900 font-semibold flex items-center gap-1 shadow-sm">
                  <ArrowUpDown className="w-3.5 h-3.5" /> 드래그 순서 확정
                </span>
              </div>
            </div>

            {/* Mock Concepts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { title: '시안 1 — 모던 지오메트릭', rank: '1순위 (최종 확정 후보)', isTop: true },
                { title: '시안 2 — 헤리티지 세리프', rank: '2순위' },
                { title: '시안 3 — 네오 브루탈리즘', rank: '3순위' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-4 transition-all ${
                    item.isTop
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'bg-zinc-950/70 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-white/90 text-zinc-900 shadow-sm">
                      {item.rank}
                    </span>
                    <GripVertical className="w-4 h-4 text-zinc-500" />
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">{item.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    런오브더밀의 절제된 미학과 공간에 맞춘 비주얼 제안
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-100 w-full">
        <div className="mb-12 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            SYSTEM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-1 tracking-tight">
            디자인 스튜디오를 위한 핵심 기능
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Drag & Drop Ranking */}
          <div className="p-7 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold mb-5 shadow-sm">
                <GripVertical className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">드래그앤드롭 선호 순위 확정</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                복잡한 설문 대신 직관적으로 카드를 끌어다 놓아 1순위, 2순위, 3순위를 정하고 원클릭으로 최종 시안을 확정합니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              DRAG &amp; DROP RANKING
            </div>
          </div>

          {/* Card 2: Design Items & 3 Concepts */}
          <div className="p-7 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold mb-5 shadow-sm">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">디자인 항목별 시안 구성</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                로고, 컵홀더, 메뉴판 등 각 디자인 항목마다 3개의 완성도 높은 시안을 독립적으로 비교하고 선택할 수 있습니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              ITEM ARCHITECTURE
            </div>
          </div>

          {/* Card 3: Exact Revisions & Pin Comments */}
          <div className="p-7 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.035)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold mb-5 shadow-sm">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">정확한 핀 코멘트 &amp; 수정 횟수</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                이미지 위 정확한 좌표에 핀을 꽂아 의견을 남기고, 종합 요청서 제출 시에만 수정 횟수가 차감되는 투명한 프로세스를 제공합니다.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              PIN COMMENTS &amp; REVISIONS
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-100 bg-white py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-zinc-600">
            SIANPICK | STUDIO PORTFOLIO PRESENTATION
          </div>
          <div>© 2026 SIANPICK. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
}
