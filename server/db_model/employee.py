from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import HTTPException
import pytz


# Create SQLAlchemy ORM model
Base = declarative_base()
est_timezone = pytz.timezone('US/Eastern')

class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True, index=True)
    db_create_time = Column(DateTime, default=datetime.now(est_timezone))
    db_modify_time = Column(DateTime, default=datetime.now(est_timezone))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    salary = Column(Float)

# Pydantic models for request and response
class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    salary: int

class EmployeeRead(EmployeeCreate):
    id: int
    db_create_time: datetime
    db_modify_time: datetime


def read(skip: int, limit: int, db: Session):
    employee = db.query(Employee).offset(skip).limit(limit).all()
    return employee


def read_by_id(employee_id: int, db: Session):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


def create(employeeCreate: EmployeeCreate, db: Session):
    db_employee = Employee(**employeeCreate.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def update(employee_id: int, updated_employee: EmployeeCreate, db: Session):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in updated_employee.dict().items():
        setattr(employee, key, value)
    db.commit()
    db.refresh(employee)
    return employee


def delete(employee_id: int, db: Session):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return employee