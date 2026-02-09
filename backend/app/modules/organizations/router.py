from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas, services
import uuid

router = APIRouter()

@router.post("/", response_model=schemas.OrganizationResponse, status_code=201)
def create_organization(org: schemas.OrganizationCreate, db: Session = Depends(get_db)):
    # Check uniqueness if needed, skipping for now as per plan
    return services.OrganizationService.create_organization(db=db, org=org)

@router.get("/", response_model=List[schemas.OrganizationResponse])
def read_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.OrganizationService.get_organizations(db, skip=skip, limit=limit)

@router.get("/{org_id}", response_model=schemas.OrganizationResponse)
def read_organization(org_id: str, db: Session = Depends(get_db)):
    org = services.OrganizationService.get_organization(db, uuid.UUID(org_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.patch("/{org_id}", response_model=schemas.OrganizationResponse)
def update_organization(org_id: str, org_data: schemas.OrganizationUpdate, db: Session = Depends(get_db)):
    updated_org = services.OrganizationService.update_organization(db, uuid.UUID(org_id), org_data)
    if not updated_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return updated_org

@router.delete("/{org_id}")
def delete_organization(org_id: str, db: Session = Depends(get_db)):
    success = services.OrganizationService.delete_organization(db, uuid.UUID(org_id))
    if not success:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {"success": True}
