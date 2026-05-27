import { Step } from '@/types';
import { getStepsTable } from '../supabase/tables';
import { createClient } from '../supabase/client';

export async function saveSteps(steps: Step[]): Promise<void> {
  const { error } = await getStepsTable().upsert(steps);
  if (error) throw error;
}

export async function updateStepCompletionInDB(
  stepId: string,
  isCompleted: boolean
): Promise<{ progress_percentage: number; is_completed: boolean }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .rpc('set_step_completion', {
      p_step_id: stepId,
      p_is_completed: isCompleted,
    });

  if (error) throw error;

  const result = data as unknown as { progress_percentage: number; is_completed: boolean };
  return result;
}

export async function updateStepNoteInDB(stepId: string, detailedNote: string): Promise<void> {
  const { error } = await getStepsTable()
    .update({ note: detailedNote, is_broken_down: true })
    .eq('id', stepId);
  if (error) throw error;
}
