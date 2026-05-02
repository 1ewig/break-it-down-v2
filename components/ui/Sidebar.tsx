'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, ListTodo, Settings, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/tasks', label: 'My Tasks', icon: ListTodo },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="md:hidden flex items-center p-4 border-b border-surface">
        <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        <div className="ml-2 flex items-center gap-2 text-primary">
          <Heart className="h-5 w-5" />
          <span className="font-bold text-lg">Break It Down</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-surface p-6 flex flex-col md:hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  <span className="font-bold text-lg">Break It Down</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary p-2 -mr-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface p-6 sticky top-0 h-screen border-r border-[#2C2C35]">
        <div className="flex items-center gap-2 text-primary mb-10 pl-4">
          <Heart className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">Break It Down</span>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
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
        <div className="mt-auto px-4 text-xs text-text-secondary text-center opacity-50">
          Take your time.
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </main>
    </div>
  );
}
