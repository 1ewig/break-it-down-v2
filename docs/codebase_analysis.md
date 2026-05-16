# Codebase Analysis

## 1. Performance Improvements
### A. IndexedDB Query Inefficiency (`lib/db/shared.ts`)
**Status:** ⏳ Pending
Currently, `loadTasksWithSteps` loads **all** tasks and **all** steps from IndexedDB into memory using `.toArray()` before filtering them by `user_id` and `deleted_at`:
```typescript
const [tasks, steps] = await Promise.all([
  db.tasks.toArray(),
  db.steps.toArray(),
]);
```
**Improvement:** Use Dexie's indexed queries. First, query tasks by `user_id`, then extract the `task_id`s, and finally query only the steps that belong to those tasks using `db.steps.where('task_id').anyOf(taskIds).toArray()`.

### B. Inefficient Purge of Deleted Tasks (`lib/db/bin.ts`)
**Status:** ⏳ Pending
`purgeExpiredDeletedTasks` loads the entire `db.tasks` table into memory to find expired tasks. 
**Improvement:** Use an index for `deleted_at` to query only tasks that have a `deleted_at` value.

### C. Middleware Network Requests (`lib/supabase/middleware.ts`)
**Status:** ⏳ Pending
The `updateSession` function called in your `middleware.ts` uses `supabase.auth.getUser()`. This adds a network round-trip delay to **every** protected page load.
**Improvement:** Use `supabase.auth.getSession()` in the middleware and reserve `getUser()` for API routes and Server Actions.

## 2. Security & Privacy Bugs
### A. Multi-User Privacy Leak via IndexedDB
**Status:** ⏳ Pending
The data is partitioned logically by `user_id`, but IndexedDB has no built-in access control. A user can read another's data via DevTools.
**Fix:** 
1. Use an encrypted local database or rely on Supabase for data storage.
2. At the very least, wipe the IndexedDB data upon user sign-out.

### B. Missing Data Cleanup on Sign Out (`providers/AuthProvider.tsx`)
**Status:** ⏳ Pending
When a user signs out, personal task data remains in IndexedDB indefinitely.
**Fix:** Update the `signOut` function to clear the IndexedDB database.

## 3. Duplicated Code Reduction
### A. API Route Authentication Checks
**Status:** ✅ Fixed
Identical authentication boilerplate was present in AI API routes.
**Solution:** Extracted into a shared `getAuthUser` utility in `lib/supabase/server.ts`.

### B. Auth Pages Structure & UI
**Status:** ✅ Fixed
Login, Register, and Password Reset pages shared identical layout branding and input patterns.
**Solution:** Created a shared auth component library (`components/auth/`) including `AuthLayout`, `AuthInput`, `AuthButton`, and `GoogleSignInButton`.

### C. Task Detail Component Bloat
**Status:** ✅ Fixed
The `components/task-details` folder had 9 granular files for a single feature.
**Solution:** Consolidated into 5 focused files (e.g., merging `Metadata`/`Content`/`Actions` into `StepItem.tsx`).

### D. Sorting Logic (`lib/db/shared.ts`)
**Status:** ⏳ Pending
The sorting logic in `loadTasksWithSteps` uses complex ternary operators and type casting.
**Improvement:** Abstract into a small helper function.
