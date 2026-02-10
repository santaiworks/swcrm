from fastapi import APIRouter, Depends, Query
from typing import Optional, List

from sqlalchemy.orm import Session
from app.core.database import get_db
from .schemas import LeadCreate, LeadResponse
from .services import LeadService
import uuid

router = APIRouter()

@router.post("", status_code=201)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    db_lead = LeadService.create_lead(db, lead)
    return {"success": True, "id": str(db_lead.id)}

@router.get("", response_model=List[LeadResponse])
def read_leads(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return LeadService.get_leads(db, status=status)


@router.get("/deals", response_model=List[LeadResponse])
def read_deal_leads(db: Session = Depends(get_db)):
    return LeadService.get_deals_leads(db)

@router.get("/{lead_id}", response_model=LeadResponse)
def read_lead(lead_id: str, db: Session = Depends(get_db)):
    lead = LeadService.get_lead(db, uuid.UUID(lead_id))
    if not lead:
        return {"error": "Lead not found"}
    return lead

@router.patch("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: str, lead_data: dict, db: Session = Depends(get_db)):
    updated_lead = LeadService.update_lead(db, uuid.UUID(lead_id), lead_data)
    if not updated_lead:
        return {"error": "Lead not found"}
    return updated_lead

@router.delete("/{lead_id}")
def delete_lead(lead_id: str, db: Session = Depends(get_db)):
    success = LeadService.delete_lead(db, uuid.UUID(lead_id))
    if not success:
        return {"error": "Lead not found"}
    return {"success": True}

@router.patch("/{lead_id}/status")
def update_lead_status(lead_id: str, data: dict, db: Session = Depends(get_db)):
    status = data.get("status")
    if not status:
        return {"error": "Status is required"}
    updated_lead = LeadService.update_lead_status(db, uuid.UUID(lead_id), status)
    if not updated_lead:
        return {"error": "Lead not found"}
    return {"success": True, "status": updated_lead.status}

@router.post("/{lead_id}/convert")
def convert_lead(lead_id: str, data: dict, db: Session = Depends(get_db)):
    converted_lead = LeadService.convert_lead(db, uuid.UUID(lead_id), data)
    if not converted_lead:
        return {"error": "Lead not found"}
    return {"success": True, "lead_id": str(converted_lead.id), "status": converted_lead.status}
