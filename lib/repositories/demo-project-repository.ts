import { IProjectRepository } from './project-repository';
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
  ActivityLog,
  RevisionStatus,
  ProjectEstimate,
  StudioProfile,
} from '@/types';
import { INITIAL_DEMO_PROJECT, INITIAL_TATTOO_PROJECT, INITIAL_COMPANIES, INITIAL_CONCEPTS, INITIAL_ESTIMATE, INITIAL_STUDIO_PROFILE } from '@/lib/demo/sample-data';
import { idbGet, idbSet } from '@/lib/utils/idb-storage';

const STORAGE_KEY = 'sianpick_projects_store_v8';
const STORAGE_KEY_V7 = 'sianpick_projects_store_v7';
const STORAGE_KEY_V6 = 'sianpick_projects_store_v6';
const STORAGE_KEY_V5 = 'sianpick_projects_store_v5';
const STORAGE_KEY_V4 = 'sianpick_projects_store_v4';
const STORAGE_KEY_V3 = 'sianpick_projects_store_v3';
const STORAGE_KEY_V2 = 'sianpick_projects_store_v2';
const STORAGE_KEY_V1 = 'sianpick_projects_store_v1';
const COMPANIES_KEY = 'sianpick_companies_store_v4';
const COMPANIES_KEY_V3 = 'sianpick_companies_store_v3';
const COMPANIES_KEY_V2 = 'sianpick_companies_store_v2';
const COMPANIES_KEY_V1 = 'sianpick_companies_store_v1';
const STUDIO_PROFILE_KEY = 'sianpick_studio_profile_v1';

export class DemoProjectRepository implements IProjectRepository {
  private memoryCache: Map<string, Project[]> = new Map();

  private getStorageKey(): string {
    if (typeof window === 'undefined') return STORAGE_KEY;
    try {
      const userStr = window.localStorage.getItem('sianpick_current_user_session');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id && user.id !== 'demo-designer') {
          return `sianpick_projects_${user.id}_v8`;
        }
      }
    } catch {}
    return STORAGE_KEY;
  }

  private getCompaniesKey(): string {
    if (typeof window === 'undefined') return COMPANIES_KEY;
    try {
      const userStr = window.localStorage.getItem('sianpick_current_user_session');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id && user.id !== 'demo-designer') {
          return `sianpick_companies_${user.id}_v4`;
        }
      }
    } catch {}
    return COMPANIES_KEY;
  }

  private getStudioProfileKey(): string {
    if (typeof window === 'undefined') return STUDIO_PROFILE_KEY;
    try {
      const userStr = window.localStorage.getItem('sianpick_current_user_session');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id && user.id !== 'demo-designer') {
          return `sianpick_studio_profile_${user.id}_v1`;
        }
      }
    } catch {}
    return STUDIO_PROFILE_KEY;
  }

  private async ensureIdbSynced(): Promise<void> {
    if (typeof window === 'undefined') return;
    const currentKey = this.getStorageKey();
    if (this.memoryCache.has(currentKey)) return;
    try {
      const idbData = await idbGet<Project[]>(currentKey);
      if (idbData && Array.isArray(idbData) && idbData.length > 0) {
        this.memoryCache.set(currentKey, idbData);
      }
    } catch {}
  }

  private getStorage(): Project[] {
    if (typeof window === 'undefined') {
      return [INITIAL_DEMO_PROJECT];
    }
    const currentKey = this.getStorageKey();
    if (this.memoryCache.has(currentKey)) {
      return this.memoryCache.get(currentKey)!;
    }
    try {
      let raw = window.localStorage.getItem(currentKey);
      if (!raw) {
        // If this is a specific user key that doesn't exist yet, seed with their initial sample project
        if (currentKey !== STORAGE_KEY) {
          const userStr = window.localStorage.getItem('sianpick_current_user_session');
          let studioName = '내 디자인 스튜디오';
          let designerName = '디자이너';
          if (userStr) {
            try {
              const u = JSON.parse(userStr);
              if (u.studioName) studioName = u.studioName;
              if (u.name) designerName = u.name;
            } catch {}
          }
          const userInitialProject: Project = {
            ...INITIAL_DEMO_PROJECT,
            id: `proj-${Date.now()}`,
            title: `${studioName} 첫 시안 프로젝트`,
            clientName: `${designerName} 고객사`,
            companyName: `${designerName} 파트너스`,
            shareToken: `share-${Math.random().toString(36).substring(2, 10)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const userProjects = [userInitialProject];
          window.localStorage.setItem(currentKey, JSON.stringify(userProjects));
          return userProjects;
        }

        // Default legacy migration for demo
        const prevRaw =
          window.localStorage.getItem(STORAGE_KEY_V4) ||
          window.localStorage.getItem(STORAGE_KEY_V3) ||
          window.localStorage.getItem(STORAGE_KEY_V2) ||
          window.localStorage.getItem(STORAGE_KEY_V1);
        let projects: Project[] = [INITIAL_DEMO_PROJECT, INITIAL_TATTOO_PROJECT];
        if (prevRaw) {
          try {
            const list: Project[] = JSON.parse(prevRaw);
            const userCustomProjects = list.filter(
              (p) => p.id !== 'demo-project-lumiere' && p.id !== 'demo-project-urbanforest' && p.id !== 'demo-project-runofthemill' && p.id !== 'demo-project-tattoo-noir'
            );
            projects = [INITIAL_DEMO_PROJECT, INITIAL_TATTOO_PROJECT, ...userCustomProjects];
          } catch {
            // ignore
          }
        }
        projects = projects.map((p) => {
          const updated = { ...p };
          const itemCount = updated.designItems?.length || 1;
          if (p.id === 'demo-project-urbanforest' || p.id === 'demo-project-runofthemill' || p.title.includes('어반 포레스트') || p.title.includes('런오브더밀')) {
            updated.estimate = updated.estimate || INITIAL_ESTIMATE;
            updated.feedbackTokensTotal = 15; // 3항목 * 5
            updated.maxRevisionCount = 9; // 3항목 * 3
          } else {
            updated.feedbackTokensTotal = updated.feedbackTokensTotal ?? itemCount * 5;
            updated.maxRevisionCount = updated.maxRevisionCount ?? itemCount * 3;
          }
          updated.feedbackTokensUsed = updated.feedbackTokensUsed ?? (updated.comments?.filter((c) => c.authorType === 'client').length || 0);
          return updated;
        });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return projects;
      }

      let projects: Project[] = JSON.parse(raw);
      let modified = false;

      // Sanitize legacy "runofthemill" projects in user's localStorage
      projects = projects.map((p) => {
        if (p.id === 'demo-project-runofthemill' || p.title.includes('런오브더밀') || p.companyName?.includes('런오브더밀')) {
          modified = true;
          return {
            ...INITIAL_DEMO_PROJECT,
            title: p.title.includes('런오브더밀') ? p.title.replace(/런오브더밀/g, '어반 포레스트') : INITIAL_DEMO_PROJECT.title,
            companyName: p.companyName === '런오브더밀' ? '어반 포레스트' : p.companyName,
          };
        }
        return p;
      });

      // Ensure INITIAL_DEMO_PROJECT and INITIAL_TATTOO_PROJECT are present or updated in demo mode
      if (currentKey === STORAGE_KEY) {
        const hasUrbanForest = projects.some(
          (p) => p.id === 'demo-project-urbanforest' || p.title.includes('어반 포레스트')
        );
        if (!hasUrbanForest) {
          projects.unshift(INITIAL_DEMO_PROJECT);
          modified = true;
        }

        const hasTattooProject = projects.some(
          (p) => p.id === 'demo-project-tattoo-noir' || p.title.includes('느와르 잉크')
        );
        if (!hasTattooProject) {
          projects.push(INITIAL_TATTOO_PROJECT);
          modified = true;
        }
      }
      
      // Clean up any previously auto-generated dummy concepts from user-created design items
      projects = projects.map((p) => {
        if (p.concepts && p.concepts.some((c) => c.title.includes('비주얼 제안') && c.description?.includes('테스트 시안입니다'))) {
          modified = true;
          return {
            ...p,
            concepts: p.concepts.filter(
              (c) => !(c.title.includes('비주얼 제안') && c.description?.includes('테스트 시안입니다'))
            ),
          };
        }
        return p;
      });

      // Ensure all projects have token counts and estimate
      projects = projects.map((p) => {
        let updated = { ...p };
        const itemCount = updated.designItems?.length || 1;
        if ((p.id === 'demo-project-urbanforest' || p.id === 'demo-project-runofthemill' || p.title.includes('어반 포레스트') || p.title.includes('런오브더밀')) && !updated.estimate) {
          updated = { ...updated, estimate: INITIAL_ESTIMATE };
          modified = true;
        }
        if (updated.feedbackTokensTotal === undefined || updated.feedbackTokensTotal === 20) {
          updated = { ...updated, feedbackTokensTotal: itemCount * 5 };
          modified = true;
        }
        if (updated.maxRevisionCount === undefined || updated.maxRevisionCount === 3) {
          updated = { ...updated, maxRevisionCount: itemCount * 3 };
          modified = true;
        }
        if (updated.feedbackTokensUsed === undefined) {
          const clientCommentCount = updated.comments?.filter((c) => c.authorType === 'client').length || 0;
          updated = { ...updated, feedbackTokensUsed: clientCommentCount };
          modified = true;
        }
        if (updated !== p) modified = true;
        return updated;
      });

      if (modified) {
        this.saveStorage(projects);
      }
      this.memoryCache.set(currentKey, projects);
      return projects;
    } catch (e) {
      console.warn('Failed to read from localStorage, using in-memory demo data', e);
      return [INITIAL_DEMO_PROJECT];
    }
  }

  private cleanupLegacyStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove = [
        STORAGE_KEY_V7,
        STORAGE_KEY_V6,
        STORAGE_KEY_V5,
        STORAGE_KEY_V4,
        STORAGE_KEY_V3,
        STORAGE_KEY_V2,
        STORAGE_KEY_V1,
        COMPANIES_KEY_V3,
        COMPANIES_KEY_V2,
        COMPANIES_KEY_V1,
      ];
      for (const k of keysToRemove) {
        window.localStorage.removeItem(k);
      }
    } catch {}
  }

  private updateProjectInMemoryAndLocal(project: Project): void {
    const projects = this.getStorage();
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.unshift(project);
    }
    const currentKey = this.getStorageKey();
    this.memoryCache.set(currentKey, projects);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(currentKey, JSON.stringify(projects));
      } catch {}
      idbSet(currentKey, projects).catch(() => {});
    }
  }

  private saveStorage(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    this.cleanupLegacyStorage();
    const currentKey = this.getStorageKey();

    // 1. Immediately update in-memory cache for fast synchronous reads
    this.memoryCache.set(currentKey, projects);

    // 2. Persist to IndexedDB (asynchronously, with virtually unlimited quota)
    idbSet(currentKey, projects).catch((e) => {
      console.warn('IndexedDB persistence warning:', e);
    });

    // 3. Attempt to sync to localStorage
    try {
      window.localStorage.setItem(currentKey, JSON.stringify(projects));
    } catch (e) {
      console.warn('localStorage quota warning (IndexedDB used as primary store):', e);
      try {
        this.cleanupLegacyStorage();
        window.localStorage.setItem(currentKey, JSON.stringify(projects));
      } catch (err) {
        // If localStorage is full, IndexedDB has already persisted it, so we do not crash
        console.info('Projects persisted in IndexedDB and in-memory cache successfully.');
      }
    }

    // 4. Asynchronously persist to Next.js server storage via API
    try {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', projects }),
      }).catch(() => {});
    } catch {}
  }

  private getCompaniesStorage(): Company[] {
    if (typeof window === 'undefined') {
      return INITIAL_COMPANIES;
    }
    const currentKey = this.getCompaniesKey();
    try {
      const item = window.localStorage.getItem(currentKey);
      if (!item) {
        window.localStorage.setItem(currentKey, JSON.stringify(INITIAL_COMPANIES));
        return INITIAL_COMPANIES;
      }
      let list: Company[] = JSON.parse(item);
      let compModified = false;
      list = list.map((c) => {
        if (c.id === 'company-runofthemill' || c.name.includes('런오브더밀')) {
          compModified = true;
          return INITIAL_COMPANIES[0];
        }
        return c;
      });
      if (currentKey === COMPANIES_KEY && !list.some((c) => c.id === 'company-urbanforest' || c.name.includes('어반 포레스트'))) {
        const merged = [...INITIAL_COMPANIES, ...list.filter((c) => c.id !== 'company-lumiere' && c.id !== 'company-runofthemill')];
        window.localStorage.setItem(currentKey, JSON.stringify(merged));
        return merged;
      }
      if (currentKey === COMPANIES_KEY && !list.some((c) => c.id === 'company-tattoo-client')) {
        const tattooComp = INITIAL_COMPANIES.find((c) => c.id === 'company-tattoo-client');
        if (tattooComp) {
          list.push(tattooComp);
          compModified = true;
        }
      }
      if (compModified) {
        window.localStorage.setItem(currentKey, JSON.stringify(list));
      }
      return list;
    } catch {
      return INITIAL_COMPANIES;
    }
  }

  private saveCompaniesStorage(companies: Company[]): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(this.getCompaniesKey(), JSON.stringify(companies));
      fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', companies }),
      }).catch(() => {});
    } catch (e) {
      console.error('Failed to save companies to localStorage', e);
    }
  }

  async resetDemoData(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_DEMO_PROJECT]));
      window.localStorage.setItem(COMPANIES_KEY, JSON.stringify(INITIAL_COMPANIES));
    }
  }

  // Company management
  async getCompanies(): Promise<Company[]> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.companies)) {
            const currentKey = this.getCompaniesKey();
            window.localStorage.setItem(currentKey, JSON.stringify(data.companies));
            return data.companies;
          }
        }
      } catch {}
    }
    return this.getCompaniesStorage();
  }

  async getCompanyById(id: string): Promise<Company | null> {
    const list = await this.getCompanies();
    return list.find((c) => c.id === id) || null;
  }

  async createCompany(data: {
    name: string;
    contactPerson: string;
    email?: string;
    phone?: string;
    memo?: string;
  }): Promise<Company> {
    const companies = await this.getCompanies();
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: data.name,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      memo: data.memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    companies.unshift(newCompany);
    this.saveCompaniesStorage(companies);
    return newCompany;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    const companies = await this.getCompanies();
    const idx = companies.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('업체를 찾을 수 없습니다.');
    companies[idx] = {
      ...companies[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveCompaniesStorage(companies);
    return companies[idx];
  }

  async deleteCompany(id: string): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        fetch(`/api/companies?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
      } catch {}
    }
    const companies = await this.getCompanies();
    const filtered = companies.filter((c) => c.id !== id);
    this.saveCompaniesStorage(filtered);
  }

  // Projects
  private hasInitiallySyncedServer = false;

  async getProjects(): Promise<Project[]> {
    await this.ensureIdbSynced();
    const local = this.getStorage();

    if (typeof window !== 'undefined') {
      try {
        // On first run, upload any local projects that might not be on the server yet
        if (!this.hasInitiallySyncedServer && local.length > 0) {
          this.hasInitiallySyncedServer = true;
          const syncRes = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'sync', projects: local }),
          });
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.success && Array.isArray(syncData.projects)) {
              this.saveStorage(syncData.projects);
              return syncData.projects;
            }
          }
        }

        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.projects)) {
            const serverProjects: Project[] = data.projects;
            this.saveStorage(serverProjects);
            return serverProjects;
          }
        }
      } catch (e) {
        console.warn('Server fetch projects failed, using local storage fallback', e);
      }
    }

    return local;
  }

  async getProjectsByCompany(companyId: string): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter((p) => p.companyId === companyId);
  }

  async getProjectById(id: string): Promise<Project | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/projects/${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.project) {
            this.updateProjectInMemoryAndLocal(data.project);
            return data.project;
          }
        }
      } catch {}
    }

    await this.ensureIdbSynced();
    const projects = this.getStorage();
    let proj = projects.find((p) => p.id === id);
    if (!proj && typeof window !== 'undefined') {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('sianpick_projects_') && k !== this.getStorageKey()) {
            const raw = window.localStorage.getItem(k);
            if (raw) {
              const list: Project[] = JSON.parse(raw);
              const found = list.find((p) => p.id === id);
              if (found) {
                proj = found;
                break;
              }
            }
          }
        }
      } catch {}
    }
    if (!proj && id === 'demo-project-tattoo-noir') {
      proj = projects.find((p) => p.id === 'demo-project-tattoo-noir') || INITIAL_TATTOO_PROJECT;
    }
    if (!proj && (id === 'demo-project-urbanforest' || id === 'sample-urban-roasters' || id === 'demo-project-lumiere' || id === 'demo-project-runofthemill')) {
      proj = projects.find((p) => p.id === 'demo-project-urbanforest' || p.id === 'demo-project-runofthemill' || p.title.includes('어반 포레스트') || p.title.includes('런오브더밀')) || projects[0] || null;
    }
    return proj || null;
  }

  async getProjectByShareToken(token: string): Promise<Project | null> {
    // 1. Try server first (essential for other PCs, mobile devices, and client links!)
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/projects/share/${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.project) {
            this.updateProjectInMemoryAndLocal(data.project);
            return data.project;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch project by shareToken from server, using local fallback', e);
      }
    }

    // 2. Local fallback
    await this.ensureIdbSynced();
    const projects = this.getStorage();
    let proj = projects.find((p) => p.shareToken === token);
    if (!proj && typeof window !== 'undefined') {
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('sianpick_projects_') && k !== this.getStorageKey()) {
            const raw = window.localStorage.getItem(k);
            if (raw) {
              const list: Project[] = JSON.parse(raw);
              const found = list.find((p) => p.shareToken === token);
              if (found) {
                proj = found;
                break;
              }
            }
          }
        }
      } catch {}
    }
    if (!proj && token === 'tattoo-noir-sample') {
      proj = projects.find((p) => p.shareToken === 'tattoo-noir-sample') || INITIAL_TATTOO_PROJECT;
    }
    if (!proj && (token === 'urbanforest-sample-2026' || token === 'runofthemill-sample-2026' || token === 'lumiere-sample-2026' || token === 'share-urban-sample-01')) {
      proj = projects.find((p) => p.id === 'demo-project-urbanforest' || p.id === 'demo-project-runofthemill' || p.title.includes('어반 포레스트') || p.title.includes('런오브더밀')) || projects[0] || null;
    }
    return proj || null;
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
    const projects = this.getStorage();
    const newId = `proj-${Date.now()}`;
    const token = `share-${Math.random().toString(36).substring(2, 10)}`;

    let companyName = data.clientName;
    if (data.companyId) {
      const comp = await this.getCompanyById(data.companyId);
      if (comp) companyName = comp.name;
    }

    const newProject: Project = {
      id: newId,
      companyId: data.companyId,
      companyName,
      ownerId: 'demo-designer-id',
      title: data.title,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      description: data.description,
      status: 'in_review',
      dueDate: data.dueDate,
      maxRevisionCount: data.maxRevisionCount || 3,
      usedRevisionCount: 0,
      maxSelectionCount: data.maxSelectionCount || 1,
      shareToken: token,
      shareExpiresAt: data.shareExpiresAt,
      sharePasswordHash: data.sharePasswordHash,
      watermarkEnabled: !!data.watermarkEnabled,
      downloadEnabled: data.downloadEnabled !== false,
      worldcupEnabled: data.worldcupEnabled ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designItems: [],
      concepts: [],
      comments: [],
      revisionRequests: [],
      selections: [],
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          projectId: newId,
          activityType: 'page_view',
          description: '프로젝트가 생성되었습니다.',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    projects.unshift(newProject);
    this.saveStorage(projects);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const projects = this.getStorage();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('프로젝트를 찾을 수 없습니다.');

    projects[idx] = {
      ...projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveStorage(projects);
    return projects[idx];
  }

  async deleteProject(id: string): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
      } catch {}
    }
    const projects = this.getStorage().filter((p) => p.id !== id);
    this.saveStorage(projects);
  }

  // Design Items
  async addDesignItem(
    projectId: string,
    data: { name: string; description?: string; worldcupEnabled?: boolean }
  ): Promise<DesignItem> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const newItem: DesignItem = {
      id: `item-${Date.now()}`,
      projectId,
      name: data.name.trim(),
      description: data.description?.trim(),
      displayOrder: (project.designItems?.length || 0) + 1,
      worldcupEnabled: data.worldcupEnabled ?? true,
      createdAt: new Date().toISOString(),
    };

    project.designItems = [...(project.designItems || []), newItem];
    // 디자인항목당 5개 토큰 및 3회 수정횟수 추가
    project.feedbackTokensTotal = (project.feedbackTokensTotal || 0) + 5;
    project.maxRevisionCount = (project.maxRevisionCount || 0) + 3;
    this.saveStorage(projects);
    return newItem;
  }

  async updateDesignItem(
    projectId: string,
    itemId: string,
    updates: Partial<DesignItem>
  ): Promise<DesignItem> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.designItems) throw new Error('디자인 항목을 찾을 수 없습니다.');

    const idx = project.designItems.findIndex((item) => item.id === itemId);
    if (idx === -1) throw new Error('디자인 항목을 찾을 수 없습니다.');

    project.designItems[idx] = {
      ...project.designItems[idx],
      ...updates,
    };
    this.saveStorage(projects);
    return project.designItems[idx];
  }

  async deleteDesignItem(projectId: string, itemId: string): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.designItems) return;

    project.designItems = project.designItems.filter((item) => item.id !== itemId);
    if (project.concepts) {
      project.concepts = project.concepts.filter((c) => c.itemId !== itemId);
    }
    project.feedbackTokensTotal = Math.max(5, (project.feedbackTokensTotal || 5) - 5);
    project.maxRevisionCount = Math.max(3, (project.maxRevisionCount || 3) - 3);
    this.saveStorage(projects);
  }

  async reorderDesignItems(projectId: string, itemIds: string[]): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.designItems) return;

    const itemMap = new Map(project.designItems.map((item) => [item.id, item]));
    project.designItems = itemIds
      .map((id, index) => {
        const item = itemMap.get(id);
        if (item) item.displayOrder = index + 1;
        return item;
      })
      .filter((item): item is DesignItem => !!item);

    this.saveStorage(projects);
  }

  // Concepts
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
      linkEnabled?: boolean;
      linkTitle?: string;
      linkUrl?: string;
    }
  ): Promise<Concept> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    // Ensure valid target itemId
    let targetItemId = data.itemId;
    if (!targetItemId && project.designItems && project.designItems.length > 0) {
      targetItemId = project.designItems[0].id;
    }

    const newConceptId = `concept-${Date.now()}`;
    const nextOrder = data.displayOrder ?? ((project.concepts?.length || 0) + 1);
    const cleanTitle = data.title?.trim() || '';

    const newConcept: Concept = {
      id: newConceptId,
      projectId,
      itemId: targetItemId,
      title: cleanTitle,
      description: data.description?.trim(),
      designConcept: data.designConcept?.trim(),
      colorFontDescription: data.colorFontDescription?.trim(),
      usageRecommendation: data.usageRecommendation?.trim(),
      thumbnailUrl: data.thumbnailUrl,
      displayOrder: nextOrder,
      isPublic: data.isPublic ?? true,
      linkEnabled: data.linkEnabled ?? false,
      linkTitle: data.linkTitle?.trim(),
      linkUrl: data.linkUrl?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [
        {
          id: `ver-${Date.now()}`,
          conceptId: newConceptId,
          versionNumber: 1,
          imageUrl: data.thumbnailUrl,
          changeSummary: '최초 등록 시안',
          isFinal: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    project.concepts = [...(project.concepts || []), newConcept];
    this.saveStorage(projects);
    return newConcept;
  }

  async addConceptsBatch(
    projectId: string,
    conceptsData: Array<{
      itemId?: string;
      title?: string;
      description?: string;
      thumbnailUrl: string;
      isPublic?: boolean;
    }>
  ): Promise<Concept[]> {
    await this.ensureIdbSynced();
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    let targetItemId = conceptsData[0]?.itemId;
    if (!targetItemId && project.designItems && project.designItems.length > 0) {
      targetItemId = project.designItems[0].id;
    }

    const currentLength = project.concepts?.length || 0;
    const now = Date.now();
    const newConcepts: Concept[] = conceptsData.map((data, idx) => {
      const newConceptId = `concept-${now}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
      const nextOrder = currentLength + idx + 1;
      return {
        id: newConceptId,
        projectId,
        itemId: data.itemId || targetItemId,
        title: data.title?.trim() || '',
        description: data.description?.trim(),
        thumbnailUrl: data.thumbnailUrl,
        displayOrder: nextOrder,
        isPublic: data.isPublic ?? true,
        linkEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: [
          {
            id: `ver-${now}-${idx}`,
            conceptId: newConceptId,
            versionNumber: 1,
            imageUrl: data.thumbnailUrl,
            changeSummary: '최초 등록 시안',
            isFinal: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });

    project.concepts = [...(project.concepts || []), ...newConcepts];
    this.saveStorage(projects);
    return newConcepts;
  }

  async updateConcept(
    projectId: string,
    conceptId: string,
    updates: Partial<Concept>
  ): Promise<Concept> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.concepts) throw new Error('시안을 찾을 수 없습니다.');

    const cIdx = project.concepts.findIndex((c) => c.id === conceptId);
    if (cIdx === -1) throw new Error('시안을 찾을 수 없습니다.');

    project.concepts[cIdx] = {
      ...project.concepts[cIdx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveStorage(projects);
    return project.concepts[cIdx];
  }

  async deleteConcept(projectId: string, conceptId: string): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.concepts) return;

    project.concepts = project.concepts.filter((c) => c.id !== conceptId);
    this.saveStorage(projects);
  }

  async reorderConcepts(projectId: string, conceptIds: string[]): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.concepts) return;

    const conceptMap = new Map(project.concepts.map((c) => [c.id, c]));
    conceptIds.forEach((id, index) => {
      const c = conceptMap.get(id);
      if (c) c.displayOrder = index + 1;
    });

    const reorderedSet = new Set(conceptIds);
    const reorderedList = conceptIds.map((id) => conceptMap.get(id)).filter((c): c is Concept => !!c);

    let reorderedIdx = 0;
    const finalConcepts: Concept[] = [];
    for (const c of project.concepts) {
      if (reorderedSet.has(c.id)) {
        if (reorderedIdx < reorderedList.length) {
          finalConcepts.push(reorderedList[reorderedIdx++]);
        }
      } else {
        finalConcepts.push(c);
      }
    }
    while (reorderedIdx < reorderedList.length) {
      finalConcepts.push(reorderedList[reorderedIdx++]);
    }

    project.concepts = finalConcepts;
    this.saveStorage(projects);
  }

  async addConceptVersion(
    projectId: string,
    conceptId: string,
    data: { imageUrl: string; changeSummary?: string; revisionRequestId?: string; isFinal?: boolean }
  ): Promise<ConceptVersion> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.concepts) throw new Error('프로젝트를 찾을 수 없습니다.');

    const concept = project.concepts.find((c) => c.id === conceptId);
    if (!concept) throw new Error('시안을 찾을 수 없습니다.');

    const currentVersions =
      concept.versions && concept.versions.length > 0
        ? [...concept.versions]
        : [
            {
              id: `ver-${conceptId}-1`,
              conceptId,
              versionNumber: 1,
              imageUrl: concept.thumbnailUrl,
              changeSummary: '1차 제안 시안',
              isFinal: false,
              createdAt: concept.createdAt || new Date().toISOString(),
            },
          ];

    const nextVerNumber = currentVersions.length + 1;
    const isFinalVersion = Boolean(data.isFinal);

    const newVersion: ConceptVersion = {
      id: `ver-${Date.now()}`,
      conceptId,
      versionNumber: nextVerNumber,
      imageUrl: data.imageUrl,
      changeSummary: data.changeSummary || (isFinalVersion ? '최종 확정 시안' : `v${nextVerNumber} 수정본`),
      revisionRequestId: data.revisionRequestId,
      isFinal: isFinalVersion,
      createdAt: new Date().toISOString(),
    };

    concept.versions = [...currentVersions, newVersion];
    concept.thumbnailUrl = data.imageUrl;
    concept.updatedAt = new Date().toISOString();

    const activityMessage = isFinalVersion
      ? `"${concept.title}"의 최종 확정 시안(FINAL)이 등록되었습니다.`
      : `"${concept.title}"의 새 수정본(v${nextVerNumber})이 등록되었습니다.`;

    await this.logActivity(projectId, 'version_add', activityMessage);

    this.saveStorage(projects);
    return newVersion;
  }

  async addComment(
    commentData: Omit<PinComment, 'id' | 'createdAt'>
  ): Promise<PinComment> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === commentData.projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const newComment: PinComment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    project.comments = [...(project.comments || []), newComment];
    if (commentData.authorType === 'client') {
      project.feedbackTokensUsed = (project.feedbackTokensUsed || 0) + 1;
    }
    this.saveStorage(projects);

    const concept = project.concepts?.find((c) => c.id === commentData.conceptId);
    await this.logActivity(
      project.id,
      'comment_create',
      `${commentData.authorName}(${commentData.authorType === 'client' ? '고객' : '디자이너'})님이 "${concept?.title || '시안'}"에 코멘트를 남겼습니다.`
    );

    return newComment;
  }

  async updateCommentStatus(
    projectId: string,
    commentId: string,
    status: 'open' | 'resolved'
  ): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.comments) return;

    const comment = project.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.status = status;
      this.saveStorage(projects);
    }
  }

  async submitRevisionRequest(
    projectId: string,
    content: string
  ): Promise<{ revision: RevisionRequest; remainingRevisions: number }> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const remaining = project.maxRevisionCount - project.usedRevisionCount;
    if (remaining <= 0) {
      throw new Error('기본 수정 횟수를 모두 사용했습니다.');
    }

    const nextRevNumber = project.usedRevisionCount + 1;
    const newRevision: RevisionRequest = {
      id: `rev-${Date.now()}`,
      projectId,
      revisionNumber: nextRevNumber,
      content,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    project.usedRevisionCount += 1;
    project.status = 'revising';
    project.revisionRequests = [...(project.revisionRequests || []), newRevision];

    await this.logActivity(
      projectId,
      'revision_submit',
      `고객이 제${nextRevNumber}차 수정 요청서를 제출했습니다. (잔여: ${project.maxRevisionCount - project.usedRevisionCount}회)`
    );

    this.saveStorage(projects);
    return {
      revision: newRevision,
      remainingRevisions: project.maxRevisionCount - project.usedRevisionCount,
    };
  }

  async updateRevisionStatus(
    projectId: string,
    revisionId: string,
    status: RevisionStatus
  ): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.revisionRequests) return;

    const rev = project.revisionRequests.find((r) => r.id === revisionId);
    if (rev) {
      rev.status = status;
      if (status === 'client_confirmed') {
        rev.completedAt = new Date().toISOString();
      }
      await this.logActivity(
        projectId,
        'revision_status_change',
        `제${rev.revisionNumber}차 수정 요청 상태가 [${status}]로 변경되었습니다.`
      );
      this.saveStorage(projects);
    }
  }

  async updateSelection(
    projectId: string,
    conceptId: string,
    selectionType: SelectionType,
    reason?: string,
    itemId?: string
  ): Promise<Selection> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const selections = project.selections || [];
    let existingIdx = -1;
    if (itemId) {
      existingIdx = selections.findIndex((s) => s.itemId === itemId);
    } else {
      existingIdx = selections.findIndex((s) => s.conceptId === conceptId);
    }

    const concept = project.concepts?.find((c) => c.id === conceptId);
    const targetItemId = itemId || concept?.itemId;

    if (existingIdx >= 0) {
      selections[existingIdx] = {
        ...selections[existingIdx],
        conceptId,
        itemId: targetItemId,
        selectionType,
        reason: reason || selections[existingIdx].reason,
        selectedAt: new Date().toISOString(),
      };
      this.saveStorage(projects);
      return selections[existingIdx];
    } else {
      const newSelection: Selection = {
        id: `sel-${Date.now()}`,
        projectId,
        itemId: targetItemId,
        conceptId,
        selectionType,
        reason,
        isFinal: false,
        selectedAt: new Date().toISOString(),
      };
      project.selections = [...selections, newSelection];

      await this.logActivity(
        projectId,
        'concept_select',
        `고객이 "${concept?.title || '시안'}"을(를) 선호 시안 후보로 선택했습니다.`
      );

      this.saveStorage(projects);
      return newSelection;
    }
  }

  async cancelItemSelection(
    projectId: string,
    itemId: string
  ): Promise<{ refundedTokens: number; hasAdminChecked: boolean }> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    // 1. Remove selection for this item
    const prevSelections = project.selections || [];
    project.selections = prevSelections.filter((s) => s.itemId !== itemId);

    // 2. Find feedbacks written by client for this item
    const itemConceptIds = (project.concepts || [])
      .filter((c) => c.itemId === itemId)
      .map((c) => c.id);
    const itemClientComments = (project.comments || []).filter(
      (c) =>
        (c.itemId === itemId || itemConceptIds.includes(c.conceptId)) &&
        c.authorType === 'client'
    );

    const hasAdminChecked = itemClientComments.some((c) => c.status === 'resolved');

    let refundedTokens = 0;
    if (hasAdminChecked) {
      refundedTokens = 0;
      await this.logActivity(
        projectId,
        'concept_select',
        '고객이 디자인 항목의 시안 선택을 취소했습니다. (관리자 확인 완료 피드백 존재로 토큰 미환급)'
      );
    } else {
      refundedTokens = itemClientComments.length;
      if (refundedTokens > 0) {
        const uncheckedCommentIds = new Set(itemClientComments.map((c) => c.id));
        project.comments = (project.comments || []).filter((c) => !uncheckedCommentIds.has(c.id));
        project.feedbackTokensUsed = Math.max(0, (project.feedbackTokensUsed || refundedTokens) - refundedTokens);
      }
      await this.logActivity(
        projectId,
        'concept_select',
        `고객이 디자인 항목의 시안 선택을 취소했습니다. (미확인 피드백 ${refundedTokens}건 취소 및 토큰 ${refundedTokens}개 자동 복구)`
      );
    }

    this.saveStorage(projects);
    return { refundedTokens, hasAdminChecked };
  }

  async approveFinalProject(projectId: string, conceptId?: string): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    project.status = 'approved';

    if (conceptId) {
      const concept = project.concepts?.find((c) => c.id === conceptId);
      project.selections = [
        {
          id: `sel-final-${Date.now()}`,
          projectId,
          itemId: concept?.itemId,
          conceptId,
          selectionType: 'final',
          isFinal: true,
          selectedAt: new Date().toISOString(),
        },
      ];
    } else {
      project.selections = (project.selections || []).map((s) => ({
        ...s,
        selectionType: 'final',
        isFinal: true,
      }));
    }

    await this.logActivity(
      projectId,
      'final_approve',
      `고객이 프로젝트의 최종 시안들을 확정 승인했습니다.`
    );

    this.saveStorage(projects);
  }

  async logActivity(
    projectId: string,
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      projectId,
      activityType,
      description,
      metadata,
      createdAt: new Date().toISOString(),
    };

    project.activityLogs = [newLog, ...(project.activityLogs || [])];
    this.saveStorage(projects);
  }

  async saveWorldcupResult(
    projectId: string,
    conceptId: string,
    participantName: string = '고객',
    itemId?: string
  ): Promise<void> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const concept = project.concepts?.find((c) => c.id === conceptId);
    const targetItemId = itemId || concept?.itemId;

    const selections = (project.selections || []).filter(
      (s) => !(s.selectionType === 'worldcup_winner' && s.itemId === targetItemId)
    );

    selections.push({
      id: `sel-wc-${Date.now()}`,
      projectId,
      itemId: targetItemId,
      conceptId,
      selectionType: 'worldcup_winner',
      reason: '시안 월드컵 최종 우승',
      isFinal: false,
      selectedAt: new Date().toISOString(),
    });
    project.selections = selections;

    await this.logActivity(
      projectId,
      'worldcup_complete',
      `${participantName}님이 시안 월드컵을 완료했습니다. 우승: "${concept?.title || '시안'}"`,
      { winnerId: conceptId, winnerTitle: concept?.title, itemId: targetItemId }
    );

    this.saveStorage(projects);
  }

  async updateProjectEstimate(projectId: string, estimate: ProjectEstimate): Promise<ProjectEstimate> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    project.estimate = {
      ...estimate,
      updatedAt: new Date().toISOString(),
    };
    this.saveStorage(projects);
    return project.estimate;
  }

  async useFeedbackToken(projectId: string): Promise<{ remainingTokens: number; usedTokens: number }> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const total = project.feedbackTokensTotal ?? 20;
    const currentUsed = project.feedbackTokensUsed ?? 0;
    const nextUsed = currentUsed + 1;

    project.feedbackTokensUsed = nextUsed;
    this.saveStorage(projects);

    return {
      remainingTokens: Math.max(0, total - nextUsed),
      usedTokens: nextUsed,
    };
  }

  async addFeedbackTokens(projectId: string, amount: number): Promise<number> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const newTotal = (project.feedbackTokensTotal || 0) + amount;
    project.feedbackTokensTotal = newTotal;
    this.saveStorage(projects);
    return newTotal;
  }

  async addRevisionCount(projectId: string, amount: number): Promise<number> {
    const projects = this.getStorage();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');

    const newMax = (project.maxRevisionCount || 0) + amount;
    project.maxRevisionCount = newMax;
    this.saveStorage(projects);
    return newMax;
  }

  // Studio Profile Management (대시보드 메인에서 관리되는 로고 & 견적 공급자 정보)
  async getStudioProfile(): Promise<StudioProfile> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/studio');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile) {
            const key = this.getStudioProfileKey();
            localStorage.setItem(key, JSON.stringify(data.profile));
            return data.profile;
          }
        }
      } catch {}
    }

    if (typeof window === 'undefined') return INITIAL_STUDIO_PROFILE;
    const key = this.getStudioProfileKey();
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      const userStr = localStorage.getItem('sianpick_current_user_session');
      let defaultStudioName = INITIAL_STUDIO_PROFILE.studioName;
      let defaultRep = INITIAL_STUDIO_PROFILE.representative;
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u.studioName) defaultStudioName = u.studioName;
          if (u.name) defaultRep = u.name;
        } catch {}
      }
      const initialProfile = {
        ...INITIAL_STUDIO_PROFILE,
        studioName: defaultStudioName,
        representative: defaultRep,
      };
      localStorage.setItem(key, JSON.stringify(initialProfile));
      return initialProfile;
    } catch {
      return INITIAL_STUDIO_PROFILE;
    }
  }

  async updateStudioProfile(updates: Partial<StudioProfile>): Promise<StudioProfile> {
    const current = await this.getStudioProfile();
    const key = this.getStudioProfileKey();
    const updated: StudioProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(updated));
        fetch('/api/studio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }).catch(() => {});
      } catch (err) {
        console.error('Failed to save studio profile', err);
      }
    }

    // If logo or logoHeight was updated, synchronize to all projects in this storage
    if (updates.logoUrl !== undefined || updates.logoHeight !== undefined) {
      const projects = this.getStorage();
      projects.forEach((p) => {
        if (updates.logoUrl !== undefined) p.companyLogoUrl = updates.logoUrl;
        if (updates.logoHeight !== undefined) p.companyLogoHeight = updates.logoHeight;
      });
      this.saveStorage(projects);
    }

    return updated;
  }
}
