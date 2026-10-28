'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FeedbackModal } from './feedback-modal';

interface FeedbackFloatingButtonProps {
  className?: string;
}

export function FeedbackFloatingButton({ className = '' }: FeedbackFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all flex items-center gap-2 rounded-full border border-zinc-700/50 ${className}`}
        title="디자이너 피드백 및 의견 보내기"
      >
        <MessageSquare className="w-4 h-4 text-amber-400" />
        <span>의견 보내기</span>
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
