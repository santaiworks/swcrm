from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth.dependencies import get_current_active_superuser
from . import schemas, services

router = APIRouter()

@router.post("/", response_model=schemas.EmployeeResponse)
def create_employee(
    *,
    db: Session = Depends(get_db),
    employee_in: schemas.EmployeeCreate,
    current_user = Depends(get_current_active_superuser)
):
    return services.EmployeeService.create_employee(db=db, employee_in=employee_in)

@router.get("/{user_id}", response_model=schemas.EmployeeResponse)
def get_employee(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)
):
    employee = services.EmployeeService.get_employee_by_user_id(db=db, user_id=user_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/{user_id}", response_model=schemas.EmployeeResponse)
def update_employee(
    user_id: int,
    employee_in: schemas.EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)
):
    return services.EmployeeService.update_employee(db=db, user_id=user_id, employee_in=employee_in)
