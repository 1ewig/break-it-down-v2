'use client';

import { useTasksQuery } from '@/hooks/useTasksQuery';
import { TasksHeader } from '@/components/tasks-dashboard/TasksHeader';
import { TasksList } from '@/components/tasks-dashboard/TasksList';
import { TasksLoading } from '@/components/tasks-dashboard/TasksLoading';
import { TasksEmpty } from '@/components/tasks-dashboard/TasksEmpty';
import { TasksFloatingBin } from '@/components/tasks-dashboard/TasksFloatingBin';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useTasksQuery();

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-8"
    >
      <TasksHeader />
      {isLoading ? (
        <TasksLoading />
      ) : tasks.length === 0 ? (
        <TasksEmpty />
      ) : (
        <TasksList tasks={tasks} />
      )}
      <TasksFloatingBin />
    </motion.div>
  );
}