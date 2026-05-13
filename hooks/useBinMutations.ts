'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restoreTask, permanentDeleteTask } from '@/lib/db/indexedDB';

export function useBinMutations() {
  const queryClient = useQueryClient();

  const restore = useMutation({
    mutationFn: async (taskId: string) => {
      await restoreTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const permanentDelete = useMutation({
    mutationFn: async (taskId: string) => {
      await permanentDeleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin'] });
    },
  });

  return { restore, permanentDelete };
}
