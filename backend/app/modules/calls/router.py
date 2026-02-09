from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from app.core.database import get_db
from . import schemas, services

router = APIRouter()

@router.post("/", response_model=schemas.CallResponse)
def create_call(call: schemas.CallCreate, db: Session = Depends(get_db)):
    return services.CallService.create_call(db=db, call=call)

@router.get("/", response_model=List[schemas.CallResponse])
def read_calls(
    skip: int = 0, 
    limit: int = 100, 
    entity_type: Optional[str] = None, 
    entity_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    if entity_type and entity_id:
        try:
            e_id = uuid.UUID(entity_id)
            return services.CallService.get_calls_by_entity(db, entity_type, e_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid entity_id")
            
    return services.CallService.get_calls(db, skip=skip, limit=limit)

@router.get("/{call_id}", response_model=schemas.CallResponse)
def read_call(call_id: uuid.UUID, db: Session = Depends(get_db)):
    db_call = services.CallService.get_call(db, call_id=call_id)
    if db_call is None:
        raise HTTPException(status_code=404, detail="Call not found")
    return db_call

@router.put("/{call_id}", response_model=schemas.CallResponse)
def update_call(call_id: uuid.UUID, call_update: schemas.CallUpdate, db: Session = Depends(get_db)):
    db_call = services.CallService.update_call(db, call_id=call_id, call_update=call_update)
    if db_call is None:
        raise HTTPException(status_code=404, detail="Call not found")
    return db_call

@router.delete("/{call_id}", response_model=schemas.CallResponse)
def delete_call(call_id: uuid.UUID, db: Session = Depends(get_db)):
    db_call = services.CallService.delete_call(db, call_id=call_id)
    if db_call is None:
        raise HTTPException(status_code=404, detail="Call not found")
    return db_call
