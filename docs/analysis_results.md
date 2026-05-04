# Codebase Analysis: Break It Down

A "Gentle AI" task management system designed to reduce cognitive load through recursive AI-powered task decomposition and minimalist motion design.

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **State Management** | TanStack React Query (Server state), Zustand (UI state) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion (`motion/react`) |
| **Backend/Auth** | Supabase (Postgres) |
| **AI Orchestration** | Groq (Llama 3.3 70B via AI SDK) |
| **Icons** | Lucide React |

## 📂 Core Directory Structure

- `/app`: Routing and API handlers.
  - `/(dashboard)/home`: Entry point for task creation.
  - `/(dashboard)/tasks/[id]`: Main breakdown view.
  - `/api/tasks`: AI generation endpoints.
- `/components`:
  - `StepItem.tsx`: Recursive step logic and completion handling.
  - `TaskCard.tsx`: Dashboard summary components.
- `/hooks`:
  - `queries/useTasksQuery.ts`: Data fetching and localStorage sync.
  - `mutations/useTaskMutations.ts`: Task/Step creation and updates.
- `/lib`:
  - `animations.ts`: Centralized motion design system (`SPRING_GENTLE`).
  - `ai/prompts.ts`: Persona-driven AI instructions.
- `/store`: Zustand stores for transient UI state.

## 🔄 Key Data Flows

### 1. Initial Task Creation
1. **Trigger**: User submits a "big task" in `app/(dashboard)/home/page.tsx`.
2. **API**: Calls `api/tasks/create`, which prompts Groq with `TASK_BREAKDOWN_PROMPT`.
3. **Response**: AI returns a JSON structure with an affirmation, granular steps, and a closing tip.
4. **Persistence**: The frontend generates local IDs, updates the React Query cache, saves to `localStorage`, and redirects to the task view.

### 2. Recursive Breakdown
1. **Trigger**: User clicks "Break this down further" on a `StepItem`.
2. **API**: Calls `api/tasks/breakdown`.
3. **Response**: AI generates sub-steps for that specific step.
4. **Update**: New steps are appended to the task's step list with a `parent_step_id` link.

### 3. Persistence Strategy
- **Dual-Layer Sync**: The app attempts to sync with Supabase if configured, but defaults to `localStorage` for immediate, low-latency updates and anonymous usage.
- **Optimistic UI**: All mutations update the React Query cache immediately to ensure the UI feels responsive.

## ✨ Design Principles

1. **Gentle UX**: Avoidance of "urgency" language. Use of soft colors and "ridiculously small" steps.
2. **Weighted Motion**: All animations use `SPRING_GENTLE` (stiffness: 150, damping: 25) for a calm, non-snappy feel.
3. **Infinite Nesting**: The data model supports `parent_id` on steps, allowing for unlimited layers of decomposition.
4. **Persona-Driven AI**: The AI (Llama 3.3) is instructed to be deeply empathetic and validating.

## 📝 Potential Areas for Improvement / Future Work

- **Step Reordering**: Implementing drag-and-drop for steps.
- **Deep Nesting UI**: Improving the visual hierarchy when steps are nested several levels deep.
- **Offline Sync**: Better handling of conflicts between `localStorage` and Supabase.
- **Auth Integration**: Finalizing the Google OAuth flow (as seen in conversation history).
