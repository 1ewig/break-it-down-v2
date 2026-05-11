'use client';

import { useParams } from 'next/navigation';
import { useTasksQuery } from '@/hooks/useTasksQuery';
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
  const task = tasks.find(t => t.id === id);

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
      <TaskDetailsSteps task={task} />
      {task.closing_tip && <TaskDetailsClosingTip closingTip={task.closing_tip} />}
    </motion.div>
  );
}