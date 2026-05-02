# Break It Down: Architecture & AI Handover

A "Gentle AI" task management system designed to reduce cognitive load through recursive AI-powered task decomposition and minimalist motion design.

## 🧠 Application Philosophy
"Break It Down" is not a standard productivity tool. It is built for users facing executive dysfunction or burnout. 
- **The Goal**: Turn a "big scary task" into tiny, non-threatening steps.
- **The Vibe**: Calming, low-pressure, and visually soft.
- **The Interaction**: Infinite breakdown. Any step can be broken down into further steps.

## 🛠 Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Animations**: Framer Motion (`motion/react`) using a centralized spring physics system.
- **AI**: Gemini 2.0 (High-level creation) & Groq/Llama (Recursive breakdown).
- **Storage**: Dual-layer sync:
    - **Supabase**: PostgreSQL persistence (Tasks & Steps tables).
    - **localStorage**: Immediate persistence and offline-first fallback.

## 📂 Project Structure

### `/app` (Routing & Pages)
- `/(dashboard)/home`: The entry point. A focused AI input that accepts a "scary task" and generates the initial breakdown.
- `/(dashboard)/tasks`: The dashboard view showing all active tasks in a grid.
- `/(dashboard)/tasks/[id]`: The breakdown view. This is the heart of the app where users interact with steps and trigger further AI breakdowns.
- `/api/tasks/create`: Handles the initial AI generation of a task, its affirmation, and the first 3-5 steps.
- `/api/tasks/breakdown`: Handles recursive breakdowns. Takes a specific `Step` and generates 3 sub-steps for it.

### `/components` (UI & Logic)
- `/tasks/StepItem.tsx`: The most complex component. Handles its own expanded state, completion logic, and triggers recursive breakdowns.
- `/tasks/TaskCard.tsx`: The high-level summary card used in the dashboard.
- `/ui/ProgressBar.tsx`: A customized, smooth-transitioning progress bar.
- `/ui/Sidebar.tsx`: The responsive navigation system.

### `/hooks`
- `useTasks.ts`: The **Source of Truth**. Manages global state for tasks, handles local storage syncing, and performs the optimistic updates to Supabase.

### `/lib`
- `animations.ts`: The **Motion Design System**. Defines all shared Framer Motion variants and spring configurations (`SPRING_GENTLE`).
- `supabase/`: Configuration for the database connection.

## 📐 Data Architecture

### Task Object
```typescript
{
  id: string;
  title: string;
  is_completed: boolean;
  progress_percentage: number;
  affirmation: string; // AI-generated calming quote
  closing_tip: string; // Final reassurance message
  steps: Step[];
}
```

### Step Object
```typescript
{
  id: string;
  task_id: string;
  parent_id: string | null; // Allows for infinite nesting
  title: string;
  subtitle: string; // The "gentle" framing
  is_completed: boolean;
  note?: string;
  why?: string; // Why this step matters
  time_estimate?: string;
}
```

## ✨ Motion Design Guidelines
All animations must follow the `lib/animations.ts` standards:
1. **Never use standard CSS transitions** for layout-shifting elements (use `motion` instead to prevent flickering).
2. **Use Staggering**: Page contents must use `STAGGER_CONTAINER` to reveal elements sequentially.
3. **Spring Physics**: Always use `SPRING_GENTLE` for a weighted, calm feeling. Avoid snappy or bouncy defaults.

## 🚀 Future AI Instructions
When modifying this app:
1. **Maintain Vertical Rhythm**: Use the `gap-4`, `gap-6`, `gap-12` scale to match page padding.
2. **Preserve Tone**: AI prompts in `/lib/ai/prompts.ts` should remain encouraging, minimalist, and non-judgmental.
3. **Optimistic UI**: Always update the local state in `useTasks.ts` before awaiting API/DB responses.
