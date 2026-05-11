'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

/**
 * Dumb component that renders the Tasks page title and supportive text.
 */
export function TasksHeader() {
  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="text-center"
    >
      <h1 className="text-3xl font-light text-text-primary mb-2">My Tasks</h1>
      <p className="text-text-secondary text-sm">One gentle step at a time.</p>
    </motion.div>
  );
}
