'use client';

import { motion } from 'motion/react';
import { TasksHeader } from '@/components/tasks-dashboard/TasksHeader';
import { TasksList } from '@/components/tasks-dashboard/TasksList';
import { STAGGER_CONTAINER } from '@/lib/animations';

/**
 * Next.js Orchestration Page: Mounts the decoupled dashboard UI blocks.
 */
export default function TasksPage() {
  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-8"
    >
      <TasksHeader />
      <TasksList />
    </motion.div>
  );
}
