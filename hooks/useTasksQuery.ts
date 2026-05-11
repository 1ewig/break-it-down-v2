import { useQuery } from '@tanstack/react-query';
import { getTasksWithSteps, getTaskWithSteps } from '@/lib/db/indexedDB';
import { TaskWithSteps } from '@/types';

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return getTasksWithSteps();
    },
  });
}

export function useTaskQuery(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      return getTaskWithSteps(taskId);
    },
    enabled: !!taskId,
  });
}