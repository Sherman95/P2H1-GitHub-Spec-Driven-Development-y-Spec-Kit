import json
import os
from datetime import datetime
from typing import Optional
from uuid import uuid4

from supabase import create_client

from .models import TaskCreate, TaskOut, TaskUpdate, TaskPriority, TaskStatus


class JsonStorage:
    def __init__(self, file_path: str) -> None:
        self.file_path = file_path
        self._ensure_file()

    def _ensure_file(self) -> None:
        if not os.path.exists(self.file_path):
            os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
            with open(self.file_path, "w", encoding="utf-8") as file:
                json.dump([], file)

    def _read(self) -> list[TaskOut]:
        with open(self.file_path, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data

    def _write(self, tasks: list[TaskOut]) -> None:
        with open(self.file_path, "w", encoding="utf-8") as file:
            json.dump(tasks, file, ensure_ascii=True, indent=2)

    def list(
        self,
        status: Optional[TaskStatus],
        priority: Optional[TaskPriority],
        subject: Optional[str]
    ) -> list[TaskOut]:
        tasks = self._read()
        result = []
        for task in tasks:
            if status and task["status"] != status:
                continue
            if priority and task["priority"] != priority:
                continue
            if subject and subject.lower() not in task["subject"].lower():
                continue
            result.append(task)
        return result

    def create(self, payload: TaskCreate) -> TaskOut:
        tasks = self._read()
        now = datetime.utcnow().isoformat()
        task = {
            "id": str(uuid4()),
            **payload.model_dump(),
            "created_at": now,
            "updated_at": now
        }
        tasks.insert(0, task)
        self._write(tasks)
        return task

    def update(self, task_id: str, payload: TaskUpdate) -> Optional[TaskOut]:
        tasks = self._read()
        updated_task = None
        for index, task in enumerate(tasks):
            if task["id"] == task_id:
                updated_task = {
                    **task,
                    **payload.model_dump(),
                    "updated_at": datetime.utcnow().isoformat()
                }
                tasks[index] = updated_task
                break
        if updated_task is None:
            return None
        self._write(tasks)
        return updated_task

    def delete(self, task_id: str) -> bool:
        tasks = self._read()
        next_tasks = [task for task in tasks if task["id"] != task_id]
        if len(next_tasks) == len(tasks):
            return False
        self._write(next_tasks)
        return True

    def summary(self) -> dict:
        tasks = self._read()
        total = len(tasks)
        pending = len([task for task in tasks if task["status"] == "pending"])
        finished = len([task for task in tasks if task["status"] == "finished"])
        high_priority = len([task for task in tasks if task["priority"] == "high"])
        return {
            "total": total,
            "pending": pending,
            "finished": finished,
            "highPriority": high_priority
        }


class SupabaseStorage:
    def __init__(self, url: str, key: str, table: str) -> None:
        self.client = create_client(url, key)
        self.table = table

    def list(
        self,
        status: Optional[TaskStatus],
        priority: Optional[TaskPriority],
        subject: Optional[str]
    ) -> list[TaskOut]:
        query = self.client.table(self.table).select("*")
        if status:
            query = query.eq("status", status)
        if priority:
            query = query.eq("priority", priority)
        if subject:
            query = query.ilike("subject", f"%{subject}%")
        response = query.execute()
        return response.data or []

    def create(self, payload: TaskCreate) -> TaskOut:
        now = datetime.utcnow().isoformat()
        task = {**payload.model_dump(), "created_at": now, "updated_at": now}
        response = self.client.table(self.table).insert(task).execute()
        return response.data[0]

    def update(self, task_id: str, payload: TaskUpdate) -> Optional[TaskOut]:
        now = datetime.utcnow().isoformat()
        data = {**payload.model_dump(), "updated_at": now}
        response = self.client.table(self.table).update(data).eq("id", task_id).execute()
        return response.data[0] if response.data else None

    def delete(self, task_id: str) -> bool:
        response = self.client.table(self.table).delete().eq("id", task_id).execute()
        return bool(response.data)

    def summary(self) -> dict:
        response = self.client.table(self.table).select("*").execute()
        tasks = response.data or []
        total = len(tasks)
        pending = len([task for task in tasks if task["status"] == "pending"])
        finished = len([task for task in tasks if task["status"] == "finished"])
        high_priority = len([task for task in tasks if task["priority"] == "high"])
        return {
            "total": total,
            "pending": pending,
            "finished": finished,
            "highPriority": high_priority
        }


def get_storage():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    table = os.getenv("SUPABASE_TABLE", "tasks")

    if url and key:
        return SupabaseStorage(url, key, table)

    base_dir = os.path.dirname(os.path.dirname(__file__))
    file_path = os.path.join(base_dir, "data", "tasks.json")
    return JsonStorage(file_path)
