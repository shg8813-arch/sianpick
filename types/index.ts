export type ProjectStatus = 'draft' | 'in_review' | 'revising' | 'approved';

export type RevisionStatus =
  | 'draft'
  | 'submitted'
  | 'designer_review'
  | 'in_progress'
  | 'version_uploaded'
  | 'client_confirmed'
  | 'rejected';

export type AuthorType = 'designer' | 'client';

export type SelectionType = 'candidate' | 'worldcup_winner' | 'final';

export type ActivityType =
  | 'page_view'
  | 'concept_view'
  | 'concept_select'
  | 'concept_unselect'
  | 'worldcup_start'
  | 'worldcup_complete'
  | 'comment_create'
  | 'revision_submit'
  | 'revision_status_change'
  | 'version_add'
  | 'final_approve';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  studioName?: string;
  role: 'designer' | 'client' | 'admin';
  createdAt: string;
}

export interface StudioProfile {
  studioName: string; // 디자인 업체 / 스튜디오 상호명
  logoUrl?: string; // 디자인 업체 로고 이미지 URL (고객 페이지 상단 노출)
  logoHeight?: number; // 로고 표시 높이 (px 단위, 기본 36, 20~72px)
  representative: string; // 대표자 성명
  registrationNumber?: string; // 사업자등록번호
  contact?: string; // 스튜디오 연락처
  email?: string; // 이메일
  address?: string; // 사업장 소재지
  bankAccount?: string; // 입금 계좌
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
}

export interface DesignItem {
  id: string;
  projectId: string;
  name: string; // 예: 로고, 컵홀더, 메뉴판 등 (직접 작성)
  description?: string;
  displayOrder: number;
  worldcupEnabled?: boolean; // 디자인 항목별 월드컵 활성화 여부
  createdAt: string;
  concepts?: Concept[];
}

export interface ConceptImage {
  id: string;
  conceptId: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
}

export interface ConceptVersion {
  id: string;
  conceptId: string;
  versionNumber: number;
  imageUrl: string;
  changeSummary?: string;
  revisionRequestId?: string;
  isFinal: boolean;
  createdAt: string;
}

export interface PinComment {
  id: string;
  projectId: string;
  conceptId: string;
  itemId?: string;
  conceptVersionId?: string;
  authorType: AuthorType;
  authorName: string;
  content: string;
  positionX?: number; // 0 - 100%
  positionY?: number; // 0 - 100%
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface Concept {
  id: string;
  projectId: string;
  itemId?: string; // 소속된 디자인 항목 ID
  title: string;
  description?: string;
  designConcept?: string;
  colorFontDescription?: string;
  usageRecommendation?: string;
  thumbnailUrl: string;
  displayOrder: number;
  isPublic: boolean;
  linkEnabled?: boolean; // 시안 외부 링크 활성화 여부 (기본: false)
  linkTitle?: string; // 시안 외부 링크 제목 (커스텀 가능)
  linkUrl?: string; // 시안 외부 링크 주소 (커스텀 가능)
  images?: ConceptImage[];
  versions?: ConceptVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface RevisionRequest {
  id: string;
  projectId: string;
  revisionNumber: number;
  content: string;
  status: RevisionStatus;
  submittedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface Selection {
  id: string;
  projectId: string;
  itemId?: string; // 디자인 항목별 선택 매칭
  conceptId: string;
  selectionType: SelectionType;
  reason?: string;
  isFinal: boolean;
  selectedAt: string;
}

export interface WorldcupMatch {
  id: string;
  sessionId: string;
  leftConceptId: string;
  rightConceptId: string;
  selectedConceptId: string;
  roundNumber: number;
  matchOrder: number;
  createdAt: string;
}

export interface WorldcupSession {
  id: string;
  projectId: string;
  itemId?: string;
  participantName: string;
  winnerConceptId?: string;
  stateJson: {
    rounds: Concept[][];
    currentRoundIdx: number;
    currentMatchIdx: number;
    completed: boolean;
    history: Array<{ round: number; match: number; winnerId: string }>;
  };
  completedAt?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  activityType: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface EstimateItem {
  id: string;
  name: string; // 항목명 (자유 직접입력)
  description?: string; // 세부내역/규격 (자유 직접입력)
  quantity: number; // 수량 (직접입력)
  unitPrice: number; // 단가 (직접입력)
  amount: number; // 공급가액 (수량 * 단가)
  note?: string; // 비고 (자유 직접입력)
}

export interface ProjectEstimate {
  id: string;
  projectId: string;
  title: string; // 견적서 제목 (예: 디자인 용역 견적서)
  estimateNumber: string; // 견적번호
  issueDate: string; // 발행일자 (YYYY-MM-DD)
  validUntilDate?: string; // 유효기간
  senderName?: string; // 공급자 상호/스튜디오명
  senderRepresentative?: string; // 대표자
  senderRegistrationNumber?: string; // 사업자등록번호
  senderContact?: string; // 연락처
  senderEmail?: string; // 이메일
  senderAddress?: string; // 사업장 소재지
  senderBankAccount?: string; // 입금계좌
  receiverCompany?: string; // 공급받는자 상호/업체명
  receiverRepresentative?: string; // 대표자/담당자
  receiverContact?: string; // 연락처
  receiverEmail?: string; // 이메일
  items: EstimateItem[]; // 품목 리스트 (자유 직접 입력)
  subtotal: number; // 공급가액 합계
  vatRate: number; // 부가세율 (%) - 기본 10
  vatAmount: number; // 부가세액
  totalAmount: number; // 총 합계금액
  termsAndNotes?: string; // 특약사항 및 비고 (자유 직접입력)
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string; // 시안을 제공하는 디자인 업체 로고 이미지 URL (고객 페이지 최상단 바에 표시)
  companyLogoHeight?: number; // 로고 표시 높이 (px)
  ownerId: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  description?: string;
  status: ProjectStatus;
  dueDate?: string;
  maxRevisionCount: number;
  usedRevisionCount: number;
  feedbackTokensTotal?: number; // 피드백 토큰 총 수량 (기본 20개)
  feedbackTokensUsed?: number; // 사용한 피드백 토큰 수
  maxSelectionCount: number;
  shareToken: string;
  sharePasswordHash?: string;
  shareExpiresAt?: string;
  watermarkEnabled: boolean;
  downloadEnabled: boolean;
  worldcupEnabled?: boolean; // 프로젝트 단위 월드컵 사용 여부
  selectionConfirmedByAdmin?: boolean; // 관리자가 고객 시안 선택을 확인 완료했는지 여부
  revisionPhaseActive?: boolean; // 수정 및 최종 시안 업로드 단계 활성화 여부
  createdAt: string;
  updatedAt: string;
  estimate?: ProjectEstimate; // 프로젝트 견적서 정보
  // Hydrated properties
  designItems?: DesignItem[];
  concepts?: Concept[];
  comments?: PinComment[];
  revisionRequests?: RevisionRequest[];
  selections?: Selection[];
  activityLogs?: ActivityLog[];
}
