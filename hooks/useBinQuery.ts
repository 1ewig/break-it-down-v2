'use client';

import { useQuery } from '@tanstack/react-query';
import { getDeletedTasksWithSteps, purgeExpiredDeletedTasks } from '@/lib/db/indexedDB';
import { useAuth } from '@/providers/AuthProvider';

export function useDeletedTasksQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['bin', user?.id],
    queryFn: async () => {
      await purgeExpiredDeletedTasks(30, user?.id);
      return getDeletedTasksWithSteps(user?.id);
    },
    enabled: !!user,
  });
}

export function useDeletedTasksCount() {
  const { data } = useDeletedTasksQuery();
  return data?.length ?? 0;
}
