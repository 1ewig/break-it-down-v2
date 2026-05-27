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
      className="flex flex-col items-center text-center gap-3"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 mb-2">
        <Sparkles size={28} className="text-primary" />
      </div>
      <p className="text-text-primary text-lg font-medium">
        Got it. Breaking it down now.
      </p>
      <p className="text-text-secondary/60 text-sm italic max-w-sm">
        &ldquo;{taskTitle}&rdquo;
      </p>
      <p className="text-text-secondary/40 text-xs mt-2">
        You will be redirected to your task in just a moment.
      </p>
    </motion.div>
  );
}
