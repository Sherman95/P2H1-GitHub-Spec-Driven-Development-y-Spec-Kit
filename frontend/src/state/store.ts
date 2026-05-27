import type { User } from "../types/auth";
import type { Subject } from "../types/subject";
import type { Filters, Task } from "../types/task";

export const state = {
  tasks: [] as Task[],
  subjects: [] as Subject[],
  user: null as User | null,
  token: "" as string,
  filters: {
    status: "",
    priority: "",
    subject_id: "",
    search: "",
    sort: ""
  } as Filters,
  useLocal: false,
  theme: "light"
};

export const labels = {
  priority: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  },
  status: {
    pending: "Pendiente",
    in_progress: "En proceso",
    completed: "Completada",
    overdue: "Vencida"
  }
};
