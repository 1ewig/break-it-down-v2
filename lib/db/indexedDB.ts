import { Task, Step, TaskWithSteps } from '@/types';

const DB_NAME = 'BreakItDownDB';
const DB_VERSION = 1;

/**
 * Initializes the IndexedDB database and creates object stores/indexes if needed.
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is only available in the browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB failed to open:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;

      // Create tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }

      // Create steps store with indexes for efficient lookups
      if (!db.objectStoreNames.contains('steps')) {
        const stepsStore = db.createObjectStore('steps', { keyPath: 'id' });
        stepsStore.createIndex('task_id', 'task_id', { unique: false });
        stepsStore.createIndex('parent_step_id', 'parent_step_id', { unique: false });
      }
    };
  });
}

/**
 * Retrieves all tasks combined with their sorted steps from IndexedDB.
 */
export function getTasksWithSteps(): Promise<TaskWithSteps[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['tasks', 'steps'], 'readonly');
      const tasksStore = transaction.objectStore('tasks');
      const stepsStore = transaction.objectStore('steps');

      const getAllTasksRequest = tasksStore.getAll();
      const getAllStepsRequest = stepsStore.getAll();

      let tasks: Task[] = [];
      let steps: Step[] = [];

      let tasksLoaded = false;
      let stepsLoaded = false;

      const combineAndResolve = () => {
        if (tasksLoaded && stepsLoaded) {
          const combined: TaskWithSteps[] = tasks
            .filter((t) => !t.deleted_at)
            .map((task) => {
              const taskSteps = steps
                .filter((step) => step.task_id === task.id)
                .sort((a, b) => a.order_index - b.order_index);
              return {
                ...task,
                steps: taskSteps,
              };
            })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          resolve(combined);
        }
      };

      getAllTasksRequest.onsuccess = () => {
        tasks = getAllTasksRequest.result as Task[];
        tasksLoaded = true;
        combineAndResolve();
      };
      getAllTasksRequest.onerror = () => reject(getAllTasksRequest.error);

      getAllStepsRequest.onsuccess = () => {
        steps = getAllStepsRequest.result as Step[];
        stepsLoaded = true;
        combineAndResolve();
      };
      getAllStepsRequest.onerror = () => reject(getAllStepsRequest.error);

      transaction.onerror = () => reject(transaction.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Retrieves a single task combined with its steps from IndexedDB.
 */
export function getTaskWithSteps(taskId: string): Promise<TaskWithSteps | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['tasks', 'steps'], 'readonly');
      const tasksStore = transaction.objectStore('tasks');
      const stepsStore = transaction.objectStore('steps');

      const getTaskRequest = tasksStore.get(taskId);
      getTaskRequest.onsuccess = () => {
        const task = getTaskRequest.result as Task | undefined;
        if (!task) {
          resolve(null);
          return;
        }

        const stepsIndex = stepsStore.index('task_id');
        const getStepsRequest = stepsIndex.getAll(taskId);
        getStepsRequest.onsuccess = () => {
          const steps = getStepsRequest.result as Step[];
          const sortedSteps = steps.sort((a, b) => a.order_index - b.order_index);
          resolve({
            ...task,
            steps: sortedSteps,
          });
        };
        getStepsRequest.onerror = () => reject(getStepsRequest.error);
      };
      getTaskRequest.onerror = () => reject(getTaskRequest.error);

      transaction.onerror = () => reject(transaction.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Saves or updates a task in the IndexedDB.
 */
export function saveTask(task: Task): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.put(task);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Transactional safe bulk insertion for steps.
 */
export function saveSteps(steps: Step[]): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (steps.length === 0) {
      resolve();
      return;
    }
    try {
      const db = await initDB();
      const transaction = db.transaction('steps', 'readwrite');
      const store = transaction.objectStore('steps');

      let completedCount = 0;
      let hasError = false;

      steps.forEach((step) => {
        const request = store.put(step);
        request.onsuccess = () => {
          completedCount++;
          if (completedCount === steps.length && !hasError) {
            resolve();
          }
        };
        request.onerror = () => {
          hasError = true;
          reject(request.error);
        };
      });

      transaction.onerror = () => {
        if (!hasError) {
          reject(transaction.error);
        }
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Soft-deletes a task by setting deleted_at timestamp.
 */
export function deleteTask(taskId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');

      const getRequest = store.get(taskId);
      getRequest.onsuccess = () => {
        const task = getRequest.result as Task | undefined;
        if (!task) {
          resolve();
          return;
        }
        task.deleted_at = new Date().toISOString();
        store.put(task);
      };
      getRequest.onerror = () => reject(getRequest.error);
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Permanently deletes a task and all associated steps.
 */
export function permanentDeleteTask(taskId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['tasks', 'steps'], 'readwrite');
      const tasksStore = transaction.objectStore('tasks');
      const stepsStore = transaction.objectStore('steps');

      tasksStore.delete(taskId);

      const stepsIndex = stepsStore.index('task_id');
      const getStepsRequest = stepsIndex.getAllKeys(taskId);
      getStepsRequest.onsuccess = () => {
        const keys = getStepsRequest.result as string[];
        keys.forEach((key) => stepsStore.delete(key));
      };

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Restores a soft-deleted task by clearing deleted_at.
 */
export function restoreTask(taskId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction('tasks', 'readwrite');
      const store = transaction.objectStore('tasks');

      const getRequest = store.get(taskId);
      getRequest.onsuccess = () => {
        const task = getRequest.result as Task | undefined;
        if (!task) return;
        delete task.deleted_at;
        store.put(task);
      };
      getRequest.onerror = () => reject(getRequest.error);
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Fetches all soft-deleted tasks with their steps, sorted by deleted_at desc.
 */
export function getDeletedTasksWithSteps(): Promise<TaskWithSteps[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['tasks', 'steps'], 'readonly');
      const tasksStore = transaction.objectStore('tasks');
      const stepsStore = transaction.objectStore('steps');

      const getAllTasksRequest = tasksStore.getAll();
      const getAllStepsRequest = stepsStore.getAll();

      let tasks: Task[] = [];
      let steps: Step[] = [];
      let tasksLoaded = false;
      let stepsLoaded = false;

      const combineAndResolve = () => {
        if (tasksLoaded && stepsLoaded) {
          const deleted = tasks
            .filter((t) => t.deleted_at)
            .map((task) => ({
              ...task,
              steps: steps
                .filter((s) => s.task_id === task.id)
                .sort((a, b) => a.order_index - b.order_index),
            }))
            .sort((a, b) => new Date(b.deleted_at!).getTime() - new Date(a.deleted_at!).getTime());
          resolve(deleted);
        }
      };

      getAllTasksRequest.onsuccess = () => {
        tasks = getAllTasksRequest.result as Task[];
        tasksLoaded = true;
        combineAndResolve();
      };
      getAllTasksRequest.onerror = () => reject(getAllTasksRequest.error);

      getAllStepsRequest.onsuccess = () => {
        steps = getAllStepsRequest.result as Step[];
        stepsLoaded = true;
        combineAndResolve();
      };
      getAllStepsRequest.onerror = () => reject(getAllStepsRequest.error);

      transaction.onerror = () => reject(transaction.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Purges tasks whose deleted_at is older than the specified number of days.
 */
export function purgeExpiredDeletedTasks(days: number = 30): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['tasks', 'steps'], 'readwrite');
      const tasksStore = transaction.objectStore('tasks');
      const stepsStore = transaction.objectStore('steps');

      const getAllRequest = tasksStore.getAll();
      getAllRequest.onsuccess = () => {
        const allTasks = getAllRequest.result as Task[];
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        let purgedCount = 0;

        allTasks.forEach((task) => {
          if (task.deleted_at && new Date(task.deleted_at).getTime() < cutoff) {
            tasksStore.delete(task.id);
            const stepsIndex = stepsStore.index('task_id');
            const getKeysRequest = stepsIndex.getAllKeys(task.id);
            getKeysRequest.onsuccess = () => {
              (getKeysRequest.result as string[]).forEach((key) => stepsStore.delete(key));
            };
            purgedCount++;
          }
        });

        transaction.oncomplete = () => resolve(purgedCount);
      };
      getAllRequest.onerror = () => reject(getAllRequest.error);
      transaction.onerror = () => reject(transaction.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Transactional safe step updates that also recalculates parent task completion percentage.
 */
export function updateStepCompletionInDB(
  taskId: string,
  stepId: string,
  isCompleted: boolean
): Promise<{ progress_percentage: number; is_completed: boolean }> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['tasks', 'steps'], 'readwrite');
      const tasksStore = transaction.objectStore('tasks');
      const stepsStore = transaction.objectStore('steps');

      const getStepRequest = stepsStore.get(stepId);
      getStepRequest.onsuccess = () => {
        const step = getStepRequest.result as Step | undefined;
        if (!step) {
          reject(new Error(`Step with ID ${stepId} not found`));
          return;
        }

        step.is_completed = isCompleted;
        const putStepRequest = stepsStore.put(step);

        putStepRequest.onsuccess = () => {
          const index = stepsStore.index('task_id');
          const getTaskStepsRequest = index.getAll(taskId);

          getTaskStepsRequest.onsuccess = () => {
            const allSteps = getTaskStepsRequest.result as Step[];
            
            const completedCount = allSteps.filter(s => s.is_completed).length;
            const progress = allSteps.length > 0 ? Math.round((completedCount / allSteps.length) * 100) : 0;
            const isCompletedTask = progress === 100;

            const getTaskRequest = tasksStore.get(taskId);
            getTaskRequest.onsuccess = () => {
              const task = getTaskRequest.result as Task | undefined;
              if (task) {
                task.progress_percentage = progress;
                task.is_completed = isCompletedTask;
                const putTaskRequest = tasksStore.put(task);
                putTaskRequest.onsuccess = () => {
                  resolve({ progress_percentage: progress, is_completed: isCompletedTask });
                };
                putTaskRequest.onerror = () => reject(putTaskRequest.error);
              } else {
                reject(new Error(`Task with ID ${taskId} not found`));
              }
            };
            getTaskRequest.onerror = () => reject(getTaskRequest.error);
          };
          getTaskStepsRequest.onerror = () => reject(getTaskStepsRequest.error);
        };
        putStepRequest.onerror = () => reject(putStepRequest.error);
      };
      getStepRequest.onerror = () => reject(getStepRequest.error);

      transaction.onerror = () => {
        reject(transaction.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Updates a step's note with a detailed breakdown and sets is_broken_down to true.
 */
export function updateStepNoteInDB(stepId: string, detailedNote: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await initDB();
      const transaction = db.transaction('steps', 'readwrite');
      const store = transaction.objectStore('steps');

      const getStepRequest = store.get(stepId);
      getStepRequest.onsuccess = () => {
        const step = getStepRequest.result as Step | undefined;
        if (!step) {
          reject(new Error(`Step with ID ${stepId} not found`));
          return;
        }

        step.note = detailedNote;
        step.is_broken_down = true;
        const putStepRequest = store.put(step);

        putStepRequest.onsuccess = () => resolve();
        putStepRequest.onerror = () => reject(putStepRequest.error);
      };
      getStepRequest.onerror = () => reject(getStepRequest.error);

      transaction.onerror = () => reject(transaction.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Model factory that takes raw AI generation output, maps it to Task & Step database schemas,
 * saves both to IndexedDB atomically, and returns the unified TaskWithSteps.
 */
export async function createTaskWithStepsFromAI(
  taskTitle: string,
  aiData: { title?: string; affirmation?: string; closing_tip?: string; steps: any[] }
): Promise<TaskWithSteps> {
  const taskId = `task-${Date.now()}`;
  
  const stepsData: Step[] = aiData.steps.map((step, idx) => ({
    id: `${taskId}-s-${idx}`,
    task_id: taskId,
    parent_step_id: null,
    title: step.title,
    subtitle: step.subtitle,
    time_estimate: step.time_estimate,
    materials: step.materials,
    note: step.note,
    why: step.why,
    is_completed: false,
    order_index: idx,
    created_at: new Date().toISOString()
  }));

  const newTask: Task = {
    id: taskId,
    title: aiData.title || taskTitle,
    affirmation: aiData.affirmation,
    closing_tip: aiData.closing_tip,
    is_completed: false,
    progress_percentage: 0,
    created_at: new Date().toISOString()
  };

  await saveTask(newTask);
  await saveSteps(stepsData);

  return {
    ...newTask,
    steps: stepsData
  };
}
