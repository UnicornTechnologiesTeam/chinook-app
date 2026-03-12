from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(prefix="/customers", tags=["customers"])

@router.get("/", response_model=List[schemas.CustomerBase])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@router.get("/{customer_id}/history", response_model=List[schemas.InvoiceDetail])
def get_history(customer_id: int, db: Session = Depends(get_db)):
    invoices = db.query(models.Invoice).filter(models.Invoice.CustomerId == customer_id).order_by(models.Invoice.InvoiceDate.desc()).all()
    result = []
    for inv in invoices:
        lines = []
        for line in inv.lines:
            lines.append(schemas.InvoiceLineDetail(TrackId=line.TrackId, track_name=line.track.Name, UnitPrice=line.UnitPrice))
        result.append(schemas.InvoiceDetail(InvoiceId=inv.InvoiceId, InvoiceDate=inv.InvoiceDate, Total=inv.Total, lines=lines))
    return result
