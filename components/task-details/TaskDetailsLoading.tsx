'use client';

import { Loader2 } from 'lucide-react';

/**
 * Dumb component that renders a calming loading layout for task breakdown.
 */
export function TaskDetailsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20 text-primary" />
      <p className="italic font-light">Retrieving your gentle plan...</p>
    </div>
  );
}
