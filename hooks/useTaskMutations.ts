'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskWithSteps } from '@/types';
import { 
  deleteTask, 
  updateStepCompletionInDB,
} from '@/lib/db/barrel';
import { useAuth } from '@/providers/AuthProvider';
import { useToastStore } from '@/store/useToastStore';
import { useUIStore } from '@/store/useUIStore';

function updateTaskInCache(task: TaskWithSteps, stepId: string, isCompleted: boolean): TaskWithSteps {
  const updatedSteps = task.steps.map((step) =>
    step.id === stepId ? { ...step, is_completed: isCompleted } : step
  );
  const completedCount = updatedSteps.filter((s) => s.is_completed).length;
  const progress = updatedSteps.length > 0 ? Math.round((completedCount / updatedSteps.length) * 100) : 0;
  return {
    ...task,
    steps: updatedSteps,
    progress_percentage: progress,
    is_completed: progress === 100,
  };
}

export function useTaskMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const energyLevel = useUIStore((s) => s.energyLevel);

  const updateStepCompletion = useMutation({
    mutationFn: async ({ taskId, stepId, isCompleted }: { taskId: string, stepId: string, isCompleted: boolean }) => {
      return updateStepCompletionInDB(stepId, isCompleted);
    },
    onMutate: async ({ taskId, stepId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', user?.id] });
      await queryClient.cancelQueries({ queryKey: ['task', taskId, user?.id] });

      const previousTasks = queryClient.getQueryData<TaskWithSteps[]>(['tasks', user?.id]);
      const previousTask = queryClient.getQueryData<TaskWithSteps>(['task', taskId, user?.id]);

      queryClient.setQueryData<TaskWithSteps[]>(['tasks', user?.id], (old) => {
        if (!old) return old;
        return old.map((task) => {
          if (task.id !== taskId) return task;
          return updateTaskInCache(task, stepId, isCompleted);
        });
      });

      queryClient.setQueryData<TaskWithSteps>(['task', taskId, user?.id], (old) => {
        if (!old) return old;
        return updateTaskInCache(old, stepId, isCompleted);
      });

      return { previousTasks, previousTask };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', user?.id], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['task', variables?.taskId, user?.id], context.previousTask);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      if (variables) {
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId, user?.id] });
      }
    },
  });

  const breakdownTask = useMutation({
    mutationFn: async ({ taskId, stepId, stepTitle, taskTitle }: { taskId: string, stepId: string, stepTitle: string, taskTitle?: string }) => {
      const res = await fetch('/api/tasks/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, stepTitle, taskId, taskTitle, energy_level: energyLevel })
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to fetch explanation');
      }

      const data = await res.json();
      if (!data.detailedNote) throw new Error('No explanation returned');

      return { taskId, stepId, detailedNote: data.detailedNote };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['task', data.taskId, user?.id] });
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Failed to break down step';
      showToast(`${message}. Let's try again gently.`);
    }
  });

  const createTask = useMutation({
    mutationFn: async ({ taskTitle, energy_level }: { taskTitle: string; energy_level?: string }) => {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle, energy_level: energy_level || energyLevel }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      return data as TaskWithSteps;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTask(taskId);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['bin', user?.id] });
    }
  });

  return {
    updateStepCompletion,
    breakdownTask,
    createTask,
    deleteTask: deleteTaskMutation
  };
}