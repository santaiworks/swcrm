from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from . import schemas, services
import uuid

router = APIRouter()

@router.post("/", response_model=schemas.NoteResponse, status_code=201)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return services.NoteService.create_note(db=db, note=note)

@router.get("/", response_model=List[schemas.NoteResponse])
def read_notes(
    skip: int = 0, 
    limit: int = 100, 
    entity_type: Optional[str] = None, 
    entity_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if entity_type and entity_id:
        try:
            e_id = uuid.UUID(entity_id)
            return services.NoteService.get_notes_by_entity(db, entity_type, e_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid entity_id")
            
    return services.NoteService.get_notes(db, skip=skip, limit=limit)

@router.get("/{note_id}", response_model=schemas.NoteResponse)
def read_note(note_id: str, db: Session = Depends(get_db)):
    note = services.NoteService.get_note(db, uuid.UUID(note_id))
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.patch("/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: str, note_data: schemas.NoteUpdate, db: Session = Depends(get_db)):
    updated_note = services.NoteService.update_note(db, uuid.UUID(note_id), note_data)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note

@router.delete("/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    success = services.NoteService.delete_note(db, uuid.UUID(note_id))
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"success": True}
