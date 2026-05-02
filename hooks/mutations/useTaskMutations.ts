import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, hasSupabaseConfig } from '@/lib/supabase/client';
import { TaskWithSteps } from '@/types';
import { saveLocalTasks } from '../queries/useTasksQuery';

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const updateStepCompletion = useMutation({
    mutationFn: async ({ taskId, stepId, isCompleted }: { taskId: string, stepId: string, isCompleted: boolean }) => {
      if (hasSupabaseConfig && supabase) {
        await supabase.from('steps').update({ is_completed: isCompleted }).eq('id', stepId);
        
        // Need to calculate new progress to update task
        const previousTasks = queryClient.getQueryData<TaskWithSteps[]>(['tasks']);
        const task = previousTasks?.find(t => t.id === taskId);
        
        if (task) {
           const completedCount = task.steps.filter(s => s.id === stepId ? isCompleted : s.is_completed).length;
           const progress = task.steps.length > 0 ? Math.round((completedCount / task.steps.length) * 100) : 0;
           await supabase.from('tasks').update({ progress_percentage: progress, is_completed: progress === 100 }).eq('id', taskId);
        }
      }
      return { taskId, stepId, isCompleted };
    },
    onMutate: async ({ taskId, stepId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<TaskWithSteps[]>(['tasks']);

      queryClient.setQueryData<TaskWithSteps[]>(['tasks'], (old) => {
        if (!old) return old;
        const newTasks = old.map(t => {
          if (t.id !== taskId) return t;
          const updatedSteps = t.steps.map(s => s.id === stepId ? { ...s, is_completed: isCompleted } : s);
          const completedCount = updatedSteps.filter(s => s.is_completed).length;
          const progress = updatedSteps.length > 0 ? Math.round((completedCount / updatedSteps.length) * 100) : 0;
          return { ...t, steps: updatedSteps, progress_percentage: progress, is_completed: progress === 100 };
        });
        saveLocalTasks(newTasks);
        return newTasks;
      });

      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
  });

  const breakdownTask = useMutation({
    mutationFn: async ({ taskId, stepId, stepTitle }: { taskId: string, stepId: string, stepTitle: string }) => {
      const res = await fetch('/api/tasks/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, stepTitle, taskId })
      });
      const data = await res.json();
      if (!data.subSteps) throw new Error('No substeps returned');
      return { taskId, stepId, newSteps: data.subSteps };
    },
    onSuccess: ({ taskId, newSteps }) => {
      queryClient.setQueryData<TaskWithSteps[]>(['tasks'], (old) => {
        if (!old) return old;
        const newTasks = old.map(t => {
          if (t.id !== taskId) return t;
          return { ...t, steps: [...t.steps, ...newSteps] };
        });
        saveLocalTasks(newTasks);
        return newTasks;
      });
    }
  });

  const addLocalTask = useMutation({
    mutationFn: async (task: TaskWithSteps) => task,
    onSuccess: (task) => {
      queryClient.setQueryData<TaskWithSteps[]>(['tasks'], (old) => {
        const newTasks = [task, ...(old || [])];
        saveLocalTasks(newTasks);
        return newTasks;
      });
    }
  });

  return {
    updateStepCompletion,
    breakdownTask,
    addLocalTask
  };
}
