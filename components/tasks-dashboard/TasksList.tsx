'use client';

import { TaskWithSteps } from '@/types';
import { TaskCard } from './TaskCard';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';
import { useTaskMutations } from '@/hooks/useTaskMutations';

interface TasksListProps {
  tasks: TaskWithSteps[];
}

export function TasksList({ tasks }: TasksListProps) {
  const { deleteTask } = useTaskMutations();

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      className="grid gap-4 w-full"
    >
      {tasks.map((task) => (
        <motion.div key={task.id} variants={FADE_IN_UP}>
          <TaskCard 
            task={task} 
            onDelete={(id) => deleteTask.mutate(id)} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}