'use client';

import { useTasksQuery } from '@/hooks/queries/useTasksQuery';
import { TaskCard } from './TaskCard';
import { TasksLoading } from './TasksLoading';
import { TasksEmpty } from './TasksEmpty';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';

/**
 * Intelligent UI block that handles its own data query, decides empty/loading presentation,
 * and renders the task list with custom spring stagger entry paths.
 */
export function TasksList() {
  const { data: tasks = [], isLoading } = useTasksQuery();

  if (isLoading) {
    return <TasksLoading />;
  }

  if (tasks.length === 0) {
    return <TasksEmpty />;
  }

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      className="grid gap-4 w-full"
    >
      {tasks.map((task) => (
        <motion.div key={task.id} variants={FADE_IN_UP}>
          <TaskCard task={task} />
        </motion.div>
      ))}
    </motion.div>
  );
}
