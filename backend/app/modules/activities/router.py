from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .services import ActivityService

router = APIRouter()

@router.get("/{entity_type}/{entity_id}")
def read_activities(entity_type: str, entity_id: str, db: Session = Depends(get_db)):
    return ActivityService.get_activities(db, entity_type.upper(), entity_id)
