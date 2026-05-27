'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TaskAcknowledgedProps {
  taskTitle: string;
}

export function TaskAcknowledged({ taskTitle }: TaskAcknowledgedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center flex flex-col items-center gap-6"
    >
      <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-primary/15 border-[1.5px] border-primary/30 shadow-[0_0_60px_rgba(74,160,115,0.15)] mb-2">
        <Sparkles size={32} className="text-primary" />
      </div>
      <h2 className="text-text-primary font-bold tracking-tight text-[clamp(1.5rem,5vw,2.5rem)] leading-[1.1]">
        Got it. Breaking it down now.
      </h2>
      <p className="text-text-secondary font-medium text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed max-w-[480px]">
        &ldquo;{taskTitle}&rdquo;
      </p>
      <p className="text-text-secondary/60 text-[clamp(0.75rem,2vw,0.875rem)] font-medium">
        You will be redirected to your task in just a moment.
      </p>
    </motion.div>
  );
}
