import { Task, Step, TaskWithSteps } from '@/types';
import { saveTask } from './tasks';
import { saveSteps } from './steps';

export async function createTaskWithStepsFromAI(
  taskTitle: string,
  aiData: { title?: string; affirmation?: string; closing_tip?: string; steps: any[] }
): Promise<TaskWithSteps> {
  const taskId = `task-${Date.now()}`;

  const stepsData: Step[] = aiData.steps.map((step, idx) => ({
    id: `${taskId}-s-${idx}`,
    task_id: taskId,
    parent_step_id: null,
    title: step.title,
    subtitle: step.subtitle,
    time_estimate: step.time_estimate,
    materials: step.materials,
    note: step.note,
    why: step.why,
    is_completed: false,
    order_index: idx,
    created_at: new Date().toISOString(),
  }));

  const newTask: Task = {
    id: taskId,
    title: aiData.title || taskTitle,
    affirmation: aiData.affirmation,
    closing_tip: aiData.closing_tip,
    is_completed: false,
    progress_percentage: 0,
    created_at: new Date().toISOString(),
  };

  await saveTask(newTask);
  await saveSteps(stepsData);

  return { ...newTask, steps: stepsData };
}
