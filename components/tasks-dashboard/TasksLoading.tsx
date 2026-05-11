'use client';

/**
 * Dumb component that renders a calming loading state for tasks.
 */
export function TasksLoading() {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <p className="text-text-secondary/50 animate-pulse font-light">Loading gentle steps...</p>
    </div>
  );
}
