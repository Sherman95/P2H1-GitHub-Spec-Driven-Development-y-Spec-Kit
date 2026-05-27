from fastapi import APIRouter, Depends, HTTPException

from ..schemas.subject_schema import SubjectCreate, SubjectOut, SubjectUpdate
from ..services.dependencies import get_current_user, get_subject_service
from ..services.subject_service import SubjectService

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("", response_model=list[SubjectOut])
def list_subjects(
    current_user: dict = Depends(get_current_user),
    service: SubjectService = Depends(get_subject_service)
):
    return service.list(current_user["id"])


@router.get("/{subject_id}", response_model=SubjectOut)
def get_subject(
    subject_id: str,
    current_user: dict = Depends(get_current_user),
    service: SubjectService = Depends(get_subject_service)
):
    subject = service.get(current_user["id"], subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.post("", response_model=SubjectOut)
def create_subject(
    payload: SubjectCreate,
    current_user: dict = Depends(get_current_user),
    service: SubjectService = Depends(get_subject_service)
):
    return service.create(current_user["id"], payload.model_dump())


@router.put("/{subject_id}", response_model=SubjectOut)
def update_subject(
    subject_id: str,
    payload: SubjectUpdate,
    current_user: dict = Depends(get_current_user),
    service: SubjectService = Depends(get_subject_service)
):
    subject = service.update(current_user["id"], subject_id, payload.model_dump())
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: str,
    current_user: dict = Depends(get_current_user),
    service: SubjectService = Depends(get_subject_service)
):
    removed = service.delete(current_user["id"], subject_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Subject not found")
    return {"ok": True}
