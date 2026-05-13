'use client';

import { useState } from 'react';
import { TaskWithSteps } from '@/types';
import { TaskCard } from './TaskCard';
import { motion } from 'motion/react';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToastStore } from '@/store/useToastStore';

interface TasksListProps {
  tasks: TaskWithSteps[];
}

export function TasksList({ tasks }: TasksListProps) {
  const { deleteTask } = useTaskMutations();
  const { showToast } = useToastStore();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteTask.mutate(pendingDeleteId);
    setPendingDeleteId(null);
    showToast('Task moved to bin. You can find it at the top of My Tasks.');
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
              onDelete={(id) => setPendingDeleteId(id)} 
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
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}