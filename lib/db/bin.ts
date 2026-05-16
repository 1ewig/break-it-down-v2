import { Task, TaskWithSteps } from '@/types';
import db from './db';
import { loadTasksWithSteps } from './shared';

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
  return loadTasksWithSteps(userId, 'deleted');
}

export async function purgeExpiredDeletedTasks(days: number = 30, userId?: string): Promise<number> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  
  // Use indexed query for deleted_at to avoid full table scan
  let collection = db.tasks.where('deleted_at').below(cutoffDate);
  
  if (userId) {
    collection = collection.filter(t => t.user_id === userId);
  }
  
  const expired = await collection.toArray();

  if (expired.length === 0) return 0;

  await db.transaction('rw', [db.tasks, db.steps], async () => {
    for (const task of expired) {
      await db.tasks.delete(task.id);
      await db.steps.where('task_id').equals(task.id).delete();
    }
  });
  return expired.length;
}
