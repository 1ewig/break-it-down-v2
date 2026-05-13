import Dexie from 'dexie';
import type { Task, Step } from '@/types';

const db = new Dexie('BreakItDownDB') as Dexie & {
  tasks: Dexie.Table<Task, string>;
  steps: Dexie.Table<Step, string>;
};

db.version(1).stores({
  tasks: 'id',
  steps: 'id, task_id, parent_step_id',
});

export default db;
