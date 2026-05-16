'use client';

import { TaskWithSteps } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'motion/react';
import { FADE_IN_UP, SCALE_IN } from '@/lib/animations';

interface TaskDetailsHeaderProps {
  task: TaskWithSteps;
}

/**
 * TaskDetailsHeader: Displays task title, affirmation, and progress.
 */
export function TaskDetailsHeader({ task }: TaskDetailsHeaderProps) {
  const completedCount = task.steps.filter(s => s.is_completed).length;

  return (
    <motion.div 
      variants={FADE_IN_UP} 
      className="flex flex-col text-center items-center gap-6 w-full"
    >
      <motion.h1 
        layout 
        className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight"
      >
        {task.title}
      </motion.h1>

      {task.affirmation && (
        <motion.div 
          variants={SCALE_IN}
          className="bg-primary/5 border border-primary/10 rounded-3xl p-6 relative overflow-hidden w-full shadow-sm"
        >
          <p className="text-primary font-medium text-lg leading-relaxed italic">
            &quot;{task.affirmation}&quot;
          </p>
        </motion.div>
      )}
      
      <div className="w-full">
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-text-secondary/50 text-[11px] uppercase tracking-widest font-bold">Progress</span>
          <div className="flex items-center gap-3">
             <span className="text-text-secondary/40 text-xs">
               {completedCount} of {task.steps.length} completed
             </span>
          </div>
        </div>
        <ProgressBar percentage={task.progress_percentage} />
        <p className="text-center text-[11px] text-text-secondary/30 mt-4">
          Take a deep breath. You are doing enough.
        </p>
      </div>
    </motion.div>
  );
}
