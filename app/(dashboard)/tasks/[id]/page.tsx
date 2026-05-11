'use client';

import { useTaskDetail } from '@/hooks/useTaskDetail';
import { TaskDetailsHeader } from '@/components/task-details/TaskDetailsHeader';
import { TaskDetailsSteps } from '@/components/task-details/TaskDetailsSteps';
import { TaskDetailsClosingTip } from '@/components/task-details/TaskDetailsClosingTip';
import { TaskDetailsLoading } from '@/components/task-details/TaskDetailsLoading';
import { TaskDetailsNotFound } from '@/components/task-details/TaskDetailsNotFound';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function TaskDetailPage() {
  const { 
    task, 
    isLoading, 
    breakingStepId, 
    handleToggleComplete, 
    handleBreakdown 
  } = useTaskDetail();

  if (isLoading) {
    return <TaskDetailsLoading />;
  }

  if (!task) {
    return <TaskDetailsNotFound />;
  }

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-2xl mx-auto w-full p-6 md:p-12 gap-6 md:gap-12"
    >
      <TaskDetailsHeader task={task} />
      <TaskDetailsSteps 
        task={task}
        onToggleComplete={handleToggleComplete}
        onBreakdown={handleBreakdown}
        breakingStepId={breakingStepId}
      />
      {task.closing_tip && <TaskDetailsClosingTip closingTip={task.closing_tip} />}
    </motion.div>
  );
}