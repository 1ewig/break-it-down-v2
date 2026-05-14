import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { STEP_BREAKDOWN_PROMPT } from '@/lib/ai/prompts';
import { stepBreakdownSchema, sanitizeAIJSON } from '@/lib/ai/schemas';
import { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 30;

/**
 * API route to break a step down into substeps using Llama 3.3.
 * Returns the mapped substeps directly, leaving persistence entirely to the client.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { stepId, stepTitle, taskId, taskTitle } = await req.json();

  try {
    const { text } = await (generateText as any)({
      model: groq('llama-3.3-70b-versatile'),
      system: STEP_BREAKDOWN_PROMPT,
      prompt: `Task Context: "${taskTitle || 'General Task'}"\nPlease explain how to accomplish this specific step in exactly 3-5 concise, numbered points (e.g. 1. Do this\\n2. Do that): "${stepTitle}"`,
      responseFormat: { type: 'json_object' },
    });

    const sanitized = sanitizeAIJSON(text);
    const object = JSON.parse(sanitized);
    const validated = stepBreakdownSchema.parse(object);

    return Response.json({ detailed_note: validated.detailed_note, reassurance: validated.reassurance });
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('JSON parse error:', error);
      return Response.json({ error: 'AI returned malformed JSON' }, { status: 502 });
    }
    if (error instanceof ZodError) {
      console.error('Schema validation error:', error.issues);
      return Response.json({ error: 'AI response missing required fields', details: error.issues }, { status: 502 });
    }
    console.error('Error explaining step:', error);
    return Response.json({ error: 'Failed to explain step' }, { status: 500 });
  }
}
