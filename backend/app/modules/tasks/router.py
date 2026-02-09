from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from . import schemas, services
import uuid

router = APIRouter()

@router.post("/", response_model=schemas.TaskResponse, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return services.TaskService.create_task(db=db, task=task)

@router.get("/", response_model=List[schemas.TaskResponse])
def read_tasks(
    skip: int = 0, 
    limit: int = 100, 
    entity_type: Optional[str] = None, 
    entity_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if entity_type and entity_id:
        try:
            e_id = uuid.UUID(entity_id)
            return services.TaskService.get_tasks_by_entity(db, entity_type, e_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid entity_id")
            
    return services.TaskService.get_tasks(db, skip=skip, limit=limit)

@router.get("/{task_id}", response_model=schemas.TaskResponse)
def read_task(task_id: str, db: Session = Depends(get_db)):
    task = services.TaskService.get_task(db, uuid.UUID(task_id))
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: str, task_data: schemas.TaskUpdate, db: Session = Depends(get_db)):
    updated_task = services.TaskService.update_task(db, uuid.UUID(task_id), task_data)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    success = services.TaskService.delete_task(db, uuid.UUID(task_id))
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True}
