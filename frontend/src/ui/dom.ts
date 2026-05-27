import type { Subject } from "../types/subject";
import type { Summary, Task } from "../types/task";
import { labels } from "../state/store";

export const dom = {
  connectionStatus: document.getElementById("connection-status") as HTMLParagraphElement,
  themeToggle: document.getElementById("theme-toggle") as HTMLButtonElement,
  toast: document.getElementById("toast") as HTMLDivElement,
  authSection: document.getElementById("auth-section") as HTMLDivElement,
  appSection: document.getElementById("app-section") as HTMLDivElement,
  showLogin: document.getElementById("show-login") as HTMLButtonElement,
  showRegister: document.getElementById("show-register") as HTMLButtonElement,
  loginForm: document.getElementById("login-form") as HTMLFormElement,
  registerForm: document.getElementById("register-form") as HTMLFormElement,
  loginEmail: document.getElementById("login-email") as HTMLInputElement,
  loginPassword: document.getElementById("login-password") as HTMLInputElement,
  registerName: document.getElementById("register-name") as HTMLInputElement,
  registerEmail: document.getElementById("register-email") as HTMLInputElement,
  registerPassword: document.getElementById("register-password") as HTMLInputElement,
  summaryTotal: document.getElementById("summary-total") as HTMLParagraphElement,
  summaryPending: document.getElementById("summary-pending") as HTMLParagraphElement,
  summaryInProgress: document.getElementById("summary-inprogress") as HTMLParagraphElement,
  summaryCompleted: document.getElementById("summary-completed") as HTMLParagraphElement,
  summaryOverdue: document.getElementById("summary-overdue") as HTMLParagraphElement,
  summaryHigh: document.getElementById("summary-high") as HTMLParagraphElement,
  chartStatus: document.getElementById("chart-status") as HTMLDivElement,
  chartPriority: document.getElementById("chart-priority") as HTMLDivElement,
  subjectList: document.getElementById("subject-list") as HTMLDivElement,
  subjectForm: document.getElementById("subject-form") as HTMLFormElement,
  subjectId: document.getElementById("subject-id") as HTMLInputElement,
  subjectName: document.getElementById("subject-name") as HTMLInputElement,
  subjectTeacher: document.getElementById("subject-teacher") as HTMLInputElement,
  subjectColor: document.getElementById("subject-color") as HTMLInputElement,
  subjectReset: document.getElementById("subject-reset") as HTMLButtonElement,
  taskList: document.getElementById("task-list") as HTMLDivElement,
  filterStatus: document.getElementById("filter-status") as HTMLSelectElement,
  filterPriority: document.getElementById("filter-priority") as HTMLSelectElement,
  filterSubject: document.getElementById("filter-subject") as HTMLSelectElement,
  filterSearch: document.getElementById("filter-search") as HTMLInputElement,
  filterSort: document.getElementById("filter-sort") as HTMLSelectElement,
  form: document.getElementById("task-form") as HTMLFormElement,
  taskId: document.getElementById("task-id") as HTMLInputElement,
  title: document.getElementById("title") as HTMLInputElement,
  description: document.getElementById("description") as HTMLTextAreaElement,
  subject: document.getElementById("subject") as HTMLSelectElement,
  dueDate: document.getElementById("due-date") as HTMLInputElement,
  priority: document.getElementById("priority") as HTMLSelectElement,
  status: document.getElementById("status") as HTMLSelectElement,
  reset: document.getElementById("reset-form") as HTMLButtonElement,
  submitLabel: document.querySelector("#task-form button[type='submit']") as HTMLButtonElement
};

export const setConnectionStatus = (mode: "api" | "local") => {
  dom.connectionStatus.textContent =
    mode === "api" ? "Conectado al backend" : "Modo local (sin backend)";
};

export const showToast = (message: string) => {
  dom.toast.textContent = message;
  dom.toast.classList.remove("hidden");
  setTimeout(() => dom.toast.classList.add("hidden"), 2500);
};

export const renderSummary = (summary: Summary) => {
  dom.summaryTotal.textContent = summary.total.toString();
  dom.summaryPending.textContent = summary.pending.toString();
  dom.summaryInProgress.textContent = summary.in_progress.toString();
  dom.summaryCompleted.textContent = summary.completed.toString();
  dom.summaryOverdue.textContent = summary.overdue.toString();
  dom.summaryHigh.textContent = summary.high_priority.toString();
};

export const renderCharts = (tasks: Task[]) => {
  const total = tasks.length || 1;
  const statusCounts = {
    pending: tasks.filter((task) => task.status === "pending").length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    overdue: tasks.filter((task) => task.status === "overdue").length
  };
  const priorityCounts = {
    low: tasks.filter((task) => task.priority === "low").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    high: tasks.filter((task) => task.priority === "high").length
  };

  dom.chartStatus.innerHTML = Object.entries(statusCounts)
    .map(
      ([key, value]) => `
      <div class="grid gap-1">
        <div class="flex items-center justify-between">
          <span class="capitalize">${key.replace("_", " ")}</span>
          <span>${value}</span>
        </div>
        <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
          <div class="h-2 rounded-full bg-accent" style="width:${(value / total) * 100}%"></div>
        </div>
      </div>
    `
    )
    .join("");

  dom.chartPriority.innerHTML = Object.entries(priorityCounts)
    .map(
      ([key, value]) => `
      <div class="grid gap-1">
        <div class="flex items-center justify-between">
          <span class="capitalize">${key}</span>
          <span>${value}</span>
        </div>
        <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
          <div class="h-2 rounded-full bg-ink" style="width:${(value / total) * 100}%"></div>
        </div>
      </div>
    `
    )
    .join("");
};

export const renderSubjects = (subjects: Subject[]) => {
  if (!subjects.length) {
    dom.subjectList.innerHTML =
      "<div class=\"rounded-xl border border-dashed border-slate/30 p-4 text-center text-slate\">No hay asignaturas registradas.</div>";
    return;
  }

  dom.subjectList.innerHTML = subjects
    .map(
      (subject) => `
      <div class="flex items-center justify-between rounded-xl border border-slate/10 bg-mist/60 p-3 dark:bg-slate-800">
        <div class="flex items-center gap-3">
          <span class="h-3 w-3 rounded-full" style="background:${subject.color}"></span>
          <div>
            <p class="text-sm font-semibold">${subject.name}</p>
            <p class="text-xs text-slate-500 dark:text-slate-300">${subject.teacher ?? "Sin docente"}</p>
          </div>
        </div>
        <div class="flex gap-2 text-xs">
          <button data-action="edit" data-id="${subject.id}" class="rounded-lg border border-slate/20 px-2 py-1">Editar</button>
          <button data-action="delete" data-id="${subject.id}" class="rounded-lg bg-ink px-2 py-1 text-white">Eliminar</button>
        </div>
      </div>
    `
    )
    .join("");
};

export const renderSubjectOptions = (subjects: Subject[]) => {
  const options = ["<option value=\"\">Asignatura</option>"]
    .concat(subjects.map((subject) => `<option value="${subject.id}">${subject.name}</option>`))
    .join("");
  dom.filterSubject.innerHTML = options;
  dom.subject.innerHTML = options.replace("Asignatura", "Selecciona asignatura");
};

export const renderTasks = (tasks: Task[], subjects: Subject[]) => {
  if (!tasks.length) {
    dom.taskList.innerHTML =
      "<div class=\"rounded-xl border border-dashed border-slate/30 p-6 text-center text-slate\">No hay tareas registradas.</div>";
    return;
  }

  const subjectMap = new Map(subjects.map((item) => [item.id, item.name]));

  dom.taskList.innerHTML = tasks
    .map((task) => {
      const tone = task.status === "overdue" ? "border-red-400" : "border-slate/10";
      return `
      <article class="rounded-2xl border ${tone} bg-mist/60 p-4 dark:bg-slate-800">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-lg font-semibold">${task.title}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-300">${subjectMap.get(task.subject_id ?? "") ?? "Sin asignatura"}</p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="rounded-full bg-white px-3 py-1 dark:bg-slate-700">${labels.priority[task.priority]}</span>
            <span class="rounded-full bg-white px-3 py-1 dark:bg-slate-700">${labels.status[task.status]}</span>
            <span class="rounded-full bg-white px-3 py-1 dark:bg-slate-700">Entrega: ${task.due_date}</span>
          </div>
        </div>
        <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${task.description ?? ""}</p>
        <div class="mt-4 flex gap-3">
          <button data-action="edit" data-id="${task.id}" class="rounded-lg border border-slate/20 px-3 py-1 text-sm">Editar</button>
          <button data-action="delete" data-id="${task.id}" class="rounded-lg bg-ink px-3 py-1 text-sm text-white">Eliminar</button>
        </div>
      </article>
    `;
    })
    .join("");
};

export const resetTaskForm = () => {
  dom.form.reset();
  dom.taskId.value = "";
  dom.submitLabel.textContent = "Guardar tarea";
};

export const fillTaskForm = (task: Task) => {
  dom.taskId.value = task.id;
  dom.title.value = task.title;
  dom.description.value = task.description ?? "";
  dom.subject.value = task.subject_id ?? "";
  dom.dueDate.value = task.due_date;
  dom.priority.value = task.priority;
  dom.status.value = task.status === "overdue" ? "pending" : task.status;
  dom.submitLabel.textContent = "Actualizar tarea";
};

export const resetSubjectForm = () => {
  dom.subjectForm.reset();
  dom.subjectId.value = "";
};

export const fillSubjectForm = (subject: Subject) => {
  dom.subjectId.value = subject.id;
  dom.subjectName.value = subject.name;
  dom.subjectTeacher.value = subject.teacher ?? "";
  dom.subjectColor.value = subject.color;
};
