'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

/**
 * Dumb footer component to render static attribution elements.
 */
export function HomeFooter() {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="flex items-center gap-4 text-text-secondary/40 text-sm italic"
    >
      Powered by Groq & Llama 3.3 • Gentle AI
    </motion.div>
  );
}
