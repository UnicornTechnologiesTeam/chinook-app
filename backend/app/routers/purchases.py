from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from datetime import datetime
from decimal import Decimal

router = APIRouter(prefix="/purchases", tags=["purchases"])

@router.post("/", response_model=schemas.PurchaseResponse)
def create_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(
        models.Customer.CustomerId == purchase.customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    tracks = []
    total = Decimal("0.00")
    for track_id in purchase.track_ids:
        track = db.query(models.Track).filter(models.Track.TrackId == track_id).first()
        if not track:
            raise HTTPException(status_code=404, detail=f"Track {track_id} not found")
        tracks.append(track)
        total += track.UnitPrice

    invoice = models.Invoice(
        CustomerId=purchase.customer_id,
        InvoiceDate=datetime.utcnow(),
        Total=total
    )
    db.add(invoice)
    db.flush()

    for track in tracks:
        line = models.InvoiceLine(
            InvoiceId=invoice.InvoiceId,
            TrackId=track.TrackId,
            UnitPrice=track.UnitPrice,
            Quantity=1
        )
        db.add(line)

    db.commit()
    db.refresh(invoice)

    return schemas.PurchaseResponse(
        InvoiceId=invoice.InvoiceId,
        Total=invoice.Total,
        InvoiceDate=invoice.InvoiceDate,
        tracks=[t.Name for t in tracks]
    )
