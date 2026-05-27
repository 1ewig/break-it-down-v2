import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { buildTaskBreakdownPrompt } from '@/lib/ai/prompts';
import { taskBreakdownSchema, sanitizeAIJSON, handleAIError } from '@/lib/ai/schemas';
import { z, ZodError } from 'zod';
import { getAuthUser } from '@/lib/supabase/server';
import type { EnergyLevel, Task, Step, TaskWithSteps } from '@/types';

type GenerateTextOptions = Parameters<typeof generateText>[0] & {
  responseFormat?: { type: 'json_object' | 'json_schema'; schema?: unknown };
};

const requestSchema = z.object({
  taskTitle: z.string().min(1).max(500).transform(s => s.trim()),
  energy_level: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { user, supabase, errorResponse } = await getAuthUser();
  if (errorResponse) return errorResponse;

  let taskTitle: string;
  let energy_level: EnergyLevel;
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);
    taskTitle = parsed.taskTitle;
    energy_level = parsed.energy_level;
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: 'Invalid request body', details: error.issues }, { status: 400 });
    }
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: buildTaskBreakdownPrompt(energy_level),
      prompt: `${taskTitle}`,
      responseFormat: { type: 'json_object' },
    } as GenerateTextOptions);

    const sanitized = sanitizeAIJSON(text);
    const object = JSON.parse(sanitized);

    if (object?.error === true && typeof object.message === 'string') {
      return Response.json({ error: object.message }, { status: 400 });
    }

    const validated = taskBreakdownSchema.parse(object);

    const taskId = `task-${Date.now()}`;

    const steps: Step[] = validated.steps.map((step, idx) => ({
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
      user_id: user.id,
      title: validated.title || taskTitle,
      affirmation: validated.affirmation,
      closing_tip: validated.closing_tip,
      is_completed: false,
      progress_percentage: 0,
      created_at: new Date().toISOString(),
    };

    const { error: taskError } = await supabase.from('tasks').insert(newTask);
    if (taskError) throw taskError;

    const { error: stepsError } = await supabase.from('steps').insert(steps);
    if (stepsError) throw stepsError;

    return Response.json({ ...newTask, steps } satisfies TaskWithSteps);
  } catch (error) {
    return handleAIError(error, 'Error creating task breakdown');
  }
}
