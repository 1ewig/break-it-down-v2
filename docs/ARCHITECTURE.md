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
- **Authentication**: **Supabase Auth** (Email/Password & Google OAuth).
- **Animations**: Framer Motion (`motion/react`) using a centralized spring physics system.
*   **Typography**: Bold, high-contrast system aligned with the "Gentle Architect" brand.
- **State Management**: 
    - **React Query**: Server-state synchronization (Optimistic UI).
    - **Zustand**: Client-side UI state and persistence.
- **Storage**: Offline-first via **IndexedDB** (Dexie-like raw implementation in `lib/db/indexedDB.ts`).
- **Deployment**: Vercel.

## 📂 Project Structure

### `/app` (Routing & Pages)
- `/(auth)`: Login, Register, Forgot Password, and Update Password flows.
- `/(dashboard)/home`: Entry point. Bold, focused AI input.
- `/(dashboard)/tasks`: Dashboard view showing all tasks.
- `/(dashboard)/tasks/[id]`: Recursive breakdown view. Core interaction layer.
- `/auth/callback`: Serverless route for OAuth and Magic Link handling.

### `/components` (Modular & Reusable)
- `/(tasks-dashboard)`: Components for the task list grid.
- `/(task-details)`: 
    - `StepItem.tsx`: High-level step orchestration.
    - `StepMetadata.tsx`, `StepContent.tsx`, `StepActions.tsx`: Modularized UI components.
- `/ui/`: Atomic components like `ProgressBar.tsx`, `ConfirmDialog.tsx` (Sign out/Delete), `Sidebar.tsx`.

### `/hooks` (Logic & Data)
- `useTasksQuery.ts`: Centralized data fetching (All tasks / Single task).
- `useTaskMutations.ts`: Optimistic UI handlers for CRUD operations.
- `useStepItemLogic.ts`: Encapsulated UI state (accordion) for steps.
- `useAuth.ts`: Wrapper for Supabase Auth sessions and operations.

### `/lib`
- `animations.ts`: Centralized variants and physics (`SPRING_GENTLE`).
- `db/indexedDB.ts`: Low-level database initialization and queries.
- `ai/prompts.ts`: Core AI persona and JSON schema definitions.
- `supabase/`: Client and server-side Supabase initialization.

## 🤖 AI Strategy (Dual-Model)
We use a tiered approach to balance reasoning depth and speed:
1. **Initial Task Breakdown**: `Llama-3.3-70b-versatile` via Groq. Used for high-reasoning decomposition and tone setting.
2. **Step Expansion (Substeps)**: `Llama-3.1-8b-instant` via Groq. Used for rapid, concise point-by-point instructions.

## 📐 Data Architecture

### Task Object
```typescript
{
  id: string;
  user_id: string; // Scoped to Supabase User
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
  user_id: string;
  parent_step_id: string | null; // Infinite nesting support
  title: string;
  subtitle?: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
}
```

## ✨ Design Principles
1. **Bold Typography**: High-contrast headings (`font-bold`, `tracking-tight`) to ground the user.
2. **Safety First**: Destructive or sensitive actions (Delete, Sign Out) always require a `ConfirmDialog`.
3. **Motion Design**: Always use `SPRING_GENTLE` (stiffness: 150, damping: 25) for a calm feeling.

## 🚀 Future Roadmap
1. **Hybrid CSS Refactor**: Move layout and design tokens to Vanilla CSS variables while keeping Tailwind for atomic styling.
2. **Cloud Sync**: Migrate from local-only IndexedDB to a cloud-synced database (Convex or Supabase Database).
3. **Task Reminders**: Native notification support for scheduled tasks.
