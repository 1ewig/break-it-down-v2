import { Task, TaskWithSteps } from '@/types';
import { getTasksTable, getStepsTable } from '../supabase/tables';
import { loadTasksWithSteps } from './shared';

export async function getTasksWithSteps(userId?: string): Promise<TaskWithSteps[]> {
  return loadTasksWithSteps(userId, 'active');
}

export async function getTaskWithSteps(taskId: string): Promise<TaskWithSteps | null> {
  const { data: task, error: taskError } = await getTasksTable()
    .select('*')
    .eq('id', taskId)
    .single();

  if (taskError || !task) return null;

  const { data: steps, error: stepsError } = await getStepsTable()
    .select('*')
    .eq('task_id', taskId)
    .order('order_index', { ascending: true });

  if (stepsError) throw stepsError;

  return { ...task, steps: steps || [] } as TaskWithSteps;
}

export async function saveTask(task: Task): Promise<void> {
  const { error } = await getTasksTable().upsert(task);
  if (error) throw error;
}
