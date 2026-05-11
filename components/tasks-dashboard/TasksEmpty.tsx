'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

/**
 * Dumb component that renders when there are zero active tasks in the user's list.
 */
export function TasksEmpty() {
  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-3xl border border-surface/50 w-full"
    >
      <h2 className="text-xl font-light text-text-primary mb-2">No tasks yet</h2>
      <p className="text-text-secondary text-sm mb-6 max-w-xs">
        Whenever you're ready, let's break something down together.
      </p>
      <Link href="/home" className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors">
        Get started
      </Link>
    </motion.div>
  );
}
