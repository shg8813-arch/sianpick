import fs from 'fs/promises';
import path from 'path';
import { Project, Company, StudioProfile } from '@/types';
import {
  INITIAL_DEMO_PROJECT,
  INITIAL_TATTOO_PROJECT,
  INITIAL_COMPANIES,
  INITIAL_STUDIO_PROFILE,
} from '@/lib/demo/sample-data';
export interface ServerUserAccount {
  id: string;
  email: string;
  name: string;
  studioName?: string;
  role: 'designer' | 'client' | 'admin';
  createdAt: string;
  passwordHash?: string;
}

const DEFAULT_DEMO_USER: ServerUserAccount = {
  id: 'demo-designer',
  email: 'designer@sianpick.com',
  name: '대표 디자이너',
  studioName: 'knitfilm 스튜디오',
  role: 'designer',
  createdAt: '2026-01-01T00:00:00.000Z',
  passwordHash: '1234',
};

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_DIR = path.join(DATA_DIR, 'projects');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const COMPANIES_FILE = path.join(DATA_DIR, 'companies.json');
const STUDIO_FILE = path.join(DATA_DIR, 'studio.json');

// In-memory cache for ultra-fast response
let isInitialized = false;
const projectsMemoryCache = new Map<string, Project>();

async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {}
}

async function atomicWriteJson(filePath: string, data: any): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`;
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, content, 'utf-8');
  await fs.rename(tempPath, filePath);
}

export async function initServerStorage(): Promise<void> {
  if (isInitialized) return;

  await ensureDir(DATA_DIR);
  await ensureDir(PROJECTS_DIR);

  // Initialize users if not exists
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    const existing = JSON.parse(raw);
    if (!Array.isArray(existing) || existing.length === 0 || !existing[0]?.email) {
      await atomicWriteJson(USERS_FILE, [DEFAULT_DEMO_USER]);
    }
  } catch {
    await atomicWriteJson(USERS_FILE, [DEFAULT_DEMO_USER]);
  }

  // Initialize companies if not exists
  try {
    await fs.access(COMPANIES_FILE);
  } catch {
    await atomicWriteJson(COMPANIES_FILE, INITIAL_COMPANIES);
  }

  // Initialize studio profile if not exists
  try {
    await fs.access(STUDIO_FILE);
  } catch {
    await atomicWriteJson(STUDIO_FILE, INITIAL_STUDIO_PROFILE);
  }

  // Initialize sample projects if projects directory is empty
  try {
    const files = await fs.readdir(PROJECTS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json') && !f.includes('.tmp.'));
    if (jsonFiles.length === 0) {
      await atomicWriteJson(path.join(PROJECTS_DIR, `${INITIAL_DEMO_PROJECT.id}.json`), INITIAL_DEMO_PROJECT);
      await atomicWriteJson(path.join(PROJECTS_DIR, `${INITIAL_TATTOO_PROJECT.id}.json`), INITIAL_TATTOO_PROJECT);
    }
  } catch {}

  // Warm up memory cache from disk
  try {
    const files = await fs.readdir(PROJECTS_DIR);
    for (const file of files) {
      if (file.endsWith('.json') && !file.includes('.tmp.')) {
        try {
          const raw = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf-8');
          const p = JSON.parse(raw) as Project;
          if (p && p.id) {
            projectsMemoryCache.set(p.id, p);
          }
        } catch {}
      }
    }
  } catch {}

  isInitialized = true;
}

// User Accounts
export async function getServerUsers(): Promise<ServerUserAccount[]> {
  await initServerStorage();
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.email) {
      return parsed;
    }
    await atomicWriteJson(USERS_FILE, [DEFAULT_DEMO_USER]);
    return [DEFAULT_DEMO_USER];
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

export async function saveServerUsers(users: ServerUserAccount[]): Promise<void> {
  await initServerStorage();
  await atomicWriteJson(USERS_FILE, users);
}

// Companies
export async function getServerCompanies(): Promise<Company[]> {
  await initServerStorage();
  try {
    const raw = await fs.readFile(COMPANIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPANIES;
  }
}

export async function saveServerCompanies(companies: Company[]): Promise<void> {
  await initServerStorage();
  await atomicWriteJson(COMPANIES_FILE, companies);
}

// Studio Profile
export async function getServerStudioProfile(): Promise<StudioProfile> {
  await initServerStorage();
  try {
    const raw = await fs.readFile(STUDIO_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_STUDIO_PROFILE;
  }
}

export async function saveServerStudioProfile(profile: StudioProfile): Promise<void> {
  await initServerStorage();
  await atomicWriteJson(STUDIO_FILE, profile);
}

// Projects
export async function getServerProjects(): Promise<Project[]> {
  await initServerStorage();
  if (projectsMemoryCache.size > 0) {
    return Array.from(projectsMemoryCache.values()).sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    );
  }

  try {
    const files = await fs.readdir(PROJECTS_DIR);
    const projects: Project[] = [];
    for (const file of files) {
      if (file.endsWith('.json') && !file.includes('.tmp.')) {
        try {
          const raw = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf-8');
          const p = JSON.parse(raw) as Project;
          if (p && p.id) {
            projects.push(p);
            projectsMemoryCache.set(p.id, p);
          }
        } catch {}
      }
    }
    return projects.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    );
  } catch {
    return [INITIAL_DEMO_PROJECT, INITIAL_TATTOO_PROJECT];
  }
}

export async function getServerProjectById(id: string): Promise<Project | null> {
  await initServerStorage();
  if (projectsMemoryCache.has(id)) {
    return projectsMemoryCache.get(id)!;
  }

  const filePath = path.join(PROJECTS_DIR, `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const p = JSON.parse(raw) as Project;
    if (p && p.id) {
      projectsMemoryCache.set(p.id, p);
      return p;
    }
  } catch {}

  // Fallback search across all projects if ID differs from file name
  const all = await getServerProjects();
  return all.find((p) => p.id === id) || null;
}

export async function getServerProjectByShareToken(token: string): Promise<Project | null> {
  await initServerStorage();

  // Check in-memory projects first
  for (const p of Array.from(projectsMemoryCache.values())) {
    if (p.shareToken === token) {
      return p;
    }
  }

  // Reload all projects
  const all = await getServerProjects();
  let found = all.find((p) => p.shareToken === token);
  if (found) return found;

  // Fallbacks for sample tokens
  if (token === 'tattoo-noir-sample') {
    return all.find((p) => p.id === INITIAL_TATTOO_PROJECT.id || p.shareToken === 'tattoo-noir-sample') || INITIAL_TATTOO_PROJECT;
  }
  if (token === 'urbanforest-sample-2026' || token === 'runofthemill-sample-2026' || token === 'share-urban-sample-01') {
    return all.find((p) => p.id === INITIAL_DEMO_PROJECT.id || p.title.includes('어반 포레스트')) || INITIAL_DEMO_PROJECT;
  }

  return null;
}

export async function saveServerProject(project: Project): Promise<Project> {
  await initServerStorage();
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };
  const filePath = path.join(PROJECTS_DIR, `${project.id}.json`);
  await atomicWriteJson(filePath, updatedProject);
  projectsMemoryCache.set(project.id, updatedProject);
  return updatedProject;
}

export async function deleteServerProject(id: string): Promise<void> {
  await initServerStorage();
  projectsMemoryCache.delete(id);
  const filePath = path.join(PROJECTS_DIR, `${id}.json`);
  try {
    await fs.unlink(filePath);
  } catch {}
}
