'use client';

import { UserProfile } from '@/types';

const SESSION_KEY = 'sianpick_current_user_session';
const REGISTERED_USERS_KEY = 'sianpick_registered_users_v1';

export interface StoredUserAccount extends UserProfile {
  passwordHash?: string;
}

export const DEMO_USER: UserProfile = {
  id: 'demo-designer',
  email: 'designer@sianpick.com',
  name: '데모 디자이너',
  studioName: '스튜디오 아틀리에',
  role: 'designer',
  createdAt: '2026-01-01T00:00:00.000Z',
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
      passwordHash: params.password, // Local demonstration mode
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

    // If demo email
    if (email === DEMO_USER.email.toLowerCase()) {
      this.setSession(DEMO_USER);
      return DEMO_USER;
    }

    const users = this.getRegisteredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email);

    if (!found) {
      // Auto-register prospective customer with default account if password provided
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
