from sqlalchemy.orm import Session
from .models import Task
from . import schemas
import uuid
from typing import Optional

class TaskService:
    @staticmethod
    def create_task(db: Session, task: schemas.TaskCreate):
        db_task = Task(**task.dict())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def get_tasks(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Task).offset(skip).limit(limit).all()

    @staticmethod
    def get_tasks_by_entity(db: Session, entity_type: str, entity_id: uuid.UUID):
        return db.query(Task).filter(
            Task.entity_type == entity_type,
            Task.entity_id == entity_id
        ).all()

    @staticmethod
    def get_task(db: Session, task_id: uuid.UUID):
        return db.query(Task).filter(Task.id == task_id).first()

    @staticmethod
    def update_task(db: Session, task_id: uuid.UUID, task_data: schemas.TaskUpdate) -> Optional[Task]:
        db_task = TaskService.get_task(db, task_id)
        if not db_task:
            return None
        
        update_data = task_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
            
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def delete_task(db: Session, task_id: uuid.UUID) -> bool:
        db_task = TaskService.get_task(db, task_id)
        if not db_task:
            return False
        
        db.delete(db_task)
        db.commit()
        return True
