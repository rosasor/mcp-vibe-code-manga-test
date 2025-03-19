from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.models.user import User
from app.services import manga_service
from app.schemas.manga import Manga, MangaCreate, MangaUpdate, MangaSearchResults
from app.services.auth import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/api/manga", tags=["manga"])


@router.get("/", response_model=MangaSearchResults)
def search_manga(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = "",
    min_rating: float = 0,
    tags: Optional[List[str]] = Query(None),
    year: Optional[int] = None,
    sort_by: str = 'popular',
    db: Session = Depends(get_db)
):
    manga_list, total = manga_service.search_manga(
        db, 
        search_term=search, 
        tags=tags, 
        year=year, 
        skip=skip, 
        limit=limit, 
        min_rating=min_rating,
        sort_by=sort_by
    )
    return {"results": manga_list, "total": total}


@router.get("/tags", response_model=List[str])
def get_all_tags(db: Session = Depends(get_db)):
    """Get all unique manga tags"""
    return manga_service.get_all_tags(db)


@router.get("/{manga_id}", response_model=Manga)
def get_manga(manga_id: int, db: Session = Depends(get_db)):
    db_manga = manga_service.get_manga(db, manga_id)
    if db_manga is None:
        raise HTTPException(status_code=404, detail="Manga not found")
    return db_manga


@router.post("/", response_model=Manga, status_code=status.HTTP_201_CREATED)
def create_manga(
    manga: MangaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Check if manga with this title already exists
    db_manga = manga_service.get_manga_by_title(db, manga.title)
    if db_manga:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Manga with this title already exists"
        )
    return manga_service.create_manga(db, manga)


@router.put("/{manga_id}", response_model=Manga)
def update_manga(
    manga_id: int,
    manga: MangaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_manga = manga_service.get_manga(db, manga_id)
    if db_manga is None:
        raise HTTPException(status_code=404, detail="Manga not found")
    
    # If updating title, check if new title already exists
    if manga.title and manga.title != db_manga.title:
        existing_manga = manga_service.get_manga_by_title(db, manga.title)
        if existing_manga:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Manga with this title already exists"
            )
    
    return manga_service.update_manga(db, manga_id, manga)


@router.delete("/{manga_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_manga(
    manga_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_manga = manga_service.get_manga(db, manga_id)
    if db_manga is None:
        raise HTTPException(status_code=404, detail="Manga not found")
    
    success = manga_service.delete_manga(db, manga_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete manga")
    
    return None 