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
  const buildStepTree = (parentId: string | null, level: number = 0): React.ReactNode[] => {
    const children = task.steps.filter((s) => s.parent_step_id === parentId);
    return children.map((step) => {
      const childElements = buildStepTree(step.id, level + 1);

      return (
        <StepItem 
          key={step.id} 
          step={step}
          onToggleComplete={onToggleComplete}
          onBreakdown={onBreakdown}
          isBreakingDown={breakingStepId === step.id}
          level={level}
        >
          {childElements.length > 0 ? childElements : null}
        </StepItem>
      );
    });
  };

  const topLevelSteps = buildStepTree(null, 0);

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      className="flex flex-col gap-4 w-full"
    >
      {topLevelSteps}
    </motion.div>
  );
}