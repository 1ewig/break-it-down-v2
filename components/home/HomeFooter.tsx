'use client';

import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';

/**
 * Dumb footer component to render static attribution elements.
 */
interface HomeFooterProps {
  taskTitle: string;
}

export function HomeFooter({ taskTitle }: HomeFooterProps) {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="flex items-center gap-4 text-text-secondary/40 text-sm"
    >
      <span className="font-medium">{taskTitle.length}/250</span>
      <span className="italic">&middot; Powered by Groq & Llama 3.3 &middot; Gentle AI</span>
    </motion.div>
  );
}
