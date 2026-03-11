from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.routers import tracks, purchases, customers

load_dotenv()

app = FastAPI(title="Chinook Music Store API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tracks.router)
app.include_router(purchases.router)
app.include_router(customers.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
