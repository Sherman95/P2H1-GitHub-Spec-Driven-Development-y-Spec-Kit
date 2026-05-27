from datetime import datetime

from supabase import Client


class TaskRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def list(self, user_id: str, filters: dict) -> list[dict]:
        query = (
            self.client.table("tasks")
            .select("*, subjects(name)")
            .eq("user_id", user_id)
        )

        status = filters.get("status")
        priority = filters.get("priority")
        subject_id = filters.get("subject_id")
        search = filters.get("search")
        sort = filters.get("sort")

        if status:
            query = query.eq("status", status)
        if priority:
            query = query.eq("priority", priority)
        if subject_id:
            query = query.eq("subject_id", subject_id)
        if search:
            query = query.or_(
                f"title.ilike.%{search}%,description.ilike.%{search}%,subjects.name.ilike.%{search}%"
            )
        if sort:
            allowed_sorts = {"due_date", "priority", "status", "created_at"}
            if sort in allowed_sorts:
                query = query.order(sort)

        response = query.execute()
        return response.data or []

    def get(self, user_id: str, task_id: str) -> dict | None:
        response = (
            self.client.table("tasks")
            .select("*")
            .eq("id", task_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    def create(self, user_id: str, payload: dict) -> dict:
        now = datetime.utcnow().isoformat()
        data = {**payload, "user_id": user_id, "created_at": now, "updated_at": now}
        response = self.client.table("tasks").insert(data).execute()
        return response.data[0]

    def update(self, user_id: str, task_id: str, payload: dict) -> dict | None:
        data = {**payload, "updated_at": datetime.utcnow().isoformat()}
        response = (
            self.client.table("tasks")
            .update(data)
            .eq("id", task_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    def delete(self, user_id: str, task_id: str) -> bool:
        response = (
            self.client.table("tasks")
            .delete()
            .eq("id", task_id)
            .eq("user_id", user_id)
            .execute()
        )
        return bool(response.data)

    def mark_overdue(self, user_id: str, today: str) -> None:
        (
            self.client.table("tasks")
            .update({"status": "overdue"})
            .lt("due_date", today)
            .neq("status", "completed")
            .eq("user_id", user_id)
            .execute()
        )

    def summary(self, user_id: str) -> dict:
        response = self.client.table("tasks").select("*").eq("user_id", user_id).execute()
        tasks = response.data or []
        total = len(tasks)
        pending = len([task for task in tasks if task["status"] == "pending"])
        in_progress = len([task for task in tasks if task["status"] == "in_progress"])
        completed = len([task for task in tasks if task["status"] == "completed"])
        overdue = len([task for task in tasks if task["status"] == "overdue"])
        high_priority = len([task for task in tasks if task["priority"] == "high"])
        return {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "overdue": overdue,
            "high_priority": high_priority
        }
