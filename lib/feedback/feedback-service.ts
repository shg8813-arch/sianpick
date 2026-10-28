'use client';

import { UserFeedback, FeedbackCategory } from '@/types';

const FEEDBACK_STORAGE_KEY = 'sianpick_user_feedbacks_v1';

export class FeedbackService {
  private static instance: FeedbackService;

  private constructor() {}

  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  // Get all feedbacks
  public getFeedbacks(): UserFeedback[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (!data) return [];
      const list = JSON.parse(data) as UserFeedback[];
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  // Submit new feedback
  public async submitFeedback(params: {
    category: FeedbackCategory;
    rating: number;
    authorName: string;
    authorEmail: string;
    studioName?: string;
    content: string;
  }): Promise<UserFeedback> {
    const content = params.content.trim();
    if (!content) {
      throw new Error('피드백 내용을 입력해주세요.');
    }
    if (!params.authorEmail || !params.authorEmail.includes('@')) {
      throw new Error('올바른 이메일 주소를 입력해주세요.');
    }

    const feedbacks = this.getFeedbacks();
    const newFeedback: UserFeedback = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: params.category,
      rating: Math.max(1, Math.min(5, params.rating || 5)),
      authorName: params.authorName.trim() || '익명 디자이너',
      authorEmail: params.authorEmail.trim(),
      studioName: params.studioName?.trim() || undefined,
      content,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    feedbacks.unshift(newFeedback);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
    }

    return newFeedback;
  }

  // Delete feedback
  public deleteFeedback(id: string): void {
    if (typeof window === 'undefined') return;
    const feedbacks = this.getFeedbacks().filter((f) => f.id !== id);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  }

  // Mark status
  public updateStatus(id: string, status: 'new' | 'reviewed' | 'resolved'): void {
    if (typeof window === 'undefined') return;
    const feedbacks = this.getFeedbacks().map((f) => (f.id === id ? { ...f, status } : f));
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  }
}

export const feedbackService = FeedbackService.getInstance();
