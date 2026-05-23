'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TaskLoadingOverlayProps {
  taskTitle: string;
}

export function TaskLoadingOverlay({ taskTitle }: TaskLoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-8 max-w-sm text-center px-6"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/15"
        >
          <Sparkles size={32} className="text-primary" />
        </motion.div>

        <div className="flex flex-col gap-2">
          <p className="text-text-primary text-lg font-medium">
            Breaking down your task...
          </p>
          <p className="text-text-secondary/60 text-sm italic leading-relaxed">
            &ldquo;{taskTitle}&rdquo;
          </p>
        </div>

        <div className="w-48 h-1 bg-text-secondary/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-primary rounded-full"
          />
        </div>

        <p className="text-text-secondary/40 text-xs">
          Just a gentle moment...
        </p>
      </motion.div>
    </motion.div>
  );
}
