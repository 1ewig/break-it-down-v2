'use client';

import { TaskWithSteps } from '@/types';
import { StepItem } from './StepItem';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

interface TaskDetailsStepsProps {
  task: TaskWithSteps;
  onToggleComplete: (taskId: string, stepId: string, isCompleted: boolean) => void;
  onBreakdown: (taskId: string, stepId: string, stepTitle: string) => void;
  breakingStepId: string | null;
}

export function TaskDetailsSteps({ 
  task, 
  onToggleComplete, 
  onBreakdown,
  breakingStepId 
}: TaskDetailsStepsProps) {
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