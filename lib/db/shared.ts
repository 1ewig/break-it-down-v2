import { Task, TaskWithSteps } from '@/types';
import db from './db';

type FilterMode = 'active' | 'deleted';

export async function loadTasksWithSteps(userId?: string, mode: FilterMode = 'active'): Promise<TaskWithSteps[]> {
  const [tasks, steps] = await Promise.all([
    db.tasks.toArray(),
    db.steps.toArray(),
  ]);

  const filtered = tasks
    .filter((t) => mode === 'deleted' ? !!t.deleted_at : !t.deleted_at)
    .filter((t) => !userId || t.user_id === userId);

  return filtered
    .map((task) => ({
      ...task,
      steps: steps
        .filter((s) => s.task_id === task.id)
        .sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => {
      const dateA = mode === 'deleted' ? (a as Task & { deleted_at: string }).deleted_at : a.created_at;
      const dateB = mode === 'deleted' ? (b as Task & { deleted_at: string }).deleted_at : b.created_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
}
