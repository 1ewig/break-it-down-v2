import { useQuery } from '@tanstack/react-query';
import { supabase, hasSupabaseConfig } from '@/lib/supabase/client';
import { TaskWithSteps } from '@/types';

function getLocalTasks(): TaskWithSteps[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('break_it_down_tasks');
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalTasks(tasks: TaskWithSteps[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('break_it_down_tasks', JSON.stringify(tasks));
  }
}

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!hasSupabaseConfig || !supabase) {
        return getLocalTasks();
      }
      
      const { data: dbTasks, error: tasksError } = await supabase.from('tasks').select('*');
      const { data: dbSteps, error: stepsError } = await supabase.from('steps').select('*');
      
      if (tasksError || stepsError) {
        console.error('Supabase fetch failed, falling back to local');
        return getLocalTasks();
      }

      const combined: TaskWithSteps[] = dbTasks.map(task => ({
        ...task,
        steps: dbSteps.filter(s => s.task_id === task.id).sort((a, b) => a.order_index - b.order_index)
      }));
      
      saveLocalTasks(combined);
      return combined;
    },
    initialData: getLocalTasks,
  });
}
