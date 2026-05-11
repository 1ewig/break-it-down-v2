import { useQuery } from '@tanstack/react-query';
import { getTasksWithSteps } from '@/lib/db/indexedDB';

/**
 * Hook to retrieve all tasks from the local IndexedDB.
 */
export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return getTasksWithSteps();
    },
  });
}
