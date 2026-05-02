'use client';

import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import Link from 'next/link';
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
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
