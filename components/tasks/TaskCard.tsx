import { TaskWithSteps } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import Link from 'next/link';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: TaskWithSteps;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="p-6 bg-surface border border-text-secondary/5 rounded-3xl shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-light text-text-primary group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          <span className="text-xs text-text-secondary bg-text-secondary/5 px-2 py-1 rounded-full">
            {task.steps.length} steps
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-text-secondary uppercase tracking-wider">
            <span>Progress</span>
            <span>{task.progress_percentage}%</span>
          </div>
          <ProgressBar percentage={task.progress_percentage} className="h-2" />
        </div>
      </motion.div>
    </Link>
  );
}
