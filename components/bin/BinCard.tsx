'use client';

import { useState } from 'react';
import { TaskWithSteps } from '@/types';
import { motion } from 'motion/react';
import { Trash2, RotateCcw, Clock } from 'lucide-react';
import { SPRING_GENTLE } from '@/lib/animations';
import { useBinMutations } from '@/hooks/useBinMutations';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface BinCardProps {
  task: TaskWithSteps;
}

function getDaysLeft(deletedAt: string): number {
  const diff = Date.now() - new Date(deletedAt).getTime();
  const daysElapsed = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - daysElapsed);
}

export function BinCard({ task }: BinCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { restore, permanentDelete } = useBinMutations();
  const daysLeft = task.deleted_at ? getDaysLeft(task.deleted_at) : 30;

  const handleDelete = () => {
    permanentDelete.mutate(task.id);
    setShowConfirm(false);
  };

  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={SPRING_GENTLE}
        className="p-5 rounded-3xl bg-surface border border-text-secondary/5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-light text-text-primary truncate">{task.title}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-text-secondary/50 text-xs">
              <Clock className="w-3 h-3" />
              <span>
                {daysLeft > 0
                  ? `Auto-deletes in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
                  : 'Expiring soon'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => restore.mutate(task.id)}
              disabled={restore.isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-2xl text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={permanentDelete.isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-2xl text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete Permanently?"
        message="This will remove the task and all its sub-steps forever. You cannot undo this action."
        confirmLabel="Delete Forever"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
