# Break It Down: Architecture & AI Handover

A "Gentle AI" task management system designed to reduce cognitive load through recursive AI-powered task decomposition and minimalist motion design.

---

## 🧠 Application Philosophy
"Break It Down" is not a standard productivity tool. It is built for users facing executive dysfunction or burnout. 
- **The Goal**: Turn a "big scary task" into tiny, non-threatening steps.
- **The Vibe**: Calming, low-pressure, and visually soft.
- **AI Orchestration**: AI SDK (Groq/Llama 3.3) for all task and step breakdowns.
- **The Interaction**: Infinite breakdown. Any step can be broken down into further steps.

## 🛠 Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Animations**: Framer Motion (`motion/react`) using a centralized spring physics system.
- **State Management**: 
    - **React Query**: Server-state synchronization (Optimistic UI).
    - **Zustand**: Client-side UI state and persistence.
- **Storage**: Offline-first via **IndexedDB** (Dexie-like raw implementation in `lib/db/indexedDB.ts`).
- **Upcoming**: **Convex** integration for cloud sync and user data storage.

## 📂 Project Structure

### `/app` (Routing & Pages)
- `/(dashboard)/home`: Entry point. Focused AI input.
- `/(dashboard)/tasks`: Dashboard view showing all tasks.
- `/(dashboard)/tasks/[id]`: Recursive breakdown view. Core interaction layer.

### `/components` (Modular & Reusable)
- `/(tasks-dashboard)`: Components for the task list grid.
- `/(task-details)`: 
    - `StepItem.tsx`: High-level step orchestration.
    - `StepMetadata.tsx`, `StepContent.tsx`, `StepActions.tsx`: Modularized UI components.
- `/ui/`: Atomic components like `ProgressBar.tsx`, `GentleCheckbox.tsx`, `Sidebar.tsx`.

### `/hooks` (Logic & Data)
- `useTasksQuery.ts`: Centralized data fetching (All tasks / Single task).
- `useTaskMutations.ts`: Optimistic UI handlers for CRUD operations.
- `useHomeForm.ts`: Isolated logic for the task creation form.
- `useStepItemLogic.ts`: Encapsulated UI state (accordion) for steps.
- `useNotifications.ts`: Unified notification persistence via Zustand.

### `/lib`
- `animations.ts`: Centralized variants and physics (`SPRING_GENTLE`).
- `db/indexedDB.ts`: Low-level database initialization and queries.
- `ai/prompts.ts`: Core AI persona and JSON schema definitions.

## 📐 Data Architecture

### Task Object
```typescript
{
  id: string;
  title: string;
  affirmation?: string; // AI-generated calming quote
  closing_tip?: string; // Final reassurance message
  is_completed: boolean;
  progress_percentage: number;
  created_at: string;
}
```

### Step Object
```typescript
{
  id: string;
  task_id: string;
  parent_step_id: string | null; // Infinite nesting support
  title: string;
  subtitle?: string;
  time_estimate?: string;
  materials?: string;
  note?: string;
  why?: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
}
```

## ✨ Motion Design Guidelines
All animations must follow the `lib/animations.ts` standards:
1. **Layout Animation**: Use Framer Motion's `layout` prop for all size/position changes.
2. **Staggering**: Use `STAGGER_CONTAINER` for sequential element reveal.
3. **Physics**: Always use `SPRING_GENTLE` (stiffness: 150, damping: 25) for a calm feeling.

## 🚀 Future Roadmap
1. **Convex Integration**: Move from IndexedDB to Convex for cross-device sync.
2. **User Authentication**: Secure user-specific data storage.
3. **Enhanced AI Persona**: Further refine the "Gentle" tone in prompts.
