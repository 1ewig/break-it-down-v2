# Codebase Analysis

## 1. Performance Improvements
### A. IndexedDB Query Inefficiency (`lib/db/shared.ts`)
Currently, `loadTasksWithSteps` loads **all** tasks and **all** steps from IndexedDB into memory using `.toArray()` before filtering them by `user_id` and `deleted_at`:
```typescript
const [tasks, steps] = await Promise.all([
  db.tasks.toArray(),
  db.steps.toArray(),
]);
```
**Improvement:** This is a massive performance bottleneck as the user's task history grows. You should utilize Dexie's indexed queries. First, query tasks by `user_id`, then extract the `task_id`s, and finally query only the steps that belong to those tasks using `db.steps.where('task_id').anyOf(taskIds).toArray()`.

### B. Inefficient Purge of Deleted Tasks (`lib/db/bin.ts`)
`purgeExpiredDeletedTasks` loads the entire `db.tasks` table into memory to find expired tasks. 
**Improvement:** You can create an index for `deleted_at` (or a compound index) to query only tasks that have a `deleted_at` value.

### C. Middleware Network Requests (`lib/supabase/middleware.ts`)
The `updateSession` function called in your `middleware.ts` uses `supabase.auth.getUser()`. While `getUser()` is the most secure method as it queries the Supabase database to ensure the token hasn't been revoked, it adds a network round-trip delay to **every** protected page load.
**Improvement:** If you want faster page loads, you can use `supabase.auth.getSession()` in the middleware (which only verifies the JWT cookie locally) and reserve `getUser()` for API routes and Server Actions where data mutations occur.

## 2. Security & Privacy Bugs
### A. Multi-User Privacy Leak via IndexedDB
The application uses Supabase for authentication but stores task data locally in IndexedDB using Dexie (`lib/db/db.ts`). The data is partitioned logically by `user_id`, but IndexedDB has no built-in access control.
**Bug:** If multiple users log into the application on the same browser (e.g., a shared computer), their data is co-mingled in the same IndexedDB database. Because `loadTasksWithSteps` currently fetches all data into memory, a vulnerability like XSS or a simple inspection via browser DevTools allows any user to read the tasks of all other users who have used that device.
**Fix:** 
1. Use an encrypted local database or rely on Supabase for data storage instead of IndexedDB.
2. At the very least, wipe the IndexedDB data upon user sign-out.

### B. Missing Data Cleanup on Sign Out (`providers/AuthProvider.tsx`)
When a user signs out, the application calls `supabase.auth.signOut()` but leaves all of the user's personal task data sitting in IndexedDB indefinitely. 
**Fix:** Update the `signOut` function in `AuthProvider.tsx` to clear the IndexedDB database (or at least delete the specific user's tasks) to ensure their data isn't left behind on a shared device.

## 3. Duplicated Code Reduction
### A. API Route Authentication Checks
In your `app/api/tasks/breakdown/route.ts` and `app/api/tasks/create/route.ts`, you have identical authentication boilerplate:
```typescript
const supabase = await createClient();
const { data: { user }, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```
**Improvement:** This code should be extracted into a shared utility function (e.g., `requireAuth` in `lib/supabase/server.ts`) that standardizes the authentication check and error response format across all protected API routes.

### B. Sorting Logic (`lib/db/shared.ts`)
The sorting logic in `loadTasksWithSteps` uses ternary operators to switch between `created_at` and `deleted_at` depending on the filter mode. This could be simplified or abstracted into a small helper function to reduce cognitive load and avoid type casting (`as Task & { deleted_at: string }`).
