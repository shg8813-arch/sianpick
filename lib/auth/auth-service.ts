'use client';

import { UserProfile } from '@/types';

const SESSION_KEY = 'sianpick_current_user_session';
const REGISTERED_USERS_KEY = 'sianpick_registered_users_v1';

export interface StoredUserAccount extends UserProfile {
  passwordHash?: string;
}

export const DEMO_USER: UserProfile = {
  id: 'knitfilm-designer',
  email: 'knitfilm@studio.com',
  name: 'knitfilm 대표',
  studioName: 'knitfilm 스튜디오',
  role: 'designer',
  createdAt: '2026-10-25T00:00:00.000Z',
};

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Get current active session user
  public getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as UserProfile;
    } catch {
      return null;
    }
  }

  // Set active session user
  public setSession(user: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  // Clear session (logout)
  public logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  }

  // Get all registered users list
  public getRegisteredUsers(): StoredUserAccount[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(REGISTERED_USERS_KEY);
      if (!data) return [];
      return JSON.parse(data) as StoredUserAccount[];
    } catch {
      return [];
    }
  }

  // Sync local accounts with server
  public async syncWithServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const localUsers = this.getRegisteredUsers();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', users: localUsers }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.users)) {
          // Update cached users
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(json.users));
        }
      }
    } catch {}
  }

  // Register a new designer user
  public async register(params: {
    email: string;
    password: string;
    name: string;
    studioName?: string;
  }): Promise<UserProfile> {
    const email = params.email.trim().toLowerCase();
    const name = params.name.trim();
    const studioName = (params.studioName || `${name} 디자인 스튜디오`).trim();

    if (!email) throw new Error('이메일을 입력해주세요.');
    if (!params.password || params.password.length < 4) {
      throw new Error('비밀번호는 최소 4자 이상이어야 합니다.');
    }
    if (!name) throw new Error('디자이너 이름을 입력해주세요.');

    // 1. Try server register first
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            email,
            password: params.password,
            name,
            studioName,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const userProfile: UserProfile = data.user;
          this.setSession(userProfile);

          // Update local cache
          const localUsers = this.getRegisteredUsers();
          if (!localUsers.some((u) => u.email.toLowerCase() === email)) {
            localUsers.push({
              ...userProfile,
              passwordHash: params.password,
            });
            localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(localUsers));
          }

          return userProfile;
        } else if (!res.ok && data.error) {
          throw new Error(data.error);
        }
      } catch (err: any) {
        if (err.message && (err.message.includes('이미 등록된') || err.message.includes('이메일'))) {
          throw err;
        }
        // Fallback to local
      }
    }

    const users = this.getRegisteredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email);
    if (exists) {
      throw new Error('이미 등록된 이메일 주소입니다. 로그인해주세요.');
    }

    const newUser: StoredUserAccount = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email,
      name,
      studioName,
      role: 'designer',
      createdAt: new Date().toISOString(),
      passwordHash: params.password,
    };

    users.push(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }

    const userProfile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      studioName: newUser.studioName,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    this.setSession(userProfile);
    return userProfile;
  }

  // Login with email & password
  public async login(params: {
    email: string;
    password?: string;
  }): Promise<UserProfile> {
    const email = params.email.trim().toLowerCase();
    if (!email) throw new Error('이메일을 입력해주세요.');

    // If demo or knitfilm studio email
    if (email === DEMO_USER.email.toLowerCase() || email === 'knitfilm@studio.com' || email === 'designer@sianpick.com') {
      const userProfile: UserProfile = {
        ...DEMO_USER,
        email,
        name: email.includes('knit') ? 'knitfilm 대표' : '대표 디자이너',
        studioName: 'knitfilm 스튜디오',
      };
      this.setSession(userProfile);
      return userProfile;
    }

    // 1. Try server login first
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email,
            password: params.password || '',
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const userProfile: UserProfile = data.user;
          this.setSession(userProfile);
          return userProfile;
        } else if (res.status === 401 && data.error) {
          throw new Error(data.error);
        }
      } catch (err: any) {
        if (err.message && (err.message.includes('비밀번호') || err.message.includes('등록되지 않은'))) {
          throw err;
        }
        // Fallback to local
      }
    }

    const users = this.getRegisteredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email);

    if (!found) {
      if (params.password) {
        return this.register({
          email,
          password: params.password,
          name: email.split('@')[0],
          studioName: `${email.split('@')[0]} 스튜디오`,
        });
      }
      throw new Error('등록되지 않은 이메일입니다. 회원가입을 진행해주세요.');
    }

    if (params.password && found.passwordHash && found.passwordHash !== params.password) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const userProfile: UserProfile = {
      id: found.id,
      email: found.email,
      name: found.name,
      studioName: found.studioName,
      role: found.role,
      createdAt: found.createdAt,
    };

    this.setSession(userProfile);
    return userProfile;
  }

  // Quick Demo Login
  public loginAsDemo(): UserProfile {
    this.setSession(DEMO_USER);
    return DEMO_USER;
  }

  // Current User ID for workspace isolation
  public getCurrentUserId(): string {
    const current = this.getCurrentUser();
    return current ? current.id : 'guest';
  }
}

export const authService = AuthService.getInstance();
