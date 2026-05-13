'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useDeletedTasksCount } from '@/hooks/useBinQuery';

export function TasksFloatingBin() {
  const count = useDeletedTasksCount();

  return (
    <div className="mt-auto pt-4 flex justify-end">
      <Link
        href="/bin"
        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-text-secondary/10 rounded-2xl text-sm text-text-secondary hover:text-text-primary hover:border-text-secondary/30 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span>Bin</span>
        {count > 0 && (
          <span className="text-[10px] bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
