'use client';

import { TaskWithSteps } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'motion/react';
import { FADE_IN_UP, SCALE_IN, STAGGER_CONTAINER } from '@/lib/animations';
import { Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { StepItem } from './StepItem';

/**
 * TaskDetailsHeader: Displays task title, affirmation, and progress.
 */
export function TaskDetailsHeader({ task }: { task: TaskWithSteps }) {
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

/**
 * TaskDetailsSteps: A staggered list of StepItems.
 */
export function TaskDetailsSteps({ 
  task, 
  onToggleComplete, 
  onBreakdown, 
  breakingStepId 
}: { 
  task: TaskWithSteps;
  onToggleComplete: (taskId: string, stepId: string, isCompleted: boolean) => void;
  onBreakdown: (taskId: string, stepId: string, stepTitle: string) => void;
  breakingStepId: string | null;
}) {
  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      className="flex flex-col gap-4 w-full"
    >
      {task.steps.map((step) => (
        <StepItem 
          key={step.id} 
          step={step}
          onToggleComplete={onToggleComplete}
          onBreakdown={onBreakdown}
          isBreakingDown={breakingStepId === step.id}
        />
      ))}
    </motion.div>
  );
}

/**
 * TaskDetailsClosingTip: Reassuring advice at the bottom.
 */
export function TaskDetailsClosingTip({ closingTip }: { closingTip: string }) {
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

/**
 * State components: Loading and Not Found.
 */
export function TaskDetailsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20 text-primary" />
      <p className="italic font-light">Retrieving your gentle plan...</p>
    </div>
  );
}

export function TaskDetailsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center text-text-secondary">
      <h2 className="text-xl font-light text-text-primary mb-2">We couldn&apos;t find this task</h2>
      <p className="text-sm text-text-secondary mb-6">Let&apos;s start fresh and break something down together.</p>
      <Link href="/home" className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
