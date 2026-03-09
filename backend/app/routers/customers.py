from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(prefix="/customers", tags=["customers"])

@router.get("/", response_model=List[schemas.CustomerBase])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()
