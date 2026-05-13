'use client';

import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/useUIStore';
import { Sidebar } from '@/components/ui/Sidebar';
import { Toast } from '@/components/ui/Toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const pathname = usePathname();

  return (
    <>
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentPath={pathname}
      >
        {children}
      </Sidebar>
      <Toast />
    </>
  );
}