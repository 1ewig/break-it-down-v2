'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const container = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const child = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

interface TaskAcknowledgedProps {
  taskTitle: string;
}

export function TaskAcknowledged({ taskTitle }: TaskAcknowledgedProps) {
  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="text-center flex flex-col items-center gap-6"
    >
      <motion.div
        variants={child}
        className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-primary/15 border-[1.5px] border-primary/30 shadow-[0_0_60px_rgba(74,160,115,0.15)] mb-2"
      >
        <Sparkles size={32} className="text-primary" />
      </motion.div>
      <motion.h2
        variants={child}
        className="text-text-primary font-bold tracking-tight text-[clamp(1.5rem,5vw,2.5rem)] leading-[1.1]"
      >
        Got it. Breaking it down now.
      </motion.h2>
      <motion.p
        variants={child}
        className="text-text-secondary font-medium text-[clamp(0.875rem,2.5vw,1rem)] leading-relaxed max-w-[480px]"
      >
        &ldquo;{taskTitle}&rdquo;
      </motion.p>
      <motion.p
        variants={child}
        className="text-text-secondary/60 text-[clamp(0.75rem,2vw,0.875rem)] font-medium"
      >
        You will be redirected to your task in just a moment.
      </motion.p>
    </motion.div>
  );
}
