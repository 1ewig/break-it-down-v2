import { Task, TaskWithSteps } from '@/types';
import db from './db';

export async function getTasksWithSteps(userId?: string): Promise<TaskWithSteps[]> {
  const [tasks, steps] = await Promise.all([
    db.tasks.toArray(),
    db.steps.toArray(),
  ]);
  return tasks
    .filter((t) => !t.deleted_at)
    .filter((t) => !userId || t.user_id === userId)
    .map((task) => ({
      ...task,
      steps: steps
        .filter((s) => s.task_id === task.id)
        .sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
