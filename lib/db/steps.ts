import { Step } from '@/types';
import db from './db';

export async function saveSteps(steps: Step[]): Promise<void> {
  await db.steps.bulkPut(steps);
}

export async function updateStepCompletionInDB(
  taskId: string,
  stepId: string,
  isCompleted: boolean
): Promise<{ progress_percentage: number; is_completed: boolean }> {
  return db.transaction('rw', [db.tasks, db.steps], async () => {
    const step = await db.steps.get(stepId);
    if (!step) throw new Error(`Step with ID ${stepId} not found`);

    await db.steps.put({ ...step, is_completed: isCompleted });

    const allSteps = await db.steps.where('task_id').equals(taskId).toArray();
    const completedCount = allSteps.filter((s) => s.is_completed).length;
    const progress = allSteps.length > 0
      ? Math.round((completedCount / allSteps.length) * 100)
      : 0;
    const isCompletedTask = progress === 100;

    const task = await db.tasks.get(taskId);
    if (!task) throw new Error(`Task with ID ${taskId} not found`);

    await db.tasks.put({ ...task, progress_percentage: progress, is_completed: isCompletedTask });
    return { progress_percentage: progress, is_completed: isCompletedTask };
  });
}

export async function updateStepNoteInDB(stepId: string, detailedNote: string): Promise<void> {
  const step = await db.steps.get(stepId);
  if (!step) throw new Error(`Step with ID ${stepId} not found`);
  await db.steps.put({ ...step, note: detailedNote, is_broken_down: true });
}
