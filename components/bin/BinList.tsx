'use client';

import { TaskWithSteps } from '@/types';
import { BinCard } from './BinCard';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';

interface BinListProps {
  tasks: TaskWithSteps[];
}

export function BinList({ tasks }: BinListProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      className="flex flex-col gap-3 w-full"
    >
      {tasks.map((task) => (
        <motion.div key={task.id} variants={FADE_IN_UP}>
          <BinCard task={task} />
        </motion.div>
      ))}
    </motion.div>
  );
}
