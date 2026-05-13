'use client';

import { useDeletedTasksQuery } from '@/hooks/useBinQuery';
import { BinHeader } from '@/components/bin/BinHeader';
import { BinList } from '@/components/bin/BinList';
import { BinEmpty } from '@/components/bin/BinEmpty';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER } from '@/lib/animations';

export default function BinPage() {
  const { data: tasks = [], isLoading } = useDeletedTasksQuery();

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-8"
    >
      <BinHeader />
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-text-secondary/50 animate-pulse font-light">Loading bin...</p>
        </div>
      ) : tasks.length === 0 ? (
        <BinEmpty />
      ) : (
        <BinList tasks={tasks} />
      )}
    </motion.div>
  );
}
