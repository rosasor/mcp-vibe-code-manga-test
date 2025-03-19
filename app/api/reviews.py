from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import desc, func

from app.db.database import get_db
from app.models.user import User
from app.models.review import Review, Like
from app.models.manga import Manga
from app.schemas.review import ReviewCreate, ReviewUpdate, Review as ReviewSchema, ReviewList
from app.services.auth import get_current_active_user, get_current_admin_user
from app.services import manga_service

router = APIRouter(tags=["reviews"])


@router.get("/api/manga/{manga_id}/reviews", response_model=ReviewList)
def get_manga_reviews(
    manga_id: int,
    sort_by: Optional[str] = Query("likes", enum=["likes", "newest"]),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    # Check if manga exists
    manga = db.query(Manga).filter(Manga.id == manga_id).first()
    if not manga:
        raise HTTPException(status_code=404, detail="Manga not found")
    
    # Query reviews for this manga
    query = db.query(Review).filter(Review.manga_id == manga_id)
    
    # Sort reviews
    if sort_by == "likes":
        query = query.order_by(desc(Review.likes), desc(Review.timestamp))
    elif sort_by == "newest":
        query = query.order_by(desc(Review.timestamp))
    
    # Count total matching records
    total = query.count()
    
    # Get paginated results
    reviews = query.offset(skip).limit(limit).all()
    
    return {"reviews": reviews, "total": total}


@router.post("/api/manga/{manga_id}/reviews", response_model=ReviewSchema, status_code=status.HTTP_201_CREATED)
def create_review(
    manga_id: int,
    review: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if manga exists
    manga = db.query(Manga).filter(Manga.id == manga_id).first()
    if not manga:
        raise HTTPException(status_code=404, detail="Manga not found")
    
    # Check if user already reviewed this manga
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.manga_id == manga_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this manga"
        )
    
    # Create new review
    db_review = Review(
        user_id=current_user.id,
        manga_id=manga_id,
        content=review.content,
        rating=review.rating,
        likes=0
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Update manga's average rating
    manga_service.update_manga_rating(db, manga_id)
    
    return db_review


@router.put("/api/reviews/{review_id}", response_model=ReviewSchema)
def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if review exists and belongs to current user
    db_review = db.query(Review).filter(Review.id == review_id).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if db_review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this review"
        )
    
    # Update review
    update_data = review_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_review, key, value)
    
    db.commit()
    db.refresh(db_review)
    
    # Update manga's average rating if rating changed
    if "rating" in update_data:
        manga_service.update_manga_rating(db, db_review.manga_id)
    
    return db_review


@router.delete("/api/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if review exists and belongs to current user
    db_review = db.query(Review).filter(Review.id == review_id).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if db_review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this review"
        )
    
    manga_id = db_review.manga_id
    
    # Delete all likes for this review
    db.query(Like).filter(Like.review_id == review_id).delete()
    
    # Delete review
    db.delete(db_review)
    db.commit()
    
    # Update manga's average rating
    manga_service.update_manga_rating(db, manga_id)
    
    return None


@router.post("/api/reviews/{review_id}/like", response_model=ReviewSchema)
def like_review(
    review_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if review exists
    db_review = db.query(Review).filter(Review.id == review_id).first()
    
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if user already liked this review
    existing_like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.review_id == review_id
    ).first()
    
    if existing_like:
        # Remove like
        db.delete(existing_like)
        db_review.likes -= 1
    else:
        # Add like
        db_like = Like(user_id=current_user.id, review_id=review_id)
        db.add(db_like)
        db_review.likes += 1
    
    db.commit()
    db.refresh(db_review)
    
    return db_review 