'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskWithSteps } from '@/types';
import { 
  saveSteps, 
  deleteTask, 
  updateStepCompletionInDB,
  createTaskWithStepsFromAI,
  updateStepNoteInDB
} from '@/lib/db/indexedDB';
import { useAuth } from '@/providers/AuthProvider';

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

  const updateStepCompletion = useMutation({
    mutationFn: async ({ taskId, stepId, isCompleted }: { taskId: string, stepId: string, isCompleted: boolean }) => {
      return updateStepCompletionInDB(taskId, stepId, isCompleted);
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
        body: JSON.stringify({ stepId, stepTitle, taskId, taskTitle })
      });

      if (!res.ok) throw new Error('Failed to fetch explanation');

      const data = await res.json();
      if (!data.detailed_note) throw new Error('No explanation returned');

      const combinedNote = data.reassurance 
        ? `${data.detailed_note}\n\n---\n${data.reassurance}`
        : data.detailed_note;

      await updateStepNoteInDB(stepId, combinedNote);

      return { taskId, stepId, detailedNote: combinedNote };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['task', data.taskId, user?.id] });
      }
    }
  });

  const createTask = useMutation({
    mutationFn: async (taskTitle: string) => {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      return createTaskWithStepsFromAI(taskTitle, data, user?.id);
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