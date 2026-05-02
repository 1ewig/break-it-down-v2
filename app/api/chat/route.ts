import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { supabase, hasSupabaseConfig } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = `
  You are 'Break It Down', a deeply empathetic, calming, and gentle task-management assistant. 
  Your goal is to help overwhelmed users break massive tasks into ridiculously small, easy steps.
  Tone rules:
  - Never use urgent language (avoid "need to", "must", "hurry", "deadline").
  - Always validate the user's feeling of being overwhelmed. Keep steps extremely granular.
  - Always include an encouraging, soft closing statement.

  When breaking down a task, use the 'createTask' tool to save the Task and Steps directly into the system, then inform the user you have created it for them.
  `;

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemMessage,
    messages,
    tools: {
      createTask: {
        description: 'Creates a new task and its initial small steps.',
        parameters: z.object({
          taskTitle: z.string().describe('The overall gentle task name.'),
          steps: z.array(z.string()).describe('List of very small, actionable steps.'),
        })
      } as any
    },
  });

  return (result as any).toDataStreamResponse ? (result as any).toDataStreamResponse() : (result as any).toTextStreamResponse();
}
