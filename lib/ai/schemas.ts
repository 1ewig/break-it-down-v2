import { z } from 'zod';

export function sanitizeAIJSON(text: string): string {
  let cleaned = text.replace(/```json\n?|```/g, '').trim();
  let inString = false;
  let escape = false;
  let result = '';
  for (const char of cleaned) {
    if (escape) { escape = false; result += char; continue; }
    if (char === '\\' && inString) { escape = true; result += char; continue; }
    if (char === '"') { inString = !inString; result += char; continue; }
    if (inString && (char === '\n' || char === '\r')) { result += '\\n'; continue; }
    result += char;
  }
  return result;
}

export const stepSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  time_estimate: z.string().optional(),
  materials: z.string().optional(),
  note: z.string().optional(),
  why: z.string().optional(),
});

export const taskBreakdownSchema = z.object({
  title: z.string().min(1),
  affirmation: z.string().min(1),
  steps: z.array(stepSchema).min(5).max(8),
  closing_tip: z.string().min(1),
});

export const stepBreakdownSchema = z.object({
  detailed_note: z.string().min(1),
  reassurance: z.string().optional(),
});

export type TaskBreakdown = z.infer<typeof taskBreakdownSchema>;
export type StepBreakdown = z.infer<typeof stepBreakdownSchema>;
