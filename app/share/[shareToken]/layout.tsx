'use client';

import React, { useEffect } from 'react';

export default function ClientShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="select-none"
    >
      {children}
    </div>
  );
}
