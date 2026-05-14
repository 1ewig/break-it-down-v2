'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

export function BinHeader() {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="text-center mb-4"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 tracking-tight">Bin</h1>
      <p className="text-text-secondary text-base font-medium">
        Deleted tasks are automatically removed after 30 days.
      </p>
    </motion.div>
  );
}
