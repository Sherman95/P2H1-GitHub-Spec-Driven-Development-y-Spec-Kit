import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .models import TaskCreate, TaskOut, TaskPriority, TaskStatus, TaskUpdate
from .storage import get_storage

load_dotenv()

app = FastAPI(title="TaskCampus API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

storage = get_storage()


@app.get("/tasks", response_model=list[TaskOut])
async def list_tasks(
    status: TaskStatus | None = Query(default=None),
    priority: TaskPriority | None = Query(default=None),
    subject: str | None = Query(default=None)
):
    return storage.list(status=status, priority=priority, subject=subject)


@app.post("/tasks", response_model=TaskOut)
async def create_task(payload: TaskCreate):
    return storage.create(payload)


@app.put("/tasks/{task_id}", response_model=TaskOut)
async def update_task(task_id: str, payload: TaskUpdate):
    task = storage.update(task_id, payload)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    removed = storage.delete(task_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"ok": True}


@app.get("/summary")
async def summary():
    return storage.summary()
