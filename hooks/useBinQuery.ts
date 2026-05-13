'use client';

import { useQuery } from '@tanstack/react-query';
import { getDeletedTasksWithSteps, purgeExpiredDeletedTasks } from '@/lib/db/indexedDB';

export function useDeletedTasksQuery() {
  return useQuery({
    queryKey: ['bin'],
    queryFn: async () => {
      await purgeExpiredDeletedTasks(30);
      return getDeletedTasksWithSteps();
    },
  });
}

export function useDeletedTasksCount() {
  const { data } = useDeletedTasksQuery();
  return data?.length ?? 0;
}
