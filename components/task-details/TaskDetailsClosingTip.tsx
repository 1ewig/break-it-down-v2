'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { FADE_IN_UP, SCALE_IN } from '@/lib/animations';

interface TaskDetailsClosingTipProps {
  closingTip: string;
}

/**
 * Dumb presentational component that displays the reassuring AI-generated closing advice at the bottom.
 */
export function TaskDetailsClosingTip({ closingTip }: TaskDetailsClosingTipProps) {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="p-8 bg-surface-raised border border-text-secondary/5 rounded-[40px] text-center w-full"
    >
      <motion.div 
        variants={SCALE_IN}
        className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
         <Sparkles className="w-6 h-6 text-primary" />
      </motion.div>
      <h3 className="text-text-primary font-medium mb-3">You&apos;ve got this</h3>
      <p className="text-text-secondary/80 text-sm leading-relaxed">
        {closingTip}
      </p>
    </motion.div>
  );
}
