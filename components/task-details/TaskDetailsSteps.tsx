'use client';

import { TaskWithSteps } from '@/types';
import { StepItem } from './StepItem';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

interface TaskDetailsStepsProps {
  task: TaskWithSteps;
}

/**
 * Dumb component that processes steps into a nested layout tree structure
 * and renders StepItem components recursively.
 */
export function TaskDetailsSteps({ task }: TaskDetailsStepsProps) {
  const buildStepTree = (parentId: string | null): React.ReactNode[] => {
    const children = task.steps.filter((s) => s.parent_step_id === parentId);
    return children.map((step) => {
      const childElements = buildStepTree(step.id);

      return (
        <StepItem key={step.id} step={step}>
          {childElements.length > 0 ? childElements : null}
        </StepItem>
      );
    });
  };

  const topLevelSteps = buildStepTree(null);

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      className="flex flex-col gap-4 w-full"
    >
      {topLevelSteps}
    </motion.div>
  );
}
