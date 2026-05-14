'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, ListTodo, Settings, Trash2, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRANSITION_SMOOTH } from '@/lib/animations';
import { useAuth } from '@/providers/AuthProvider';

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/tasks', label: 'My Tasks', icon: ListTodo },
  { href: '/bin', label: 'Bin', icon: Trash2 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  currentPath: string;
}

export function Sidebar({ children, isSidebarOpen, setSidebarOpen, currentPath }: SidebarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="md:hidden flex items-center p-4 border-b border-text-secondary/5 relative min-h-[64px]">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="p-2 text-text-secondary hover:text-text-primary transition-colors z-10"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link 
          href="/home" 
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
        >
          <span className="font-bold text-lg tracking-tight">Break It Down</span>
        </Link>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={TRANSITION_SMOOTH}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-surface p-6 flex flex-col md:hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <Link 
                  href="/home" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
                >
                  <span className="font-bold text-lg tracking-tight">Break It Down</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-text-secondary hover:text-text-primary p-2 -mr-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = currentPath.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors",
                        isActive ? "bg-primary/10 text-primary font-medium" : "text-text-secondary hover:bg-background hover:text-text-primary"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-6 border-t border-text-secondary/5 space-y-3">
                <div className="px-4 text-sm text-text-secondary truncate">
                  {user?.email}
                </div>
                <button
                  onClick={() => { handleSignOut(); setSidebarOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-text-secondary hover:text-red-400 transition-colors rounded-2xl hover:bg-background"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden md:flex flex-col w-64 bg-surface p-6 sticky top-0 h-screen border-r border-text-secondary/5">
        <Link href="/home" className="flex items-center gap-2 text-primary mb-10 pl-4 hover:opacity-80 transition-opacity">
          <span className="font-bold text-xl tracking-tight">Break It Down</span>
        </Link>
        <nav className="flex flex-col gap-2 flex-grow">
          {links.map((link) => {
            const isActive = currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-primary/15 text-primary font-medium scale-[1.02]" : "text-text-secondary hover:bg-background hover:text-text-primary"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-text-secondary/5 space-y-3">
          <div className="px-4 text-sm text-text-secondary truncate">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-text-secondary hover:text-red-400 transition-colors rounded-2xl hover:bg-background"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}