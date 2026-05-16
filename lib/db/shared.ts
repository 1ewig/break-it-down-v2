import { Task, TaskWithSteps } from '@/types';
import db from './db';

type FilterMode = 'active' | 'deleted';

export async function loadTasksWithSteps(userId?: string, mode: FilterMode = 'active'): Promise<TaskWithSteps[]> {
  // 1. Efficiently query tasks by user_id if provided, then filter by mode
  const tasksQuery = userId 
    ? db.tasks.where('user_id').equals(userId) 
    : db.tasks.toCollection();

  const tasks = await tasksQuery
    .filter((t) => mode === 'deleted' ? !!t.deleted_at : !t.deleted_at)
    .toArray();

  if (tasks.length === 0) return [];

  // 2. Efficiently query only the steps belonging to these tasks
  const taskIds = tasks.map(t => t.id);
  const steps = await db.steps
    .where('task_id')
    .anyOf(taskIds)
    .toArray();

  // 3. Group steps by task and apply sorting
  const getSortDate = (t: Task) => 
    mode === 'deleted' ? (t.deleted_at || t.created_at) : t.created_at;

  return tasks
    .map((task) => ({
      ...task,
      steps: steps
        .filter((s) => s.task_id === task.id)
        .sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => {
      const dateA = new Date(getSortDate(a)).getTime();
      const dateB = new Date(getSortDate(b)).getTime();
      return dateB - dateA;
    });
}
