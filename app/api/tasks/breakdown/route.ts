import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { STEP_BREAKDOWN_PROMPT } from '@/lib/ai/prompts';

export const runtime = 'edge';
export const maxDuration = 30;

/**
 * API route to break a step down into substeps using Llama 3.3.
 * Returns the mapped substeps directly, leaving persistence entirely to the client.
 */
export async function POST(req: Request) {
  const { stepId, stepTitle, taskId } = await req.json();

  try {
    const { text } = await (generateText as any)({
      model: groq('llama-3.3-70b-versatile'),
      system: STEP_BREAKDOWN_PROMPT,
      prompt: `Please explain how to accomplish this step in exactly 3-5 concise, numbered points (e.g. 1. Do this\\n2. Do that): "${stepTitle}"`,
      responseFormat: { type: 'json_object' },
    });

    // Strip markdown code blocks if they exist
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const object = JSON.parse(cleanText);

    return Response.json({ detailed_note: object.detailed_note });
  } catch (error) {
    console.error('Error explaining step:', error);
    return Response.json({ error: 'Failed to explain step' }, { status: 500 });
  }
}
