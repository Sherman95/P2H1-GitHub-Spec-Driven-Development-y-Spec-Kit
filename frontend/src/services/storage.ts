import { apiRequest } from "./api";
import {
  createLocalSubject,
  createLocalTask,
  filterTasks,
  loadLocalSubjects,
  loadLocalTasks,
  localSummary,
  syncLocalOverdue,
  saveLocalSubjects,
  saveLocalTasks
} from "./localStore";
import { state } from "../state/store";
import type { Subject, SubjectPayload } from "../types/subject";
import type { Filters, Summary, Task, TaskPayload } from "../types/task";

export type ConnectionMode = "api" | "local";

export const createStorage = (setConnectionStatus: (mode: ConnectionMode) => void) => {
  const sortTasks = (tasks: Task[], sort?: string) => {
    if (!sort) return tasks;
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      if (sort === "due_date") return a.due_date.localeCompare(b.due_date);
      if (sort === "priority") return a.priority.localeCompare(b.priority);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "created_at") return a.created_at.localeCompare(b.created_at);
      return 0;
    });
    return sorted;
  };
  const listSubjects = async (): Promise<Subject[]> => {
    if (state.useLocal) {
      const subjects = loadLocalSubjects().filter((item) => item.user_id === state.user?.id);
      return subjects;
    }

    try {
      return (await apiRequest("/subjects", undefined, state.token)) as Subject[];
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return loadLocalSubjects().filter((item) => item.user_id === state.user?.id);
    }
  };

  const createSubject = async (payload: SubjectPayload) => {
    if (!state.user) throw new Error("Not authenticated");
    if (state.useLocal) {
      const subjects = loadLocalSubjects();
      const subject = createLocalSubject(state.user.id, payload);
      const next = [subject, ...subjects];
      saveLocalSubjects(next);
      return subject;
    }

    try {
      return (await apiRequest(
        "/subjects",
        {
          method: "POST",
          body: JSON.stringify(payload)
        },
        state.token
      )) as Subject;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return createSubject(payload);
    }
  };

  const updateSubject = async (id: string, payload: SubjectPayload) => {
    if (!state.user) throw new Error("Not authenticated");
    if (state.useLocal) {
      const subjects = loadLocalSubjects();
      const next = subjects.map((subject) =>
        subject.id === id ? { ...subject, ...payload } : subject
      );
      saveLocalSubjects(next);
      return next.find((subject) => subject.id === id) as Subject;
    }

    try {
      return (await apiRequest(
        `/subjects/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload)
        },
        state.token
      )) as Subject;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return updateSubject(id, payload);
    }
  };

  const removeSubject = async (id: string) => {
    if (!state.user) throw new Error("Not authenticated");
    if (state.useLocal) {
      const subjects = loadLocalSubjects();
      const next = subjects.filter((subject) => subject.id !== id);
      saveLocalSubjects(next);
      return;
    }

    try {
      await apiRequest(`/subjects/${id}`, { method: "DELETE" }, state.token);
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return removeSubject(id);
    }
  };

  const listTasks = async (filters: Filters) => {
    if (state.useLocal) {
      const tasks = syncLocalOverdue(loadLocalTasks()).filter(
        (item) => item.user_id === state.user?.id
      );
      saveLocalTasks(tasks);
      const subjectMap = new Map(state.subjects.map((item) => [item.id, item.name]));
      const filtered = filterTasks(tasks, filters, subjectMap);
      return sortTasks(filtered, filters.sort);
    }

    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.subject_id) params.set("subject_id", filters.subject_id);
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);

    try {
      return (await apiRequest(`/tasks?${params.toString()}`, undefined, state.token)) as Task[];
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      const tasks = syncLocalOverdue(loadLocalTasks()).filter(
        (item) => item.user_id === state.user?.id
      );
      saveLocalTasks(tasks);
      const subjectMap = new Map(state.subjects.map((item) => [item.id, item.name]));
      const filtered = filterTasks(tasks, filters, subjectMap);
      return sortTasks(filtered, filters.sort);
    }
  };

  const createTask = async (payload: TaskPayload) => {
    if (!state.user) throw new Error("Not authenticated");
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const newTask = createLocalTask(payload, state.user.id);
      const next = [newTask, ...tasks];
      saveLocalTasks(next);
      return newTask;
    }

    try {
      return (await apiRequest(
        "/tasks",
        {
          method: "POST",
          body: JSON.stringify(payload)
        },
        state.token
      )) as Task;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return createTask(payload);
    }
  };

  const updateTask = async (id: string, payload: TaskPayload) => {
    if (!state.user) throw new Error("Not authenticated");
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const now = new Date().toISOString();
      const next = tasks.map((task) =>
        task.id === id ? { ...task, ...payload, updated_at: now } : task
      );
      saveLocalTasks(next);
      return next.find((task) => task.id === id) as Task;
    }

    try {
      return (await apiRequest(
        `/tasks/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload)
        },
        state.token
      )) as Task;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return updateTask(id, payload);
    }
  };

  const removeTask = async (id: string) => {
    if (!state.user) throw new Error("Not authenticated");
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const next = tasks.filter((task) => task.id !== id);
      saveLocalTasks(next);
      return;
    }

    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE" }, state.token);
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return removeTask(id);
    }
  };

  const summary = async (): Promise<Summary> => {
    if (state.useLocal) {
      const tasks = syncLocalOverdue(loadLocalTasks()).filter(
        (item) => item.user_id === state.user?.id
      );
      saveLocalTasks(tasks);
      return localSummary(tasks);
    }

    try {
      return (await apiRequest("/tasks/summary", undefined, state.token)) as Summary;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      const tasks = syncLocalOverdue(loadLocalTasks()).filter(
        (item) => item.user_id === state.user?.id
      );
      saveLocalTasks(tasks);
      return localSummary(tasks);
    }
  };

  return {
    listSubjects,
    createSubject,
    updateSubject,
    removeSubject,
    listTasks,
    createTask,
    updateTask,
    removeTask,
    summary
  };
};
