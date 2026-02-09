from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas, services
import uuid

router = APIRouter()

@router.post("/send", response_model=schemas.EmailResponse)
def send_email(
    email: schemas.EmailCreate,
    db: Session = Depends(get_db)
):
    # Mock user
    email.sent_by = "System"
    return services.EmailService.send_email(db, email)

@router.get("/{entity_type}/{entity_id}", response_model=List[schemas.EmailResponse])
def get_emails(
    entity_type: str,
    entity_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    return services.EmailService.get_emails(db, entity_type, entity_id)
