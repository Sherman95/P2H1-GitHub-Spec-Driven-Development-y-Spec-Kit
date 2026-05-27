import "./styles.css";

type TaskPriority = "low" | "medium" | "high";
type TaskStatus = "pending" | "in_progress" | "finished";

type Task = {
  id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

type Summary = {
  total: number;
  pending: number;
  finished: number;
  highPriority: number;
};

type Filters = {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  subject?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
const LOCAL_KEY = "taskcampus.tasks";
const CONNECTION_STATUS = document.getElementById("connection-status") as HTMLParagraphElement;

const taskList = document.getElementById("task-list") as HTMLDivElement;
const summaryTotal = document.getElementById("summary-total") as HTMLParagraphElement;
const summaryPending = document.getElementById("summary-pending") as HTMLParagraphElement;
const summaryFinished = document.getElementById("summary-finished") as HTMLParagraphElement;
const summaryHigh = document.getElementById("summary-high") as HTMLParagraphElement;

const filterStatus = document.getElementById("filter-status") as HTMLSelectElement;
const filterPriority = document.getElementById("filter-priority") as HTMLSelectElement;
const filterSubject = document.getElementById("filter-subject") as HTMLInputElement;

const form = document.getElementById("task-form") as HTMLFormElement;
const taskIdInput = document.getElementById("task-id") as HTMLInputElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const descriptionInput = document.getElementById("description") as HTMLTextAreaElement;
const subjectInput = document.getElementById("subject") as HTMLInputElement;
const dueDateInput = document.getElementById("due-date") as HTMLInputElement;
const priorityInput = document.getElementById("priority") as HTMLSelectElement;
const statusInput = document.getElementById("status") as HTMLSelectElement;
const resetButton = document.getElementById("reset-form") as HTMLButtonElement;

const state = {
  tasks: [] as Task[],
  filters: {
    status: "",
    priority: "",
    subject: ""
  } as Filters,
  useLocal: false
};

const labels = {
  priority: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  },
  status: {
    pending: "Pendiente",
    in_progress: "En proceso",
    finished: "Finalizada"
  }
};

const setConnectionStatus = (mode: "api" | "local") => {
  if (mode === "api") {
    CONNECTION_STATUS.textContent = "Conectado al backend";
  } else {
    CONNECTION_STATUS.textContent = "Modo local (sin backend)";
  }
};

const loadLocalTasks = (): Task[] => {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(tasks));
};

const filterTasks = (tasks: Task[], filters: Filters) =>
  tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.subject && !task.subject.toLowerCase().includes(filters.subject.toLowerCase())) return false;
    return true;
  });

const localSummary = (tasks: Task[]): Summary => {
  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const finished = tasks.filter((task) => task.status === "finished").length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;
  return { total, pending, finished, highPriority };
};

const apiRequest = async (path: string, options?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options
    });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const storage = {
  async detectBackend() {
    try {
      await apiRequest("/summary");
      state.useLocal = false;
      setConnectionStatus("api");
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
    }
  },
  async list(filters: Filters) {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      return filterTasks(tasks, filters);
    }

    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.subject) params.set("subject", filters.subject);

    try {
      return (await apiRequest(`/tasks?${params.toString()}`)) as Task[];
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      const tasks = loadLocalTasks();
      return filterTasks(tasks, filters);
    }
  },
  async create(payload: Omit<Task, "id" | "created_at" | "updated_at">) {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const now = new Date().toISOString();
      const newTask: Task = {
        ...payload,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now
      };
      const next = [newTask, ...tasks];
      saveLocalTasks(next);
      return newTask;
    }

    try {
      return (await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(payload)
      })) as Task;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return storage.create(payload);
    }
  },
  async update(id: string, payload: Omit<Task, "id" | "created_at" | "updated_at">) {
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
      return (await apiRequest(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      })) as Task;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return storage.update(id, payload);
    }
  },
  async remove(id: string) {
    if (state.useLocal) {
      const tasks = loadLocalTasks();
      const next = tasks.filter((task) => task.id !== id);
      saveLocalTasks(next);
      return;
    }

    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return storage.remove(id);
    }
  },
  async summary() {
    if (state.useLocal) {
      return localSummary(loadLocalTasks());
    }

    try {
      return (await apiRequest("/summary")) as Summary;
    } catch {
      state.useLocal = true;
      setConnectionStatus("local");
      return localSummary(loadLocalTasks());
    }
  }
};

const renderSummary = (summary: Summary) => {
  summaryTotal.textContent = summary.total.toString();
  summaryPending.textContent = summary.pending.toString();
  summaryFinished.textContent = summary.finished.toString();
  summaryHigh.textContent = summary.highPriority.toString();
};

const renderTasks = (tasks: Task[]) => {
  if (!tasks.length) {
    taskList.innerHTML = "<div class=\"rounded-xl border border-dashed border-slate/30 p-6 text-center text-slate\">No hay tareas registradas.</div>";
    return;
  }

  taskList.innerHTML = tasks
    .map(
      (task) => `
      <article class="rounded-2xl border border-slate/10 bg-mist/60 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold">${task.title}</h3>
            <p class="text-sm text-slate">${task.subject}</p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="rounded-full bg-white px-3 py-1">${labels.priority[task.priority]}</span>
            <span class="rounded-full bg-white px-3 py-1">${labels.status[task.status]}</span>
            <span class="rounded-full bg-white px-3 py-1">Entrega: ${task.due_date}</span>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate">${task.description}</p>
        <div class="mt-4 flex gap-3">
          <button data-action="edit" data-id="${task.id}" class="rounded-lg border border-slate/20 px-3 py-1 text-sm">Editar</button>
          <button data-action="delete" data-id="${task.id}" class="rounded-lg bg-ink px-3 py-1 text-sm text-white">Eliminar</button>
        </div>
      </article>
    `
    )
    .join("");
};

const refresh = async () => {
  state.tasks = await storage.list(state.filters);
  renderTasks(state.tasks);
  renderSummary(await storage.summary());
};

const resetForm = () => {
  form.reset();
  taskIdInput.value = "";
  form.querySelector("button[type='submit']")!.textContent = "Guardar tarea";
};

filterStatus.addEventListener("change", async () => {
  state.filters.status = filterStatus.value as TaskStatus | "";
  await refresh();
});

filterPriority.addEventListener("change", async () => {
  state.filters.priority = filterPriority.value as TaskPriority | "";
  await refresh();
});

filterSubject.addEventListener("input", async () => {
  state.filters.subject = filterSubject.value.trim();
  await refresh();
});

resetButton.addEventListener("click", () => resetForm());

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    subject: subjectInput.value.trim(),
    due_date: dueDateInput.value,
    priority: priorityInput.value as TaskPriority,
    status: statusInput.value as TaskStatus
  };

  if (!payload.title || !payload.description || !payload.subject || !payload.due_date) {
    return;
  }

  if (taskIdInput.value) {
    await storage.update(taskIdInput.value, payload);
  } else {
    await storage.create(payload);
  }

  resetForm();
  await refresh();
});

taskList.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) return;

  if (action === "edit") {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    taskIdInput.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    subjectInput.value = task.subject;
    dueDateInput.value = task.due_date;
    priorityInput.value = task.priority;
    statusInput.value = task.status;
    form.querySelector("button[type='submit']")!.textContent = "Actualizar tarea";
    return;
  }

  if (action === "delete") {
    await storage.remove(id);
    await refresh();
  }
});

(async () => {
  await storage.detectBackend();
  await refresh();
})();
