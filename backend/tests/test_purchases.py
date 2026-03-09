from app import models
from decimal import Decimal

def seed_data(db):
    artist = models.Artist(ArtistId=1, Name="Test Artist")
    album = models.Album(AlbumId=1, Title="Test Album", ArtistId=1)
    genre = models.Genre(GenreId=1, Name="Rock")
    track = models.Track(
        TrackId=1, Name="Test Song", AlbumId=1,
        GenreId=1, UnitPrice=Decimal("0.99"), Milliseconds=200000
    )
    customer = models.Customer(
        CustomerId=1, FirstName="John",
        LastName="Doe", Email="john@test.com"
    )
    db.add_all([artist, album, genre, track, customer])
    db.commit()

def test_create_purchase_success(client, db):
    seed_data(db)
    response = client.post("/purchases/", json={
        "customer_id": 1,
        "track_ids": [1]
    })
    assert response.status_code == 200
    data = response.json()
    assert "InvoiceId" in data
    assert float(data["Total"]) == 0.99

def test_create_purchase_invalid_customer(client, db):
    seed_data(db)
    response = client.post("/purchases/", json={
        "customer_id": 9999,
        "track_ids": [1]
    })
    assert response.status_code == 404

def test_create_purchase_invalid_track(client, db):
    seed_data(db)
    response = client.post("/purchases/", json={
        "customer_id": 1,
        "track_ids": [9999]
    })
    assert response.status_code == 404