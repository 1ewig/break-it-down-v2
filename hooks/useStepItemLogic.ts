import { useState } from 'react';
import { Step } from '@/types';

interface UseStepItemProps {
  step: Step;
  onToggleComplete: (taskId: string, stepId: string, isCompleted: boolean) => void;
  onBreakdown: (taskId: string, stepId: string, stepTitle: string) => void;
}

export function useStepItemLogic({ step, onToggleComplete, onBreakdown }: UseStepItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    onToggleComplete(step.task_id, step.id, checked);
    if (checked) {
      setIsOpen(false);
    }
  };

  const handleBreakdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBreakdown(step.task_id, step.id, step.title);
  };

  const handleMarkDoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggle(true);
  };

  return {
    isOpen,
    setIsOpen,
    handleToggle,
    handleBreakdownClick,
    handleMarkDoneClick,
  };
}
