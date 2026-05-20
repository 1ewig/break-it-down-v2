# Break It Down: Architecture & AI Handover

A "Gentle AI" task management system designed to reduce cognitive load through recursive AI-powered task decomposition and minimalist motion design.

---

## Application Philosophy
"Break It Down" is not a standard productivity tool. It is built for users facing executive dysfunction or burnout.
- **The Goal**: Turn a "big scary task" into tiny, non-threatening steps.
- **The Vibe**: Calming, low-pressure, and visually soft.
- **AI Orchestration**: AI SDK (Groq/Llama 3.3) for all task and step breakdowns.
- **The Interaction**: Infinite breakdown. Any step can be broken down into further steps.

## Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Authentication**: **Supabase Auth** (Email/Password & Google OAuth) with Brevo SMTP for transactional emails.
- **Animations**: Motion (`motion/react`) using a centralized spring physics system.
- **Typography**: Bold, high-contrast system aligned with the "Gentle Architect" brand.
- **State Management**:
    - **TanStack React Query**: Server-state synchronization with optimistic UI.
    - **Zustand**: Client-side UI state and persistence.
- **Storage**: **Supabase PostgreSQL** with Row Level Security (RLS). Task and step tables are server-side with user-level isolation.
- **Deployment**: Vercel.

## Project Structure

### `/app` (Routing & Pages)
- `/(auth)`: Login, Register (with confirmation email screen), Forgot Password, and Update Password flows.
- `/(dashboard)/home`: Entry point. Bold, focused AI input.
- `/(dashboard)/tasks`: Dashboard view showing all tasks.
- `/(dashboard)/tasks/[id]`: Recursive breakdown view. Core interaction layer.
- `/auth/callback`: Handles OAuth callback and email confirmation verification. Redirects to `/home` on success.
- `/api/auth/check-email`: Server endpoint using service_role key to distinguish "no account" vs "wrong password" on login.
- `/api/tasks/create`: AI-powered task creation endpoint.
- `/api/tasks/breakdown`: AI-powered step expansion endpoint.

### `/components` (Modular & Reusable)
- `/auth/`: AuthInput (with password visibility toggle), AuthButton, AuthError (contextual error with action links), AuthLayout, GoogleSignInButton.
- `/(tasks-dashboard)`: Components for the task list grid.
- `/(task-details)`:
    - `StepItem.tsx`: High-level step orchestration.
    - `StepMetadata.tsx`, `StepContent.tsx`, `StepActions.tsx`: Modularized UI components.
- `/ui/`: Atomic components like `Sidebar.tsx`, `Toast.tsx`, `ProgressBar.tsx`, `ConfirmDialog.tsx`, `GentleCheckbox.tsx`.

### `/hooks` (Logic & Data)
- `useTasksQuery.ts`: TanStack Query fetching (All tasks / Single task with steps).
- `useTaskMutations.ts`: Optimistic UI mutations for CRUD -- completion toggle, breakdown, creation, soft-delete.
- `useTaskDetail.ts`: Orchestrator combining query + mutations for the task detail page.
- `useBinQuery.ts` / `useBinMutations.ts`: TanStack Query hooks for deleted tasks (soft-delete, restore, permanent-delete).
- `useStepItemLogic.ts`: Encapsulated UI state (accordion) for steps.
- `useAuth.ts`: Supabase Auth consumer from AuthProvider context.

### `/lib`
- `animations.ts`: Centralized variants and physics (`SPRING_GENTLE`).
- `db/`: Database access layer. All files call Supabase (via `lib/supabase/tables.ts`). Exports through `indexedDB.ts` (legacy barrel -- no IndexedDB used).
    - `tasks.ts`: Task CRUD.
    - `steps.ts`: Step CRUD, completion toggle, notes update, progress recalculation.
    - `shared.ts`: `loadTasksWithSteps()` -- loads tasks + their steps from Supabase.
    - `bin.ts`: Soft-delete, restore, permanent-delete, expired purge.
    - `factory.ts`: `createTaskWithStepsFromAI()` -- batch inserts from AI breakdown.
- `ai/prompts.ts`: Core AI persona and JSON schema definitions.
- `supabase/`:
    - `client.ts`: Browser-side Supabase client (`createBrowserClient` from `@supabase/ssr`).
    - `server.ts`: Server-side client (`createServerClient`) with `getAuthUser()` helper.
    - `middleware.ts`: `updateSession()` for Next.js middleware auth guard.
    - `admin.ts`: Admin client with `service_role` key (used for email checks).
    - `tables.ts`: Typed `getTasksTable()` and `getStepsTable()` wrappers.

### `/store`
- `ui-store.ts`: Zustand store for UI preferences and toast notifications.

### `/suppliers`
- `AuthProvider`: Subscribes to `onAuthStateChange`, exposes `user`, `session`, `loading`, `signOut()`.
- `QueryProvider`: TanStack React Query client with gentle defaults (5min stale time, no refetch on window focus).

## AI Strategy (Dual-Model)
We use a tiered approach to balance reasoning depth and speed:
1. **Initial Task Breakdown**: `Llama-3.3-70b-versatile` via Groq. Used for high-reasoning decomposition and tone setting.
2. **Step Expansion (Substeps)**: `Llama-3.1-8b-instant` via Groq. Used for rapid, concise point-by-point instructions.

## Data Architecture

### Task Object
```typescript
{
  id: string;
  user_id: string; // UUID from auth.users, foreign key with CASCADE delete
  title: string;
  affirmation?: string;  // AI-generated calming quote
  closing_tip?: string;  // Final reassurance message
  is_completed: boolean;
  progress_percentage: number;
  created_at: string;
  deleted_at: string | null; // Soft-delete timestamp
}
```

### Step Object
```typescript
{
  id: string;
  task_id: string;        // FK to tasks with CASCADE delete
  user_id: string;
  parent_step_id: string | null; // Infinite nesting support
  title: string;
  subtitle?: string;
  note?: string;          // User's personal note on a step
  why?: string;           // AI-generated purpose
  materials?: string;     // Items needed
  time_estimate?: string; // Estimated duration
  is_completed: boolean;
  is_broken_down: boolean;
  order_index: number;
  created_at: string;
}
```

### Database Layer
- **Tables**: `public.tasks` and `public.steps` in Supabase PostgreSQL.
- **RLS Policies**: Both tables have Row Level Security enabled. Policies enforce `auth.uid() = user_id` for tasks and a subquery on tasks for steps.
- **Indexes**: `tasks.user_id`, `tasks.deleted_at`, `steps.task_id`, `steps.parent_step_id`.
- **Migrations**: All schema changes are tracked in `supabase/migrations/` and run via `supabase migration up`.

## Auth Flow
1. **Sign Up**: Email/password → Supabase Auth → "Check Your Email" screen displayed.
2. **Confirmation**: User clicks email link → `/auth/callback?next=/home` → OTP verified → session created → redirected to dashboard.
3. **Sign In**: On error, `/api/auth/check-email` is called to distinguish "no account" vs "wrong password" for contextual feedback.
4. **Password Reset**: Sends reset email via Brevo SMTP, callback redirects to `/update-password`.
5. **OAuth**: Google sign-in uses the same callback handler at `/auth/callback`.

## Design Principles
1. **Bold Typography**: High-contrast headings (`font-bold`, `tracking-tight`) to ground the user.
2. **Safety First**: Destructive or sensitive actions (Delete, Sign Out) always require a `ConfirmDialog`.
3. **Motion Design**: Always use `SPRING_GENTLE` (stiffness: 150, damping: 25) for a calm feeling.
4. **Instant UI**: TanStack Query optimistic updates ensure zero-latency feedback while supabase persists asynchronously.
5. **Contextual Errors**: Auth pages show specific, actionable error messages (e.g., "No account with this email" vs "Wrong password").

## Future Roadmap
1. **Supabase Realtime**: Cross-device sync via Supabase Realtime subscriptions.
2. **Task Reminders**: Native notification support for scheduled tasks.
3. **Cleanup Job**: Supabase scheduled function to permanently delete tasks where `deleted_at > 30 days`.
