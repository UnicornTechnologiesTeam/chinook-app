from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Artist(Base):
    __tablename__ = "Artist"
    ArtistId = Column(Integer, primary_key=True)
    Name = Column(String(120))
    albums = relationship("Album", back_populates="artist")

class Album(Base):
    __tablename__ = "Album"
    AlbumId = Column(Integer, primary_key=True)
    Title = Column(String(160))
    ArtistId = Column(Integer, ForeignKey("Artist.ArtistId"))
    artist = relationship("Artist", back_populates="albums")
    tracks = relationship("Track", back_populates="album")

class Genre(Base):
    __tablename__ = "Genre"
    GenreId = Column(Integer, primary_key=True)
    Name = Column(String(120))

class Track(Base):
    __tablename__ = "Track"
    TrackId = Column(Integer, primary_key=True)
    Name = Column(String(200))
    AlbumId = Column(Integer, ForeignKey("Album.AlbumId"))
    GenreId = Column(Integer, ForeignKey("Genre.GenreId"))
    UnitPrice = Column(Numeric(10, 2))
    Milliseconds = Column(Integer)
    album = relationship("Album", back_populates="tracks")
    genre = relationship("Genre")

class Customer(Base):
    __tablename__ = "Customer"
    CustomerId = Column(Integer, primary_key=True)
    FirstName = Column(String(40))
    LastName = Column(String(20))
    Email = Column(String(60))
    invoices = relationship("Invoice", back_populates="customer")

class Invoice(Base):
    __tablename__ = "Invoice"
    InvoiceId = Column(Integer, primary_key=True)
    CustomerId = Column(Integer, ForeignKey("Customer.CustomerId"))
    InvoiceDate = Column(DateTime)
    Total = Column(Numeric(10, 2))
    BillingAddress = Column(String(70), nullable=True)
    BillingCity = Column(String(40), nullable=True)
    BillingCountry = Column(String(40), nullable=True)
    BillingPostalCode = Column(String(10), nullable=True)
    customer = relationship("Customer", back_populates="invoices")
    lines = relationship("InvoiceLine", back_populates="invoice")

class InvoiceLine(Base):
    __tablename__ = "InvoiceLine"
    InvoiceLineId = Column(Integer, primary_key=True)
    InvoiceId = Column(Integer, ForeignKey("Invoice.InvoiceId"))
    TrackId = Column(Integer, ForeignKey("Track.TrackId"))
    UnitPrice = Column(Numeric(10, 2))
    Quantity = Column(Integer)
    invoice = relationship("Invoice", back_populates="lines")
    track = relationship("Track")