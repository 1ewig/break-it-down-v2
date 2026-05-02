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
    <div className={cn("w-full h-3 bg-surface rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${boundedPercentage}%` }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      />
    </div>
  );
}
