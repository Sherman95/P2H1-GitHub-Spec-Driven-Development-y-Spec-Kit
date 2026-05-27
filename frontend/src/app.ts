import { createAuthService } from "./services/auth";
import { createStorage } from "./services/storage";
import { state } from "./state/store";
import type { SubjectPayload } from "./types/subject";
import type { TaskPayload, TaskPriority, TaskStatus } from "./types/task";
import {
  dom,
  fillSubjectForm,
  fillTaskForm,
  renderSubjectOptions,
  renderSubjects,
  renderCharts,
  renderSummary,
  renderTasks,
  resetSubjectForm,
  resetTaskForm,
  setConnectionStatus,
  showToast
} from "./ui/dom";

const storage = createStorage(setConnectionStatus);
const auth = createAuthService({
  setLocalMode: (value) => {
    state.useLocal = value;
  },
  setConnectionStatus
});

const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
  state.theme = theme;
};

const initTheme = () => {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored ?? (prefersDark ? "dark" : "light"));
};

const refreshSubjects = async () => {
  state.subjects = await storage.listSubjects();
  renderSubjects(state.subjects);
  renderSubjectOptions(state.subjects);
};

const refreshTasks = async () => {
  state.tasks = await storage.listTasks(state.filters);
  renderTasks(state.tasks, state.subjects);
  renderCharts(state.tasks);
  renderSummary(await storage.summary());
};

const showApp = () => {
  dom.authSection.classList.add("hidden");
  dom.appSection.classList.remove("hidden");
};

const showAuth = () => {
  dom.authSection.classList.remove("hidden");
  dom.appSection.classList.add("hidden");
};

const getTaskPayload = (): TaskPayload => ({
  subject_id: dom.subject.value || null,
  title: dom.title.value.trim(),
  description: dom.description.value.trim() || null,
  due_date: dom.dueDate.value,
  priority: dom.priority.value as TaskPriority,
  status: dom.status.value as TaskStatus
});

const isValidTask = (payload: TaskPayload) => payload.title && payload.due_date;

const getSubjectPayload = (): SubjectPayload => ({
  name: dom.subjectName.value.trim(),
  teacher: dom.subjectTeacher.value.trim() || null,
  color: dom.subjectColor.value
});

const initSession = async () => {
  const session = auth.initSession();
  if (session.user && session.token) {
    state.user = session.user;
    state.token = session.token;
    setConnectionStatus(state.useLocal ? "local" : "api");
    showApp();
    await refreshSubjects();
    await refreshTasks();
  } else {
    showAuth();
  }
};

const bindEvents = () => {
  dom.themeToggle.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  dom.showLogin.addEventListener("click", () => {
    dom.loginForm.classList.remove("hidden");
    dom.registerForm.classList.add("hidden");
  });

  dom.showRegister.addEventListener("click", () => {
    dom.registerForm.classList.remove("hidden");
    dom.loginForm.classList.add("hidden");
  });

  dom.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const response = await auth.login(dom.loginEmail.value, dom.loginPassword.value);
      state.user = response.user;
      state.token = response.access_token;
      showToast("Login exitoso");
      showApp();
      await refreshSubjects();
      await refreshTasks();
    } catch {
      showToast("Error al iniciar sesion");
    }
  });

  dom.registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const response = await auth.register(
        dom.registerName.value,
        dom.registerEmail.value,
        dom.registerPassword.value
      );
      state.user = response.user;
      state.token = response.access_token;
      showToast("Registro exitoso");
      showApp();
      await refreshSubjects();
      await refreshTasks();
    } catch {
      showToast("Error al registrarse");
    }
  });

  dom.subjectReset.addEventListener("click", () => resetSubjectForm());

  dom.subjectForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = getSubjectPayload();
    if (!payload.name) return;

    try {
      if (dom.subjectId.value) {
        await storage.updateSubject(dom.subjectId.value, payload);
      } else {
        await storage.createSubject(payload);
      }
      resetSubjectForm();
      await refreshSubjects();
      showToast("Asignatura guardada");
    } catch {
      showToast("Error al guardar asignatura");
    }
  });

  dom.subjectList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === "edit") {
      const subject = state.subjects.find((item) => item.id === id);
      if (subject) fillSubjectForm(subject);
      return;
    }

    if (action === "delete") {
      if (!confirm("Eliminar asignatura?")) return;
      await storage.removeSubject(id);
      await refreshSubjects();
      showToast("Asignatura eliminada");
    }
  });

  dom.filterStatus.addEventListener("change", async () => {
    state.filters.status = dom.filterStatus.value as TaskStatus | "";
    await refreshTasks();
  });

  dom.filterPriority.addEventListener("change", async () => {
    state.filters.priority = dom.filterPriority.value as TaskPriority | "";
    await refreshTasks();
  });

  dom.filterSubject.addEventListener("change", async () => {
    state.filters.subject_id = dom.filterSubject.value || "";
    await refreshTasks();
  });

  dom.filterSearch.addEventListener("input", async () => {
    state.filters.search = dom.filterSearch.value.trim();
    await refreshTasks();
  });

  dom.filterSort.addEventListener("change", async () => {
    state.filters.sort = dom.filterSort.value || "";
    await refreshTasks();
  });

  dom.reset.addEventListener("click", () => resetTaskForm());

  dom.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = getTaskPayload();
    if (!isValidTask(payload)) return;

    try {
      if (dom.taskId.value) {
        await storage.updateTask(dom.taskId.value, payload);
      } else {
        await storage.createTask(payload);
      }
      resetTaskForm();
      await refreshTasks();
      showToast("Tarea guardada");
    } catch {
      showToast("Error al guardar tarea");
    }
  });

  dom.taskList.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === "edit") {
      const task = state.tasks.find((item) => item.id === id);
      if (task) fillTaskForm(task);
      return;
    }

    if (action === "delete") {
      if (!confirm("Eliminar tarea?")) return;
      await storage.removeTask(id);
      await refreshTasks();
      showToast("Tarea eliminada");
    }
  });
};

export const initApp = async () => {
  initTheme();
  bindEvents();
  await initSession();
};
