from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas, services
import uuid

router = APIRouter()

@router.post("", response_model=schemas.ContactResponse, status_code=201)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    return services.ContactService.create_contact(db, contact)

@router.get("", response_model=List[schemas.ContactResponse])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.ContactService.get_contacts(db, skip=skip, limit=limit)

@router.get("/{contact_id}", response_model=schemas.ContactResponse)
def read_contact(contact_id: str, db: Session = Depends(get_db)):
    contact = services.ContactService.get_contact(db, uuid.UUID(contact_id))
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.patch("/{contact_id}", response_model=schemas.ContactResponse)
def update_contact(contact_id: str, contact_data: schemas.ContactUpdate, db: Session = Depends(get_db)):
    updated_contact = services.ContactService.update_contact(db, uuid.UUID(contact_id), contact_data)
    if not updated_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return updated_contact

@router.delete("/{contact_id}")
def delete_contact(contact_id: str, db: Session = Depends(get_db)):
    success = services.ContactService.delete_contact(db, uuid.UUID(contact_id))
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"success": True}
