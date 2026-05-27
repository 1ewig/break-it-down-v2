'use client';

import { TaskWithSteps } from '@/types';
import { BinCard } from './BinCard';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';

interface BinListProps {
  tasks: TaskWithSteps[];
  onRestore: (taskId: string) => void;
  onPermanentDelete: (taskId: string) => void;
  isRestoring: boolean;
  isDeleting: boolean;
}

export function BinList({ tasks, onRestore, onPermanentDelete, isRestoring, isDeleting }: BinListProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      className="flex flex-col gap-3 w-full"
    >
      {tasks.map((task) => (
        <motion.div key={task.id} variants={FADE_IN_UP}>
          <BinCard
            task={task}
            onRestore={onRestore}
            onPermanentDelete={onPermanentDelete}
            isRestoring={isRestoring}
            isDeleting={isDeleting}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
