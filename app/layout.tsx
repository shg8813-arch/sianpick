import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: '시안픽 (SianPick) — 시각디자인 시안 전달 & 피드백 플랫폼',
  description: '시안을 보고, 고르고, 수정하고, 확정하는 가장 쉬운 방법. 디자이너와 고객을 위한 감각적인 시안 소통 도구.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-zinc-900 selection:bg-blue-600 selection:text-white">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
