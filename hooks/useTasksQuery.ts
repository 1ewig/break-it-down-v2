'use client';

import { useQuery } from '@tanstack/react-query';
import { getTasksWithSteps, getTaskWithSteps } from '@/lib/db/indexedDB';
import { TaskWithSteps } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

export function useTasksQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      return getTasksWithSteps(user?.id);
    },
    enabled: !!user,
  });
}

export function useTaskQuery(taskId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['task', taskId, user?.id],
    queryFn: async () => {
      return getTaskWithSteps(taskId);
    },
    enabled: !!taskId && !!user,
  });
}