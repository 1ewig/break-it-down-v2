'use client';

import { useTasks } from '@/hooks/useTasks';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Heart } from 'lucide-react';

export default function TasksPage() {
  const { tasks } = useTasks();

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full p-4 md:p-8">
      <div className="mb-8 pl-2">
        <h1 className="text-3xl font-light text-text-primary mb-2">My Tasks</h1>
        <p className="text-text-secondary text-sm">One gentle step at a time.</p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-3xl border border-surface/50">
          <Heart className="w-12 h-12 text-primary/50 mb-4" />
          <h2 className="text-xl font-light text-text-primary mb-2">No tasks yet</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-xs">
            Whenever you're ready, let's break something down together.
          </p>
          <Link href="/home" className="bg-primary/20 text-primary px-6 py-3 rounded-full hover:bg-primary/30 transition-colors">
            Start a chat
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-surface p-6 rounded-3xl border border-text-secondary/5 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg text-text-primary font-medium">{task.title}</h3>
                  <span className="text-primary/80 font-mono text-sm">{task.progress_percentage}%</span>
                </div>
                <ProgressBar percentage={task.progress_percentage} />
                <div className="mt-4 text-xs text-text-secondary/70 flex justify-between">
                  <span>{task.steps.filter(s => s.is_completed).length} of {task.steps.length} steps complete</span>
                  {task.is_completed && <span className="text-primary">All done! 🎉</span>}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
