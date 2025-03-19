from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.models.user import User
from app.models.library import Library, StatusEnum
from app.models.manga import Manga
from app.schemas.library import LibraryEntryCreate, LibraryEntryUpdate, LibraryEntry, LibraryList
from app.services.auth import get_current_active_user

router = APIRouter(prefix="/api/library", tags=["library"])


@router.get("/", response_model=LibraryList)
def get_current_user_library(
    status: Optional[StatusEnum] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(Library).filter(Library.user_id == current_user.id)
    
    if status:
        query = query.filter(Library.status == status)
    
    # Join with manga to get manga details
    query = query.join(Manga)
    
    library_entries = query.order_by(Manga.title).all()
    return {"entries": library_entries}


@router.get("/{user_id}", response_model=LibraryList)
def get_user_library(
    user_id: int,
    status: Optional[StatusEnum] = None,
    db: Session = Depends(get_db)
):
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    query = db.query(Library).filter(Library.user_id == user_id)
    
    if status:
        query = query.filter(Library.status == status)
    
    # Join with manga to get manga details
    query = query.join(Manga)
    
    library_entries = query.order_by(Manga.title).all()
    return {"entries": library_entries}


@router.post("/", response_model=LibraryEntry, status_code=status.HTTP_201_CREATED)
def add_to_library(
    library_entry: LibraryEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if manga exists
    manga = db.query(Manga).filter(Manga.id == library_entry.manga_id).first()
    if not manga:
        raise HTTPException(status_code=404, detail="Manga not found")
    
    # Check if entry already exists
    existing_entry = db.query(Library).filter(
        Library.user_id == current_user.id,
        Library.manga_id == library_entry.manga_id
    ).first()
    
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Manga already in library"
        )
    
    # Create new library entry
    db_library_entry = Library(
        user_id=current_user.id,
        manga_id=library_entry.manga_id,
        status=library_entry.status,
        progress=library_entry.progress
    )
    
    db.add(db_library_entry)
    db.commit()
    db.refresh(db_library_entry)
    
    return db_library_entry


@router.put("/{manga_id}", response_model=LibraryEntry)
def update_library_entry(
    manga_id: int,
    library_update: LibraryEntryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if entry exists
    db_library_entry = db.query(Library).filter(
        Library.user_id == current_user.id,
        Library.manga_id == manga_id
    ).first()
    
    if not db_library_entry:
        raise HTTPException(status_code=404, detail="Library entry not found")
    
    # Update library entry
    update_data = library_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_library_entry, key, value)
    
    db.commit()
    db.refresh(db_library_entry)
    
    return db_library_entry


@router.delete("/{manga_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_library(
    manga_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if entry exists
    db_library_entry = db.query(Library).filter(
        Library.user_id == current_user.id,
        Library.manga_id == manga_id
    ).first()
    
    if not db_library_entry:
        raise HTTPException(status_code=404, detail="Library entry not found")
    
    # Delete entry
    db.delete(db_library_entry)
    db.commit()
    
    return None 