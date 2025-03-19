from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.user import User


class ReviewBase(BaseModel):
    content: str
    rating: int = Field(..., ge=1, le=5)  # Rating must be between 1 and 5


class ReviewCreate(ReviewBase):
    manga_id: int


class ReviewUpdate(BaseModel):
    content: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)


class ReviewInDB(ReviewBase):
    id: int
    user_id: int
    manga_id: int
    likes: int = 0
    timestamp: datetime

    class Config:
        from_attributes = True


class Review(ReviewInDB):
    """Review model returned to clients"""
    user: Optional[User] = None


class ReviewList(BaseModel):
    reviews: List[Review]
    total: int 