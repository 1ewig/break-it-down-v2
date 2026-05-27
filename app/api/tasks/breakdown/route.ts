import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { buildStepBreakdownPrompt } from '@/lib/ai/prompts';
import { stepBreakdownSchema, sanitizeAIJSON, handleAIError } from '@/lib/ai/schemas';
import { getAuthUser } from '@/lib/supabase/server';
import type { EnergyLevel } from '@/types';

type GenerateTextOptions = Parameters<typeof generateText>[0] & {
  responseFormat?: { type: 'json_object' | 'json_schema'; schema?: unknown };
};

export const maxDuration = 30;

export async function POST(req: Request) {
  const { user, supabase, errorResponse } = await getAuthUser();
  if (errorResponse) return errorResponse;

  const { stepId, stepTitle, taskId, taskTitle, energy_level = 'medium' } = await req.json() as {
    stepId: string;
    stepTitle: string;
    taskId: string;
    taskTitle?: string;
    energy_level?: EnergyLevel;
  };

  try {
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: buildStepBreakdownPrompt(energy_level),
      prompt: `Task Context: "${taskTitle || 'General Task'}"\nBreak down this step: "${stepTitle}"`,
      responseFormat: { type: 'json_object' },
    } as GenerateTextOptions);

    const sanitized = sanitizeAIJSON(text);
    const object = JSON.parse(sanitized);
    const validated = stepBreakdownSchema.parse(object);

    const combinedNote = validated.reassurance
      ? `${validated.detailed_note}\n\n---\n${validated.reassurance}`
      : validated.detailed_note;

    const { error: updateError } = await supabase
      .from('steps')
      .update({ note: combinedNote, is_broken_down: true })
      .eq('id', stepId);

    if (updateError) throw updateError;

    return Response.json({ taskId, stepId, detailedNote: combinedNote });
  } catch (error) {
    return handleAIError(error, 'Error explaining step');
  }
}
