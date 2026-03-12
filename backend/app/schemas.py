from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class TrackDetail(BaseModel):
    TrackId: int
    Name: str
    UnitPrice: Decimal
    artist_name: Optional[str] = None
    album_title: Optional[str] = None
    genre_name: Optional[str] = None
    class Config:
        from_attributes = True

class PurchaseCreate(BaseModel):
    customer_id: int
    track_ids: List[int]

class PurchaseResponse(BaseModel):
    InvoiceId: int
    Total: Decimal
    InvoiceDate: datetime
    tracks: List[str]
    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    CustomerId: int
    FirstName: str
    LastName: str
    Email: str
    class Config:
        from_attributes = True