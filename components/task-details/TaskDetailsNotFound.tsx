'use client';

import Link from 'next/link';

/**
 * Dumb component that renders when a specific task detail ID does not exist in local state.
 */
export function TaskDetailsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center text-text-secondary">
      <h2 className="text-xl font-light text-text-primary mb-2">We couldn't find this task</h2>
      <p className="text-sm text-text-secondary mb-6">Let's start fresh and break something down together.</p>
      <Link href="/home" className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
