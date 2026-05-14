'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreTask, permanentDeleteTask } from '@/lib/db/indexedDB';
import { useAuth } from '@/providers/AuthProvider';

export function useBinMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const restore = useMutation({
    mutationFn: async (taskId: string) => {
      await restoreTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    },
  });

  const permanentDelete = useMutation({
    mutationFn: async (taskId: string) => {
      await permanentDeleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin', user?.id] });
    },
  });

  return { restore, permanentDelete };
}
