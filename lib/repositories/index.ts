import { IProjectRepository } from './project-repository';
import { DemoProjectRepository } from './demo-project-repository';
import { SupabaseProjectRepository } from './supabase-project-repository';
import { isSupabaseConfigured } from '@/lib/supabase/client';

let repoInstance: IProjectRepository | null = null;

export function getProjectRepository(): IProjectRepository {
  if (repoInstance) return repoInstance;

  if (isSupabaseConfigured) {
    repoInstance = new SupabaseProjectRepository();
  } else {
    repoInstance = new DemoProjectRepository();
  }
  return repoInstance;
}

export * from './project-repository';
export * from './demo-project-repository';
export * from './supabase-project-repository';
