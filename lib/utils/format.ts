import { ProjectStatus, RevisionStatus } from '@/types';

export function formatDateKR(dateString?: string | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTimeKR(dateString?: string | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getProjectStatusLabel(status: ProjectStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'draft':
      return { label: '초안 작성', color: 'text-zinc-600', bg: 'bg-zinc-100' };
    case 'in_review':
      return { label: '고객 검토 중', color: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200' };
    case 'revising':
      return { label: '수정 진행 중', color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200' };
    case 'approved':
      return { label: '최종 승인 완료', color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200' };
    default:
      return { label: '상태 미지정', color: 'text-zinc-600', bg: 'bg-zinc-100' };
  }
}

export function getRevisionStatusLabel(status: RevisionStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'draft':
      return { label: '작성 중', color: 'text-zinc-600', bg: 'bg-zinc-100' };
    case 'submitted':
      return { label: '제출 완료', color: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200' };
    case 'designer_review':
      return { label: '디자이너 확인', color: 'text-purple-700', bg: 'bg-purple-50 border border-purple-200' };
    case 'in_progress':
      return { label: '수정 진행 중', color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200' };
    case 'version_uploaded':
      return { label: '수정본 등록', color: 'text-indigo-700', bg: 'bg-indigo-50 border border-indigo-200' };
    case 'client_confirmed':
      return { label: '고객 확인 완료', color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200' };
    case 'rejected':
      return { label: '수정 요청 반려', color: 'text-rose-700', bg: 'bg-rose-50 border border-rose-200' };
    default:
      return { label: status, color: 'text-zinc-600', bg: 'bg-zinc-100' };
  }
}
