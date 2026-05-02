import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { supabase, hasSupabaseConfig } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

import { TASK_BREAKDOWN_PROMPT } from '@/lib/ai/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { stepId, stepTitle, taskId } = await req.json();

  const { object } = await generateObject({
    model: google('gemini-3.1-pro-preview'),
    system: TASK_BREAKDOWN_PROMPT,
    prompt: `Break down this step into smaller pieces: "${stepTitle}"`,
    schema: z.object({
      microSteps: z.array(z.string()).describe('List of very small, actionable micro-steps.')
    })
  });

  const stepsData = object.microSteps.map((title, idx) => ({
    id: uuidv4(),
    task_id: taskId,
    parent_step_id: stepId,
    title,
    is_completed: false,
    order_index: idx,
    created_at: new Date().toISOString()
  }));

  if (hasSupabaseConfig && supabase) {
    try {
      await supabase.from('steps').insert(stepsData);
    } catch(err) {
      console.error(err);
    }
  }

  return Response.json({ steps: stepsData });
}
