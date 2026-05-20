import { Task, TaskWithSteps } from '@/types';
import { getTasksTable } from '../supabase/tables';
import { loadTasksWithSteps } from './shared';

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await getTasksTable()
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', taskId);
  if (error) throw error;
}

export async function permanentDeleteTask(taskId: string): Promise<void> {
  // Cascades to steps via foreign key constraint
  const { error } = await getTasksTable()
    .delete()
    .eq('id', taskId);
  if (error) throw error;
}

export async function restoreTask(taskId: string): Promise<void> {
  const { error } = await getTasksTable()
    .update({ deleted_at: null })
    .eq('id', taskId);
  if (error) throw error;
}

export async function getDeletedTasksWithSteps(userId?: string): Promise<TaskWithSteps[]> {
  return loadTasksWithSteps(userId, 'deleted');
}

export async function purgeExpiredDeletedTasks(days: number = 30, userId?: string): Promise<number> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  
  let selectQuery = getTasksTable()
    .select('id')
    .lt('deleted_at', cutoffDate);
    
  if (userId) {
    selectQuery = selectQuery.eq('user_id', userId);
  }
  
  const { data: expired, error: selectError } = await selectQuery;
  if (selectError) throw selectError;
  if (!expired || expired.length === 0) return 0;
  
  const expiredIds = expired.map(t => t.id);
  const { error: deleteError } = await getTasksTable()
    .delete()
    .in('id', expiredIds);
  if (deleteError) throw deleteError;
  
  return expiredIds.length;
}
