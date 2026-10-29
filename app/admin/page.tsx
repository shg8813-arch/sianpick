'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  AlertTriangle,
  FolderKanban,
  ExternalLink,
  RotateCcw,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

interface StudioAccount {
  id: string;
  email: string;
  name: string;
  studioName: string;
  role: string;
  status: 'active' | 'suspended';
  createdAt: string;
  projectCount: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  details?: string;
  source?: string;
}

export default function PlatformAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'studios' | 'logs'>('studios');
  const [studios, setStudios] = useState<StudioAccount[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState({
    totalStudios: 0,
    totalProjects: 0,
    activeShareLinks: 0,
    errorCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Check Admin Guard
  useEffect(() => {
    try {
      const session = localStorage.getItem('sianpick_admin_session');
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setAdminUser(JSON.parse(session));
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [studiosRes, logsRes] = await Promise.all([
        fetch('/api/admin/studios'),
        fetch('/api/admin/logs'),
      ]);

      if (studiosRes.ok) {
        const sData = await studiosRes.json();
        if (sData.success) setStudios(sData.studios || []);
      }

      if (logsRes.ok) {
        const lData = await logsRes.json();
        if (lData.success) {
          setLogs(lData.logs || []);
          if (lData.stats) setStats(lData.stats);
        }
      }
    } catch {
      toast.error('관리자 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (studio: StudioAccount) => {
    const nextStatus = studio.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/studios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studio.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      toast.success(`${studio.studioName} 계정 상태가 [${nextStatus === 'active' ? '활성' : '정지'}]로 변경되었습니다.`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || '상태 변경에 실패했습니다.');
    }
  };

  const handleResetPassword = async (studio: StudioAccount) => {
    if (!confirm(`${studio.studioName} (${studio.email})의 비밀번호를 기본 '1234'로 재설정하시겠습니까?`)) {
      return;
    }
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: studio.email,
          newPassword: '1234',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      toast.success(`${studio.studioName}의 비밀번호가 1234로 초기화되었습니다.`);
    } catch (err: any) {
      toast.error(err.message || '비밀번호 재설정에 실패했습니다.');
    }
  };

  const handleDeleteStudio = async (studio: StudioAccount) => {
    if (!confirm(`주의: ${studio.studioName} (${studio.email}) 계정을 영구 삭제하시겠습니까?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/studios?id=${encodeURIComponent(studio.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      toast.success(`${studio.studioName} 계정이 삭제되었습니다.`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || '계정 삭제에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sianpick_admin_session');
    toast.info('관리자 로그아웃되었습니다.');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-600 text-white flex items-center justify-center font-bold text-xs tracking-wider">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                시안픽 플랫폼 전체 관리자
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                SUPER ADMIN CONSOLE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Building className="w-3.5 h-3.5 text-zinc-400" />
              <span>스튜디오 관리 페이지 바로가기</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-zinc-800/80 hover:bg-rose-950 hover:text-rose-400 text-xs text-zinc-400 transition-colors flex items-center gap-1.5 border border-zinc-700/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">가입 스튜디오 수</span>
              <Users className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalStudios}개</div>
            <p className="text-[11px] text-zinc-500 mt-1">플랫폼에 등록된 전체 스튜디오</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">전체 시안 프로젝트</span>
              <FolderKanban className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-black text-white">{stats.totalProjects}건</div>
            <p className="text-[11px] text-zinc-500 mt-1">스튜디오별 등록된 총 프로젝트</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">활성 고객 공유 링크</span>
              <ExternalLink className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-black text-white">{stats.activeShareLinks}개</div>
            <p className="text-[11px] text-zinc-500 mt-1">정상 발급된 고객 피드백 링크</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold">시스템 경고/오류</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-white">{stats.errorCount}건</div>
            <p className="text-[11px] text-zinc-500 mt-1">감지된 인증 및 스토리지 오류</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('studios')}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'studios'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              스튜디오 가입 리스트 및 계정 관리 ({studios.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              시스템 오류 및 활동 로그 ({logs.length})
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'studios' ? (
          /* Studios List */
          <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">가입된 스튜디오 계정 목록</h2>
                <p className="text-xs text-zinc-400">
                  전체 디자이너 및 스튜디오의 활동 상태, 프로젝트 수, 계정 권한을 제어합니다.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">스튜디오명 / 디자이너</th>
                    <th className="py-3 px-4">로그인 이메일 (아이디)</th>
                    <th className="py-3 px-4">가입일시</th>
                    <th className="py-3 px-4 text-center">프로젝트</th>
                    <th className="py-3 px-4 text-center">계정 상태</th>
                    <th className="py-3 px-4 text-right">계정 관리 조치</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {studios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-500">
                        등록된 스튜디오 계정이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    studios.map((st) => (
                      <tr key={st.id} className="hover:bg-zinc-850/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white text-xs">{st.studioName}</p>
                          <p className="text-[11px] text-zinc-400">{st.name}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300">
                          {st.email}
                          {st.role === 'admin' && (
                            <span className="ml-2 px-1.5 py-0.5 bg-rose-950 text-rose-400 text-[10px] font-semibold border border-rose-800">
                              관리자
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                          {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-white">
                          {st.projectCount}개
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold ${
                              st.status === 'active'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {st.status === 'active' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>정상</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>이용정지</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {st.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(st)}
                                className={`px-2 py-1 text-[11px] font-semibold transition-colors ${
                                  st.status === 'active'
                                    ? 'bg-zinc-800 hover:bg-rose-950 text-zinc-300 hover:text-rose-300'
                                    : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200'
                                }`}
                              >
                                {st.status === 'active' ? '정지' : '활성화'}
                              </button>
                              <button
                                onClick={() => handleResetPassword(st)}
                                title="비밀번호 1234로 초기화"
                                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>PW 초기화</span>
                              </button>
                              <button
                                onClick={() => handleDeleteStudio(st)}
                                className="px-2 py-1 bg-zinc-800 hover:bg-rose-900/80 text-zinc-400 hover:text-rose-200 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>삭제</span>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Error & Activity Logs */
          <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">시스템 오류 및 활동 로그</h2>
                <p className="text-xs text-zinc-400">
                  인증 시도, 스토리지 입출력, 만료 링크 접근 및 오류 이력을 모니터링합니다.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">일시</th>
                    <th className="py-3 px-4">구분</th>
                    <th className="py-3 px-4">심각도</th>
                    <th className="py-3 px-4">로그 메시지 및 상세</th>
                    <th className="py-3 px-4 text-right">경로</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300 font-mono">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500 font-sans">
                        기록된 로그가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-850/50 transition-colors">
                        <td className="py-3 px-4 text-[11px] text-zinc-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-[11px] uppercase font-bold text-zinc-300">
                          {log.type}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              log.severity === 'error'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : log.severity === 'warning'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-xs">
                          <p className="text-white font-medium">{log.message}</p>
                          {log.details && (
                            <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                              {log.details}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-[11px] text-zinc-500 whitespace-nowrap">
                          {log.source || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
