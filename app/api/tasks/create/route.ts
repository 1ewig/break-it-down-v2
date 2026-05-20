import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { buildTaskBreakdownPrompt } from '@/lib/ai/prompts';
import { taskBreakdownSchema, sanitizeAIJSON, handleAIError } from '@/lib/ai/schemas';
import { z, ZodError } from 'zod';
import { getAuthUser } from '@/lib/supabase/server';
import type { EnergyLevel } from '@/types';

type GenerateTextOptions = Parameters<typeof generateText>[0] & {
  responseFormat?: { type: 'json_object' | 'json_schema'; schema?: unknown };
};

const requestSchema = z.object({
  taskTitle: z.string().min(1).max(500).transform(s => s.trim()),
  energy_level: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { user, errorResponse } = await getAuthUser();
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
    return Response.json(validated);
  } catch (error) {
    return handleAIError(error, 'Error creating task breakdown');
  }
}
