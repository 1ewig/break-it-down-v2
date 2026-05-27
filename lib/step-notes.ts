export function parseStepNote(note?: string): {
  noteLines: string[];
  reassurance: string | null;
} {
  const parts = note ? note.split('---') : [];
  const body = parts[0] ?? '';
  const noteLines = body.includes('\n')
    ? body.split('\n').map(l => l.trim()).filter(Boolean)
    : body.split(/(?=\d+\.\s)/).map(l => l.trim()).filter(Boolean);
  const reassurance = parts[1] ? parts[1].trim() : null;
  return { noteLines, reassurance };
}
