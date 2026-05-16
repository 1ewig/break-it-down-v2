import { Task, TaskWithSteps } from '@/types';
import db from './db';
import { loadTasksWithSteps } from './shared';

export async function getTasksWithSteps(userId?: string): Promise<TaskWithSteps[]> {
  return loadTasksWithSteps(userId, 'active');
}

export async function getTaskWithSteps(taskId: string): Promise<TaskWithSteps | null> {
  const task = await db.tasks.get(taskId);
  if (!task) return null;
  const steps = await db.steps
    .where('task_id')
    .equals(taskId)
    .sortBy('order_index');
  return { ...task, steps };
}

export function saveTask(task: Task): Promise<void> {
  return db.tasks.put(task).then(() => {});
}
