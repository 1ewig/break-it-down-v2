'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export function ProgressBar({ percentage, className }: ProgressBarProps) {
  const boundedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  return (
    <div className={cn("w-full h-1.5 bg-text-secondary/10 rounded-full overflow-hidden relative", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-[#a88de8] rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${boundedPercentage}%` }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      </motion.div>
    </div>
  );
}
