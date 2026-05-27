-- Composite partial index: covers the main task list query
--   WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC
-- Filters out soft-deleted rows — index is smaller, queries are index-only.
CREATE INDEX idx_tasks_active_user
  ON public.tasks(user_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- Composite index on steps: covers order-by after task_id filter
-- Eliminates the need for a separate sort step.
CREATE INDEX idx_steps_task_order
  ON public.steps(task_id, order_index);

-- Drop the old single-column indexes that are now superseded
DROP INDEX IF EXISTS public.idx_tasks_user_id;
DROP INDEX IF EXISTS public.idx_steps_task_id;
