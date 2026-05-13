'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';
import { Trash2 } from 'lucide-react';

export function BinEmpty() {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-3xl border border-surface/50 w-full"
    >
      <div className="p-3 bg-text-secondary/5 rounded-2xl mb-4">
        <Trash2 className="w-6 h-6 text-text-secondary/30" />
      </div>
      <h2 className="text-xl font-light text-text-primary mb-2">Bin is empty</h2>
      <p className="text-text-secondary text-sm mb-6 max-w-xs">
        Deleted tasks will appear here and stay for 30 days.
      </p>
      <Link
        href="/tasks"
        className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors"
      >
        Back to My Tasks
      </Link>
    </motion.div>
  );
}
