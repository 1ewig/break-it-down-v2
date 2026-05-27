'use client';

import { TaskWithSteps } from '@/types';
import { TaskCard } from './TaskCard';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface TasksListProps {
  tasks: TaskWithSteps[];
  onDeleteTask: (taskId: string) => void;
  pendingDeleteId: string | null;
  onPendingDeleteChange: (id: string | null) => void;
}

export function TasksList({ tasks, onDeleteTask, pendingDeleteId, onPendingDeleteChange }: TasksListProps) {
  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    onDeleteTask(pendingDeleteId);
    onPendingDeleteChange(null);
  };

  return (
    <>
      <motion.div 
        variants={STAGGER_CONTAINER}
        className="grid gap-4 w-full"
      >
        {tasks.map((task) => (
          <motion.div key={task.id} variants={FADE_IN_UP}>
            <TaskCard 
              task={task} 
              onDelete={(id) => onPendingDeleteChange(id)} 
            />
          </motion.div>
        ))}
      </motion.div>

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete task?"
        message="This task will be moved to the bin and automatically deleted after 30 days."
        confirmLabel="Move to bin"
        onConfirm={handleConfirmDelete}
        onCancel={() => onPendingDeleteChange(null)}
      />
    </>
  );
}
