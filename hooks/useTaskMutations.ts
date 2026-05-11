import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskWithSteps } from '@/types';
import { 
  saveSteps, 
  deleteTask, 
  updateStepCompletionInDB,
  createTaskWithStepsFromAI
} from '@/lib/db/indexedDB';

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const updateStepCompletion = useMutation({
    mutationFn: async ({ taskId, stepId, isCompleted }: { taskId: string, stepId: string, isCompleted: boolean }) => {
      return updateStepCompletionInDB(taskId, stepId, isCompleted);
    },
    onMutate: async ({ taskId, stepId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<TaskWithSteps[]>(['tasks']);

      queryClient.setQueryData<TaskWithSteps[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.map((task) => {
          if (task.id !== taskId) return task;

          const updatedSteps = task.steps.map((step) => 
            step.id === stepId ? { ...step, is_completed: isCompleted } : step
          );

          const completedCount = updatedSteps.filter((s) => s.is_completed).length;
          const progress = updatedSteps.length > 0 ? Math.round((completedCount / updatedSteps.length) * 100) : 0;

          return { 
            ...task, 
            steps: updatedSteps, 
            progress_percentage: progress, 
            is_completed: progress === 100 
          };
        });
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const breakdownTask = useMutation({
    mutationFn: async ({ taskId, stepId, stepTitle }: { taskId: string, stepId: string, stepTitle: string }) => {
      const res = await fetch('/api/tasks/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, stepTitle, taskId })
      });

      if (!res.ok) throw new Error('Failed to fetch breakdown steps');

      const data = await res.json();
      if (!data.subSteps) throw new Error('No substeps returned');

      await saveSteps(data.subSteps);

      return { taskId, stepId, newSteps: data.subSteps };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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