# main.py
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import configparser
from db_model import employee

# Create a ConfigParser instance and read the configuration file
config = configparser.ConfigParser()
config.read('server_config.cfg')

# Read the database credentials
db_username = config.get('ecapital_db', 'username')
db_password = config.get('ecapital_db', 'password')


DATABASE_URL = 'mysql+pymysql://root:@localhost/ecapital'
DATABASE_URL = f'mysql+pymysql://{db_username}:{db_password}@localhost/ecapital'


Base = declarative_base()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a FastAPI app
app = FastAPI()

# Create SQLAlchemy ORM model
Base = declarative_base()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===================== employee api =====================

# Create an employee (POST)
@app.post("/employee/", response_model=employee.EmployeeRead)
def create_employee(employeeCreate: employee.EmployeeCreate, db: Session = Depends(get_db)):
    return employee.create(employeeCreate, db)

# Read all employee (GET)
@app.get("/employee/", response_model=List[employee.EmployeeRead])
def read_employee(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return employee.read(skip, limit, db)

# Read an employee by ID (GET)
@app.get("/employee/{employee_id}", response_model=employee.EmployeeRead)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    return employee.read_by_id(employee_id, db)

# Update an employee by ID (PUT)
@app.put("/employee/{employee_id}", response_model=employee.EmployeeRead)
def update_employee(employee_id: int, updated_employee: employee.EmployeeCreate, db: Session = Depends(get_db)):
    return employee.update(employee_id, updated_employee, db)

# Delete an employee by ID (DELETE)
@app.delete("/employee/{employee_id}", response_model=employee.EmployeeRead)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    return employee.delete(employee_id, db)

