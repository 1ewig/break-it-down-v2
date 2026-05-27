# Separation Review: Lost Points

This note expands on the areas where the codebase loses points for separation of UI components from hooks, state, and data logic.

Overall, the project is organized well for its size. The main separation pattern is clear: domain UI lives in `components/`, React Query and interaction logic live in `hooks/`, Supabase access lives in `lib/db/`, and UI preferences live in `store/`. The lost points come from places where that boundary is applied inconsistently.

## 1. Some UI components perform feature mutations

Several components are mostly presentational, but a few reach directly into mutation hooks or stores. This makes them harder to reuse and harder to test as pure UI.

### `components/tasks-dashboard/TasksList.tsx`

`TasksList` accepts `tasks`, which is good, but it also imports `useTaskMutations` and `useToastStore`.

It owns:

- the pending delete ID
- the delete mutation
- the toast message after deletion
- the confirmation dialog state

That makes the component more of a feature controller than a list renderer. A cleaner boundary would be:

- page or feature hook owns `deleteTask`, pending delete state, and toast behavior
- `TasksList` receives `onDeleteTask`, `pendingDeleteId`, and dialog callbacks as props
- `TaskCard` remains presentational

This is not a major problem right now, but it weakens the otherwise clean page-hook-component pattern used in task details.

## 2. `BinCard` mixes card UI with bin business actions

### `components/bin/BinCard.tsx`

`BinCard` imports `useBinMutations` directly and calls `restore.mutate()` and `permanentDelete.mutate()` from inside the card.

It owns:

- restore mutation
- permanent delete mutation
- local delete confirmation state
- days-left calculation
- all card rendering

This means a single card is responsible for UI, user interaction, and data mutation. If another view wanted to show deleted tasks differently, the mutation behavior would be coupled to this exact card implementation.

A stronger separation would move bin actions into `BinList`, `BinPage`, or a dedicated `useBinController` hook, then pass:

- `onRestore(taskId)`
- `onPermanentDelete(taskId)`
- `isRestoring`
- `isDeleting`

The `getDaysLeft` helper could also live outside the component if it becomes shared or tested.

## 3. Auth pages contain Supabase and API workflow logic

### `app/(auth)/login/page.tsx`

The login page directly handles:

- form state
- Supabase `signInWithPassword`
- API call to `/api/auth/check-email`
- error classification
- contextual error link setup
- navigation
- rendering

This is a lot for a page component. It makes the auth UI harder to reason about because the JSX and auth workflow are interleaved.

A cleaner boundary would use a hook such as `useLoginForm` or `useLoginFlow` that returns:

- `email`, `setEmail`
- `password`, `setPassword`
- `error`, `errorLink`
- `loading`
- `handleSubmit`

Then the page could focus almost entirely on layout and component composition.

### `app/(auth)/register/page.tsx`

The register page has a similar issue. It directly handles:

- field state
- password validation
- Supabase signup
- duplicate account handling
- email confirmation state
- navigation
- rendering

The existing `useAuthForm` helps with generic loading/error state, but most of the actual auth logic remains in the page.

### `app/(auth)/forgot-password/page.tsx` and `app/(auth)/update-password/page.tsx`

These pages are smaller, but they follow the same pattern: Supabase auth calls live in the page component rather than a dedicated auth hook or service wrapper.

For a small app this is acceptable, but as auth behavior grows, these pages will become harder to keep consistent.

## 4. Profile page mixes account data updates with presentation

### `app/(dashboard)/profile/page.tsx`

The profile page directly imports the Supabase client and updates user metadata inside `handleSaveName`.

It also handles:

- sign-out confirmation state
- local user name state
- name update mutation
- sign-out behavior
- provider display formatting
- joined-date formatting
- rendering account details

This would be cleaner as a profile-specific hook, for example `useProfileSettings`, plus smaller presentational components for account details and login method display.

The main concern is not that the code is broken. It is that the page knows too much about how account updates happen.

## 5. Zustand store access appears directly in UI components

### `components/home/EnergySelector.tsx`

`EnergySelector` directly reads and writes `useUIStore`.

This is a reasonable shortcut because the component is tightly tied to the energy preference. Still, it means the selector cannot easily be rendered as a controlled component in another context.

A cleaner component boundary would split it into:

- `EnergySelector`, a controlled UI component accepting `value` and `onChange`
- `EnergySelectorConnected`, or the page/hook layer, which reads from `useUIStore`

This would preserve the current behavior while making the UI piece reusable and easier to test.

### `components/ui/Toast.tsx`

`Toast` directly reads `useToastStore`. This is more acceptable because global toast components are often store-connected by design. It is still worth noting because it is another example where `components/` includes connected components, not only presentational ones.

## 6. `useTaskMutations` is doing several jobs at once

### `hooks/useTaskMutations.ts`

This hook is useful, but it is dense. It currently handles:

- React Query mutations
- optimistic cache updates
- rollback behavior
- cache invalidation
- fetch calls to AI API routes
- direct DB writes through `lib/db`
- toast messages
- energy preference lookup from Zustand
- task creation orchestration
- step breakdown orchestration
- task deletion

That is a lot of responsibility for one hook. It functions more like a feature service than a simple React hook.

The most important boundary concern is that task creation and breakdown combine multiple layers:

- client calls `/api/tasks/create`
- client receives AI response
- client then writes the task and steps to Supabase through `createTaskWithStepsFromAI`

Similarly, breakdown:

- client calls `/api/tasks/breakdown`
- client combines `detailed_note` and `reassurance`
- client writes the result to Supabase through `updateStepNoteInDB`

The hook works, but the data workflow is split between API routes and client-side DB writes. A cleaner design would make API routes own the complete server operation:

- `/api/tasks/create` generates AI output and persists the task
- `/api/tasks/breakdown` generates AI output and persists the step update
- the client mutation hook only calls the API and invalidates or optimistically updates cache

That would make the data boundary much stronger.

## 7. Client-side DB layer blurs with server responsibilities

The `lib/db` layer is cleanly grouped, but because it uses the browser Supabase client through `lib/supabase/tables.ts`, client hooks can directly perform database writes.

This is not automatically wrong with Supabase and RLS, but it does mean business operations are available directly from the browser layer.

Examples:

- `deleteTask`
- `restoreTask`
- `permanentDeleteTask`
- `updateStepCompletionInDB`
- `updateStepNoteInDB`
- `createTaskWithStepsFromAI`

With RLS, this can be secure, but architecturally it makes it easier for UI-facing code to bypass API-level workflow boundaries.

For stronger separation, keep simple reads client-side if desired, but move multi-step writes and AI-related persistence behind API routes or server actions.

## 8. Step display parses note format inside the component

### `components/task-details/StepItem.tsx`

`StepContent` parses `step.note` by splitting on `---`, then splitting numbered lines with a regex.

That parsing is display-adjacent, but it is still data interpretation logic embedded in a UI component. If the note format changes, the component must change too.

This would be cleaner as a helper such as:

```ts
parseStepNote(step.note)
```

returning:

```ts
{
  noteLines: string[];
  reassurance: string | null;
}
```

Then `StepContent` could stay focused on rendering.

## 9. Page-level orchestration is inconsistent

The task detail page has a nice separation model:

- page calls `useTaskDetail`
- hook owns query/mutation orchestration
- components receive props

But other areas do not follow the same model:

- home page owns submit flow and navigation
- auth pages own Supabase workflows
- profile page owns Supabase metadata update
- task list component owns delete mutation
- bin card owns restore/delete mutations

This inconsistency is the main reason the score is not higher. The codebase has a good pattern, but it does not apply that pattern everywhere.

## Suggested Direction

The highest-impact cleanup would be to introduce feature-level hooks/controllers:

- `useHomeTaskCreator`
- `useLoginFlow`
- `useRegisterFlow`
- `useProfileSettings`
- `useTasksListController`
- `useBinController`

Then components can become more consistently presentational:

- receive data as props
- receive callbacks as props
- avoid direct Supabase, React Query mutation, or Zustand imports unless they are intentionally connected components

The goal is not to remove all local state from components. Local UI state like input text, accordion open state, or dialog visibility can reasonably stay close to the UI. The bigger win is moving data writes, API workflows, and cross-component state side effects out of visual components and pages.

