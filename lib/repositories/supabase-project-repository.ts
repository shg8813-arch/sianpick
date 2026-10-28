import { IProjectRepository } from './project-repository';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DemoProjectRepository } from './demo-project-repository';
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

export class SupabaseProjectRepository implements IProjectRepository {
  private fallbackRepo = new DemoProjectRepository();

  private checkConfigured(): boolean {
    return Boolean(isSupabaseConfigured && supabase);
  }

  async resetDemoData(): Promise<void> {
    return this.fallbackRepo.resetDemoData();
  }

  // Company management
  async getCompanies(): Promise<Company[]> {
    return this.fallbackRepo.getCompanies();
  }

  async getCompanyById(id: string): Promise<Company | null> {
    return this.fallbackRepo.getCompanyById(id);
  }

  async createCompany(data: {
    name: string;
    contactPerson: string;
    email?: string;
    phone?: string;
    memo?: string;
  }): Promise<Company> {
    return this.fallbackRepo.createCompany(data);
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    return this.fallbackRepo.updateCompany(id, updates);
  }

  async deleteCompany(id: string): Promise<void> {
    return this.fallbackRepo.deleteCompany(id);
  }

  // Design Items
  async addDesignItem(projectId: string, data: { name: string; description?: string; worldcupEnabled?: boolean }): Promise<DesignItem> {
    return this.fallbackRepo.addDesignItem(projectId, data);
  }

  async updateDesignItem(projectId: string, itemId: string, updates: Partial<DesignItem>): Promise<DesignItem> {
    return this.fallbackRepo.updateDesignItem(projectId, itemId, updates);
  }

  async deleteDesignItem(projectId: string, itemId: string): Promise<void> {
    return this.fallbackRepo.deleteDesignItem(projectId, itemId);
  }

  async getProjects(): Promise<Project[]> {
    if (!this.checkConfigured()) return this.fallbackRepo.getProjects();
    try {
      const { data, error } = await supabase!
        .from('projects')
        .select('*, concepts(*), comments(*), revision_requests(*), selections(*), activity_logs(*)')
        .order('created_at', { ascending: false });

      if (error || !data) throw error;
      return data.map((p) => this.mapProjectFromDb(p));
    } catch {
      return this.fallbackRepo.getProjects();
    }
  }

  async getProjectsByCompany(companyId: string): Promise<Project[]> {
    return this.fallbackRepo.getProjectsByCompany(companyId);
  }

  async getProjectById(id: string): Promise<Project | null> {
    if (!this.checkConfigured()) return this.fallbackRepo.getProjectById(id);
    try {
      const { data, error } = await supabase!
        .from('projects')
        .select(`
          *,
          concepts(*, versions:concept_versions(*)),
          comments(*),
          revision_requests(*),
          selections(*),
          activity_logs(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) return this.fallbackRepo.getProjectById(id);
      return this.mapProjectFromDb(data);
    } catch {
      return this.fallbackRepo.getProjectById(id);
    }
  }

  async getProjectByShareToken(token: string): Promise<Project | null> {
    if (!this.checkConfigured()) return this.fallbackRepo.getProjectByShareToken(token);
    try {
      const { data, error } = await supabase!
        .from('projects')
        .select(`
          *,
          concepts(*, versions:concept_versions(*)),
          comments(*),
          revision_requests(*),
          selections(*),
          activity_logs(*)
        `)
        .eq('share_token', token)
        .single();

      if (error || !data) return this.fallbackRepo.getProjectByShareToken(token);
      return this.mapProjectFromDb(data);
    } catch {
      return this.fallbackRepo.getProjectByShareToken(token);
    }
  }

  async createProject(data: {
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
  }): Promise<Project> {
    if (!this.checkConfigured()) return this.fallbackRepo.createProject(data);
    try {
      const { data: user } = await supabase!.auth.getUser();
      const ownerId = user?.user?.id || 'demo-designer-id';

      const { data: row, error } = await supabase!
        .from('projects')
        .insert({
          owner_id: ownerId,
          title: data.title,
          client_name: data.clientName,
          client_email: data.clientEmail,
          description: data.description,
          due_date: data.dueDate,
          max_revision_count: data.maxRevisionCount,
          max_selection_count: data.maxSelectionCount,
          watermark_enabled: data.watermarkEnabled,
          download_enabled: data.downloadEnabled,
          share_expires_at: data.shareExpiresAt,
          share_password_hash: data.sharePasswordHash,
        })
        .select()
        .single();

      if (error || !row) throw error;
      return this.mapProjectFromDb(row);
    } catch {
      return this.fallbackRepo.createProject(data);
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (!this.checkConfigured()) return this.fallbackRepo.updateProject(id, updates);
    return this.fallbackRepo.updateProject(id, updates);
  }

  async deleteProject(id: string): Promise<void> {
    if (!this.checkConfigured()) return this.fallbackRepo.deleteProject(id);
    await supabase!.from('projects').delete().eq('id', id);
  }

  async addConcept(
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
    }
  ): Promise<Concept> {
    return this.fallbackRepo.addConcept(projectId, data);
  }

  async addConceptsBatch(
    projectId: string,
    concepts: Array<{
      itemId?: string;
      title?: string;
      description?: string;
      thumbnailUrl: string;
      isPublic?: boolean;
    }>
  ): Promise<Concept[]> {
    return this.fallbackRepo.addConceptsBatch(projectId, concepts);
  }

  async updateConcept(projectId: string, conceptId: string, updates: Partial<Concept>): Promise<Concept> {
    return this.fallbackRepo.updateConcept(projectId, conceptId, updates);
  }

  async deleteConcept(projectId: string, conceptId: string): Promise<void> {
    return this.fallbackRepo.deleteConcept(projectId, conceptId);
  }

  async reorderConcepts(projectId: string, conceptIds: string[]): Promise<void> {
    return this.fallbackRepo.reorderConcepts(projectId, conceptIds);
  }

  async addConceptVersion(
    projectId: string,
    conceptId: string,
    data: { imageUrl: string; changeSummary?: string; revisionRequestId?: string; isFinal?: boolean }
  ): Promise<ConceptVersion> {
    return this.fallbackRepo.addConceptVersion(projectId, conceptId, data);
  }

  async addComment(commentData: Omit<PinComment, 'id' | 'createdAt'>): Promise<PinComment> {
    return this.fallbackRepo.addComment(commentData);
  }

  async updateCommentStatus(projectId: string, commentId: string, status: 'open' | 'resolved'): Promise<void> {
    return this.fallbackRepo.updateCommentStatus(projectId, commentId, status);
  }

  async submitRevisionRequest(
    projectId: string,
    content: string
  ): Promise<{ revision: RevisionRequest; remainingRevisions: number }> {
    return this.fallbackRepo.submitRevisionRequest(projectId, content);
  }

  async updateRevisionStatus(projectId: string, revisionId: string, status: RevisionStatus): Promise<void> {
    return this.fallbackRepo.updateRevisionStatus(projectId, revisionId, status);
  }

  async updateSelection(
    projectId: string,
    conceptId: string,
    selectionType: SelectionType,
    reason?: string,
    itemId?: string
  ): Promise<Selection> {
    return this.fallbackRepo.updateSelection(projectId, conceptId, selectionType, reason, itemId);
  }

  async cancelItemSelection(
    projectId: string,
    itemId: string
  ): Promise<{ refundedTokens: number; hasAdminChecked: boolean }> {
    return this.fallbackRepo.cancelItemSelection(projectId, itemId);
  }

  async approveFinalProject(projectId: string, conceptId?: string): Promise<void> {
    return this.fallbackRepo.approveFinalProject(projectId, conceptId);
  }

  async logActivity(projectId: string, activityType: ActivityType, description: string, metadata?: Record<string, any>): Promise<void> {
    return this.fallbackRepo.logActivity(projectId, activityType, description, metadata);
  }

  async saveWorldcupResult(projectId: string, conceptId: string, participantName: string = '고객', itemId?: string): Promise<void> {
    return this.fallbackRepo.saveWorldcupResult(projectId, conceptId, participantName, itemId);
  }

  async reorderDesignItems(projectId: string, itemIds: string[]): Promise<void> {
    return this.fallbackRepo.reorderDesignItems(projectId, itemIds);
  }

  async updateProjectEstimate(projectId: string, estimate: any): Promise<any> {
    return this.fallbackRepo.updateProjectEstimate(projectId, estimate);
  }

  async useFeedbackToken(projectId: string): Promise<{ remainingTokens: number; usedTokens: number }> {
    return this.fallbackRepo.useFeedbackToken(projectId);
  }

  async addFeedbackTokens(projectId: string, amount: number): Promise<number> {
    return this.fallbackRepo.addFeedbackTokens(projectId, amount);
  }

  async addRevisionCount(projectId: string, amount: number): Promise<number> {
    return this.fallbackRepo.addRevisionCount(projectId, amount);
  }

  private mapProjectFromDb(row: any): Project {
    return {
      id: row.id,
      companyId: row.company_id,
      ownerId: row.owner_id,
      title: row.title,
      clientName: row.client_name,
      clientEmail: row.client_email,
      description: row.description,
      status: row.status,
      dueDate: row.due_date,
      maxRevisionCount: row.max_revision_count,
      usedRevisionCount: row.used_revision_count,
      maxSelectionCount: row.max_selection_count,
      shareToken: row.share_token,
      sharePasswordHash: row.share_password_hash,
      shareExpiresAt: row.share_expires_at,
      watermarkEnabled: row.watermark_enabled,
      downloadEnabled: row.download_enabled,
      worldcupEnabled: row.worldcup_enabled ?? true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      designItems: row.design_items || [],
      concepts: (row.concepts || []).map((c: any) => ({
        id: c.id,
        projectId: c.project_id,
        itemId: c.item_id,
        title: c.title,
        description: c.description,
        designConcept: c.design_concept,
        colorFontDescription: c.color_font_description,
        usageRecommendation: c.usage_recommendation,
        thumbnailUrl: c.thumbnail_url,
        displayOrder: c.display_order,
        isPublic: c.is_public,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        versions: (c.versions || []).map((v: any) => ({
          id: v.id,
          conceptId: v.concept_id,
          versionNumber: v.version_number,
          imageUrl: v.image_url,
          changeSummary: v.change_summary,
          revisionRequestId: v.revision_request_id,
          isFinal: v.is_final,
          createdAt: v.created_at,
        })),
      })),
      comments: row.comments || [],
      revisionRequests: row.revision_requests || [],
      selections: row.selections || [],
      activityLogs: row.activity_logs || [],
    };
  }

  async getStudioProfile(): Promise<StudioProfile> {
    return this.fallbackRepo.getStudioProfile();
  }

  async updateStudioProfile(updates: Partial<StudioProfile>): Promise<StudioProfile> {
    return this.fallbackRepo.updateStudioProfile(updates);
  }
}
