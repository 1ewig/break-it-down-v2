import { Step } from '@/types';
import { getTasksTable, getStepsTable } from '../supabase/tables';

export async function saveSteps(steps: Step[]): Promise<void> {
  const { error } = await getStepsTable().upsert(steps);
  if (error) throw error;
}

export async function updateStepCompletionInDB(
  taskId: string,
  stepId: string,
  isCompleted: boolean
): Promise<{ progress_percentage: number; is_completed: boolean }> {
  // 1. Update the step completion status in Supabase
  const { error: stepUpdateError } = await getStepsTable()
    .update({ is_completed: isCompleted })
    .eq('id', stepId);
  if (stepUpdateError) throw stepUpdateError;

  // 2. Fetch all steps of the task to calculate progress percentage
  const { data: allSteps, error: stepsError } = await getStepsTable()
    .select('*')
    .eq('task_id', taskId);
  if (stepsError) throw stepsError;

  const completedCount = (allSteps || []).filter((s) => s.is_completed).length;
  const progress = (allSteps || []).length > 0
    ? Math.round((completedCount / allSteps.length) * 100)
    : 0;
  const isCompletedTask = progress === 100;

  // 3. Update the task with the new progress percentage and completion status
  const { error: taskUpdateError } = await getTasksTable()
    .update({ progress_percentage: progress, is_completed: isCompletedTask })
    .eq('id', taskId);
  if (taskUpdateError) throw taskUpdateError;

  return { progress_percentage: progress, is_completed: isCompletedTask };
}

export async function updateStepNoteInDB(stepId: string, detailedNote: string): Promise<void> {
  const { error } = await getStepsTable()
    .update({ note: detailedNote, is_broken_down: true })
    .eq('id', stepId);
  if (error) throw error;
}
