'use client';

import { motion } from 'motion/react';

import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { STAGGER_CONTAINER, FADE_IN_UP, SCALE_IN } from '@/lib/animations';

export default function TasksPage() {
  const { tasks } = useTasks();

  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8"
    >
      <motion.div 
        variants={FADE_IN_UP}
        className="mb-8 pl-2"
      >
        <h1 className="text-3xl font-light text-text-primary mb-2">My Tasks</h1>
        <p className="text-text-secondary text-sm">One gentle step at a time.</p>
      </motion.div>

      {tasks.length === 0 ? (
        <motion.div 
          variants={FADE_IN_UP}
          className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-3xl border border-surface/50"
        >
          <motion.div variants={SCALE_IN}>
            <Heart className="w-12 h-12 text-primary/50 mb-4" />
          </motion.div>
          <h2 className="text-xl font-light text-text-primary mb-2">No tasks yet</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-xs">
            Whenever you're ready, let's break something down together.
          </p>
          <Link href="/home" className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors">
            Get started
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          variants={STAGGER_CONTAINER}
          className="grid gap-4"
        >
          {tasks.map((task) => (
            <motion.div key={task.id} variants={FADE_IN_UP}>
              <TaskCard task={task} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

