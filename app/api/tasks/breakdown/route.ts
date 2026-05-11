import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { TASK_BREAKDOWN_PROMPT } from '@/lib/ai/prompts';

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
      system: TASK_BREAKDOWN_PROMPT,
      prompt: `Break down this step into smaller pieces: "${stepTitle}"`,
      responseFormat: { type: 'json_object' },
    });

    // Strip markdown code blocks if they exist
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const object = JSON.parse(cleanText);
    
    const subSteps = object.steps.map((step: any, idx: number) => ({
      id: `${stepId}-sub-${idx}`,
      task_id: taskId,
      parent_step_id: stepId,
      title: step.title,
      subtitle: step.subtitle,
      time_estimate: step.time_estimate,
      materials: step.materials,
      note: step.note,
      why: step.why,
      is_completed: false,
      order_index: idx,
      created_at: new Date().toISOString()
    }));

    return Response.json({ subSteps });
  } catch (error) {
    console.error('Error breaking down step:', error);
    return Response.json({ error: 'Failed to break down step' }, { status: 500 });
  }
}
