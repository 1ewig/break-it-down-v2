'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreTask, permanentDeleteTask } from '@/lib/db/barrel';
import { useAuth } from '@/providers/AuthProvider';
import { useToastStore } from '@/store/useToastStore';

export function useBinMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const restore = useMutation({
    mutationFn: async (taskId: string) => {
      await restoreTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      showToast('Task restored. It is back in your active tasks.');
    },
  });

  const permanentDelete = useMutation({
    mutationFn: async (taskId: string) => {
      await permanentDeleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin', user?.id] });
      showToast('Task permanently deleted.');
    },
  });

  return { restore, permanentDelete };
}
