import { Task, TaskWithSteps } from '@/types';
import { getTasksTable, getStepsTable } from '../supabase/tables';

type FilterMode = 'active' | 'deleted';

export async function loadTasksWithSteps(userId?: string, mode: FilterMode = 'active'): Promise<TaskWithSteps[]> {
  // 1. Query tasks from Supabase
  let query = getTasksTable().select('*');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (mode === 'deleted') {
    query = query.not('deleted_at', 'is', null);
  } else {
    query = query.is('deleted_at', null);
  }

  const { data: tasks, error: tasksError } = await query;
  if (tasksError) throw tasksError;
  if (!tasks || tasks.length === 0) return [];

  // 2. Query steps for these tasks
  const taskIds = tasks.map(t => t.id);
  const { data: steps, error: stepsError } = await getStepsTable()
    .select('*')
    .in('task_id', taskIds);
  if (stepsError) throw stepsError;

  // 3. Group steps by task and sort
  const getSortDate = (t: Task) => 
    mode === 'deleted' ? (t.deleted_at || t.created_at) : t.created_at;

  return tasks
    .map((task) => ({
      ...task,
      steps: (steps || [])
        .filter((s) => s.task_id === task.id)
        .sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => {
      const dateA = new Date(getSortDate(a)).getTime();
      const dateB = new Date(getSortDate(b)).getTime();
      return dateB - dateA;
    }) as TaskWithSteps[];
}
