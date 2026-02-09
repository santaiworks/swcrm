from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException

class EmployeeService:
    @staticmethod
    def create_employee(db: Session, employee_in: schemas.EmployeeCreate):
        db_employee = models.Employee(**employee_in.dict())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee

    @staticmethod
    def get_employee_by_user_id(db: Session, user_id: int):
        return db.query(models.Employee).filter(models.Employee.user_id == user_id).first()

    @staticmethod
    def update_employee(db: Session, user_id: int, employee_in: schemas.EmployeeUpdate):
        db_employee = db.query(models.Employee).filter(models.Employee.user_id == user_id).first()
        if not db_employee:
            raise HTTPException(status_code=404, detail="Employee record not found")
        
        update_data = employee_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_employee, field, value)
        
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee

    @staticmethod
    def delete_employee(db: Session, user_id: int):
        db_employee = db.query(models.Employee).filter(models.Employee.user_id == user_id).first()
        if db_employee:
            db.delete(db_employee)
            db.commit()
        return True
