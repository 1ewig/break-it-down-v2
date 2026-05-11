import { useQuery } from '@tanstack/react-query';
import { getTasksWithSteps } from '@/lib/db/indexedDB';

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return getTasksWithSteps();
    },
  });
}