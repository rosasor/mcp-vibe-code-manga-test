from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import time
import os
from typing import List

from app.api import users, manga, library, reviews
from app.models import user, manga as manga_model, library as library_model, review as review_model
from app.db.database import engine, get_db

# Create database tables
user.Base.metadata.create_all(bind=engine)
manga_model.Base.metadata.create_all(bind=engine)
library_model.Base.metadata.create_all(bind=engine)
review_model.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="MangaList API",
    description="API for tracking and discovering manga",
    version="0.1.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Rate limiting middleware
@app.middleware("http")
async def add_rate_limit(request: Request, call_next):
    # Simple rate limiting by IP
    client_ip = request.client.host
    # In a real app, use Redis to track request counts
    
    response = await call_next(request)
    return response

# Add request processing time header middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include routers
app.include_router(users.router)
app.include_router(manga.router)
app.include_router(library.router)
app.include_router(reviews.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MangaList API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"} 