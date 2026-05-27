from fastapi import APIRouter, Depends, HTTPException, Query

from ..schemas.task_schema import SummaryOut, TaskCreate, TaskOut, TaskPriority, TaskStatus, TaskUpdate
from ..services.dependencies import get_current_user, get_task_service
from ..services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
def list_tasks(
    status: TaskStatus | None = Query(default=None),
    priority: TaskPriority | None = Query(default=None),
    subject_id: str | None = Query(default=None),
    search: str | None = Query(default=None),
    sort: str | None = Query(default=None),
    current_user: dict = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    filters = {
        "status": status,
        "priority": priority,
        "subject_id": subject_id,
        "search": search,
        "sort": sort
    }
    return service.list(current_user["id"], filters)


@router.get("/summary", response_model=SummaryOut)
def summary(
    current_user: dict = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    return service.summary(current_user["id"])


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    task = service.get(current_user["id"], task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("", response_model=TaskOut)
def create_task(
    payload: TaskCreate,
    current_user: dict = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    return service.create(current_user["id"], payload.model_dump())


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    payload: TaskUpdate,
    current_user: dict = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    task = service.update(current_user["id"], task_id, payload.model_dump())
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
    service: TaskService = Depends(get_task_service)
):
    removed = service.delete(current_user["id"], task_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"ok": True}


