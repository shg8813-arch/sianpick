'use client';

import React, { useState, useEffect } from 'react';
import { Concept, DesignItem } from '@/types';
import { Trophy, RotateCcw, ArrowLeft, Sparkles, Check, CheckCircle2, ChevronRight, Tag } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface WorldcupGameProps {
  projectId: string;
  shareToken: string;
  concepts: Concept[];
  designItems?: DesignItem[];
  initialItemId?: string;
  onSaveCandidate: (conceptId: string, itemId?: string) => Promise<void>;
}

export function WorldcupGame({
  projectId,
  shareToken,
  concepts,
  designItems = [],
  initialItemId,
  onSaveCandidate,
}: WorldcupGameProps) {
  // Only items that have World Cup enabled!
  const enabledItems = designItems.filter((d) => d.worldcupEnabled !== false);

  const [activeItemId, setActiveItemId] = useState<string>(() => {
    if (initialItemId && enabledItems.some((d) => d.id === initialItemId)) {
      return initialItemId;
    }
    return enabledItems.length > 0 ? enabledItems[0].id : 'all';
  });

  const activeItem = enabledItems.find((d) => d.id === activeItemId);

  // Filter concepts based on activeItemId
  const filteredConcepts = concepts.filter((c) => {
    if (!c.isPublic) return false;
    if (activeItemId === 'all') return true;
    return c.itemId === activeItemId;
  });

  const storageKey = `sianpick_worldcup_${projectId}_${activeItemId}`;

  // Tournament state
  const [currentRoundList, setCurrentRoundList] = useState<Concept[]>([]);
  const [nextRoundList, setNextRoundList] = useState<Concept[]>([]);
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [roundName, setRoundName] = useState<string>('');
  const [winner, setWinner] = useState<Concept | null>(null);
  const [winsCountMap, setWinsCountMap] = useState<Record<string, number>>({});
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCandidateRegistered, setIsCandidateRegistered] = useState(false);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Initialize tournament
  const initTournament = (shuffle = true) => {
    if (filteredConcepts.length < 2) return;

    let pool = [...filteredConcepts];
    if (shuffle) {
      pool = pool.sort(() => Math.random() - 0.5);
    }

    // Handle odd number of concepts: give a bye to the first one
    const advancing: Concept[] = [];
    if (pool.length % 2 !== 0) {
      const byeConcept = pool.pop()!;
      advancing.push(byeConcept);
      toast.info(`홀수 시안(${filteredConcepts.length}개)으로 인해 "${byeConcept.title}" 시안이 부전승으로 다음 라운드에 진출했습니다.`);
    }

    setCurrentRoundList(pool);
    setNextRoundList(advancing);
    setCurrentMatchIdx(0);
    setWinner(null);
    setSelectedSide(null);
    setIsCandidateRegistered(false);

    const initialWins: Record<string, number> = {};
    filteredConcepts.forEach((c) => {
      initialWins[c.id] = 0;
    });
    setWinsCountMap(initialWins);
    updateRoundTitle(pool.length + advancing.length);
  };

  const updateRoundTitle = (totalRemaining: number) => {
    if (totalRemaining === 2) {
      setRoundName('결승전 (FINAL)');
    } else if (totalRemaining <= 4) {
      setRoundName('4강 (준결승)');
    } else if (totalRemaining <= 8) {
      setRoundName('8강전');
    } else {
      setRoundName(`${totalRemaining}강 토너먼트`);
    }
  };

  // Re-init when active item changes
  useEffect(() => {
    setIsClientLoaded(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.currentRoundList && parsed.currentRoundList.length > 0) {
          setCurrentRoundList(parsed.currentRoundList);
          setNextRoundList(parsed.nextRoundList || []);
          setCurrentMatchIdx(parsed.currentMatchIdx || 0);
          setWinner(parsed.winner || null);
          setWinsCountMap(parsed.winsCountMap || {});
          setRoundName(parsed.roundName || '토너먼트');
          setIsCandidateRegistered(parsed.isCandidateRegistered || false);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load worldcup state from storage', e);
    }
    initTournament(true);
  }, [projectId, activeItemId]);

  // Save to localStorage
  useEffect(() => {
    if (!isClientLoaded) return;
    try {
      const state = {
        currentRoundList,
        nextRoundList,
        currentMatchIdx,
        winner,
        winsCountMap,
        roundName,
        isCandidateRegistered,
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save worldcup state', e);
    }
  }, [
    currentRoundList,
    nextRoundList,
    currentMatchIdx,
    winner,
    winsCountMap,
    roundName,
    isCandidateRegistered,
    isClientLoaded,
    storageKey,
  ]);

  if (!isClientLoaded) {
    return <div className="py-20 text-center text-zinc-400 text-sm">월드컵 대진표를 불러오는 중...</div>;
  }

  // Handle winner selected in a match
  const handleSelectWinner = (chosen: Concept, side: 'left' | 'right') => {
    if (selectedSide) return;
    setSelectedSide(side);

    const updatedWins = {
      ...winsCountMap,
      [chosen.id]: (winsCountMap[chosen.id] || 0) + 1,
    };
    setWinsCountMap(updatedWins);

    setTimeout(() => {
      const newNextRound = [...nextRoundList, chosen];
      const nextMatchIdx = currentMatchIdx + 2;

      if (nextMatchIdx < currentRoundList.length) {
        setNextRoundList(newNextRound);
        setCurrentMatchIdx(nextMatchIdx);
        setSelectedSide(null);
      } else {
        if (newNextRound.length === 1) {
          setWinner(newNextRound[0]);
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
        } else {
          let nextPool = [...newNextRound];
          const newAdvancing: Concept[] = [];
          if (nextPool.length % 2 !== 0 && nextPool.length > 1) {
            const byeConcept = nextPool.pop()!;
            newAdvancing.push(byeConcept);
            toast.info(`홀수 진행으로 "${byeConcept.title}" 시안이 부전승으로 진출했습니다.`);
          }
          setCurrentRoundList(nextPool);
          setNextRoundList(newAdvancing);
          setCurrentMatchIdx(0);
          updateRoundTitle(nextPool.length + newAdvancing.length);
        }
        setSelectedSide(null);
      }
    }, 450);
  };

  // Register winner as candidate for this design item
  const handleRegisterAsCandidate = async () => {
    if (!winner) return;
    try {
      setIsRegistering(true);
      await onSaveCandidate(winner.id, winner.itemId || (activeItemId !== 'all' ? activeItemId : undefined));
      setIsCandidateRegistered(true);
      toast.success(`"${winner.title}" 시안이 [${activeItem?.name || '항목'}]의 최종 선호 후보로 등록되었습니다.`);
    } catch {
      toast.error('후보 시안 등록 중 오류가 발생했습니다.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleResetGame = () => {
    if (confirm('이 항목의 월드컵을 처음부터 다시 시작하시겠습니까?')) {
      localStorage.removeItem(storageKey);
      initTournament(true);
    }
  };

  const leftConcept = currentRoundList[currentMatchIdx];
  const rightConcept = currentRoundList[currentMatchIdx + 1];
  const totalMatchesInRound = Math.floor(currentRoundList.length / 2);
  const currentMatchNumber = Math.floor(currentMatchIdx / 2) + 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Design Item Switcher Tabs (Only items with worldcup enabled) */}
      {enabledItems.length > 0 && (
        <div className="bg-white p-3 rounded-2xl border border-zinc-200/90 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span className="text-xs font-bold text-zinc-500 mr-2 flex items-center gap-1 whitespace-nowrap">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              월드컵 대상 항목:
            </span>
            {enabledItems.map((item) => {
              const count = concepts.filter((c) => c.itemId === item.id).length;
              const isCurrent = activeItemId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItemId(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isCurrent ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <Link
            href={`/share/${shareToken}/summary`}
            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            선택시안 모아보기
          </Link>
        </div>
      )}

      {enabledItems.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-20 px-4 bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          <Trophy className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-zinc-800">
            시안 월드컵이 활성화된 디자인 항목이 없습니다
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
            디자이너가 월드컵 기능을 활성화한 항목에서만 토너먼트를 진행할 수 있습니다.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href={`/share/${shareToken}`}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold"
            >
              시안 목록으로 돌아가기
            </Link>
          </div>
        </div>
      ) : filteredConcepts.length < 2 ? (
        <div className="max-w-md mx-auto text-center py-20 px-4 bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
          <Trophy className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-zinc-800">
            [{activeItem?.name || '항목'}] 시안이 2개 이상이어야 합니다
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
            시안 월드컵은 최소 2개 이상의 디자인 시안이 등록된 항목에서 진행할 수 있습니다.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href={`/share/${shareToken}`}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold"
            >
              시안 목록으로 돌아가기
            </Link>
          </div>
        </div>
      ) : winner ? (
        /* Winner View */
        <div className="max-w-3xl mx-auto px-4 py-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-amber-50">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {activeItem ? `[${activeItem.name}] 시안 월드컵 최종 우승` : '시안 월드컵 최종 우승'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                고객님의 최종 선호 시안
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
                토너먼트에서 총 <strong>{winsCountMap[winner.id] || 0}회</strong> 선택받은 디자인입니다.
              </p>
            </div>

            {/* Winner Concept Card */}
            <div className="bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-left max-w-xl mx-auto">
              <div className="relative aspect-[16/10] bg-zinc-50 overflow-hidden shadow-sm flex items-center justify-center mb-4">
                <img
                  src={winner.thumbnailUrl}
                  alt={winner.title}
                  className="w-full h-full object-contain p-3"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                {activeItem && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {activeItem.name}
                  </span>
                )}
                <h3 className="text-lg font-bold text-zinc-900">{winner.title}</h3>
              </div>
              {winner.description && (
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                  {winner.description}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {!isCandidateRegistered ? (
                <button
                  type="button"
                  onClick={handleRegisterAsCandidate}
                  disabled={isRegistering}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  이 시안을 [{activeItem?.name || '항목'}] 최종 후보로 등록
                </button>
              ) : (
                <div className="px-5 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  후보 시안 등록 완료
                </div>
              )}

              <Link
                href={`/share/${shareToken}/summary`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>최종 시안 후보 모아보기</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleResetGame}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                다시 월드컵 하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tournament Match View */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/share/${shareToken}`}
                className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {roundName}
                  </span>
                  {activeItem && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                      {activeItem.name}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500 font-medium">
                    매치 {currentMatchNumber} / {totalMatchesInRound}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 mt-1 tracking-tight">
                  더 마음에 드는 {activeItem ? `[${activeItem.name}]` : ''} 시안을 선택해주세요!
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetGame}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-white transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              처음부터 다시하기
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentMatchNumber - 1) / totalMatchesInRound) * 100}%`,
              }}
            />
          </div>

          {/* 2 Match Cards */}
          {leftConcept && rightConcept && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-zinc-900 text-white font-mono font-bold text-xs items-center justify-center shadow-lg ring-4 ring-white pointer-events-none">
                VS
              </div>

              {/* Left Concept Card */}
              <div
                onClick={() => handleSelectWinner(leftConcept, 'left')}
                className={`group relative bg-white p-6 transition-all cursor-pointer flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] ${
                  selectedSide === 'left'
                    ? 'ring-2 ring-blue-500 scale-[1.01]'
                    : selectedSide === 'right'
                    ? 'opacity-40 grayscale scale-95'
                    : ''
                }`}
              >
                <div>
                  <div className="relative aspect-[16/11] bg-zinc-50/80 overflow-hidden flex items-center justify-center mb-4">
                    <img
                      src={leftConcept.thumbnailUrl}
                      alt={leftConcept.title}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    OPTION A
                  </span>
                  <h2 className="text-xl font-bold text-zinc-900 mt-1">{leftConcept.title}</h2>
                  {leftConcept.description && (
                    <p className="text-xs sm:text-sm text-zinc-500 mt-2 line-clamp-3 leading-relaxed">
                      {leftConcept.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-3 bg-zinc-900 group-hover:bg-blue-600 text-white font-semibold text-xs tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>이 시안 선택하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Concept Card */}
              <div
                onClick={() => handleSelectWinner(rightConcept, 'right')}
                className={`group relative bg-white p-6 transition-all cursor-pointer flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] ${
                  selectedSide === 'right'
                    ? 'ring-2 ring-blue-500 scale-[1.01]'
                    : selectedSide === 'left'
                    ? 'opacity-40 grayscale scale-95'
                    : ''
                }`}
              >
                <div>
                  <div className="relative aspect-[16/11] bg-zinc-50/80 overflow-hidden flex items-center justify-center mb-4">
                    <img
                      src={rightConcept.thumbnailUrl}
                      alt={rightConcept.title}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    OPTION B
                  </span>
                  <h2 className="text-xl font-bold text-zinc-900 mt-1">{rightConcept.title}</h2>
                  {rightConcept.description && (
                    <p className="text-xs sm:text-sm text-zinc-500 mt-2 line-clamp-3 leading-relaxed">
                      {rightConcept.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-3 bg-zinc-900 group-hover:bg-blue-600 text-white font-semibold text-xs tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>이 시안 선택하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
