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
  const queryClient = useQueryClient();

  const updateStepCompletion = useMutation({
    mutationFn: async ({ taskId, stepId, isCompleted }: { taskId: string, stepId: string, isCompleted: boolean }) => {
      return updateStepCompletionInDB(taskId, stepId, isCompleted);
    },
    onMutate: async ({ taskId, stepId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', taskId] });

      const previousTasks = queryClient.getQueryData<TaskWithSteps[]>(['tasks']);
      const previousTask = queryClient.getQueryData<TaskWithSteps>(['task', taskId]);

      queryClient.setQueryData<TaskWithSteps[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.map((task) => {
          if (task.id !== taskId) return task;
          return updateTaskInCache(task, stepId, isCompleted);
        });
      });

      queryClient.setQueryData<TaskWithSteps>(['task', taskId], (old) => {
        if (!old) return old;
        return updateTaskInCache(old, stepId, isCompleted);
      });

      return { previousTasks, previousTask };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['task', variables?.taskId], context.previousTask);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables) {
        queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
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

      await updateStepNoteInDB(stepId, data.detailed_note);

      return { taskId, stepId, detailedNote: data.detailed_note };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
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

      if (!response.ok) throw new Error('Failed to create task');

      const data = await response.json();
      return createTaskWithStepsFromAI(taskTitle, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTask(taskId);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  return {
    updateStepCompletion,
    breakdownTask,
    createTask,
    deleteTask: deleteTaskMutation
  };
}