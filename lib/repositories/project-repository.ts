import {
  Project,
  Company,
  DesignItem,
  Concept,
  ConceptVersion,
  PinComment,
  RevisionRequest,
  Selection,
  SelectionType,
  ActivityType,
  RevisionStatus,
  ProjectEstimate,
  StudioProfile,
} from '@/types';

export interface IProjectRepository {
  // Companies (업체 관리)
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | null>;
  createCompany(data: {
    name: string;
    contactPerson: string;
    email?: string;
    phone?: string;
    memo?: string;
  }): Promise<Company>;
  updateCompany(id: string, updates: Partial<Company>): Promise<Company>;
  deleteCompany(id: string): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProjectsByCompany(companyId: string): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  getProjectByShareToken(token: string): Promise<Project | null>;
  createProject(
    data: {
      companyId?: string;
      title: string;
      clientName: string;
      clientEmail?: string;
      description?: string;
      dueDate?: string;
      maxRevisionCount: number;
      maxSelectionCount: number;
      watermarkEnabled?: boolean;
      downloadEnabled?: boolean;
      worldcupEnabled?: boolean;
      shareExpiresAt?: string;
      sharePasswordHash?: string;
    }
  ): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Design Items (디자인 항목: 로고, 컵홀더, 메뉴판 등 - 직접 입력 생성 및 월드컵 활성화 여부)
  addDesignItem(projectId: string, data: { name: string; description?: string; worldcupEnabled?: boolean }): Promise<DesignItem>;
  updateDesignItem(projectId: string, itemId: string, updates: Partial<DesignItem>): Promise<DesignItem>;
  deleteDesignItem(projectId: string, itemId: string): Promise<void>;
  reorderDesignItems(projectId: string, itemIds: string[]): Promise<void>;

  // Concepts
  addConcept(
    projectId: string,
    data: {
      itemId?: string;
      title: string;
      description?: string;
      designConcept?: string;
      colorFontDescription?: string;
      usageRecommendation?: string;
      thumbnailUrl: string;
      isPublic?: boolean;
      displayOrder?: number;
      linkEnabled?: boolean;
      linkTitle?: string;
      linkUrl?: string;
    }
  ): Promise<Concept>;
  addConceptsBatch(
    projectId: string,
    concepts: Array<{
      itemId?: string;
      title?: string;
      description?: string;
      thumbnailUrl: string;
      isPublic?: boolean;
    }>
  ): Promise<Concept[]>;
  updateConcept(projectId: string, conceptId: string, updates: Partial<Concept>): Promise<Concept>;
  deleteConcept(projectId: string, conceptId: string): Promise<void>;
  reorderConcepts(projectId: string, conceptIds: string[]): Promise<void>;

  // Versions
  addConceptVersion(
    projectId: string,
    conceptId: string,
    data: { imageUrl: string; changeSummary?: string; revisionRequestId?: string; isFinal?: boolean }
  ): Promise<ConceptVersion>;

  // Comments
  addComment(
    comment: Omit<PinComment, 'id' | 'createdAt'>
  ): Promise<PinComment>;
  updateCommentStatus(projectId: string, commentId: string, status: 'open' | 'resolved'): Promise<void>;

  // Revisions
  submitRevisionRequest(
    projectId: string,
    content: string
  ): Promise<{ revision: RevisionRequest; remainingRevisions: number }>;
  updateRevisionStatus(
    projectId: string,
    revisionId: string,
    status: RevisionStatus
  ): Promise<void>;

  // Selections & Approval
  updateSelection(
    projectId: string,
    conceptId: string,
    selectionType: SelectionType,
    reason?: string,
    itemId?: string
  ): Promise<Selection>;
  cancelItemSelection(
    projectId: string,
    itemId: string
  ): Promise<{ refundedTokens: number; hasAdminChecked: boolean }>;
  approveFinalProject(projectId: string, conceptId?: string): Promise<void>;

  // Activity Logs
  logActivity(
    projectId: string,
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void>;

  // Worldcup
  saveWorldcupResult(
    projectId: string,
    conceptId: string,
    participantName?: string,
    itemId?: string
  ): Promise<void>;

  // Estimate (견적서 관리)
  updateProjectEstimate(projectId: string, estimate: ProjectEstimate): Promise<ProjectEstimate>;

  // Feedback Tokens (피드백 토큰 관리)
  useFeedbackToken(projectId: string): Promise<{ remainingTokens: number; usedTokens: number }>;
  addFeedbackTokens(projectId: string, amount: number): Promise<number>;
  addRevisionCount(projectId: string, amount: number): Promise<number>;

  // Studio Profile (디자인 업체 로고 및 견적 공급자 정보 전역 관리)
  getStudioProfile(): Promise<StudioProfile>;
  updateStudioProfile(updates: Partial<StudioProfile>): Promise<StudioProfile>;

  // Demo reset
  resetDemoData(): Promise<void>;

  // Local recovery & sync
  recoverLocalData(): Promise<{ recoveredProjectsCount: number; recoveredCompaniesCount: number; recoveredStudioName?: string }>;
}
