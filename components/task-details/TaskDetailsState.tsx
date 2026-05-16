'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * TaskDetailsLoading: Renders a calming loading state.
 */
export function TaskDetailsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20 text-primary" />
      <p className="italic font-light">Retrieving your gentle plan...</p>
    </div>
  );
}

/**
 * TaskDetailsNotFound: Renders when a task doesn't exist.
 */
export function TaskDetailsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center text-text-secondary">
      <h2 className="text-xl font-light text-text-primary mb-2">We couldn&apos;t find this task</h2>
      <p className="text-sm text-text-secondary mb-6">Let&apos;s start fresh and break something down together.</p>
      <Link href="/home" className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
