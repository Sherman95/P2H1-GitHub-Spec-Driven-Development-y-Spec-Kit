import type { Subject, SubjectPayload } from "../types/subject";
import type { User } from "../types/auth";
import type { Filters, Summary, Task, TaskPayload } from "../types/task";

const TASKS_KEY = "taskcampus.tasks";
const SUBJECTS_KEY = "taskcampus.subjects";
const USERS_KEY = "taskcampus.users";
const TOKEN_KEY = "taskcampus.token";
const USER_KEY = "taskcampus.user";

export const loadLocalTasks = (): Task[] => {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
};

export const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadLocalSubjects = (): Subject[] => {
  const raw = localStorage.getItem(SUBJECTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Subject[];
  } catch {
    return [];
  }
};

export const saveLocalSubjects = (subjects: Subject[]) => {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
};

export type LocalUser = User & { password: string };

export const loadLocalUsers = (): LocalUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalUser[];
  } catch {
    return [];
  }
};

export const saveLocalUsers = (users: LocalUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const saveSession = (user: User, token: string) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const loadSession = (): { user: User | null; token: string } => {
  const rawUser = localStorage.getItem(USER_KEY);
  const token = localStorage.getItem(TOKEN_KEY) ?? "";
  if (!rawUser) return { user: null, token };
  try {
    return { user: JSON.parse(rawUser) as User, token };
  } catch {
    return { user: null, token };
  }
};

export const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const filterTasks = (
  tasks: Task[],
  filters: Filters,
  subjectMap?: Map<string, string>
) =>
  tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.subject_id && task.subject_id !== filters.subject_id) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const subjectName = subjectMap?.get(task.subject_id ?? "") ?? "";
      const haystack = `${task.title} ${task.description ?? ""} ${subjectName}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

export const localSummary = (tasks: Task[]): Summary => {
  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const in_progress = tasks.filter((task) => task.status === "in_progress").length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const overdue = tasks.filter((task) => task.status === "overdue").length;
  const high_priority = tasks.filter((task) => task.priority === "high").length;
  return { total, pending, in_progress, completed, overdue, high_priority };
};

export const createLocalTask = (payload: TaskPayload, user_id: string): Task => {
  const now = new Date().toISOString();
  return {
    ...payload,
    id: crypto.randomUUID(),
    user_id,
    created_at: now,
    updated_at: now
  };
};

export const syncLocalOverdue = (tasks: Task[]): Task[] => {
  const today = new Date().toISOString().slice(0, 10);
  return tasks.map((task) => {
    if (task.status !== "completed" && task.due_date < today) {
      return { ...task, status: "overdue" };
    }
    return task;
  });
};

export const createLocalSubject = (user_id: string, payload: SubjectPayload): Subject => {
  return {
    id: crypto.randomUUID(),
    user_id,
    name: payload.name,
    teacher: payload.teacher,
    color: payload.color,
    created_at: new Date().toISOString()
  };
};
