'use client';

import { useParams } from 'next/navigation';
import { useTasksQuery } from '@/hooks/useTasksQuery';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { TaskDetailsHeader } from '@/components/task-details/TaskDetailsHeader';
import { TaskDetailsSteps } from '@/components/task-details/TaskDetailsSteps';
import { TaskDetailsClosingTip } from '@/components/task-details/TaskDetailsClosingTip';
import { TaskDetailsLoading } from '@/components/task-details/TaskDetailsLoading';
import { TaskDetailsNotFound } from '@/components/task-details/TaskDetailsNotFound';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function TaskDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const { data: tasks = [], isLoading } = useTasksQuery();
  const { updateStepCompletion, breakdownTask } = useTaskMutations();
  
  const task = tasks.find(t => t.id === id);
  const breakingStepId = breakdownTask.isPending ? breakdownTask.variables?.stepId ?? null : null;

  if (isLoading) {
    return <TaskDetailsLoading />;
  }

  if (!task) {
    return <TaskDetailsNotFound />;
  }

  const handleToggleComplete = (taskId: string, stepId: string, isCompleted: boolean) => {
    updateStepCompletion.mutate({ taskId, stepId, isCompleted });
  };

  const handleBreakdown = (taskId: string, stepId: string, stepTitle: string) => {
    breakdownTask.mutate({ taskId, stepId, stepTitle });
  };

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