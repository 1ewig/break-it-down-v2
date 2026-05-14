import { Task, TaskWithSteps } from '@/types';
import db from './db';

export async function deleteTask(taskId: string): Promise<void> {
  const task = await db.tasks.get(taskId);
  if (!task) return;
  await db.tasks.put({ ...task, deleted_at: new Date().toISOString() });
}

export async function permanentDeleteTask(taskId: string): Promise<void> {
  await db.transaction('rw', [db.tasks, db.steps], async () => {
    await db.tasks.delete(taskId);
    await db.steps.where('task_id').equals(taskId).delete();
  });
}

export async function restoreTask(taskId: string): Promise<void> {
  const task = await db.tasks.get(taskId);
  if (!task) return;
  const { deleted_at, ...clean } = task;
  await db.tasks.put(clean);
}

export async function getDeletedTasksWithSteps(userId?: string): Promise<TaskWithSteps[]> {
  const [tasks, steps] = await Promise.all([
    db.tasks.toArray(),
    db.steps.toArray(),
  ]);
  return tasks
    .filter((t): t is Task & { deleted_at: string } => !!t.deleted_at)
    .filter((t) => !userId || t.user_id === userId)
    .map((task) => ({
      ...task,
      steps: steps
        .filter((s) => s.task_id === task.id)
        .sort((a, b) => a.order_index - b.order_index),
    }))
    .sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
}

export async function purgeExpiredDeletedTasks(days: number = 30, userId?: string): Promise<number> {
  const allTasks = await db.tasks.toArray();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const expired = allTasks.filter(
    (t) => t.deleted_at && new Date(t.deleted_at).getTime() < cutoff
  ).filter((t) => !userId || t.user_id === userId);

  if (expired.length === 0) return 0;

  await db.transaction('rw', [db.tasks, db.steps], async () => {
    for (const task of expired) {
      await db.tasks.delete(task.id);
      await db.steps.where('task_id').equals(task.id).delete();
    }
  });
  return expired.length;
}
