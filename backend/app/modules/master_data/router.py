from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from .schemas import MasterDataCreate, MasterDataResponse
from .services import MasterDataService

router = APIRouter()

@router.get("/{table}", response_model=List[MasterDataResponse])
def read_master_data(table: str, query: Optional[str] = None, db: Session = Depends(get_db)):
    data = MasterDataService.get_all(db, table, query)
    if data is None:
        raise HTTPException(status_code=404, detail="Table not found")
    return data

@router.post("/{table}", response_model=MasterDataResponse)
def create_master_data(table: str, item: MasterDataCreate, db: Session = Depends(get_db)):
    data = MasterDataService.create(db, table, item)
    if data is None:
        raise HTTPException(status_code=404, detail="Table not found")
    return data
