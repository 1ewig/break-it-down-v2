'use client';

import { TaskWithSteps } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SPRING_GENTLE } from '@/lib/animations';

interface TaskCardProps {
  task: TaskWithSteps;
}

/**
 * Dumb presentational component that displays task details, steps counts, and progressive indicators.
 */
export function TaskCard({ task }: TaskCardProps) {
  const isDone = task.progress_percentage === 100;

  return (
    <Link href={`/tasks/${task.id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={SPRING_GENTLE}
        className={cn(
          "p-6 rounded-3xl group relative overflow-hidden will-change-transform",
          isDone 
            ? "bg-primary/5 border border-primary/20 shadow-lg shadow-primary/5" 
            : "bg-surface border border-text-secondary/5 shadow-sm hover:shadow-md"
        )}
      >
        {isDone && (
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Trophy className="w-20 h-20 text-primary rotate-12" />
          </div>
        )}

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex flex-col gap-1 pr-4">
            <h3 className={cn(
              "text-lg font-light transition-colors",
              isDone ? "text-primary italic" : "text-text-primary group-hover:text-primary"
            )}>
              {task.title}
            </h3>
            {isDone && (
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Gentle Victory
              </span>
            )}
          </div>
          <span className={cn(
            "text-xs px-3 py-1 rounded-full shrink-0 whitespace-nowrap",
            isDone ? "bg-primary/20 text-primary" : "text-text-secondary bg-text-secondary/5"
          )}>
            {task.steps.length} {task.steps.length === 1 ? 'step' : 'steps'}
          </span>
        </div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-[11px] uppercase tracking-wider">
            <span className={isDone ? "text-primary/60" : "text-text-secondary"}>Progress</span>
            <span className={cn("font-medium", isDone ? "text-primary" : "text-text-secondary")}>
              {isDone ? 'Completed' : `${task.progress_percentage}%`}
            </span>
          </div>
          <ProgressBar 
            percentage={task.progress_percentage} 
            className={cn("h-2", isDone && "from-primary to-primary")} 
          />
        </div>
      </motion.div>
    </Link>
  );
}
