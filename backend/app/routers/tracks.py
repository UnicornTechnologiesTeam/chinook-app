from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app import models, schemas
from typing import List

router = APIRouter(prefix="/tracks", tags=["tracks"])

@router.get("/", response_model=List[schemas.TrackDetail])
def search_tracks(q: str = Query(None), skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(models.Track).join(models.Album).join(models.Artist).join(models.Genre)
    if q:
        query = query.filter(or_(models.Track.Name.ilike(f"%{q}%"), models.Artist.Name.ilike(f"%{q}%"), models.Genre.Name.ilike(f"%{q}%")))
    tracks = query.offset(skip).limit(limit).all()
    result = []
    for t in tracks:
        result.append(schemas.TrackDetail(TrackId=t.TrackId, Name=t.Name, UnitPrice=t.UnitPrice, artist_name=t.album.artist.Name if t.album else None, album_title=t.album.Title if t.album else None, genre_name=t.genre.Name if t.genre else None, Milliseconds=t.Milliseconds))
    return result

@router.get("/{track_id}", response_model=schemas.TrackDetail)
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(models.Track).filter(models.Track.TrackId == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return schemas.TrackDetail(TrackId=track.TrackId, Name=track.Name, UnitPrice=track.UnitPrice, artist_name=track.album.artist.Name if track.album else None, album_title=track.album.Title if track.album else None, genre_name=track.genre.Name if track.genre else None, Milliseconds=track.Milliseconds)
