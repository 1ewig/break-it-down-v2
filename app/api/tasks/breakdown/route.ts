import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { STEP_BREAKDOWN_PROMPT } from '@/lib/ai/prompts';
import { stepBreakdownSchema, sanitizeAIJSON, handleAIError } from '@/lib/ai/schemas';
import { getAuthUser } from '@/lib/supabase/server';

type GenerateTextOptions = Parameters<typeof generateText>[0] & {
  responseFormat?: { type: 'json_object' | 'json_schema'; schema?: unknown };
};

export const maxDuration = 30;

/**
 * API route to break a step down into substeps using Llama 3.1.
 * Returns the mapped substeps directly, leaving persistence entirely to the client.
 */
export async function POST(req: Request) {
  const { user, errorResponse } = await getAuthUser();
  if (errorResponse) return errorResponse;

  const { stepId, stepTitle, taskId, taskTitle } = await req.json();

  try {
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: STEP_BREAKDOWN_PROMPT,
      prompt: `Task Context: "${taskTitle || 'General Task'}"\nPlease explain how to accomplish this specific step in exactly 3-5 concise, numbered points (e.g. 1. Do this\\n2. Do that): "${stepTitle}"`,
      responseFormat: { type: 'json_object' },
    } as GenerateTextOptions);

    const sanitized = sanitizeAIJSON(text);
    const object = JSON.parse(sanitized);
    const validated = stepBreakdownSchema.parse(object);

    return Response.json({ detailed_note: validated.detailed_note, reassurance: validated.reassurance });
  } catch (error) {
    return handleAIError(error, 'Error explaining step');
  }
}
