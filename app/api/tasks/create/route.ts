import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { TASK_BREAKDOWN_PROMPT } from '@/lib/ai/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { taskTitle } = await req.json();

    const { text } = await (generateText as any)({
      model: groq('llama-3.3-70b-versatile'),
      system: TASK_BREAKDOWN_PROMPT + `
      You MUST respond in raw JSON format. 
      Schema:
      {
        "title": "Task title",
        "affirmation": "Soothing thought",
        "steps": [
          {
            "title": "Step title",
            "subtitle": "Context",
            "time_estimate": "~1 min",
            "materials": "Optional item",
            "note": "Instruction",
            "why": "Psychology"
          }
        ]
      }
      Do NOT use markdown code blocks.`,
      prompt: `I am feeling overwhelmed. Please break down this task into tiny, gentle steps: "${taskTitle}"`,
      responseFormat: { type: 'json_object' },
    });

    // Strip markdown code blocks if they exist
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    const object = JSON.parse(cleanText);
    return Response.json(object);
  } catch (error) {
    console.error('Error creating task breakdown:', error);
    return Response.json({ error: 'Failed to generate breakdown' }, { status: 500 });
  }
}
